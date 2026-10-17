# AgroMonitor

AgroMonitor es una aplicación web para visualizar y gestionar zonas de cultivo. El objetivo es reunir datos como temperatura, humedad del aire, humedad del suelo y estado de riego para facilitar la supervisión y la detección de alertas.

## Estado actual

El proyecto combina una interfaz estática en HTML, CSS y JavaScript con un backend Node.js/Express y PostgreSQL.

Actualmente está implementado:

- Un dashboard y pantallas para agregar, editar y configurar zonas, con estilos compartidos y un fondo animado en las páginas principales.
- Un backend Express con conexión PostgreSQL mediante `pg` y `DATABASE_URL`.
- Operaciones `GET`, `POST`, `PATCH` y `DELETE` en `/api/cultivos`.
- Validación server-side de nombres, estados, rangos numéricos y opciones de configuración.
- Persistencia PostgreSQL para cultivos y estados de riego, sensores e iluminación.
- CORS configurable por `CORS_ORIGIN`, además de orígenes comunes de desarrollo local.
- Un esquema SQL para cultivos y asignación local de roles.
- Pantallas de acceso, registro, recuperación de clave y pasos de verificación en dos factores.
- Un modo local automático para el dashboard y las operaciones de zonas cuando el backend no está disponible; usa datos de muestra persistidos en el navegador.
- Una barrera de navegación obligatoria en el frontend y un inicio de sesión simulado. El correo `eweawa192@gmail.com` recibe el rol superadmin en este prototipo.
- Una pantalla de administración de usuarios de muestra, disponible al iniciar la sesión simulada con `eweawa192@gmail.com`; sus datos viven solo en `localStorage` del navegador.

Partes que todavía son de demostración o están pendientes:

- El formulario de login todavía no consulta una API: valida campos en el navegador y crea una sesión local simulada. La sesión y los roles del navegador se pueden alterar y no protegen datos ni endpoints; la cuenta superadmin aún no tiene autenticación real.
- La pantalla de usuarios solo muestra cuentas de ejemplo almacenadas en `localStorage`. No consulta usuarios registrados o verificados reales y sus cambios no se guardan en PostgreSQL.
- Las pantallas de 2FA existen, pero no están conectadas a la API externa de autenticación.
- Los endpoints de cultivos todavía no aplican autenticación ni autorización. CORS no reemplaza esos controles.
- El dashboard simula variaciones de temperatura y humedad cada tres segundos en zonas activas con sensores habilitados; esas muestras no se persisten en Neon y todavía no hay telemetría real.
- No está implementado el límite de intentos fallidos descrito en la hoja de ruta.

Por estas razones, la autenticación y autorización actuales no deben considerarse listas para producción.

## Requisitos

- Node.js y npm.
- PostgreSQL local o una base PostgreSQL accesible, por ejemplo Neon.
- Un servidor estático para el frontend, como la extensión Live Server de VS Code.

## Ejecución local

1. Desde `backend/`, instala las dependencias:

    ```powershell
    cd backend
    npm install
    ```

2. Configura `backend/.env` con `DATABASE_URL` y, opcionalmente, `PORT` y `CORS_ORIGIN`. Puedes usar `backend/.env.example` como referencia, sustituyendo los valores de ejemplo por los de tu entorno. El backend usa el puerto `3000` si `PORT` no está definido. El cliente frontend apunta por defecto a `http://localhost:3000/api`; se puede cambiar mediante `window.AGROMONITOR_API_URL` antes de cargar `js/api.js`.

3. Aplica el contenido de `backend/database/schema.sql` en el SQL Editor de Neon. También puedes usar `psql` desde `backend/` si tienes la variable `DATABASE_URL` exportada en esa sesión de PowerShell:

    ```powershell
    psql $env:DATABASE_URL -f database/schema.sql
    ```

    Node carga `backend/.env` mediante `dotenv`, pero PowerShell no lo carga automáticamente. El script SQL puede ejecutarse más de una vez e incorpora las columnas de configuración si aún no existen.

4. Inicia el backend:

    ```powershell
    npm start
    ```

5. Sirve la carpeta `frontend/` con Live Server. La página de inicio es `index.html`; al abrirla sin sesión, el frontend redirige a `login.html`.

Cuando el backend no está disponible, las zonas de muestra y los cambios CRUD se guardan solo en `localStorage`; no se sincronizan con PostgreSQL. Para usar datos persistentes compartidos, el backend debe conectarse a la base de datos. En desarrollo se permiten los orígenes `localhost` y `127.0.0.1` en los puertos `8080` y `5500`; en producción define `CORS_ORIGIN` con los orígenes exactos separados por comas.

## Configuración y secretos

`backend/config/db.js` consume `DATABASE_URL`; `backend/server.js` consume `PORT` y `CORS_ORIGIN`. La plantilla `.env.example` también documenta variables previstas para la futura integración con la API 2FA, pero actualmente el backend todavía no consume `AUTH_API_URL` ni `AUTH_API_KEY`.

Las credenciales reales deben permanecer en variables de entorno del backend y nunca en archivos servidos al navegador ni en commits. No compartas ni publiques `backend/.env`.

## Próximos pasos esperados

1. Conectar los formularios mediante el backend de AgroMonitor a la API externa 2FA. El backend debe conservar la API key; el navegador no debe recibirla.
2. Implementar el flujo completo: contraseña, segundo factor ofrecido por la API y creación de sesión solo cuando la API confirme el login completo. Gestionar también expiración y renovación de sesión.
3. Persistir en PostgreSQL los intentos de autenticación fallidos por cuenta. La política acordada es esperar 15 minutos después del tercer fallo y bloquear el acceso a AgroMonitor después de cinco fallos, con desbloqueo administrativo. El bloqueo será local a AgroMonitor, no un ban global en la API 2FA. Esta política aún no está implementada.
4. Proteger en el servidor las rutas de cultivos y aplicar los permisos por rol; una redirección de frontend no es una medida de seguridad.
5. Recibir telemetría real de sensores en lugar de mediciones estáticas.
6. Añadir pruebas de integración de las rutas con PostgreSQL, además de pruebas de autenticación, segundo factor, bloqueo temporal y desbloqueo administrativo.
