/* Side-view source-art gait. Source frame is 384 square. */
function gaitFoot(p,run){p=((p%1)+1)%1;const stance=run?.40:.62,A=run?28:20,H=run?25:13;if(p<stance)return {x:A*(1-2*p/stance),lift:0,contact:true};const q=(p-stance)/(1-stance);return {x:-A*Math.cos(Math.PI*q),lift:H*Math.sin(Math.PI*q)**1.3,contact:false};}
function gaitPose(p,run){const a=gaitFoot(p,run),b=gaitFoot(p+.5,run);return {a,b,bob:run? -Math.min(a.lift,b.lift)*.6-2*Math.sin(4*Math.PI*p): -2*Math.cos(4*Math.PI*p)};}
const gaitLayer=(()=>{const a=document.createElement('canvas');a.width=a.height=384;return a;})();
function drawGait(ctx,p,run){const g=gaitPose(p,run),a=gaitLayer.getContext('2d');a.clearRect(0,0,384,384);a.drawImage(ctx.canvas,0,0);ctx.clearRect(0,0,384,384);
 function leg(f,far){ctx.save();if(far)ctx.filter='brightness(.80)';const top=278,bottom=340,L=bottom-top;for(let y=top;y<bottom;y++){const t=(y-top)/L,t2=(y+1-top)/L;const z=Math.min(1,t/.70);const bend=z*z*(3-2*z);let xx=f.x*bend+(far?-3:0)*t;let yy=y+g.bob*(1-t)-f.lift*t;let yy2=y+1+g.bob*(1-t2)-f.lift*t2;ctx.drawImage(gaitLayer,163,y,84,1,163+xx,yy,84,Math.max(.4,yy2-yy+.45));}ctx.restore();}
 leg(g.b,true);ctx.drawImage(gaitLayer,0,0,384,286,0,g.bob,384,286);leg(g.a,false);
 ctx.drawImage(gaitLayer,0,0,384,278,0,g.bob,384,278);
}
