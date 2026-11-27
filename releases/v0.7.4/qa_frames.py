"""Verify exact-player PNGs and reproduce review sheets.
python releases/v0.7.4/qa_frames.py /scratch/frame-directory
"""
from pathlib import Path
from PIL import Image,ImageDraw
import numpy as np,cv2,json,hashlib,sys
r=Path(__file__).resolve().parent;paths=sorted(Path(sys.argv[1]).glob('*.png'));stats=[]
for p in paths:
 a=np.array(Image.open(p).convert('RGBA'));mask=(a[:,:,3]>=128).astype('uint8');n,_,s,_=cv2.connectedComponentsWithStats(mask);yy,xx=np.where(mask)
 stats.append({'frame':int(p.stem),'empty':not len(yy),'bottom':int(yy.max()) if len(yy) else -1,'components':int((s[1:,4]>64).sum()),'clipped':bool(len(yy) and (xx.min()==0 or xx.max()==639 or yy.min()==0 or yy.max()==575))})
d=json.loads((r/'evidence/player-render.json').read_text());d['checks']={'empty':sum(s['empty'] for s in stats),'clipped':sum(s['clipped'] for s in stats),'maximumComponentsAbove64':max(s['components'] for s in stats),'floorMin':min(s['bottom'] for s in stats),'floorMax':max(s['bottom'] for s in stats)};d['videoSHA256']=hashlib.sha256((r/'evidence/player-preview.mp4').read_bytes()).hexdigest();(r/'evidence/player-render.json').write_text(json.dumps(d,indent=2)+'\n')
contact=Image.new('RGB',(6*320,5*310),'#f5f3eb');draw=ImageDraw.Draw(contact)
for j,i in enumerate(np.linspace(0,len(paths)-1,30).astype(int)):
 im=Image.open(paths[i]).convert('RGBA');b=Image.new('RGBA',im.size,'#f5f3eb');b.alpha_composite(im);x=j%6*320;y=j//6*310;contact.paste(b.convert('RGB').resize((320,288)),(x,y));draw.text((x+8,y+290),f'{i/24:.2f}s',fill='#213c31')
contact.save(r/'evidence/player-contact.jpg',quality=94)
atlas=Image.open(r/'poses.webp').convert('RGBA');boards=[Image.new('RGB',(6*320,3*300),'#f5f3eb') for _ in range(2)]
for i in range(8):
 im=atlas.crop((i%4*640,i//4*576,i%4*640+640,i//4*576+576));a=np.array(im)[:,:,3];ys,xs=np.where(a>=128);top=int(ys.min());b=Image.new('RGBA',im.size,'#f5f3eb');b.alpha_composite(im)
 crops=[b.crop((210,max(0,top-5),530,min(576,top+275))),b.crop((80,280,500,565))]
 for q,c in enumerate(crops):
  boards[q].paste(c.convert('RGB').resize((320,275)),(i%6*320,i//6*300));ImageDraw.Draw(boards[q]).text((i%6*320+8,i//6*300+278),f'Source {i}',fill='#213c31')
for b,n in zip(boards,['face-crops.jpg','joint-feet-crops.jpg']):b.save(r/'evidence'/n,quality=95)
print(json.dumps(d,indent=2))
