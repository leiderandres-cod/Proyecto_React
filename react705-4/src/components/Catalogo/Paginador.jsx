import { ChevronLeft, ChevronRight } from "lucide-react";
import { useLanguage } from "../../context/LanguageContext";

// Componente simple de paginación: botón anterior, números de página, botón siguiente
export default function Paginador({ paginaActual, totalPaginas, onCambiarPagina }) {
  const { t } = useLanguage();

  if (totalPaginas <= 1) return null; // si hay 1 sola página, no mostramos nada

  const paginas = Array.from({ length: totalPaginas }, (_, i) => i + 1);

  return (
    <div className="mt-10 flex items-center justify-center gap-2">
      <button
        type="button"
        disabled={paginaActual === 1}
        onClick={() => onCambiarPagina(paginaActual - 1)}
        className="p-2 rounded-lg bg-white dark:bg-slate-800 ring-1 ring-purple-200 dark:ring-slate-700 text-slate-500 dark:text-slate-300 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-pink-100 dark:hover:bg-slate-700 transition-colors duration-300"
        title={t("catalogo.anterior")}
      >
        <ChevronLeft size={18} />
      </button>

      {paginas.map((numero) => (
        <button
          key={numero}
          type="button"
          onClick={() => onCambiarPagina(numero)}
          className={`w-9 h-9 rounded-lg text-sm font-semibold transition-all duration-300 ${
            numero === paginaActual
              ? "bg-pink-400 text-white shadow-md shadow-pink-200"
              : "bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 ring-1 ring-purple-200 dark:ring-slate-700 hover:bg-pink-100 dark:hover:bg-slate-700"
          }`}
        >
          {numero}
        </button>
      ))}

      <button
        type="button"
        disabled={paginaActual === totalPaginas}
        onClick={() => onCambiarPagina(paginaActual + 1)}
        className="p-2 rounded-lg bg-white dark:bg-slate-800 ring-1 ring-purple-200 dark:ring-slate-700 text-slate-500 dark:text-slate-300 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-pink-100 dark:hover:bg-slate-700 transition-colors duration-300"
        title={t("catalogo.siguiente")}
      >
        <ChevronRight size={18} />
      </button>
    </div>
  );
}
