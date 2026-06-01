def test_create_update_delete_customer(client):
    response = client.post("/api/v1/customers", json={
        "name": "Asha Rao",
        "email": "asha@example.com",
        "phone": "9999999999",
        "address": "Bengaluru",
    })
    assert response.status_code == 201
    customer_id = response.json()["id"]

    update = client.put(f"/api/v1/customers/{customer_id}", json={"name": "Asha R"})
    assert update.status_code == 200
    assert update.json()["name"] == "Asha R"

    delete = client.delete(f"/api/v1/customers/{customer_id}")
    assert delete.status_code == 204


def test_duplicate_email_is_rejected(client):
    payload = {"name": "Ravi", "email": "ravi@example.com"}
    assert client.post("/api/v1/customers", json=payload).status_code == 201
    response = client.post("/api/v1/customers", json=payload)
    assert response.status_code == 409

