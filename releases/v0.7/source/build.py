from pathlib import Path
import cv2, numpy as np, json, hashlib
from PIL import Image,ImageDraw
import sys
P=Path(sys.argv[1]).resolve(); out=Path(__file__).resolve().parent.parent;out.mkdir(exist_ok=True)
W=H=192; G=176

def largest(a):
 n,l,s,c=cv2.connectedComponentsWithStats(a.astype('uint8')); k=1+np.argmax(s[1:,4]);return l==k

def clean(im):
 a=im[:,:,3];m=largest(a>=100);# retain only the coherent alpha neighborhood
 near=cv2.dilate(m.astype('uint8'),np.ones((5,5),np.uint8))>0
 a=np.where(near,a,0).astype('uint8');a[a<10]=0
 # Remove edge contamination in extremely low alpha, keep straight alpha source colors.
 im=im.copy();im[:,:,3]=a;im[a==0,:3]=0
 return im

def register(im,scale=1.,anchor=None):
 a=im[:,:,3];y,x=np.where(a>=128); yb=int(y.max());xl=int(x.min());xr=int(x.max());
 # preserve apparent horizontal registration using tail tip as left anchor, not width normalization
 if anchor is None: anchor=xl
 M=np.array([[scale,0,20-anchor*scale],[0,scale,G-yb*scale]],np.float32)
 p=im.astype(np.float32)/255;p[:,:,:3]*=p[:,:,3:4];p=cv2.warpAffine(p,M,(W,H),flags=cv2.INTER_LINEAR,borderMode=cv2.BORDER_CONSTANT);p[:,:,:3]/=np.maximum(p[:,:,3:4],1e-6);p=np.clip(p*255+.5,0,255).astype(np.uint8)
 # align threshold bottom exactly to floor after resampling
 yy=np.where(p[:,:,3]>=128)[0];d=G-int(yy.max());p=np.roll(p,d,axis=0) if d else p
 return p

def alpha_sheet(path,rows):
 im=np.array(Image.open(path).convert('RGBA'));h,w=im.shape[:2];frames=[]
 for j in range(rows):
  for i in range(8):
   cell=im[round(j*h/rows):round((j+1)*h/rows),round(i*w/8):round((i+1)*w/8)].copy();frames.append(register(clean(cell),.70 if rows==4 else 1.))
 return frames

def floor_sheet(path):
 im=np.array(Image.open(path).convert('RGB'));hsv=cv2.cvtColor(im,cv2.COLOR_RGB2HSV);frames=[]
 for ri,(top,bot) in enumerate([(52,175),(202,320),(350,438),(474,559),(592,689)]):
  m=(hsv[top:bot,:,1]>75).astype('uint8');m[:,:180]=0;n,l,s,c=cv2.connectedComponentsWithStats(m);ids=sorted([i for i in range(1,n) if s[i,4]>220],key=lambda i:s[i,0]);
  for i in ids:
   x,y,w,h,_=s[i];x0=max(0,x-4);x1=min(im.shape[1],x+w+4);y0=max(top,top+y-4);y1=min(bot,top+y+h+4)
   rgb=im[y0:y1,x0:x1].copy();ma=(l[y0-top:y1-top,x0:x1]==i).astype('uint8');ma=cv2.morphologyEx(ma,cv2.MORPH_CLOSE,np.ones((3,3),np.uint8));cs,_=cv2.findContours(ma,cv2.RETR_EXTERNAL,cv2.CHAIN_APPROX_SIMPLE);ma[:]=0;cv2.drawContours(ma,[max(cs,key=cv2.contourArea)],0,255,-1);ma=cv2.GaussianBlur(ma,(3,3),.55);rgba=np.dstack([rgb,ma]);frames.append(register(rgba,1.30 if ri>=3 else 1.10))
 return frames

def atlas(frames,name):
 n=len(frames);rows=(n+7)//8;im=Image.new('RGBA',(W*8,H*rows));forbidden=[]
 for i,f in enumerate(frames):
  im.paste(Image.fromarray(f),(i%8*W,i//8*H));a=f[:,:,3];y,x=np.where(a>=128); comps=cv2.connectedComponentsWithStats((a>=128).astype('uint8'))[2][1:,4];forbidden.append({'frame':i,'bottom':int(y.max()),'components':int((comps>16).sum()),'bounds':[int(x.min()),int(y.min()),int(x.max()),int(y.max())]})
 im.save(out/(name+'.webp'),quality=90,method=6,exact=True); im.save(out/(name+'.png'));return forbidden
rest=alpha_sheet(P/'dino_s_cozy_rest_cycle_sprite_sheet.png',6);speech=alpha_sheet(P/'dino_s_speaking_animation_sprite_sheet.png',4);floor=floor_sheet(P/'a_polished_high_resolution_2d_cartoon_sprite_shee.png')
# no synthetic morphing: whole poses with per-frame exposure. Floor source first 36 frames contains complete fall/wake; use reversed sit approach for final rise.
# Hold exact first pose at the end; trim inconsistent standing duplicates.
rest_indices=list(range(0,40))+[41,43,45,47,0]
floor_indices=list(range(0,6))+[7]+list(range(8,34))+[7,5,4,3,2,1,0]
manifest={'version':'v0.7','character':'DINO-001','cell':[W,H],'columns':8,'groundY':G,'sourceStatus':'generated review candidates; not approved canon','clips':{'rest':{'atlas':'rest.webp','frames':len(rest),'sequence':rest_indices,'mode':'seated sleep'},'floor':{'atlas':'floor.webp','frames':len(floor),'sequence':floor_indices,'mode':'curled floor sleep, lower resolution concept-source prototype'},'speech':{'atlas':'speech.webp','frames':len(speech),'sequence':list(range(len(speech))),'mode':'expression exploration, no phoneme labels or lip sync'}},'sourceFiles':{n:hashlib.sha256((P/n).read_bytes()).hexdigest() for n in ['dino_s_cozy_rest_cycle_sprite_sheet.png','dino_s_speaking_animation_sprite_sheet.png','a_polished_high_resolution_2d_cartoon_sprite_shee.png']},'validation':{'rest':atlas(rest,'rest'),'floor':atlas(floor,'floor'),'speech':atlas(speech,'speech')}}
(out/'manifest.json').write_text(json.dumps(manifest,indent=2));
# review registered frames over neutral background
for name in ['rest','floor','speech']:
 im=Image.open(out/(name+'.png'));bg=Image.new('RGBA',im.size,'#f5f3eb');bg.alpha_composite(im);bg.thumbnail((1152,900));bg.convert('RGB').save(out/(name+'-contact.jpg'))
print({k:len(v) for k,v in [('rest',rest),('floor',floor),('speech',speech)]});print({k:(min(x['bottom'] for x in v),max(x['bottom'] for x in v),max(x['components'] for x in v),[x['frame'] for x in v if min(x['bounds'][:2])<=0 or max(x['bounds'][2:])>=191]) for k,v in manifest['validation'].items()})
