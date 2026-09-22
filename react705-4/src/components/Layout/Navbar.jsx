import { Link } from "react-router-dom";
import { useLanguage } from "../../context/LanguageContext";

function Navbar() {
  const { t } = useLanguage();

  return (
    <nav>
      <ul className="flex gap-6 list-none m-0 p-0">
        <li>
          <Link
            to="/escenario"
            className="text-slate-300 font-medium hover:text-pink-300 transition duration-300"
          >
            {t("nav.diviertete")}
          </Link>
        </li>
        <li>
          <Link
            to="/catalogo"
            className="text-slate-300 font-medium hover:text-pink-300 transition duration-300"
          >
            {t("nav.catalogo")}
          </Link>
        </li>
        <li>
          <Link
            to="/contacto"
            className="text-slate-300 font-medium hover:text-pink-300 transition duration-300"
          >
            {t("nav.contactame")}
          </Link>
        </li>
      </ul>
    </nav>
  );
}

export default Navbar;
