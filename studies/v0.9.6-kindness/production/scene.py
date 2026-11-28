"""Build one prerecorded kindness performance from unchanged selected-voice PCM."""
from pathlib import Path
import json,wave,hashlib,math,subprocess,textwrap,re,struct
import numpy as np
from PIL import Image,ImageDraw,ImageFont
P=Path(__file__).resolve().parents[1];spec=json.loads((P/'spec.json').read_text());voice=spec['voices'][0];rate=24000;fps=24
for d in ['media','evidence']:(P/d).mkdir(exist_ok=True)
sha=lambda b:hashlib.sha256(b).hexdigest();audio=[np.zeros(9600,dtype='<i2')];offset=9600;events=[];captions=[];chapters=[];validation=[]
for i,(label,text) in enumerate(spec['lines'],1):
 key=f'{voice}-{i}';f=P/'audio'/f'{key}.wav';m=json.loads((P/'timing'/f'{key}.json').read_text());b=f.read_bytes();assert sha(b)==m['wavSha256'];assert struct.unpack_from('<I',b,4)[0]==len(b)-8
 with wave.open(str(f)) as w:
  assert (w.getnchannels(),w.getsampwidth(),w.getframerate())==(1,2,rate)
  a=np.frombuffer(w.readframes(w.getnframes()),'<i2').copy()
 duration=len(a)/rate;start=offset/rate;assert abs(duration*1000-m['durationMs'])<.001
 assert all(0<=c['start']<=c['start']+c['duration']<=duration*1000+1 for c in m['cues'])
 assert m['recipe']=={'am_fenrir':.7,'am_michael':.3};assert sha(a.tobytes())==m['pcmSha256']
 validation.append({'key':key,'duration':duration,'samples':len(a),'peak':int(abs(a.astype(float)).max()),'clippedSamples':int((abs(a.astype(float))>=32767).sum()),'cues':len(m['cues']),'sha256':sha(b)})
 events.extend({**c,'start':start+c['start']/1000,'duration':c['duration']/1000} for c in m['cues']);chapters.append({'label':label,'start':start,'end':start+duration,'text':text,'source':f'audio/{key}.wav','sourceSha256':sha(b),'pcmSampleStart':offset,'pcmSamples':len(a)})
 raw=m['raw'];words=raw['words'];group=[];first=0
 for j,word in enumerate(words):
  if not group:first=j
  group.append(word.strip());last=j==len(words)-1
  if re.search(r'[.!?][\s"\u201d]*$',word) or len(' '.join(group))>78 or last:
   cstart=start+raw['wtimes'][first]/1000;end=start+(raw['wtimes'][j]+raw['wdurations'][j])/1000
   captions.append({'start':max(start,cstart-.08),'end':min(start+duration,end+.12),'text':' '.join(group)});group=[]
 audio.append(a);offset+=len(a);gap=9600 if i<len(spec['lines']) else 24000;audio.append(np.zeros(gap,dtype='<i2'));offset+=gap
joined=np.concatenate(audio);wav=P/'media/kindness.wav'
with wave.open(str(wav),'wb') as w:w.setparams((1,2,rate,0,'NONE','not compressed'));w.writeframes(joined.tobytes())
for c in chapters:
 original=np.frombuffer((P/c['source']).read_bytes()[44:],'<i2');assert np.array_equal(original,joined[c['pcmSampleStart']:c['pcmSampleStart']+c['pcmSamples']])
subprocess.run(['ffmpeg','-y','-v','error','-i',str(wav),'-codec:a','libmp3lame','-q:a','2',str(P/'media/kindness.mp3')],check=True)
def stamp(t):
 ms=round(t*1000);h,ms=divmod(ms,3600000);m,ms=divmod(ms,60000);s,ms=divmod(ms,1000);return f'{h:02}:{m:02}:{s:02}.{ms:03}'
