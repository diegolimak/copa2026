// =====================================================
// BOLÃO DA COPA 2026 — script da Planilha Google
// =====================================================
// COMO INSTALAR (5 minutos, uma vez só):
// 1. Crie uma planilha nova em sheets.google.com
// 2. Menu Extensões → Apps Script
// 3. Apague tudo e cole este arquivo inteiro
// 4. Rode a função "configurar" uma vez (botão ▶ Executar)
//    e autorize quando o Google pedir
// 5. Botão azul "Implantar" → Nova implantação → tipo "App da Web"
//    - Executar como: VOCÊ
//    - Quem pode acessar: QUALQUER PESSOA
// 6. Copie a URL gerada (termina em /exec) e cole no index.html,
//    em CONFIG.urlPlanilha
// =====================================================

const ABA_PALPITES = "Palpites";
const ABA_RESULTADOS = "Resultados";

// Cria as abas com cabeçalho. Rode UMA vez.
function configurar() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  if (!ss.getSheetByName(ABA_PALPITES)) {
    ss.insertSheet(ABA_PALPITES).appendRow(["Quando", "Nome", "Palpites (JSON)"]);
  }
  if (!ss.getSheetByName(ABA_RESULTADOS)) {
    const aba = ss.insertSheet(ABA_RESULTADOS);
    aba.appendRow(["Jogo", "Gols time 1", "Gols time 2"]);
    aba.getRange("A2").setNote("Preencha conforme os jogos terminam. Ex: 1 | 2 | 0");
  }
}

// Recebe os palpites enviados pelo site
function doPost(e) {
  try {
    const dados = JSON.parse(e.postData.contents);
    const nome = String(dados.nome || "").trim().slice(0, 40);
    if (!nome || !dados.palpites || typeof dados.palpites !== "object") {
      return resposta({ ok: false, erro: "dados incompletos" });
    }
    // O horário registrado é o DO SERVIDOR — ninguém adianta o relógio
    SpreadsheetApp.getActiveSpreadsheet()
      .getSheetByName(ABA_PALPITES)
      .appendRow([new Date(), nome, JSON.stringify(dados.palpites)]);
    return resposta({ ok: true });
  } catch (err) {
    return resposta({ ok: false, erro: String(err) });
  }
}

// Devolve palpites + resultados pro site montar a apuração
function doGet() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const palpites = ss.getSheetByName(ABA_PALPITES)
    .getDataRange().getValues().slice(1)
    .filter(l => l[1])
    .map(l => ({
      enviadoEm: new Date(l[0]).toISOString(),
      nome: String(l[1]),
      palpites: JSON.parse(l[2] || "{}"),
    }));
  const resultados = {};
  ss.getSheetByName(ABA_RESULTADOS)
    .getDataRange().getValues().slice(1)
    .forEach(l => {
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
