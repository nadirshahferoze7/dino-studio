from pathlib import Path
from playwright.sync_api import sync_playwright
from PIL import Image,ImageDraw
import cv2,numpy as np,base64,io,json,subprocess,hashlib,sys
root=Path(__file__).resolve().parent;out=Path(sys.argv[1]) if len(sys.argv)>1 else root/'evidence';out.mkdir(exist_ok=True,parents=True)
result={'status':'review candidate','renderMethod':'Actual local Chromium viewer, exact script and atlas bytes inlined after file URL blocked','modes':{},'controls':{},'errors':[]}
with sync_playwright() as p:
 b=p.chromium.launch(executable_path='/usr/bin/chromium',args=['--no-sandbox','--disable-gpu','--allow-file-access-from-files']);page=b.new_page(viewport={'width':1000,'height':1000});page.on('pageerror',lambda e:result['errors'].append(str(e)));assets={f.name:'data:image/webp;base64,'+base64.b64encode(f.read_bytes()).decode() for f in root.glob('*.webp')};js=(root/'player.js').read_text().replace('im.src=name','im.src=assetURLs[name]||name').replace("$('sheet').src=specs[name].atlas","$('sheet').src=assetURLs[specs[name].atlas]||specs[name].atlas");html=(root/'index.html').read_text().replace('<script src="player.js"></script>','<script>const assetURLs='+json.dumps(assets)+';'+js+'</script>');page.set_content(html);page.wait_for_function('spriteState().ready');page.evaluate('inspectSprite(0)');result['controls']['pause']=not page.evaluate('spriteState().playing');page.locator('#restart').click();page.wait_for_timeout(200);result['controls']['replay']=page.evaluate('spriteState().clock>0&&spriteState().playing');page.locator('#play').click();page.locator('#seek').evaluate('(e)=>{e.value=500;e.dispatchEvent(new Event("input"))}');result['controls']['scrub']=abs(page.evaluate('spriteState().clock/spriteState().total')-.5)<.01;before=page.evaluate('spriteState().clock');page.locator('#next').click();result['controls']['next']=page.evaluate('spriteState().clock')>before;page.locator('#prev').click();result['controls']['prev']=page.evaluate('spriteState().clock')<=before+.01;page.locator('#smooth').uncheck();result['controls']['sourceOnly']=all('-mid' not in x['atlas'] for x in page.evaluate('spriteState().timeline'));page.locator('#smooth').check();result['controls']['interpolated']=any('-mid' in x['atlas'] for x in page.evaluate('spriteState().timeline'));page.locator('#speed').select_option('0.5');result['controls']['speed']=page.locator('#speed').input_value()=='0.5';page.locator('#speed').select_option('1');page.locator('#loop').check();result['controls']['loop']=page.locator('#loop').is_checked();page.locator('#loop').uncheck();page.set_viewport_size({'width':390,'height':844});result['controls']['mobile']=page.evaluate('document.documentElement.scrollWidth<=innerWidth');page.set_viewport_size({'width':1000,'height':1000})
 for name in ('rest','floor','speech'):
  page.locator(f'[data-mode={name}]').click();page.wait_for_function(f'spriteState().ready&&spriteState().mode=="{name}"');page.evaluate('inspectSprite(0)');s=page.evaluate('spriteState()');result['controls'][name+'Mode']=s['mode']==name;times=[x['start']+.00001 for x in s['timeline']];frames=page.evaluate('(ts)=>ts.map(t=>{inspectSprite(t);return document.querySelector("canvas").toDataURL()})',times)
  stats=[];rgb=[];pixels=[]
  for data in frames:
   im=Image.open(io.BytesIO(base64.b64decode(data.split(',')[1]))).convert('RGBA');a=np.array(im)[:,:,3];mask=(a>=128).astype('uint8');n,l,ss,c=cv2.connectedComponentsWithStats(mask);ys,xs=np.where(mask);stats.append({'components':int((ss[1:,4]>64).sum()),'bottom':int(ys.max()) if len(ys) else None,'clip':bool(len(xs) and (xs.min()==0 or xs.max()==383 or ys.min()==0 or ys.max()==383))});bg=Image.new('RGBA',im.size,'#f5f3eb');bg.alpha_composite(im);rgb.append(bg.convert('RGB'));pixels.append(im.tobytes())
  result['modes'][name]={'timelineEntries':len(frames),'duration':round(s['total'],3),'blank':sum(x['bottom'] is None for x in stats),'clipped':sum(x['clip'] for x in stats),'maxComponents':max(x['components'] for x in stats),'floorMin':min(x['bottom'] for x in stats),'floorMax':max(x['bottom'] for x in stats),'sameFirstLastPixels':pixels[0]==pixels[-1]}
  # Render video from exact sampled browser frames, repeated according to their exposure time.
  proc=subprocess.Popen(['ffmpeg','-y','-loglevel','error','-f','rawvideo','-pixel_format','rgb24','-video_size','384x384','-framerate','24','-i','-','-c:v','libx264','-pix_fmt','yuv420p','-movflags','+faststart',str(out/(name+'.mp4'))],stdin=subprocess.PIPE)
  i=0
  for k in range(round(s['total']*24)):
   t=k/24
   while i<len(s['timeline'])-1 and t>=s['timeline'][i]['end']:i+=1
   proc.stdin.write(rgb[i].tobytes())
  proc.stdin.close();assert proc.wait()==0
  ct=Image.new('RGB',(6*192,4*210),'#f5f3eb');d=ImageDraw.Draw(ct)
  for k,i in enumerate(np.linspace(0,len(rgb)-1,24).astype(int)):
   x=k%6*192;y=k//6*210;ct.paste(rgb[i].resize((192,192)),(x,y));d.text((x+4,y+192),f"{times[i]:.2f}s",fill='#203b30')
  ct.save(out/(name+'-render.jpg'));page.evaluate('inspectSprite(spriteState().total*.48)');page.screenshot(path=str(out/(name+'-viewer.png')))
 b.close()
result['assets']={f.name:hashlib.sha256(f.read_bytes()).hexdigest() for f in root.glob('*.webp')};result['sourceSha256']={n:hashlib.sha256((root/n).read_bytes()).hexdigest() for n in ('index.html','player.js','manifest.json')};(out/'validation.json').write_text(json.dumps(result,indent=2));print(json.dumps(result,indent=2))
