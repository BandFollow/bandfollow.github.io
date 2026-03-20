# Política de Privacidade — Setlist Metronome

Página estática para publicar no **GitHub Pages** (link público para App Store / Google Play).

## Publicar no GitHub Pages

1. Crie um repositório (ex.: `setlist-metronome-privacy`) e envie este projeto:
   ```bash
   git init
   git add index.html README.md setlist-metronome/
   git commit -m "Privacy policy page"
   git branch -M main
   git remote add origin https://github.com/SEU_USUARIO/setlist-metronome-privacy.git
   git push -u origin main
   ```

2. No GitHub: **Settings → Pages**
   - **Source**: Deploy from a branch
   - **Branch**: `main` / pasta **/ (root)**
   - Salve

3. **URL da política de privacidade** (use esta na loja):
   ```
   https://SEU_USUARIO.github.io/setlist-metronome-privacy/setlist-metronome/privacy
   ```
   Ou, no site principal (ex.: bandfollow.github.io):
   ```
   https://bandfollow.github.io/setlist-metronome/privacy
   ```
   A pasta `setlist-metronome/privacy/index.html` faz a página ser servida em `/setlist-metronome/privacy` (sem `.html` na URL).

## Idiomas

- **Inglês**: versão **oficial** (efeito legal). Botão marcado como “(official)”.
- **Português** e **Espanhol**: traduções; aviso na página de que prevalece o inglês.
- O idioma inicial segue: `?` não — usa `#en` / `#pt` / `#es` na URL, `localStorage`, ou idioma do navegador (pt/es → PT/ES; caso contrário → EN).

Links diretos por idioma: `.../setlist-metronome/privacy#pt`, `.../setlist-metronome/privacy#en`, `.../setlist-metronome/privacy#es`.

## Personalizar

- **Nome do app / data**: edite os três blocos em `index.html` e em `setlist-metronome/privacy/index.html` (EN, PT, ES).
- **Contato**: ajuste o parágrafo “Contact” / “Contato” / “Contacto” em cada idioma.

## Importar playlist (BPM e key)

No **setlist-editor.html**, na seção **Músicas**, use o campo de link da playlist e **“Adicionar músicas da playlist”** — as faixas são **acrescentadas** ao fim da tabela (não substituem as existentes). A página **playlist-importer.html** continua disponível como alternativa isolada.

- **Spotify**: lista de faixas e **BPM/key** vêm da API do Spotify (Audio Features), tudo **gratuito**.
- **YouTube**: só a lista de vídeos (títulos) vem da API; **BPM e key** vêm como padrão (120, C). Edite manualmente na tabela ou use uma playlist do Spotify para preenchimento automático.

### Rodar o backend localmente

1. Entre na pasta do servidor e instale as dependências:
   ```bash
   cd server
   npm install
   ```

2. Copie o arquivo de exemplo e preencha as variáveis:
   ```bash
   cp .env.example .env
   ```
   Edite o `.env` com:
- **Spotify**: `SPOTIFY_CLIENT_ID` e `SPOTIFY_CLIENT_SECRET` (crie um app em [Spotify for Developers](https://developer.spotify.com/dashboard)).
   - **YouTube**: `YOUTUBE_API_KEY` (ative a YouTube Data API v3 no [Google Cloud Console](https://console.cloud.google.com/) — cota gratuita).

3. Inicie o servidor:
   ```bash
   npm start
   ```

4. Abra no navegador: **http://localhost:3000/setlist-editor.html** (import na seção Músicas) ou **http://localhost:3000/playlist-importer.html**.  
   Se abrir o HTML sem o servidor (ex.: GitHub Pages), preencha **URL da API** com `http://localhost:3000` (ou a URL do backend em produção).

### Deploy do backend

Para usar a importação em produção, faça deploy do servidor (ex.: Railway, Render, Fly.io) e defina as variáveis de ambiente. No editor, no campo **URL da API (backend)**, informe a URL base (ex.: `https://seu-app.railway.app`).

---

## Observação

Se o nome do app não for “Setlist Metronome”, altere todas as menções no `index.html` para o nome correto.
# bandfollow.github.io
