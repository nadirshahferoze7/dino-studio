/* v0.5.1: planted-foot trajectory, knee bend, rigid foot and bounded upper-body motion.
 * Uses original profile atlas; hidden leg remains a shaded reconstruction. */
function gaitFoot(p,run){p=((p%1)+1)%1;const stance=run?.42:.64,A=run?24:17,H=run?19:10;if(p<stance)return {x:A*(1-2*p/stance),lift:0,contact:true,knee:0};const q=(p-stance)/(1-stance),z=Math.sin(Math.PI*q);return {x:-A*Math.cos(Math.PI*q),lift:H*z*z,contact:false,knee:(run?10:5)*z*z};}
function gaitPose(p,run){const a=gaitFoot(p,run),b=gaitFoot(p+.5,run);return {a,b,bob:run?-Math.min(a.lift,b.lift)*.7-1.6*Math.cos(4*Math.PI*p):-1.5*Math.cos(4*Math.PI*p),arm:Math.cos(2*Math.PI*p)*(run?3:1.7),tail:Math.sin(2*Math.PI*p-.8)*(run?4:2)};}
const gaitLayer=(()=>{let a=document.createElement('canvas');a.width=a.height=384;return a;})();
const gaitBody=(()=>{let a=document.createElement('canvas');a.width=a.height=384;return a;})();
function drawGait(ctx,p,run){const g=gaitPose(p,run),a=gaitLayer.getContext('2d');a.clearRect(0,0,384,384);a.drawImage(ctx.canvas,0,0);ctx.clearRect(0,0,384,384);
 const body=gaitBody.getContext('2d');body.clearRect(0,0,384,384);body.drawImage(gaitLayer,0,0);
 // Local inverse displacement: small bounded movement rather than a detached arm cutout.
 const x0=75,y0=180,W=200,H=98,im=body.getImageData(x0,y0,W,H),src=new Uint8ClampedArray(im.data),dst=im.data;
 const bump=(x,c,r)=>{const t=(x-c)/r;return Math.abs(t)<1?(1-t*t)**2:0};
 for(let j=0;j<H;j++)for(let i=0;i<W;i++){let x=x0+i,y=y0+j;let dx=g.arm*bump(x,218,34)*bump(y,228,36),dy=g.tail*bump(x,105,38)*bump(y,239,35);if(Math.abs(dx)+Math.abs(dy)<.001)continue;let xx=Math.max(0,Math.min(W-1,i-dx)),yy=Math.max(0,Math.min(H-1,j-dy)),ix=Math.floor(xx),iy=Math.floor(yy),fx=xx-ix,fy=yy-iy;for(let k=0;k<4;k++){let v=(j*W+i)*4+k;dst[v]=src[(iy*W+ix)*4+k]*(1-fx)*(1-fy)+src[(iy*W+Math.min(W-1,ix+1))*4+k]*fx*(1-fy)+src[(Math.min(H-1,iy+1)*W+ix)*4+k]*(1-fx)*fy+src[(Math.min(H-1,iy+1)*W+Math.min(W-1,ix+1))*4+k]*fx*fy;}}
 body.putImageData(im,x0,y0);
 // Continuous upper leg, a short rigid foot region and matching ankle endpoint.
 function leg(f,far){ctx.save();if(far)ctx.filter='brightness(.80)';const top=278,ankle=320,bottom=340,L=ankle-top;
 function offset(t){const z=t*t*(3-2*t);return f.x*z-f.knee*Math.sin(Math.PI*t)+(far?-3:0)*z;}
 for(let y=top;y<ankle;y++){let t=(y-top)/L,t2=(y+1-top)/L,yy=y+g.bob*(1-t)-f.lift*t,yy2=y+1+g.bob*(1-t2)-f.lift*t2;ctx.drawImage(gaitLayer,163,y,84,1,163+offset(t),yy,84,Math.max(.5,yy2-yy+.6));}
 ctx.drawImage(gaitLayer,163,ankle,84,bottom-ankle,163+offset(1),ankle-f.lift,84,bottom-ankle);ctx.restore();}
 leg(g.b,true);ctx.drawImage(gaitBody,0,0,384,286,0,g.bob,384,286);leg(g.a,false);ctx.drawImage(gaitBody,0,0,384,278,0,g.bob,384,278);
}
