"""Extract curated whole-body poses from the exact v0.7 floor source. No separate body warps."""
from pathlib import Path
import cv2,numpy as np,json,hashlib,sys
from PIL import Image,ImageDraw
r=Path(sys.argv[2]) if len(sys.argv)>2 else Path(__file__).resolve().parent/'release';r.mkdir(parents=True,exist_ok=True)
p=Path(sys.argv[1]) if len(sys.argv)>1 else Path('/mnt/data/a_polished_high_resolution_2d_cartoon_sprite_shee.png')
im=np.array(Image.open(p).convert('RGB'));hsv=cv2.cvtColor(im,cv2.COLOR_RGB2HSV);frames=[];bounds=[]
for top,bot in [(52,175),(202,320),(350,438),(474,559),(592,689)]:
 m=(hsv[top:bot,:,1]>75).astype('uint8');m[:,:180]=0;n,l,s,c=cv2.connectedComponentsWithStats(m);ids=sorted([i for i in range(1,n) if s[i,4]>220],key=lambda i:s[i,0])
 for i in ids:
  x,y,w,h,_=map(int,s[i]);x0=max(0,x-4);x1=min(im.shape[1],x+w+4);y0=max(top,top+y-4);y1=min(bot,top+y+h+4);rgb=im[y0:y1,x0:x1].copy();ma=(l[y0-top:y1-top,x0:x1]==i).astype('uint8');ma=cv2.morphologyEx(ma,cv2.MORPH_CLOSE,np.ones((3,3),np.uint8));cs,_=cv2.findContours(ma,cv2.RETR_EXTERNAL,cv2.CHAIN_APPROX_SIMPLE);ma[:]=0;cv2.drawContours(ma,[max(cs,key=cv2.contourArea)],0,255,-1);ma=cv2.GaussianBlur(ma,(3,3),.55);frames.append(np.dstack([rgb,ma]));bounds.append([x0,y0,x1,y1])
assert len(frames)==48
# source id, measured approximate head width, satchel/hip x, role, exposure seconds
# Hand-inspected estimates in native source pixels; these are registration guides, not approved measurements.
poses=[(1,61,59,'Standing',.55),(2,62,60,'Anticipation',.17),(3,61,58,'Bend',.18),(6,60,54,'Lower hips',.18),(9,67,58,'Seated',.65),(10,65,57,'Drowsy',.25),(12,65,57,'Heavy lids',.25),(13,61,52,'Lean',.18),(14,60,52,'Lower chest',.18),(15,59,53,'Reach',.18),(16,60,55,'Settle on ground',.25),(17,61,54,'Curled sleep',1.15),(18,61,54,'Sleep breath',.7),(20,61,54,'Sleep hold',.7),(24,62,54,'Sleep hold',.7),(27,55,43,'Stir',.35),(28,55,43,'Head lift',.23),(29,54,43,'Wake',.21),(30,52,43,'Push up',.23),(33,50,43,'Recover',.22),(34,51,42,'Sit recovery',.35),(36,51,44,'Awake seated',.45),(43,50,45,'Rise',.22),(44,50,46,'Straighten',.19),(45,50,47,'Extend',.19),(46,50,48,'Balance',.19),(47,50,49,'Standing recovery',.18),(48,50,48,'Standing recovery',.18)]
W,H,G=288,256,224;target=94;hip=116;out=[];meta=[]
for k,(i,head,anchor,label,dt) in enumerate(poses):
 a=frames[i-1];yy,xx=np.where(a[:,:,3]>=128);s=target/head;M=np.array([[s,0,hip-anchor*s],[0,s,G-int(yy.max())*s]],np.float32)
 q=a.astype(np.float32)/255;q[:,:,:3]*=q[:,:,3:4];q=cv2.warpAffine(q,M,(W,H),flags=cv2.INTER_LINEAR,borderMode=cv2.BORDER_CONSTANT);q[:,:,:3]/=np.maximum(q[:,:,3:4],1e-6);q=np.clip(q*255+.5,0,255).astype('uint8');q[q[:,:,3]<10]=0;d=G-int(np.where(q[:,:,3]>=128)[0].max());q=np.roll(q,d,axis=0) if d else q
 y,x=np.where(q[:,:,3]>=128);n,l,st,c=cv2.connectedComponentsWithStats((q[:,:,3]>=128).astype('uint8'));meta.append(dict(index=k,sourceFrame=i,label=label,seconds=dt,sourceCrop=bounds[i-1],headWidthEstimate=head,hipXEstimate=anchor,scale=round(s,6),bounds=[int(x.min()),int(y.min()),int(x.max()),int(y.max())],components=int((st[1:,4]>16).sum()),floor=int(y.max())));out.append(q)
 # no optical-flow interpolation, preserve original pixels (uniform whole-character resample only)
