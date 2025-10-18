// src/layout/MainLayout.jsx
import { Outlet } from "react-router-dom";
import Header from "./Header";

export default function MainLayout() {
  return (
    <div className="h-screen bg-gray-50">
      <Header />
      <main className="mx-auto max-w-7xl py-6 px-4">
        {/* O conteúdo das páginas (Dashboard, etc.) aparecerá aqui */}
        <Outlet />
      </main>
    </div>
  );
}
