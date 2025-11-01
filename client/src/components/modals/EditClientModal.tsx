import { useState } from "react";
import type { Client } from "../../api/clients";

type EditClientModalProps = {
  client: Client;
  onClose: () => void;
  onSave: (payload: { name: string; email?: string; note?: string }) => void;
};

export function EditClientModal({ client, onClose, onSave }: EditClientModalProps) {
  const [name, setName] = useState(client.name);
  const [email, setEmail] = useState(client.email || "");
  const [note, setNote] = useState(client.note || "");
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    try {
      await onSave({ name, email, note });
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
        <h3 className="text-lg font-semibold">Edit client</h3>
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
          <button type="button" onClick={onClose} className="px-4 py-2 rounded bg-gray-100">
            Cancel
          </button>
          <button
            type="submit"
            disabled={submitting}
            className="px-4 py-2 rounded bg-blue-600 text-white"
          >
            {submitting ? "Saving..." : "Save"}
          </button>
        </div>
      </form>
    </div>
  );
}
