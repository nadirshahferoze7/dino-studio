"""Validate masters, encode playback copies, render all five lines per voice."""
from pathlib import Path
import json,hashlib,wave,math,subprocess,textwrap,io,struct
import numpy as np
from PIL import Image,ImageDraw,ImageFont
P=Path(__file__).resolve().parents[1];spec=json.loads((P/'spec.json').read_text());fps=24
atlas_path=P.parent/'v0.9.2-voice/DINO_v0.9.1a_stable_poses.png'
atlas=Image.open(atlas_path).convert('RGB');sprites=[atlas.crop((i%4*384,i//4*512,i%4*384+384,i//4*512+512)) for i in range(8)]
fontpath='/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf';font=ImageFont.truetype(fontpath,16);title=ImageFont.truetype(fontpath,21)
sha=lambda b:hashlib.sha256(b).hexdigest();reports=[];clips=[];(P/'previews').mkdir(exist_ok=True)
for voice in spec['voices']:
 audio=[];events=[];chapters=[];offset=0
 for i,(intention,text) in enumerate(spec['lines'],1):
  key=f'{voice}-{i}';wav=P/'audio'/f'{key}.wav';meta=json.loads((P/'timing'/f'{key}.json').read_text())
  original=wav.read_bytes(); fixed=original; master=wav; assert struct.unpack_from('<I',original,4)[0]==len(original)-8
  with wave.open(io.BytesIO(fixed)) as w:
   assert (w.getnchannels(),w.getsampwidth(),w.getframerate())==(1,2,24000)
   raw=w.readframes(w.getnframes());a=np.frombuffer(raw,'<i2');duration=len(a)/24000
  assert sha(wav.read_bytes())==meta['wavSha256'];assert abs(meta['durationMs']-duration*1000)<.001
  assert len(meta['cues'])==len(meta['raw']['phonemes'])>0
  assert all(0<=c['start']<=c['start']+c['duration']<=duration*1000+1 for c in meta['cues'])
  assert all(c['start']<=meta['cues'][j+1]['start'] for j,c in enumerate(meta['cues'][:-1]))
  report={'key':key,'duration':duration,'sampleRate':24000,'samples':len(a),'peak':int(abs(a.astype(float)).max()),'rms':float(np.sqrt(np.mean(a.astype(float)**2))),'clippedSamples':int((abs(a.astype(float))>=32767).sum()),'cues':len(meta['cues']),'wavSha256':sha(wav.read_bytes()),'masterSha256':sha(fixed),'originalRiffSize':struct.unpack_from('<I',original,4)[0],'correctRiffSize':len(original)-8};assert report['rms']>100;assert report['clippedSamples']/len(a)<.001
  mp3=P/'audio'/f'{key}.mp3';subprocess.run(['ffmpeg','-y','-v','error','-i',str(master),'-codec:a','libmp3lame','-q:a','2',str(mp3)],check=True)
  for media in [wav,mp3]:subprocess.run(['ffmpeg','-v','error','-i',str(media),'-f','null','-'],check=True)
  report['decode']='WAV and MP3 passed FFmpeg';reports.append(report)
  clips.append({'key':key,'voice':voice,'line':i-1,'intention':intention,'text':text,'duration':duration,'wav':f'audio/{key}.wav','mp3':f'audio/{key}.mp3','timing':f'timing/{key}.json'})
  # 0.35s neutral lead, exact WAV samples, 0.5s neutral recovery per line.
  lead=8400;tail=12000;start=offset/24000;audio.extend([np.zeros(lead,dtype='<i2'),a,np.zeros(tail,dtype='<i2')]);
  chapters.append({'start':start,'end':start+(lead+len(a)+tail)/24000,'intention':intention,'text':text})
  events.extend({**c,'start':c['start']/1000+start+.35,'duration':c['duration']/1000} for c in meta['cues']);offset+=lead+len(a)+tail
 joined=np.concatenate(audio);temp=Path('/tmp')/f'dino-{voice}.wav'
 with wave.open(str(temp),'wb') as w:w.setparams((1,2,24000,0,'NONE','not compressed'));w.writeframes(joined.tobytes())
 count=math.ceil(len(joined)/24000*fps);out=P/'previews'/f'{voice}.mp4'
 cmd=['ffmpeg','-y','-v','error','-f','rawvideo','-pix_fmt','rgb24','-s','480x640','-r',str(fps),'-i','pipe:0','-i',str(temp),'-c:v','libx264','-crf','20','-pix_fmt','yuv420p','-c:a','aac','-b:a','128k','-af','apad','-t',str(count/fps),'-movflags','+faststart',str(out)]
 proc=subprocess.Popen(cmd,stdin=subprocess.PIPE);samples=[];timeline=[];firstframe=None;lastframe=None
 for f in range(count):
  t=f/fps;cue=next((c for c in reversed(events) if c['start']<=t<c['start']+c['duration']),None);pose=cue['pose'] if cue else 0
  ch=next((c for c in chapters if c['start']<=t<c['end']),chapters[-1]);im=Image.new('RGB',(480,640),'#faf8f1');im.paste(sprites[pose],(48,58));d=ImageDraw.Draw(im);d.text((24,8),spec['voiceLabels'][voice],font=title,fill='#234b3b');d.text((24,36),ch['intention'],font=font,fill='#234b3b')
  for j,line in enumerate(textwrap.wrap(ch['text'],45)):d.text((24,578+j*22),line,font=font,fill='#234b3b')
  proc.stdin.write(im.tobytes());timeline.append({'frame':f,'time':t,'pose':pose})
  if firstframe is None:firstframe=im.crop((48,58,432,570)).tobytes()
  lastframe=im.crop((48,58,432,570)).tobytes()
  if f%max(1,count//12)==0:samples.append((im.copy(),t,pose))
 proc.stdin.close();assert proc.wait()==0;assert firstframe==lastframe==sprites[0].tobytes()
 subprocess.run(['ffmpeg','-v','error','-i',str(out),'-f','null','-'],check=True)
 board=Image.new('RGB',(6*240,2*344),'white');d=ImageDraw.Draw(board)
 for j,(im,t,pose) in enumerate(samples[:12]):x=j%6*240;y=j//6*344;board.paste(im.resize((240,320)),(x,y));d.text((x+4,y+322),f'{t:.2f}s pose {pose}',fill='black')
 board.save(P/'evidence'/f'{voice}-contact.jpg',quality=93)
 (P/'evidence'/f'{voice}-render.json').write_text(json.dumps({'fps':fps,'frames':count,'duration':count/fps,'neutralRecovery':True,'previewSha256':sha(out.read_bytes()),'chapters':chapters,'timeline':timeline},indent=2))
 print(voice,count,'frames',out.stat().st_size,'bytes',flush=True)
(P/'manifest.json').write_text(json.dumps({'version':'v0.9.5','status':'audition; no permanent voice approved','clips':clips,'previews':{v:f'previews/{v}.mp4' for v in spec['voices']},'atlas':'../v0.9.2-voice/DINO_v0.9.1a_stable_poses.png','atlasSha256':sha(atlas_path.read_bytes()),'sampleRate':24000,'engine':'HeadTTS 1.3.0','model':spec['model'],'modelRevision':spec['modelRevision'],'speed':1},indent=2))
(P/'evidence/audio-validation.json').write_text(json.dumps({'firstGate':'am_fenrir-1 passed before remaining controlled batch','clips':reports,'listeningAssessment':'Not performed: no audio-listening facility available to this agent. No artistic scores assigned.','limitations':'Predicted token timing, not acoustic forced alignment. Equal-speed punctuation-driven readings, no emotion conditioning. Eight coarse mouth poses; static body and existing noncanonical speech study artwork.'},indent=2))
