import { useEffect, useState } from "react";
import { AppLayout } from "../layouts/AppLayout";
import {
  listAdmins,
  createAdmin,
  updateAdmin,
  deleteAdmin,
  type AdminUser,
} from "../api/admins";
import { Modal } from "../components/ui/Modal";
import { AdminForm } from "../components/forms/AdminForm";
import { ConfirmModal } from "../components/modals/ConfirmModal";

type ModalMode =
  | { type: "none" }
  | { type: "create" }
  | { type: "edit"; admin: AdminUser }
  | { type: "delete"; admin: AdminUser };

export default function Admins() {
  const [admins, setAdmins] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(false);
  const [modal, setModal] = useState<ModalMode>({ type: "none" });
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [search, setSearch] = useState("");

  async function load(p = 1) {
    setLoading(true);
    try {
      const res = await listAdmins(p, 20);
      setAdmins(res.data);
      setPage(res.page);
      setPages(res.pages);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  const filtered = admins.filter((a) => {
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return a.id.toString().includes(q) || a.email.toLowerCase().includes(q);
  });

  async function handleCreate(payload: { email: string; password: string }) {
    await createAdmin(payload);
    setModal({ type: "none" });
    load(page);
  }

  async function handleEdit(id: number, payload: { email: string; password?: string }) {
    await updateAdmin(id, payload);
    setModal({ type: "none" });
    load(page);
  }

  async function handleDelete(id: number) {
    await deleteAdmin(id);
    setModal({ type: "none" });
    load(page);
  }

  return (
    <AppLayout title="Admins">
      {/* search + actions */}
      <div className="mb-4 flex gap-3 items-center">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by id or email"
          className="border rounded px-3 py-1 w-72"
        />
        <button
          onClick={() => setModal({ type: "create" })}
          className="px-3 py-1.5 bg-blue-600 text-white rounded text-sm"
        >
          Add admin
        </button>
        <button
          onClick={() => load(page)}
          className="px-3 py-1.5 bg-gray-200 rounded text-sm"
        >
          Refresh
        </button>
      </div>

      <section className="bg-white shadow-sm rounded-lg overflow-hidden">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="table-header">ID</th>
              <th className="table-header">Email</th>
              <th className="table-header">Created at</th>
              <th className="table-header">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={4} className="px-4 py-6 text-center text-gray-500">
                  Loading...
                </td>
              </tr>
            ) : filtered.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-4 py-6 text-center text-gray-400">
                  No admins found.
                </td>
              </tr>
            ) : (
              filtered.map((admin) => (
                <tr key={admin.id} className="border-b last:border-b-0">
                  <td className="table-dataCell">{admin.id}</td>
                  <td className="table-dataCell">{admin.email}</td>
                  <td className="table-dataCell">{admin.created_at}</td>
                  <td className="table-dataCell">
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => setModal({ type: "edit", admin })}
                        className="px-2 py-1 text-xs bg-blue-50 text-blue-700 border border-blue-200 rounded"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => setModal({ type: "delete", admin })}
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
      </section>

      {/* pagination */}
      <div className="mt-4 flex gap-2">
        <button
          disabled={page <= 1}
          onClick={() => load(page - 1)}
          className="px-3 py-1.5 bg-white border rounded disabled:opacity-50"
        >
          Prev
        </button>
        <span className="text-sm text-gray-500 self-center">
          Page {page} / {pages}
        </span>
        <button
          disabled={page >= pages}
          onClick={() => load(page + 1)}
          className="px-3 py-1.5 bg-white border rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>

      {/* create */}
      {modal.type === "create" && (
        <Modal onClose={() => setModal({ type: "none" })} title="Create admin">
          <AdminForm
            mode="create"
            onCancel={() => setModal({ type: "none" })}
            onSubmit={(payload) =>
              handleCreate(payload as { email: string; password: string })
            }
          />
        </Modal>
      )}

      {/* edit */}
      {modal.type === "edit" && (
        <Modal
          onClose={() => setModal({ type: "none" })}
          title={`Edit admin #${modal.admin.id}`}
        >
          <AdminForm
            mode="edit"
            initial={modal.admin}
            onCancel={() => setModal({ type: "none" })}
            onSubmit={(payload) => handleEdit(modal.admin.id, payload)}
          />
        </Modal>
      )}

      {/* delete – NO outer Modal */}
      {modal.type === "delete" && (
        <ConfirmModal
          message={`Are you sure you want to delete admin "${modal.admin.email}"?`}
          onCancel={() => setModal({ type: "none" })}
          onConfirm={() => handleDelete(modal.admin.id)}
        />
      )}
    </AppLayout>
  );
}
