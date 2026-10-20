// Iso-glow handoff scene. draw(ctx, W, H, timeSeconds, loopSeconds=4)
function makeHandoffScene(){
const C=Math.cos(Math.PI/6),S=0.5;
const R='#DC2323',INK='#101112',CH='#23262A',SL='#5E6268',LN='#D9DCE0',WH='#FFFFFF';
const EDGE='rgba(217,220,224,0.5)';
const clamp=v=>Math.max(0,Math.min(1,v)),ease=v=>{v=clamp(v);return v*v*(3-2*v);};
const SP=125,BX0=-95,BX1=745,BY0=-82,BY1=104;
return function draw(ctx,W,H,time,loop){
  loop=loop||4;
  const p=((time%loop)+loop)%loop/loop;
  const k=Math.min(W*0.92/(BX1-BX0),H*0.9/(BY1-BY0));
  const OX=W/2-(BX0+BX1)/2*k,OY=H/2-((BY0+BY1)/2)*k;
  const P=(x,y,z)=>[(x-y)*C*k+OX,((x+y)*S-z)*k+OY];
  const lw=Math.max(1,0.85*k);
  const G=(i,lx,ly)=>[i*SP+lx,-i*SP+ly];
  ctx.save();ctx.fillStyle=INK;ctx.fillRect(0,0,W,H);ctx.lineJoin='round';ctx.lineCap='round';
  function path(pts,close){ctx.beginPath();pts.forEach((q,i)=>{const s=P(q[0],q[1],q[2]);i?ctx.lineTo(s[0],s[1]):ctx.moveTo(s[0],s[1]);});if(close)ctx.closePath();}
  function poly(pts,fill,stroke,o){o=o||{};path(pts,true);ctx.save();ctx.globalAlpha=o.a==null?1:o.a;
    if(o.glow){ctx.shadowColor=R;ctx.shadowBlur=o.glow*k;}
    if(fill){ctx.fillStyle=fill;ctx.fill();}
    if(stroke){ctx.strokeStyle=stroke;ctx.lineWidth=o.w||lw;ctx.setLineDash(o.dash?o.dash.map(d=>d*k):[]);ctx.stroke();}
    ctx.restore();}
  function line(pts,stroke,o){o=o||{};path(pts,false);ctx.save();ctx.globalAlpha=o.a==null?1:o.a;
    if(o.glow){ctx.shadowColor=R;ctx.shadowBlur=o.glow*k;}
    ctx.strokeStyle=stroke;ctx.lineWidth=o.w||lw;ctx.setLineDash(o.dash?o.dash.map(d=>d*k):[]);ctx.stroke();ctx.restore();}
  function box(x,y,z,w,d,h,o){o=o||{};const e=o.edge||EDGE,a=o.a;
    poly([[x,y+d,z+h],[x+w,y+d,z+h],[x+w,y+d,z],[x,y+d,z]],o.front||INK,e,{a,glow:o.glow});
    poly([[x+w,y,z+h],[x+w,y+d,z+h],[x+w,y+d,z],[x+w,y,z]],o.side||INK,e,{a,glow:o.glow});
    poly([[x,y,z+h],[x+w,y,z+h],[x+w,y+d,z+h],[x,y+d,z+h]],o.top||CH,e,{a,glow:o.glow});}
  const bs=(i,lx,ly,z,w,d,h,o)=>{const g=G(i,lx,ly);box(g[0],g[1],z,w,d,h,o);};
  const pt=(i,lx,ly,z)=>{const g=G(i,lx,ly);return [g[0],g[1],z];};
  function ellipseTop(cx,cy,z,r,fill,stroke,o){const pts=[];for(let a=0;a<40;a++){const t=a/40*Math.PI*2;pts.push([cx+Math.cos(t)*r,cy+Math.sin(t)*r,z]);}poly(pts,fill,stroke,o);}
  function dot(q,r,fill,stroke,o){o=o||{};const s=P(q[0],q[1],q[2]);ctx.save();ctx.globalAlpha=o.a==null?1:o.a;
    if(o.glow){ctx.shadowColor=R;ctx.shadowBlur=o.glow*k;}
    ctx.beginPath();ctx.arc(s[0],s[1],r*k,0,Math.PI*2);if(fill){ctx.fillStyle=fill;ctx.fill();}
    if(stroke){ctx.strokeStyle=stroke;ctx.lineWidth=o.w||lw;ctx.stroke();}ctx.restore();}
  function person(i,lx,ly,z,hat){bs(i,lx,ly,z,12,12,22,{top:CH});
    const h=pt(i,lx+6,ly+6,z+30);dot(h,6.2,CH,EDGE);
    if(hat){const a=P(h[0]-8,h[1]+8,h[2]+3),b=P(h[0]+8,h[1]-8,h[2]+3);ctx.save();ctx.strokeStyle=LN;ctx.lineWidth=lw*1.3;ctx.beginPath();ctx.moveTo(a[0],a[1]);ctx.lineTo(b[0],b[1]);ctx.stroke();ctx.restore();}}
  // timeline
  const f=p<0.88?1:p<0.94?1-(p-0.88)/0.06:0;
  const u=clamp((p-0.04)/0.72),tp=-25+425*u;
  const arr=i=>0.04+0.72*((i*SP+25)/425);
  const lit=i=>p>=arr(i)?f:0;
  const crateY=p>=0.94?13:p<0.6?13:13+35*ease((p-0.6)/0.12);
  const crateA=p<0.88?1:p<0.94?1-(p-0.88)/0.06:(p-0.94)/0.06;
  const blocked=crateY<30;
  const verified=p>=0.76?f:0;
  // plates
  for(let i=0;i<4;i++){bs(i,0,0,0,100,100,8,{top:CH});
    poly([pt(i,6,6,8),pt(i,94,6,8),pt(i,94,94,8),pt(i,6,94,8)],null,SL,{a:0.55});}
  // A: route + CCTV
  const road=(i,red)=>{poly([pt(i,0,8,8),pt(i,100,8,8),pt(i,100,42,8),pt(i,0,42,8)],INK,red?R:SL,{glow:red?8:0,a:1});
    if(red){poly([pt(i,0,8,8),pt(i,100,8,8),pt(i,100,42,8),pt(i,0,42,8)],null,R,{a:red,glow:10});}
    line([pt(i,4,25,8),pt(i,96,25,8)],SL,{dash:[6,6]});};
  road(0,0);
  bs(0,86,3,8,6,6,88,{});
  bs(0,62,1,96,32,11,13,{});
  dot(pt(0,66,12,102.5),2.4,R,null,{glow:10});
  if(p<0.6||p>=0.94){const ba=p>=0.94?crateA:p<0.5?1:1-(p-0.5)/0.1;
    poly([pt(0,66,12,100),pt(0,42,12,8),pt(0,42,42,8),pt(0,72,42,8)],'rgba(220,35,35,0.10)',R,{a:ba*0.8,dash:[3,4]});}
  {const o={a:crateA,edge:blocked?R:EDGE,glow:blocked?10:0,top:CH};
    bs(0,42,crateY,8,24,24,22,o);
    line([pt(0,42,crateY+24,30),pt(0,66,crateY+24,8)],blocked?R:SL,{a:crateA});
    line([pt(0,42,crateY+24,8),pt(0,66,crateY+24,30)],blocked?R:SL,{a:crateA});}
  // B: command centre + supervisor
  bs(1,12,14,8,54,26,26,{});
  line([pt(1,16,40,26),pt(1,62,40,26)],SL);
  bs(1,36,19,34,6,3,2,{});
  bs(1,20,18,36,38,5,30,{});
  {const sl=p>=0.3?f:0;const sc=[pt(1,23,23,63),pt(1,55,23,63),pt(1,55,23,40),pt(1,23,23,40)];
    poly(sc,CH,SL,{});
    if(sl){poly(sc,'rgba(220,35,35,0.22)',R,{a:sl,glow:12});
      poly([pt(1,26,23,59),pt(1,52,23,59),pt(1,52,23,54),pt(1,26,23,54)],R,null,{a:sl,glow:8});
      line([pt(1,26,23,49),pt(1,46,23,49)],LN,{a:sl});line([pt(1,26,23,44),pt(1,40,23,44)],LN,{a:sl});}}
  {const ow=p>=0.34?f:0;
    if(ow)ellipseTop(...G(1,82,28),8,13,'rgba(220,35,35,0.15)',R,{a:ow,glow:10});
    person(1,76,22,8,false);
    if(ow){dot(pt(1,82,28,50),2.6,R,null,{a:ow,glow:12});}}
  // C: patrol loop + SOP checklist + worker
  const loopPts=[[8,8],[92,8],[92,54],[8,54]];
  poly(loopPts.map(q=>pt(2,q[0],q[1],8)),null,SL,{dash:[4,5]});
  person(2,24,26,8,true);
  bs(2,50,20,8,30,3,50,{});
  {const ticks=[0.53,0.58,0.63];
    [50,40,30].forEach((z,j)=>{const on=p>=ticks[j]?f:0;
      poly([pt(2,54,23,z+3),pt(2,60,23,z+3),pt(2,60,23,z-3),pt(2,54,23,z-3)],on?R:INK,on?R:SL,{glow:on?8:0,a:1});
      if(on)line([pt(2,55,23,z),pt(2,57,23,z-2),pt(2,60.5,23,z+2.5)],WH,{w:lw*1.2,a:on});
      line([pt(2,63,23,z),pt(2,76,23,z)],on?LN:SL);});}
  {const s0=arr(2);if(p>=s0&&f>0){const q=clamp((p-s0)/0.2)*4;const a=Math.floor(q)%4,b=(a+1)%4,t=q-Math.floor(q);
    const x=loopPts[a][0]+(loopPts[b][0]-loopPts[a][0])*t,y=loopPts[a][1]+(loopPts[b][1]-loopPts[a][1])*t;dot(pt(2,x,y,8),2.4,R,null,{a:f,glow:10});}}
  // D: cleared route + check
  road(3,verified);
  bs(3,22,56,8,30,4,34,{front:verified?R:INK,edge:verified?R:EDGE,glow:verified?16:0,a:1});
  if(!verified){poly([pt(3,24,60,40),pt(3,50,60,40),pt(3,50,60,10),pt(3,24,60,10)],null,SL,{});}
  line([pt(3,30,60,25),pt(3,35,60,19),pt(3,45,60,32)],verified?WH:SL,{w:lw*(verified?2:1.3),a:1});
  person(3,76,46,8,false);
  // connector path + pulse
  const Q=t=>[75+t,75-t,8];
  line([Q(-25),Q(400)],SL,{dash:[3,5],a:0.9});
  if(f>0&&u>0)line([Q(-25),Q(tp)],R,{a:f,glow:8,w:lw*1.3});
  for(let i=0;i<4;i++){const c=Q(i*SP),l=lit(i),sq=[[c[0]-5,c[1]-5,8],[c[0]+5,c[1]-5,8],[c[0]+5,c[1]+5,8],[c[0]-5,c[1]+5,8]];
    poly(sq,l?R:INK,l?R:SL,{glow:l?12:0});}
  if(u>0&&u<1&&f>0){dot(Q(tp),3.4,WH,null,{glow:18});dot(Q(tp),6,null,R,{glow:10,a:0.8});}
  ctx.restore();
};}
if(typeof module!=='undefined')module.exports={makeHandoffScene};
