/* DINO-001 v0.2: image-space palm correction over archived v0.1 atlas. */
const tipTrack=[[259,251.6],[260.6,251],[264.6,248.5],[270.8,244.3],[278.3,237.6],[285.1,229.1],[290.9,218.9],[294.2,208.5],[296.1,198.4],[296.4,189.9],[295.8,182.5],[294.5,175.6],[292.9,169],[290.7,161.8],[287.2,155],[283,149],[278.8,144.3],[274.4,140.8],[269.3,137.5],[264.4,134.9],[260.2,132.9],[257.3,131.3],[256.4,130.5],[257.4,130.5],[260.2,130.9],[264.9,133],[270.1,135.9],[275.1,139.6],[279.6,143.7],[282.8,147.8],[284.7,150.2],[285.4,151.2],[284.7,150.1],[282.6,147.3],[279,143.7],[274.3,139.9],[269.3,136.4],[264.4,133.7],[260.2,131.4],[257.3,130.2],[256.2,129.3],[257.1,128.9],[260.3,129.6],[264.8,131.4],[270,134.4],[275,138],[279.4,142.3],[282.7,146.1],[284.5,148.7],[285.2,150],[284.6,148.6],[282.6,145.7],[278.8,142.4],[274.3,138.7],[269,135.2],[264.2,132.7],[260,130.6],[258.1,129.6],[261.2,130.8],[268.2,134.3],[277.8,141.8],[287.3,154.6],[294.2,172.8],[296.3,189.9],[295.1,204.8],[291,217.8],[285.7,228],[279.8,235.9],[273.7,241.9],[268.2,246.1],[263.5,249.3],[260.2,251.2]];
function ease(a,b,x){let t=Math.max(0,Math.min(1,(x-a)/(b-a)));return t*t*(3-2*t)}
function drawPalm(ctx,n){
 const open=ease(7,16,n)*(1-ease(60,68,n)); if(open<.01)return;
 const [tx,ty]=tipTrack[n]; const a=Math.atan2(tx-230,187-ty); const sx=Math.sin(a),sy=-Math.cos(a); const wx=tx-8*sx,wy=ty-8*sy;
 // Replace nail-bearing distal area only; gradual reveal as wrist turns.
 ctx.save();ctx.translate(wx,wy);ctx.rotate(a);ctx.globalCompositeOperation='destination-out';ctx.globalAlpha=1;ctx.beginPath();ctx.ellipse(0,-7,11,12,0,0,Math.PI*2);ctx.fill();ctx.restore();
 ctx.save();ctx.translate(wx,wy);ctx.rotate(a+(0.16*Math.sin(n*Math.PI/9)+.12)*open);ctx.scale(.68+.32*open, .68+.32*open);ctx.globalAlpha=1;
 // Three rounded digits, front-facing palm. The original skin and face remain unmodified.
 const shape=new Path2D('M -7 8 Q -10 3 -10 -4 Q -15 -7 -13 -12 Q -11 -15 -8 -12 L -5 -8 L -5 -17 Q -5 -21 -1 -21 Q 3 -21 3 -17 L 3 -12 L 6 -16 Q 10 -19 12 -15 Q 14 -12 11 -7 L 9 -2 Q 9 5 6 9 Q 0 12 -7 8 Z');
 let g=ctx.createLinearGradient(-13,-14,13,10);g.addColorStop(0,'#a6ca65');g.addColorStop(.44,'#8db24d');g.addColorStop(.78,'#7fa644');g.addColorStop(1,'#648735');ctx.fillStyle=g;ctx.fill(shape);ctx.save();ctx.clip(shape);let h=ctx.createRadialGradient(-3,-5,1,-2,-4,15);h.addColorStop(0,'rgba(219,235,158,.28)');h.addColorStop(1,'rgba(219,235,158,0)');ctx.fillStyle=h;ctx.fillRect(-16,-23,33,35);ctx.restore();
 ctx.lineCap='round';ctx.lineWidth=.85;ctx.strokeStyle='rgba(74,112,38,.46)';ctx.beginPath();ctx.moveTo(-5,-8);ctx.quadraticCurveTo(-3,-5,-2,-3);ctx.moveTo(3,-12);ctx.lineTo(2,-7);ctx.stroke();ctx.restore();
}
