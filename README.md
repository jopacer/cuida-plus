# CUIDA+ · Netlify Starter (React + Vite)
MVP web para publicar en **Netlify**. Sin backend (usa `public/data.json`) y listo para conectar **Supabase** con una Function.

## Local
npm install
npm run dev

## Deploy en Netlify
- Conecta el repo o usa Drag&Drop de la carpeta `dist` (tras `npm run build`).
- `netlify.toml` ya trae build y rutas.

## Formulario (+Add) y backend
- Si configuras variables `SUPABASE_URL` y `SUPABASE_ANON_KEY` en Netlify, 
  la función `/.netlify/functions/new-caregiver` insertará en la tabla `cuidadores`.
- Si no, el formulario te mostrará el JSON para pegarlo manualmente.

## Siguientes pasos
- Sustituir `fetch('/data.json')` por lectura desde Supabase.
- Añadir auth y reseñas.
