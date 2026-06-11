// =====================================================
// BOLÃO DA COPA 2026 — script da Planilha Google
// =====================================================
// COMO INSTALAR (uma vez só):
// 1. Crie uma planilha em sheets.google.com
// 2. Extensões → Apps Script → apague tudo → cole este arquivo
// 3. Botão "Implantar" → Nova implantação → App da Web
//    - Executar como: VOCÊ
//    - Quem pode acessar: QUALQUER PESSOA
// 4. Copie a URL /exec e cole em CONFIG.urlPlanilha no index.html
// NÃO precisa rodar "configurar" manualmente — cria tudo sozinho.
// =====================================================

const ABA_PALPITES   = "Palpites";
const ABA_RESULTADOS = "Resultados";

function garanteAba(nome, cabecalho) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let aba = ss.getSheetByName(nome);
  if (!aba) {
    aba = ss.insertSheet(nome);
    aba.appendRow(cabecalho);
    aba.setFrozenRows(1);
  } else {
    // adiciona colunas que faltam (ex: quando o script é atualizado)
    const atual = aba.getLastColumn();
    for (let i = atual; i < cabecalho.length; i++) {
      aba.getRange(1, i + 1).setValue(cabecalho[i]);
    }
  }
  return aba;
}

// Rode manualmente se quiser pré-criar as abas com nota explicativa
function configurar() {
  const res = garanteAba(ABA_RESULTADOS,
    ["Jogo #", "Gols time 1", "Gols time 2"]);
  res.getRange("A2").setNote(
    "Preencha conforme os jogos terminam.\nEx: jogo 1 → 1 | 2 | 0  significa 2×0\nO site atualiza automaticamente.");
  garanteAba(ABA_PALPITES,
    ["Quando (servidor)", "Nome", "Sobrenome", "Telefone", "Filtro", "Palpites (JSON)"]);
}

// Recebe palpites enviados pelo site
function doPost(e) {
  try {
    const d = JSON.parse(e.postData.contents);
    const nome      = String(d.nome      || "").trim().slice(0, 30);
    const sobrenome = String(d.sobrenome || "").trim().slice(0, 40);
    const telefone  = String(d.telefone  || "").trim().slice(0, 20);
    const filtro    = String(d.filtro    || "todos");
    if (!nome || !d.palpites || typeof d.palpites !== "object") {
      return resposta({ ok: false, erro: "dados incompletos" });
    }
    garanteAba(ABA_PALPITES,
      ["Quando (servidor)", "Nome", "Sobrenome", "Telefone", "Filtro", "Palpites (JSON)"])
      .appendRow([new Date(), nome, sobrenome, telefone, filtro, JSON.stringify(d.palpites)]);
    return resposta({ ok: true });
  } catch (err) {
    return resposta({ ok: false, erro: String(err) });
  }
}

// Devolve palpites + resultados para o site montar a apuração
function doGet() {
  const abaPal = garanteAba(ABA_PALPITES,
    ["Quando (servidor)", "Nome", "Sobrenome", "Telefone", "Filtro", "Palpites (JSON)"]);
  const abaRes = garanteAba(ABA_RESULTADOS,
    ["Jogo #", "Gols time 1", "Gols time 2"]);

  const palpites = abaPal.getDataRange().getValues().slice(1)
    .filter(l => l[1])
    .map(l => ({
      enviadoEm : new Date(l[0]).toISOString(),
      nome      : String(l[1]),
      sobrenome : String(l[2] || ""),
      telefone  : String(l[3] || ""),
      filtro    : String(l[4] || "todos"),
      palpites  : JSON.parse(l[5] || "{}"),
    }));

  const resultados = {};
  abaRes.getDataRange().getValues().slice(1).forEach(l => {
    if (l[0] !== "" && l[1] !== "" && l[2] !== "") {
      resultados[Number(l[0])] = [Number(l[1]), Number(l[2])];
    }
  });

  return resposta({ palpites, resultados });
}

function resposta(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
