# Inventory & Order Management System

A simplified full-stack inventory and order management application for managing products, customers, orders, and stock tracking.

## Tech Stack

- Backend: Python, FastAPI, SQLAlchemy, Alembic, Pydantic
- Frontend: React, Vite, Axios, React Router, Tailwind CSS
- Database: PostgreSQL
- Containers: Docker and Docker Compose
- Deployment targets: Neon PostgreSQL, Render, Vercel

## Features

- Product CRUD with unique SKU validation
- Customer CRUD with unique email validation
- Order creation with automatic total calculation
- Inventory validation and automatic stock reduction
- Dashboard metrics for products, customers, orders, revenue, low stock, and recent orders
- Responsive frontend with loading, error, empty, and success states
- Environment-based configuration with no hardcoded credentials

## Architecture

React Frontend -> FastAPI Backend -> PostgreSQL Database

The backend exposes REST APIs under `/api/v1`. The frontend reads the API base URL from `VITE_API_URL`.

## Local Setup

### Backend

```bash
cd backend
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
copy .env.example .env
alembic upgrade head
uvicorn app.main:app --reload
```

API docs: `http://localhost:8000/docs`

### Frontend

```bash
cd frontend
npm install
copy .env.example .env
npm run dev
```

Frontend: `http://localhost:5173`

## Docker Setup

```bash
docker compose up --build
```

Services:

- Frontend: `http://localhost:5173`
- Backend: `http://localhost:8000`
- PostgreSQL: `localhost:5432`

## Environment Variables

Backend:

- `DATABASE_URL`
- `CORS_ORIGINS`
- `ENVIRONMENT`

Frontend:

- `VITE_API_URL`

## API Summary

Detailed endpoint documentation is available in `docs/API.md`.

Products:

- `GET /api/v1/products`
- `POST /api/v1/products`
- `GET /api/v1/products/{id}`
- `PUT /api/v1/products/{id}`
- `DELETE /api/v1/products/{id}`

Customers:

- `GET /api/v1/customers`
- `POST /api/v1/customers`
- `GET /api/v1/customers/{id}`
- `PUT /api/v1/customers/{id}`
- `DELETE /api/v1/customers/{id}`

Orders:

- `GET /api/v1/orders`
- `POST /api/v1/orders`
- `GET /api/v1/orders/{id}`

Dashboard:

- `GET /api/v1/dashboard`

## Testing

```bash
cd backend
pytest
```

Tests cover product, customer, and order business rules, including duplicate SKU/email validation, insufficient stock, stock reduction, and total calculation.

## Deployment Guide

1. Create a Neon PostgreSQL database and copy the connection string.
2. Push this repository to GitHub.
3. Deploy the backend and frontend on Render using `render.yaml`.
4. Set backend environment variables on Render:
   - `DATABASE_URL`
   - `CORS_ORIGINS`
   - `ENVIRONMENT=production`
5. Confirm frontend `VITE_API_URL` points to the backend URL plus `/api/v1`.
6. Optionally deploy the frontend on Vercel from the `frontend` directory.
7. Build and push the backend Docker image:

```bash
docker build -t your-dockerhub-user/inventory-backend:latest ./backend
docker push your-dockerhub-user/inventory-backend:latest
```

## Submission Links

- GitHub Repository: https://github.com/mahiprajapati5002/inventory-order-management-system
- Backend Docker Hub Image: https://hub.docker.com/r/mahiprajapati/inventory-backend
- Frontend Live URL: https://inventory-order-management-frontend.onrender.com
- Backend Live URL: https://inventory-order-management-backend.onrender.com
- Backend API Docs: https://inventory-order-management-backend.onrender.com/docs

## Troubleshooting

- If migrations fail, verify `DATABASE_URL` and PostgreSQL connectivity.
- Neon connection strings that start with `postgresql://` are supported automatically by the backend.
- If frontend API calls fail, verify `VITE_API_URL` and backend CORS origins.
- If Docker backend cannot connect to Postgres, use the Compose service hostname `postgres`.

## Future Improvements

- Authentication and role-based access
- Order status transitions
- CSV export
- Product categories
- Audit logging
