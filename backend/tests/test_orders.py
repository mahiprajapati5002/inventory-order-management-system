def seed_customer_and_product(client, stock=10, price=50):
    customer = client.post("/api/v1/customers", json={"name": "Mira", "email": "mira@example.com"}).json()
    product = client.post("/api/v1/products", json={
        "sku": "ORD-001",
        "name": "Notebook",
        "price": price,
        "stock_quantity": stock,
    }).json()
    return customer, product


def test_create_order_reduces_stock_and_calculates_total(client):
    customer, product = seed_customer_and_product(client, stock=8, price=40)

    response = client.post("/api/v1/orders", json={
        "customer_id": customer["id"],
        "items": [{"product_id": product["id"], "quantity": 3}],
    })
    assert response.status_code == 201
    assert response.json()["total_amount"] == 120

    product_response = client.get(f"/api/v1/products/{product['id']}")
    assert product_response.json()["stock_quantity"] == 5


def test_insufficient_stock_is_rejected(client):
    customer, product = seed_customer_and_product(client, stock=2, price=40)
    response = client.post("/api/v1/orders", json={
        "customer_id": customer["id"],
        "items": [{"product_id": product["id"], "quantity": 3}],
    })
    assert response.status_code == 400

