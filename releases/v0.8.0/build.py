"""Build the full rest cycle from whole-character artwork. No inference for rebuild.
Python dependencies: Pillow, NumPy, OpenCV. Run from repository root.
"""
from pathlib import Path
from PIL import Image,ImageDraw
import numpy as np,cv2,json,hashlib
R=Path(__file__).resolve().parent;W,H,G=640,576,532
def clean(im):
 a=np.array(im.convert('RGBA'));_,l,s,_=cv2.connectedComponentsWithStats((a[:,:,3]>=128).astype('uint8'));k=1+int(s[1:,4].argmax());m=cv2.dilate((l==k).astype('uint8'),np.ones((5,5),np.uint8));a[:,:,3]*=m;a[a[:,:,3]==0,:3]=0;return Image.fromarray(a)
def bounds(im):
 y,x=np.where(np.array(im)[:,:,3]>=128);return int(x.min()),int(y.min()),int(x.max()),int(y.max())
def headwidth(im):
 a=np.array(im).astype(int);m=a[:,:,3]>=128
 red=m&(a[:,:,0]>a[:,:,1]*1.45)&(a[:,:,0]>a[:,:,2]*1.45)&(a[:,:,0]>100)
 ry,_=np.where(red);limit=int(np.percentile(ry,2))+10
 yy,xx=np.where(m&(np.indices(m.shape)[0]<limit));return int(xx.max()-xx.min()+1)
