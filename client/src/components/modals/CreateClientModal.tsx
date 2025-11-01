import { useState } from "react";

type CreateClientModalProps = {
  onClose: () => void;
  onCreate: (payload: { name: string; email?: string; note?: string }) => Promise<void> | void;
};

export function CreateClientModal({ onClose, onCreate }: CreateClientModalProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [note, setNote] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    try {
      await onCreate({
        name,
        email: email || undefined,
        note: note || undefined,
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
        <h3 className="text-lg font-semibold">Add client</h3>

        <div>
          <label className="block text-sm text-gray-600 mb-1">Name</label>
          <input
            className="border rounded w-full px-2 py-1"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>

        <div>
          <label className="block text-sm text-gray-600 mb-1">Email</label>
          <input
            className="border rounded w-full px-2 py-1"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            type="email"
          />
        </div>

        <div>
          <label className="block text-sm text-gray-600 mb-1">Note</label>
          <textarea
            className="border rounded w-full px-2 py-1"
            value={note}
            onChange={(e) => setNote(e.target.value)}
          />
        </div>

        <div className="flex justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded bg-gray-100"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={submitting}
            className="px-4 py-2 rounded bg-blue-600 text-white"
          >
            {submitting ? "Saving..." : "Create"}
          </button>
        </div>
      </form>
    </div>
  );
}
