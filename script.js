const cursor=document.getElementById('cursor'),cursorRing=document.getElementById('cursorRing');
let mx=-100,my=-100,rx=-100,ry=-100;
document.addEventListener('mousemove',e=>{mx=e.clientX;my=e.clientY;});
(function animCursor(){rx+=(mx-rx)*.15;ry+=(my-ry)*.15;cursor.style.left=mx+'px';cursor.style.top=my+'px';cursorRing.style.left=rx+'px';cursorRing.style.top=ry+'px';requestAnimationFrame(animCursor);})();

const canvas=document.getElementById('bgCanvas'),ctx=canvas.getContext('2d');
let W,H,particles=[];
function resize(){W=canvas.width=window.innerWidth;H=canvas.height=window.innerHeight;}
resize();window.addEventListener('resize',resize);
function Particle(){this.x=Math.random()*W;this.y=Math.random()*H;this.vx=(Math.random()-.5)*.4;this.vy=(Math.random()-.5)*.4;this.r=Math.random()*1.5+.5;this.a=Math.random()*.4+.1;}
for(let i=0;i<80;i++)particles.push(new Particle());
function drawParticles(){
  ctx.clearRect(0,0,W,H);
  const isDark=document.documentElement.getAttribute('data-theme')==='dark';
  const color=isDark?'99,211,155':'16,145,80';
  particles.forEach(p=>{p.x+=p.vx;p.y+=p.vy;if(p.x<0)p.x=W;if(p.x>W)p.x=0;if(p.y<0)p.y=H;if(p.y>H)p.y=0;ctx.beginPath();ctx.arc(p.x,p.y,p.r,0,Math.PI*2);ctx.fillStyle=`rgba(${color},${p.a})`;ctx.fill();});
  particles.forEach((a,i)=>{particles.slice(i+1).forEach(b=>{const d=Math.hypot(a.x-b.x,a.y-b.y);if(d<120){ctx.beginPath();ctx.moveTo(a.x,a.y);ctx.lineTo(b.x,b.y);ctx.strokeStyle=`rgba(${color},${.08*(1-d/120)})`;ctx.lineWidth=.5;ctx.stroke();}});});
  requestAnimationFrame(drawParticles);
}
drawParticles();

const themeToggle=document.getElementById('themeToggle'),themeIcon=document.getElementById('themeIcon'),html=document.documentElement;
themeToggle.addEventListener('change',()=>{const isDark=html.getAttribute('data-theme')==='dark';html.setAttribute('data-theme',isDark?'light':'dark');themeIcon.textContent=isDark?'☀️':'🌙';});

const navbar=document.getElementById('navbar'),backTop=document.getElementById('backTop');
window.addEventListener('scroll',()=>{
  navbar.classList.toggle('scrolled',window.scrollY>50);
  backTop.classList.toggle('visible',window.scrollY>400);
  document.querySelectorAll('section[id]').forEach(sec=>{
    const top=sec.offsetTop-100,bot=top+sec.offsetHeight;
    const link=document.querySelector(`.nav-link[href="#${sec.id}"]`);
    if(link)link.classList.toggle('active',window.scrollY>=top&&window.scrollY<bot);
  });
});

const hamburger=document.getElementById('hamburger'),mobileNav=document.getElementById('mobileNav');
hamburger.addEventListener('click',()=>{const isOpen=mobileNav.classList.toggle('open');hamburger.classList.toggle('open',isOpen);});
function closeMobileNav(){mobileNav.classList.remove('open');hamburger.classList.remove('open');}
document.addEventListener('click',e=>{if(!hamburger.contains(e.target)&&!mobileNav.contains(e.target))closeMobileNav();});

const reveals=document.querySelectorAll('.reveal,.reveal-left,.reveal-right');
const revObs=new IntersectionObserver((entries)=>{
  entries.forEach((e,i)=>{
    if(e.isIntersecting){
      setTimeout(()=>e.target.classList.add('visible'),i*80);
      e.target.querySelectorAll('.count').forEach(animateCount);
    }
  });
},{threshold:.1});
reveals.forEach(el=>revObs.observe(el));

function animateCount(el){
  if(el.dataset.animated)return;el.dataset.animated=true;
  const target=+el.dataset.target,duration=1500,start=performance.now();
  function update(now){const t=Math.min((now-start)/duration,1),ease=1-Math.pow(1-t,3);el.textContent=Math.floor(ease*target);if(t<1)requestAnimationFrame(update);else el.textContent=target;}
  requestAnimationFrame(update);
}

const roles=['"Web & Android Developer"','"BCA Student"','"Problem Solver"','"Quick Learner"'];
let ri=0,ci=0,deleting=false;
const typedEl=document.getElementById('typedRole');
function type(){const cur=roles[ri];if(!deleting){typedEl.textContent=cur.slice(0,++ci);if(ci===cur.length){deleting=true;setTimeout(type,1800);return;}}else{typedEl.textContent=cur.slice(0,--ci);if(ci===0){deleting=false;ri=(ri+1)%roles.length;}}setTimeout(type,deleting?50:90);}
setTimeout(type,2000);

document.querySelectorAll('.exp-nav-item').forEach(item=>{
  item.addEventListener('click',()=>{
    document.querySelectorAll('.exp-nav-item').forEach(i=>i.classList.remove('active'));
    document.querySelectorAll('.exp-panel').forEach(p=>p.classList.remove('active'));
    item.classList.add('active');
    const panel=document.getElementById(item.dataset.panel);
    if(panel)panel.classList.add('active');
  });
});

// ===== PROJECT TAB SWITCHER =====
document.querySelectorAll('.proj-tab').forEach(tab=>{
  tab.addEventListener('click',()=>{
    const proj=tab.dataset.proj;
    // Update tabs
    document.querySelectorAll('.proj-tab').forEach(t=>t.classList.remove('active'));
    tab.classList.add('active');
    // Update content
    document.querySelectorAll('.proj-content').forEach(c=>c.classList.remove('active'));
    const content=document.getElementById('proj-'+proj);
    if(content){
      content.classList.add('active');
      // Re-trigger reveal animations for newly shown content
      content.querySelectorAll('.reveal,.reveal-left,.reveal-right').forEach(el=>{
        el.classList.remove('visible');
        setTimeout(()=>el.classList.add('visible'),100);
      });
    }
  });
});