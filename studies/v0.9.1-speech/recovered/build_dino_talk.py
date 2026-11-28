from PIL import Image, ImageOps, ImageDraw
import pathlib, json, hashlib, base64
root=pathlib.Path(__file__).parent
source=root/'a_clean_white_background_with_a_neat_4_2_grid_of_e.png'
im=Image.open(source).convert('RGB'); assert im.size==(1536,1024)
poses=['REST','MBP','AH','EE','OH','OO','FV','LTH']
# Entire source cells, no composite body parts. White backdrop retained deliberately.
frames=[im.crop((i%4*384,i//4*512,(i%4+1)*384,(i//4+1)*512)) for i in range(8)]
# Hand-authored illustrative silent cues, not audio-derived phoneme alignment.
cues=[('REST',.4),('EE',.15),('LTH',.12),('OH',.25),('REST',.20),('AH',.18),('MBP',.13),('REST',.10),('EE',.20),('OH',.26),('REST',.22),('EE',.15),('LTH',.12),('EE',.19),('FV',.12),('OH',.14),('AH',.16),('FV',.12),('EE',.18),('LTH',.13),('OO',.18),('REST',.5)]
manifest={'version':'v0.9.1-study','source_sha256':hashlib.sha256(source.read_bytes()).hexdigest(),'source_size':source.stat().st_size,'cell':[384,512],'columns':4,'poses':poses,'line':'Hello! I’m Dino. Ready for an adventure?','cues':[{'pose':p,'seconds':s} for p,s in cues],'status':'unapproved silent timing study; no audio synchronization'}
(root/'dino-talk-manifest.json').write_text(json.dumps(manifest,indent=2))
# Quantize cumulative boundaries to 24 fps and inspect exact playback frames.
seq=[]; t=0; end=0
for pose,duration in cues:
 t+=duration; new=round(t*24); seq.extend([frames[poses.index(pose)]]*(new-end));end=new
assert len(seq)==round(sum(d for _,d in cues)*24)
assert seq[0].tobytes()==seq[-1].tobytes()
seq[0].save(root/'DINO_v0.9.1_talking_study.gif',save_all=True,append_images=seq[1:],duration=42,loop=0,disposal=2)
for f in frames: assert f.size==(384,512)
# Local self-contained viewer (same full-cell source and cues).
html='''<!doctype html><meta charset=utf-8><meta name=viewport content="width=device-width,initial-scale=1"><title>DINO speech study</title><style>body{font:16px system-ui;background:#f5f2ea;color:#294438;text-align:center;margin:20px}canvas{display:block;max-width:100%;height:auto;margin:auto;background:white;border-radius:16px}button,select{font:inherit;padding:10px;margin:5px}input{width:min(90%,400px)}</style><h1>Dino • Talking study</h1><p>Silent mouth-cue prototype — not a voice or approved master.</p><canvas width=384 height=512 id=stage></canvas><p id=status>Loading</p><button id=play>Play</button><button id=reset>Replay</button><select id=pose></select><br><input id=seek type=range min=0 max=1000 value=0><p>Hello! I’m Dino. Ready for an adventure?</p><script>const spec=MANIFEST;const $=id=>document.getElementById(id);const ctx=$('stage').getContext('2d'),im=new Image();let t=0,playing=false,last=0,ready=false;let total=0;const cues=spec.cues.map(c=>{total+=c.seconds;return {...c,end:total}});function drawPose(p){const i=spec.poses.indexOf(p);ctx.clearRect(0,0,384,512);ctx.drawImage(im,i%4*384,Math.floor(i/4)*512,384,512,0,0,384,512);$('status').textContent=p;$('pose').value=p}function draw(){if(!ready)return;drawPose((cues.find(c=>t<c.end)||cues.at(-1)).pose);$('seek').value=t/total*1000}function toggle(v){playing=v;$('play').textContent=v?'Pause':'Play'}function tick(n){if(playing){t=Math.min(total,t+(last?Math.min(.1,(n-last)/1000):0));draw();if(t>=total)toggle(false)}last=n;requestAnimationFrame(tick)}for(const p of spec.poses){const o=document.createElement('option');o.value=o.textContent=p;$('pose').append(o)}$('pose').onchange=()=>{toggle(false);if(ready)drawPose($('pose').value)};$('play').onclick=()=>{if(!ready)return;if(t>=total)t=0;toggle(!playing)};$('reset').onclick=()=>{if(!ready)return;t=0;draw();toggle(true)};$('seek').oninput=()=>{toggle(false);t=total*Number($('seek').value)/1000;draw()};im.onload=()=>{ready=true;draw();requestAnimationFrame(tick)};im.onerror=()=>{$('status').textContent='Source missing'};im.src='IMAGE';</script>'''.replace('MANIFEST',json.dumps(manifest)).replace('IMAGE','data:image/png;base64,'+base64.b64encode(source.read_bytes()).decode())
(root/'DINO_v0.9.1_talking_study.html').write_text(html)
print(len(seq),'frames',sum(d for _,d in cues),'seconds; exact start/end source pixels equal')
