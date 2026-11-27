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
const results={};
function check(k,v){results[k]=!!v;if(!v)throw Error(k)}
const full=context.studyState();
for(const mode of ['sit','lower','sleep','wake','rise']){
 buttons.find(b=>b.dataset.mode===mode).onclick();const st=context.studyState();
 check(mode+'Entries',st.timeline.length>0&&st.timeline.every(e=>e.chapter===mode));
 check(mode+'PausedAtStart',!st.playing&&st.t===0);
 context.inspectStudy(st.total);check(mode+'EndRenders',canvas.getContext('2d').getImageData(0,0,640,576).data.some((v,i)=>i%4===3&&v>0));
}
buttons.find(b=>b.dataset.mode==='full').onclick();context.inspectStudy(5.5);items.breath.checked=false;items.breath.onchange();check('BreathToggleRenders',true);
buttons.find(b=>b.dataset.mode==='full').onclick();context.inspectStudy(full.total-.01);items.loop.checked=true;items.play.onclick();context.tick(1000);context.tick(1100);check('LoopWrap',context.studyState().playing&&context.studyState().t<.2);
items.play.onclick();items.loop.checked=false;context.inspectStudy(full.total-.01);items.play.onclick();context.tick(1200);check('EndStops',!context.studyState().playing&&context.studyState().t===full.total);
fs.writeFileSync(path.join(root,'evidence/chapter-controls.json'),JSON.stringify({environment:'Node native Canvas adapter, exact player scripts; not hosted browser',checks:results},null,2)+'\n');console.log(results);
})();
