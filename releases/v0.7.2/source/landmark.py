from pathlib import Path
import cv2,numpy as np,json,sys
from PIL import Image,ImageDraw
from scipy.interpolate import RBFInterpolator
cv2.setNumThreads(2)
r=Path(sys.argv[1]); W,H,G=640,576,532
im=np.array(Image.open(r/'anchors.webp').convert('RGBA'));frames=[im[i//3*H:i//3*H+H,i%3*W:i%3*W+W].copy() for i in range(6)]
# Anatomical correspondence in registered source pixel coordinates. Whole-image mappings, not composited body parts.
# crown, rear skull, lower skull, neck, eye top, eye center, eye bottom, muzzle, mouth corner, chin, scarf knot, rear scarf, shoulder, elbow, hand, bag stud, tail root upper, tail tip, tail root lower, pelvis lower, near toes, near heel, far toes, far heel, belly.
pts=np.array([
[[260,44],[165,150],[219,221],[237,242],[323,86],[335,116],[325,146],[419,144],[343,164],[374,218],[348,277],[189,314],[245,288],[241,356],[246,399],[287,411],[202,369],[60,407],[213,468],[244,499],[292,516],[218,524],[355,512],[315,524],[369,407]],
[[327,81],[222,184],[273,259],[310,284],[389,130],[399,168],[391,193],[479,196],[400,214],[431,270],[350,326],[204,291],[269,302],[265,363],[294,390],[262,416],[186,356],[51,394],[207,459],[244,482],[288,519],[206,524],[352,510],[309,524],[349,417]],
[[253,116],[146,218],[200,289],[248,312],[309,155],[320,186],[310,215],[399,215],[326,240],[357,298],[326,351],[170,385],[245,354],[269,419],[309,436],[244,458],[184,447],[58,485],[200,522],[252,529],[362,448],[355,524],[429,435],[414,518],[342,419]],
[[389,164],[282,257],[324,332],[354,367],[453,263],[460,293],[449,306],[533,326],[450,329],[485,373],[379,404],[223,354],[311,386],[344,458],[392,513],[254,452],[189,447],[85,500],[212,527],[258,530],[321,516],[276,526],[443,512],[410,525],[392,459]],
[[466,268],[365,350],[390,437],[397,450],[488,376],[503,409],[523,431],[584,476],[497,448],[547,503],[405,449],[282,326],[375,454],[409,485],[514,513],[269,437],[164,422],[123,482],[185,527],[270,524],[360,515],[307,529],[530,516],[491,524],[402,473]],
[[426,199],[318,300],[365,365],[413,389],[473,273],[493,285],[477,301],[574,288],[502,322],[535,365],[437,436],[278,357],[362,411],[367,474],[402,517],[258,439],[203,427],[84,494],[209,516],[269,529],[294,516],[246,527],[500,512],[468,526],[422,449]]],dtype=np.float64)
# A curled tail's tip corresponds poorly to an extended tail; do not force a looping path through the entire rump. Treat tip as a correspondence, mark as approximate.
pts=np.concatenate([pts,np.tile(np.array([[0,0],[W/2,0],[W-1,0],[0,H/2],[W-1,H/2],[0,H-1],[W/2,H-1],[W-1,H-1]],dtype=float),(6,1,1))],axis=1)
Y,X=np.mgrid[:H:4,:W:4].astype(np.float64);grid=np.stack([X,Y],-1).reshape(-1,2)/W

def prep(a):
 p=a.astype(np.float32)/255;p[:,:,:3]*=p[:,:,3:4];m=(a[:,:,3]>=128).astype('uint8');d=cv2.distanceTransform(m,cv2.DIST_L2,5)-cv2.distanceTransform(1-m,cv2.DIST_L2,5);return p,d
src=[prep(a) for a in frames]
def warp(i,target):
 mapping=RBFInterpolator(target/W,pts[i]/W,kernel='thin_plate_spline',smoothing=0.000045)(grid).reshape(Y.shape+(2,))*W
 # interpolate displacement rather than absolute maps to keep exact pixel centers.
 dd=mapping-np.stack([X,Y],-1); dd=cv2.resize(dd.astype(np.float32),(W,H),interpolation=cv2.INTER_CUBIC);yy,xx=np.mgrid[:H,:W].astype(np.float32);mx=xx+dd[:,:,0];my=yy+dd[:,:,1];p,d=src[i]
 return cv2.remap(p,mx,my,cv2.INTER_LINEAR,borderMode=cv2.BORDER_CONSTANT),cv2.remap(d,mx,my,cv2.INTER_LINEAR,borderMode=cv2.BORDER_CONSTANT,borderValue=-100)
def morph(a,b,t):
 p0,p1=pts[a],pts[b]; target=p0*(1-t)+p1*t;aa,da=warp(a,target);bb,db=warp(b,target);q=aa*(1-t)+bb*t; color=q[:,:,:3]/np.maximum(q[:,:,3:4],1e-6)
 # Blend signed silhouette distances; keep solid character, no semi-transparent second contour.
 d=da*(1-t)+db*t;alpha=np.clip(.5+d*.7,0,1); out=np.uint8(np.clip(np.dstack([color,alpha])*255+.5,0,255));out[out[:,:,3]<8]=0
 y,x=np.where(out[:,:,3]>=128);shift=G-y.max();z=np.zeros_like(out);
 if shift>=0:z[shift:]=out[:H-shift]
 else:z[:H+shift]=out[-shift:]
 return z
pairs=[(0,1),(1,2),(2,3),(3,4),(4,5),(5,2),(2,1),(1,0)]
review=Image.new('RGB',(5*320,len(pairs)*310),'#f5f3eb');d=ImageDraw.Draw(review);allmid=[]
for j,(a,b) in enumerate(pairs):
 mids=[morph(a,b,t) for t in np.arange(1,8)/8];allmid.extend(mids)
 for k,p in enumerate([frames[a],mids[1],mids[3],mids[5],frames[b]]):
  bg=Image.new('RGBA',(W,H),'#f5f3eb');bg.alpha_composite(Image.fromarray(p));review.paste(bg.convert('RGB').resize((320,288)),(k*320,j*310));d.text((k*320+5,j*310+289),f'{a} → {b} {k*25}%',fill='#203b30')
(r/'studies').mkdir(exist_ok=True);review.save(r/'studies/landmark-review.jpg',quality=90)
# lossless experiment is reproducible; display selected frames separately after review.
np.savez_compressed(r/'landmark-experiment.npz',frames=np.array(allmid))
print('rendered',len(allmid))
