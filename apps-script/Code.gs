/**
 * Simulado do Lucas — servidor (Google Apps Script ligado a uma planilha)
 * 1) Cole este código em Extensões › Apps Script da planilha
 * 2) Rode a função "setup" uma vez (autorize)
 * 3) Implantar › Nova implantação › App da Web (Executar como: Eu · Acesso: Qualquer pessoa)
 */
const TOKEN = '6zToNHmxk0oO-1cIMU8b3OyD';   // igual ao config.js do site
const PASTA = 'Simulado Lucas';
const AVISAR_POR_EMAIL = true;

const SIM_COLS = ['Envio', 'Data', 'Aluno', 'Simulado', 'Reading', 'Listening', 'Writing (texto)', 'Palavras',
  'Nota Writing (0-10)', 'Comentário Writing', 'Comentário geral', 'Liberar correção', 'Estudado em', 'Duração (min)', 'Respostas (técnico)'];
const AUD_COLS = ['Envio', 'Data', 'Simulado', 'Tipo', 'Item', 'Enunciado', 'Como deveria ser', 'Ouvir',
  'Nota (0-5)', 'Comentário', 'Frase corrigida (opcional)', 'Tentativa', 'FileId (técnico)', 'Mime (técnico)'];
const EVO_COLS = ['Data', 'Simulado', 'Reading %', 'Listening %', 'Writing %', 'Speaking %'];
const S = n => SIM_COLS.indexOf(n) + 1;
const AU = n => AUD_COLS.indexOf(n) + 1;

// ---------------- setup ----------------
function setup() {
  const ss = SpreadsheetApp.getActive();
  ss.setSpreadsheetTimeZone('America/Sao_Paulo');
  const sim = sheet_(ss, 'Simulados', SIM_COLS);
  const aud = sheet_(ss, 'Áudios', AUD_COLS);
  const evo = sheet_(ss, 'Evolução', EVO_COLS);

  sim.getRange(2, S('Liberar correção'), 999, 1).setDataValidation(SpreadsheetApp.newDataValidation().requireCheckbox().build());
  sim.getRange(2, S('Nota Writing (0-10)'), 999, 1).setDataValidation(SpreadsheetApp.newDataValidation().requireNumberBetween(0, 10).setAllowInvalid(false).build());
  aud.getRange(2, AU('Nota (0-5)'), 999, 1).setDataValidation(SpreadsheetApp.newDataValidation().requireValueInList(['0', '1', '2', '3', '4', '5']).build());
  sim.setColumnWidth(S('Writing (texto)'), 380); sim.setColumnWidth(S('Comentário Writing'), 260); sim.setColumnWidth(S('Comentário geral'), 260);
  sim.getRange('G:G').setWrap(true); sim.getRange('J:K').setWrap(true);
  aud.setColumnWidth(AU('Enunciado'), 260); aud.setColumnWidth(AU('Como deveria ser'), 300); aud.setColumnWidth(AU('Comentário'), 260); aud.setColumnWidth(AU('Frase corrigida (opcional)'), 260);
  aud.getRange('F:G').setWrap(true); aud.getRange('J:K').setWrap(true);
  sim.hideColumns(S('Envio')); sim.hideColumns(S('Respostas (técnico)'));
  aud.hideColumns(AU('FileId (técnico)')); aud.hideColumns(AU('Mime (técnico)'));
  // destaque das colunas que a tia preenche
  [S('Nota Writing (0-10)'), S('Comentário Writing'), S('Comentário geral'), S('Liberar correção')].forEach(c => sim.getRange(1, c).setBackground('#ffc233'));
  [AU('Nota (0-5)'), AU('Comentário'), AU('Frase corrigida (opcional)')].forEach(c => aud.getRange(1, c).setBackground('#ffc233'));

  if (!evo.getCharts().length) {
    const ch = evo.newChart().asLineChart().addRange(evo.getRange('B1:B200')).addRange(evo.getRange('C1:F200'))
      .setPosition(2, 8, 0, 0).setOption('title', 'Evolução do Lucas (%)').setOption('vAxis', { minValue: 0, maxValue: 100 })
      .setOption('useFirstColumnAsDomain', true).setNumHeaders(1).build();
    evo.insertChart(ch);
  }
  const f = pasta_();
  const del = ss.getSheetByName('Página1') || ss.getSheetByName('Sheet1');
  if (del && ss.getSheets().length > 3) ss.deleteSheet(del);
  Logger.log('Pronto! Pasta dos áudios: ' + f.getUrl());
}
function sheet_(ss, nome, cols) {
  let sh = ss.getSheetByName(nome);
  if (!sh) sh = ss.insertSheet(nome);
  sh.getRange(1, 1, 1, cols.length).setValues([cols]).setFontWeight('bold').setBackground('#13233f').setFontColor('#ffffff');
  sh.setFrozenRows(1);
  return sh;
}
function pasta_() {
  const props = PropertiesService.getScriptProperties();
  const id = props.getProperty('FOLDER_ID');
  if (id) { try { return DriveApp.getFolderById(id); } catch (e) {} }
  const it = DriveApp.getFoldersByName(PASTA);
  const f = it.hasNext() ? it.next() : DriveApp.createFolder(PASTA);
  props.setProperty('FOLDER_ID', f.getId());
  return f;
}

