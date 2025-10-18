import { NavLink } from "react-router-dom";

const navItems = [
  { name: "Dashboard", path: "/" },
  { name: "Produtos", path: "/produtos" },
  { name: "+ Novo Produto", path: "/produtos/novo" },
  { name: "Agenda", path: "/agenda" },
  { name: "WhatsApp", path: "/whatsapp" },
];

export default function Header() {
  return (
    <header className="bg-white shadow-sm">
      <div className="mx-auto max-w-7xl px-4 py-4 flex justify-between items-center">
        <div className="flex items-center space-x-8">
          <h1 className="text-xl font-bold text-gray-800">⚡ Commerce.AI</h1>
          <nav className="hidden md:flex space-x-4">
            {navItems.map((item) => (
              <NavLink
                key={item.name}
                to={item.path}
                className={({ isActive }) =>
                  `px-3 py-2 rounded-md text-sm font-medium ${
                    isActive
                      ? "bg-gray-100 text-gray-900"
                      : "text-gray-500 hover:text-gray-700"
                  }`
                }
              >
                {item.name}
              </NavLink>
            ))}
          </nav>
        </div>
        <button className="text-sm font-medium text-gray-500 hover:text-gray-700">
          Sair
        </button>
      </div>
    </header>
  );
}
