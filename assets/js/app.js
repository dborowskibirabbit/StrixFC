const DNI=['Niedziela','Poniedziałek','Wtorek','Środa','Czwartek','Piątek','Sobota'];
const M=(s)=>{const[a,b]=s.split(':').map(Number);return a*60+b};

// grafik obowiązujący od 1 września
const PLAN={
 1:[['08:30','16:00','Wolna mata','otwarta sala · treningi indywidualne','mat'],
    ['16:30','17:30','Trening Kids','Piotr · dzieci'],
    ['17:30','18:30','Kickboxing Junior','Piotr · junior'],
    ['18:30','20:00','Kickboxing','Piotr · dorośli'],
    ['20:00','21:30','Boks','Sebastian · dorośli']],
 2:[['07:00','08:30','Boks','Piotr · dorośli'],
    ['08:30','16:00','Wolna mata','otwarta sala · treningi indywidualne','mat'],
    ['16:30','17:30','Boks Junior','Sebastian · junior'],
    ['17:30','18:30','Krav Maga Junior','Grzegorz · junior'],
    ['18:30','20:00','Krav Maga / Samoobrona','Sebastian · dorośli']],
 3:[['08:30','16:00','Wolna mata','otwarta sala · treningi indywidualne','mat'],
    ['16:30','17:30','Trening Kids','Piotr · dzieci'],
    ['17:30','18:30','Kickboxing Junior','Piotr · junior'],
    ['18:30','20:00','Kickboxing','Piotr · dorośli'],
    ['20:00','21:30','Boks','Sebastian · dorośli']],
 4:[['07:00','08:30','Boks','Piotr · dorośli'],
    ['08:30','16:00','Wolna mata','otwarta sala · treningi indywidualne','mat'],
    ['16:30','17:30','Boks Junior','Sebastian · junior'],
    ['17:30','18:30','Krav Maga Junior','Grzegorz · junior'],
    ['18:30','20:00','Krav Maga / Samoobrona','Sebastian · dorośli']],
 5:[['08:30','16:00','Wolna mata','otwarta sala · treningi indywidualne','mat'],
    ['16:30','20:00','Nowe grupy','wkrótce','soon'],
    ['20:00','21:30','Boks','Sebastian · dorośli']],
 6:[['10:00','13:00','Nowe grupy','wkrótce','soon']],
 0:[['10:00','11:00','Strix Intro','Sebastian · bezpłatny trening dla początkujących'],
    ['11:00','12:00','Trening funkcjonalny','Marta'],
    ['12:00','13:00','Mobility','Marta']]
};

/* grafik wakacyjny — obowiązuje do 31 sierpnia */
const WAKACJE={
 1:[['08:30','10:30','Wolna mata','otwarta sala · od 14 lat','mat'],
    ['18:00','19:00','Kids / Kickboxing Junior','Piotr · 6–13 lat'],
    ['19:00','20:15','Muay Thai','Piotr · od 14 lat'],
    ['20:15','21:30','Boks','Sebastian · od 14 lat']],
 2:[['08:30','10:30','Wolna mata','otwarta sala · od 14 lat','mat'],
    ['18:00','19:00','Boks / Krav Maga Junior','Sebastian, Grzegorz · 10–14 lat'],
    ['19:00','20:15','Krav Maga','Grzegorz, Sebastian · od 14 lat'],
    ['20:15','21:30','Boks','Sebastian · od 14 lat']],
 3:[['08:30','10:30','Wolna mata','otwarta sala · od 14 lat','mat'],
    ['18:00','19:00','Kids / Kickboxing Junior','Piotr · 6–13 lat'],
    ['19:00','20:15','Muay Thai','Piotr · od 14 lat'],
    ['20:15','21:30','Boks','Sebastian · od 14 lat']],
 4:[['08:30','10:30','Wolna mata','otwarta sala · od 14 lat','mat'],
    ['18:00','19:00','Boks / Krav Maga Junior','Sebastian, Grzegorz · 10–14 lat'],
    ['19:00','20:15','Krav Maga','Grzegorz, Sebastian · od 14 lat'],
    ['20:15','21:30','Boks','Sebastian · od 14 lat']],
 5:[['08:30','10:30','Wolna mata','otwarta sala · od 14 lat','mat']],
 6:[],
 0:[['10:30','12:00','Boks · Siła','Sebastian · od 14 lat']]
};

