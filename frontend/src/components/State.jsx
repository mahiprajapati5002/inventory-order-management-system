export function Loading() {
  return <div className="panel p-6 text-sm text-slate-600">Loading...</div>;
}

export function ErrorState({ message }) {
  return <div className="rounded-md border border-red-200 bg-red-50 p-4 text-sm text-red-700">{message}</div>;
}

export function EmptyState({ title }) {
  return <div className="panel p-8 text-center text-sm text-slate-500">{title}</div>;
}

export function Toast({ message }) {
  if (!message) return null;
  return <div className="rounded-md border border-teal-200 bg-teal-50 p-3 text-sm text-teal-800">{message}</div>;
}

