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
├── backend/                        
│   ├── config/
│   │   └── db.js                   
│   ├── controllers/
│   │   └── cultivosController.js   
│   ├── database/
│   │   └── schema.sql              
│   ├── models/
│   │   └── cultivoModel.js         
│   ├── routes/
│   │   └── cultivos.js             
│   ├── .env                        
│   ├── package.json                
│   └── server.js                   
└── frontend/                       
    ├── assets/                     
    ├── css/
    │   └── estilos.css             
    ├── js/
    │   ├── api.js                  
    │   ├── agregar.js              
    │   ├── configuracion.js        
    │   ├── editar.js               
    │   └── index.js                
    ├── agregar.html                
    ├── configuracion.html          
    ├── editar.html                 
    └── index.html                  
