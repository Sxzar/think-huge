import { useState } from "react";

type TransactionFormProps = {
  type: "earning" | "expense";
  onSubmit: (payload: {
    type: "earning" | "expense";
    amount: number;
    occurred_at: string;
    description?: string;
  }) => Promise<void> | void;
  onCancel: () => void;
};

export function TransactionForm({ type, onSubmit, onCancel }: TransactionFormProps) {
  const [amount, setAmount] = useState("");
  const [occurredAt, setOccurredAt] = useState("");
  const [description, setDescription] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    try {
      await onSubmit({
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
    <form onSubmit={handleSubmit} className="space-y-3">
      <p className="text-sm text-gray-500">
        New {type === "earning" ? "earning" : "expense"}
      </p>
      <div>
        <label className="block text-sm mb-1">Amount</label>
        <input
          type="number"
          step="0.01"
          className="border rounded w-full px-2 py-1"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          required
        />
      </div>
      <div>
        <label className="block text-sm mb-1">Date</label>
        <input
          type="date"
          className="border rounded w-full px-2 py-1"
          value={occurredAt}
          onChange={(e) => setOccurredAt(e.target.value)}
          required
        />
      </div>
      <div>
        <label className="block text-sm mb-1">Description</label>
        <input
          className="border rounded w-full px-2 py-1"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>
      <div className="flex justify-end gap-2 pt-2">
        <button type="button" onClick={onCancel} className="px-3 py-1.5 bg-gray-100 rounded">
          Cancel
        </button>
        <button
          type="submit"
          disabled={submitting}
          className="px-3 py-1.5 bg-blue-600 text-white rounded"
        >
          {submitting ? "Saving..." : "Save"}
        </button>
      </div>
    </form>
  );
}
