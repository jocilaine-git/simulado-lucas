# Instruções para o Claude Code — publicar o Simulado do Lucas

Contexto: site estático (index.html, app.js, simulados.js, config.js) que vai para o GitHub Pages
no repositório **jocilaine-git/simulado-lucas** (já criado, vazio). O backend é um Google Apps Script
(pasta `apps-script/`, já implantado pela Jocilaine) — NÃO precisa mexer nele.

Tarefa:
1. Clonar `https://github.com/jocilaine-git/simulado-lucas`.
2. Copiar para a raiz do repositório: `index.html`, `app.js`, `simulados.js`, `config.js`, a pasta `apps-script/`
   e este arquivo. (Não copiar a pasta de testes, se houver.)
3. Em `config.js`, trocar `COLE_AQUI_A_URL_DO_APPS_SCRIPT` pela URL do App da Web que a Jocilaine informar
   (termina em `/exec`). Não alterar o TOKEN.
4. Commit ("Simulado do Lucas — versão inicial") e push para a branch `main`.
5. Ativar o GitHub Pages servindo a branch `main`, pasta raiz:
   `gh api -X POST repos/jocilaine-git/simulado-lucas/pages -f "source[branch]=main" -f "source[path]=/"`
   (se já existir, use `-X PUT`).
6. Esperar a publicação (`gh api repos/jocilaine-git/simulado-lucas/pages/builds/latest` até `status: built`)
   e testar: `curl -s "<URL_DO_APPS_SCRIPT>?action=estado&token=<TOKEN>&aluno=Lucas"` deve responder `{"ok":true,...}`.
7. Informar o link final: https://jocilaine-git.github.io/simulado-lucas/

Atualizações futuras (novos simulados): editar só `simulados.js` (mesmo formato, ids S11, S12…) e dar push.
