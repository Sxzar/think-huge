type DeleteModalProps = {
    client: { id: number; name: string };
    onClose: () => void;
    onConfirm: () => void;
}

export function DeleteModal({ client, onClose, onConfirm }: DeleteModalProps) {
    return (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4">
            <div className="bg-wite rounded-lg shadow p-6 w-full max-w-sm">
                <h3 className="text-lg font-semibold mb-2">
                    Delete Client
                </h3>
                <p className="text-sm text-gray-600 mb-4">
                    Are you sure you want to delete <strong>{client.name}</strong>? This action cannot be
                    undone.
                </p>
                <div className="flex justify-end gap-3">
                    <button onClick={onClose} className="px-4 py-2 rounded bg-gray-100">
                        Cancel
                    </button>
                    <button onClick={onConfirm} className="px-4 py-2 rounded bg-red-300 text-white">
                        Delete
                    </button>
                </div>
            </div>
        </div>
    )
}