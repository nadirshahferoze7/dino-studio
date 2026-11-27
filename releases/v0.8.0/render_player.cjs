/* Render the exact player with a native Canvas implementation, not Chromium.
   node releases/v0.8.0/render_player.cjs /scratch/frame-directory
   Dependencies: @napi-rs/canvas, Node, FFmpeg. Browser testing is separate. */
const fs=require('fs'),path=require('path'),vm=require('vm'),cp=require('child_process');
const {createCanvas,Image}=require('@napi-rs/canvas');
const root=__dirname,out=path.resolve(process.argv[2]);fs.mkdirSync(out,{recursive:true});
const canvas=createCanvas(640,576),items={stage:canvas};
for(const id of ['play','restart','prev','next','speed','loop','breath','seek','status'])items[id]={value:id==='speed'?'1':'0',checked:id==='breath',textContent:'',onclick:null};
const buttons=['full','sit','lower','sleep','wake','rise','poses'].map(mode=>({dataset:{mode},classList:{toggle(){}}}));
class LocalImage extends Image{set src(v){super.src=fs.readFileSync(path.join(root,v));}}
const context={Image:LocalImage,document:{getElementById:id=>items[id],querySelectorAll:()=>buttons},requestAnimationFrame(){},console};context.window=context;vm.createContext(context);
vm.runInContext(fs.readFileSync(path.join(root,'timeline.js'),'utf8'),context);
vm.runInContext(fs.readFileSync(path.join(root,'player.js'),'utf8'),context);
(async()=>{for(let i=0;i<100&&!context.studyState().ready;i++)await new Promise(r=>setTimeout(r,20));if(!context.studyState().ready)throw Error('atlas not loaded');
const state=context.studyState(),fps=24,N=Math.round(state.total*fps);
for(let k=0;k<N;k++){context.inspectStudy(k/fps);fs.writeFileSync(path.join(out,`${String(k).padStart(4,'0')}.png`),canvas.toBuffer('image/png'));}
context.inspectStudy(0);const first=Buffer.from(canvas.getContext('2d').getImageData(0,0,640,576).data);context.inspectStudy(state.total);const last=Buffer.from(canvas.getContext('2d').getImageData(0,0,640,576).data);
const r=cp.spawnSync('ffmpeg',['-y','-loglevel','error','-framerate','24','-i',path.join(out,'%04d.png'),'-filter_complex','color=c=0xf5f3eb:s=640x576:r=24[bg];[bg][0:v]overlay=shortest=1:format=auto,format=yuv420p','-c:v','libx264','-crf','18','-pix_fmt','yuv420p','-movflags','+faststart',path.join(root,'evidence/player-preview.mp4')]);if(r.status!==0)throw Error(r.stderr.toString());
const checks={};
function check(name,cond){checks[name]=!!cond;if(!cond)throw Error('Control failed: '+name)}
context.inspectStudy(0);items.play.onclick();check('play',context.studyState().playing);items.play.onclick();check('pause',!context.studyState().playing);
items.next.onclick();check('next',context.studyState().t>0);items.prev.onclick();check('previous',context.studyState().t<.01);
items.seek.value='500';items.seek.oninput();check('seek',Math.abs(context.studyState().t-state.total/2)<.001);
items.restart.onclick();check('replay',context.studyState().playing&&context.studyState().t===0);items.play.onclick();
buttons.find(b=>b.dataset.mode==='poses').onclick();check('sourceMode',context.studyState().timeline.length===24);
buttons.find(b=>b.dataset.mode==='full').onclick();check('studyMode',context.studyState().total===state.total);
fs.writeFileSync(path.join(root,'evidence/player-render.json'),JSON.stringify({environment:'Node native Canvas, exact player.js/timeline.js; not a browser UI test',frames:N,fps,total:state.total,controlChecks:checks,firstLastPixelIdentical:first.equals(last)},null,2)+'\n');console.log('Rendered exact player',N,'frames. First/last identical:',first.equals(last));
})();
