"""Build focused whole-body lowering study. Python: Pillow, NumPy, OpenCV.
No inferred in-betweens, independent limb transforms or texture blending.
"""
from pathlib import Path
from PIL import Image, ImageDraw
import numpy as np, cv2, json, hashlib
R=Path(__file__).resolve().parent
im=Image.open(R/'sources/lowering-eight.png').convert('RGBA')
W,H=640,576
frames=[]; records=[]
for i in range(8):
    # Fractional sheet boundaries rounded independently; source is 1774x887.
    box=(round(i%4*im.width/4),round(i//4*im.height/2),round((i%4+1)*im.width/4),round((i//4+1)*im.height/2))
    a=np.array(im.crop(box)); mask=(a[:,:,3]>=128).astype('uint8')
    _,lab,stats,_=cv2.connectedComponentsWithStats(mask)
    keep=lab==(1+np.argmax(stats[1:,4]))
    fringe=cv2.dilate(keep.astype('uint8'),np.ones((5,5),np.uint8))
    a[:,:,3]*=fringe; a[a[:,:,3]==0,:3]=0
    yy,xx=np.where(keep)
    # Align rightmost foreground (outer supporting hand) and alpha floor.
    # This is an estimated hand landmark, not measured anatomical contact.
    dx=470-int(xx.max());dy=532-int(yy.max())
    f=Image.new('RGBA',(W,H));f.paste(Image.fromarray(a),(dx,dy));frames.append(f)
    records.append({'index':i,'crop':box,'translation':[dx,dy],'scale':1,'sourceAlphaBounds':[int(xx.min()),int(yy.min()),int(xx.max()),int(yy.max())]})
atlas=Image.new('RGBA',(W*4,H*2));contact=Image.new('RGB',(1280,616),'#f5f3eb');d=ImageDraw.Draw(contact)
for i,f in enumerate(frames):
    atlas.paste(f,(i%4*W,i//4*H));b=Image.new('RGBA',(W,H),'#f5f3eb');b.alpha_composite(f)
    contact.paste(b.convert('RGB').resize((320,288)),(i%4*320,i//4*308));d.text((i%4*320+12,i//4*308+289),f'Pose {i+1}',fill='#213c31')
atlas.save(R/'poses.webp',lossless=True,exact=True);contact.save(R/'evidence/contact.jpg',quality=95)
durations=[.55,.2,.2,.2,.22,.24,.26,1.25]
m={'version':'v0.7.4','status':'focused lowering study; not approved','cell':[W,H],'columns':4,'floor':532,'sourceSha256':hashlib.sha256((R/'sources/lowering-eight.png').read_bytes()).hexdigest(),'frames':records,'timeline':[{'index':i,'seconds':sec,'label':['Hands supporting','Elbows soften','Chest lowers','Weight settles','Chin approaches','Eyes closing','Forearm rest','Sleeping'][i]} for i,sec in enumerate(durations)],'limitations':['Eight discrete drawings, no continuous-motion claim','Estimated hand registration is not anatomical foot locking','Tail curls fastest between poses 6 and 7','Head volume and satchel drift require refinement','Not spliced into full rest cycle; no waking or standing recovery']}
(R/'manifest.json').write_text(json.dumps(m,indent=2)+'\n');(R/'timeline.js').write_text('window.DINO_STUDY='+json.dumps(m)+';\n')
checks=[]
for i,f in enumerate(frames):
    a=np.array(f);mask=(a[:,:,3]>=128).astype('uint8');_,_,s,_=cv2.connectedComponentsWithStats(mask);y,x=np.where(mask)
    checks.append({'pose':i,'componentsAbove64':int((s[1:,4]>64).sum()),'floor':int(y.max()),'right':int(x.max()),'clipped':bool(x.min()==0 or x.max()==W-1 or y.min()==0 or y.max()==H-1)})
(R/'validation.json').write_text(json.dumps({'kind':'actual source atlas checks; motion rendering separate','checks':checks,'approvedReferenceHashes':{p:hashlib.sha256((R/'../../characters/DINO-001/approved'/p).read_bytes()).hexdigest() for p in ['hero.png','turnaround.png']}},indent=2)+'\n')
print(json.dumps(checks))
