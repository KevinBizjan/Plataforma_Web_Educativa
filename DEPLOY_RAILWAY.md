# Desplegar en Railway (un solo servicio)

Esta app se despliega como **un único servicio**: el backend Express sirve la API
(`/api/...`) y además entrega el frontend de React compilado (`frontend/dist`).
Una sola URL, sin CORS.

Railway detecta el `package.json` y el `railway.json` de la **raíz** del repo y
ejecuta:
- **Build**: `npm run build` → compila el frontend y prepara el backend.
- **Start**: `npm start` → arranca el backend (que también sirve el frontend).

## 1. Configurar el servicio en Railway
1. Entra a tu proyecto en Railway → tu servicio.
2. **Settings → Root Directory** = **vacío** (la raíz del repo, NO `backend`).
   ⚠️ Si antes lo tenías en `backend`, bórralo para que use la raíz.
3. **Settings → Networking → Generate Domain** → esa es la URL pública de tu app.

## 2. Variables de entorno
En **Variables** del servicio agrega:
- `JWT_SECRET` = un texto largo y aleatorio.
- `DATABASE_URL` = la cadena de conexión de tu proyecto de Supabase (Project
  Settings → Database → Connection string, modo "URI"), con la contraseña real.
- `SEED_ON_BOOT` = `true`  (carga los datos demo; es idempotente, no duplica).
- ⚠️ NO definas `PORT`: Railway lo inyecta automáticamente.

## 3. Persistencia de datos
La base ahora vive en Supabase (PostgreSQL), no en el disco del servicio, así
que **no hace falta ningún Volume**: los datos sobreviven a cada deploy/reinicio
por sí solos mientras `DATABASE_URL` apunte al mismo proyecto de Supabase.

El esquema (`backend/src/config/schema.sql`) se aplica solo al arrancar el
servidor (usa `CREATE TABLE IF NOT EXISTS`, así que es seguro en cada deploy).
`SEED_ON_BOOT=true` solo asegura que los usuarios/datos demo existan; como usa
`ON CONFLICT ... DO NOTHING`, no pisa ni duplica lo que ya haya.

## 4. Redeploy
Tras subir cambios a GitHub, Railway redeploya solo. Si no, usa **Deploy** manual.

## Usuarios de prueba (creados por el seed)
- admin / admin123
- docente / docente123
- alumno / alumno123
- padre / padre123

## Nota sobre los logs
Verás en los logs `Servidor corriendo en el puerto 8080` (o el puerto que asigne
Railway). Ese puerto es interno; para entrar usa la **URL pública** del dominio
generado, no `localhost`.

## Desarrollo local (sin cambios)
- Backend: `cd backend && npm run dev` (puerto 3000).
- Frontend: `cd frontend && npm run dev` (Vite, apunta a `http://localhost:3000`).
