// shortcut: device-local records; connect an authenticated service before real customer submissions.
const STORAGE_KEY='aurelia-owner-v1';
const escapeHTML=value=>String(value??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const projectById=id=>projects.find(p=>p.id===id);
const latestConstruction=id=>updates.filter(u=>u.project===id&&['Development','Project update'].includes(u.category)).sort((a,b)=>Date.parse(b.date)-Date.parse(a.date))[0];
const money=n=>new Intl.NumberFormat('en-IN',{style:'currency',currency:'INR',maximumFractionDigits:0}).format(n);
const shortMoney=n=>n>=10000000?'₹'+(n/10000000).toFixed(2).replace(/\.00$/,'')+' Cr':'₹'+(n/100000).toFixed(1).replace(/\.0$/,'')+' L';
const portfolioValue=()=>holdings.reduce((total,h)=>total+h.area*projectById(h.project).rate,0);
function blankState(){return {version:1,favourites:[],requests:[],profile:{name:'Jordan Davis',email:'jordan@example.com'},readUpdates:[]}}
function validRequest(r){return r&&typeof r.id==='string'&&r.id.length<70&&['support','visit','interest'].includes(r.kind)&&typeof r.title==='string'&&r.title.length<=100&&typeof r.message==='string'&&r.message.length<=1500&&typeof r.category==='string'&&r.category.length<60&&!!projectById(r.project)&&['Saved','Closed'].includes(r.status)&&typeof r.created==='string'&&!isNaN(Date.parse(r.created))&&(!r.date||/^\d{4}-\d{2}-\d{2}$/.test(r.date))&&(!r.slot||['Morning · 10:00–12:00','Afternoon · 14:00–16:00'].includes(r.slot))&&(Array.isArray(r.replies)&&r.replies.length<=50&&r.replies.every(x=>x&&x.author==='You'&&typeof x.body==='string'&&x.body.length<=1500&&typeof x.date==='string'&&x.date.length<50))}
function loadState(storage){
  try{const raw=storage.getItem(STORAGE_KEY);if(!raw)return {value:blankState(),error:null};const v=JSON.parse(raw);
    if(v.version!==1||!Array.isArray(v.favourites)||v.favourites.length>projects.length||!v.favourites.every(id=>!!projectById(id))||!Array.isArray(v.requests)||v.requests.length>100||!v.requests.every(validRequest)||!v.profile||typeof v.profile.name!=='string'||v.profile.name.length>60||typeof v.profile.email!=='string'||v.profile.email.length>120||!Array.isArray(v.readUpdates)||!v.readUpdates.every(id=>updates.some(u=>u.id===id)))throw Error('Invalid records');
    return {value:v,error:null};
  }catch{return {value:blankState(),error:'Saved records could not be loaded. Existing storage has been left untouched.'}}
}
function writeState(storage,value){try{storage.setItem(STORAGE_KEY,JSON.stringify(value));return true}catch{return false}}
function findProjects(query,filter,favourites,sort){
  const text=query.trim().toLowerCase();let result=projects.filter(p=>(p.name+' '+p.place+' '+p.amenities.join(' ')).toLowerCase().includes(text)&&(filter==='All'||(filter==='Saved'?favourites.includes(p.id):p.status===filter)));
  if(sort==='price')result=result.slice().sort((a,b)=>a.rate*a.sizes[0]-b.rate*b.sizes[0]);
  if(sort==='progress')result=result.slice().sort((a,b)=>b.progress-a.progress);
  return result;
}
function localDay(date=new Date()){const parts=new Intl.DateTimeFormat('en-CA',{timeZone:'Asia/Kolkata',year:'numeric',month:'2-digit',day:'2-digit'}).formatToParts(date);return ['year','month','day'].map(t=>parts.find(p=>p.type===t).value).join('-')}
function validateVisit(date,slot,today=localDay()){
  if(!/^\d{4}-\d{2}-\d{2}$/.test(date)||Number.isNaN(Date.parse(date))||new Date(date+'T00:00:00Z').toISOString().slice(0,10)!==date)return 'Choose a valid date.';
  if(date<=today)return 'Choose a date from tomorrow onward.';
  const end=new Date(today+'T00:00:00Z');end.setUTCDate(end.getUTCDate()+90);
  if(date>end.toISOString().slice(0,10))return 'Choose a date within the next 90 days.';
  if(!['Morning · 10:00–12:00','Afternoon · 14:00–16:00'].includes(slot))return 'Choose a visit time.';
  return '';
}
