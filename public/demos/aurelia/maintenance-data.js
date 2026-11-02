// shortcut: illustrative invoices and browser-local settlements; use a server ledger and verified payment webhooks before collecting money.
const MAINTENANCE_KEY='aurelia-maintenance-v1';
const maintenancePlans=[
  {plot:'WC-12',name:'Estate care',items:[['Security & entrance',1000],['Landscaping',900],['Common-area upkeep',600]]},
  {plot:'CV-08',name:'Community care',items:[['Security & entrance',600],['Landscaping',500],['Common-area upkeep',400]]}
];
const maintenanceInvoices=maintenancePlans.flatMap(plan=>['2026-11','2026-10','2026-09'].map(month=>({id:'MC-'+plan.plot+'-'+month,plot:plan.plot,month,due:month+'-10',amount:plan.items.reduce((sum,item)=>sum+item[1],0),paidAt:month==='2026-09'||(month==='2026-10'&&plan.plot==='WC-12')?month+'-05T05:30:00.000Z':null})));
const maintenanceInvoice=id=>maintenanceInvoices.find(i=>i.id===id);
const maintenanceMonth=month=>new Intl.DateTimeFormat('en-IN',{month:'long',year:'numeric',timeZone:'UTC'}).format(new Date(month+'-01T00:00:00Z'));
function loadMaintenance(storage){
  try{const raw=storage.getItem(MAINTENANCE_KEY);if(!raw)return {payments:[],error:null};const payments=JSON.parse(raw);
    if(!Array.isArray(payments)||payments.length>maintenanceInvoices.length||new Set(payments.map(p=>p?.invoice)).size!==payments.length||!payments.every(p=>p&&maintenanceInvoice(p.invoice)&&!maintenanceInvoice(p.invoice).paidAt&&typeof p.paidAt==='string'&&Number.isFinite(Date.parse(p.paidAt))))throw Error('Invalid records');
    return {payments,error:null};
  }catch{return {payments:[],error:'Maintenance records could not be loaded. Existing records have been left untouched; payments are unavailable.'}}
}
function maintenanceStatus(invoice,payments,today=localDay()){
  return invoice.paidAt||payments.some(p=>p.invoice===invoice.id)?'Paid':invoice.due<today?'Overdue':'Due';
}
function maintenanceTotals(payments,today=localDay()){
  return maintenanceInvoices.reduce((total,i)=>{const status=maintenanceStatus(i,payments,today);if(status!=='Paid')total.outstanding+=i.amount;if(status==='Overdue')total.overdue+=i.amount;return total},{outstanding:0,overdue:0});
}
function settleMaintenance(storage,id,now=new Date()){
  const loaded=loadMaintenance(storage),invoice=maintenanceInvoice(id);
  if(loaded.error)return {error:loaded.error};
  if(!invoice)return {error:'Invoice not found.'};
  if(maintenanceStatus(invoice,loaded.payments)==='Paid')return {error:'This invoice is already paid.'};
  if(!Number.isFinite(now.getTime()))return {error:'The payment date is invalid.'};
  const payments=[...loaded.payments,{invoice:id,paidAt:now.toISOString()}];
  try{storage.setItem(MAINTENANCE_KEY,JSON.stringify(payments));return {payments,error:null}}
  catch{return {error:'Could not save the payment. No payment was recorded. Check browser storage and try again.'}}
}
