/* DINO v0.3. Front-view eye controls. Uses original iris pixels, not replacement eyes. */
const eyeDefs=[{x:161.5,y:96,side:-1},{x:226,y:96,side:1}];
function eyeSmooth(a,b,x){let t=Math.max(0,Math.min(1,(x-a)/(b-a)));return t*t*(3-2*t)}
function eyePose(n,key){let u=n/72,p=u*2*Math.PI,env=eyeSmooth(0,.22,u)*(1-eyeSmooth(.78,1,u));return {a:(key==='wave'?-4*env:1.4*Math.sin(p))*Math.PI/180,dy:1.1*Math.sin(p)};}
function eyePath(side){let p=new Path2D();p.moveTo(-18,16);p.bezierCurveTo(-22,4,-17,-16,-6,-18);p.bezierCurveTo(8,-22,18,-13,19,0);p.bezierCurveTo(20,9,16,17,12,18);p.bezierCurveTo(2,19,-10,19,-18,16);return p;}
function drawEyes(ctx,n,key,gx,gy,blink){if(key!=='wave'&&key!=='idle')return;if(Math.abs(gx)+Math.abs(gy)+blink<.001)return;const pose=eyePose(n,key);const original=document.createElement('canvas');original.width=384;original.height=384;original.getContext('2d').drawImage(ctx.canvas,0,0);
 for(const e of eyeDefs){const dx=e.x-192,dy=e.y-144;const cx=192+Math.cos(pose.a)*dx-Math.sin(pose.a)*dy,cy=144+Math.sin(pose.a)*dx+Math.cos(pose.a)*dy+pose.dy;
 const eye=eyePath(e.side);ctx.save();ctx.translate(cx,cy);ctx.rotate(pose.a);ctx.scale(e.side===1?-1:1,1);ctx.clip(eye);
 // Displace the existing iris/sclera with bounded strip resampling, fading to zero at the boundary.
 const src=document.createElement('canvas');src.width=48;src.height=48;let s=src.getContext('2d');s.translate(24,24);s.scale(e.side===1?-1:1,1);s.rotate(-pose.a);s.translate(-cx,-cy);s.drawImage(original,0,0);
 let im=s.getImageData(0,0,48,48),out=s.createImageData(48,48),a=im.data,b=out.data;for(let y=0;y<48;y++)for(let x=0;x<48;x++){const X=x-24,Y=y-24;let w=Math.max(0,1-(X/20)**2-(Y/20)**2);w=Math.min(1,w*1.7);let xx=Math.max(0,Math.min(47,x-gx*4*w*(e.side===1?-1:1))),yy=Math.max(0,Math.min(47,y-gy*3*w));let ix=Math.floor(xx),iy=Math.floor(yy),fx=xx-ix,fy=yy-iy;for(let k=0;k<4;k++){let i=(y*48+x)*4+k;b[i]=a[(iy*48+ix)*4+k]*(1-fx)*(1-fy)+a[(iy*48+Math.min(47,ix+1))*4+k]*fx*(1-fy)+a[(Math.min(47,iy+1)*48+ix)*4+k]*(1-fx)*fy+a[(Math.min(47,iy+1)*48+Math.min(47,ix+1))*4+k]*fx*fy;}}
 s.resetTransform();s.putImageData(out,0,0);if(Math.abs(gx)+Math.abs(gy)>.001)ctx.drawImage(src,-24,-24);
 if(blink>.001){let y=-22+40*blink;let lid=new Path2D();lid.moveTo(-24,-25);lid.lineTo(24,-25);lid.lineTo(24,y-2);lid.quadraticCurveTo(0,y+5,-24,y-2);lid.closePath();let g=ctx.createLinearGradient(0,-22,0,20);g.addColorStop(0,'#729b3d');g.addColorStop(.34,'#a1c75c');g.addColorStop(.7,'#8bb34c');g.addColorStop(1,'#688b37');ctx.fillStyle=g;ctx.fill(lid);ctx.save();ctx.clip(lid);let shine=ctx.createRadialGradient(-6,-9,1,-4,-7,21);shine.addColorStop(0,'rgba(214,235,151,.25)');shine.addColorStop(1,'rgba(214,235,151,0)');ctx.fillStyle=shine;ctx.fillRect(-24,-24,48,48);ctx.restore();ctx.strokeStyle='#49542b';ctx.lineWidth=1.5;ctx.lineCap='round';let line=Math.min(y,13);ctx.beginPath();ctx.moveTo(-17,line-2);ctx.quadraticCurveTo(0,line+4,17,line-2);ctx.stroke();}
 ctx.restore();}
}
function blinkAt(t){const d=Math.abs(t-1.35);return d>=.16?0:Math.pow(Math.cos(d/.16*Math.PI/2),1.3);}
