/* DINO-001 rest rig: layered approved profile source plus reconstructed hidden joints. */
const clamp=(x,a=0,b=1)=>Math.max(a,Math.min(b,x)),mix=(a,b,t)=>a+(b-a)*t,ease=x=>{x=clamp(x);return x*x*(3-2*x)},rad=x=>x*Math.PI/180;
// Single 17-second performance; monotone cubic interpolation preserves velocity through intermediate keys.
// time, hip x/y, torso, head, tail, knee fold, curl, lid closure, jaw relaxation, hand support
const keys=[
[0,210,282,0,0,0,0,0,0,0,0],[.6,210,282,0,0,0,0,0,0,0,0],
[1.15,213,289,7,1,-5,.13,0,.04,.06,.02],[1.8,202,303,8,3,-18,.58,0,.12,.24,.04],
[2.65,186,319,-7,1,-33,1,0,.08,.43,.06],[3.2,185,320,-8,0,-34,1,0,.12,.49,.06],
[3.8,186,319,-3,5,-35,1,.025,.29,.64,.12],[4.45,184,316,15,8,-37,1,.17,.55,.83,.36],
[5.15,173,308,40,13,-41,1,.42,.83,.96,.78],[5.95,158,293,76,25,-45,1,.78,.99,1,1],
[6.8,150,277,103,34,-49,1,1,1,1,1],[10,150,277,103,34,-49,1,1,1,1,1],
[10.55,150,277,103,25,-49,1,1,.99,1,1],[11.15,154,286,90,9,-48,1,.94,.78,.97,1],
[11.9,162,301,63,0,-45,1,.67,.39,.87,.85],[12.65,176,315,26,0,-40,1,.27,.26,.73,.42],
[13.35,186,320,-7,0,-34,1,0,.2,.56,.06],[13.8,186,320,-7,0,-34,1,0,.16,.48,.06],
[14.35,199,310,10,4,-26,.77,0,.10,.4,.05],[15.2,211,294,11,2,-11,.32,0,.04,.22,.02],
[16.15,210,282,0,0,0,0,0,0,0,0],[17,210,282,0,0,0,0,0,0,0,0]];
const duration=17;
const phases=[[0,'Standing'],[.6,'Anticipate and bend'],[2.65,'Seated rest'],[3.8,'Getting sleepy'],[4.45,'Transfer weight onto forelimbs'],[6.8,'Sleeping · slow breathing'],[10,'Waking · head first'],[11.15,'Push up through forelimbs'],[13.35,'Seated recovery'],[13.8,'Stand up'],[16.15,'Standing · recovered']];
const clips={full:[0,duration],sit:[0,3.8],sleep:[3.8,10],wake:[10,duration],seated:[2.65,3.8],sleeping:[7.15,10]};
function tangent(i,j){if(i===0||i===keys.length-1)return 0;let a=keys[i-1],b=keys[i],c=keys[i+1],d=(b[j]-a[j])/(b[0]-a[0]),e=(c[j]-b[j])/(c[0]-b[0]);if(d*e<=0)return 0;let h=b[0]-a[0],k=c[0]-b[0];return 3*(h+k)/((2*k+h)/d+(k+2*h)/e)}
function pose(t){t=clamp(t,0,duration);let i=0;while(i<keys.length-2&&t>keys[i+1][0])i++;let a=keys[i],b=keys[i+1],h=b[0]-a[0],u=(t-a[0])/h,u2=u*u,u3=u2*u;let [hx,hy,body,head,tail,rest,sleep,lid,jaw,support]=a.slice(1).map((v,k)=>{let j=k+1;return (2*u3-3*u2+1)*v+(u3-2*u2+u)*h*tangent(i,j)+(-2*u3+3*u2)*b[j]+(u3-u2)*h*tangent(i+1,j)});let breath=Math.sin((t-6.8)*Math.PI*2/2.8)*ease((t-6.8)/.4)*(1-ease((t-9.65)/.35));let seated=ease((t-2.65)/.35)*(1-ease((t-3.5)/.3))+ease((t-13.35)/.2)*(1-ease((t-13.65)/.15));breath+=seated*.45*Math.sin(t*2.2);let lift=9*ease((t-10)/.55)*(1-ease((t-10.55)/1.4));lid=Math.max(lid,.94*Math.exp(-Math.pow((t-3.08)/.115,2)),.85*Math.exp(-Math.pow((t-13.62)/.105,2)));return {hx,hy,body,head,tail,rest,sleep,lid,jaw,support,breath,lift};}
function rotate(x,y,a){let c=Math.cos(rad(a)),s=Math.sin(rad(a));return [c*x-s*y,s*x+c*y]}
function makeRenderer(atlas){let src=document.createElement('canvas');src.width=src.height=384;let sc=src.getContext('2d');sc.drawImage(atlas,0,0,384,384,0,0,384,384);
 function layer(path){let c=document.createElement('canvas');c.width=c.height=384;let x=c.getContext('2d');x.clip(new Path2D(path));x.drawImage(src,0,0);return c}
 const head=layer('M143 48 H295 V156 Q268 161 232 167 L230 177 H178 V161 L143 157 Z');
 const hc=head.getContext('2d'),hd=hc.getImageData(0,0,384,384);for(let y=163;y<177;y++)for(let x=177;x<232;x++){let i=(y*384+x)*4;if(hd.data[i]>hd.data[i+1]*1.38&&hd.data[i]>hd.data[i+2]*1.32)hd.data[i+3]=0}hc.putImageData(hd,0,0);
 const tail=layer('M90 209 H157 L170 228 Q183 233 183 252 L183 282 L176 293 H90 Z');
 const ta=tail.getContext('2d'),tg=ta.createLinearGradient(165,0,184,0);tg.addColorStop(0,'#000');tg.addColorStop(1,'#0000');ta.globalCompositeOperation='destination-in';ta.fillStyle=tg;ta.fillRect(0,0,384,384);ta.globalCompositeOperation='source-over';
 const torso=layer('M179 163 L240 159 Q260 165 265 197 L260 220 Q260 263 240 285 Q223 300 200 295 Q176 291 172 274 Q166 257 168 232 Q169 211 169 193 Q170 174 179 163 Z');
 const arm=layer('M193 187 Q205 182 216 188 Q218 199 210 215 L204 241 Q202 251 194 253 Q184 254 178 248 Q173 244 177 225 L181 204 Q185 192 193 187 Z');
 const foot=layer('M171 310 Q189 309 207 309 Q219 310 230 315 Q241 321 241 338 L164 342 Z');
 const ft=foot.getContext('2d'),fg=ft.createLinearGradient(169,0,193,0);fg.addColorStop(0,'#0000');fg.addColorStop(1,'#000');ft.globalCompositeOperation='destination-in';ft.fillStyle=fg;ft.fillRect(0,0,384,384);const fa=ft.createLinearGradient(0,308,0,323);fa.addColorStop(0,'#0000');fa.addColorStop(1,'#000');ft.fillStyle=fa;ft.fillRect(0,0,384,384);ft.globalCompositeOperation='source-over';
 
 const bag=layer('M196 240 Q205 236 233 238 L235 262 Q230 281 205 280 L195 271 Z');
 const bc=bag.getContext('2d'),bd=bc.getImageData(0,0,384,384);for(let y=238;y<282;y++)for(let x=195;x<237;x++){let i=(y*384+x)*4;bd.data[i+3]*=ease((bd.data[i]-bd.data[i+1]*1.04)/16)}bc.putImageData(bd,0,0);
 const palm=layer('M174 235 Q190 230 205 237 L204 248 Q195 258 179 250 Z');
 // Inpaint the arm's original location only in the reconstructed torso. Keep the satchel and scarf.
 const tc=torso.getContext('2d');
 const patch=document.createElement('canvas');patch.width=patch.height=384;const pc=patch.getContext('2d');
 // Sample the intact green torso immediately alongside the source arm, extending its actual color and shading across the hidden arm region.
 const sourceData=sc.getImageData(0,0,384,384).data, pd=pc.createImageData(384,384);
 const get=(x,y,k)=>sourceData[(Math.round(clamp(y,0,383))*384+Math.round(clamp(x,0,383)))*4+k];
 for(let y=183;y<=259;y++)for(let x=166;x<=225;x++){let i=(y*384+x)*4;let center=mix(200,185,clamp((y-190)/60)),width=mix(23,19,clamp((y-190)/62)),w=(1-ease((Math.abs(x-center)-width+7)/9))*ease((y-183)/6)*(1-ease((y-250)/9));if(w<=0)continue;let sy=clamp(y,190,235),u=clamp((x-169)/54),sx=clamp(218+u*6,216,225);for(let k=0;k<3;k++){let color=get(sx,sy,k),shade=.84+.16*Math.sin(u*Math.PI*.88);pd.data[i+k]=color*shade;}pd.data[i+3]=w*255;}
 pc.putImageData(pd,0,0);tc.save();tc.globalCompositeOperation='source-atop';tc.drawImage(patch,0,0);tc.restore();
 const face=document.createElement('canvas');face.width=face.height=384;let fc=face.getContext('2d');
 const hctx=head.getContext('2d'),orig=hctx.getImageData(0,0,384,384),plate=fc.createImageData(55,55);
 const sample=(x,y,k)=>orig.data[(clamp(Math.round(y),0,383)*384+clamp(Math.round(x),0,383))*4+k];
 for(let y=0;y<55;y++)for(let x=0;x<55;x++){let gx=x+202,gy=y+65,di=(y*55+x)*4,oi=(gy*384+gx)*4,dist=Math.hypot((gx-232)/24.5,(gy-96)/25.5),w=1-ease((dist-.85)/.18),fy=clamp((gy-73)/45),fx=clamp((gx-207)/46);for(let k=0;k<3;k++){let left=sample(207,gy,k),top=sample(Math.min(gx,239),72,k),bottom=sample(Math.min(gx,247),116,k);let col=mix(left,mix(top,bottom,fy),.28+fx*.58);plate.data[di+k]=mix(orig.data[oi+k],col,w)}plate.data[di+3]=orig.data[oi+3]}
 const plateCanvas=document.createElement('canvas');plateCanvas.width=55;plateCanvas.height=55;plateCanvas.getContext('2d').putImageData(plate,0,0);
 const jawX=232,jawY=119,jawW=54,jawH=47,jawSrc=hctx.getImageData(jawX,jawY,jawW,jawH);
 const mt=[[241,123],[246,124],[251,128],[258,130],[265,131],[272,129],[280,126]],mb=[[241,123],[246,126],[251,133],[258,140],[265,144],[272,147],[280,146]];
 function curve(a,x){let i=0;while(i<a.length-2&&x>a[i+1][0])i++;return mix(a[i][1],a[i+1][1],clamp((x-a[i][0])/(a[i+1][0]-a[i][0])))}
 function closeJaw(q){if(q<.001)return;let dst=fc.createImageData(jawW,jawH);for(let y=0;y<jawH;y++)for(let x=0;x<jawW;x++){let gx=jawX+x,gy=jawY+y,wx=ease((gx-241)/8)*(1-ease((gx-273)/7)),top=curve(mt,gx),bottom=curve(mb,gx),gap=Math.max(0,bottom-top),n=bottom-q*wx*Math.max(0,gap-1.4),end=165;let sy=gy;if(gy>top&&gap>.01){if(gy<=n)sy=top+(gy-top)*gap/Math.max(.1,n-top);else sy=bottom+(gy-n)*(end-bottom)/Math.max(.1,end-n)}sy=clamp(sy-jawY,0,jawH-1);let a=Math.floor(sy),b=Math.min(jawH-1,a+1),f=sy-a,di=(y*jawW+x)*4,ia=(a*jawW+x)*4,ib=(b*jawW+x)*4;let aa=jawSrc.data[ia+3],ab=jawSrc.data[ib+3],al=mix(aa,ab,f);dst.data[di+3]=al;for(let k=0;k<3;k++)dst.data[di+k]=al?mix(jawSrc.data[ia+k]*aa,jawSrc.data[ib+k]*ab,f)/al:0}fc.putImageData(dst,jawX,jawY)}
 function sealMouth(q){let v=ease((q-.67)/.33);if(v<.001)return;fc.save();fc.globalCompositeOperation='source-atop';fc.globalAlpha=v;const g=fc.createLinearGradient(248,126,268,144);g.addColorStop(0,'#edce85');g.addColorStop(.6,'#edcc82');g.addColorStop(1,'#d8b473');fc.fillStyle=g;fc.beginPath();fc.moveTo(244,124);fc.quadraticCurveTo(255,126,273,129);fc.lineTo(275,136);fc.quadraticCurveTo(267,140,259,136);fc.quadraticCurveTo(251,130,244,124);fc.closePath();fc.fill();fc.strokeStyle='#9b713a';fc.lineCap='round';fc.lineWidth=1.3;fc.beginPath();fc.moveTo(245,124.5);fc.quadraticCurveTo(256,132.3,272,130.3);fc.stroke();fc.restore()}
 function drawFace(lid,jaw){fc.clearRect(0,0,384,384);fc.drawImage(head,0,0);closeJaw(jaw);sealMouth(jaw);if(lid<.001)return;
 // Keep the original iris, catchlight and eye placement. A curved lid occludes the actual eye instead of scaling it.
 const q=clamp(lid),w=ease(q/.19),center=mix(79,108,q),right=mix(90,106,q),left=mix(91,104,q);
 fc.save();fc.globalCompositeOperation='source-atop';fc.globalAlpha=w;fc.drawImage(plateCanvas,202,65);fc.restore();
 if(q<.997){fc.save();fc.beginPath();fc.moveTo(211,left+5);fc.bezierCurveTo(216,left-6,228,center-7,240,center);fc.quadraticCurveTo(249,right-3,251,right+3);fc.lineTo(254,115);fc.lineTo(207,115);fc.closePath();fc.clip();fc.globalAlpha=1-ease((q-.93)/.07);fc.drawImage(head,0,0);fc.restore()}
 fc.save();fc.globalCompositeOperation='source-atop';fc.globalAlpha=w;fc.lineCap='round';fc.strokeStyle='#526b31';fc.lineWidth=mix(1.45,1.2,q);fc.beginPath();fc.moveTo(214,left+1);fc.bezierCurveTo(220,mix(81,109,q),234,mix(76,115,q),242,mix(84,110,q));fc.quadraticCurveTo(248,mix(90,108,q),250,right+1);fc.stroke();fc.restore();}
 function transform(ctx,img,at,pivot,angle,sx=1,sy=1){ctx.save();ctx.translate(...at);ctx.rotate(rad(angle));ctx.scale(sx,sy);ctx.translate(-pivot[0],-pivot[1]);ctx.drawImage(img,0,0);ctx.restore()}
 const footPixels=foot.getContext('2d').getImageData(164,304,81,38).data;
 function footAt(ctx,x,y,angle,scale,far=false,draw=true){
  // The entire distal foot is kept rigid; foot placement derived from the real alpha mask.
  let a=rad(angle),bottom=-1e9;const pix=footPixels;
  for(let j=0;j<38;j++)for(let i=0;i<81;i++)if(pix[(j*81+i)*4+3]>=128)bottom=Math.max(bottom,scale*((i+164-207)*Math.sin(a)+(j+304-318)*Math.cos(a)));
  if(draw){ctx.save();if(far)ctx.filter='brightness(.83)';transform(ctx,foot,[x,y-bottom],[207,318],angle,scale,scale);ctx.restore()}return [x,y-bottom];
 }
 function segment(ctx,A,B,r0,r1,far=false){
  const dx=B[0]-A[0],dy=B[1]-A[1],L=Math.max(1,Math.hypot(dx,dy)),angle=Math.atan2(dy,dx);
  ctx.save();ctx.translate(...A);ctx.rotate(angle);const g=ctx.createLinearGradient(0,-Math.max(r0,r1),0,Math.max(r0,r1));
  g.addColorStop(0,far?'#5e8c36':'#6b9b41');g.addColorStop(.36,far?'#79a448':'#98c15d');g.addColorStop(.7,far?'#729b40':'#80ae49');g.addColorStop(1,far?'#456b30':'#5b8938');
  ctx.fillStyle=g;ctx.beginPath();ctx.moveTo(0,-r0);ctx.bezierCurveTo(L*.3,-r0,L*.7,-r1,L,-r1);ctx.bezierCurveTo(L+r1*.7,-r1,L+r1*.8,r1,L,r1);ctx.bezierCurveTo(L*.7,r1,L*.3,r0,0,r0);ctx.bezierCurveTo(-r0*.75,r0,-r0*.75,-r0,0,-r0);ctx.fill();ctx.restore();
 }
 // Piecewise affine source-textured arm mesh. Same art, same hand, shoulder and elbow throughout the entire action.
 function armMesh(ctx,shoulder,elbow,hand,angle,weight){
  const rows=14,cols=5,x0=169,x1=220,y0=181,y1=256;
  const sourceAt=y=>{if(y<=223)return 201+(190-201)*(y-190)/33;return 190+(189-190)*(y-223)/23};
  function curved(y){let t=(y-190)/56;if(t<0){let dx=elbow[0]-shoulder[0],dy=elbow[1]-shoulder[1],l=Math.max(1,Math.hypot(dx,dy));return [shoulder[0]+t*56*dx/l,shoulder[1]+t*56*dy/l]};if(t>1){let dx=hand[0]-elbow[0],dy=hand[1]-elbow[1],l=Math.max(1,Math.hypot(dx,dy));return [hand[0]+(t-1)*56*dx/l,hand[1]+(t-1)*56*dy/l]};let u=1-t;return [u*u*shoulder[0]+2*u*t*elbow[0]+t*t*hand[0],u*u*shoulder[1]+2*u*t*elbow[1]+t*t*hand[1]]}
  function target(x,y){let rr=rotate(x-201,y-190,angle),rigid=[shoulder[0]+rr[0],shoulder[1]+rr[1]],P=curved(y),B=curved(y+.25),A=curved(y-.25),dx=B[0]-A[0],dy=B[1]-A[1],l=Math.max(.01,Math.hypot(dx,dy)),off=x-sourceAt(y),nx=dy/l,ny=-dx/l;return [mix(rigid[0],P[0]+nx*off,weight),mix(rigid[1],P[1]+ny*off,weight)]}
  function tri(a,b,c,A,B,C){let ux=b[0]-a[0],uy=b[1]-a[1],vx=c[0]-a[0],vy=c[1]-a[1],det=ux*vy-uy*vx;if(Math.abs(det)<.0001)return;let U=[B[0]-A[0],B[1]-A[1]],V=[C[0]-A[0],C[1]-A[1]],m0=(U[0]*vy-V[0]*uy)/det,m1=(U[1]*vy-V[1]*uy)/det,m2=(V[0]*ux-U[0]*vx)/det,m3=(V[1]*ux-U[1]*vx)/det;let X=(A[0]+B[0]+C[0])/3,Y=(A[1]+B[1]+C[1])/3;ctx.save();ctx.beginPath();for(const [i,P] of [A,B,C].entries()){let dx=P[0]-X,dy=P[1]-Y,l=Math.max(.1,Math.hypot(dx,dy)),x=P[0]+.45*dx/l,y=P[1]+.45*dy/l;if(i===0)ctx.moveTo(x,y);else ctx.lineTo(x,y)}ctx.closePath();ctx.clip();ctx.transform(m0,m1,m2,m3,A[0]-m0*a[0]-m2*a[1],A[1]-m1*a[0]-m3*a[1]);ctx.drawImage(arm,0,0);ctx.restore()}
  for(let j=0;j<rows;j++)for(let i=0;i<cols;i++){let a=[mix(x0,x1,i/cols),mix(y0,y1,j/rows)],b=[mix(x0,x1,(i+1)/cols),a[1]],c=[b[0],mix(y0,y1,(j+1)/rows)],d=[a[0],c[1]],A=target(...a),B=target(...b),C=target(...c),D=target(...d);tri(a,b,c,A,B,C);tri(a,c,d,A,C,D)}
 }
 function limb(ctx,A,B,C,r0,r1,r2,far=false){const norm=(P,Q)=>{let x=Q[0]-P[0],y=Q[1]-P[1],l=Math.max(1,Math.hypot(x,y));return[-y/l,x/l]},n0=norm(A,B),n1=norm(A,C),n2=norm(B,C),add=(P,N,r)=>[P[0]+N[0]*r,P[1]+N[1]*r],a=add(A,n0,r0),b=add(B,n1,r1),c=add(C,n2,r2),d=add(C,n2,-r2),e=add(B,n1,-r1),f=add(A,n0,-r0);const g=ctx.createLinearGradient(B[0]-n1[0]*r1,B[1]-n1[1]*r1,B[0]+n1[0]*r1,B[1]+n1[1]*r1);g.addColorStop(0,far?'#557f32':'#5b8b37');g.addColorStop(.38,far?'#79a448':'#91bb53');g.addColorStop(.72,far?'#729a42':'#83b04c');g.addColorStop(1,far?'#4f7830':'#628e3a');ctx.fillStyle=g;ctx.beginPath();ctx.moveTo(...a);ctx.quadraticCurveTo(...b,...c);ctx.quadraticCurveTo(C[0]+(C[0]-B[0])*.22,C[1]+(C[1]-B[1])*.22,...d);ctx.quadraticCurveTo(...e,...f);ctx.quadraticCurveTo(A[0]-(B[0]-A[0])*.25,A[1]-(B[1]-A[1])*.25,...a);ctx.closePath();ctx.fill();}
 function leg(ctx,H,K,F,angle,scale,far){const ankle=footAt(ctx,F[0],F[1],angle,scale,far,false);limb(ctx,H,K,[ankle[0]-9*scale,ankle[1]+8*scale],23*scale,21*scale,17*scale,far);footAt(ctx,F[0],F[1],angle,scale,far);}
 const stage=document.createElement("canvas");stage.width=stage.height=384;const stageCtx=stage.getContext("2d",{willReadFrequently:true});
 function bottomOf(c){let d=c.getImageData(0,310,384,50).data;for(let y=49;y>=0;y--)for(let x=0;x<384;x++)if(d[(y*384+x)*4+3]>=128)return 310+y;return 336}
 const ground=bottomOf(sc);
 function assemble(ctx,t){
 const p=pose(t);ctx.clearRect(0,0,384,384);if(p.rest<.001){ctx.drawImage(src,0,0);return{rig:false}};
 const s=p.sleep,r=p.rest,point=(x,y)=>{let q=rotate(x-210,(y-282)*(1+p.breath*.012),p.body);return[p.hx+q[0],p.hy-p.breath*1.3+q[1]]};
 let neck=point(215,165);neck[1]+=s*12-p.lift+s*p.breath*.8; // keep face at a comfortable shallow angle; settle chin close to the floor
 let tr=point(175,262);tr[0]=mix(tr[0],p.hx+8,s);tr[1]=mix(tr[1],301,s);tr[1]=Math.min(306,tr[1]);
 transform(ctx,tail,tr,[175,262],p.tail);
 const H=[mix(195,mix(p.hx+2,p.hx+6,s),r),mix(278,mix(p.hy-9,p.hy+18,s),r)];
 const K=[mix(193,mix(212,p.hx-12,s),r),mix(300,mix(301, p.hy+6,s),r)];
 const F=[mix(207,mix(232,p.hx+5,s),r),338];
 const step=(a,b)=>{let u=clamp((t-a)/(b-a));return Math.pow(Math.sin(Math.PI*u),2)};
 const nearLift=3.7*step(1.54,2.25)+4.2*step(4.55,5.43)+3.4*step(11.98,12.84)+4*step(13.97,14.65);
 const farLift=3.1*step(2.24,2.64)+3.7*step(5.45,6.16)+3.1*step(11.28,11.97)+3.5*step(14.66,15.25);
 F[1]-=nearLift;
 const a=mix(-12*r,0,s);
 ctx.save();ctx.globalAlpha=ease(r*4);leg(ctx,[H[0]+7*r,H[1]-3],[K[0]+10*r,K[1]-4],[F[0]+16*r,338-farLift],a,.72,true);ctx.restore();
 // Torso has the original bag and scarf. Rear leg overlaps the low abdomen, not the strap.
 transform(ctx,torso,[p.hx,p.hy-p.breath*1.3],[210,282],p.body,1,1+p.breath*.012);
 leg(ctx,H,K,F,a,.84,false);
 transform(ctx,bag,[p.hx,p.hy-p.breath*1.3],[210,282],p.body,1,1+p.breath*.012);
 let shoulder=point(201,190),elbow=point(190,223),hand=point(189,246);
 const support=p.support;const handX=285,handY=330;hand=[mix(hand[0],handX,support),mix(hand[1],handY,support)];
 // Reach constraint: do not lengthen the arm to manufacture floor contact. Plant only when shoulder comes within reach; release as it rises.
 let dx=hand[0]-shoulder[0],dy=hand[1]-shoulder[1],d=Math.max(.001,Math.hypot(dx,dy)),reach=59;let scale=Math.min(1,reach/d);hand=[shoulder[0]+dx*scale,shoulder[1]+dy*scale];d=Math.min(d,reach);let bend=Math.sqrt(Math.max(0,30*30-(d*.5)**2));let eTarget=[mix(shoulder[0],hand[0],.5)-dy/Math.hypot(dx,dy)*bend,mix(shoulder[1],hand[1],.5)+dx/Math.hypot(dx,dy)*bend];elbow=[mix(elbow[0],eTarget[0],support),mix(elbow[1],eTarget[1],support)];armMesh(ctx,shoulder,elbow,hand,p.body-10*r,ease((support-.04)/.72));
 if(s>.001){ctx.save();ctx.globalAlpha=ease(s/.15);segment(ctx,point(215,165),neck,13,13);ctx.restore()}drawFace(p.lid,p.jaw);transform(ctx,face,neck,[215,165],p.head);
 // Blend only lower-body pixels at the standing handoff. The original head is already drawn at its animated pivot, so a second face must never be overlaid.
 if(r<.13){ctx.save();ctx.globalAlpha=1-ease(r/.13);ctx.beginPath();ctx.rect(0,266,384,118);ctx.clip();transform(ctx,src,[p.hx,p.hy],[210,282],p.body);ctx.restore()};return{rig:true};}
 return function render(ctx,t){const info=assemble(stageCtx,t),y=ground-bottomOf(stageCtx);ctx.clearRect(0,0,384,384);ctx.drawImage(stage,0,y);return {...info,groundCorrection:y};};}
