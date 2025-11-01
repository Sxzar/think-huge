import { useState } from "react";
import type { Client } from "../../api/clients";

type TransactionModalProps = {
  client: Client;
  type: "earning" | "expense";
  onClose: () => void;
  onSubmit: (payload: {
    type: "earning" | "expense";
    amount: number;
    occurred_at: string;
    description?: string;
  }) => void | Promise<void>;
};

export function TransactionModal({ client, type, onClose, onSubmit }: TransactionModalProps) {
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [description, setDescription] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    try {
      await onSubmit({
        type,
        amount: parseFloat(amount),
        occurred_at: date,
        description: description || undefined,
      });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4">
      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-lg shadow p-6 w-full max-w-md space-y-4"
      >
        <h3 className="text-lg font-semibold">
          Add {type === "earning" ? "earning" : "expense"} for {client.name}
        </h3>
        <div>
          <label className="block text-sm text-gray-600 mb-1">Amount</label>
          <input
            type="number"
            step="0.01"
            min="0"
            className="border rounded w-full px-2 py-1"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            required
          />
        </div>
        <div>
          <label className="block text-sm text-gray-600 mb-1">Date</label>
          <input
            type="date"
            className="border rounded w-full px-2 py-1"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
          />
        </div>
        <div>
          <label className="block text-sm text-gray-600 mb-1">Description</label>
          <input
            className="border rounded w-full px-2 py-1"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>
        <div className="flex justify-end gap-3 pt-2">
          <button type="button" onClick={onClose} className="px-4 py-2 rounded bg-gray-100">
            Cancel
          </button>
          <button
            type="submit"
            disabled={submitting}
            className="px-4 py-2 rounded bg-green-600 text-white"
          >
            {submitting ? "Saving..." : "Submit"}
          </button>
        </div>
      </form>
    </div>
  );
}
