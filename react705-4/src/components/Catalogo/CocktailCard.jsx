import { ShoppingCart, Eye } from "lucide-react";
import { useCart } from "../../context/CartContext";
import { useLanguage } from "../../context/LanguageContext";

function formatearPrecio(valor) {
  return valor.toLocaleString("es-CO", {
    style: "currency",
    currency: "COP",
    maximumFractionDigits: 0,
  });
}

// Colores según si el cóctel lleva alcohol o no
const colorAlcohol = {
  Alcoholic: "bg-rose-100 text-rose-500 ring-rose-200",
  "Non alcoholic": "bg-emerald-100 text-emerald-500 ring-emerald-200",
  "Optional alcohol": "bg-amber-100 text-amber-500 ring-amber-200",
};

// CocktailCard solo recibe un producto por props y lo dibuja.
// onVerDetalle abre el componente interno de detalle (modal)
export default function CocktailCard({ coctel, onVerDetalle }) {
  const { agregarAlCarrito } = useCart();
  const { t } = useLanguage();
  const badge = colorAlcohol[coctel.alcoholico] || colorAlcohol.Alcoholic;

  return (
    <article className="group bg-white dark:bg-slate-800 rounded-2xl shadow-sm ring-1 ring-pink-100 dark:ring-slate-700 overflow-hidden hover:shadow-xl hover:shadow-pink-100 dark:hover:shadow-none hover:-translate-y-1.5 transition-all duration-300">
      <div className="relative overflow-hidden">
        <img
          src={coctel.image}
          alt={coctel.name}
          className="w-full h-56 object-cover group-hover:scale-110 transition-transform duration-500"
        />

        <span
          className={`absolute top-3 left-3 px-2.5 py-1 rounded-full text-xs font-medium ring-1 ${badge}`}
        >
          {coctel.alcoholico}
        </span>

        {/* Botón de ver detalle, aparece al pasar el mouse */}
        <button
          onClick={() => onVerDetalle(coctel)}
          className="absolute inset-0 flex items-center justify-center bg-slate-900/0 group-hover:bg-slate-900/30 opacity-0 group-hover:opacity-100 transition-all duration-300"
        >
          <span className="flex items-center gap-2 bg-white/90 text-slate-800 px-4 py-2 rounded-full text-sm font-semibold hover:bg-white transition-colors duration-300">
            <Eye size={16} /> Ver detalle
          </span>
        </button>
      </div>

      <div className="p-4">
        <h3 className="font-semibold text-slate-800 dark:text-slate-100 text-lg leading-tight">
          {coctel.name}
        </h3>

        <ul className="mt-3 space-y-1 text-sm text-slate-500 dark:text-slate-400">
          <li>
            <span className="text-slate-400 dark:text-slate-500">{t("catalogo.vaso")}:</span> {coctel.vaso}
          </li>
          <li>
            <span className="text-slate-400 dark:text-slate-500">{t("catalogo.categoria")}:</span> {coctel.categoria}
          </li>
        </ul>

        <div className="mt-4 flex items-center justify-between">
          <span className="text-pink-500 font-bold text-lg">
            {formatearPrecio(coctel.precio)}
          </span>
          <button
            type="button"
            onClick={() => agregarAlCarrito(coctel, 1)}
            className="p-2 rounded-full bg-purple-100 text-purple-500 hover:bg-pink-400 hover:text-white hover:scale-110 transition-all duration-300"
            title="Agregar al carrito"
          >
            <ShoppingCart size={18} />
          </button>
        </div>
      </div>
    </article>
  );
}
