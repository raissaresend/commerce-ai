import { useState } from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Package, Calendar, MessageSquare, Menu, X, LogOut, ShoppingCart } from 'lucide-react';

const navItems = [
  { name: 'Dashboard', path: '/', icon: <LayoutDashboard size={18} /> },
  { name: 'Produtos', path: '/produtos', icon: <Package size={18} /> },
  { name: 'Agenda', path: '/agenda', icon: <Calendar size={18} /> },
  { name: 'Vendas', path: '/vendas', icon: <ShoppingCart size={18} /> },
  { name: 'WhatsApp', path: '/whatsapp', icon: <MessageSquare size={18} /> },
];

export default function Header() {
  // Estado para controlar se o menu móvel está aberto ou fechado
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  // Logout
  const handleLogout = () => {
    console.log("Usuário deslogado");
    
    // Fecha o menu móvel se estiver aberto
    setIsMobileMenuOpen(false); 
    
    // Redireciona para a página de login
    navigate('/login'); 
  };

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">

          {/* Logo e Navegação Principal (Telas Grandes) */}
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center gap-2">
              {/* Ícone de Raio com a cor primária */}
              <span className="text-primary-600">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M13.2044 2.112C12.822 1.63189 12.078 1.63189 11.6956 2.112L4.4956 11H11V15.5H8.4956L7.19973 17.6001C6.81775 18.0801 7.18974 18.8001 7.80387 18.8001H12V22L19.2 13H13V8.5H15.5L16.7959 6.39993C17.1779 5.91982 16.8059 5.19983 16.1918 5.19983H12V2.8L13.2044 2.112Z" fill="currentColor"/>
                </svg>
              </span>
              <h1 className="text-xl font-bold text-gray-800">Commerce.AI</h1>
            </Link>
            {/* Navegação Desktop */}
            <nav className="hidden md:flex md:ml-10 md:space-x-8">
              {navItems.map((item) => (
                <NavLink
                  key={item.name}
                  to={item.path}
                  className={({ isActive }) =>
                    `inline-flex items-center gap-2 border-b-2 px-1 pt-1 text-sm font-medium ${
                      isActive
                        ? 'border-primary-500 text-primary-600' 
                        : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                    }`
                  }
                >
                  {item.icon}
                  {item.name}
                </NavLink>
              ))}
            </nav>
          </div>

          {/* Botão da Direita - Sair (Telas Grandes) */}
          <div className="hidden md:flex items-center">
            <button 
              onClick={handleLogout}
              className="flex items-center gap-2 text-gray-500 hover:text-gray-700"
            >
              <LogOut size={16} />
              <span className="text-sm font-medium">Sair</span>
            </button>
          </div>

          {/* Botão do Menu Móvel (Telas Pequenas) */}
          <div className="flex items-center md:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-500"
            >
              <span className="sr-only">Abrir menu principal</span>
              {isMobileMenuOpen ? (
                <X className="block h-6 w-6" aria-hidden="true" />
              ) : (
                <Menu className="block h-6 w-6" aria-hidden="true" />
              )}
            </button>
          </div>

        </div>
      </div>

      {/* Menu Móvel Dropdown (Telas Pequenas) */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t border-gray-200">
          <div className="space-y-1 px-2 pt-2 pb-3 sm:px-3">
            {navItems.map((item) => (
              <NavLink
                key={item.name}
                to={item.path}
                onClick={() => setIsMobileMenuOpen(false)} // Fecha o menu ao clicar
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-md px-3 py-2 text-base font-medium ${
                    isActive
                      ? 'bg-primary-50 text-primary-700'
                      : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                  }`
                }
              >
                {item.icon}
                {item.name}
              </NavLink>
            ))}
          </div>
          {/* Botões no menu móvel */}
          <div className="border-t border-gray-200 pt-4 pb-3 px-2">
             <button 
                onClick={handleLogout}
                className="w-full flex items-center justify-center gap-2 text-gray-500 hover:text-gray-700 mt-3"
              >
              <LogOut size={16} />
              <span className="text-sm font-medium">Sair</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
}