# Mix2Win Customer Colors — Guía de despliegue

## 1. Configurar variables de entorno

Copiá `.env.local.example` como `.env.local` y completá:

```
DB_SERVER=    → IP o hostname del SQL Server (debe ser accesible desde internet)
DB_PORT=1433
DB_NAME=Mix2WinNextCustomerColors
DB_USER=      → usuario SQL Server (ej: sa)
DB_PASSWORD=  → contraseña
DB_TABLE=     → nombre de la tabla (abrí SSMS > Mix2WinNextCustomerColors > Tables)

JWT_SECRET=   → cadena aleatoria larga (podés generar en: https://generate-secret.vercel.app/64)
JWT_EXPIRES_IN=8h

ADMIN_USERNAME=admin
ADMIN_PASSWORD_HASH=  → ver paso 2
```

## 2. Generar hash de contraseña

```bash
cd web-app
npm install
node -e "const b=require('bcryptjs');b.hash('TU_CONTRASEÑA',12).then(h=>console.log(h))"
```
Pegá el resultado en `ADMIN_PASSWORD_HASH`.

> **Importante:** Next usa `dotenv-expand`. Cuando pegues el hash de bcrypt, agregá una barra invertida antes de cada `$` (ej: `\$2a\$12\$...`) para que no se recorte al cargar las variables.

## 3. Conectividad SQL Server → Vercel

Vercel corre en AWS. El SQL Server debe ser accesible desde internet:
- **Opción A:** Abrí el puerto 1433 en tu router/firewall apuntando a la PC con SQL Server
- **Opción B:** Usá un túnel como [ngrok](https://ngrok.com): `ngrok tcp 1433`
- **Opción C (recomendada para producción):** Migrá la base a Azure SQL o Railway

## 4. Desplegar en Vercel

```bash
npm install -g vercel
cd web-app
vercel
```
Cuando te pida, ingresá las variables de entorno del paso 1.

O importá el repositorio desde [vercel.com](https://vercel.com) y configurá las env vars en el panel.

## 5. Ejecutar localmente (para pruebas)

```bash
cd web-app
npm install
cp .env.local.example .env.local   # completar el archivo
npm run dev
```
Abrí http://localhost:3000

## Credenciales por defecto
- Usuario: `admin`
- Contraseña: `Mix2Win2026!` ← **CAMBIALA antes de publicar**