const START_WRZESIEN=new Date(2026,8,1);           // 1 września 2026
const WAKACYJNY = new Date() < START_WRZESIEN;
const AKTYWNY = WAKACYJNY ? WAKACJE : PLAN;

const now=new Date();
const dow=now.getDay();
const mins=now.getHours()*60+now.getMinutes();

/* ── karty dni ── */
const order=[1,2,3,4,5,6,0];
document.getElementById('grid').innerHTML=order.map(d=>{
  const items=PLAN[d].map(([t,e,n,s,k])=>`
    <div class="item ${k||''}">
      <div class="t mono">${t}</div>
      <div class="n">${n}<span>${s}</span></div>
    </div>`).join('');
  const dzisiaj = !WAKACYJNY && d===dow;
  return `<article class="day${dzisiaj?' is-today':''}">
      <div class="day-h"><h3>${DNI[d]}</h3>${dzisiaj?'<span class="badge">Dziś</span>':''}</div>
      ${items}
    </article>`;
}).join('');

/* ── dziś na macie ── */
const fmt=new Intl.DateTimeFormat('pl-PL',{weekday:'long',day:'numeric',month:'long'});
document.getElementById('todayDate').textContent=
  fmt.format(now).replace(/^./,c=>c.toUpperCase());

const dzis=AKTYWNY[dow].filter(x=>x[4]!=='soon');
const pozostale=dzis.filter(x=>M(x[1])>mins);
const list=document.getElementById('todayList');

if(!pozostale.length){
  let nd=dow,step=0;
  do{nd=(nd+1)%7;step++}while(!AKTYWNY[nd].filter(x=>x[4]!=='soon').length&&step<7);
  const nxt=AKTYWNY[nd].filter(x=>x[4]!=='soon');
  list.innerHTML=`<p class="empty">Na dziś to już wszystko. Kolejny trening:
    <b>${DNI[nd].toLowerCase()}, ${nxt[0][0]} — ${nxt[0][2]}</b>.</p>`;
}else{
  list.innerHTML=pozostale.map((x,i)=>{
    const [t,e,n,s]=x;
    const trwa=M(t)<=mins&&mins<M(e);
    const doStartu=M(t)-mins;
    let stan='';
    if(trwa) stan='Trwa teraz';
    else if(i===0) stan = doStartu<60 ? `Za ${doStartu} min` : `Start ${t}`;
    const cls=trwa?'row live':(i===0?'row next':'row');
    return `<div class="${cls}">
        <div class="t mono">${t} — ${e}</div>
        <div class="n">${n}<span>${s}</span></div>
        <div class="s">${stan}</div>
      </div>`;
  }).join('');
}

if(WAKACYJNY){
  document.getElementById('todayTag').textContent='Grafik wakacyjny · do 31 sierpnia';
  document.getElementById('gridTag').textContent='Startuje 1 września';
}
document.getElementById('yr').textContent=new Date().getFullYear();

/* ── modal „Kup karnet" ── */
const karnetBtn=document.getElementById('karnet');
const modal=document.getElementById('karnetModal');
if(karnetBtn&&modal){
  const closeBtn=modal.querySelector('.modal-x');
  const openModal=()=>{
    modal.hidden=false;
    requestAnimationFrame(()=>modal.classList.add('open'));
    document.body.classList.add('modal-lock');
    closeBtn.focus();
  };
  const closeModal=()=>{
    modal.classList.remove('open');
    document.body.classList.remove('modal-lock');
    setTimeout(()=>{modal.hidden=true},220);
    karnetBtn.focus();
  };
  karnetBtn.addEventListener('click',e=>{e.preventDefault();openModal()});
  closeBtn.addEventListener('click',closeModal);
  modal.addEventListener('click',e=>{if(e.target===modal)closeModal()});
  document.addEventListener('keydown',e=>{if(e.key==='Escape'&&!modal.hidden)closeModal()});
}
