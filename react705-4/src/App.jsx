import { BrowserRouter, Routes, Route } from "react-router-dom";

import Layout from "./components/Layout/Layout";
import { ThemeProvider } from "./context/ThemeContext";
import { LanguageProvider } from "./context/LanguageContext";
import { AuthProvider } from "./context/AuthContext";
import { CartProvider } from "./context/CartContext";

import Inicio from "./pages/Inicio";
import Escenario from "./pages/Escenario/Escenario";
import Productos from "./pages/Catalogo/Productos";
import Contacto from "./pages/Contacto/Contacto";

function App() {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <BrowserRouter>
          <AuthProvider>
            <CartProvider>
              <Layout>
                <Routes>
                  <Route path="/" element={<Inicio />} />
                  <Route path="/escenario" element={<Escenario />} />
                  <Route path="/catalogo" element={<Productos />} />
                  <Route path="/contacto" element={<Contacto />} />
                </Routes>
              </Layout>
            </CartProvider>
          </AuthProvider>
        </BrowserRouter>
      </LanguageProvider>
    </ThemeProvider>
  );
}

export default App;
