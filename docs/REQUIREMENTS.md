# Requirements

## Functional Requirements

- Users can create, view, update, and delete products.
- Users can create, view, update, and delete customers.
- Users can create orders for existing customers and products.
- The system calculates order totals on the backend.
- The system reduces product stock after successful order creation.
- The dashboard shows totals, revenue, low-stock products, and recent orders.

## Non-Functional Requirements

- Backend validation must protect business rules even if frontend validation is bypassed.
- Configuration must use environment variables.
- The app must run locally through Docker Compose.
- The frontend must be responsive for desktop and mobile screens.
- API responses must use meaningful HTTP status codes and error messages.

## User Stories

- As an inventory manager, I can add products so stock can be tracked.
- As an inventory manager, I can maintain customer records so orders are linked to buyers.
- As a sales user, I can place an order only when stock is available.
- As a reviewer, I can run tests and Docker Compose to verify the project quickly.

## Acceptance Criteria

- Duplicate product SKUs return `409 Conflict`.
- Duplicate customer emails return `409 Conflict`.
- Invalid prices, stock values, and order quantities return validation errors.
- Insufficient stock prevents order creation.
- Successful order creation reduces stock and calculates totals automatically.

## Assumptions

- A single order can contain one or more product line items.
- Order status defaults to `placed`.
- Low stock means stock quantity is less than or equal to five.

## Risks

- Deployment requires valid external accounts and environment variables.
- Free hosting platforms can sleep or throttle services.
- Public database credentials must be managed securely through platform secrets.

