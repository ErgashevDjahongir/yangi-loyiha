const api = (window.API_URL) ? window.API_URL : 'http://backend:5000';
async function load(){
  const res = await fetch(`${api}/api/notes`);
  const items = await res.json();
  const ul = document.getElementById('list');
  ul.innerHTML = '';
  items.forEach(n=>{
    const li = document.createElement('li');
    li.textContent = n.text + ' (' + new Date(n.created).toLocaleString() + ')';
    const btn = document.createElement('button');
    btn.textContent = 'Del';
    btn.onclick = async ()=> {
      await fetch(`${api}/api/notes/${n._id}`, { method: 'DELETE' });
      load();
    };
    li.appendChild(btn);
    ul.appendChild(li);
  });
}

document.getElementById('f').onsubmit = async (e)=>{
  e.preventDefault();
  const t = document.getElementById('text').value;
  await fetch(`${api}/api/notes`, {
    method:'POST',
    headers:{'Content-Type':'application/json'},
    body: JSON.stringify({ text: t })
  });
  document.getElementById('text').value='';
  load();
};

load();
