"""Extract authored whole-body poses, register by contact/hip estimates, render study.
Run: python releases/v0.7.3/build.py
Requires Pillow, NumPy, OpenCV, FFmpeg. No inference or GPU for reproduction.
"""
from pathlib import Path
from PIL import Image,ImageDraw
import cv2,numpy as np,json,hashlib,subprocess
R=Path(__file__).resolve().parent;W,H,G=640,576,532
sources=['stand-to-seat.png','seat-to-sleep.png','sleep-to-seat.png']
# Estimated anatomical hip x in each 512x512 source cell. Whole-character translation only.
# Native scale retained, no independent body-part transformations.
hips=[[263,265,268,258,250,258],[258,260,260,248,244,219],[227,222,251,246,253,253]]
frames=[];records=[]
for s,filename in enumerate(sources):
 im=np.array(Image.open(R/'sources'/filename).convert('RGBA'));assert im.shape[:2]==(1024,1536)
 for k in range(6):
  x=k%3*512;y=k//3*512;p=im[y:y+512,x:x+512].copy()
  n,lab,stats,_=cv2.connectedComponentsWithStats((p[:,:,3]>=128).astype('uint8'));i=1+int(np.argmax(stats[1:,4]));mask=cv2.dilate((lab==i).astype('uint8'),np.ones((5,5),np.uint8));p[:,:,3]*=mask;p[p[:,:,3]==0,:3]=0
  yy,xx=np.where(p[:,:,3]>=128);bottom=int(yy.max());dx=288-hips[s][k];dy=G-bottom
  canvas=Image.new('RGBA',(W,H));canvas.paste(Image.fromarray(p),(dx,dy));a=np.array(canvas);frames.append(a)
  records.append({'index':len(frames)-1,'source':filename,'cell':k,'hipXEstimate':hips[s][k],'translation':[dx,dy],'scale':1,'alphaBounds':[int(xx.min()),int(yy.min()),int(xx.max()),bottom]})
atlas=Image.new('RGBA',(W*6,H*3))
for i,a in enumerate(frames):atlas.paste(Image.fromarray(a),(i%6*W,i//6*H))
atlas.save(R/'poses.webp',lossless=True,method=4,exact=True)
# Explicitly authored poses only. No generated or blended in-between textures.
entries=[]
def add(i,seconds,label,breath=False):entries.append({'index':i,'seconds':seconds,'label':label,'breath':breath})
for i,sec,label in [(0,.9,'Standing'),(1,.24,'Anticipation'),(2,.18,'Knee bend'),(3,.18,'Lower squat'),(4,.2,'Seat contact'),(5,.35,'Settling')]:add(i,sec,label)
for i,sec,label in [(6,.6,'Seated rest'),(7,.3,'Drowsiness'),(8,.28,'Hands contact'),(9,.28,'Forelimb support'),(10,.32,'Lowering'),(11,2.8,'Curled sleep')]:add(i,sec,label,i==11)
# Source 12 is a new sheet boundary: keep it visible for comparison, do not hide pose drift.
for i,sec,label in [(12,.3,'Waking stir'),(13,.3,'Chin lift'),(14,.32,'Sleepy head lift'),(15,.3,'Forelimb push'),(16,.3,'Seated support'),(17,.5,'Seated recovery')]:add(i,sec,label)
for i,sec,label in [(5,.22,'Recover balance'),(4,.2,'Prepare to rise'),(3,.18,'Rising'),(2,.18,'Knee extension'),(1,.2,'Standing recovery'),(0,.8,'Standing')]:add(i,sec,label)
m={'version':'v0.7.3','status':'authored-pose staging study; not approved or final','character':'DINO-001','cell':[W,H],'columns':6,'floor':G,'frames':records,'timeline':entries,'sources':{f:hashlib.sha256((R/'sources'/f).read_bytes()).hexdigest() for f in sources},'method':'complete authored source poses; whole-body integer translation; no texture morph or crossfade','limitations':['Stepped pose progression','Estimated horizontal hip registration is not a measured foot lock','Cross-sheet identity and outfit drift','Standing recovery reverses sit poses','Sleep breathing is subtle whole-image scale about baseline, not authored chest articulation','Owner approval required']}
(R/'manifest.json').write_text(json.dumps(m,indent=2)+'\n')
(R/'timeline.js').write_text('window.DINO_STUDY='+json.dumps(m)+';\n')
# Render the same deterministic atlas frames as the viewer. This is an offline render, not browser evidence.
# Whole-image breathing is pinned to the fixed floor and uses no separate limbs or feature layers.
def render(index,u,breath):
 im=Image.fromarray(frames[index]);b=Image.new('RGBA',(W,H),'#f5f3eb')
 if breath:
  amp=np.sin(u*2*np.pi/2.8)**2;sx=1+.002*amp;sy=1+.004*amp
  im=im.transform((W,H),Image.Transform.AFFINE,(1/sx,0,288*(1-1/sx),0,1/sy,G*(1-1/sy)),resample=Image.Resampling.BICUBIC)
 b.alpha_composite(im);return b.convert('RGB')
fps=24;total=sum(e['seconds'] for e in entries);N=round(total*fps)
p=subprocess.Popen(['ffmpeg','-y','-loglevel','error','-f','rawvideo','-pixel_format','rgb24','-video_size',f'{W}x{H}','-framerate',str(fps),'-i','-','-c:v','libx264','-crf','18','-pix_fmt','yuv420p','-movflags','+faststart',str(R/'evidence/rest-preview.mp4')],stdin=subprocess.PIPE)
for k in range(N):
 t=k/fps;start=0
 for e in entries:
  if t<start+e['seconds']:break
  start+=e['seconds']
 p.stdin.write(render(e['index'],t-start,e['breath']).tobytes())
p.stdin.close();assert p.wait()==0
sheet=Image.new('RGB',(6*320,3*308),'#f5f3eb');d=ImageDraw.Draw(sheet)
for i in range(18):sheet.paste(render(i,0,False).resize((320,288)),(i%6*320,i//6*308));d.text((i%6*320+8,i//6*308+289),str(i),fill='#213c31')
sheet.save(R/'evidence/contact.jpg',quality=94)
checks=[]
for i,a in enumerate(frames):
 mask=(a[:,:,3]>=128).astype('uint8');n,_,stats,_=cv2.connectedComponentsWithStats(mask);yy,xx=np.where(mask);checks.append({'index':i,'bottom':int(yy.max()),'componentsAbove64':int((stats[1:,4]>64).sum()),'clipped':bool(xx.min()==0 or xx.max()==W-1 or yy.min()==0 or yy.max()==H-1)})
(R/'validation.json').write_text(json.dumps({'kind':'offline source atlas checks; browser controls separately tested','duration':total,'fps':fps,'videoFrames':N,'checks':checks,'firstLastSameSource':entries[0]['index']==entries[-1]['index'],'hashes':{str(p.relative_to(R)):hashlib.sha256(p.read_bytes()).hexdigest() for p in [R/'poses.webp',R/'evidence/rest-preview.mp4',R/'evidence/contact.jpg']}},indent=2)+'\n')
print('Rendered',N,'frames,',total,'seconds. Checks',checks)