// ---------------- web ----------------
function json_(o) { return ContentService.createTextOutput(JSON.stringify(o)).setMimeType(ContentService.MimeType.JSON); }

function doGet(e) {
  try {
    const p = e.parameter || {};
    if (p.token !== TOKEN) return json_({ ok: false, erro: 'acesso negado' });
    if (p.action === 'estado') return json_(estado_(p.aluno || 'Lucas'));
    return json_({ ok: true, msg: 'Simulado do Lucas no ar' });
  } catch (err) { return json_({ ok: false, erro: String(err) }); }
}

function doPost(e) {
  const lock = LockService.getScriptLock();
  try {
    const d = JSON.parse(e.postData.contents);
    if (d.token !== TOKEN) return json_({ ok: false, erro: 'acesso negado' });
    lock.waitLock(25000);
    if (d.action === 'audio') return json_(salvarAudio_(d));
    if (d.action === 'finalizar') return json_(finalizar_(d));
    if (d.action === 'estudo_ok') return json_(estudoOk_(d));
    return json_({ ok: false, erro: 'ação desconhecida' });
  } catch (err) { return json_({ ok: false, erro: String(err) }); }
  finally { try { lock.releaseLock(); } catch (e) {} }
}

// ---------------- ações ----------------
function salvarAudio_(d) {
  const ss = SpreadsheetApp.getActive(), aud = ss.getSheetByName('Áudios');
  const ext = /webm/.test(d.mime) ? 'webm' : 'm4a';
  const quando = Utilities.formatDate(new Date(), 'America/Sao_Paulo', 'yyyy-MM-dd HH.mm');
  const nome = [d.simulado, quando, d.tipo, d.item].join(' ') + '.' + ext;
  const blob = Utilities.newBlob(Utilities.base64Decode(d.b64), d.mime || 'audio/mp4', nome);
  const file = pasta_().createFile(blob);
  const row = [d.envio, new Date(), d.simulado, d.tipo, d.item, d.enunciado, d.modelo, '', '', '', '', d.tentativa || 1, file.getId(), d.mime || 'audio/mp4'];
  aud.appendRow(row);
  const r = aud.getLastRow();
  linkOuvir_(aud, r, file.getId());
  if (d.tipo === 'estudo') aud.getRange(r, 1, 1, AUD_COLS.length).setBackground('#eef5ff');
  return { ok: true, fileId: file.getId() };
}

// link "▶ ouvir" gravado direto na célula (sem fórmula, não depende do idioma da planilha)
function linkOuvir_(aud, r, fileId) {
  const url = 'https://drive.google.com/file/d/' + fileId + '/view';
  aud.getRange(r, AU('Ouvir')).setRichTextValue(
    SpreadsheetApp.newRichTextValue().setText('▶ ouvir').setLinkUrl(url).build());
}

// rode uma vez pelo editor para refazer os links das linhas que já existem na aba Áudios
function corrigirLinks() {
  const aud = SpreadsheetApp.getActive().getSheetByName('Áudios');
  const n = aud.getLastRow();
  if (n < 2) return;
  const ids = aud.getRange(2, AU('FileId (técnico)'), n - 1, 1).getValues();
  let feitos = 0;
  ids.forEach((v, i) => { if (v[0]) { linkOuvir_(aud, i + 2, String(v[0])); feitos++; } });
  Logger.log('Links refeitos: ' + feitos);
}

function finalizar_(d) {
  const ss = SpreadsheetApp.getActive(), sim = ss.getSheetByName('Simulados');
  const ja = acharLinha_(sim, d.envio);
  const dur = d.inicio ? Math.round((Date.now() - new Date(d.inicio).getTime()) / 60000) : '';
  const row = [d.envio, new Date(), d.aluno, d.simulado, d.reading, d.listening, d.writing, d.palavras, '', '', '', false, '', dur, d.respostas];
  let r;
  if (ja) { r = ja; sim.getRange(r, 1, 1, row.length).setValues([row]); }
  else { sim.appendRow(row); r = sim.getLastRow(); }
  sim.getRange(r, S('Liberar correção')).insertCheckboxes();
  // linha de evolução
  const evo = ss.getSheetByName('Evolução');
  if (!ja) {
    evo.appendRow(['', '', d.readingPct, d.listeningPct, '', '']);
    const e = evo.getLastRow();
    evo.getRange(e, 1).setFormula('=Simulados!B' + r).setNumberFormat('dd/MM');
    evo.getRange(e, 2).setFormula('=Simulados!D' + r);
    evo.getRange(e, 5).setFormula('=IF(Simulados!I' + r + '="","",Simulados!I' + r + '*10)');
    evo.getRange(e, 6).setFormula('=IFERROR(AVERAGEIFS(\'Áudios\'!I:I,\'Áudios\'!A:A,Simulados!A' + r + ',\'Áudios\'!D:D,"<>estudo")/5*100,"")');
  }
  if (AVISAR_POR_EMAIL) {
    try {
      MailApp.sendEmail(Session.getEffectiveUser().getEmail(), '📬 ' + d.aluno + ' terminou o simulado ' + d.simulado,
        d.aluno + ' terminou o simulado ' + d.simulado + ' (' + dur + ' min).\n\nReading: ' + d.reading + '\nListening: ' + d.listening +
        '\nWriting: ' + d.palavras + ' palavras\n\nCorrija na planilha (abas Simulados e Áudios) e marque "Liberar correção":\n' + ss.getUrl());
    } catch (e) {}
  }
  return { ok: true };
}

