import type { ReactNode } from "react";

type ModalProps = {
  children: ReactNode;
  onClose: () => void;
  title?: string;
  widthClass?: string;
};

export function Modal({ children, onClose, title, widthClass = "max-w-md" }: ModalProps) {
  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50">
      <div className={`bg-white rounded-lg shadow ${widthClass} w-full`}>
        <div className="flex items-center justify-between px-4 py-3 border-b">
          <h3 className="text-sm font-semibold">{title}</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            ×
          </button>
        </div>
        <div className="p-4">{children}</div>
      </div>
    </div>
  );
}
