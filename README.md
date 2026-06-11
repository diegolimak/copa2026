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

1. Abra o site do bolão (GitHub Pages deste repositório).
2. Digite seu **nome** e preencha os **placares**.
3. Clique em **ENVIAR PALPITES** → mande pro organizador por WhatsApp (ou baixe o arquivo).
4. Pague sua cota por PIX pro organizador. Tá valendo!

## 🔧 Manual do organizador

### Registrar palpites
Quando alguém enviar palpites, copie o bloco JSON da mensagem e cole dentro da lista em
[palpites.js](palpites.js), separado por vírgula. Faça o commit **antes do jogo começar** —
o histórico do Git é o juiz do horário.

### Lançar resultados
Conforme os jogos terminam, preencha [resultados.js](resultados.js):

```js
const RESULTADOS = {
  1: [2, 1],   // México 2x1 África do Sul
};
```

A apuração (ranking, potes, fundo de cestas) é calculada automaticamente pelo site.

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
| `palpites.js` | Palpites registrados pelo organizador |
| `resultados.js` | Resultados oficiais, jogo a jogo |

🧺 *No final, ganha quem acertou — e ganha também quem precisa.*
