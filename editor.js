(() => {
  'use strict';
  const main=document.getElementById('main'),panel=document.getElementById('editor-panel');
  if(!main||!panel)return;
  const editButton=document.getElementById('edit-page'),status=document.getElementById('editor-status');
  const cv=document.querySelector('[data-cv-link]'),cvInput=document.getElementById('cv-input');
  const pageName=location.pathname.split('/').pop()||'index.html';
  // Versioned pages ignore incompatible positional saves without deleting them.
  const editVersion=main.dataset.editVersion;
  const key='qimin-page-edits-'+(editVersion||'v1')+':'+pageName;
  const elements=[...main.querySelectorAll('h1,h2,h3,p,.language-list li,.simple-list li')];
  elements.forEach((el,i)=>{
    if(!editVersion||!el.dataset.editKey)el.dataset.editKey=String(i);
  });
  let editing=false,original=null,dirty=false;
  const current=()=>({texts:Object.fromEntries(elements.map(el=>[el.dataset.editKey,el.textContent])),cv:cv?.getAttribute('href')||''});
  const show=message=>{status.textContent=message};
  function validLink(value){
    if(!value)return true;
    try{const u=new URL(value,document.baseURI);return ['https:','http:','file:'].includes(u.protocol)}catch{return false}
  }
  function setCV(value){
    if(!cv)return;
    cv.textContent='CV';
    if(value){cv.setAttribute('href',value);cv.setAttribute('download','CV_Qimin_Sheng.pdf');cv.setAttribute('aria-label','Download CV as PDF');cv.classList.remove('unavailable');cv.removeAttribute('aria-disabled')}
    else{cv.removeAttribute('href');cv.removeAttribute('download');cv.removeAttribute('aria-label');cv.classList.add('unavailable');cv.setAttribute('aria-disabled','true')}
  }
  function restore(value){
    if(!value||typeof value!=='object')return;
    for(const el of elements){const text=value.texts?.[el.dataset.editKey];if(typeof text==='string'){
      if(el.textContent!==text){el.textContent=text;el.classList.add('edited-text')}
    }}
    if(typeof value.cv==='string'&&value.cv.trim()&&validLink(value.cv))setCV(value.cv);
  }
  try{const stored=JSON.parse(localStorage.getItem(key)||'null');restore(stored)}catch{}
  function finish(){editing=false;dirty=false;panel.hidden=true;elements.forEach(el=>{el.removeAttribute('contenteditable');el.removeAttribute('tabindex')});document.body.classList.remove('editing');editButton.textContent='Edit page';editButton.disabled=false;editButton.focus()}
  editButton.addEventListener('click',()=>{original=main.innerHTML;editing=true;dirty=false;panel.hidden=false;document.body.classList.add('editing');elements.forEach(el=>{el.contentEditable='plaintext-only';el.tabIndex=0});if(cv){document.getElementById('cv-field').hidden=false;cvInput.value=cv.getAttribute('href')||''}editButton.disabled=true;show('Editing is local to this browser. Click any outlined text.');panel.scrollIntoView({block:'start',behavior:'smooth'})});
  main.addEventListener('input',()=>{if(editing)dirty=true});cvInput.addEventListener('input',()=>{dirty=true});
  main.addEventListener('click',e=>{if(editing&&e.target.closest('a'))e.preventDefault()});
  function save(){
    if(cv){const value=cvInput.value.trim();if(!validLink(value)){show('Please use a PDF file path or an http/https link.');cvInput.focus();return false}setCV(value)}
    elements.forEach(el=>{if(editing)el.classList.add('edited-text')});
    let saved=true;try{localStorage.setItem(key,JSON.stringify(current()))}catch{saved=false}
    finish();show(saved?'Saved in this browser. Download HTML to keep a file copy.':'Browser saving is unavailable. Use Download HTML to keep your changes.');return true;
  }
  document.getElementById('save-edits').addEventListener('click',save);
  document.getElementById('cancel-edits').addEventListener('click',()=>{const scratch=document.createElement('div');scratch.innerHTML=original;const old=[...scratch.querySelectorAll('[data-edit-key]')];old.forEach((saved,i)=>{elements[i].innerHTML=saved.innerHTML;elements[i].className=saved.className});const oldCV=scratch.querySelector('[data-cv-link]');if(cv&&oldCV)setCV(oldCV.getAttribute('href')||'');finish();show('Changes cancelled.')});
  window.addEventListener('beforeunload',event=>{if(editing&&dirty){event.preventDefault();event.returnValue=''}});
  document.getElementById('download-page').addEventListener('click',()=>{
    if(editing&&!save())return;
    const copy=document.documentElement.cloneNode(true);
    copy.querySelectorAll('[contenteditable]').forEach(el=>{el.removeAttribute('contenteditable');el.removeAttribute('tabindex')});
    copy.querySelector('body').classList.remove('editing');copy.querySelector('#editor-panel').hidden=true;copy.querySelector('#edit-page').disabled=false;copy.querySelector('#editor-status').textContent='';
    const link=document.createElement('a'),url=URL.createObjectURL(new Blob(['<!doctype html>\n'+copy.outerHTML],{type:'text/html;charset=utf-8'}));link.href=url;link.download=pageName;link.click();setTimeout(()=>URL.revokeObjectURL(url),1000);show('HTML downloaded. Keep it with the website’s colors.css, style.css, scripts, and downloads folder.');
  });
})();
