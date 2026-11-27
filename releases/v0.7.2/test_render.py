from pathlib import Path
import sys, json, hashlib, subprocess, base64, io
from PIL import Image,ImageDraw
import cv2,numpy as np
from playwright.sync_api import sync_playwright
root=Path(__file__).resolve().parent;out=Path(sys.argv[1]);out.mkdir(parents=True,exist_ok=True); W,H=640,576
urls={p.name:'data:image/webp;base64,'+base64.b64encode(p.read_bytes()).decode() for p in [root/'anchors.webp',root/'motion.webp']}
js=(root/'player.js').read_text().replace('i.src=n','i.src=assets[n]||n')
html=(root/'index.html').read_text().replace('<script src="player.js"></script>','<script>const assets='+json.dumps(urls)+';'+js+'</script>')
result={'status':'review candidate, not approved','testEnvironment':'CPU Chromium, exact script and assets inlined because hosted URL access is restricted','errors':[],'controls':{},'modes':{}}
with sync_playwright() as p:
 b=p.chromium.launch(executable_path='/usr/bin/chromium',args=['--no-sandbox','--disable-gpu']);page=b.new_page(viewport={'width':1000,'height':1000});page.on('pageerror',lambda e:result['errors'].append(str(e)));page.set_content(html,wait_until='domcontentloaded');page.wait_for_function('poseState().ready');page.evaluate('inspectPose(0)');c=result['controls'];c['initialPaused']=not page.evaluate('poseState().playing');page.locator('#restart').click();page.wait_for_timeout(220);c['replay']=page.evaluate('poseState().t>0&&poseState().playing');page.locator('#play').click();c['pause']=not page.evaluate('poseState().playing');page.locator('#seek').evaluate('(e)=>{e.value=500;e.dispatchEvent(new Event("input"))}');c['scrub']=abs(page.evaluate('poseState().t/poseState().total')-.5)<.01;before=page.evaluate('poseState().t');page.locator('#next').click();c['next']=page.evaluate('poseState().t')>before;page.locator('#prev').click();c['prev']=page.evaluate('poseState().t')<=before+.01;page.locator('#speed').select_option('.5');c['speed']=page.locator('#speed').input_value()=='.5';page.locator('#speed').select_option('1');page.locator('#loop').check();c['loop']=page.locator('#loop').is_checked();page.locator('#loop').uncheck();page.set_viewport_size({'width':390,'height':844});c['mobile']=page.evaluate('document.documentElement.scrollWidth<=innerWidth');page.set_viewport_size({'width':1000,'height':1000})
 for mode in ['motion','source','anchors']:
  page.locator(f'[data-mode={mode}]').click();page.evaluate('inspectPose(0)');s=page.evaluate('poseState()');c[mode+'Mode']=s['mode']==mode;times=[x['start']+.00001 for x in s['timeline']];data=page.evaluate('(ts)=>ts.map(t=>{inspectPose(t);return document.querySelector("canvas").toDataURL()})',times);rgb=[];pixels=[];stats=[]
  for f in data:
   im=Image.open(io.BytesIO(base64.b64decode(f.split(',')[1]))).convert('RGBA');a=np.array(im)[:,:,3];mask=(a>=128).astype('uint8');n,l,ss,cnt=cv2.connectedComponentsWithStats(mask);ys,xs=np.where(mask);stats.append({'bottom':int(ys.max()) if len(ys) else None,'clip':bool(len(xs) and (xs.min()==0 or xs.max()==W-1 or ys.min()==0 or ys.max()==H-1)),'components':int((ss[1:,4]>64).sum())});bg=Image.new('RGBA',im.size,'#f5f3eb');bg.alpha_composite(im);rgb.append(bg.convert('RGB'));pixels.append(im.tobytes())
  result['modes'][mode]={'timelineEntries':len(data),'duration':round(s['total'],3),'empty':sum(q['bottom'] is None for q in stats),'clipped':sum(q['clip'] for q in stats),'maxComponentsAbove64px':max(q['components'] for q in stats),'floorMin':min(q['bottom'] for q in stats),'floorMax':max(q['bottom'] for q in stats),'sameFirstLast':pixels[0]==pixels[-1]}
  if mode=='motion':
   proc=subprocess.Popen(['ffmpeg','-y','-loglevel','error','-f','rawvideo','-pixel_format','rgb24','-video_size',f'{W}x{H}','-framerate','24','-i','-','-c:v','libx264','-crf','20','-pix_fmt','yuv420p','-movflags','+faststart',str(out/'rest-preview.mp4')],stdin=subprocess.PIPE);i=0
   for k in range(round(s['total']*24)):
    t=k/24
    while i<len(s['timeline'])-1 and t>=s['timeline'][i]['end']:i+=1
    proc.stdin.write(rgb[i].tobytes())
   proc.stdin.close();assert proc.wait()==0
   sheet=Image.new('RGB',(6*240,4*232),'#f5f3eb');d=ImageDraw.Draw(sheet)
   for j,i in enumerate(np.linspace(0,len(rgb)-1,24).astype(int)):
    x=j%6*240;y=j//6*232;sheet.paste(rgb[i].resize((240,216)),(x,y));d.text((x+5,y+217),f'{times[i]:.2f}s',fill='#203b30')
   sheet.save(out/'browser-contact.jpg',quality=90);page.evaluate('inspectPose(poseState().total*.48)');page.screenshot(path=str(out/'viewer.png'))
 b.close()
result['hashes']={str(f.relative_to(root)):hashlib.sha256(f.read_bytes()).hexdigest() for f in [root/'anchors.webp',root/'motion.webp',root/'manifest.json',root/'player.js',root/'index.html',out/'rest-preview.mp4',out/'browser-contact.jpg']};(root/'validation.json').write_text(json.dumps(result,indent=2)+'\n');print(json.dumps(result,indent=2))
