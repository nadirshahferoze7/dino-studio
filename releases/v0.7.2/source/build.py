from pathlib import Path
import cv2, numpy as np, json, hashlib, sys
from PIL import Image,ImageDraw
cv2.setNumThreads(2)
P=Path(sys.argv[1]); out=Path(sys.argv[2]);out.mkdir(parents=True,exist_ok=True)
W,H,G=640,576,532
im=np.array(Image.open(P).convert('RGBA')); n,labels,stats,cent=cv2.connectedComponentsWithStats((im[:,:,3]>=128).astype('uint8')); ids=[i for i in range(1,n) if stats[i,4]>5000];ids.sort(key=lambda i:(int(cent[i,1]>550),cent[i,0])); assert len(ids)==6
# Manually estimated common-view pelvis anchors in source coordinates, checked on the complete source. No independent part movement.
anchors=[250,730,1260,190,655,1200]; scales=[1.,1.,.98,1.02,1.03,.99]; names=['Standing','Knee bend','Seated','Drowsy support','Curled sleep','Sleepy wake']
frames=[];records=[]
def premul(p):
 q=p.astype(np.float32)/255;q[:,:,:3]*=q[:,:,3:4];return q
def unpack(q):
 q=q.copy();q[:,:,:3]/=np.maximum(q[:,:,3:4],1e-6);a=np.clip(q*255+.5,0,255).astype(np.uint8);a[a[:,:,3]<8]=0;return a
def shiftfloor(a):
 yy=np.where(a[:,:,3]>=128)[0]; d=G-int(yy.max()); o=np.zeros_like(a);
 if d>=0:o[d:]=a[:H-d]
 else:o[:H+d]=a[-d:]
 return o
for j,i in enumerate(ids):
 x,y,w,h,area=stats[i];x0=max(0,x-4);y0=max(0,y-4);x1=min(im.shape[1],x+w+4);y1=min(im.shape[0],y+h+4)
 p=im[y0:y1,x0:x1].copy();mask=cv2.dilate((labels[y0:y1,x0:x1]==i).astype('uint8'),np.ones((5,5),np.uint8));p[:,:,3]*=mask;p[p[:,:,3]==0,:3]=0
 s=scales[j];M=np.array([[s,0,260-(anchors[j]-x0)*s],[0,s,G-(y+h-1-y0)*s]],np.float32)
 a=shiftfloor(unpack(cv2.warpAffine(premul(p),M,(W,H),flags=cv2.INTER_LINEAR))); frames.append(a);records.append({'index':j,'name':names[j],'sourceBounds':[int(x0),int(y0),int(x1),int(y1)],'nativeAlphaBounds':[int(x),int(y),int(w),int(h)],'hipXEstimate':anchors[j],'uniformScale':s})
# use exact source alpha and color; no runtime deformation. Save lossless sprite atlas.
def atlas(frames,path,cols):
 rows=(len(frames)+cols-1)//cols;sheet=Image.new('RGBA',(W*cols,H*rows));
 for i,p in enumerate(frames):sheet.paste(Image.fromarray(p),(i%cols*W,i//cols*H))
 sheet.save(path,lossless=True,method=4,exact=True)
atlas(frames,out/'anchors.webp',3)
# Flow experiment: source-to-source dense motion, no separate body part rig. Render on reduced resolution for flow computation, warp high-res data.
Y,X=np.mgrid[:H,:W].astype(np.float32);dis=cv2.DISOpticalFlow_create(cv2.DISOPTICAL_FLOW_PRESET_MEDIUM);dis.setUseSpatialPropagation(True)
def gray(p):
 a=p[:,:,3:4].astype(np.float32)/255;rgb=(p[:,:,:3]*a+239*(1-a)).astype('uint8');return cv2.cvtColor(cv2.resize(rgb,(W//2,H//2)),cv2.COLOR_RGB2GRAY)
def flow(a,b):return cv2.resize(dis.calc(gray(a),gray(b),None),(W,H),interpolation=cv2.INTER_LINEAR)*2
# fixed-point inverse mapping, solving source x + f(x)*t = target x. Avoid naive forward-map inversion.
def warp(p,f,t):
 mx=X.copy();my=Y.copy()
 for _ in range(4):
  fxy=cv2.remap(f,mx,my,cv2.INTER_LINEAR,borderMode=cv2.BORDER_REPLICATE);mx=(X-fxy[:,:,0]*t).astype(np.float32);my=(Y-fxy[:,:,1]*t).astype(np.float32)
 return cv2.remap(premul(p),mx,my,cv2.INTER_LINEAR,borderMode=cv2.BORDER_CONSTANT)
# Generate tests between consecutive poses and recovery. 7 intermediates per transition.
pairs=[(0,1),(1,2),(2,3),(3,4),(4,5),(5,3),(3,2),(2,1),(1,0)]
mid=[];qa=[]
for a,b in pairs:
 fa,fb=flow(frames[a],frames[b]),flow(frames[b],frames[a]); seq=[]
 for t in np.linspace(.125,.875,7):
  pa,pb=warp(frames[a],fa,t),warp(frames[b],fb,1-t);q=pa*(1-t)+pb*t;f=shiftfloor(unpack(q));seq.append(f)
 mid.append(seq)
# Smaller review images, enlarged enough to show intermediate artifacts.
def bg(p):
 i=Image.fromarray(p);b=Image.new('RGBA',i.size,'#f5f3eb');b.alpha_composite(i);return b.convert('RGB')
review=Image.new('RGB',(5*320,9*310),'#f5f3eb');d=ImageDraw.Draw(review)
for j,(a,b) in enumerate(pairs):
 for k,p in enumerate([frames[a],mid[j][1],mid[j][3],mid[j][5],frames[b]]):review.paste(bg(p).resize((320,288)),(k*320,j*310));d.text((k*320+6,j*310+290),f'{a} → {b}  {k*25}%',fill='#203b30')
(out/'studies').mkdir(exist_ok=True);review.save(out/'studies/flow-review.jpg',quality=90)
# store lossless midframes as experiment (not accepted until visual inspection)
if '--retain-rejected-atlas' in sys.argv: atlas([p for seq in mid for p in seq],out/'flow-experiment.webp',7)
manifest={'version':'v0.7.2','character':'DINO-001','status':'review candidate','source':{'file':P.name,'sha256':hashlib.sha256(P.read_bytes()).hexdigest(),'dimensions':[im.shape[1],im.shape[0]]},'cell':[W,H],'groundY':G,'columns':3,'anchors':records,'flowPairs':pairs,'flowFramesPerPair':7,'flowColumns':7,'notes':'New native source poses. Uniform scaling and translation only for anchors; flow experiments are full-image resampling, not independent body segments.'}
(out/'manifest.json').write_text(json.dumps(manifest,indent=2)+'\n')
board=Image.new('RGB',(3*400,2*385),'#f5f3eb');d=ImageDraw.Draw(board)
for i,p in enumerate(frames):board.paste(bg(p).resize((400,360)),(i%3*400,i//3*385));d.text((i%3*400+10,i//3*385+360),names[i],fill='#203b30')
board.save(out/'identity.jpg',quality=95)
print(records);print('anchor atlas bytes',(out/'anchors.webp').stat().st_size)
