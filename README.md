# Mix2Win — Customer Colors

Aplicación web interna para consultar el histórico de pedidos de color de clientes. Permite filtrar, buscar y paginar sobre miles de registros de pintura almacenados en PostgreSQL, tras un login protegido con JWT.

---

## Descripción

El sistema Mix2Win registra cada preparación de color que se entrega al cliente (fecha, color, códigos, producto, base, litros, cantidad de latas). Esta aplicación expone esos datos a personal autorizado mediante una interfaz simple, rápida y responsive, evitando el acceso directo a la base y unificando la consulta detrás de una API paginada.

## Funcionalidades

- **Login seguro** con usuario/contraseña y token JWT en cookie `httpOnly`.
- **Dashboard con filtros combinables**: cliente, color (busca en nombre y en códigos 1 y 2), producto, rango de fechas.
- **Paginación server-side** (50 registros por página, hasta 200 configurables).
- **Tabla responsive** con 9 columnas relevantes del pedido y truncado con tooltip.
- **Cierre de sesión** con limpieza inmediata de la cookie.
- **Endpoint de health-check** para verificar que las variables de entorno estén configuradas correctamente en el despliegue.

## Stack

| Capa | Tecnología |
|---|---|
| Framework | Next.js 14 (App Router) |
| UI | React 18 + Tailwind CSS 3 |
| Base de datos | PostgreSQL (via `pg` Pool) |
| Autenticación | JWT (`jsonwebtoken`) + `bcryptjs` |
| Deploy | Compatible con Vercel |

## Estructura del proyecto

```
app/
  api/
    auth/login/route.js    # POST — valida credenciales y setea cookie JWT
    auth/logout/route.js   # POST — limpia la cookie
    colors/route.js        # GET  — consulta paginada de customer_colors
    health/route.js        # GET  — chequeo de variables de entorno
  dashboard/               # Página protegida con filtros y tabla
  login/                   # Página pública de login
  layout.js, page.js       # Layout raíz y redirect según sesión
lib/
  auth.js                  # sign/verify JWT, gestión de cookie
  db.js                    # Pool singleton de PostgreSQL
```

## Modelo de datos

La API consulta la tabla `customer_colors` con los siguientes campos:

`created_date`, `customer_name`, `color_name`, `color_number_1`, `color_number_2`, `recipe_product_name`, `recipe_product_basepaint_name`, `delivery_can_size_amount`, `delivery_number_of_cans`.

## Seguridad

- Cookie de sesión `httpOnly`, `sameSite=lax`, `secure` en producción.
- Contraseña hasheada con bcrypt (cost 12) cuando se usa `ADMIN_PASSWORD_HASH`.
- Todas las queries usan parámetros preparados (`$1, $2...`) — sin concatenación de SQL.
- Las rutas `/dashboard` y `/api/colors` validan el JWT en cada request.

## Scripts

| Comando | Descripción |
|---|---|
| `npm run dev` | Servidor de desarrollo |
| `npm run build` | Build de producción |
| `npm start` | Servir el build |
| `npm run generate-hash <pass>` | Genera un hash bcrypt |
