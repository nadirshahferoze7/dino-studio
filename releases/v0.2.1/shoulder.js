/* v0.2.1 — pose-adaptive shoulder reconstruction from the original atlas.
   Rebuild only the underarm silhouette with a tangent-matched fillet, then
   extend nearby skin pixels into the new edge. Scarf and face are untouched. */
function shoulderEase(a,b,x){const t=Math.max(0,Math.min(1,(x-a)/(b-a)));return t*t*(3-2*t)}
function shoulderHermite(a,b,m0,m1,t,L){return (2*t*t*t-3*t*t+1)*a+(t*t*t-2*t*t+t)*L*m0+(-2*t*t*t+3*t*t)*b+(t*t*t-t*t)*L*m1}
function connectShoulder(ctx,n){
 const u=n/72,env=shoulderEase(0,.22,u)*(1-shoulderEase(.78,1,u));
 const angle=env*(108+13*Math.sin(8*Math.PI*u));
 const f=shoulderEase(65,96,angle);if(f<.001)return;
 const x0=224,y0=181,W=91,H=34,im=ctx.getImageData(x0,y0,W,H),d=im.data,src=new Uint8ClampedArray(d);
 const pix=(x,y)=>((y-y0)*W+x-x0)*4;
 const edge=y=>{for(let x=x0+W-1;x>=x0;x--)if(src[pix(x,y)+3]>128)return x;return x0};
 // Find a reliable upper-arm edge and the intact lower torso edge in THIS pose.
 let a=187;while(a<196&&edge(a)>245)a++;const b=210,mid=202;
 const xa=edge(a),xb=edge(b),xm=Math.max(edge(203)+1.5,xb-.5);
 if(xa<xm||xa>251)return;
 const m0=Math.max(-3*(xa-xm)/(mid-a),Math.min(0,(edge(a)-edge(a-2))/2));
 const m1=Math.max(0,Math.min(.9,(edge(b+2)-edge(b))/2));
 for(let y=a;y<=b;y++){
  const old=edge(y);const target=y<=mid?shoulderHermite(xa,xm,m0,0,(y-a)/(mid-a),mid-a):shoulderHermite(xm,xb,0,m1,(y-mid)/(b-mid),b-mid);
  const boundary=old+(target-old)*f;
  const seamWeight=f*shoulderEase(a,a+3,y)*(1-shoulderEase(b-4,b,y));
  // Sample the original arm/torso just inside its edge, selecting green skin.
  let rgb=[0,0,0],weight=0;for(let yy=Math.max(a,y-2);yy<=Math.min(b,y+2);yy++){
   const e=edge(yy);for(let x=Math.max(x0,e-7);x<=e-2;x++){
    const i=pix(x,yy);if(src[i+3]>200&&src[i+1]>src[i]*1.06&&src[i+1]>80){const w=1/(1+Math.abs(yy-y));for(let k=0;k<3;k++)rgb[k]+=src[i+k]*w;weight+=w;}
   }
  }
  if(weight)rgb=rgb.map(v=>v/weight);else rgb=[115,149,49];
  for(let x=Math.max(x0,Math.min(old,Math.floor(boundary))-5);x<=Math.min(x0+W-1,Math.max(old,Math.ceil(boundary))+2);x++){
   const i=pix(x,y);const coverage=Math.max(0,Math.min(1,boundary+1-x));const alpha=coverage*255;
   const k=seamWeight*Math.max(0,Math.min(1,(x-(Math.min(old,boundary)-5))/5));
   if(x>old||src[i+3]<128){if(alpha>src[i+3]){for(let c=0;c<3;c++)d[i+c]=rgb[c];d[i+3]=Math.round(alpha);}}
   else {if(alpha<d[i+3])d[i+3]=Math.round(alpha);for(let c=0;c<3;c++)d[i+c]=Math.round(src[i+c]*(1-k)+rgb[c]*k);}
  }
 }
 ctx.putImageData(im,x0,y0);
}
