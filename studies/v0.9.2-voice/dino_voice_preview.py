import pathlib,json,subprocess,hashlib,math,bisect
from PIL import Image,ImageDraw
P=pathlib.Path(__file__).resolve().parent
manifest=json.loads((P/'DINO_v0.9.2_voice_manifest.json').read_text());v=manifest['voices']['A']
atlas=Image.open(P/'DINO_v0.9.1a_stable_poses.png').convert('RGB')
keys=['REST','MBP','AH','EE','OH','OO','FV','LTH']; sprites={k:atlas.crop((i%4*384,i//4*512,(i%4+1)*384,(i//4+1)*512)) for i,k in enumerate(keys)}
# Mouth approximations for eSpeak mnemonics, not a validated phonetic alignment.
mp={'h':'AH','@':'AH','l':'LTH','oU':'OH','aI':'AH','m':'MBP','d':'LTH','i:':'EE','n':'LTH','r':'OH','E':'EE','i':'EE','f':'FV','3':'OH','r-':'OH','a#':'AH','v':'FV','tS':'EE'}
lead=.35;tail=.5; fps=24;total=math.ceil((lead+v['duration']+tail)*fps); times=[e['ms'] for e in v['events']]; frames=[]; records=[]
for i in range(total):
 t=i/fps-lead; j=bisect.bisect_right(times,t*1000)-1
 ph=v['events'][j]['phoneme'] if 0<=t<v['duration'] and j>=0 else '_'
 pose=mp.get(ph,'REST'); im=sprites[pose];frames.append(im);records.append({'frame':i,'phoneme':ph,'pose':pose})
assert frames[0].tobytes()==frames[-1].tobytes();assert len(set(r['pose'] for r in records))>=6
# Render actual full frames; no interpolation. Delay original WAV by the same lead.
out=P/'DINO_voice_A_talking_preview.mp4';cmd=['ffmpeg','-y','-loglevel','error','-f','rawvideo','-pix_fmt','rgb24','-s','384x512','-r',str(fps),'-i','pipe:0','-i',str(P/'DINO_voice_A.wav'),'-af','adelay=350,apad','-c:v','libx264','-pix_fmt','yuv420p','-crf','19','-c:a','aac','-b:a','96k','-t',str(total/fps),'-movflags','+faststart',str(out)];subprocess.run(cmd,input=b''.join(im.tobytes() for im in frames),check=True)
board=Image.new('RGB',(6*192,2*286),'white'); d=ImageDraw.Draw(board);chosen=[0]+[next(i for i,r in enumerate(records) if r['pose']==k) for k in keys if k!='REST' and any(r['pose']==k for r in records)]+[total-1];
for k,i in enumerate(chosen):
 x=k%6*192;y=k//6*286;board.paste(frames[i].resize((192,256)),(x,y));d.text((x+4,y+260),f"{i/fps:.2f}s {records[i]['pose']}",fill='black')
board.save(P/'DINO_voice_A_contact.png');manifest['preview']={'fps':fps,'frames':total,'seconds':total/fps,'lead':lead,'voice':'A','mapping':mp,'timeline':records,'sha256':hashlib.sha256(out.read_bytes()).hexdigest(),'limitations':'coarse viseme mapping; no acoustic forced alignment or listener validation; static body; noncanonical artwork'};(P/'DINO_v0.9.2_voice_manifest.json').write_text(json.dumps(manifest,indent=2));print(total,total/fps, sorted(set(r['pose'] for r in records)))