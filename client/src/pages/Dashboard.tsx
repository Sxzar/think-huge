import { useEffect, useState } from "react";
import { getSummary } from "../api/reports";
import type { ReportSummary } from "../types/reports";
import { AppLayout } from "../layouts/AppLayout";

export default function Dashboard() {
  const [report, setReport] = useState<ReportSummary | null>(null);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    client_id: "",
    from: "",
    to: "",
  });

  async function load() {
    setLoading(true);
    try {
      const data = await getSummary({
        client_id: filters.client_id ? Number(filters.client_id) : undefined,
        from: filters.from || undefined,
        to: filters.to || undefined,
      });
      setReport(data);
    } finally {
      setLoading(false);
    }
  }

  // 🔹 Automatically load all transactions when the page opens
  useEffect(() => {
    load();
  }, []);

  return (
    <AppLayout title="Dashboard">
      {/* filters */}
      <div className="bg-white shadow-sm rounded-lg p-6 mb-6">
        <div className="flex flex-wrap gap-4 items-end">
          <div>
            <label className="block text-sm text-gray-600 mb-1">Client ID</label>
            <input
              type="number"
              className="border rounded px-2 py-1 w-32"
              value={filters.client_id}
              onChange={(e) => setFilters({ ...filters, client_id: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-sm text-gray-600 mb-1">From</label>
            <input
              type="date"
              className="border rounded px-2 py-1"
              value={filters.from}
              onChange={(e) => setFilters({ ...filters, from: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-sm text-gray-600 mb-1">To</label>
            <input
              type="date"
              className="border rounded px-2 py-1"
              value={filters.to}
              onChange={(e) => setFilters({ ...filters, to: e.target.value })}
            />
          </div>
          <button
            onClick={load}
            disabled={loading}
            className="ml-auto px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
          >
            {loading ? "Loading..." : "Apply Filters"}
          </button>
        </div>
      </div>

      {/* table of transactions */}
      <div className="bg-white shadow-sm rounded-lg overflow-hidden">
        <div className="px-6 py-4 border-b flex justify-between items-center">
          <h2 className="text-sm font-semibold text-gray-700">Transactions</h2>
          {report && (
            <p className="text-xs text-gray-500">
              Total: {report.movements.total} items
            </p>
          )}
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="text-left px-4 py-2">ID</th>
                <th className="text-left px-4 py-2">Client</th>
                <th className="text-left px-4 py-2">Type</th>
                <th className="text-left px-4 py-2">Amount</th>
                <th className="text-left px-4 py-2">Description</th>
                <th className="text-left px-4 py-2">Occurred at</th>
                <th className="text-left px-4 py-2">Created at</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={7} className="px-4 py-6 text-center text-gray-400">
                    Loading transactions…
                  </td>
                </tr>
              ) : !report ? (
                <tr>
                  <td colSpan={7} className="px-4 py-6 text-center text-gray-400">
                    No data.
                  </td>
                </tr>
              ) : report.movements.data.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-6 text-center text-gray-400">
                    No transactions found.
                  </td>
                </tr>
              ) : (
                report.movements.data.map((tx) => (
                  <tr key={tx.id} className="border-b last:border-b-0">
                    <td className="px-4 py-2">{tx.id}</td>
                    <td className="px-4 py-2">{tx.client_id}</td>
                    <td className="px-4 py-2">
                      <span
                        className={
                          tx.type === "earning"
                            ? "inline-flex px-2 py-0.5 rounded bg-green-50 text-green-700 text-xs"
                            : "inline-flex px-2 py-0.5 rounded bg-red-50 text-red-700 text-xs"
                        }
                      >
                        {tx.type}
                      </span>
                    </td>
                    <td className="px-4 py-2">
                      {typeof tx.amount === "string" ? tx.amount : tx.amount.toFixed(2)}
                    </td>
                    <td className="px-4 py-2">{tx.description ?? "-"}</td>
                    <td className="px-4 py-2">{tx.occurred_at}</td>
                    <td className="px-4 py-2">{tx.created_at}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </AppLayout>
  );
}
