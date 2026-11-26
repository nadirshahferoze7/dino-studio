/* DINO-001 rest rig: layered approved profile source plus reconstructed hidden joints. */
const clamp=(x,a=0,b=1)=>Math.max(a,Math.min(b,x)),mix=(a,b,t)=>a+(b-a)*t,ease=x=>{x=clamp(x);return x*x*(3-2*x)},rad=x=>x*Math.PI/180;
// t, hip x/y, torso angle, head angle, tail angle, knee-fold, curl, lid
const keys=[
[0,210,282,0,0,0,0,0,0],[.65,210,282,0,0,0,0,0,0],
[1.25,212,293,12,2,-7,.22,0,0],[1.85,197,308,2,-2,-24,.75,0,0],
[2.5,187,321,-10,0,-35,1,0,0],[3.6,187,321,-10,0,-35,1,0,0],
[4.15,189,318,1,8,-35,1,.08,.4],[4.8,182,315,26,13,-40,1,.32,.85],
[5.55,160,293,66,22,-45,1,.67,1],[6.55,150,277,103,31,-49,1,1,1],
[9.7,150,277,103,31,-49,1,1,1],[10.35,150,277,103,5,-49,1,1,.28],
[10.85,154,291,76,-5,-48,1,.85,0],[11.55,172,312,36,0,-42,1,.45,0],
[12.4,187,321,-10,0,-35,1,0,0],[13.2,187,321,-10,0,-35,1,0,0],
[13.8,201,307,15,5,-24,.75,0,0],[14.55,210,292,8,1,-9,.25,0,0],
[15.3,210,282,0,0,0,0,0,0],[16,210,282,0,0,0,0,0,0]];
const phases=[[0,'Standing'],[.65,'Anticipate and bend'],[2.5,'Seated rest'],[3.6,'Getting sleepy'],[4.8,'Lower onto forelimbs'],[6.55,'Sleeping · slow breathing'],[9.7,'Waking · head first'],[10.85,'Push up'],[12.4,'Seated recovery'],[13.2,'Stand up'],[15.3,'Standing · recovered']];
const clips={full:[0,16],sit:[0,3.6],sleep:[3.6,9.7],wake:[9.7,16],seated:[2.5,3.6],sleeping:[6.55,9.7]};
function pose(t){t=clamp(t,0,16);let i=0;while(i<keys.length-2&&t>keys[i+1][0])i++;let a=keys[i],b=keys[i+1],f=ease((t-a[0])/(b[0]-a[0]));let [hx,hy,body,head,tail,rest,sleep,lid]=a.slice(1).map((v,j)=>mix(v,b[j+1],f));let breath=Math.sin((t-6.55)*Math.PI*2/2.9)*ease((t-6.55)/.5)*(1-ease((t-9.3)/.4));let seated=(ease((t-2.5)/.3)*(1-ease((t-3.3)/.3))+ease((t-12.4)/.2)*(1-ease((t-13)/.2)));breath+=seated*.48*Math.sin(t*2.2);let lift=13*ease((t-9.7)/.65)*(1-ease((t-10.35)/1.2));return {hx,hy,body,head,tail,rest,sleep,lid,breath,lift};}
function rotate(x,y,a){let c=Math.cos(rad(a)),s=Math.sin(rad(a));return [c*x-s*y,s*x+c*y]}
function makeRenderer(atlas){let src=document.createElement('canvas');src.width=src.height=384;let sc=src.getContext('2d');sc.drawImage(atlas,0,0,384,384,0,0,384,384);
 function layer(path){let c=document.createElement('canvas');c.width=c.height=384;let x=c.getContext('2d');x.clip(new Path2D(path));x.drawImage(src,0,0);return c}
 const head=layer('M143 48 H295 V156 Q268 161 232 167 L230 177 H178 V161 L143 157 Z');
 const tail=layer('M90 209 H157 L170 228 Q183 233 183 252 L183 282 L176 293 H90 Z');
 const torso=layer('M179 163 L240 159 Q260 165 265 197 L260 220 Q260 263 240 285 Q223 300 200 295 Q176 291 172 274 L168 241 Q172 219 170 211 Q163 210 166 195 L171 174 Z');
 const arm=layer('M193 187 Q205 182 216 188 Q218 199 210 215 L204 241 Q202 251 194 253 Q184 254 178 248 Q173 244 177 225 L181 204 Q185 192 193 187 Z');
 const foot=layer('M171 310 Q189 309 207 309 Q219 310 230 315 Q241 321 241 338 L164 342 Z');
 const ft=foot.getContext('2d'),fg=ft.createLinearGradient(171,0,196,0);fg.addColorStop(0,'#0000');fg.addColorStop(1,'#000');ft.globalCompositeOperation='destination-in';ft.fillStyle=fg;ft.fillRect(0,0,384,384);ft.globalCompositeOperation='source-over';
 
 const bag=layer('M196 240 Q205 236 233 238 L235 262 Q230 281 205 280 L195 271 Z');
 const palm=layer('M174 235 Q190 230 205 237 L204 248 Q195 258 179 250 Z');
 // Inpaint the arm's original location only in the reconstructed torso. Keep the satchel and scarf.
 const tc=torso.getContext('2d');
 const patch=document.createElement('canvas');patch.width=patch.height=384;const pc=patch.getContext('2d');
 const fill=pc.createLinearGradient(170,200,224,240);fill.addColorStop(0,'#608c38');fill.addColorStop(.4,'#80ac49');fill.addColorStop(.8,'#8ab755');fill.addColorStop(1,'#6e9e3e');pc.fillStyle=fill;
 pc.filter='blur(2px)';pc.fill(new Path2D('M190 188 Q203 184 217 189 Q220 207 211 227 L204 240 L197 254 Q187 260 175 253 Q170 244 175 221 Q179 199 190 188 Z'));tc.save();tc.globalCompositeOperation='source-atop';tc.drawImage(patch,0,0);tc.restore();
 const face=document.createElement('canvas');face.width=face.height=384;let fc=face.getContext('2d');
 const jawX=230,jawY=118,jawW=58,jawH=47,jawSrc=head.getContext('2d').getImageData(jawX,jawY,jawW,jawH);
 function closeJaw(lid){let q=ease((lid-.12)/.75);if(q<.001)return;let dst=fc.createImageData(jawW,jawH);for(let y=0;y<jawH;y++)for(let x=0;x<jawW;x++){let gx=jawX+x,gy=jawY+y,wx=ease((gx-232)/18)*(1-ease((gx-277)/10)),wy=ease((gy-122)/12)*(1-ease((gy-153)/12)),sy=clamp(y+q*11*wx*wy,0,jawH-1),a=Math.floor(sy),b=Math.min(jawH-1,a+1),f=sy-a,di=(y*jawW+x)*4,ia=(a*jawW+x)*4,ib=(b*jawW+x)*4;let aa=jawSrc.data[ia+3],ab=jawSrc.data[ib+3],al=mix(aa,ab,f);dst.data[di+3]=al;for(let k=0;k<3;k++)dst.data[di+k]=al?mix(jawSrc.data[ia+k]*aa,jawSrc.data[ib+k]*ab,f)/al:0}fc.putImageData(dst,jawX,jawY)}
 function drawFace(lid){fc.clearRect(0,0,384,384);fc.drawImage(head,0,0);if(lid<.001)return;closeJaw(lid);fc.save();fc.globalCompositeOperation='source-atop';let g=fc.createLinearGradient(218,77,241,115);g.addColorStop(0,'#5e8d37');g.addColorStop(.48,'#8fb74d');g.addColorStop(1,'#b3cc70');fc.beginPath();fc.moveTo(213,83);fc.bezierCurveTo(219,73,235,75,242,84);fc.bezierCurveTo(250,93,252,112,244,115);fc.bezierCurveTo(233,119,217,114,214,108);fc.bezierCurveTo(210,99,211,89,213,83);fc.clip();fc.save();fc.beginPath();fc.rect(210,73,46,44*lid);fc.clip();fc.fillStyle=g;fc.fillRect(210,73,46,46);fc.strokeStyle='#3c5427';fc.lineWidth=1.5;fc.beginPath();let y=77+29*lid;fc.moveTo(214,y-4);fc.quadraticCurveTo(230,y+9,246,y-4);fc.stroke();fc.restore();fc.restore();fc.save();fc.globalCompositeOperation='source-atop';fc.globalAlpha=ease((lid-.15)/.7);let m=fc.createLinearGradient(245,119,263,148);m.addColorStop(0,'#eacb7b');m.addColorStop(1,'#d6b76e');fc.fillStyle=m;fc.fill(new Path2D('M242 121 Q257 128 273 127 L272 139 Q257 140 242 121 Z'));fc.strokeStyle='#946b3b';fc.lineWidth=1.4;fc.lineCap='round';fc.beginPath();fc.moveTo(244,123);fc.quadraticCurveTo(257,132,270,128);fc.stroke();fc.restore();}
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
 function leg(ctx,H,K,F,angle,scale,far){
   const ankle=footAt(ctx,F[0],F[1],angle,scale,far,false); // determine pivot without drawing
   segment(ctx,K,[ankle[0]-6*scale,ankle[1]+2*scale],16*scale,14*scale,far);
   // Smooth anatomical knee, tapered into the source-textured foot.
   segment(ctx,H,K,21*scale,17*scale,far);footAt(ctx,F[0],F[1],angle,scale,far);
 }
 return function render(ctx,t){
 const p=pose(t);ctx.clearRect(0,0,384,384);if(p.rest<.001){ctx.drawImage(src,0,0);return{rig:false}};
 const s=p.sleep,r=p.rest,point=(x,y)=>{let q=rotate(x-210,y-282,p.body);return[p.hx+q[0],p.hy+q[1]]};
 let neck=point(215,165);neck[1]+=s*12-p.lift; // keep face at a comfortable shallow angle; settle chin close to the floor
 let tr=point(175,262);tr[0]=mix(tr[0],p.hx-10,s);tr[1]=mix(tr[1],306,s);tr[1]=Math.min(306,tr[1]);
 transform(ctx,tail,tr,[175,262],p.tail);
 const H=[mix(195,mix(p.hx+2,p.hx+6,s),r),mix(278,mix(p.hy-9,p.hy+18,s),r)];
 const K=[mix(193,mix(212,p.hx-12,s),r),mix(300,mix(301, p.hy+6,s),r)];
 const F=[mix(207,mix(232,p.hx+5,s),r),338];
 const a=mix(-20*r,0,s);
 ctx.save();ctx.globalAlpha=ease(r*2);leg(ctx,[H[0]+10,H[1]-3],[K[0]+10,K[1]-4],[F[0]+22,335],a,.72,true);ctx.restore();
 // Torso has the original bag and scarf. Rear leg overlaps the low abdomen, not the strap.
 transform(ctx,torso,[p.hx,p.hy-p.breath*1.3],[210,282],p.body,1,1+p.breath*.012);
 leg(ctx,H,K,F,a,.84,false);
 transform(ctx,bag,[p.hx,p.hy-p.breath*1.3],[210,282],p.body,1,1+p.breath*.012);
 let shoulder=point(201,190),elbow=point(190,223),hand=point(189,246);
 if(s>.005){elbow=[mix(elbow[0],p.hx+78,s),mix(elbow[1],312,s)];hand=[mix(hand[0],p.hx+137,s),mix(hand[1],330,s)];segment(ctx,shoulder,elbow,14,11);segment(ctx,elbow,hand,11,8);transform(ctx,palm,hand,[190,245],mix(p.body,-65,s),.9,.83)}else transform(ctx,arm,shoulder,[201,190],p.body-10*r);
 if(s>.05)segment(ctx,point(215,165),neck,13,13);drawFace(p.lid);transform(ctx,face,neck,[215,165],p.head);
 if(r<.12){ctx.save();ctx.globalAlpha=1-ease(r/.12);ctx.drawImage(src,0,0);ctx.restore()};return{rig:true};};}
