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

// Lista dos jogos pra pré-preencher a aba Resultados
const LISTA_JOGOS = [
  [1,"México x África do Sul","11/06"],[2,"Coreia do Sul x República Tcheca","11/06"],
  [3,"Canadá x Bósnia","12/06"],[4,"Estados Unidos x Paraguai","12/06"],
  [5,"Catar x Suíça","13/06"],[6,"Brasil x Marrocos","13/06"],[7,"Haiti x Escócia","13/06"],
  [8,"Austrália x Turquia","14/06"],[9,"Alemanha x Curaçao","14/06"],[10,"Países Baixos x Japão","14/06"],
  [11,"Costa do Marfim x Equador","14/06"],[12,"Suécia x Tunísia","14/06"],
  [13,"Espanha x Cabo Verde","15/06"],[14,"Bélgica x Egito","15/06"],
  [15,"Arábia Saudita x Uruguai","15/06"],[16,"Irã x Nova Zelândia","15/06"],
  [17,"França x Senegal","16/06"],[18,"Iraque x Noruega","16/06"],[19,"Argentina x Argélia","16/06"],
  [20,"Áustria x Jordânia","17/06"],[21,"Portugal x RD Congo","17/06"],[22,"Inglaterra x Croácia","17/06"],
  [23,"Gana x Panamá","17/06"],[24,"Uzbequistão x Colômbia","17/06"],
  [25,"República Tcheca x África do Sul","18/06"],[26,"Suíça x Bósnia","18/06"],
  [27,"Canadá x Catar","18/06"],[28,"México x Coreia do Sul","18/06"],
  [29,"Estados Unidos x Austrália","19/06"],[30,"Escócia x Marrocos","19/06"],[31,"Brasil x Haiti","19/06"],
  [32,"Turquia x Paraguai","20/06"],[33,"Países Baixos x Suécia","20/06"],
  [34,"Alemanha x Costa do Marfim","20/06"],[35,"Equador x Curaçao","20/06"],
  [36,"Tunísia x Japão","21/06"],[37,"Espanha x Arábia Saudita","21/06"],[38,"Bélgica x Irã","21/06"],
  [39,"Uruguai x Cabo Verde","21/06"],[40,"Nova Zelândia x Egito","21/06"],
  [41,"Argentina x Áustria","22/06"],[42,"França x Iraque","22/06"],[43,"Noruega x Senegal","22/06"],
  [44,"Jordânia x Argélia","23/06"],[45,"Portugal x Uzbequistão","23/06"],[46,"Inglaterra x Gana","23/06"],
  [47,"Panamá x Croácia","23/06"],[48,"Colômbia x RD Congo","23/06"],
  [49,"Suíça x Canadá","24/06"],[50,"Bósnia x Catar","24/06"],[51,"Escócia x Brasil","24/06"],
  [52,"Marrocos x Haiti","24/06"],[53,"República Tcheca x México","24/06"],[54,"África do Sul x Coreia do Sul","24/06"],
  [55,"Curaçao x Costa do Marfim","25/06"],[56,"Equador x Alemanha","25/06"],[57,"Japão x Suécia","25/06"],
  [58,"Tunísia x Países Baixos","25/06"],[59,"Turquia x Estados Unidos","25/06"],[60,"Paraguai x Austrália","25/06"],
  [61,"Noruega x França","26/06"],[62,"Senegal x Iraque","26/06"],
  [63,"Cabo Verde x Arábia Saudita","26/06"],[64,"Uruguai x Espanha","26/06"],
  [65,"Egito x Irã","27/06"],[66,"Nova Zelândia x Bélgica","27/06"],[67,"Panamá x Inglaterra","27/06"],
  [68,"Croácia x Gana","27/06"],[69,"Colômbia x Portugal","27/06"],[70,"RD Congo x Uzbequistão","27/06"],
  [71,"Argélia x Áustria","27/06"],[72,"Jordânia x Argentina","27/06"],
];

// ⭐ RODE ESTA FUNÇÃO UMA VEZ: monta a tabela de resultados com todos
// os jogos listados. Você só preenche os gols e o site puxa sozinho.
function preencherResultados() {
  const aba = garanteAba(ABA_RESULTADOS, ["Jogo #", "Partida", "Data", "Gols time 1", "Gols time 2"]);
  // preserva gols que já tenham sido lançados (layout antigo ou novo)
  const antigos = aba.getDataRange().getValues();
  const cab = antigos[0].map(String);
  let c1 = cab.findIndex(c => /gols.*1/i.test(c)), c2 = cab.findIndex(c => /gols.*2/i.test(c));
  if (c1 < 0) c1 = 1; if (c2 < 0) c2 = 2;
  const golsSalvos = {};
  antigos.slice(1).forEach(l => {
    if (l[0] !== "" && l[c1] !== "" && l[c2] !== "") golsSalvos[Number(l[0])] = [l[c1], l[c2]];
  });
  aba.clearContents();
  const linhas = [["Jogo #", "Partida", "Data", "Gols time 1", "Gols time 2"]];
  LISTA_JOGOS.forEach(([id, partida, data]) => {
    const g = golsSalvos[id] || ["", ""];
    linhas.push([id, partida, data, g[0], g[1]]);
  });
  aba.getRange(1, 1, linhas.length, 5).setValues(linhas);
  aba.setFrozenRows(1);
  aba.autoResizeColumns(1, 5);
}

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
    const aba = garanteAba(ABA_PALPITES,
      ["Quando (servidor)", "Nome", "Sobrenome", "Telefone", "Filtro", "Palpites (JSON)"]);
    // Remove linhas anteriores do mesmo nome+sobrenome+filtro para evitar duplicatas
    const chave = (nome + sobrenome).toLowerCase().replace(/\s+/g, "");
    const linhas = aba.getDataRange().getValues();
    for (let i = linhas.length - 1; i >= 1; i--) {
      const chaveLinha = (String(linhas[i][1]) + String(linhas[i][2])).toLowerCase().replace(/\s+/g, "");
      if (chaveLinha === chave && String(linhas[i][4]) === filtro) {
        aba.deleteRow(i + 1);
      }
    }
    aba.appendRow([new Date(), nome, sobrenome, telefone, filtro, JSON.stringify(d.palpites)]);
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
  const linhasRes = abaRes.getDataRange().getValues();
  // localiza as colunas de gols pelo cabeçalho (funciona com qualquer layout)
  const cab = (linhasRes[0] || []).map(String);
  let c1 = cab.findIndex(c => /gols.*1/i.test(c)), c2 = cab.findIndex(c => /gols.*2/i.test(c));
  if (c1 < 0) c1 = 1; if (c2 < 0) c2 = 2;
  linhasRes.slice(1).forEach(l => {
    if (l[0] !== "" && l[c1] !== "" && l[c2] !== "") {
      resultados[Number(l[0])] = [Number(l[c1]), Number(l[c2])];
    }
  });

  return resposta({ palpites, resultados });
}

function resposta(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
