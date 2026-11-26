from pathlib import Path
import cv2,numpy as np,json
from PIL import Image,ImageDraw
root=Path(__file__).resolve().parent.parent;m=json.loads((root/'manifest.json').read_text());W=H=192;G=176
def read_atlas(name,n):
 a=np.array(Image.open(root/(name+'.png')).convert('RGBA'));return [a[i//8*H:i//8*H+H,i%8*W:i%8*W+W].copy() for i in range(n)]
def gray(p):
 a=p[:,:,3:4].astype(np.float32)/255; rgb=(p[:,:,:3]*a+230*(1-a)).astype('uint8');return cv2.cvtColor(rgb,cv2.COLOR_RGB2GRAY)
def premul(p):
 q=p.astype(np.float32)/255;q[:,:,:3]*=q[:,:,3:4];return q
Y,X=np.mgrid[:H,:W].astype(np.float32)
dis=cv2.DISOpticalFlow_create(cv2.DISOPTICAL_FLOW_PRESET_MEDIUM);dis.setUseSpatialPropagation(True)
def mid(a,b):
 fa=dis.calc(gray(a),gray(b),None);fb=dis.calc(gray(b),gray(a),None)
 # approximate inverse warp using forward/backward flow at target pixels.
 def warp(p,f):return cv2.remap(premul(p),X-f[:,:,0]*.5,Y-f[:,:,1]*.5,cv2.INTER_LINEAR,borderMode=cv2.BORDER_CONSTANT)
 pa,pb=warp(a,fa),warp(b,fb);p=(pa+pb)/2;p[:,:,:3]/=np.maximum(p[:,:,3:4],1e-6);p=np.clip(p*255+.5,0,255).astype('uint8');p[p[:,:,3]<10]=0
 yy=np.where(p[:,:,3]>=128)[0];d=G-int(yy.max());p=np.roll(p,d,axis=0) if d else p
 return p
for name in ['rest','floor']:
 c=m['clips'][name];frames=read_atlas(name,c['frames']);seq=c['sequence'];mids=[mid(frames[a],frames[b]) for a,b in zip(seq,seq[1:])];sheet=Image.new('RGBA',(W*8,H*((len(mids)+7)//8)));cmp=Image.new('RGB',(192*3,192*10),'#f5f3eb');d=ImageDraw.Draw(cmp)
 checks=[]
 for i,p in enumerate(mids):
  sheet.paste(Image.fromarray(p),(i%8*W,i//8*H));mask=(p[:,:,3]>=128).astype('uint8');n,l,s,cnt=cv2.connectedComponentsWithStats(mask);y,x=np.where(mask);checks.append({'frame':i,'components':int((s[1:,4]>16).sum()),'clipped':bool(x.min()==0 or x.max()==191 or y.min()==0 or y.max()==191),'floor':int(y.max())})
 for j,i in enumerate(np.linspace(0,len(mids)-1,10).astype(int)):
  for k,p in enumerate([frames[seq[i]],mids[i],frames[seq[i+1]]]):
   im=Image.fromarray(p);bg=Image.new('RGBA',(W,H),'#f5f3eb');bg.alpha_composite(im);cmp.paste(bg.convert('RGB'),(k*W,j*H));d.text((k*W+4,j*H+4),str(i),fill='black')
 sheet.save(root/(name+'-mid.webp'),quality=88,method=4,exact=True);cmp.save(root/(name+'-interpolation.jpg'));print(name,len(mids),max(q['components'] for q in checks),sum(q['clipped'] for q in checks));c['interpolatedAtlas']=name+'-mid.webp';c['interpolatedFrames']=len(mids);m['validation'][name+'-mid']=checks
(root/'manifest.json').write_text(json.dumps(m,indent=2))
