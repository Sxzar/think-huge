import type { ReactNode } from "react";

type FilterBarProps = {
  children: ReactNode;
  onApply: () => void;
  onClear: () => void;
  loading?: boolean;
};

export function FilterBar({ children, onApply, onClear, loading }: FilterBarProps) {
  return (
    <div className="bg-white shadow-sm rounded-lg p-6 mb-6">
      <div className="flex flex-wrap gap-4 items-end">
        {children}

        <div className="ml-auto flex gap-2">
          <button
            type="button"
            onClick={onClear}
            disabled={loading}
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition disabled:opacity-60"
          >
            Clear
          </button>
          <button
            type="button"
            onClick={onApply}
            disabled={loading}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition disabled:opacity-60"
          >
            {loading ? "Loading..." : "Apply Filters"}
          </button>
        </div>
      </div>
    </div>
  );
}