def sheet(name):
 im=Image.open(R/'sources'/name);return [clean(im.crop((round(i%4*im.width/4),round(i//4*im.height/2),round((i%4+1)*im.width/4),round((i//4+1)*im.height/2)))) for i in range(8)]
accepted=Image.open(R/'../v0.7.4/poses.webp').convert('RGBA');rest=[accepted.crop((i%4*W,i//4*H,i%4*W+W,i//4*H+H)) for i in range(8)]
target=headwidth(rest[0]);frames=[];records=[]
for filename in ['stand-to-support.png','support-to-standing.png']:
 cells=sheet(filename);scale=target/np.median([headwidth(p) for p in cells]);print(filename,'head widths',[headwidth(p) for p in cells],'scale',scale)
 for i,p in enumerate(cells):
  p=p.resize((round(p.width*scale),round(p.height*scale)),Image.Resampling.LANCZOS);x0,y0,x1,y1=bounds(p)
  # Whole-character registration: ground baseline and rightmost head outline.
  # It does not enforce a shared skeleton or measure foot contact.
  a=np.array(p).astype(int);m=a[:,:,3]>=128;red=m&(a[:,:,0]>a[:,:,1]*1.45)&(a[:,:,0]>a[:,:,2]*1.45)&(a[:,:,0]>100);ry,_=np.where(red);lim=int(np.percentile(ry,2))+10
  yy,xx=np.where(m&(np.indices(m.shape)[0]<lim));dx=470-int(xx.max());dy=G-y1
  f=Image.new('RGBA',(W,H));f.paste(p,(dx,dy));frames.append(f);records.append({'source':filename,'cell':i,'scale':float(scale),'translation':[dx,dy]})
# Place exact accepted rest poses between the newly authored sitting and rising groups.
frames=frames[:8]+rest+frames[8:];records=records[:8]+[{'source':'../v0.7.4/poses.webp','cell':i,'scale':1,'translation':[0,0]} for i in range(8)]+records[8:]
# Explicit shared support boundaries: no cross-sheet replacement at the joins.
frames[7]=rest[0].copy();records[7]={'reuse':8,'reason':'exact accepted support join'}
frames[16]=rest[0].copy();records[16]={'reuse':8,'reason':'exact accepted wake support join'}
# The independently generated sitting sheet changes proportions too strongly.
# Preserve it as an unused study; use the consistent supported-rise drawings in
# reverse for descent, with separately directed timing. Recovery remains the
# forward, authored weight-bearing push-up rather than reversed old sit art.
for i in range(8):
 frames[i]=frames[23-i].copy();records[i]={'reuse':23-i,'reason':'matched supported-descent reuse; generated sit sheet rejected for proportion drift'}
entries=[]
def add(i,s,label,chapter,breath=False):entries.append({'index':i,'seconds':s,'label':label,'chapter':chapter,'breath':breath})
for i,s,label in [(0,1,'Standing'),(1,.22,'Prepare to sit'),(2,.2,'Knees bend'),(3,.2,'Hips lower'),(4,.22,'Seated contact'),(5,.26,'Settling'),(6,.26,'Hands reach'),(7,.4,'Hands supporting')]:add(i,s,label,'sit')
for i,s,label in [(9,.2,'Elbows soften'),(10,.2,'Chest lowers'),(11,.2,'Weight settles'),(12,.22,'Chin approaches'),(13,.24,'Eyes close'),(14,.26,'Forearm rest'),(15,.45,'Sleep settles')]:add(i,s,label,'lower')
add(15,3.4,'Sleeping','sleep',True)
# Waking reuses the accepted whole-body lowering drawings in reverse with different
# timing, then uses newly authored weight-shift/push-off/rise artwork, not reversed sit.
for i,s,label in [(15,.4,'Waking stir'),(14,.3,'Chin lifts'),(13,.28,'Sleepy eyes'),(12,.25,'Head lifts'),(11,.23,'Elbows extend'),(10,.23,'Chest lifts'),(9,.25,'Hands bear weight'),(8,.45,'Seated support')]:add(i,s,label,'wake')
for i,s,label in [(17,.28,'Weight over hands'),(18,.28,'Feet tuck under'),(19,.25,'Low crouch'),(20,.25,'Hands push off'),(21,.25,'Knees extend'),(22,.3,'Standing balance'),(23,.35,'Upright recovery')]:add(i,s,label,'rise')
add(0,1,'Standing settled','rise')
m={'version':'v0.8.0','status':'complete rest-cycle review candidate; lowering component v0.7.4 accepted by owner','cell':[W,H],'columns':6,'floor':G,'frames':records,'timeline':entries,'sourceSha256':{str(p.relative_to(R)):hashlib.sha256(p.read_bytes()).hexdigest() for p in sorted((R/'sources').glob('*.png'))},'acceptedRestAtlasSha256':hashlib.sha256((R/'../v0.7.4/poses.webp').read_bytes()).hexdigest(),'limitations':['Discrete authored sprite poses; no continuous skeletal animation','Head and accessory variation between drawings','Hand/head registration is not anatomical foot locking','Early waking reuses accepted lowering drawings in reverse','Breathing scales whole sleeping sprite subtly, not a chest rig','Descent reuses supported-rise drawings in reverse with different timing','Full-cycle owner review pending; no speech or films']}
atlas=Image.new('RGBA',(W*6,H*4));contact=Image.new('RGB',(1920,1232),'#f5f3eb');d=ImageDraw.Draw(contact)
for i,f in enumerate(frames):
 atlas.paste(f,(i%6*W,i//6*H));b=Image.new('RGBA',(W,H),'#f5f3eb');b.alpha_composite(f);contact.paste(b.convert('RGB').resize((320,288)),(i%6*320,i//6*308));d.text((i%6*320+8,i//6*308+290),str(i),fill='#213c31')
atlas.save(R/'poses.webp',lossless=True,exact=True);contact.save(R/'evidence/contact.jpg',quality=95)
(R/'manifest.json').write_text(json.dumps(m,indent=2)+'\n');(R/'timeline.js').write_text('window.DINO_STUDY='+json.dumps(m)+';\n')
checks=[]
for i,f in enumerate(frames):
 a=np.array(f);mask=(a[:,:,3]>=128).astype('uint8');_,_,s,_=cv2.connectedComponentsWithStats(mask);y,x=np.where(mask);checks.append({'pose':i,'componentsAbove64':int((s[1:,4]>64).sum()),'floor':int(y.max()),'clipped':bool(x.min()==0 or x.max()==W-1 or y.min()==0 or y.max()==H-1)})
(R/'validation.json').write_text(json.dumps({'kind':'actual atlas checks; exact-player render separately recorded','checks':checks,'sharedSupportPixelIdentical':frames[7].tobytes()==frames[8].tobytes()==frames[16].tobytes(),'standingRecoverySameSource':entries[0]['index']==entries[-1]['index'],'approvedReferenceHashes':{p:hashlib.sha256((R/'../../characters/DINO-001/approved'/p).read_bytes()).hexdigest() for p in ['hero.png','turnaround.png']}},indent=2)+'\n')
print('Duration',sum(e['seconds'] for e in entries),'seconds. Checks',checks)
