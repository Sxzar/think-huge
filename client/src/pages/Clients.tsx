import { useEffect, useState } from 'react';
import { AppLayout } from "../layouts/AppLayout";
import {
    listClients,
    deleteClient,
    updateClient,
    addClientTransaction,
    createClient,
    type Client,
} from '../api/clients';
import { DeleteModal } from '../components/modals/DeleteModal';
import { EditClientModal } from '../components/modals/EditClientModal';
import { TransactionModal } from '../components/modals/TransactionModal';
import { CreateClientModal } from '../components/modals/CreateClientModal';

type ModalMode =
    | { type: "none" }
    | { type: "edit"; client: Client }
    | { type: "earning"; client: Client }
    | { type: "expense"; client: Client }
    | { type: "delete"; client: Client };

export default function Clients() {
    const [clients, setClients] = useState<Client[]>([]);
    const [loading, setLoading] = useState(false);
    const [modal, setModal] = useState<ModalMode>({ type: "none" });
    const [page, setPage] = useState(1);
    const [pages, setPages] = useState(1);
    const [showCreate, setShowCreate] = useState(false);

    async function load(p = 1) {
        setLoading(true);
        try {
            const res = await listClients(p, 50);
            setClients(res.data);
            setPage(res.page);
            setPages(res.pages);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        load();
    }, []);

    async function handleDelete(id: number) {
        await deleteClient(id);
        setModal({ type: "none" });
        load(page);
    }

    async function handleUpdate(id: number, payload: { name: string; email?: string; note?: string }) {
        await updateClient(id, payload);
        setModal({ type: "none" });
        load(page);
    }

    async function handleAddTransaction(
        clientId: number,
        payload: {
            type: 'earning' | 'expense';
            amount: number;
            occurred_at: string;
            description?: string;
        }
    ) {
        await addClientTransaction(clientId, payload);
        setModal({ type: "none" });
        load(page);
    }


    return (
        <AppLayout title="Clients" actions={
            <>
                <button
                    onClick={() => setShowCreate(true)}
                    className="px-3 py-1.5 bg-blue-300 text-white rounded text-sm"
                >
                    Add Client
                </button>
                <button onClick={() => load(page)}
                    className="px-3 py-1.5 bg-red-500 hover:bg-red-600 text-sm">
                    Refresh
                </button>
            </>
        }>

            <section className='bg-white shadow-sm rounded-lg overflow-hidden'>
                <table className='min-w-full tex-sm'>
                    <thead className='bg-gray-50 border-b'>
                        <tr>
                            <th className='table-header'>
                                ID
                            </th>
                            <th className='table-header'>
                                Name
                            </th>
                            <th className='table-header'>
                                Email
                            </th>
                            <th className='table-header'>
                                Note
                            </th>
                            <th className='table-header'>
                                Actions
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr>
                                <td colSpan={5} className='px-4 py-6 text-center text-shadow-gray-500'>
                                    Loading clients...
                                </td>
                            </tr>
                        ) : clients.length === 0 ? (
                            <tr>
                                <td colSpan={5} className='px-4 py-6 text-center text-gray-400'>
                                    No clients found.
                                </td>
                            </tr>
                        ) : (
                            clients.map((client) => (
                                <tr key={client.id} className='border-b last:border-b-0'>
                                    <td className='table-dataCell'>
                                        {client.id}
                                    </td>
                                    <td className='table-dataCell'>
                                        {client.name}
                                    </td>
                                    <td className='table-dataCell'>
                                        {client.email ?? "-"}
                                    </td>
                                    <td className='table-dataCell'>
                                        {client.note ?? "-"}
                                    </td>
                                    <td className='table-dataCell'>
                                        <div className="flex justify-end gap-2">
                                            <button
                                                onClick={() => setModal({
                                                    type: "earning", client: client
                                                })}
                                                className="px-2 py-1 text-xs bg-green-50 text-green-700 border border-green-200 rounded"
                                            >
                                                Add Earning
                                            </button>
                                            <button
                                                onClick={() => setModal({
                                                    type: "expense", client: client
                                                })}
                                                className="px-2 py-1 text-xs bg-red-50 text-red-700 border border-red-200 rounded"
                                            >
                                                Add expense
                                            </button>
                                            <button
                                                onClick={() => setModal({
                                                    type: "edit",
                                                    client: client
                                                })}
                                                className="px-2 py-1 text-xs bg-blue-50 text-blue-700 border border-blue-200 rounded"
                                            >
                                                Edit
                                            </button>
                                            <button
                                                onClick={() => setModal({
                                                    type: "delete",
                                                    client: client
                                                })}
                                                className="px-2 py-1 text-xs bg-gray-100 text-gray-700 border rounded"
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
            <div className='mt-4 flex gap-2'>
                <button disabled={page <= 1} onClick={() => load(page - 1)}
                    className="px-3 py-1.5 bg-white border rounded disabled:opacity-50">
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

            {/* Modals would go here */}
            {modal.type === "delete" && (
                <DeleteModal
                    client={modal.client}
                    onClose={() => setModal({ type: "none" })}
                    onConfirm={() => handleDelete(modal.client.id)}
                />
            )}
            {modal.type === "edit" && (
                <EditClientModal
                    client={modal.client}
                    onClose={() => setModal({ type: "none" })}
                    onSave={(payload) => handleUpdate(modal.client.id, payload)}
                />
            )}

            {modal.type === "earning" && (
                <TransactionModal
                    client={modal.client}
                    type="earning"
                    onClose={() => setModal({ type: "none" })}
                    onSubmit={(payload) => handleAddTransaction(modal.client.id, payload)}
                />
            )}

            {modal.type === "expense" && (
                <TransactionModal
                    client={modal.client}
                    type="expense"
                    onClose={() => setModal({ type: "none" })}
                    onSubmit={(payload) => handleAddTransaction(modal.client.id, payload)}
                />
            )}
            {showCreate && (
                <CreateClientModal
                    onClose={() => setShowCreate(false)}
                    onCreate={async (payload) => {
                        await createClient(payload);
                        setShowCreate(false);
                        load(page);
                    }}
                />
            )}
        </AppLayout>
    )
}

