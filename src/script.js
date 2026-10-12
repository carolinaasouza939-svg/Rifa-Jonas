/* ===== CONFIG ===== */
const C = {
  total: 200, valor: "R$ 10,00",
  // configuração das faixas de números e dos prêmios correspondentes;
  faixas: [[1,20],[21,40],[41,60],[61,80],[81,100],[101,120],[121,140],[141,150],[151,170],[171,190],[191,200]],
  premios: ["Jogo de xícaras com pires","Mesa de cabeceira suspensa","Kit Natura Todo Dia","Nécessaire com produtos de beleza",
    "Kit de depósito com 10 panos de prato","Kit de Tupperware","Kit Natura Luna","Óculos unissex com proteção UV",
    "Blusa feminina","Conjunto feminino","Cesta de guloseimas"],
  pix: [
    {ate:20,  nome:"Selma",    chave:"(85) 99213-5195"},
    {ate:40,  nome:"Pedro",    chave:"(85) 99278-6616"},
    {ate:60,  nome:"Zinha",    chave:"(85) 99133-9772"},
    {ate:200, nome:"Nenzinha", chave:"(85) 99136-0013"}
  ],
  vendidos: []   // ex.: [1,2,15]
};
/* ================== */
const VERSO = `<div class="verso">“O Senhor o susterá em seu leito de enfermidade, e da sua doença o restaurará.”<cite>Salmos 41:3</cite></div>`;
const HEAD = sub => `<div class="head"><h1>RIFA<span>BENEFICENTE</span></h1><div class="foto"><span>Juntos pelo Jonas</span></div></div><div class="sub">${sub}</div>`;
const SORTEIO = `<div class="chip" style="flex:1.5"><small>Sorteio</small><b class="p">Quando todos os ${C.total} pontos forem vendidos</b></div>`;
const VALOR = `<div class="chip" style="flex:.8"><small>Cada número</small><b>${C.valor}</b></div>`;
const pad = n => String(n).padStart(2,'0');

const paginas = [];
paginas.push({nome:'premios', html:`
  <div class="card">${HEAD('Prêmios para quem participar')}
    <div class="meio"><div class="premios">${C.premios.map(x=>`<div>${x}</div>`).join('')}</div></div>
    <div class="chips">${VALOR}${SORTEIO}</div>
    ${VERSO}</div>`});

C.faixas.forEach(([ini, fim]) => {
  const dono = C.pix.find(x => ini <= x.ate);
  let nums = '';
  for (let n = ini; n <= fim; n++) nums += `<div class="num ${C.vendidos.includes(n)?'vendido':''}"><span>${pad(n)}</span></div>`;
  const curta = (fim-ini+1) <= 10;
  paginas.push({nome:String(paginas.length), html:`
  <div class="card">${HEAD('Participe do sorteio e ajude o Jonas.')}
    <div class="meio"><div class="grade">${nums}${curta?`<div class="obrigado"><b>Cada número faz diferença</b><span>Obrigado por abraçar essa causa e ajudar o Jonas na recuperação.</span></div>`:''}</div></div>
    <div class="caixa">Toda a verba será revertida para <b>medicamentos e alimentos</b> do Jonas, que está hospitalizado. Veja os <b>prêmios</b> na primeira imagem.</div>
    <div class="chips">${VALOR}${SORTEIO}<div class="chip" style="flex:1.2"><small>Pix (${dono.nome})</small><b class="p" style="font-size:30px">${dono.chave}</b></div></div>
    ${VERSO}</div>`});
});

const lista = document.getElementById('lista'), itens = [];
paginas.forEach((pg, i) => {
  const el = document.createElement('div'); el.className = 'item';
  el.innerHTML = `<div class="moldura">${pg.html}</div>` + `<div style="text-align:center;margin-top:10px"><button class="baixar" data-i="${i}" data-n="${pg.nome}">Baixar imagem ${i+1} de ${paginas.length}</button></div>`;
  el.querySelector('.card').id = 'card'+i;
  lista.appendChild(el); itens.push(el);
});

function ajustar(){
  // mede a largura disponível na página (não a do card) e encolhe o card para caber
  const s = Math.min(1, lista.clientWidth / 1080);
  itens.forEach(it => {
    const m = it.querySelector('.moldura');
    m.style.width = 1080*s + 'px';
    m.style.height = 1920*s + 'px';
    it.querySelector('.card').style.transform = `scale(${s})`;
  });
}
ajustar(); addEventListener('resize', ajustar);

// guarda o texto do CSS para colocar dentro da cópia usada no download;
// (em alguns editores/navegadores a cópia não consegue carregar o style.css sozinha);
let cssTexto = '';
const cssPronto = (async () => {
  for (const l of document.querySelectorAll('link[rel="stylesheet"]')) {
    if (!l.href || l.href.includes('fonts.googleapis')) continue;
    try { cssTexto += await (await fetch(l.href)).text(); }
    catch (e) { try { cssTexto += [...l.sheet.cssRules].map(r => r.cssText).join('\n'); } catch (e2) {} }
  }
})();

// enquadramento da foto: 'contain' mostra a foto inteira, 'cover' preenche o quadro (corta as bordas);
const enq = {modo:'contain', x:50, y:30};
function aplicarFoto(){
  document.querySelectorAll('.foto').forEach(x => {
    x.style.backgroundSize = enq.modo;
    x.style.backgroundPosition = `${enq.x}% ${enq.y}%`;
  });
}
document.getElementById('foto').addEventListener('change', e => {
  const f = e.target.files[0]; if(!f) return;
  const r = new FileReader();
  r.onload = () => {
    document.querySelectorAll('.foto').forEach(x => { x.style.backgroundImage = `url(${r.result})`; x.classList.add('tem'); });
    aplicarFoto();
    document.getElementById('ajustes').hidden = false;
  };
  r.readAsDataURL(f);
});
document.getElementById('modo').addEventListener('click', e => {
  enq.modo = enq.modo === 'contain' ? 'cover' : 'contain';
  e.target.textContent = enq.modo === 'contain' ? 'Preencher o quadro' : 'Mostrar foto inteira';
  aplicarFoto();
});
document.getElementById('px').addEventListener('input', e => { enq.x = e.target.value; aplicarFoto(); });
document.getElementById('py').addEventListener('input', e => { enq.y = e.target.value; aplicarFoto(); });

document.addEventListener('click', async e => {
  const b = e.target.closest('.baixar'); if(!b) return;
  const id = 'card'+b.dataset.i, txt = b.textContent;
  b.textContent = 'Gerando...';
  try{
    await cssPronto;
    const cv = await html2canvas(document.getElementById(id), {width:1080, height:1920, scale:1,
      onclone: d => {
        if (cssTexto) { const st = d.createElement('style'); st.textContent = cssTexto; d.head.appendChild(st); }
        const c = d.getElementById(id); c.style.transform='none'; c.parentElement.style.cssText='width:1080px;height:1920px;overflow:visible'; }});
    const a = document.createElement('a'); a.download = `rifa-jonas-${b.dataset.n}.png`; a.href = cv.toDataURL('image/png'); a.click();
  }catch(err){ alert('Não foi possível gerar. Tire um print do card.'); }
  b.textContent = txt;
});
