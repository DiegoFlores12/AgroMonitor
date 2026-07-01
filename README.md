# AgroMonitor

## 1. Objetivo del Proyecto
**AgroMonitor** es una mini-aplicación web interactiva diseñada para la gestión, control y monitoreo en tiempo real de áreas de cultivo agrícolas. El sistema optimiza la supervisión de variables críticas como la temperatura, la humedad del aire y la humedad del suelo, permitiendo a los operadores identificar alertas tempranas (escasez hídrica o estrés térmico) y gestionar de forma dinámica la infraestructura de riego. 

---

## 2. Como iniciarlo

Primero nos dirijimos al backend: cd backend


despues instalamos las dependencias:  npm install


una vez instaladas las dependencias iniciamos el backend:  npm install



se instala la extencion Live server si no lo tienes instalado



despues de iniciar el backend y instalar la extencion te dirijes a index y apretas el boton "Go Live" abajo a la izquierda para iniciar el frontend

---

## 3. Estructura de Carpetas del Proyecto

```text
AgroMonitor/
├── backend/                        # Arquitectura del Servidor Conceptual
│   ├── config/
│   │   └── db.js                   # Configuración del Pool de conexión a Neon
│   ├── controllers/
│   │   └── cultivosController.js   # Lógica de negocio de la API
│   ├── database/
│   │   └── schema.sql              # Definición de tablas relacionales en SQL
│   ├── models/
│   │   └── cultivoModel.js         # Abstracción y consultas de Datos (PostgreSQL)
│   ├── routes/
│   │   └── cultivos.js             # Enrutamiento de endpoints API
│   ├── .env                        # Variables de entorno y credenciales sensibles
│   ├── package.json                # Dependencias del ecosistema Node.js
│   └── server.js                   # Punto de entrada del servicio Express
└── frontend/                       # Arquitectura Frontend Local (Evaluada)
    ├── assets/                     # Recursos gráficos estáticos (Logotipos)
    ├── css/
    │   └── estilos.css             # Estilos globales, variables y diseño adaptativo
    ├── js/
    │   ├── api.js                  # Capa de persistencia en LocalStorage
    │   ├── agregar.js              # Controlador y validaciones del formulario
    │   ├── configuracion.js        # Lógica de conmutación de estados de hardware
    │   ├── editar.js               # Control del ciclo de edición y remoción de nodos
    │   └── index.js                # Orquestador del Dashboard y simulación en tiempo real
    ├── agregar.html                # Vista de registro de áreas
    ├── configuracion.html          # Vista de operaciones de hardware y tiempos
    ├── editar.html                 # Vista de mantenimiento y eliminación
    └── index.html                  # Vista principal (Dashboard y Tabla de Telemetría)
