import { useState } from "react";

type EditTransactionModalProps = {
  tx: {
    id: number;
    type: "earning" | "expense";
    amount: number | string;
    description?: string | null;
    occurred_at: string;
  };
  onClose: () => void;
  onSave: (payload: {
    type: "earning" | "expense";
    amount: number;
    occurred_at: string;
    description?: string;
  }) => Promise<void> | void;
};

export function EditTransactionModal({ tx, onClose, onSave }: EditTransactionModalProps) {
  const [type, setType] = useState<"earning" | "expense">(tx.type);
  const [amount, setAmount] = useState(
    typeof tx.amount === "string" ? tx.amount : String(tx.amount)
  );
  const [occurredAt, setOccurredAt] = useState(tx.occurred_at);
  const [description, setDescription] = useState(tx.description ?? "");
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    try {
      await onSave({
        type,
        amount: Number(amount),
        occurred_at: occurredAt,
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
        <h3 className="text-lg font-semibold">Edit transaction #{tx.id}</h3>

        <div>
          <label className="block text-sm text-gray-600 mb-1">Type</label>
          <select
            value={type}
            onChange={(e) => setType(e.target.value as "earning" | "expense")}
            className="border rounded w-full px-2 py-1"
          >
            <option value="earning">Earning</option>
            <option value="expense">Expense</option>
          </select>
        </div>

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
          <label className="block text-sm text-gray-600 mb-1">Occurred at</label>
          <input
            type="date"
            className="border rounded w-full px-2 py-1"
            value={occurredAt}
            onChange={(e) => setOccurredAt(e.target.value)}
            required
          />
        </div>

        <div>
          <label className="block text-sm text-gray-600 mb-1">Description</label>
          <textarea
            className="border rounded w-full px-2 py-1"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        <div className="flex justify-end gap-3 pt-2">
          <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-100 rounded">
            Cancel
          </button>
          <button
            type="submit"
            disabled={submitting}
            className="px-4 py-2 bg-blue-600 text-white rounded"
          >
            {submitting ? "Saving..." : "Save"}
          </button>
        </div>
      </form>
    </div>
  );
}
