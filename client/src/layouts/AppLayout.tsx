// src/layouts/AppLayout.tsx
import type { ReactNode } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

type AppLayoutProps = {
  title?: string;
  actions?: ReactNode;
  children: ReactNode;
};

export function AppLayout({ title, actions, children }: AppLayoutProps) {
  const { admin, logout } = useAuth();
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <header className="bg-white border-b">
        <div className="max-w-6xl mx-auto px-6 py-3 flex justify-between items-center">
          <div>
            <h1 className="text-base font-semibold">{title ?? "Admin"}</h1>
            {admin && (
              <p className="text-xs text-gray-500">
                Signed in as {admin.email}
              </p>
            )}
          </div>
          <div className="flex gap-3 items-center">
            {actions}
            <button
              onClick={logout}
              className="px-3 py-1.5 bg-red-300 text-white rounded text-sm"
            >
              Logout
            </button>
          </div>
        </div>

        {/* navbar */}
        <nav className="bg-gray-50 border-t">
          <div className="max-w-6xl mx-auto px-6 flex gap-4">
            <Link
              to="/"
              className={`py-2 text-sm ${
                isActive("/") ? "text-blue-600 border-b-2 border-blue-600" : "text-gray-600"
              }`}
            >
              Dashboard
            </Link>
            <Link
              to="/clients"
              className={`py-2 text-sm ${
                isActive("/clients") ? "text-blue-600 border-b-2 border-blue-600" : "text-gray-600"
              }`}
            >
              Clients
            </Link>
            <Link
              to="/admins"
              className={`py-2 text-sm ${
                isActive("/admins") ? "text-blue-600 border-b-2 border-blue-600" : "text-gray-600"
              }`}
            >
              Admins
            </Link>
          </div>
        </nav>
      </header>

      {/* page content */}
      <main className="max-w-6xl mx-auto w-full px-6 py-6 flex-1">
        {children}
      </main>
    </div>
  );
}