C=7;atlas=Image.new('RGBA',(W*C,H*((len(out)+C-1)//C)))
for i,q in enumerate(out):atlas.paste(Image.fromarray(q),(i%C*W,i//C*H))
atlas.save(r/'curated.webp',quality=88,method=6,exact=True)
# 5 anchors, 12 unique gold source poses, return same exact first frame
anchors=[0,4,8,11,18];gold=[0,1,2,4,6,9,11,15,17,19,21,24,0]
manifest={'version':'v0.7.1','character':'DINO-001','status':'review candidate; not approved identity','source':{'path':'../v0.7/sources/a_polished_high_resolution_2d_cartoon_sprite_shee.png','sha256':hashlib.sha256(p.read_bytes()).hexdigest(),'sourceFrames':48,'sourceQuality':'illustrated concept; not newly drawn high-resolution source'},'atlas':{'path':'curated.webp','sha256':hashlib.sha256((r/'curated.webp').read_bytes()).hexdigest(),'cell':[W,H],'columns':C,'groundY':G,'count':len(out)},'registration':{'headWidthTarget':target,'hipXTarget':hip,'method':'manually estimated head width and hip x, uniform scale and translation only','note':'not measured anatomical truth; floor silhouette alignment not foot lock'},'anchors':anchors,'goldSequence':gold,'fullSequence':list(range(len(out)))+[0],'frames':meta,'rejectedOrDeferredSourceFrames':[i for i in range(1,49) if i not in [q[0] for q in poses]],'rejectionNote':'Excluded near-duplicates and apparent expression/posture reversals; omitted does not mean individually approved/rejected. No cross-source mixing, no generated midframes.'}
(r/'manifest.json').write_text(json.dumps(manifest,indent=2)+'\n');print('atlas', (r/'curated.webp').stat().st_size,'frames',len(out));print('bounds',min(x['bounds'][0] for x in meta),max(x['bounds'][2] for x in meta),'components',max(x['components'] for x in meta),'floor',min(x['floor'] for x in meta),max(x['floor'] for x in meta))
# view full reference board at actual cell size, no crop/pose-specific zoom
sheet=Image.new('RGB',(W*5,H+45),'#f5f3eb');d=ImageDraw.Draw(sheet)
for j,i in enumerate(anchors):
 b=Image.new('RGBA',(W,H),'#f5f3eb');b.alpha_composite(Image.fromarray(out[i]));sheet.paste(b.convert('RGB'),(j*W,0));d.text((j*W+10,H+4),f'{meta[i]["label"]}  |  Source {meta[i]["sourceFrame"]}',fill='#203b30')
sheet.save(r/'identity.jpg',quality=92)
board=Image.new('RGB',(W*7,H*4+4*20),'#f5f3eb');d=ImageDraw.Draw(board)
for i,q in enumerate(out):
 b=Image.new('RGBA',(W,H),'#f5f3eb');b.alpha_composite(Image.fromarray(q));x=i%C*W;y=i//C*(H+20);board.paste(b.convert('RGB'),(x,y));d.text((x+8,y+H+2),f'{meta[i]["sourceFrame"]}: {meta[i]["label"]}',fill='#203b30')
board.save(r/'contact.jpg',quality=89)
