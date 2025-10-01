# 📝 Prueba Técnica -- ToDo App

Aplicación simple de **To-Do List** desarrollada como prueba técnica.  
Incluye un **backend serverless en Node.js/TypeScript con DynamoDB Local** y un **frontend en React/TypeScript con Vite**.

---

## 🎯 Objetivo

Gestionar tareas (crear, listar, actualizar y eliminar) con persistencia en base de datos, siguiendo buenas prácticas de desarrollo y pruebas automáticas en frontend y backend.

---

## 🛠️ Stack Tecnológico

- **Backend**: Node.js + Serverless + TypeScript  
- **Base de datos**: DynamoDB Local (AWS DynamoDB en despliegue real)  
- **Frontend**: React + Vite + TypeScript  
- **Estilos**: Material UI (MUI)  
- **Testing**:
  - **Backend**: pruebas end-to-end con **Jest + Supertest** (sobre endpoints de la API).  
  - **Frontend**: pruebas de componentes con **React Testing Library + Jest**.  

- **Orquestación**: Docker Compose  
- **Control de versiones**: Git (GitHub)

---

## ✅ Requerimientos

### Funcionales
- [x] Crear una nueva tarea.
- [x] Listar todas las tareas existentes.
- [x] Actualizar el estado de una tarea (pendiente/completada).
- [x] Eliminar una tarea.
- [x] Guardar todas las tareas en DynamoDB.

### No funcionales
- [x] Uso de **TypeScript** en todo el proyecto.
- [x] Manejo de **errores y validaciones** en backend.
- [x] Arquitectura limpia y modular.
- [x] **Pruebas automáticas** en backend y frontend.

---

## 🧩 Arquitectura

- **backend/**: Handlers (Lambdas) expuestos mediante API Gateway (Serverless Offline). CRUD completo contra DynamoDB Local.  
- **frontend/**: Aplicación React (Vite) que consume la API, con componentes para crear, listar, editar y eliminar tareas.  
- **docker-compose.yml**: Orquesta backend, frontend y DynamoDB Local con hot-reload.

---

## 🧰 Prerrequisitos

- **Docker Desktop 4.x+** (con Docker Compose v2).  
- **Opcional (ejecución manual)**: Node.js 20.x y npm 10.x.

---

## ⚙️ Variables de entorno

Copiar los archivos de ejemplo:

```bash
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env
```

Los valores por defecto (`local`) son suficientes para desarrollo con Docker.  
Si despliegas en AWS debes ajustar `AWS_STAGE`, `AWS_REGION`, credenciales y nombre de tabla/bucket en `serverless.yml`.

---

## ▶️ Ejecución con Docker

```bash
docker compose up --build
```

- Frontend: http://localhost:3000  
- Backend: http://localhost:4000  

Para detener:

```bash
docker compose down
```

---

## ▶️ Ejecución manual (sin Docker)

### Backend

```bash
cd backend
npm install
npx serverless dynamodb install
npm run offline
```

API disponible en `http://localhost:4000`.

### Frontend

```bash
cd frontend
npm install
npm run dev
```

App disponible en `http://localhost:3000`.  
Ajustar `VITE_API_URL` en `.env` si la API está en otra URL.

---

## 🔌 Endpoints principales

- `GET /todos` → Lista todas las tareas  
- `POST /todos` → Crea nueva tarea  
- `PUT /todos/:id` → Actualiza tarea  
- `DELETE /todos/:id` → Elimina tarea  

---

## 🧪 Testing

El proyecto incluye pruebas automáticas tanto en **backend** como en **frontend**.

### Backend
- Framework: **Jest + Supertest**
- Tipo: **E2E (end-to-end)** sobre endpoints de la API.
- Ejecución:
  ```bash
  cd backend
  npm run test:e2e
  ```

### Frontend
- Framework: **React Testing Library + Jest**
- Tipo: **Pruebas de componentes y UI**.
- Ejecución:
  ```bash
  cd frontend
  npm run test:ui
  ```

---

## ✅ Estado

- CRUD completo funcionando  
- Persistencia en DynamoDB Local  
- Frontend conectado al backend  
- Pruebas automáticas superadas en frontend y backend  

---

## 🧠 Decisiones técnicas

- Se añadió validación en el formulario para impedir tareas sin texto.  
- Se reemplazaron mensajes `alert()` por Snackbars, mejorando la experiencia de usuario.  
- Se implementaron notificaciones visuales (Snackbars) para confirmar acciones de **crear, editar y eliminar** tareas.  
- Se añadieron **filtros de tareas con sistema de colores**, facilitando la identificación rápida de estados.  
- El botón flotante (FAB) se elevó para no superponerse con notificaciones.  
- Se hicieron ajustes de diseño para que botones de editar/eliminar mantengan su posición en pantallas pequeñas.  
- Se mantuvo la ejecución principal a través de Docker, evitando usar `npm run dev` manualmente.  
- Los commits se estructuraron con prefijos (`fix`, `feat`) para mayor claridad.  
- Se mantuvo activo el **Hot Reloading** de Vite, permitiendo que los cambios en el frontend se reflejen en vivo sin recargar manualmente.  
- **Dark/Light mode toggle**: se implementó un botón para alternar entre tema claro y oscuro.
