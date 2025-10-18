// src/App.jsx
import { BrowserRouter, Routes, Route } from "react-router-dom";
import MainLayout from "./layout/MainLayout";
import DashboardPage from "./pages/DashboardPage";
import ProductsListPage from "./pages/ProductsListPage";
import SchedulePage from "./pages/SchedulePage";
import WhatsappPage from "./pages/WhatsappPage";
import LoginPage from "./pages/LoginPage";
import ProductCreatePage from "./pages/ProductCreatePage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />

        <Route element={<MainLayout />}>
          <Route path="/" element={<DashboardPage />} />
          <Route path="/produtos" element={<ProductsListPage />} />
          <Route path="/produtos/novo" element={<ProductCreatePage />} />
          <Route path="/agenda" element={<SchedulePage />} />
          <Route path="/whatsapp" element={<WhatsappPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
