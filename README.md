# ⚽ Bolão da Copa 2026 — R$2 por jogo 🧺

Bolão entre amigos de **todos os jogos da Copa do Mundo 2026**, com um propósito:
o que ninguém ganhar vira **cesta básica** no final.

## 📜 Regras

1. Cada jogo vale **R$ 2,00** por participante — cada jogo tem seu próprio pote.
2. O palpite é o **placar exato do tempo normal** (90 min + acréscimos). Prorrogação e pênaltis não contam.
3. **Acertou o placar exato → leva o pote do jogo.** Mais de um acertador? Divide igual.
4. **Ninguém acertou → o pote vai pro fundo de cestas básicas**, doado no final da Copa.
5. Palpite só vale **antes de a bola rolar**. A data do commit neste repositório é a prova pública do horário.
6. Quem não palpitar num jogo paga os R$ 2 mesmo assim, só não concorre naquele pote.
7. Jogos do mata-mata entram em `jogos.js` quando os confrontos forem definidos.

💰 **Custo total por pessoa:** 104 jogos × R$ 2 = **R$ 208** (fase de grupos: 72 jogos = R$ 144).

## 🎯 Como participar

1. Abra o link do bolão.
2. Digite seu **nome** e preencha os **placares**.
3. Clique em **ENVIAR PALPITES** — eles são salvos automaticamente na planilha do bolão.
4. Faça o **PIX de R$ 144** (fase de grupos) para **Diego — chave 02493690109**. Tá valendo!

## 🔧 Manual do organizador

### Modo automático (recomendado): Planilha Google
Os palpites caem direto numa Planilha Google, sem você fazer nada:

1. Crie uma planilha em [sheets.google.com](https://sheets.google.com).
2. **Extensões → Apps Script**, apague tudo e cole o conteúdo de [apps-script.gs](apps-script.gs).
3. Rode a função `configurar` uma vez (botão ▶) e autorize.
4. **Implantar → Nova implantação → App da Web** — executar como **você**, acesso: **qualquer pessoa**.
5. Copie a URL gerada (termina em `/exec`) e cole em `CONFIG.urlPlanilha` no [index.html](index.html).

Pronto: cada envio vira uma linha na aba **Palpites** (com horário do servidor — impossível
trapacear o relógio), e os **resultados** você digita na aba **Resultados** da própria planilha.
O site monta a apuração sozinho.

**Dica:** rode a função `preencherResultados` uma vez no Apps Script — ela monta a aba
**Resultados** com os 72 jogos listados (número, partida e data). Aí é só digitar os gols
nas colunas "Gols time 1" e "Gols time 2" conforme os jogos terminam.

Se alguém enviar palpites mais de uma vez, vale o último envio **antes do início de cada jogo** —
palpite atrasado é ignorado automaticamente.

### Modo manual (plano B, sem planilha)
Deixe `CONFIG.urlPlanilha` vazia. Os palpites chegam por WhatsApp com um bloco JSON;
cole-os em [palpites.js](palpites.js) e commite **antes do jogo começar** (o histórico do Git
é o juiz do horário). Resultados em [resultados.js](resultados.js):

```js
let RESULTADOS = {
  1: [2, 1],   // México 2x1 África do Sul
};
```

### Publicar o site (GitHub Pages)
1. Crie um repositório público no GitHub e suba estes arquivos.
2. Em **Settings → Pages**, escolha a branch `main` e a pasta `/ (root)`.
3. O site fica no ar em `https://SEU-USUARIO.github.io/NOME-DO-REPO/`.

### Configurar seu WhatsApp
No `index.html`, procure `CONFIG` e preencha seu número (só dígitos, com DDI e DDD):

```js
whatsappOrganizador: "5511999998888",
```

## 📁 Arquivos

| Arquivo | O que é |
|---|---|
| `index.html` | O site do bolão (palpites, apuração, regras) |
| `jogos.js` | Tabela dos jogos (datas em horário de Brasília) |
| `apps-script.gs` | Script da Planilha Google (modo automático) |
| `palpites.js` | Palpites registrados à mão (modo manual) |
| `resultados.js` | Resultados lançados à mão (modo manual) |

🧺 *No final, ganha quem acertou — e ganha também quem precisa.*