function estudoOk_(d) {
  const ss = SpreadsheetApp.getActive(), sim = ss.getSheetByName('Simulados');
  const r = acharLinha_(sim, d.envio);
  if (!r) return { ok: false, erro: 'simulado não encontrado' };
  sim.getRange(r, S('Estudado em')).setValue(new Date());
  if (AVISAR_POR_EMAIL) {
    try { MailApp.sendEmail(Session.getEffectiveUser().getEmail(), '✅ ' + (d.aluno || 'Lucas') + ' estudou a correção do ' + sim.getRange(r, S('Simulado')).getValue(),
      'As gravações imitando o modelo estão na aba Áudios (linhas azuis, tipo "estudo").\n' + ss.getUrl()); } catch (e) {}
  }
  return { ok: true };
}

function acharLinha_(sh, envio) {
  const n = sh.getLastRow(); if (n < 2) return 0;
  const ids = sh.getRange(2, 1, n - 1, 1).getValues();
  for (let i = 0; i < ids.length; i++) if (ids[i][0] === envio) return i + 2;
  return 0;
}

function estado_(aluno) {
  const ss = SpreadsheetApp.getActive();
  const sim = ss.getSheetByName('Simulados'), aud = ss.getSheetByName('Áudios');
  const sv = sim.getLastRow() > 1 ? sim.getRange(2, 1, sim.getLastRow() - 1, SIM_COLS.length).getValues() : [];
  const av = aud.getLastRow() > 1 ? aud.getRange(2, 1, aud.getLastRow() - 1, AUD_COLS.length).getValues() : [];
  const v = (row, nome) => row[S(nome) - 1];
  const a = (row, nome) => row[AU(nome) - 1];
  const linhas = sv.filter(r => String(v(r, 'Aluno')).toLowerCase() === String(aluno).toLowerCase());

  const mediaSpeaking = envio => {
    const notas = av.filter(r => a(r, 'Envio') === envio && a(r, 'Tipo') !== 'estudo' && a(r, 'Nota (0-5)') !== '').map(r => Number(a(r, 'Nota (0-5)')));
    return notas.length ? Math.round(10 * notas.reduce((x, y) => x + y, 0) / notas.length) / 10 : '';
  };
  const historico = linhas.map(r => {
    const lib = v(r, 'Liberar correção') === true;
    return { data: iso_(v(r, 'Data')), simulado: v(r, 'Simulado'), reading: v(r, 'Reading'), listening: v(r, 'Listening'),
      writing: lib ? v(r, 'Nota Writing (0-10)') : '', speaking: lib ? mediaSpeaking(v(r, 'Envio')) : '' };
  });
  const pend = linhas.find(r => v(r, 'Liberar correção') === true && !v(r, 'Estudado em'));
  let pendente = null;
  if (pend) {
    const envio = v(pend, 'Envio');
    const porItem = {};
    av.filter(r => a(r, 'Envio') === envio && a(r, 'Tipo') !== 'estudo').forEach(r => { porItem[a(r, 'Item')] = r; });
    const audios = Object.keys(porItem).sort((x, y) => (x[0] === 'R' ? 0 : 1) - (y[0] === 'R' ? 0 : 1) || x.localeCompare(y)).map(k => {
      const r = porItem[k];
      let b64 = '';
      try { b64 = Utilities.base64Encode(DriveApp.getFileById(a(r, 'FileId (técnico)')).getBlob().getBytes()); } catch (e) {}
      return { item: k, tipo: a(r, 'Tipo'), enunciado: a(r, 'Enunciado'), modelo: a(r, 'Como deveria ser'), nota: a(r, 'Nota (0-5)'),
        comentario: a(r, 'Comentário'), corrigida: a(r, 'Frase corrigida (opcional)'), mime: a(r, 'Mime (técnico)'), b64: b64 };
    });
    pendente = { envio: envio, simulado: v(pend, 'Simulado'), data: iso_(v(pend, 'Data')), respostas: v(pend, 'Respostas (técnico)'),
      comentarioGeral: v(pend, 'Comentário geral'),
      writing: { texto: v(pend, 'Writing (texto)'), nota: v(pend, 'Nota Writing (0-10)'), comentario: v(pend, 'Comentário Writing') }, audios: audios };
  }
  return { ok: true, feitos: linhas.map(r => v(r, 'Simulado')), historico: historico, pendente: pendente,
    aguardando: linhas.filter(r => v(r, 'Liberar correção') !== true).length };
}
function iso_(d) { return d instanceof Date ? d.toISOString() : String(d || ''); }
