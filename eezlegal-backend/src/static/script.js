async function $(sel){return document.querySelector(sel)}
async function health(){
  let s = await fetch('/api/health'); document.getElementById('status').textContent = s.ok? 'API healthy' : 'API error';
  let st = await fetch('/api/status'); if(st.ok){ let j = await st.json(); document.getElementById('status').textContent += ` | has_key=${j.has_openai_key} model=${j.model}`;}
}
function add(text, who='bot'){ let d=document.createElement('div'); d.className='msg '+who; d.textContent=text; document.getElementById('chat').appendChild(d); }
document.getElementById('f').addEventListener('submit', async (e)=>{
  e.preventDefault(); const v=document.getElementById('t').value.trim(); if(!v) return;
  add(v,'user'); document.getElementById('t').value='';
  try{
    const r = await fetch('/api/chat',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({message:v})});
    const j = await r.json();
    if(!r.ok){ add('Error: '+(j.detail||j.error||r.statusText),'bot'); } else { add(j.message||JSON.stringify(j),'bot'); }
  }catch(err){ add('Network error: '+err.message,'bot'); }
});
health();
