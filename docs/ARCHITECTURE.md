# Architecture

## High-Level Architecture

```mermaid
flowchart LR
  A["React + Vite Frontend"] --> B["FastAPI REST API"]
  B --> C["PostgreSQL Database"]
```

## Component Diagram

```mermaid
flowchart TD
  UI["Pages: Dashboard, Products, Customers, Orders"] --> API["Axios API Client"]
  API --> Router["FastAPI Routers"]
  Router --> Services["Business Services"]
  Services --> ORM["SQLAlchemy ORM"]
  ORM --> DB["PostgreSQL"]
```

## Database ER Diagram

```mermaid
erDiagram
  PRODUCTS ||--o{ ORDER_ITEMS : contains
  CUSTOMERS ||--o{ ORDERS : places
  ORDERS ||--|{ ORDER_ITEMS : includes

  PRODUCTS {
    int id PK
    string sku UK
    string name
    text description
    numeric price
    int stock_quantity
    datetime created_at
    datetime updated_at
  }

  CUSTOMERS {
    int id PK
    string name
    string email UK
    string phone
    text address
    datetime created_at
    datetime updated_at
  }

  ORDERS {
    int id PK
    int customer_id FK
    numeric total_amount
    string status
    datetime created_at
  }

  ORDER_ITEMS {
    int id PK
    int order_id FK
    int product_id FK
    int quantity
    numeric unit_price
  }
```

## API Flow

```mermaid
sequenceDiagram
  participant User
  participant Frontend
  participant API
  participant DB

  User->>Frontend: Submit order
  Frontend->>API: POST /api/v1/orders
  API->>DB: Load customer and products
  API->>API: Validate stock and calculate total
  API->>DB: Create order and reduce stock
  API-->>Frontend: 201 Created with order
```

## Architecture Decisions

- FastAPI provides built-in OpenAPI documentation and strong validation through Pydantic.
- SQLAlchemy keeps persistence logic explicit and portable.
- Alembic manages schema changes for PostgreSQL.
- React Router keeps frontend sections simple and reviewable.
- Docker Compose mirrors the production service split for local verification.

