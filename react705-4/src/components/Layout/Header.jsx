import { Link } from "react-router-dom";
import { Sun, Moon, Languages } from "lucide-react";
import { useTheme } from "../../context/ThemeContext";
import { useLanguage } from "../../context/LanguageContext";
import Navbar from "./Navbar";
import Login from "../Auth/Login";
import CartButton from "../Cart/CartButton";

function Header() {
  const { tema, cambiarTema } = useTheme();
  const { idioma, cambiarIdioma, t } = useLanguage();

  return (
    <header className="sticky top-0 z-50 flex items-center justify-between bg-gradient-to-r from-slate-900 via-purple-900 to-slate-900 px-6 py-4 text-white shadow-lg">
      <div>
        <Link to="/">
          <h2 className="text-xl font-bold tracking-tight text-white hover:text-pink-300 transition duration-300">
            React705
          </h2>
        </Link>
      </div>
      <Navbar />
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={cambiarIdioma}
          title={t("header.cambiarIdioma")}
          className="flex items-center gap-1 p-2 rounded-full text-slate-200 hover:bg-white/10 hover:text-pink-300 hover:scale-110 transition-all duration-300"
        >
          <Languages size={20} />
          <span className="text-xs font-bold uppercase">{idioma}</span>
        </button>
        <button
          type="button"
          onClick={cambiarTema}
          title={tema === "claro" ? t("header.cambiarAOscuro") : t("header.cambiarAClaro")}
          className="p-2 rounded-full text-slate-200 hover:bg-white/10 hover:text-pink-300 hover:scale-110 transition-all duration-300"
        >
          {tema === "claro" ? <Moon size={20} /> : <Sun size={20} />}
        </button>
        <CartButton />
        <Login />
      </div>
    </header>
  );
}

export default Header;
