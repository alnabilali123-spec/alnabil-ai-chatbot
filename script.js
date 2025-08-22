const chat = document.getElementById('chat');
const form = document.getElementById('form');
const input = document.getElementById('input');

function addBubble(text, who='bot'){
  const tpl = document.getElementById(who === 'user' ? 'bubble-user' : 'bubble-bot');
  const el = tpl.content.firstElementChild.cloneNode(true);
  el.textContent = text;
  chat.appendChild(el);
  chat.scrollTop = chat.scrollHeight;
  return el;
}

function addTyping(){
  const el = addBubble('', 'bot');
  el.innerHTML = `<span class="typing"><span></span><span></span><span></span></span>`;
  return el;
}

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  const message = input.value.trim();
  if(!message) return;
  addBubble(message, 'user');
  input.value = '';
  const typing = addTyping();
  form.querySelector('button').disabled = true;

  try{
    const res = await fetch('/api/chat', {
      method: 'POST',
      headers: {'Content-Type':'application/json'},
      body: JSON.stringify({ message })
    });
    const data = await res.json();
    typing.remove();
    addBubble(data.reply || 'لم يتم الحصول على رد.');
  }catch(err){
    typing.remove();
    addBubble('حدث خطأ أثناء الاتصال بالخادم.');
  }finally{
    form.querySelector('button').disabled = false;
  }
});