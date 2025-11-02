import { useState } from "react";
import type { AdminUser } from "../../api/admins";

type AdminPayload = {
    email: string;
    password?: string;
};

type AdminFormProps = {
    initial?: Partial<AdminUser>;
    onSubmit: (payload: AdminPayload) => Promise<void> | void;
    onCancel: () => void;
    mode?: "create" | "edit";
};

export function AdminForm({ initial, onSubmit, onCancel, mode = "create" }: AdminFormProps) {
  const [email, setEmail] = useState(initial?.email || "");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    try {
      await onSubmit({
        email,
        ...(password ? { password } : {}),
      });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div>
        <label className="block text-sm mb-1">Email</label>
        <input
          className="border rounded w-full px-2 py-1"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          type="email"
          required
        />
      </div>

      <div>
        <label className="block text-sm mb-1">
          Password{" "}
          {mode === "edit" && (
            <span className="text-gray-400 text-xs">(leave blank to keep current)</span>
          )}
        </label>
        <input
          className="border rounded w-full px-2 py-1"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          type="password"
          placeholder={mode === "edit" ? "••••••" : ""}
          {...(mode === "create" ? { required: true } : {})}
        />
      </div>

      <div className="flex justify-end gap-2 pt-2">
        <button
          type="button"
          onClick={onCancel}
          className="px-3 py-1.5 bg-gray-100 rounded"
        >
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

