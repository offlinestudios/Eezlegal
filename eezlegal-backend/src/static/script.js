function add(text, who='bot'){ const d=document.createElement('div'); d.className='msg '+who; d.textContent=text; document.getElementById('chat').appendChild(d); d.scrollIntoView(); }
async function check(){
  try{ const r=await fetch('/api/health',{cache:'no-store'}); if(!r.ok) throw new Error(); } catch{ document.getElementById('status').textContent='API unavailable'; return; }
  try{ const s=await fetch('/api/status',{cache:'no-store'}); if(!s.ok) throw new Error(); const j=await s.json(); document.getElementById('status').textContent = 'API healthy | has_key='+j.has_openai_key+' model='+j.model; }
  catch{ document.getElementById('status').textContent='API healthy'; }
}
async function sendStream(prompt){
  const res = await fetch('/api/chat/stream',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({message:prompt})});
  if(!res.ok || !res.body) throw new Error('Stream failed');
  const reader=res.body.getReader(); const decoder=new TextDecoder(); let buf='', out=''; const node=document.createElement('div'); node.className='msg bot'; node.textContent=''; document.getElementById('chat').appendChild(node);
  while(true){ const {value,done}=await reader.read(); if(done) break; buf += decoder.decode(value,{stream:true}); let idx; while((idx=buf.indexOf('\n\n'))>=0){ const evt = buf.slice(0,idx).trim(); buf = buf.slice(idx+2); if(!evt.startsWith('data:')) continue; const data = evt.slice(5).trim(); if(data==='[DONE]') break; try{ const obj=JSON.parse(data); if(obj.delta){ out += obj.delta; node.textContent = out; } if(obj.error){ node.textContent='Error: '+(obj.detail||obj.error); } }catch(e){} } }
}
async function sendNonStream(prompt){
  const r=await fetch('/api/chat',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({message:prompt})}); const j=await r.json(); if(!r.ok){ add('Error: '+(j.detail||j.error||r.statusText)); } else { add(j.message); }
}
document.getElementById('form').addEventListener('submit', async (e)=>{
  e.preventDefault(); const ta=document.getElementById('prompt'); const v=ta.value.trim(); if(!v) return; add(v,'user'); ta.value=''; document.getElementById('send').disabled=true;
  try{ await sendStream(v); } catch{ await sendNonStream(v); } finally{ document.getElementById('send').disabled=false; }
});
check();
