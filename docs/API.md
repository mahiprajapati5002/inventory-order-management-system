# API Documentation

Base path: `/api/v1`

## Products

### `GET /products`

Returns all products.

### `POST /products`

Creates a product.

```json
{
  "sku": "SKU-001",
  "name": "Keyboard",
  "description": "Mechanical keyboard",
  "price": 99.99,
  "stock_quantity": 10
}
```

Responses:

- `201 Created`
- `409 Conflict` for duplicate SKU
- `422 Unprocessable Entity` for invalid price or stock

### `GET /products/{id}`

Returns one product.

### `PUT /products/{id}`

Updates a product.

### `DELETE /products/{id}`

Deletes a product.

## Customers

### `GET /customers`

Returns all customers.

### `POST /customers`

Creates a customer.

```json
{
  "name": "Asha Rao",
  "email": "asha@example.com",
  "phone": "9999999999",
  "address": "Bengaluru"
}
```

Responses:

- `201 Created`
- `409 Conflict` for duplicate email
- `422 Unprocessable Entity` for invalid email

### `GET /customers/{id}`

Returns one customer.

### `PUT /customers/{id}`

Updates a customer.

### `DELETE /customers/{id}`

Deletes a customer.

## Orders

### `GET /orders`

Returns all orders.

### `POST /orders`

Creates an order, calculates the total, and reduces stock.

```json
{
  "customer_id": 1,
  "items": [
    {
      "product_id": 1,
      "quantity": 2
    }
  ]
}
```

Responses:

- `201 Created`
- `400 Bad Request` for insufficient stock
- `404 Not Found` for missing customer or product
- `422 Unprocessable Entity` for invalid quantities

### `GET /orders/{id}`

Returns one order with customer and item details.

## Dashboard

### `GET /dashboard`

Returns:

- Total products
- Total customers
- Total orders
- Revenue
- Low stock products
- Recent orders

