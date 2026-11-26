/* DINO-001 v0.4: bounded, source-pixel facial deformation. No replacement face. */
const facePresets={happy:[0,0,0,0],gentle:[.72,0,0,0],curious:[.55,2,0,4],concerned:[.80,9,-2,5],delighted:[-.12,-2,1,3],focused:[.80,3,0,-5]};
function faceEase(t){t=Math.max(0,Math.min(1,t));return t*t*(3-2*t)}
function facePose(n,key){let u=n/72,p=u*2*Math.PI,e=faceEase(u/.22)*(1-faceEase((u-.78)/.22));return {a:(key==='wave'?-4*e:1.4*Math.sin(p))*Math.PI/180,dy:1.095*Math.sin(p)};}
function faceMapY(y,from,to){for(let i=0;i<to.length-1;i++){if(y<=to[i+1])return from[i]+(from[i+1]-from[i])*(y-to[i])/(to[i+1]-to[i]);}return y;}
function applyExpression(ctx,n,key,preset){if(key!=='idle'&&key!=='wave')return;if(preset.every(x=>Math.abs(x)<.0001))return;
 const [close,corner,middle,brow]=preset,pose=facePose(n,key),c=Math.cos(pose.a),s=Math.sin(pose.a),py=158.5;
 const x0=136,y0=70,w=114,h=98,im=ctx.getImageData(x0,y0,w,h),src=new Uint8ClampedArray(im.data),dst=im.data;
 function sample(x,y,k){x=Math.max(0,Math.min(w-1,x-x0));y=Math.max(0,Math.min(h-1,y-y0));let i=Math.floor(x),j=Math.floor(y),fx=x-i,fy=y-j,i1=Math.min(i+1,w-1),j1=Math.min(j+1,h-1);return src[(j*w+i)*4+k]*(1-fx)*(1-fy)+src[(j*w+i1)*4+k]*fx*(1-fy)+src[(j1*w+i)*4+k]*(1-fx)*fy+src[(j1*w+i1)*4+k]*fx*fy;}
 for(let j=0;j<h;j++)for(let i=0;i<w;i++){let X=x0+i,Y=y0+j,dx=X-192,dy=Y-py-pose.dy,x=192+c*dx+s*dy,y=py-s*dx+c*dy,sy=y;
  // Compress or expand the existing mouth opening; cheek movement changes its corner height.
  let q=Math.abs((x-194)/34),edge=1-faceEase((q-.88)/.42);
  if(y>118&&y<161&&edge>0){let z=Math.min(1,q),arc=Math.sqrt(Math.max(0,1-z*z));let top=126+7*arc,bot=126+27*arc;let mid=(top+bot)/2,shift=corner*z*z+middle*(1-z*z);let f=1-close*edge;
   let a=mid+(top-mid)*f+shift*edge,b=mid+(bot-mid)*f+shift*edge;a=Math.max(119,Math.min(157,a));b=Math.max(a+.4,Math.min(159,b));if(bot-top>.3)sy=faceMapY(y,[118,top,bot,161],[118,a,b,161]);else sy=y-shift*edge*Math.sin(Math.PI*(y-118)/43);
  }
  // Subtle inner-brow lift/lower, only above the original iris.
  if(y>=73&&y<=100&&brow){let a=Math.exp(-Math.pow((x-173)/10,2)-Math.pow((y-81)/8,2))+Math.exp(-Math.pow((x-215)/10,2)-Math.pow((y-81)/8,2));sy-=brow*a*Math.sin(Math.PI*(y-73)/27);}
  if(Math.abs(sy-y)<.0001)continue;let sx=192+c*(x-192)-s*(sy-py),yy=py+pose.dy+s*(x-192)+c*(sy-py);let z=(j*w+i)*4;for(let k=0;k<4;k++)dst[z+k]=Math.round(sample(sx,yy,k));
 }
 ctx.putImageData(im,x0,y0);
}
