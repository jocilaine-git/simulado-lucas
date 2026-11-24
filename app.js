{
// ================== utilidades ==================
const $app = document.getElementById('app');
const $timer = document.getElementById('timer');
const $route = document.getElementById('route');
const LS_KEY = 'simuladoLucas.v1';
const LS_STUDY = 'simuladoLucas.estudo.';

function el(tag, attrs, ...kids) {
  const e = document.createElement(tag);
  for (const [k, v] of Object.entries(attrs || {})) {
    if (v == null || v === false) continue;
    if (k === 'class') e.className = v;
    else if (k.startsWith('on')) e.addEventListener(k.slice(2), v);
    else if (k === 'text') e.textContent = v;
    else e.setAttribute(k, v === true ? '' : v);
  }
  for (const k of kids.flat()) if (k != null && k !== false) e.append(k.nodeType ? k : document.createTextNode(String(k)));
  return e;
}
function render(...nodes) { $app.replaceChildren(...nodes); window.scrollTo(0, 0); }
function load(k, def) { try { const v = localStorage.getItem(k); return v ? JSON.parse(v) : def; } catch (e) { return def; } }
function save(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} }
function del(k) { try { localStorage.removeItem(k); } catch (e) {} }
function fmtTime(s) { s = Math.max(0, Math.round(s)); return Math.floor(s / 60) + ':' + String(s % 60).padStart(2, '0'); }
function dataBR(iso) { try { return new Date(iso).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' }); } catch (e) { return ''; } }
function words(t) { return (t.trim().match(/[A-Za-zÀ-ÿ0-9'’-]+/g) || []).length; }

// embaralha alternativas de forma estável (mesma ordem toda vez para a mesma questão)
function ordem(seed, n) {
  let h = 2166136261; for (const ch of seed) { h ^= ch.charCodeAt(0); h = Math.imul(h, 16777619); }
  const idx = [...Array(n).keys()];
  for (let i = n - 1; i > 0; i--) { h = Math.imul(h ^ (h >>> 13), 1274126177); const j = Math.abs(h) % (i + 1); [idx[i], idx[j]] = [idx[j], idx[i]]; }
  return idx;
}

// ================== API (Apps Script) ==================
async function api(method, payload) {
  if (!CONFIG.API || CONFIG.API.includes('COLE_AQUI')) throw new Error('Sistema ainda não configurado (falta a URL do Apps Script).');
  let res;
  if (method === 'GET') {
    const q = new URLSearchParams({ token: CONFIG.TOKEN, aluno: CONFIG.ALUNO, ...payload });
    res = await fetch(CONFIG.API + '?' + q.toString());
  } else {
    res = await fetch(CONFIG.API, { method: 'POST', body: JSON.stringify({ token: CONFIG.TOKEN, aluno: CONFIG.ALUNO, ...payload }) });
  }
  const j = await res.json();
  if (!j.ok) throw new Error(j.erro || 'Erro no servidor');
  return j;
}
async function apiRetry(payload, tries = 3) {
  let last;
  for (let i = 0; i < tries; i++) {
    try { return await api('POST', payload); } catch (e) { last = e; await new Promise(r => setTimeout(r, 1500 * (i + 1))); }
  }
  throw last;
}
function blobToB64(blob) {
  return new Promise((ok, no) => { const r = new FileReader(); r.onload = () => ok(String(r.result).split(',')[1]); r.onerror = no; r.readAsDataURL(blob); });
}

// ================== som: bip, voz (TTS) e gravação ==================
let actx = null;
function unlockAudio() {
  try { if (!actx) actx = new (window.AudioContext || window.webkitAudioContext)(); if (actx.state === 'suspended') actx.resume(); } catch (e) {}
  try { const u = new SpeechSynthesisUtterance(' '); u.volume = 0; speechSynthesis.speak(u); } catch (e) {}
}
function beep() {
  return new Promise(ok => {
    try {
      unlockAudio();
      const o = actx.createOscillator(), g = actx.createGain();
      o.frequency.value = 880; o.connect(g); g.connect(actx.destination);
      g.gain.setValueAtTime(0.25, actx.currentTime); g.gain.exponentialRampToValueAtTime(0.001, actx.currentTime + 0.35);
      o.start(); o.stop(actx.currentTime + 0.35); setTimeout(ok, 450);
    } catch (e) { ok(); }
  });
}
let vozes = [];
function carregarVozes() { try { vozes = speechSynthesis.getVoices().filter(v => /^en[-_]/i.test(v.lang)); } catch (e) {} }
carregarVozes(); try { speechSynthesis.onvoiceschanged = carregarVozes; } catch (e) {}
function voz(quem) {
  const us = vozes.filter(v => /en[-_]US/i.test(v.lang)), gb = vozes.filter(v => /en[-_](GB|AU|IE)/i.test(v.lang));
  const pref = n => vozes.find(v => v.name.includes(n));
  if (quem === 'B') return pref('Daniel') || gb[0] || us[1] || us[0] || vozes[0];
  return pref('Samantha') || us[0] || vozes[0];
}
function falar(falas, rate = 0.95) {
  // falas: [["A","texto"], ...]
  return new Promise(ok => {
    try { speechSynthesis.cancel(); } catch (e) {}
    if (!('speechSynthesis' in window)) return ok();
    let i = 0;
    const prox = () => {
      if (i >= falas.length) return ok();
      const [quem, txt] = falas[i++];
      const u = new SpeechSynthesisUtterance(txt);
      const v = voz(quem); if (v) u.voice = v;
      u.lang = v ? v.lang : 'en-US'; u.rate = rate;
      let foi = false;
      const seguir = d => { if (foi) return; foi = true; clearTimeout(guarda); setTimeout(prox, d); };
      // segurança: se o navegador não avisar o fim da fala, segue depois do tempo estimado
      const guarda = setTimeout(() => seguir(0), (txt.split(/\s+/).length * 0.55 / rate + 4) * 1000);
      u.onend = () => seguir(350); u.onerror = () => seguir(100);
      speechSynthesis.speak(u);
    };
    prox();
  });
}
function tipoGravacao() {
  if (!window.MediaRecorder) return null;
  for (const t of ['audio/mp4', 'audio/webm;codecs=opus', 'audio/webm', 'audio/aac']) { try { if (MediaRecorder.isTypeSupported(t)) return t; } catch (e) {} }
  return '';
}
async function gravar(maxSeg, onTick) {
  // devolve {stop(): Promise<{blob,mime,seg}>}
  const stream = await navigator.mediaDevices.getUserMedia({ audio: { echoCancellation: true, noiseSuppression: true } });
  const mime = tipoGravacao();
  const rec = mime ? new MediaRecorder(stream, { mimeType: mime }) : new MediaRecorder(stream);
  const partes = []; const t0 = Date.now();
  rec.ondataavailable = e => { if (e.data && e.data.size) partes.push(e.data); };
  let fim;
  const pronto = new Promise(ok => { fim = ok; });
  rec.onstop = () => {
    stream.getTracks().forEach(t => t.stop());
    const tipo = rec.mimeType || mime || 'audio/mp4';
    fim({ blob: new Blob(partes, { type: tipo }), mime: tipo.split(';')[0], seg: Math.round((Date.now() - t0) / 1000) });
  };
  rec.start(500);
  const iv = setInterval(() => { const s = (Date.now() - t0) / 1000; onTick && onTick(maxSeg - s); if (s >= maxSeg) parar(); }, 250);
  let parado = false;
  function parar() { if (parado) return pronto; parado = true; clearInterval(iv); try { rec.stop(); } catch (e) {} return pronto; }
  return { stop: parar };
}
function tocarBlob(blob) {
  return new Promise(ok => { const a = new Audio(URL.createObjectURL(blob)); a.onended = ok; a.onerror = ok; a.play().catch(ok); });
}
function tocarB64(b64, mime) {
  return new Promise(ok => { const a = new Audio('data:' + (mime || 'audio/mp4') + ';base64,' + b64); a.onended = ok; a.onerror = ok; a.play().catch(ok); });
}

// ================== rota / cronômetro ==================
const SECOES = [['reading', 'R'], ['listening', 'L'], ['writing', 'W'], ['speaking', 'S']];
function mostrarRota(atual) {
  if (!atual) { $route.hidden = true; return; }
  $route.hidden = false; $route.replaceChildren();
  const ia = SECOES.findIndex(s => s[0] === atual);
  SECOES.forEach(([nome, l], i) => {
    if (i) $route.append(el('div', { class: 'seg' + (i <= ia ? ' done' : '') }));
    $route.append(el('div', { class: 'stop' + (i < ia ? ' done' : i === ia ? ' on' : ''), title: nome, text: l }));
  });
}
let timerIv = null;
function iniciarTimer(deadline, aoAcabar) {
  pararTimer();
  $timer.hidden = false;
  const tick = () => {
    const r = (deadline - Date.now()) / 1000;
    $timer.textContent = '⏱ ' + fmtTime(r);
    $timer.classList.toggle('low', r < 60);
    if (r <= 0) { pararTimer(); aoAcabar(); }
  };
  tick(); timerIv = setInterval(tick, 500);
}
function pararTimer() { clearInterval(timerIv); timerIv = null; $timer.hidden = true; }

// ================== estado do servidor ==================
let servidor = null; // {feitos, historico, pendente, aguardando}

async function inicio() {
  pararTimer(); mostrarRota(null);
  render(el('div', { class: 'card center' }, el('p', { class: 'mut', text: 'Carregando…' })));
  try {
    servidor = await api('GET', { action: 'estado' });
  } catch (e) {
    render(el('div', { class: 'card' },
      el('h2', { text: 'Ops, não consegui conectar' }),
      el('p', { class: 'mut', text: String(e.message || e) }),
      el('p', { class: 'mut', text: 'Confira a internet e tente de novo.' }),
      el('button', { class: 'btn pri', onclick: inicio, text: 'Tentar de novo' })));
    return;
  }
  telaInicial();
}

function proximoSimulado() {
  const feitos = new Set(servidor.feitos || []);
  return SIMULADOS.find(s => !feitos.has(s.id)) || null;
}

function telaInicial() {
  const andamento = load(LS_KEY, null);
  const p = servidor.pendente;
  const nodes = [];
  nodes.push(el('div', { class: 'card' },
    el('span', { class: 'tag', text: 'Treino Prontos pro Mundo' }),
    el('h2', { text: 'Olá, ' + CONFIG.ALUNO + '!' }),
    el('p', { class: 'mut', text: 'Um simulado por dia, no formato da prova: Reading, Listening, Writing e Speaking. Use fone de ouvido e fique num lugar silencioso.' })));

  if (p) {
    nodes.push(el('div', { class: 'card' },
      el('h3', { text: '📬 A correção do Simulado ' + p.simulado + ' chegou!' }),
      el('p', { text: 'Antes do próximo simulado, faça o estudo da correção: ouça suas gravações, compare com o jeito certo e grave de novo.' }),
      el('button', { class: 'btn sun', onclick: () => telaEstudo(p), text: 'Começar o estudo da correção' })));
  } else if (andamento && andamento.simId) {
    nodes.push(el('div', { class: 'card' },
      el('h3', { text: 'Você tem um simulado em andamento' }),
      el('p', { class: 'mut', text: 'Simulado ' + andamento.simId + ' — continue de onde parou.' }),
      el('button', { class: 'btn pri', onclick: () => { unlockAudio(); continuar(); }, text: 'Continuar simulado' })));
  } else {
    const s = proximoSimulado();
    if (s) {
      nodes.push(el('div', { class: 'card' },
        el('h3', { text: 'Simulado de hoje: ' + s.id + ' · ' + s.tema }),
        el('p', { class: 'mut', text: 'Nível ' + s.nivel + ' · cerca de 55 minutos. Não dá para voltar nas questões depois de enviar, igual na prova.' }),
        el('ul', { class: 'steps' },
          el('li', { text: '📖 Reading — ' + CONFIG.TEMPOS.reading + ' min' }),
          el('li', { text: '🎧 Listening — ' + CONFIG.TEMPOS.listening + ' min (cada áudio toca no máximo 2 vezes)' }),
          el('li', { text: '✍️ Writing — ' + CONFIG.TEMPOS.writing + ' min' }),
          el('li', { text: '🎙 Speaking — repetir frases e responder perguntas' })),
        el('button', { class: 'btn pri', onclick: () => { unlockAudio(); telaPreparo(s); }, text: 'Começar' })));
    } else {
      nodes.push(el('div', { class: 'card' }, el('h3', { text: '🏆 Você fez todos os simulados!' }), el('p', { text: 'Avise a tia para colocar simulados novos.' })));
    }
    if (servidor.aguardando) nodes.push(el('p', { class: 'mut center small', text: servidor.aguardando + ' simulado(s) aguardando correção da tia.' }));
  }

  const h = servidor.historico || [];
  if (h.length) {
    const tb = el('tbody');
    h.slice().reverse().forEach(r => tb.append(el('tr', {},
      el('td', { text: dataBR(r.data) }), el('td', { text: r.simulado }),
      el('td', { class: 'n', text: r.reading || '–' }), el('td', { class: 'n', text: r.listening || '–' }),
      el('td', { class: 'n', text: r.writing !== '' && r.writing != null ? r.writing + '/10' : '…' }),
      el('td', { class: 'n', text: r.speaking !== '' && r.speaking != null ? r.speaking + '/5' : '…' }))));
    nodes.push(el('div', { class: 'card' }, el('h3', { text: 'Sua evolução' }),
      el('table', { class: 'hist' }, el('thead', {}, el('tr', {}, ['Data', 'Sim.', 'Read', 'List', 'Writ', 'Speak'].map(t => el('th', { text: t })))), tb),
      el('p', { class: 'mut small', text: '“…” = a tia ainda vai corrigir.' })));
  }
  render(...nodes);
}

// ================== preparo (teste de som e microfone) ==================
function telaPreparo(s) {
  let ouviu = false, gravou = false;
  const st = el('p', { class: 'mut center' });
  const bOuvir = el('button', { class: 'btn sec', text: '🔊 Testar o som', onclick: async () => {
    unlockAudio(); await falar([['A', 'Hello! If you can hear me, your headphones are working.']]); ouviu = true; checar(); } });
  const bMic = el('button', { class: 'btn sec', text: '🎙 Testar o microfone', onclick: async () => {
    unlockAudio();
    if (!navigator.mediaDevices || !window.MediaRecorder) { st.textContent = 'Este navegador não grava áudio. No iPhone, use o Safari atualizado.'; return; }
    try {
      st.textContent = 'Fale “testing, one, two, three” depois do bip…';
      await beep(); const r = await gravar(4); await new Promise(x => setTimeout(x, 3500)); const g = await r.stop();
      st.textContent = 'Ouvindo sua gravação…'; await tocarBlob(g.blob);
      st.textContent = 'Ficou bom? Se não ouviu nada, confira a permissão do microfone.'; gravou = true; checar();
    } catch (e) { st.textContent = 'Não consegui acessar o microfone. Permita o acesso quando o Safari perguntar (ou em Ajustes › Safari › Microfone).'; }
  } });
  const bIr = el('button', { class: 'btn pri', disabled: true, text: 'Tudo certo, começar!', onclick: () => começar(s) });
  function checar() { bIr.disabled = !(ouviu && gravou); }
  render(el('div', { class: 'card' },
    el('h2', { text: 'Antes de começar' }),
    el('p', { text: 'Coloque o fone de ouvido e teste o som e o microfone.' }),
    bOuvir, bMic, st, bIr));
}

// ================== montagem das etapas ==================
function etapas(s) {
  const e = [];
  s.reading.textos.forEach((t, i) => e.push({ sec: 'reading', tipo: 'texto', i }));
  e.push({ sec: 'reading', tipo: 'lacunas' });
  s.listening.forEach((a, i) => e.push({ sec: 'listening', tipo: 'audio', i }));
  e.push({ sec: 'writing', tipo: 'writing' });
  e.push({ sec: 'speaking', tipo: 'intro' });
  s.speaking.repetir.forEach((f, i) => e.push({ sec: 'speaking', tipo: 'repetir', i }));
  s.speaking.perguntas.forEach((f, i) => e.push({ sec: 'speaking', tipo: 'pergunta', i }));
  e.push({ sec: null, tipo: 'fim' });
  return e;
}
let A = null;    // andamento atual
let SIM = null;  // simulado atual
let ETAPAS = null;
const audiosPendentes = {}; // item -> payload (se falhar o envio)

function começar(s) {
  A = { simId: s.id, envio: s.id + '-' + Date.now().toString(36), passo: 0, inicio: new Date().toISOString(),
        prazo: {}, reading: [], listening: [], writing: '', audios: {} };
  save(LS_KEY, A); continuar();
}
function continuar() {
  A = load(LS_KEY, null); if (!A) return inicio();
  SIM = SIMULADOS.find(x => x.id === A.simId); ETAPAS = etapas(SIM);
  mostrarEtapa();
}
function avançar() { A.passo++; save(LS_KEY, A); mostrarEtapa(); }

function prazoSecao(sec) {
  if (!A.prazo[sec]) { A.prazo[sec] = Date.now() + CONFIG.TEMPOS[sec] * 60000; save(LS_KEY, A); }
  return A.prazo[sec];
}
function pularSecao(sec) {
  // tempo acabou: respostas em branco e vai para a próxima seção
  while (ETAPAS[A.passo] && ETAPAS[A.passo].sec === sec) A.passo++;
  save(LS_KEY, A);
  render(el('div', { class: 'card center' }, el('h2', { text: '⏰ Tempo esgotado' }),
    el('p', { class: 'mut', text: 'O que não foi respondido ficou em branco. Vamos para a próxima parte.' }),
    el('button', { class: 'btn pri', onclick: mostrarEtapa, text: 'Continuar' })));
}

function mostrarEtapa() {
  const et = ETAPAS[A.passo];
  mostrarRota(et.sec);
  if (et.sec && CONFIG.TEMPOS[et.sec]) iniciarTimer(prazoSecao(et.sec), () => pularSecao(et.sec)); else pararTimer();
  ({ texto: etapaTexto, lacunas: etapaLacunas, audio: etapaAudio, writing: etapaWriting, intro: etapaIntroSpeaking,
     repetir: etapaFala, pergunta: etapaFala, fim: etapaFim })[et.tipo](et);
}

// ---------- múltipla escolha ----------
function blocoQuestoes(questoes, prefixo) {
  const escolhas = questoes.map(() => null);
  const box = el('div');
  questoes.forEach((q, qi) => {
    const ord = ordem(prefixo + qi + q.p, q.o.length);
    const opts = ord.map(oi => el('button', { class: 'opt', type: 'button', text: q.o[oi], onclick: () => {
      escolhas[qi] = oi; opts.forEach(b => b.classList.toggle('sel', b === opts[ord.indexOf(oi)]));
    } }));
    box.append(el('p', { class: 'q', text: (qi + 1) + '. ' + q.p }), ...opts);
  });
  return { box, escolhas };
}
function confirmarEnvio(botao, msg, acao) {
  botao.onclick = null;
  const original = botao.textContent;
  botao.textContent = msg; botao.classList.replace('pri', 'sun');
  const t = setTimeout(() => { botao.textContent = original; botao.classList.replace('sun', 'pri'); botao.onclick = () => confirmarEnvio(botao, msg, acao); }, 4000);
  botao.onclick = () => { clearTimeout(t); acao(); };
}
function etapaTexto(et) {
  const t = SIM.reading.textos[et.i];
  const { box, escolhas } = blocoQuestoes(t.q, SIM.id + 'R' + et.i);
  const b = el('button', { class: 'btn pri', text: 'Enviar respostas' });
  b.onclick = () => confirmarEnvio(b, 'Tem certeza? Não dá para voltar', () => {
    const base = SIM.reading.textos.slice(0, et.i).reduce((n, x) => n + x.q.length, 0);
    escolhas.forEach((v, k) => { A.reading[base + k] = v; }); avançar();
  });
  render(el('div', { class: 'card' }, el('span', { class: 'tag', text: 'Reading · texto ' + (et.i + 1) + ' de ' + SIM.reading.textos.length }),
    el('h3', { text: t.titulo }), el('div', { class: 'texto', text: t.texto }), box, b));
}
function etapaLacunas() {
  const { box, escolhas } = blocoQuestoes(SIM.reading.lacunas, SIM.id + 'G');
  const b = el('button', { class: 'btn pri', text: 'Enviar respostas' });
  b.onclick = () => confirmarEnvio(b, 'Tem certeza? Não dá para voltar', () => {
    const base = SIM.reading.textos.reduce((n, x) => n + x.q.length, 0);
    escolhas.forEach((v, k) => { A.reading[base + k] = v; }); avançar();
  });
  render(el('div', { class: 'card' }, el('span', { class: 'tag', text: 'Reading · complete as frases' }),
    el('p', { class: 'mut', text: 'Escolha a melhor opção para completar cada frase.' }), box, b));
}
function etapaAudio(et) {
  const a = SIM.listening[et.i];
  const chave = 'ouv' + et.i;
  A[chave] = A[chave] || 0;
  const { box, escolhas } = blocoQuestoes(a.q, SIM.id + 'L' + et.i);
  const bPlay = el('button', { class: 'btn sun' });
  const upd = () => { const r = 2 - A[chave]; bPlay.textContent = r > 0 ? '▶ Ouvir o áudio (' + r + (r === 1 ? ' vez restante)' : ' vezes restantes)') : 'Você já ouviu 2 vezes'; bPlay.disabled = r <= 0; };
  bPlay.onclick = async () => {
    if (A[chave] >= 2) return;
    A[chave]++; save(LS_KEY, A); bPlay.disabled = true; bPlay.textContent = '🔊 Tocando… (não dá para pausar)';
    await falar(a.falas); upd();
  };
  upd();
  const b = el('button', { class: 'btn pri', text: 'Enviar respostas' });
  b.onclick = () => confirmarEnvio(b, 'Tem certeza? Não dá para voltar', () => {
    try { speechSynthesis.cancel(); } catch (e) {}
    const base = SIM.listening.slice(0, et.i).reduce((n, x) => n + x.q.length, 0);
    escolhas.forEach((v, k) => { A.listening[base + k] = v; }); avançar();
  });
  render(el('div', { class: 'card' }, el('span', { class: 'tag', text: 'Listening · áudio ' + (et.i + 1) + ' de ' + SIM.listening.length + ' · ' + a.tipo }),
    el('p', { class: 'mut', text: 'Dica da prova: leia as perguntas ANTES de ouvir.' }), bPlay, box, b));
}
function etapaWriting() {
  const ta = el('textarea', { spellcheck: 'false', autocorrect: 'off', autocapitalize: 'sentences', autocomplete: 'off', placeholder: 'Write here…' });
  ta.value = A.writing || '';
  ta.addEventListener('paste', e => e.preventDefault());
  ta.addEventListener('drop', e => e.preventDefault());
  const cont = el('span'), meta = el('span');
  const b = el('button', { class: 'btn pri', text: 'Enviar texto' });
  const upd = () => { const n = words(ta.value); A.writing = ta.value; save(LS_KEY, A);
    cont.textContent = n + ' palavras'; meta.textContent = n >= SIM.writing.min ? '✓ mínimo atingido' : 'mínimo: ' + SIM.writing.min; meta.className = n >= SIM.writing.min ? 'ok' : ''; };
  ta.addEventListener('input', upd); upd();
  b.onclick = () => {
    if (words(ta.value) < SIM.writing.min) return confirmarEnvio(b, 'Ainda não chegou no mínimo. Enviar assim mesmo?', () => avançar());
    confirmarEnvio(b, 'Tem certeza? Não dá para voltar', () => avançar());
  };
  render(el('div', { class: 'card' }, el('span', { class: 'tag', text: 'Writing' }),
    el('h3', { text: SIM.writing.tema }),
    el('p', { class: 'mut small', text: 'Escreva sozinho, sem tradutor. Copiar e colar está desativado.' }),
    ta, el('div', { class: 'wc' }, cont, meta), b));
}
function etapaIntroSpeaking() {
  render(el('div', { class: 'card' }, el('span', { class: 'tag', text: 'Speaking' }),
    el('h2', { text: 'Agora é hora de falar' }),
    el('p', { text: 'Parte 1: você ouve uma frase UMA vez e repete. Parte 2: você ouve uma pergunta e responde.' }),
    el('ul', { class: 'steps' },
      el('li', { text: '• Fale só depois do bip.' }),
      el('li', { text: '• Toque em “Concluído” quando terminar.' }),
      el('li', { text: '• Você tem 2 tentativas em cada item.' })),
    el('button', { class: 'btn pri', text: 'Começar o Speaking', onclick: () => { unlockAudio(); avançar(); } })));
}

// ---------- fala (repetir / pergunta) ----------
function infoItem(sim, tipo, i) {
  if (tipo === 'repetir') return { item: 'R' + (i + 1), enunciado: sim.speaking.repetir[i], modelo: sim.speaking.repetir[i] };
  const p = sim.speaking.perguntas[i];
  return { item: 'P' + (i + 1), enunciado: p.p, modelo: p.m };
}
function etapaFala(et) {
  const info = infoItem(SIM, et.tipo, et.i);
  const maxSeg = CONFIG.GRAVACAO[et.tipo];
  let tentativas = 0, ultima = null, ouviu = false;
  const total = et.tipo === 'repetir' ? SIM.speaking.repetir.length : SIM.speaking.perguntas.length;
  const area = el('div');
  const titulo = et.tipo === 'repetir' ? 'Parte 1 · Repita a frase (' + (et.i + 1) + '/' + total + ')' : 'Parte 2 · Responda a pergunta (' + (et.i + 1) + '/' + total + ')';
  const textoPergunta = el('div', { class: 'texto', hidden: true, text: info.enunciado });

  function telaOuvir() {
    area.replaceChildren(
      el('p', { class: 'mut', text: et.tipo === 'repetir' ? 'A frase toca uma vez só e não aparece escrita. Depois do bip, repita.' : 'Ouça a pergunta. Depois do bip, responda com o máximo de detalhes que conseguir (até ' + maxSeg + ' s).' }),
      el('button', { class: 'btn sun', text: et.tipo === 'repetir' ? '▶ Ouvir a frase' : '▶ Ouvir a pergunta', onclick: async (ev) => {
        ev.currentTarget.disabled = true; ev.currentTarget.textContent = '🔊 Ouça com atenção…';
        await falar([['A', info.enunciado]], et.tipo === 'repetir' ? 0.9 : 0.95);
        ouviu = true;
        if (et.tipo === 'pergunta') textoPergunta.hidden = false;
        await gravarAgora();
      } }));
  }
  async function gravarAgora() {
    const seg = el('div', { class: 'big' });
    const bOk = el('button', { class: 'btn rec', text: '■ Concluído' });
    area.replaceChildren(el('div', { class: 'recbox' }, el('p', { text: 'Prepare-se…' })));
    await beep();
    let r;
    try { r = await gravar(maxSeg, s => { seg.textContent = fmtTime(s); }); }
    catch (e) { area.replaceChildren(el('div', { class: 'notice', text: 'Não consegui usar o microfone. Permita o acesso em Ajustes › Safari › Microfone e toque abaixo.' }), el('button', { class: 'btn pri', text: 'Tentar de novo', onclick: gravarAgora })); return; }
    area.replaceChildren(el('div', { class: 'recbox' }, el('div', { class: 'pulse' }), el('p', { text: 'Gravando… fale agora' }), seg), bOk);
    const fim = async () => { bOk.disabled = true; ultima = await r.stop(); tentativas++; telaRevisar(); };
    bOk.onclick = fim;
    // parada automática pelo tempo máximo
    const vigia = setInterval(async () => { if (seg.textContent === '0:00') { clearInterval(vigia); if (!bOk.disabled) fim(); } }, 300);
  }
  function telaRevisar() {
    const st = el('p', { class: 'mut center' });
    const bEnviar = el('button', { class: 'btn pri', text: 'Enviar e seguir →' });
    bEnviar.onclick = async () => {
      bEnviar.disabled = true; st.textContent = 'Enviando seu áudio…';
      const payload = { action: 'audio', envio: A.envio, simulado: SIM.id, tipo: et.tipo, item: info.item, enunciado: info.enunciado, modelo: info.modelo, tentativa: tentativas, mime: ultima.mime, b64: await blobToB64(ultima.blob) };
      try { await apiRetry(payload); A.audios[info.item] = true; }
      catch (e) { audiosPendentes[info.item] = payload; A.audios[info.item] = 'pendente'; }
      avançar();
    };
    area.replaceChildren(
      el('p', { class: 'check center', text: '✓ Tentativa ' + tentativas + ' gravada (' + ultima.seg + ' s)' }),
      el('button', { class: 'btn sec', text: '▶ Ouvir minha gravação', onclick: () => tocarBlob(ultima.blob) }),
      tentativas < 2 ? el('button', { class: 'btn sec', text: '↺ Gravar de novo (última tentativa)', onclick: gravarAgora }) : null,
      bEnviar, st);
  }
  render(el('div', { class: 'card' }, el('span', { class: 'tag', text: 'Speaking' }), el('h3', { text: titulo }), textoPergunta, area));
  telaOuvir();
}

// ---------- fim ----------
function pontuar(sim, ra, la) {
  const rq = [...sim.reading.textos.flatMap(t => t.q), ...sim.reading.lacunas];
  const lq = sim.listening.flatMap(a => a.q);
  return { r: rq.filter((q, i) => ra[i] === q.c).length, rt: rq.length, l: lq.filter((q, i) => la[i] === q.c).length, lt: lq.length };
}
async function etapaFim() {
  pararTimer(); mostrarRota(null);
  const sc = pontuar(SIM, A.reading, A.listening);
  const st = el('p', { class: 'mut center', text: 'Enviando tudo para a tia…' });
  render(el('div', { class: 'card center' }, el('h2', { text: 'Finalizando…' }), st));
  try {
    for (const [item, payload] of Object.entries(audiosPendentes)) { await apiRetry(payload); A.audios[item] = true; delete audiosPendentes[item]; }
    await apiRetry({ action: 'finalizar', envio: A.envio, simulado: SIM.id, inicio: A.inicio,
      reading: sc.r + '/' + sc.rt, readingPct: Math.round(100 * sc.r / sc.rt), listening: sc.l + '/' + sc.lt, listeningPct: Math.round(100 * sc.l / sc.lt),
      writing: A.writing || '', palavras: words(A.writing || ''), respostas: JSON.stringify({ reading: A.reading, listening: A.listening }) });
  } catch (e) {
    render(el('div', { class: 'card center' }, el('h2', { text: 'Quase lá!' }),
      el('p', { text: 'Não consegui enviar agora. Suas respostas estão guardadas neste celular.' }),
      el('p', { class: 'mut small', text: String(e.message || e) }),
      el('button', { class: 'btn pri', text: 'Tentar enviar de novo', onclick: etapaFim })));
    return;
  }
  del(LS_KEY);
  render(el('div', { class: 'card center' },
    el('h2', { text: '🎉 Simulado enviado!' }),
    el('div', { class: 'score' }, el('div', {}, el('b', { text: sc.r + '/' + sc.rt }), 'Reading'), el('div', {}, el('b', { text: sc.l + '/' + sc.lt }), 'Listening')),
    el('p', { class: 'mut', text: 'O Writing e o Speaking a tia vai corrigir. Quando a correção chegar, você faz o estudo antes do próximo simulado.' }),
    el('button', { class: 'btn pri', text: 'Voltar ao início', onclick: inicio })));
}

// ================== estudo da correção ==================
function telaEstudo(p) {
  const sim = SIMULADOS.find(s => s.id === p.simulado);
  const chave = LS_STUDY + p.envio;
  const prog = load(chave, { minha: {}, certa: {}, imitou: {}, writing: false, erros: false });
  const salvar = () => { save(chave, prog); checar(); };
  const nodes = [];
  pararTimer(); mostrarRota(null);
  document.getElementById('htitle').textContent = 'Correção · ' + p.simulado;

  nodes.push(el('div', { class: 'card' }, el('span', { class: 'tag', text: 'Estudo obrigatório' }),
    el('h2', { text: 'Correção do Simulado ' + p.simulado }),
    el('p', { class: 'mut', text: 'Feito em ' + dataBR(p.data) + '. Complete todos os passos para liberar o próximo simulado.' }),
    p.comentarioGeral ? el('div', { class: 'fb', text: '💬 ' + p.comentarioGeral }) : null));

  // ---- speaking ----
  const itens = (p.audios || []).filter(a => a.tipo !== 'estudo');
  const marcas = {};
  const sp = el('div', { class: 'card' }, el('h3', { text: '🎙 Speaking' }),
    el('p', { class: 'mut small', text: 'Em cada item: ouça você, ouça como deveria ser e grave de novo imitando.' }));
  itens.forEach(a => {
    const certo = a.corrigida || a.modelo;
    const lista = el('ul', { class: 'steps' });
    const passo = (k, txt) => { const li = el('li', { text: '○ ' + txt }); li.dataset.k = k; lista.append(li); return li; };
    const l1 = passo('minha', 'Ouvir minha gravação'), l2 = passo('certa', 'Ouvir como deveria ser'), l3 = passo('imitou', 'Gravar imitando o modelo');
    marcas[a.item] = () => {
      [[l1, prog.minha[a.item], 'Ouvir minha gravação'], [l2, prog.certa[a.item], 'Ouvir como deveria ser'], [l3, prog.imitou[a.item], 'Gravar imitando o modelo']]
        .forEach(([li, ok, t]) => { li.textContent = (ok ? '✓ ' : '○ ') + t; li.classList.toggle('done', !!ok); });
    };
    const st = el('p', { class: 'mut small' });
    const bGrav = el('button', { class: 'btn sec', text: '🎙 Gravar imitando' });
    let fase = prog.imitou[a.item] ? 'feito' : 'pronto', gravacao = null;
    const maxS = a.tipo === 'pergunta' ? 45 : 15;
    async function terminar() {
      if (fase !== 'gravando') return;
      fase = 'enviando'; bGrav.disabled = true; bGrav.textContent = 'Enviando…';
      try {
        const g = await gravacao.stop();
        await apiRetry({ action: 'audio', envio: p.envio, simulado: p.simulado, tipo: 'estudo', item: a.item, enunciado: a.enunciado, modelo: certo, tentativa: 1, mime: g.mime, b64: await blobToB64(g.blob) });
        prog.imitou[a.item] = true; salvar(); marcas[a.item]();
        fase = 'feito'; bGrav.classList.replace('rec', 'sec'); bGrav.textContent = '✓ Gravado'; st.textContent = 'Enviado! Se quiser, ouça os dois de novo.';
      } catch (e) { fase = 'pronto'; bGrav.classList.replace('rec', 'sec'); bGrav.disabled = false; bGrav.textContent = '🎙 Gravar imitando'; st.textContent = 'Não deu certo (' + (e.message || e) + '). Tente de novo.'; }
    }
    bGrav.onclick = async () => {
      if (fase === 'gravando') return terminar();
      if (fase !== 'pronto') return;
      if (!prog.certa[a.item]) { st.textContent = 'Primeiro ouça como deveria ser.'; return; }
      fase = 'iniciando'; bGrav.disabled = true; st.textContent = 'Depois do bip, fale imitando o modelo…';
      try {
        unlockAudio(); await beep();
        gravacao = await gravar(maxS, s => { bGrav.textContent = '■ Concluído (' + fmtTime(s) + ')'; if (s <= 0) terminar(); });
        fase = 'gravando'; bGrav.disabled = false; bGrav.classList.replace('sec', 'rec');
      } catch (e) { fase = 'pronto'; bGrav.disabled = false; st.textContent = 'Não consegui usar o microfone. Permita o acesso e tente de novo.'; }
    };
    if (fase === 'feito') { bGrav.disabled = true; bGrav.textContent = '✓ Gravado'; }
    sp.append(el('div', { class: 'card', style: 'box-shadow:none;border:2px solid var(--line)' },
      el('p', { class: 'q', text: (a.tipo === 'repetir' ? 'Repetir: ' : 'Pergunta: ') + a.enunciado }),
      a.nota !== '' && a.nota != null ? el('p', { class: 'mut', text: 'Nota da tia: ' + a.nota + '/5' }) : null,
      a.comentario ? el('div', { class: 'fb', text: '💬 ' + a.comentario }) : null,
      el('p', { class: 'mut small', text: 'Como deveria ser:' }), el('div', { class: 'texto', text: certo }),
      el('div', {},
        el('button', { class: 'btn sec', text: '▶ Minha gravação', onclick: async () => { if (a.b64) await tocarB64(a.b64, a.mime); prog.minha[a.item] = true; salvar(); marcas[a.item](); } }),
        el('button', { class: 'btn sun', text: '▶ Como deveria ser', onclick: async () => { unlockAudio(); await falar([['A', certo]], 0.9); prog.certa[a.item] = true; salvar(); marcas[a.item](); } })),
      bGrav, st, lista));
  });
  nodes.push(sp);

  // ---- writing ----
  const bW = el('button', { class: 'btn sec', text: prog.writing ? '✓ Li o comentário' : 'Li e entendi o comentário', onclick: () => { prog.writing = true; salvar(); bW.textContent = '✓ Li o comentário'; } });
  nodes.push(el('div', { class: 'card' }, el('h3', { text: '✍️ Writing' }),
    p.writing && p.writing.nota !== '' && p.writing.nota != null ? el('p', { class: 'mut', text: 'Nota da tia: ' + p.writing.nota + '/10' }) : null,
    p.writing && p.writing.comentario ? el('div', { class: 'fb', text: '💬 ' + p.writing.comentario }) : el('p', { class: 'mut', text: 'Sem comentário da tia.' }),
    el('details', {}, el('summary', { text: 'Ver o que eu escrevi' }), el('div', { class: 'texto', text: (p.writing && p.writing.texto) || '(em branco)' })),
    bW));

  // ---- erros de reading/listening ----
  let resp = {}; try { resp = JSON.parse(p.respostas || '{}'); } catch (e) {}
  const errosBox = el('div', { class: 'card' }, el('h3', { text: '📖🎧 Seus erros de Reading e Listening' }));
  let nErros = 0;
  if (sim) {
    const rq = [...sim.reading.textos.flatMap((t, ti) => t.q.map(q => ({ ...q, ctx: 'Texto: ' + t.titulo }))), ...sim.reading.lacunas.map(q => ({ ...q, ctx: 'Complete a frase' }))];
    rq.forEach((q, i) => { const r = (resp.reading || [])[i]; if (r === q.c) return; nErros++;
      errosBox.append(el('div', { class: 'texto', style: 'margin:10px 0' }, el('p', { class: 'mut small', text: 'Reading · ' + q.ctx }), el('p', { class: 'q', text: q.p }),
        el('p', {}, 'Você: ', el('span', { class: 'wrong', text: r == null ? '(em branco)' : q.o[r] })), el('p', {}, 'Certo: ', el('span', { class: 'right', text: q.o[q.c] })))); });
    let base = 0;
    sim.listening.forEach(a => {
      const erradas = a.q.map((q, k) => ({ q, r: (resp.listening || [])[base + k] })).filter(x => x.r !== x.q.c);
      base += a.q.length;
      if (!erradas.length) return;
      nErros += erradas.length;
      const card = el('div', { class: 'texto', style: 'margin:10px 0' }, el('p', { class: 'mut small', text: 'Listening · ' + a.tipo }));
      erradas.forEach(({ q, r }) => card.append(el('p', { class: 'q', text: q.p }),
        el('p', {}, 'Você: ', el('span', { class: 'wrong', text: r == null ? '(em branco)' : q.o[r] })), el('p', {}, 'Certo: ', el('span', { class: 'right', text: q.o[q.c] }))));
      card.append(el('button', { class: 'btn sun', text: '▶ Ouvir o áudio de novo', onclick: () => { unlockAudio(); falar(a.falas); } }),
        el('details', {}, el('summary', { text: 'Ver a transcrição' }), ...a.falas.map(f => el('p', { text: (a.falas.length > 1 ? f[0] + ': ' : '') + f[1] }))));
      errosBox.append(card);
    });
  }
  if (!nErros) { errosBox.append(el('p', { class: 'check', text: 'Nenhum erro! 👏' })); prog.erros = true; }
  const bE = el('button', { class: 'btn sec', text: prog.erros ? '✓ Revisado' : 'Revisei meus erros', onclick: () => { prog.erros = true; salvar(); bE.textContent = '✓ Revisado'; } });
  if (nErros) errosBox.append(bE);
  nodes.push(errosBox);

  // ---- concluir ----
  const falta = el('p', { class: 'mut center small' });
  const bFim = el('button', { class: 'btn pri', text: 'Concluir estudo e liberar próximo simulado', disabled: true, onclick: async () => {
    bFim.disabled = true; bFim.textContent = 'Enviando…';
    try { await apiRetry({ action: 'estudo_ok', envio: p.envio }); del(chave); document.getElementById('htitle').textContent = 'Simulado do Lucas'; inicio(); }
    catch (e) { bFim.disabled = false; bFim.textContent = 'Tentar de novo'; falta.textContent = String(e.message || e); }
  } });
  nodes.push(el('div', { class: 'card' }, bFim, falta,
    el('button', { class: 'btn sec', text: 'Voltar depois', onclick: () => { document.getElementById('htitle').textContent = 'Simulado do Lucas'; telaInicial(); } })));

  function checar() {
    const faltam = [];
    itens.forEach(a => { if (!(prog.minha[a.item] && prog.certa[a.item] && prog.imitou[a.item])) faltam.push(a.item); });
    if (!prog.writing) faltam.push('Writing');
    if (!prog.erros) faltam.push('erros');
    bFim.disabled = faltam.length > 0;
    falta.textContent = faltam.length ? 'Falta: ' + faltam.join(', ') : 'Tudo pronto!';
  }
  render(...nodes);
  Object.values(marcas).forEach(f => f());
  checar();
}

// ================== start ==================
inicio();
}
