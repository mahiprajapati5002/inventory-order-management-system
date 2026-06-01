# Deployment Guide

## Neon PostgreSQL

1. Create a free Neon project.
2. Create a database for the application.
3. Copy the pooled PostgreSQL connection string.
4. Use it as `DATABASE_URL` in Render.

## Render Backend

1. Push the repository to GitHub.
2. Create a Render web service from the repository.
3. Select the `backend` root directory or use `render.yaml`.
4. Add environment variables:
   - `DATABASE_URL`
   - `CORS_ORIGINS`
   - `ENVIRONMENT=production`
5. Deploy and confirm `/health` returns `{"status":"ok"}`.

## Vercel Frontend

1. Import the repository into Vercel.
2. Set the project root to `frontend`.
3. Set `VITE_API_URL` to the Render backend URL with `/api/v1`.
4. Deploy and test dashboard, product, customer, and order pages.

## Docker Hub

```bash
docker login
docker build -t your-dockerhub-user/inventory-backend:latest ./backend
docker push your-dockerhub-user/inventory-backend:latest
```

