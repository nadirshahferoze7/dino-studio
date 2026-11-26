"""Render the actual static viewer with exact source dependencies inlined. No GPU/service needed."""
from pathlib import Path
from http.server import ThreadingHTTPServer, SimpleHTTPRequestHandler
from functools import partial
from threading import Thread
from playwright.sync_api import sync_playwright
from PIL import Image, ImageDraw
import numpy as np, cv2, base64, io, json, hashlib, subprocess, sys, tempfile
root=Path(__file__).resolve().parent; repo=root.parent.parent; out=Path(sys.argv[1]) if len(sys.argv)>1 else root/'evidence';out.mkdir(parents=True,exist_ok=True)
html=(root/'index.html').read_text().replace('<script src="rest.js"></script>','<script>'+(root/'rest.js').read_text()+'</script>').replace('../v0.1/clips/profile_idle.webp','data:image/webp;base64,'+base64.b64encode((root.parent/'v0.1/clips/profile_idle.webp').read_bytes()).decode())
with sync_playwright() as p:
 b=p.chromium.launch(executable_path='/usr/bin/chromium',headless=True,args=['--no-sandbox','--disable-gpu']);page=b.new_page(viewport={'width':960,'height':950});errors=[];responses=[];page.on('pageerror',lambda e:errors.append(str(e)));page.on('response',lambda r:responses.append([r.status,r.url.split('/')[-1]]));page.set_content(html);page.wait_for_function("document.getElementById('status').textContent.includes('Standing')");page.evaluate('inspectRest(0)');controls={}
 for mode,expected in [('sit','Standing'),('sleep','Getting sleepy'),('wake','Waking'),('seated','Seated rest'),('sleeping','Sleeping'),('full','Standing')]:
  page.locator(f'[data-clip={mode}]').click();page.wait_for_timeout(120);controls[mode]=expected in page.locator('#status').inner_text()
 page.locator('#play').click();before=page.locator('#status').inner_text();page.wait_for_timeout(200);controls['pause']=before==page.locator('#status').inner_text();page.locator('#seek').evaluate('(e)=>{e.value=500;e.dispatchEvent(new Event("input"))}');controls['seek']='Sleeping' in page.locator('#status').inner_text();page.locator('#speed').select_option('.5');controls['speed']=page.locator('#speed').input_value()=='.5';page.locator('#restart').click();page.wait_for_timeout(150);controls['replay']='Standing' in page.locator('#status').inner_text();page.locator('#play').click();page.evaluate('inspectRest(7.15)');page.screenshot(path=str(out/'viewer.png'));page.set_viewport_size({'width':390,'height':844});controls['mobileNoHorizontalOverflow']=page.evaluate('document.documentElement.scrollWidth<=innerWidth');page.screenshot(path=str(out/'mobile.png'));page.set_viewport_size({'width':960,'height':950});
 continuity=page.evaluate("""()=>{let samples=0,maxV=0,maxJump=0,rangeErrors=0;const fields=['hx','hy','body','head','tail','rest','sleep','lid','jaw','support'];for(let i=0;i<=1700;i++){let t=i/100,a=pose(t);for(const k of ['rest','sleep','lid','jaw','support'])if(a[k]<-1e-6||a[k]>1+1e-6)rangeErrors++;samples++}for(const key of keys.slice(1,-1)){let t=key[0],h=.0001,a=pose(t-h),b=pose(t),c=pose(t+h);for(const k of fields){let l=(b[k]-a[k])/h,r=(c[k]-b[k])/h;maxJump=Math.max(maxJump,Math.abs(l-r));maxV=Math.max(maxV,Math.abs(l),Math.abs(r))}}let joins={};for(let [a,b] of [['sit','sleep'],['sleep','wake']]){inspectRest(clips[a][1]);let x=document.getElementById('stage').toDataURL();inspectRest(clips[b][0]);joins[a+'To'+b]=x===document.getElementById('stage').toDataURL()}return {samples,rangeErrors,maxKeyVelocityMismatch:maxJump,exactSharedClipBoundaryPixels:joins,wakeJawClosureAt11_15:pose(11.15).jaw,wakeLidClosureAt11_15:pose(11.15).lid}}""");
 frames=page.evaluate('()=>Array.from({length:409},(_,i)=>{inspectRest(i/24);return document.getElementById("stage").toDataURL()})');b.close()
counts=[];bounds=[];empties=0;clips=0;imgs=[];contact=Image.new('RGB',(6*192,5*215),'#f5f3eb');d=ImageDraw.Draw(contact);previous=None;diffs=[];first=None;last=None
proc=subprocess.Popen(['ffmpeg','-y','-loglevel','error','-f','rawvideo','-pixel_format','rgb24','-video_size','384x384','-framerate','24','-i','-','-c:v','libx264','-pix_fmt','yuv420p','-movflags','+faststart',str(out/'DINO_v0.6.4_rest.mp4')],stdin=subprocess.PIPE)
for i,frame in enumerate(frames):
 im=Image.open(io.BytesIO(base64.b64decode(frame.split(',')[1]))).convert('RGBA');a=np.array(im)[:,:,3];mask=(a>=128).astype('uint8');n,_,stats,_=cv2.connectedComponentsWithStats(mask);counts.append(int(np.sum(stats[1:,cv2.CC_STAT_AREA]>20)));ys,xs=np.where(mask>0)
 if not len(xs):empties+=1
 else:
  bounds.append([int(xs.min()),int(ys.min()),int(xs.max()),int(ys.max())]);clips+=int(xs.min()==0 or xs.max()==383 or ys.min()==0 or ys.max()==383)
 bg=Image.new('RGBA',(384,384),'#f5f3eb');bg.alpha_composite(im);rgb=bg.convert('RGB');proc.stdin.write(rgb.tobytes());px=np.asarray(rgb).astype('int16');
 if previous is not None:diffs.append(float(np.abs(px-previous).mean()))
 previous=px
 if i==0:first=im.tobytes()
 if i==408:last=im.tobytes()
 if i%4==0:imgs.append(rgb.resize((288,288)))
 if i%16==0 and i<408:
  j=i//16;contact.paste(rgb.resize((192,192)),((j%6)*192,(j//6)*215));d.text(((j%6)*192+8,(j//6)*215+194),f'{i/24:.2f}s',fill='black')
proc.stdin.close();assert proc.wait()==0
imgs[0].save(out/'DINO_v0.6.4_rest.gif',save_all=True,append_images=imgs[1:],duration=167,loop=0,optimize=True);contact.save(out/'contact.jpg')
result={'status':'review candidate; owner approval pending','browser':'Chromium CPU, exact viewer with script and source atlas inlined; URL navigation blocked by environment','frames':len(frames),'continuity':continuity,'fps':24,'jsErrors':errors,'controls':controls,'assetHTTP':responses,'emptyFrames':empties,'canvasClippingFrames':clips,'foregroundComponentsAbove20px':{'min':min(counts),'max':max(counts)},'groundAlpha128':{'minBottom':min(x[3] for x in bounds),'maxBottom':max(x[3] for x in bounds)},'standRecoveryIdentical':first==last,'maxAdjacentMeanRgbDifference':round(max(diffs),4),'sourceAtlasSha256':hashlib.sha256((root.parent/'v0.1/clips/profile_idle.webp').read_bytes()).hexdigest(),'rendererSha256':hashlib.sha256((root/'rest.js').read_bytes()).hexdigest(),'viewerSha256':hashlib.sha256((root/'index.html').read_bytes()).hexdigest()}
(out/'validation.json').write_text(json.dumps(result,indent=2)+'\n');print(json.dumps(result,indent=2))
