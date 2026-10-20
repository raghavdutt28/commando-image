function makeHandoffLight(){
const C=Math.cos(Math.PI/6),S=0.5;
const R='#DC2323',INK='#101112',CH='#23262A',SL='#5E6268',LN='#D9DCE0',PA='#F4F5F6',WH='#FFFFFF';
const SP=112,BX0=-92,BX1=676,BY0=-72,BY1=104;
return function draw(ctx,W,H){
  const k=Math.min(W*0.96/(BX1-BX0),H*0.94/(BY1-BY0));
  const OX=W/2-(BX0+BX1)/2*k,OY=H/2-((BY0+BY1)/2)*k;
  const P=(x,y,z)=>[(x-y)*C*k+OX,((x+y)*S-z)*k+OY];
  const lw=Math.max(1,0.7*k);
  const G=(i,lx,ly)=>[i*SP+lx,-i*SP+ly];
  const pt=(i,lx,ly,z)=>{const g=G(i,lx,ly);return [g[0],g[1],z];};
  ctx.save();ctx.fillStyle=WH;ctx.fillRect(0,0,W,H);ctx.lineJoin='round';ctx.lineCap='round';
  function path(pts,close){ctx.beginPath();pts.forEach((q,i)=>{const s=P(q[0],q[1],q[2]);i?ctx.lineTo(s[0],s[1]):ctx.moveTo(s[0],s[1]);});if(close)ctx.closePath();}
  function poly(pts,fill,stroke,o){o=o||{};path(pts,true);ctx.save();ctx.globalAlpha=o.a==null?1:o.a;
    if(fill){ctx.fillStyle=fill;ctx.fill();}
    if(stroke){ctx.strokeStyle=stroke;ctx.lineWidth=o.w||lw;ctx.setLineDash(o.dash?o.dash.map(d=>d*k):[]);ctx.stroke();}ctx.restore();}
  function line(pts,stroke,o){o=o||{};path(pts,false);ctx.save();ctx.globalAlpha=o.a==null?1:o.a;ctx.strokeStyle=stroke;ctx.lineWidth=o.w||lw;ctx.setLineDash(o.dash?o.dash.map(d=>d*k):[]);ctx.stroke();ctx.restore();}
  // tones: t=top, f=front, s=side
  const T={plate:[PA,LN,'#C9CDD2'.replace('#C9CDD2',LN)],light:[WH,PA,LN],mid:[LN,'#9A9EA3'.replace('#9A9EA3',SL),SL],dark:[SL,CH,INK],ink:[CH,INK,INK]};
  function box(x,y,z,w,d,h,tone,e){const [t,f,s]=T[tone]||tone;const st=e||'rgba(94,98,104,0.55)';
    poly([[x,y+d,z+h],[x+w,y+d,z+h],[x+w,y+d,z],[x,y+d,z]],f,st);
    poly([[x+w,y,z+h],[x+w,y+d,z+h],[x+w,y+d,z],[x+w,y,z]],s,st);
    poly([[x,y,z+h],[x+w,y,z+h],[x+w,y+d,z+h],[x,y+d,z+h]],t,st);}
  const bs=(i,lx,ly,z,w,d,h,tone,e)=>{const g=G(i,lx,ly);box(g[0],g[1],z,w,d,h,tone,e);};
  function cyl(q,r,h,top,side){const b=P(q[0],q[1],q[2]),t=P(q[0],q[1],q[2]+h);const rx=r*k*1.2247,ry=r*k*0.7071;
    ctx.save();ctx.beginPath();ctx.ellipse(b[0],b[1],rx,ry,0,0,Math.PI);ctx.lineTo(t[0]-rx,t[1]);ctx.ellipse(t[0],t[1],rx,ry,0,Math.PI,0,true);ctx.closePath();
    ctx.fillStyle=side;ctx.fill();ctx.strokeStyle='rgba(16,17,18,0.35)';ctx.lineWidth=lw;ctx.stroke();
    ctx.beginPath();ctx.ellipse(t[0],t[1],rx,ry,0,0,Math.PI*2);ctx.fillStyle=top;ctx.fill();ctx.stroke();ctx.restore();}
  function ball(q,r,fill){const s=P(q[0],q[1],q[2]);ctx.save();ctx.beginPath();ctx.arc(s[0],s[1],r*k,0,Math.PI*2);ctx.fillStyle=fill;ctx.fill();ctx.restore();}
  function shadow(q,r){const s=P(q[0],q[1],q[2]);ctx.save();ctx.beginPath();ctx.ellipse(s[0],s[1],r*k*1.22,r*k*0.71,0,0,Math.PI*2);ctx.fillStyle='rgba(94,98,104,0.18)';ctx.fill();ctx.restore();}
  function person(i,lx,ly,z,o){o=o||{};const c=pt(i,lx,ly,z);shadow(c,11);
    cyl([c[0]-2.6,c[1]+2.6,z],2.6,19,CH,INK);cyl([c[0]+2.6,c[1]-2.6,z],2.6,19,CH,INK);   // legs
    cyl([c[0],c[1],z+18],7.4,20,SL,CH);                        // torso
    ball([c[0],c[1],z+46],6,CH);                               // head
    if(o.hat){const h=P(c[0],c[1],z+49);ctx.save();ctx.fillStyle=LN;ctx.strokeStyle='rgba(16,17,18,0.35)';ctx.lineWidth=lw;ctx.beginPath();ctx.ellipse(h[0],h[1],6.3*k*1.22,6.3*k*0.71,0,0,Math.PI*2);ctx.fill();ctx.stroke();
      ctx.beginPath();ctx.arc(h[0],h[1]-0.6*k,5.8*k,Math.PI,0);ctx.closePath();ctx.fill();ctx.stroke();ctx.restore();}
    if(o.board){const b=[c[0]+7,c[1]+6];poly([[b[0]-1,b[1]+5,z+36],[b[0]+10,b[1]-6,z+36],[b[0]+10,b[1]-6,z+22],[b[0]-1,b[1]+5,z+22]],WH,SL);
      for(let j=0;j<3;j++){const zz=z+32.5-j*4;line([[b[0]+1.5,b[1]+2.5,zz],[b[0]+7.5,b[1]-3.5,zz]],SL,{w:lw*1.2});}}}
  // plates
  for(let i=0;i<4;i++){bs(i,0,0,0,100,100,6,'plate','rgba(94,98,104,0.35)');}
  const road=(i,clear)=>{poly([pt(i,0,10,6),pt(i,100,10,6),pt(i,100,44,6),pt(i,0,44,6)],LN,null);
    line([pt(i,6,27,6),pt(i,94,27,6)],WH,{dash:[7,6],w:lw*1.6});};
  // 1 · CCTV observes the blocked route
  road(0);
  {const s=P(...pt(0,64,12,96)),a=P(...pt(0,30,12,6)),b=P(...pt(0,30,44,6)),c=P(...pt(0,64,44,6));
    ctx.save();ctx.beginPath();ctx.moveTo(s[0],s[1]);ctx.lineTo(a[0],a[1]);ctx.lineTo(b[0],b[1]);ctx.lineTo(c[0],c[1]);ctx.closePath();ctx.fillStyle='rgba(217,220,224,0.45)';ctx.fill();ctx.restore();}
  bs(0,86,3,6,5,5,84,'dark');
  bs(0,62,2,88,30,10,12,'mid');
  bs(0,58,4,90,4,6,8,'dark');
  bs(0,38,14,6,18,26,14,'mid');bs(0,56,16,6,12,22,10,'light');bs(0,40,16,20,14,20,8,'light');
  {const m=pt(0,47,27,40);line([pt(0,47,27,28),m],INK,{w:lw*1.2});
    const s=P(...m);ctx.save();ctx.beginPath();ctx.arc(s[0],s[1],4.2*k,0,Math.PI*2);ctx.fillStyle=R;ctx.fill();
    ctx.beginPath();ctx.arc(s[0],s[1],8*k,0,Math.PI*2);ctx.strokeStyle=R;ctx.globalAlpha=0.35;ctx.lineWidth=lw*1.2;ctx.stroke();ctx.restore();}
  // 2 · Named supervisor owner
  bs(1,10,12,6,58,26,24,'light');
  bs(1,14,14,30,20,3,0.5,'mid');
  bs(1,40,17,30,3,3,4,'dark');bs(1,24,15,34,34,4,22,'ink');
  poly([pt(1,26.5,19,53.5),pt(1,55.5,19,53.5),pt(1,55.5,19,36.5),pt(1,26.5,19,36.5)],SL,null);
  line([pt(1,30,19,49),pt(1,46,19,49)],LN,{w:lw*1.4});line([pt(1,30,19,44),pt(1,40,19,44)],LN,{w:lw*1.4});
  person(1,42,62,6,{});
  // 3 · On-ground task with SOP checklist
  poly([pt(2,8,8,6),pt(2,92,8,6),pt(2,92,56,6),pt(2,8,56,6)],null,SL,{dash:[4,5],a:0.8});
  bs(2,58,14,6,28,3,46,'light');
  [44,36,28].forEach(z=>{poly([pt(2,62,17,z+2.5),pt(2,67,17,z+2.5),pt(2,67,17,z-2.5),pt(2,62,17,z-2.5)],WH,SL);
    line([pt(2,62.8,17,z),pt(2,64.3,17,z-1.6),pt(2,66.4,17,z+1.8)],INK,{w:lw*1.2});line([pt(2,70,17,z),pt(2,82,17,z)],SL,{w:lw*1.2});});
  person(2,32,42,6,{hat:true,board:true});
  // 4 · Human check of the cleared route
  road(3,true);
  bs(3,4,48,6,6,6,40,'dark');bs(3,4,54,40,6,30,3,'dark');
  for(let j=0;j<5;j++)bs(3,6,57+j*5.5,6,1.6,1.6,34,'dark');
  person(3,60,66,6,{hat:true});
  {const c=pt(3,62,64,6);const q=P(c[0],c[1],70);ctx.save();ctx.beginPath();ctx.arc(q[0],q[1],5.2*k,0,Math.PI*2);ctx.fillStyle=WH;ctx.fill();ctx.strokeStyle=INK;ctx.lineWidth=lw*1.2;ctx.stroke();
    ctx.beginPath();ctx.moveTo(q[0]-2.4*k,q[1]);ctx.lineTo(q[0]-0.6*k,q[1]+1.9*k);ctx.lineTo(q[0]+2.6*k,q[1]-2*k);ctx.stroke();ctx.restore();}
  // continuous path
  const Q=t=>[75+t,75-t,6];
  line([Q(-25),Q(3*SP+25)],INK,{w:lw*1.1});
  for(let i=0;i<4;i++){const c=Q(i*SP);const s=P(...c);ctx.save();ctx.beginPath();ctx.arc(s[0],s[1],2.4*k,0,Math.PI*2);ctx.fillStyle=WH;ctx.fill();ctx.strokeStyle=INK;ctx.lineWidth=lw*1.1;ctx.stroke();ctx.restore();}
  for(let i=0;i<3;i++){const a=P(...Q(i*SP+56)),d=4*k;ctx.save();ctx.strokeStyle=INK;ctx.lineWidth=lw*1.1;ctx.beginPath();ctx.moveTo(a[0]-d,a[1]-d*0.9);ctx.lineTo(a[0],a[1]);ctx.lineTo(a[0]-d,a[1]+d*0.9);ctx.stroke();ctx.restore();}
  ctx.restore();
};}
