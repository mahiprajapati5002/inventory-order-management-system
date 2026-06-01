import { Plus } from "lucide-react";
import { useEffect, useState } from "react";
import { api, getErrorMessage } from "../api";
import { EmptyState, ErrorState, Loading, Toast } from "../components/State";

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [products, setProducts] = useState([]);
  const [customerId, setCustomerId] = useState("");
  const [productId, setProductId] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [toast, setToast] = useState("");

  async function load() {
    try {
      const [orderRes, customerRes, productRes] = await Promise.all([
        api.get("/orders"),
        api.get("/customers"),
        api.get("/products"),
      ]);
      setOrders(orderRes.data);
      setCustomers(customerRes.data);
      setProducts(productRes.data);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, []);

  async function submit(event) {
    event.preventDefault();
    setError("");
    try {
      await api.post("/orders", {
        customer_id: Number(customerId),
        items: [{ product_id: Number(productId), quantity: Number(quantity) }],
      });
      setToast("Order placed and stock updated.");
      setCustomerId("");
      setProductId("");
      setQuantity(1);
      load();
    } catch (err) {
      setError(getErrorMessage(err));
    }
  }

  if (loading) return <Loading />;

  return (
    <section className="space-y-5">
      <div>
        <h2 className="text-2xl font-semibold">Orders</h2>
        <p className="mt-1 text-sm text-slate-600">Place orders only when product stock is available.</p>
      </div>
      <Toast message={toast} />
      {error && <ErrorState message={error} />}
      <form onSubmit={submit} className="panel grid gap-4 p-4 md:grid-cols-4">
        <select className="input" value={customerId} onChange={(e) => setCustomerId(e.target.value)} required>
          <option value="">Select customer</option>
          {customers.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
        <select className="input" value={productId} onChange={(e) => setProductId(e.target.value)} required>
          <option value="">Select product</option>
          {products.map((p) => <option key={p.id} value={p.id}>{p.name} ({p.stock_quantity})</option>)}
        </select>
        <input className="input" type="number" min="1" value={quantity} onChange={(e) => setQuantity(e.target.value)} required />
        <button className="btn btn-primary" type="submit"><Plus size={16} />Place Order</button>
      </form>
      {orders.length === 0 ? <EmptyState title="No orders yet." /> : (
        <div className="table-wrap">
          <table className="table">
            <thead><tr><th>Order</th><th>Customer</th><th>Status</th><th>Total</th><th>Items</th></tr></thead>
            <tbody>
              {orders.map((o) => (
                <tr key={o.id}>
                  <td>#{o.id}</td>
                  <td>{o.customer?.name || o.customer_id}</td>
                  <td>{o.status}</td>
                  <td>₹{Number(o.total_amount).toFixed(2)}</td>
                  <td>{o.items.map((item) => `${item.product?.name || item.product_id} x ${item.quantity}`).join(", ")}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}

