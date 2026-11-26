/* v0.4.1: targeted concern repair. Coordinates in the original front-view frame.
   Nose and outer muzzle never enter the deformation field. */
function drawConcern(ctx,n,key,amount){
 if(!['idle','wave'].includes(key)||amount<.0001)return;
 const pose=facePose(n,key),c=Math.cos(pose.a),s=Math.sin(pose.a),py=158.5;
 const x0=136,y0=70,w=114,h=98,im=ctx.getImageData(x0,y0,w,h),src=new Uint8ClampedArray(im.data),dst=im.data;
 const bump=(v,center,r)=>{let q=Math.abs((v-center)/r);return q>=1?0:(1-q*q)**2};
 const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
 for(let j=0;j<h;j++)for(let i=0;i<w;i++){
  const X=x0+i,Y=y0+j,dx=X-192,dy=Y-py-pose.dy,x=192+c*dx+s*dy,y=py-s*dx+c*dy;
  // Raise inner brow skin, not the iris or nose. Small, smoothly bounded shift.
  const brow=3.8*(bump(x,174,13)+bump(x,214,13))*bump(y,81,9);
  // Reduce lower mouth opening locally, leaving upper lip, nostrils and cheeks fixed.
  const mouth=bump(x,194,29)*bump(y,146,11);
  const corners=0.9*(bump(x,169,8)+bump(x,219,8))*bump(y,136,7);
  const shift=amount*(brow-3.5*mouth-corners);
  if(Math.abs(shift)<.0001)continue;
  const sy=y+shift,sx=clamp(192+c*(x-192)-s*(sy-py)-x0,0,w-1),yy=clamp(py+pose.dy+s*(x-192)+c*(sy-py)-y0,0,h-1);
  const ix=Math.floor(sx),iy=Math.floor(yy),fx=sx-ix,fy=yy-iy,i1=Math.min(w-1,ix+1),j1=Math.min(h-1,iy+1);
  for(let k=0;k<4;k++)dst[(j*w+i)*4+k]=Math.round(src[(iy*w+ix)*4+k]*(1-fx)*(1-fy)+src[(iy*w+i1)*4+k]*fx*(1-fy)+src[(j1*w+ix)*4+k]*(1-fx)*fy+src[(j1*w+i1)*4+k]*fx*fy);
 }
 ctx.putImageData(im,x0,y0);
}
