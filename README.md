# EduQuest

## Local
    npm install
    npx netlify dev     # http://localhost:8888 (necesario para /api/progress)

## Deploy
    npx netlify deploy --prod

- `public/` : CSS, avatares y `economy-rules.js` (reglas compartidas cliente/servidor)
- `netlify/functions/progress.mjs` : API de recompensas (cookie anónima + Netlify Blobs)

## Firebase (login y registro)
1. Consola de Firebase → Authentication → Sign-in method → activa **Correo electrónico/Contraseña**.
2. Authentication → Settings → **Authorized domains**: agrega `localhost` y tu dominio de Netlify.
3. En Netlify → Site settings → Environment variables: `FIREBASE_PROJECT_ID=eduquest-20d0e`.
4. `npm install` (instala `firebase` y `jose`) y luego `npx netlify dev`.

Archivos: `src/firebase.js` (config + `auth`), `src/auth-bridge.js` (conecta Firebase con `index.html`),
`netlify/functions/progress.mjs` (valida el token de Firebase y guarda el progreso por usuario).

## Tema y Personalizar
`public/theme.css` aplica el diseño neobrutalista con modo claro/oscuro. Las opciones (acento, fondo, fuente, neón,
esquinas, sombras, imagen propia) se eligen en **Ajustes → Personalizar** y se guardan en el navegador (`eduquest_tema`).
Imágenes de los juegos: `public/games/*.svg`.

## Trofeos
`public/trophies.js` y `public/trophies.css` (sistema de trofeos). `theme.css` los adapta al modo claro/oscuro.
