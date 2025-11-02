import { useCallback, useEffect, useMemo, useState } from "react";
import { useParams, useLocation } from "react-router-dom";
import { AppLayout } from "../layouts/AppLayout";
import { getSummary } from "../api/reports";
import type { ReportSummary } from "../types/reports";
import { updateTransaction, deleteTransaction } from "../api/transactions";
import { EditTransactionModal } from "../components/modals/EditTransactionModal";

type TxForEdit = {
  id: number;
  type: "earning" | "expense";
  amount: number | string;
  description?: string | null;
  occurred_at: string;
};

type ConfirmState =
  | { open: false }
  | { open: true; txId: number };

export default function ClientDetails() {
  const { id } = useParams<{ id: string }>();
  const clientId = Number(id);
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const txFilter = params.get("tx"); // e.g. /clients/3?tx=5

  const [report, setReport] = useState<ReportSummary | null>(null);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({ from: "", to: "" });
  const [editingTx, setEditingTx] = useState<TxForEdit | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<ConfirmState>({ open: false });

  const load = useCallback(async () => {
    if (!clientId) return;
    setLoading(true);
    try {
      const data = await getSummary({
        client_id: clientId,
        from: filters.from || undefined,
        to: filters.to || undefined,
      });
      setReport(data);
    } finally {
      setLoading(false);
    }
  }, [clientId, filters.from, filters.to]);

  useEffect(() => {
    load();
  }, [load]);

  // what to show in the table
  const displayedTx = useMemo(() => {
    if (!report) return [];
    const all = report.movements.data;
    if (txFilter) {
      const idNum = Number(txFilter);
      return all.filter((t) => t.id === idNum);
    }
    return all;
  }, [report, txFilter]);

  async function handleSaveEdit(payload: {
    type: "earning" | "expense";
    amount: number;
    occurred_at: string;
    description?: string;
  }) {
    if (!editingTx) return;
    await updateTransaction(editingTx.id, payload);
    setEditingTx(null);
    await load();
  }

  async function handleConfirmDelete() {
    if (!confirmDelete.open) return;
    await deleteTransaction(confirmDelete.txId);
    setConfirmDelete({ open: false });
    await load();
  }

  function handleAskDelete(id: number) {
    setConfirmDelete({ open: true, txId: id });
  }

  function handleClearFilters() {
    setFilters({ from: "", to: "" });
    // just reload without filters
    load();
  }

  return (
    <AppLayout title={`Client #${clientId}`}>
      {/* filters */}
      <div className="mb-4 flex gap-3 items-end">
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
          className="px-3 py-1.5 bg-blue-600 text-white rounded text-sm"
          disabled={loading}
        >
          {loading ? "Loading..." : "Apply"}
        </button>
        <button
          onClick={handleClearFilters}
          className="px-3 py-1.5 bg-gray-100 text-sm rounded"
          disabled={loading}
        >
          Clear
        </button>
      </div>

      <div className="bg-white shadow-sm rounded-lg overflow-hidden">
        <div className="px-6 py-4 border-b flex justify-between items-center">
          <h2 className="text-sm font-semibold text-gray-700">
            Transactions for client #{clientId}
          </h2>
          <button
            onClick={load}
            className="px-3 py-1.5 bg-blue-600 text-white rounded text-sm"
          >
            Refresh
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="text-left px-4 py-2">ID</th>
                <th className="text-left px-4 py-2">Type</th>
                <th className="text-left px-4 py-2">Amount</th>
                <th className="text-left px-4 py-2">Description</th>
                <th className="text-left px-4 py-2">Occurred at</th>
                <th className="text-left px-4 py-2">Created at</th>
                <th className="px-4 py-2 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={7} className="px-4 py-6 text-center text-gray-400">
                    Loading…
                  </td>
                </tr>
              ) : !report ? (
                <tr>
                  <td colSpan={7} className="px-4 py-6 text-center text-gray-400">
                    No data.
                  </td>
                </tr>
              ) : displayedTx.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-6 text-center text-gray-400">
                    No transactions for this client.
                  </td>
                </tr>
              ) : (
                displayedTx.map((tx) => (
                  <tr key={tx.id} className="border-b last:border-b-0">
                    <td className="px-4 py-2">{tx.id}</td>
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
                      {typeof tx.amount === "string"
                        ? tx.amount
                        : tx.amount.toFixed(2)}
                    </td>
                    <td className="px-4 py-2">{tx.description ?? "-"}</td>
                    <td className="px-4 py-2">{tx.occurred_at}</td>
                    <td className="px-4 py-2">{tx.created_at}</td>
                    <td className="px-4 py-2 text-right">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() =>
                            setEditingTx({
                              id: tx.id,
                              type: tx.type,
                              amount: tx.amount,
                              description: tx.description,
                              occurred_at: tx.occurred_at,
                            })
                          }
                          className="px-2 py-1 text-xs bg-blue-50 text-blue-700 border border-blue-200 rounded"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleAskDelete(tx.id)}
                          className="px-2 py-1 text-xs bg-red-50 text-red-700 border border-red-200 rounded"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* edit transaction modal */}
      {editingTx && (
        <EditTransactionModal
          tx={editingTx}
          onClose={() => setEditingTx(null)}
          onSave={handleSaveEdit}
        />
      )}

      {/* confirm delete modal */}
      {confirmDelete.open && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow p-6 w-full max-w-sm space-y-4">
            <h3 className="text-lg font-semibold">Delete transaction</h3>
            <p className="text-sm text-gray-600">
              Are you sure you want to delete this transaction?
            </p>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setConfirmDelete({ open: false })}
                className="px-3 py-1.5 bg-gray-100 rounded"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDelete}
                className="px-3 py-1.5 bg-red-600 text-white rounded"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </AppLayout>
  );
}
