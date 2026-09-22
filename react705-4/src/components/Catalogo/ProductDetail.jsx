import { useState } from "react";
import { X, ShoppingCart, GlassWater, Martini } from "lucide-react";
import { useCart } from "../../context/CartContext";
import { useLanguage } from "../../context/LanguageContext";

function formatearPrecio(valor) {
  return valor.toLocaleString("es-CO", {
    style: "currency",
    currency: "COP",
    maximumFractionDigits: 0,
  });
}

// Componente interno: solo se usa dentro del catálogo para mostrar
// el detalle de un producto sin salir de la página (no tiene ruta propia)
export default function ProductDetail({ producto, onCerrar }) {
  const { agregarAlCarrito } = useCart();
  const { t } = useLanguage();
  const [cantidad, setCantidad] = useState(1);

  if (!producto) return null;

  function manejarAgregar() {
    agregarAlCarrito(producto, cantidad);
    onCerrar();
  }

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4"
      onClick={onCerrar}
    >
      <div
        className="relative w-full max-w-2xl max-h-[85vh] overflow-y-auto bg-white dark:bg-slate-800 rounded-3xl shadow-2xl grid grid-cols-1 sm:grid-cols-2 animate-[fadeIn_0.2s_ease-out]"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onCerrar}
          className="absolute top-3 right-3 z-10 p-2 rounded-full bg-white/80 dark:bg-slate-900/80 text-slate-500 dark:text-slate-300 hover:bg-rose-100 hover:text-rose-500 transition-colors duration-300"
          aria-label="Cerrar"
        >
          <X size={20} />
        </button>

        <img
          src={producto.image}
          alt={producto.name}
          className="w-full h-64 sm:h-full object-cover"
        />

        <div className="p-6 flex flex-col bg-gradient-to-b from-pink-50 to-purple-50 dark:from-slate-800 dark:to-slate-900">
          <h3 className="text-2xl font-bold text-slate-800 dark:text-slate-100">{producto.name}</h3>

          <div className="mt-3 flex flex-wrap gap-3">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-100 dark:bg-purple-900/40 text-purple-600 dark:text-purple-300 text-xs font-medium ring-1 ring-purple-200 dark:ring-purple-800">
              <Martini size={14} /> {producto.vaso}
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-300 text-xs font-medium ring-1 ring-blue-200 dark:ring-blue-800">
              <GlassWater size={14} /> {producto.categoria}
            </span>
          </div>

          {/* Lista de ingredientes con su medida */}
          <div className="mt-4">
            <p className="text-sm font-semibold text-slate-600 dark:text-slate-300">{t("catalogo.ingredientes")}</p>
            <ul className="mt-1 text-sm text-slate-600 dark:text-slate-400 space-y-0.5">
              {producto.ingredientes.map((ing) => (
                <li key={ing.nombre} className="flex justify-between gap-2">
                  <span>{ing.nombre}</span>
                  <span className="text-slate-400 dark:text-slate-500">{ing.medida}</span>
                </li>
              ))}
            </ul>
          </div>

          <p className="mt-4 text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
            {producto.descripcion}
          </p>

          <div className="mt-auto pt-6">
            <p className="text-2xl font-bold text-pink-500">
              {formatearPrecio(producto.precio)}
            </p>

            <div className="mt-4 flex items-center gap-3">
              <div className="flex items-center rounded-xl ring-1 ring-slate-200 overflow-hidden">
                <button
                  type="button"
                  onClick={() => setCantidad((c) => Math.max(1, c - 1))}
                  className="px-3 py-2 text-slate-500 hover:bg-pink-100 hover:text-pink-600 transition-colors duration-200"
                >
                  −
                </button>
                <span className="px-4 text-slate-700 font-medium">{cantidad}</span>
                <button
                  type="button"
                  onClick={() => setCantidad((c) => c + 1)}
                  className="px-3 py-2 text-slate-500 hover:bg-pink-100 hover:text-pink-600 transition-colors duration-200"
                >
                  +
                </button>
              </div>

              <button
                type="button"
                onClick={manejarAgregar}
                className="flex-1 inline-flex items-center justify-center gap-2 bg-pink-400 hover:bg-pink-500 hover:scale-[1.02] text-white font-semibold px-4 py-2.5 rounded-xl transition-all duration-300 shadow-sm hover:shadow-md"
              >
                <ShoppingCart size={18} />
                {t("catalogo.agregar")}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
