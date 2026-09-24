'use strict';
// Número autorizado para consultas, en formato internacional.
const WHATSAPP_NUMBER = '50663656047';
const connected = /^[1-9]\d{7,14}$/.test(WHATSAPP_NUMBER);
const form=document.querySelector('#booking'), date=document.querySelector('#fecha');
const result=document.querySelector('#result'),messageBox=document.querySelector('#message');
const whatsapp=document.querySelector('#whatsapp'),status=document.querySelector('#status');
function today(){const n=new Date();return [n.getFullYear(),String(n.getMonth()+1).padStart(2,'0'),String(n.getDate()).padStart(2,'0')].join('-');}
date.min=today();
function invalidate(){result.hidden=true;whatsapp.removeAttribute('href');}
form.addEventListener('input',()=>{date.setCustomValidity('');form.elements.nombre.setCustomValidity('');invalidate();});
form.addEventListener('change',invalidate);
if(connected)document.querySelector('#connection').textContent='Revisá los datos y continuá a WhatsApp para enviar tu solicitud.';
form.addEventListener('submit',e=>{
 e.preventDefault();date.min=today();
 const d=new FormData(form),name=String(d.get('nombre')).trim();
 if(!name){form.elements.nombre.setCustomValidity('Ingresá tu nombre.');form.elements.nombre.reportValidity();return;}
 if(!form.reportValidity())return;
 const parts=String(d.get('fecha')).split('-');
 const notes=String(d.get('notas')).trim();
 const pack=String(d.get('paquete')||'');
 if(pack.startsWith('16 veces')&&d.get('plan')==='Natación con profesor'){status.textContent='El paquete de 16 sesiones solo está disponible sin profesor.';result.hidden=false;whatsapp.removeAttribute('href');messageBox.textContent='Seleccioná otro paquete o natación sin profesor.';result.focus();return;}
 const message=`¡Hola, Balneario La Joya! Me llamo ${name}.\n\nQuisiera solicitar disponibilidad para:\n• Actividad: ${d.get('plan')}\n• Fecha: ${parts[2]}/${parts[1]}/${parts[0]}\n• Cantidad de personas: ${d.get('personas')}${pack?'\n• Paquete solicitado: '+pack:''}${notes?'\n• Comentarios: '+notes:''}\n\n¿Me pueden confirmar disponibilidad, horario, tarifa y requisitos? Entiendo que la reserva queda pendiente de su confirmación. ¡Gracias!`;
 messageBox.textContent=message;result.hidden=false;status.textContent='';
 if(connected){whatsapp.href='https://wa.me/'+WHATSAPP_NUMBER+'?text='+encodeURIComponent(message);whatsapp.target='_blank';whatsapp.rel='noopener noreferrer';whatsapp.textContent='Abrir WhatsApp ↗';whatsapp.removeAttribute('aria-disabled');whatsapp.removeAttribute('tabindex');}
 result.focus({preventScroll:true});result.scrollIntoView({behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth',block:'nearest'});
});
whatsapp.addEventListener('click',e=>{if(!connected){e.preventDefault();status.textContent='Falta configurar el número oficial. Podés copiar el mensaje; todavía no se ha enviado.';}else{status.textContent='Continuá en WhatsApp y presioná Enviar. La reserva requiere confirmación del balneario.';}});
document.querySelector('#copy').addEventListener('click',async()=>{try{await navigator.clipboard.writeText(messageBox.textContent);status.textContent='Mensaje copiado. Todavía no se ha enviado.';}catch{const range=document.createRange();range.selectNodeContents(messageBox);const selection=getSelection();selection.removeAllRanges();selection.addRange(range);status.textContent='Mensaje seleccionado: usá Copiar en tu dispositivo.';}});
const toggle=document.querySelector('.mobile-toggle'),nav=document.querySelector('#navigation');
function closeNavigation(){nav.classList.remove('open');toggle.setAttribute('aria-expanded','false');}
document.addEventListener('pointerdown',e=>{if(nav.classList.contains('open')&&!nav.contains(e.target)&&!toggle.contains(e.target))closeNavigation();});
document.addEventListener('focusin',e=>{if(nav.classList.contains('open')&&!nav.contains(e.target)&&!toggle.contains(e.target))closeNavigation();});
toggle.addEventListener('click',()=>{toggle.setAttribute('aria-expanded',String(nav.classList.toggle('open')));});
nav.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>{nav.classList.remove('open');toggle.setAttribute('aria-expanded','false');}));
document.addEventListener('keydown',e=>{if(e.key==='Escape'){nav.classList.remove('open');toggle.setAttribute('aria-expanded','false');}});
document.querySelectorAll('[data-plan]').forEach(a=>a.addEventListener('click',()=>{document.querySelector('#plan').value=a.dataset.plan;invalidate();}));
// Ondas y personaje: solo se animan durante desplazamiento o interacción.
const motionQuery=matchMedia('(prefers-reduced-motion: reduce)');
let paused=motionQuery.matches,frame=0,until=0,phase=0,last=0,scrollTarget=scrollY,scrollPosition=scrollY;
const diverImage=new Image();diverImage.src='assets/diver.png';
const waves=[];
function activateDiver(w,e){
 if(paused)return;
 const r=w.divider.getBoundingClientRect();
 w.target=Math.max(80,Math.min(w.width-80,e.clientX-r.left));
 if(w.alpha<.02)w.x=w.target-22;
 w.activeUntil=performance.now()+(e.pointerType==='touch'?2400:4000);
 until=w.activeUntil+1200;wake();
}
document.querySelectorAll('main > section').forEach((section,i)=>{
 const divider=document.createElement('div');divider.className='water-divider';divider.setAttribute('aria-hidden','true');
 const canvas=document.createElement('canvas');divider.append(canvas);section.before(divider);
 const ctx=canvas.getContext('2d');if(!ctx)return;
 const w={canvas,ctx,divider,index:i,width:0,height:0,x:0,target:0,alpha:0,activeUntil:0,bubbles:[],emit:0};waves.push(w);
 divider.addEventListener('pointerenter',e=>{if(e.pointerType!=='touch')activateDiver(w,e);},{passive:true});
 divider.addEventListener('pointermove',e=>{if(e.pointerType!=='touch')activateDiver(w,e);},{passive:true});
 divider.addEventListener('pointerdown',e=>{if(e.pointerType==='touch')activateDiver(w,e);},{passive:true});
 divider.addEventListener('pointerleave',()=>{w.activeUntil=0;wake();},{passive:true});
 divider.addEventListener('pointercancel',()=>{w.activeUntil=0;wake();},{passive:true});
});
function resize(){const ratio=Math.min(devicePixelRatio||1,1.5);for(const w of waves){const r=w.divider.getBoundingClientRect();w.width=r.width;w.height=r.height;w.canvas.width=Math.round(r.width*ratio);w.canvas.height=Math.round(r.height*ratio);w.ctx.setTransform(ratio,0,0,ratio,0,0);}draw(performance.now(),0);}
function draw(time,dt){for(const w of waves){const r=w.divider.getBoundingClientRect();if(r.bottom<0||r.top>innerHeight){w.bubbles=[];w.alpha=0;w.activeUntil=0;continue;}const {ctx,width,height}=w;ctx.clearRect(0,0,width,height);
 const movement=paused?0:phase+scrollPosition*.002;
 for(let layer=0;layer<3;layer++){const amplitude=height*(.12+layer*.022);const level=height*(.34+layer*.13);ctx.beginPath();
 for(let x=0;x<=width+12;x+=12){const a=x/width*Math.PI*2;const y=level+Math.sin(a*1.3+movement*(layer%2?-.65:1)+w.index*.7+layer)*amplitude+Math.sin(a*2.4-movement*.5+layer)*amplitude*.3;if(x===0)ctx.moveTo(x,y);else ctx.lineTo(x,y);}
 ctx.lineTo(width,height);ctx.lineTo(0,height);ctx.closePath();ctx.fillStyle=['rgba(81,166,154,.12)','rgba(72,160,150,.17)','rgba(39,109,103,.23)'][layer];ctx.fill();ctx.strokeStyle='rgba(226,248,239,.60)';ctx.lineWidth=1.2;ctx.stroke();}
 if(paused)continue;
 const active=time<w.activeUntil;
 w.alpha=Math.max(0,Math.min(1,w.alpha+(active?dt*4:-dt*3)));
 w.x+=(w.target-w.x)*(1-Math.exp(-dt*6));
 const y=height*.62+Math.sin(time*.003)*3;
 if(w.alpha>.001&&diverImage.complete&&diverImage.naturalWidth){
 const iw=142,ih=iw*diverImage.naturalHeight/diverImage.naturalWidth;
 ctx.save();ctx.globalAlpha=w.alpha;ctx.translate(w.x,y);ctx.rotate(Math.sin(time*.0025)*.055);ctx.drawImage(diverImage,-iw/2,-ih/2,iw,ih);ctx.restore();
 if(active&&time-w.emit>170&&w.bubbles.length<22){w.emit=time;w.bubbles.push({x:w.x+61,y:y-1,age:0,r:2+Math.random()*3,drift:Math.random()*2-1});}
 }
 w.bubbles=w.bubbles.filter(b=>b.age<1.5);
 for(const b of w.bubbles){b.age+=dt;b.y-=dt*36;b.x+=Math.sin(b.age*5+b.drift)*dt*9;ctx.save();ctx.globalAlpha=Math.max(0,1-b.age/1.5)*.8;ctx.beginPath();ctx.arc(b.x,b.y,b.r*(1+b.age*.25),0,Math.PI*2);ctx.fillStyle='rgba(221,255,253,.45)';ctx.fill();ctx.strokeStyle='#519b9d';ctx.lineWidth=1;ctx.stroke();ctx.beginPath();ctx.arc(b.x-b.r*.25,b.y-b.r*.3,.8,0,Math.PI*2);ctx.fillStyle='#fff';ctx.fill();ctx.restore();}
}}
function tick(time){frame=0;if(paused||document.hidden)return;const dt=Math.min((time-(last||time))/1000,.04);last=time;phase+=dt*.85;scrollPosition+=(scrollTarget-scrollPosition)*.11;draw(time,dt);
 if(time<until||Math.abs(scrollTarget-scrollPosition)>.5||waves.some(w=>w.activeUntil>time||w.alpha>.001||w.bubbles.length))frame=requestAnimationFrame(tick);else last=0;
}
function wake(){scrollTarget=scrollY;if(paused||document.hidden){if(!document.hidden)draw(performance.now(),0);return;}until=Math.max(until,performance.now()+1000);if(!frame)frame=requestAnimationFrame(tick);}
function respectMotion(){document.documentElement.classList.toggle('motion-paused',paused);}
motionQuery.addEventListener('change',e=>{paused=e.matches;cancelAnimationFrame(frame);frame=0;last=0;for(const w of waves){w.alpha=0;w.activeUntil=0;w.bubbles=[];}respectMotion();draw(performance.now(),0);if(!paused)wake();});
addEventListener('scroll',wake,{passive:true});addEventListener('resize',()=>{resize();wake();},{passive:true});
document.addEventListener('visibilitychange',()=>{if(document.hidden){cancelAnimationFrame(frame);frame=0;last=0;for(const w of waves){w.activeUntil=0;w.alpha=0;w.bubbles=[];}}else wake();});
diverImage.addEventListener('load',wake);respectMotion();resize();wake();
