import { useEffect, useState } from "react";
import { api, getErrorMessage } from "../api";
import { ErrorState, Loading } from "../components/State";

export default function Dashboard() {
  const [data, setData] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    api.get("/dashboard").then((res) => setData(res.data)).catch((err) => setError(getErrorMessage(err)));
  }, []);

  if (error) return <ErrorState message={error} />;
  if (!data) return <Loading />;

  const cards = [
    ["Products", data.total_products],
    ["Customers", data.total_customers],
    ["Orders", data.total_orders],
    ["Revenue", `₹${Number(data.revenue).toFixed(2)}`],
  ];

  return (
    <section className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold">Dashboard</h2>
        <p className="mt-1 text-sm text-slate-600">Operational summary for products, customers, orders, and stock.</p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map(([label, value]) => (
          <div key={label} className="panel p-5">
            <p className="text-sm text-slate-500">{label}</p>
            <p className="mt-2 text-3xl font-semibold">{value}</p>
          </div>
        ))}
      </div>
      <div className="grid gap-4 lg:grid-cols-2">
        <div className="panel p-5">
          <h3 className="font-semibold">Low Stock</h3>
          <div className="mt-4 space-y-3">
            {data.low_stock_products.length === 0 ? <p className="text-sm text-slate-500">No low stock products.</p> : data.low_stock_products.map((p) => (
              <div key={p.id} className="flex items-center justify-between border-b border-line pb-2 text-sm">
                <span>{p.name}</span>
                <span className="font-semibold">{p.stock_quantity}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="panel p-5">
          <h3 className="font-semibold">Recent Orders</h3>
          <div className="mt-4 space-y-3">
            {data.recent_orders.length === 0 ? <p className="text-sm text-slate-500">No orders yet.</p> : data.recent_orders.map((o) => (
              <div key={o.id} className="flex items-center justify-between border-b border-line pb-2 text-sm">
                <span>Order #{o.id}</span>
                <span className="font-semibold">₹{Number(o.total_amount).toFixed(2)}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

