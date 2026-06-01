def test_create_update_delete_product(client):
    response = client.post("/api/v1/products", json={
        "sku": "SKU-001",
        "name": "Keyboard",
        "description": "Mechanical keyboard",
        "price": 99.99,
        "stock_quantity": 10,
    })
    assert response.status_code == 201
    product_id = response.json()["id"]

    update = client.put(f"/api/v1/products/{product_id}", json={"price": 89.99, "stock_quantity": 7})
    assert update.status_code == 200
    assert update.json()["price"] == 89.99

    delete = client.delete(f"/api/v1/products/{product_id}")
    assert delete.status_code == 204


def test_duplicate_sku_is_rejected(client):
    payload = {"sku": "DUP-001", "name": "Mouse", "price": 25, "stock_quantity": 5}
    assert client.post("/api/v1/products", json=payload).status_code == 201
    response = client.post("/api/v1/products", json=payload)
    assert response.status_code == 409

