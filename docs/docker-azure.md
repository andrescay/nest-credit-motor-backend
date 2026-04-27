# Docker and Azure Deployment Guide

This project now includes a production-ready Docker image and a `docker-compose.yml` with:

- `app` container (NestJS API)
- `mongo` container (for local/dev and future Mongo repository integration)

## 1) Run with Docker Compose (local)

```bash
cp .env.example .env
docker compose up --build
```

API will be available at:

- `http://localhost:3000`
- Swagger: `http://localhost:3000/docs`

## 2) Build only the application image

```bash
docker build -t credit-motor-backend:latest .
docker run --rm -p 3000:3000 --env-file .env credit-motor-backend:latest
```

## 3) Azure deployment (containerized app)

For Azure App Service / Azure Container Apps, publish the `Dockerfile` image to an Azure Container Registry (ACR):

```bash
az acr build --registry <acr-name> --image credit-motor-backend:latest .
```

Then configure app settings in Azure:

- `PORT=3000`
- `NODE_ENV=production`
- `STORAGE_PROVIDER=in-memory` (current mode)
- `MONGODB_URI=<mongo-connection-string>` (future mode once Mongo repositories are implemented)

## 4) Planned storage migration to MongoDB

Current implementations:

- `src/applications/repositories/in-memory-applications.repository.ts`
- `src/applications/repositories/in-memory-events.repository.ts`

When Mongo repositories are added, keep container/runtime unchanged and switch behavior through environment configuration (for example with `STORAGE_PROVIDER=mongodb` and `MONGODB_URI`).
