import { Edit2, Plus, Trash2, X } from "lucide-react";
import { useEffect, useState } from "react";
import { api, getErrorMessage } from "../api";
import { EmptyState, ErrorState, Loading, Toast } from "../components/State";

const emptyForm = { sku: "", name: "", description: "", price: "", stock_quantity: "" };

export default function Products() {
  const [items, setItems] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editing, setEditing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [toast, setToast] = useState("");

  const load = () => api.get("/products").then((res) => setItems(res.data)).catch((err) => setError(getErrorMessage(err))).finally(() => setLoading(false));

  useEffect(() => { load(); }, []);

  function edit(product) {
    setEditing(product.id);
    setForm({ ...product, price: String(product.price), stock_quantity: String(product.stock_quantity) });
  }

  function reset() {
    setEditing(null);
    setForm(emptyForm);
  }

  async function submit(event) {
    event.preventDefault();
    setError("");
    const payload = { ...form, price: Number(form.price), stock_quantity: Number(form.stock_quantity) };
    try {
      if (editing) await api.put(`/products/${editing}`, payload);
      else await api.post("/products", payload);
      setToast(editing ? "Product updated." : "Product created.");
      reset();
      load();
    } catch (err) {
      setError(getErrorMessage(err));
    }
  }

  async function remove(id) {
    await api.delete(`/products/${id}`);
    setToast("Product deleted.");
    load();
  }

  if (loading) return <Loading />;

  return (
    <section className="space-y-5">
      <header className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
        <div>
          <h2 className="text-2xl font-semibold">Products</h2>
          <p className="mt-1 text-sm text-slate-600">Create products and track available inventory.</p>
        </div>
      </header>
      <Toast message={toast} />
      {error && <ErrorState message={error} />}
      <form onSubmit={submit} className="panel grid gap-4 p-4 md:grid-cols-6">
        <input className="input md:col-span-1" placeholder="SKU" value={form.sku} onChange={(e) => setForm({ ...form, sku: e.target.value })} required />
        <input className="input md:col-span-1" placeholder="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
        <input className="input md:col-span-1" placeholder="Price" type="number" min="0.01" step="0.01" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} required />
        <input className="input md:col-span-1" placeholder="Stock" type="number" min="0" value={form.stock_quantity} onChange={(e) => setForm({ ...form, stock_quantity: e.target.value })} required />
        <input className="input md:col-span-1" placeholder="Description" value={form.description || ""} onChange={(e) => setForm({ ...form, description: e.target.value })} />
        <div className="flex gap-2">
          <button className="btn btn-primary" type="submit"><Plus size={16} />{editing ? "Save" : "Add"}</button>
          {editing && <button className="btn btn-secondary" type="button" onClick={reset}><X size={16} /></button>}
        </div>
      </form>
      {items.length === 0 ? <EmptyState title="No products yet." /> : (
        <div className="table-wrap">
          <table className="table">
            <thead><tr><th>SKU</th><th>Name</th><th>Price</th><th>Stock</th><th>Actions</th></tr></thead>
            <tbody>
              {items.map((p) => (
                <tr key={p.id}>
                  <td>{p.sku}</td><td>{p.name}</td><td>₹{Number(p.price).toFixed(2)}</td><td>{p.stock_quantity}</td>
                  <td className="flex gap-2">
                    <button className="btn btn-secondary" onClick={() => edit(p)}><Edit2 size={15} /></button>
                    <button className="btn btn-danger" onClick={() => remove(p.id)}><Trash2 size={15} /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}