for j,c in enumerate(captions[:-1]):c['end']=min(c['end'],captions[j+1]['start'])
assert all(c['start']<c['end'] for c in captions)
(P/'media/captions.vtt').write_text('WEBVTT\n\n'+'\n\n'.join(f'{stamp(c["start"])} --> {stamp(c["end"])}\n{c["text"]}' for c in captions)+'\n')
atlasfile=P.parent/'v0.9.2-voice/DINO_v0.9.1a_stable_poses.png';atlas=Image.open(atlasfile).convert('RGB');sprites=[atlas.crop((i%4*384,i//4*512,i%4*384+384,i//4*512+512)) for i in range(8)]
fontroot='/usr/share/fonts/truetype/dejavu/';font=ImageFont.truetype(fontroot+'DejaVuSans.ttf',23);small=ImageFont.truetype(fontroot+'DejaVuSans.ttf',15);title=ImageFont.truetype(fontroot+'DejaVuSans-Bold.ttf',26)
W,H=540,800;count=math.ceil(len(joined)/rate*fps);out=P/'media/kindness.mp4';cmd=['ffmpeg','-y','-v','error','-f','rawvideo','-pix_fmt','rgb24','-s',f'{W}x{H}','-r',str(fps),'-i','pipe:0','-i',str(wav),'-c:v','libx264','-pix_fmt','yuv420p','-crf','19','-c:a','aac','-b:a','128k','-af','apad','-t',str(count/fps),'-movflags','+faststart',str(out)];proc=subprocess.Popen(cmd,stdin=subprocess.PIPE);samples=[];firstframe=None;lastframe=None;timeline=[]
for i in range(count):
 t=i/fps;cue=next((c for c in reversed(events) if c['start']<=t<c['start']+c['duration']),None);pose=cue['pose'] if cue else 0
 im=Image.new('RGB',(W,H),'#ffffff');d=ImageDraw.Draw(im);d.rectangle((0,0,W,92),fill='#eff2e7');d.text((W/2,22),'D I N O',font=small,fill='#527257',anchor='mm');d.text((W/2,58),'Make room for everyone',font=title,fill='#183e33',anchor='mm');im.paste(sprites[pose],(78,110))
 d.rounded_rectangle((22,650,518,780),radius=20,fill='#183e33');cap=next((c for c in reversed(captions) if c['start']<=t<c['end']),None)
 text=cap['text'] if cap else ('You matter. They matter too.' if t>len(joined)/rate-1.1 else 'A little kindness goes a long way.')
 lines=textwrap.wrap(text,36);lineheight=31;y=715-(len(lines)-1)*lineheight/2
 for line in lines:d.text((W/2,y),line,font=font,fill='#fffdf5',anchor='mm');y+=lineheight
 proc.stdin.write(im.tobytes());timeline.append({'frame':i,'pose':pose});crop=im.crop((78,110,462,622)).tobytes()
 if firstframe is None:firstframe=crop;im.save(P/'media/poster.jpg',quality=92)
 lastframe=crop
 if i%max(1,count//12)==0:samples.append((im.copy(),t,pose))
proc.stdin.close();assert proc.wait()==0;assert firstframe==lastframe==sprites[0].tobytes()
board=Image.new('RGB',(6*270,2*425),'white');d=ImageDraw.Draw(board)
for j,(im,t,pose) in enumerate(samples[:12]):x=j%6*270;y=j//6*425;board.paste(im.resize((270,400)),(x,y));d.text((x+5,y+403),f'{t:.2f}s pose{pose}',fill='black')
board.save(P/'evidence/contact.jpg',quality=93)
for media in list((P/'audio').glob('*.wav'))+[wav,P/'media/kindness.mp3',out]:subprocess.run(['ffmpeg','-v','error','-i',str(media),'-f','null','-'],check=True)
manifest={'version':'v0.9.6','title':spec['title'],'voiceVersion':'DINO-voice-1.0','voice':voice,'recipe':spec['voiceRecipes'][voice],'styleBank':'../v0.9.5-mentor/production/voices/'+voice+'.bin','styleBankSha256':'6ab7a8eea45135d560b9bbd53a3f2c3a02caa3603c997137061d3d8149b4122e','model':spec['model'],'modelRevision':spec['modelRevision'],'speed':1,'audioDuration':len(joined)/rate,'videoDuration':count/fps,'fps':fps,'frames':count,'sampleRate':rate,'chapters':chapters,'cues':events,'captions':captions,'atlas':'../'+str(atlasfile.relative_to(P.parent)),'atlasSha256':sha(atlasfile.read_bytes()),'status':'final voice acceptance scene; artistic review pending','limitations':'Model-predicted timing; coarse eight-pose speech with unchanged welcoming study expression/static body; no emotion conditioning or agent auditory assessment.'};(P/'performance.json').write_text(json.dumps(manifest,indent=2));(P/'evidence/validation.json').write_text(json.dumps({'parts':validation,'masterSha256':sha(wav.read_bytes()),'mp4Sha256':sha(out.read_bytes()),'PCMChunksPreservedExactly':True,'decode':'All original WAV chunks, master WAV/MP3 and MP4 decoded with FFmpeg','neutralRecovery':True,'frames':count,'timingBounds':'passed for all source cues; combined offsets derive from exact PCM sample counts','auditoryAssessment':'not performed; no invented artistic scores','timeline':timeline},indent=2));print('Rendered',count,'frames',count/fps,'seconds; clipping',sum(v['clippedSamples'] for v in validation),flush=True)
