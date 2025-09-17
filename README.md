# 📌 Prueba Técnica – ToDo List

## 🎯 Objetivo

Desarrollar una aplicación **ToDo List** que permita a los usuarios gestionar tareas (crear, listar, actualizar y eliminar).  
El proyecto debe estar construido utilizando las tecnologías oficiales del stack del equipo, siguiendo buenas prácticas de desarrollo, patrones de diseño y pruebas automáticas tanto en **frontend** como en **backend**.

---

## 🛠️ Stack Tecnológico

El proyecto debe implementarse con las siguientes tecnologías:

- **Backend**: Node.js y TypeScript
- **Base de Datos**: AWS DynamoDB
- **Frontend**: React y TypeScript
- **Testing**:
  - Backend → Jest + Supertest
  - Frontend → React Testing Library + Jest
- **Control de versiones**: Git (repositorio en GitLab/GitHub)
- **Estilos**: Material UI (MUI)

---

## ✅ Requerimientos

### Funcionales

- [ ] Crear una nueva tarea.
- [ ] Listar todas las tareas existentes.
- [ ] Actualizar el estado de una tarea (pendiente/completada).
- [ ] Eliminar una tarea.
- [ ] Guardar todas las tareas en DynamoDB.

### No funcionales

- Uso de **TypeScript** en todo el proyecto.
- Manejo de **errores y validaciones** en el backend.
- Arquitectura limpia y modular.

## Repositorio

Repositorio monorepo con un backend serverless en Node.js y un frontend en React para gestionar un listado de tareas (`todos`). El backend utiliza DynamoDB para persistencia, se ejecuta con Serverless Framework. Ambos servicios se ejecutan con Docker para simplificar la puesta en marcha.

## Arquitectura

- **backend/**: Lambdas HTTP expuestas mediante API Gateway (vía Serverless Offline). Incluye CRUD completo contra DynamoDB.
- **frontend/**: Aplicación React (Vite) que consume la API, permite crear, listar, actualizar, eliminar tareas.
- **docker-compose.yml**: Orquestación de ambos servicios para entornos locales.

## Prerrequisitos

- Docker Desktop 4.x o superior (con Docker Compose v2).
- Opcional (modo manual): Node.js 20.x y npm 10.x.

## Configuración de variables de entorno

Copia los ejemplos y ajusta valores si fuera necesario:

```bash
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env
```

Los valores por defecto (`local`) son suficientes para desarrollo con Docker. Si despliegas en AWS deber�s ajustar `AWS_STAGE`, `AWS_REGION`, credenciales y el nombre de la tabla/bucket creados en `serverless.yml`.

## Ejecución con Docker

1. Construye e inicia los servicios:
   ```bash
   docker compose up --build
   ```
2. API backend: http://localhost:4000
3. Frontend: http://localhost:3000 (consume al backend interno vía `http://backend:4000`).

El contenedor del backend arranca `serverless offline`, levanta DynamoDB Local mediante los plugins configurados. Los volúmenes permiten hot-reload sobre el codigo fuente.

Para detener los servicios:

```bash
docker compose down
```

## Ejecución manual (sin Docker)

### Backend

```bash
cd backend
npm install
npx serverless dynamodb install          # primera vez, descarga DynamoDB local
npm run offline -- --stage local
```

La API quedará disponible en `http://localhost:4000`.

### Frontend

```bash
cd frontend
npm install
npm run dev -- --host 0.0.0.0 --port 3000
```

Abre `http://localhost:3000`. Ajusta `VITE_API_URL` en `.env` si la API se expone en otra URL.
