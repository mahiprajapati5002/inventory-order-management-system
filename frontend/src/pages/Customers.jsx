import { Edit2, Plus, Trash2, X } from "lucide-react";
import { useEffect, useState } from "react";
import { api, getErrorMessage } from "../api";
import { EmptyState, ErrorState, Loading, Toast } from "../components/State";

const emptyForm = { name: "", email: "", phone: "", address: "" };

export default function Customers() {
  const [items, setItems] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editing, setEditing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [toast, setToast] = useState("");

  const load = () => api.get("/customers").then((res) => setItems(res.data)).catch((err) => setError(getErrorMessage(err))).finally(() => setLoading(false));

  useEffect(() => { load(); }, []);

  async function submit(event) {
    event.preventDefault();
    setError("");
    try {
      if (editing) await api.put(`/customers/${editing}`, form);
      else await api.post("/customers", form);
      setToast(editing ? "Customer updated." : "Customer created.");
      setEditing(null);
      setForm(emptyForm);
      load();
    } catch (err) {
      setError(getErrorMessage(err));
    }
  }

  async function remove(id) {
    await api.delete(`/customers/${id}`);
    setToast("Customer deleted.");
    load();
  }

  if (loading) return <Loading />;

  return (
    <section className="space-y-5">
      <div>
        <h2 className="text-2xl font-semibold">Customers</h2>
        <p className="mt-1 text-sm text-slate-600">Maintain customer records with unique email addresses.</p>
      </div>
      <Toast message={toast} />
      {error && <ErrorState message={error} />}
      <form onSubmit={submit} className="panel grid gap-4 p-4 md:grid-cols-5">
        <input className="input" placeholder="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
        <input className="input" placeholder="Email" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
        <input className="input" placeholder="Phone" value={form.phone || ""} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
        <input className="input" placeholder="Address" value={form.address || ""} onChange={(e) => setForm({ ...form, address: e.target.value })} />
        <div className="flex gap-2">
          <button className="btn btn-primary" type="submit"><Plus size={16} />{editing ? "Save" : "Add"}</button>
          {editing && <button className="btn btn-secondary" type="button" onClick={() => { setEditing(null); setForm(emptyForm); }}><X size={16} /></button>}
        </div>
      </form>
      {items.length === 0 ? <EmptyState title="No customers yet." /> : (
        <div className="table-wrap">
          <table className="table">
            <thead><tr><th>Name</th><th>Email</th><th>Phone</th><th>Address</th><th>Actions</th></tr></thead>
            <tbody>
              {items.map((c) => (
                <tr key={c.id}>
                  <td>{c.name}</td><td>{c.email}</td><td>{c.phone || "-"}</td><td>{c.address || "-"}</td>
                  <td className="flex gap-2">
                    <button className="btn btn-secondary" onClick={() => { setEditing(c.id); setForm(c); }}><Edit2 size={15} /></button>
                    <button className="btn btn-danger" onClick={() => remove(c.id)}><Trash2 size={15} /></button>
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

