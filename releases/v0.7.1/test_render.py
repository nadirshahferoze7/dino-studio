"""Actual Chromium Canvas frame and control QA; browser inputs are exact versioned asset bytes."""
from pathlib import Path
import sys,json,base64,hashlib,io,subprocess,cv2,numpy as np
from PIL import Image,ImageDraw
from playwright.sync_api import sync_playwright
r=Path(__file__).resolve().parent;out=Path(sys.argv[1]) if len(sys.argv)>1 else r/'evidence';out.mkdir(parents=True,exist_ok=True)
js=(r/'player.js').read_text();uri='data:image/webp;base64,'+base64.b64encode((r/'curated.webp').read_bytes()).decode();html=(r/'index.html').read_text().replace('<script src="player.js"></script>','<script>'+js.replace('im.src=spec.atlas.path','im.src='+json.dumps(uri))+'</script>');html=html.replace('src="contact.jpg"','src="data:image/jpeg;base64,'+base64.b64encode((r/'contact.jpg').read_bytes()).decode()+'"')
res={'method':'Actual Chromium Canvas viewer; exact script and atlas bytes inlined, no hosted network check','errors':[],'controls':{},'modes':{}}
with sync_playwright() as p:
 b=p.chromium.launch(executable_path='/usr/bin/chromium',headless=True,args=['--no-sandbox','--disable-gpu']);page=b.new_page(viewport={'width':1060,'height':1100});page.on('pageerror',lambda e:res['errors'].append(str(e)));page.set_content(html);page.wait_for_function('poseState().ready');c=res['controls'];c['load']=True
 page.locator('#replay').click();page.wait_for_timeout(180);c['replay']=page.evaluate('poseState().clock>0&&poseState().playing');page.locator('#play').click();c['pause']=not page.evaluate('poseState().playing');page.locator('#seek').evaluate('(e)=>{e.value=500;e.dispatchEvent(new Event("input"))}');c['seek']=abs(page.evaluate('poseState().clock/poseState().total')-.5)<.001;old=page.evaluate('poseState().clock');page.locator('#next').click();c['next']=page.evaluate('poseState().clock')>old;page.locator('#prev').click();c['prev']=page.evaluate('poseState().clock')<=old+.001;page.locator('#speed').select_option('.5' if False else '0.5');c['speed']=page.locator('#speed').input_value()=='0.5';page.locator('#speed').select_option('1');page.locator('#loop').check();c['loop']=page.locator('#loop').is_checked();page.locator('#loop').uncheck();page.locator('#anchors button').nth(3).click();c['anchorClick']='Curled sleep' in page.locator('#status').inner_text();page.set_viewport_size({'width':390,'height':844});c['mobile']=page.evaluate('document.documentElement.scrollWidth<=innerWidth');page.set_viewport_size({'width':1060,'height':1100})
 for mode in ['full','gold','anchor']:
  page.locator(f'[data-mode={mode}]').click();s=page.evaluate('poseState()');c[mode+'Mode']=s['mode']==mode;times=[q['start']+1e-6 for q in s['timeline']];data=page.evaluate('(ts)=>ts.map(t=>{inspectPose(t);return document.querySelector("canvas").toDataURL()})',times);stats=[];imgs=[];raw=[]
  for f in data:
   im=Image.open(io.BytesIO(base64.b64decode(f.split(',')[1]))).convert('RGBA');a=np.array(im)[:,:,3];ys,xs=np.where(a>=128);n,l,ss,ct=cv2.connectedComponentsWithStats((a>=128).astype('uint8'));stats.append({'blank':not len(xs),'clip':bool(len(xs) and (xs.min()==0 or xs.max()==575 or ys.min()==0 or ys.max()==511)),'floor':int(ys.max()),'components':int((ss[1:,4]>64).sum())});raw.append(im.tobytes());bg=Image.new('RGBA',im.size,'#f5f3eb');bg.alpha_composite(im);imgs.append(bg.convert('RGB'))
  res['modes'][mode]={'entries':len(data),'seconds':round(s['total'],3),'blank':sum(x['blank'] for x in stats),'clipped':sum(x['clip'] for x in stats),'maxComponents':max(x['components'] for x in stats),'floorMin':min(x['floor'] for x in stats),'floorMax':max(x['floor'] for x in stats),'sameFirstLastPixels':raw[0]==raw[-1]}
  if mode=='full':
   proc=subprocess.Popen(['ffmpeg','-y','-loglevel','error','-f','rawvideo','-pixel_format','rgb24','-video_size','576x512','-framerate','24','-i','-','-c:v','libx264','-crf','25','-pix_fmt','yuv420p','-movflags','+faststart',str(out/'rest-preview.mp4')],stdin=subprocess.PIPE);i=0
   for j in range(round(s['total']*24)):
    while i<len(s['timeline'])-1 and j/24>=s['timeline'][i]['end']:i+=1
    proc.stdin.write(imgs[i].tobytes())
   proc.stdin.close();assert proc.wait()==0
   sheet=Image.new('RGB',(7*216,5*210),'#f5f3eb');d=ImageDraw.Draw(sheet)
   for i,im in enumerate(imgs):x=i%7*216;y=i//7*210;sheet.paste(im.resize((216,192)),(x,y));d.text((x+3,y+193),f'{times[i]:.2f}s',fill='black')
   sheet.save(out/'browser-contact.jpg',quality=86)
 b.close()
res['hashes']={n:hashlib.sha256((r/n).read_bytes()).hexdigest() for n in ['curated.webp','manifest.json','index.html','player.js','contact.jpg','identity.jpg']};(r/'validation.json').write_text(json.dumps(res,indent=2)+'\n');print(json.dumps(res,indent=2))
