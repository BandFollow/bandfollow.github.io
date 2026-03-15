# Política de Privacidade — Setlist Metronome

Página estática para publicar no **GitHub Pages** (link público para App Store / Google Play).

## Publicar no GitHub Pages

1. Crie um repositório (ex.: `setlist-metronome-privacy`) e envie este projeto:
   ```bash
   git init
   git add index.html README.md
   git commit -m "Privacy policy page"
   git branch -M main
   git remote add origin https://github.com/SEU_USUARIO/setlist-metronome-privacy.git
   git push -u origin main
   ```

2. No GitHub: **Settings → Pages**
   - **Source**: Deploy from a branch
   - **Branch**: `main` / pasta **/ (root)**
   - Salve

3. Em alguns minutos o site ficará em:
   ```
   https://SEU_USUARIO.github.io/setlist-metronome-privacy/
   ```
   Use essa URL como política de privacidade na loja.

## Idiomas

- **Inglês**: versão **oficial** (efeito legal). Botão marcado como “(official)”.
- **Português** e **Espanhol**: traduções; aviso na página de que prevalece o inglês.
- O idioma inicial segue: `?` não — usa `#en` / `#pt` / `#es` na URL, `localStorage`, ou idioma do navegador (pt/es → PT/ES; caso contrário → EN).

Links diretos: `.../index.html#pt`, `.../index.html#en`, `.../index.html#es`.

## Personalizar

- **Nome do app / data**: edite os três blocos em `index.html` (EN, PT, ES).
- **Contato**: ajuste o parágrafo “Contact” / “Contato” / “Contacto” em cada idioma.

## Observação

Se o nome do app não for “Setlist Metronome”, altere todas as menções no `index.html` para o nome correto.
# bandfollow.github.io
