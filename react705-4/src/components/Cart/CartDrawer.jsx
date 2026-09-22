import { X, Trash2, ShoppingBag } from "lucide-react";
import { useCart } from "../../context/CartContext";
import { useLanguage } from "../../context/LanguageContext";

// Convierte un número a formato de pesos colombianos
function formatearPrecio(valor) {
  return valor.toLocaleString("es-CO", {
    style: "currency",
    currency: "COP",
    maximumFractionDigits: 0,
  });
}

export default function CartDrawer() {
  const { t } = useLanguage();
  const {
    items,
    abierto,
    setAbierto,
    quitarDelCarrito,
    cambiarCantidad,
    enviarPedido,
    subtotal,
    valorIva,
    totalPagar,
  } = useCart();

  if (!abierto) return null;

  return (
    <div className="fixed inset-0 z-[70] flex justify-end">
      {/* Fondo oscuro clickeable para cerrar */}
      <div
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
        onClick={() => setAbierto(false)}
      />

      <aside className="relative w-full max-w-sm bg-white dark:bg-slate-800 h-full shadow-2xl flex flex-col animate-[slideIn_0.25s_ease-out]">
        <div className="flex items-center justify-between px-5 py-4 bg-gradient-to-r from-pink-100 to-purple-100 dark:from-slate-700 dark:to-slate-700">
          <h3 className="font-bold text-lg text-slate-800 dark:text-slate-100 flex items-center gap-2">
            <ShoppingBag size={20} className="text-pink-500" />
            {t("carrito.titulo")}
          </h3>
          <button
            onClick={() => setAbierto(false)}
            className="p-1.5 rounded-full hover:bg-white/70 dark:hover:bg-slate-600 text-slate-500 dark:text-slate-300 hover:text-rose-500 transition-colors duration-300"
          >
            <X size={20} />
          </button>
        </div>

        {/* Lista de productos agregados */}
        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
          {items.length === 0 && (
            <p className="text-center text-slate-400 dark:text-slate-500 mt-10">
              {t("carrito.vacio")}
            </p>
          )}

          {items.map((item) => {
            // subtotal de este producto = cantidad x precio unitario
            const subtotalItem = item.cantidad * item.precio;

            return (
              <div
                key={item.id}
                className="flex gap-3 items-center bg-purple-50/60 dark:bg-slate-700/50 rounded-xl p-3 hover:bg-purple-50 dark:hover:bg-slate-700 transition-colors duration-300"
              >
                {/* imagen */}
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-14 h-14 rounded-lg object-cover"
                />

                <div className="flex-1 min-w-0">
                  {/* nombre del producto */}
                  <p className="text-sm font-semibold text-slate-800 dark:text-slate-100 truncate">
                    {item.name}
                  </p>
                  {/* categoría (equivalente al "episodio" cuando el producto era un personaje) */}
                  <p className="text-xs text-slate-400 dark:text-slate-500">
                    {item.categoria}
                  </p>
                  {/* precio unitario */}
                  <p className="text-xs text-pink-500 font-medium">
                    {t("carrito.precioUnitario")}: {formatearPrecio(item.precio)}
                  </p>

                  {/* cantidad */}
                  <div className="mt-1 flex items-center gap-2">
                    <button
                      onClick={() => cambiarCantidad(item.id, item.cantidad - 1)}
                      className="w-6 h-6 rounded-full bg-white dark:bg-slate-800 ring-1 ring-slate-200 dark:ring-slate-600 text-slate-500 dark:text-slate-300 hover:bg-pink-100 dark:hover:bg-slate-600 transition-colors duration-200"
                    >
                      −
                    </button>
                    <span className="text-xs text-slate-600 dark:text-slate-300 w-4 text-center">
                      {item.cantidad}
                    </span>
                    <button
                      onClick={() => cambiarCantidad(item.id, item.cantidad + 1)}
                      className="w-6 h-6 rounded-full bg-white dark:bg-slate-800 ring-1 ring-slate-200 dark:ring-slate-600 text-slate-500 dark:text-slate-300 hover:bg-pink-100 dark:hover:bg-slate-600 transition-colors duration-200"
                    >
                      +
                    </button>
                  </div>

                  {/* subtotal por producto */}
                  <p className="mt-1 text-xs font-semibold text-slate-600 dark:text-slate-300">
                    {t("carrito.subtotal")}: {formatearPrecio(subtotalItem)}
                  </p>
                </div>

                <button
                  onClick={() => quitarDelCarrito(item.id)}
                  className="p-2 text-slate-400 dark:text-slate-500 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-full transition-colors duration-300"
                  title={t("carrito.quitar")}
                >
                  <Trash2 size={16} />
                </button>
              </div>
            );
          })}
        </div>

        {/* Resumen: Subtotal, IVA y Total a pagar */}
        <div className="px-5 py-4 border-t border-purple-100 dark:border-slate-700 bg-purple-50/40 dark:bg-slate-700/30">
          <div className="space-y-1 mb-3 text-sm">
            <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
              <span>{t("carrito.subtotal")}</span>
              <span>{formatearPrecio(subtotal)}</span>
            </div>
            <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
              <span>{t("carrito.iva")}</span>
              <span>{formatearPrecio(valorIva)}</span>
            </div>
            <div className="flex items-center justify-between text-slate-800 dark:text-slate-100 font-bold text-base pt-1 border-t border-purple-200 dark:border-slate-600">
              <span>{t("carrito.totalPagar")}</span>
              <span>{formatearPrecio(totalPagar)}</span>
            </div>
          </div>

          <button
            disabled={items.length === 0}
            onClick={enviarPedido}
            className="w-full bg-pink-400 hover:bg-pink-500 disabled:bg-slate-200 dark:disabled:bg-slate-700 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-xl transition-all duration-300 hover:shadow-lg hover:shadow-pink-200"
          >
            {t("carrito.enviarPedido")}
          </button>
        </div>
      </aside>
    </div>
  );
}
