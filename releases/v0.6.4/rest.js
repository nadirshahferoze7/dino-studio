/* DINO-001 v0.6.4: connected implicit skin driven by shared structural anchors; original source head, tail texture, arm, feet and accessories. */
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
 const arm=layer('M193 187 Q205 182 216 188 Q218 199 210 215 L204 241 Q202 251 194 253 Q184 254 178 248 Q173 244 177 225 L181 204 Q185 192 193 187 Z');
 const ac=arm.getContext('2d'),ad=ac.getImageData(0,0,384,384);for(let y=180;y<210;y++)for(let x=169;x<220;x++){let i=(y*384+x)*4;ad.data[i+3]*=ease((y-191)/30);}ac.putImageData(ad,0,0);
 const foot=layer('M171 310 Q189 309 207 309 Q219 310 230 315 Q241 321 241 338 L164 342 Z');
 const ft=foot.getContext('2d'),fg=ft.createLinearGradient(169,0,193,0);fg.addColorStop(0,'#0000');fg.addColorStop(1,'#000');ft.globalCompositeOperation='destination-in';ft.fillStyle=fg;ft.fillRect(0,0,384,384);const fa=ft.createLinearGradient(0,308,0,323);fa.addColorStop(0,'#0000');fa.addColorStop(1,'#000');ft.fillStyle=fa;ft.fillRect(0,0,384,384);ft.globalCompositeOperation='source-over';
 
 // Continuous body construction: pose-specific neck/chest/pelvis, tail and near-leg are
 // connected by a smooth implicit skin surface. Accessories are independent source-art masks.
 const scarf=layer('M158 161 H269 V214 H158 Z'),sf=scarf.getContext('2d'),sd=sf.getImageData(0,0,384,384);
 for(let y=161;y<214;y++)for(let x=158;x<269;x++){let i=(y*384+x)*4,R=sd.data[i],G=sd.data[i+1],B=sd.data[i+2];sd.data[i+3]*=ease((R-G*1.38)/22)*ease((R-B*1.3)/18);}sf.putImageData(sd,0,0);
 const strap=layer('M236 210 Q246 210 254 215 L257 232 Q253 248 234 255 L231 246 L240 234 Z');
 const stc=strap.getContext('2d'),std=stc.getImageData(0,0,384,384);for(let y=210;y<256;y++)for(let x=230;x<258;x++){let i=(y*384+x)*4,R=std.data[i],G=std.data[i+1],B=std.data[i+2];std.data[i+3]*=ease((R-G*1.04)/12)*ease((G-B*1.17)/18)*(1-ease((B-99)/45));}stc.putImageData(std,0,0);
 const pouch=layer('M196 240 Q207 238 234 240 Q235 250 234 263 Q231 277 218 280 Q202 281 197 270 Q193 260 196 240 Z');
 const pp=pouch.getContext('2d'),pd2=pp.getImageData(0,0,384,384);for(let y=239;y<281;y++)for(let x=193;x<237;x++){let i=(y*384+x)*4,R=pd2.data[i],G=pd2.data[i+1],B=pd2.data[i+2];pd2.data[i+3]*=ease((R-G*1.025)/14)*ease((G-B*1.08)/14);}pp.putImageData(pd2,0,0);
 // Signed distance of the actual tail texture; union with the pelvis, rather than layering
 // a fading transparent cutout across the outside silhouette.
 const tailArt=layer('M88 205 H147 Q155 205 157 242 Q163 259 157 281 Q155 290 147 290 H88 Z'),taData=tailArt.getContext('2d').getImageData(0,0,384,384).data;
 function distanceMask(inside){const n=384*384,d=new Float32Array(n);for(let i=0;i<n;i++)d[i]=((taData[i*4+3]>=128)===inside)?0:1e4;
 for(let y=0;y<384;y++)for(let x=0;x<384;x++){let i=y*384+x,v=d[i];if(x)v=Math.min(v,d[i-1]+1);if(y){v=Math.min(v,d[i-384]+1);if(x)v=Math.min(v,d[i-385]+1.4142);if(x<383)v=Math.min(v,d[i-383]+1.4142)}d[i]=v;}
 for(let y=383;y>=0;y--)for(let x=383;x>=0;x--){let i=y*384+x,v=d[i];if(x<383)v=Math.min(v,d[i+1]+1);if(y<383){v=Math.min(v,d[i+384]+1);if(x)v=Math.min(v,d[i+383]+1.4142);if(x<383)v=Math.min(v,d[i+385]+1.4142)}d[i]=v;}return d;}
 const dtInside=distanceMask(true),dtOutside=distanceMask(false),tailSDF=dtInside.map((d,i)=>{let v=d-dtOutside[i];return v-Math.sign(v)*.5;});
 function sdfAt(x,y){let a=Math.floor(x),b=Math.floor(y),u=x-a,v=y-b,i=b*384+a;return mix(mix(tailSDF[i],tailSDF[i+1],u),mix(tailSDF[i+384],tailSDF[i+385],u),v);}
 const skinCanvas=document.createElement('canvas');skinCanvas.width=skinCanvas.height=384;const sk=skinCanvas.getContext('2d');
 // Each ellipse is specified by a shared skeletal center, local axes and a source-matched color field.
 const sm=(a,b,k)=>{let h=Math.max(k-Math.abs(a-b),0)/k;return Math.min(a,b)-h*h*k*.25};
 function ellipse(A,B,r1,r2,kind){let dx=B[0]-A[0],dy=B[1]-A[1],len=Math.max(.01,Math.hypot(dx,dy));return {x:(A[0]+B[0])*.5,y:(A[1]+B[1])*.5,ux:dx/len,uy:dy/len,rx:Math.max(1,len*.5+r1),ry:r2,kind};}
 function oval(C,angle,rx,ry,kind){let a=rad(angle);return {x:C[0],y:C[1],ux:Math.cos(a),uy:Math.sin(a),rx,ry,kind}}
 function dist(x,y,e){let dx=x-e.x,dy=y-e.y,u=(dx*e.ux+dy*e.uy)/e.rx,v=(-dx*e.uy+dy*e.ux)/e.ry;return (Math.hypot(u,v)-1)*Math.min(e.rx,e.ry)}
 function continuousSkin(ctx,p,point,neck,tr,H,K,F,ankle,shoulder,elbow,hand,armWeight){
  const r=p.rest,s=p.sleep;
  // The hip and chest both follow the same axial structure. Radius changes are pose-dependent,
  // not independent cutout rotation. A skin union blends the hip, neck and near leg into the trunk.
  const pelvis=point(207,270),chest=point(213,215),back=point(194,230),base=point(213,172);
  const ell=[oval(pelvis,p.body,32+2*r,32-2*s,'pelvis'),oval(chest,p.body,36,39-2*s,'chest'),oval(back,p.body,22,29,'back'),ellipse(base,neck,8,15,'neck'),ellipse(H,K,12,18,'thigh'),ellipse(K,[ankle[0]-7,ankle[1]+5],7,13,'shin')];
  // Tail root is part of the pelvis. The tail artwork is overlaid on the fused skin with a tapered root.
  const tailEnd=rotate(-24,-4,p.tail),root=[tr[0]+tailEnd[0],tr[1]+tailEnd[1]];ell.push(ellipse(pelvis,root,7,20,'tailroot'));
  // Pose-specific shoulder mass joins the moving arm before the source-textured arm is composited.
  ell.push(oval([shoulder[0]+2,shoulder[1]+3],p.body,15,16,'shoulder'));
  const angle=p.body-10*r,rr=rotate(-10,30,angle),rigidElbow=[shoulder[0]+rr[0],shoulder[1]+rr[1]],curvedMid=[.25*shoulder[0]+.5*elbow[0]+.25*hand[0],.25*shoulder[1]+.5*elbow[1]+.25*hand[1]],armMid=[mix(rigidElbow[0],curvedMid[0],armWeight),mix(rigidElbow[1],curvedMid[1],armWeight)];
  ell.push(ellipse(shoulder,armMid,4,13,'upperarm'));
  const tc=Math.cos(rad(p.tail)),ts=Math.sin(rad(p.tail));
  let minX=384,minY=384,maxX=0,maxY=0;for(const [x,y] of [[88,205],[167,205],[88,290],[167,290]]){let v=rotate(x-175,y-262,p.tail);minX=Math.min(minX,tr[0]+v[0]-5);minY=Math.min(minY,tr[1]+v[1]-5);maxX=Math.max(maxX,tr[0]+v[0]+5);maxY=Math.max(maxY,tr[1]+v[1]+5);}for(const e of ell){let a=Math.max(e.rx,e.ry)+10;minX=Math.min(minX,e.x-a);minY=Math.min(minY,e.y-a);maxX=Math.max(maxX,e.x+a);maxY=Math.max(maxY,e.y+a)}minX=Math.max(0,Math.floor(minX));minY=Math.max(0,Math.floor(minY));maxX=Math.min(384,Math.ceil(maxX));maxY=Math.min(384,Math.ceil(maxY));const w=maxX-minX,h=maxY-minY,im=sk.createImageData(w,h),c=Math.cos(rad(p.body)),sn=Math.sin(rad(p.body));
  for(let y=0;y<h;y++)for(let x=0;x<w;x++){const X=x+minX+.5,Y=y+minY+.5;let d=1000,bodyD=1000,legD=1000,rootD=1000,armD=1000;for(let i=0;i<ell.length;i++){let dd=dist(X,Y,ell[i]);d=sm(d,dd,8);if(i<4)bodyD=sm(bodyD,dd,7);else if(i<6)legD=Math.min(legD,dd);else if(i===6)rootD=dd;else armD=Math.min(armD,dd);}let tx=X-tr[0],ty=Y-tr[1],sx=175+tc*tx+ts*ty,sy=262-ts*tx+tc*ty,ix=Math.round(sx),iy=Math.round(sy),ti=(iy*384+ix),td=(ix>=88&&ix<175&&iy>=200&&iy<296)?sdfAt(sx,sy):1000;
   const coreD=d;d=sm(d,td,12);if(d>1)continue;let dx=X-p.hx,dy=Y-p.hy+p.breath*1.3,lx=210+c*dx+sn*dy,ly=282+(-sn*dx+c*dy)/(1+p.breath*.012);
   // Source-matched broad skin light; smooth cream belly follows the front of the chest.
   let light=clamp(.75+.23*Math.exp(-((lx-215)**2/1200+(ly-212)**2/6000))-.08*ease((lx-240)/20)+.05*(1-ease((Y-minY)/120)),.58,1.06);
   let limbW=ease((bodyD-legD+5)/12),rootW=ease((bodyD-rootD+3)/12)*(1-limbW);light=mix(light,.77+.17*Math.exp(-((X-K[0]+7)**2+(Y-K[1]+9)**2)/700),limbW*.62);light=mix(light,.80,rootW*.65);let armW=ease((bodyD-armD+3)/11);light=mix(light,.91,armW*.65);
   let cream=ease((lx-(229-5*Math.sin(clamp((ly-180)/111)*Math.PI)))/9)*(1-ease((ly-279)/15))*(1-limbW)*(1-rootW)*(1-armW);let edge=1-.10*ease((d+9)/9);let j=(y*w+x)*4;im.data[j]=mix(159*light,255*(.86+.14*light),cream)*edge;im.data[j+1]=mix(194*light,224*(.86+.14*light),cream)*edge;im.data[j+2]=mix(81*light,158*(.86+.14*light),cream)*edge;if(td<7&&ix>=88&&ix<167&&iy>=205&&iy<290){let a=taData[ti*4+3],v=ease((coreD-td+3)/13)*ease((a-40)/140);for(let k=0;k<3;k++)im.data[j+k]=mix(im.data[j+k],taData[ti*4+k],v);}im.data[j+3]=clamp(.5-d*.85)*255;
  }sk.clearRect(0,0,384,384);sk.putImageData(im,minX,minY);ctx.drawImage(skinCanvas,0,0);
 }
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
 // Tail is part of the continuous skin field.
 const H=[mix(195,mix(p.hx+2,p.hx+6,s),r),mix(278,mix(p.hy-9,p.hy+18,s),r)];
 const K=[mix(193,mix(212,p.hx-12,s),r),mix(300,mix(301, p.hy+6,s),r)];
 const F=[mix(207,mix(232,p.hx+5,s),r),338];
 const step=(a,b)=>{let u=clamp((t-a)/(b-a));return Math.pow(Math.sin(Math.PI*u),2)};
 const nearLift=3.7*step(1.54,2.25)+4.2*step(4.55,5.43)+3.4*step(11.98,12.84)+4*step(13.97,14.65);
 const farLift=3.1*step(2.24,2.64)+3.7*step(5.45,6.16)+3.1*step(11.28,11.97)+3.5*step(14.66,15.25);
 F[1]-=nearLift;
 const a=mix(-12*r,0,s);
 ctx.save();ctx.globalAlpha=ease(r*4);leg(ctx,[H[0]+7*r,H[1]-3],[K[0]+10*r,K[1]-4],[F[0]+16*r,338-farLift],a,.72,true);ctx.restore();
 const ankle=footAt(ctx,F[0],F[1],a,.84,false,false);
 let shoulder=point(201,190),elbow=point(190,223),hand=point(189,246);
 const support=p.support;const handX=285,handY=330;hand=[mix(hand[0],handX,support),mix(hand[1],handY,support)];
 // Reach constraint: do not lengthen the arm to manufacture floor contact. Plant only when shoulder comes within reach; release as it rises.
 let dx=hand[0]-shoulder[0],dy=hand[1]-shoulder[1],d=Math.max(.001,Math.hypot(dx,dy)),reach=59;let scale=Math.min(1,reach/d);hand=[shoulder[0]+dx*scale,shoulder[1]+dy*scale];d=Math.min(d,reach);let bend=Math.sqrt(Math.max(0,30*30-(d*.5)**2));let eTarget=[mix(shoulder[0],hand[0],.5)-dy/Math.hypot(dx,dy)*bend,mix(shoulder[1],hand[1],.5)+dx/Math.hypot(dx,dy)*bend];elbow=[mix(elbow[0],eTarget[0],support),mix(elbow[1],eTarget[1],support)];const armWeight=ease((support-.04)/.72);
 continuousSkin(ctx,p,point,neck,tr,H,K,F,ankle,shoulder,elbow,hand,armWeight);
 footAt(ctx,F[0],F[1],a,.84,false);
 transform(ctx,strap,[p.hx,p.hy-p.breath*1.3],[210,282],p.body,1,1+p.breath*.012);
 transform(ctx,pouch,[p.hx,p.hy-p.breath*1.3],[210,282],p.body,1,1+p.breath*.012);
 // Scarf follows the neck with a gravity-limited orientation; anchor at the shared neck pivot.
 const collarAngle=mix(p.body,p.head,.56*(1-s)),co=rotate(-2,9,collarAngle),collar=[neck[0]+co[0]-3*s,neck[1]+co[1]-9*s];
 transform(ctx,scarf,collar,[213,174],collarAngle,1-.10*s,1-.26*s);
 armMesh(ctx,shoulder,elbow,hand,p.body-10*r,armWeight);
 drawFace(p.lid,p.jaw);transform(ctx,face,neck,[215,165],p.head);
 // Blend only lower-body pixels at the standing handoff. The original head is already drawn at its animated pivot, so a second face must never be overlaid.
 if(r<.20){ctx.save();ctx.globalAlpha=1-ease(r/.20);ctx.beginPath();ctx.rect(0,163,384,221);ctx.clip();transform(ctx,src,[p.hx,p.hy],[210,282],p.body);ctx.restore()};return{rig:true};}
 return function render(ctx,t){const info=assemble(stageCtx,t),y=ground-bottomOf(stageCtx);ctx.clearRect(0,0,384,384);ctx.drawImage(stage,0,y);return {...info,groundCorrection:y};};}
