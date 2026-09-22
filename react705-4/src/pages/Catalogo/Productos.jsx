import { useState, useEffect, useCallback } from "react";
import { Search } from "lucide-react";
// Hook que trae el catálogo inicial de TheCocktailDB
import { useCocteles } from "../../hooks/useCocteles";
// Búsqueda puntual por nombre (usa /search.php?s=)
import { buscarCoctelesPorNombre } from "../../services/cocktailApi";
// Componente visual que dibuja cada tarjeta
import CocktailCard from "../../components/Catalogo/CocktailCard";
// Componente interno que muestra el detalle de un producto
import ProductDetail from "../../components/Catalogo/ProductDetail";
import Paginador from "../../components/Catalogo/Paginador";
import { useLanguage } from "../../context/LanguageContext";

const PRODUCTOS_POR_PAGINA = 8;

function Productos() {
  const { t } = useLanguage();
  // Traemos 24 cócteles para que el paginador tenga varias páginas
  const { cocteles, cargando, error } = useCocteles(24);
  const [productoSeleccionado, setProductoSeleccionado] = useState(null);

  // Estado para la búsqueda por nombre (ej: "margarita")
  const [termino, setTermino] = useState("");
  const [resultadosBusqueda, setResultadosBusqueda] = useState(null);
  const [buscando, setBuscando] = useState(false);

  // Estado del paginador: en qué página estamos
  const [paginaActual, setPaginaActual] = useState(1);

  async function manejarBusqueda(e) {
    e.preventDefault();
    if (!termino.trim()) {
      setResultadosBusqueda(null);
      return;
    }

    try {
      setBuscando(true);
      const resultados = await buscarCoctelesPorNombre(termino.trim());
      // le damos precio a los resultados de la búsqueda también
      const conPrecio = resultados.map((c) => ({
        ...c,
        precio:
          Math.floor(Math.random() * (60000 - 15000 + 1)) + 15000,
      }));
      setResultadosBusqueda(conPrecio);
    } catch {
      setResultadosBusqueda([]);
    } finally {
      setBuscando(false);
    }
  }

  function limpiarBusqueda() {
    setTermino("");
    setResultadosBusqueda(null);
  }

  // Si hay una búsqueda activa, mostramos esos resultados; si no, el catálogo normal
  const listaAMostrar = resultadosBusqueda ?? cocteles;

  // Cada vez que cambia la lista (nueva búsqueda, o carga el catálogo),
  // volvemos a la página 1 para no quedar "perdidos" en una página vacía
  useEffect(() => {
    setPaginaActual(1);
  }, [resultadosBusqueda, cocteles]);

  // useCallback: esta función se la pasamos al <Paginador />, así que
  // conviene que no se vuelva a crear en cada render de Productos
  const cambiarPagina = useCallback((numero) => {
    setPaginaActual(numero);
    // subimos el scroll al inicio de la grilla al cambiar de página
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  // Recortamos la lista completa para mostrar solo la página actual
  const totalPaginas = Math.ceil(listaAMostrar.length / PRODUCTOS_POR_PAGINA);
  const inicio = (paginaActual - 1) * PRODUCTOS_POR_PAGINA;
  const productosDeLaPagina = listaAMostrar.slice(inicio, inicio + PRODUCTOS_POR_PAGINA);

  return (
    <section className="bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 min-h-screen px-6 py-10 transition-colors">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold text-slate-800 dark:text-slate-100">{t("catalogo.titulo")}</h2>
        <p className="text-slate-500 dark:text-slate-400 mt-2">
          {t("catalogo.subtitulo")}
        </p>

        {/* Buscador por nombre */}
        <form onSubmit={manejarBusqueda} className="mt-6 flex gap-2 max-w-md">
          <input
            value={termino}
            onChange={(e) => setTermino(e.target.value)}
            placeholder={t("catalogo.buscarPlaceholder")}
            className="flex-1 rounded-xl ring-1 ring-purple-200 dark:ring-slate-700 bg-white dark:bg-slate-800 px-4 py-2.5 text-sm text-slate-700 dark:text-slate-200 focus:ring-2 focus:ring-pink-300 outline-none transition-all duration-300"
          />
          <button
            type="submit"
            className="inline-flex items-center gap-2 bg-pink-400 hover:bg-pink-500 hover:scale-105 text-white font-semibold px-4 py-2.5 rounded-xl transition-all duration-300"
          >
            <Search size={16} /> {t("catalogo.buscar")}
          </button>
          {resultadosBusqueda && (
            <button
              type="button"
              onClick={limpiarBusqueda}
              className="px-4 py-2.5 rounded-xl text-slate-500 dark:text-slate-400 hover:bg-white dark:hover:bg-slate-800 hover:text-rose-500 transition-all duration-300"
            >
              {t("catalogo.limpiar")}
            </button>
          )}
        </form>

        {/* Mientras se cargan los datos */}
        {(cargando || buscando) && (
          <p className="mt-10 text-center text-slate-400 dark:text-slate-500">
            {buscando ? t("catalogo.buscando") : t("catalogo.cargando")}
          </p>
        )}

        {/* Si algo salió mal */}
        {error && !buscando && (
          <div className="mt-10 mx-auto max-w-xl text-center bg-rose-50 dark:bg-rose-950/40 ring-1 ring-rose-200 dark:ring-rose-800 text-rose-500 rounded-2xl p-6">
            <p className="font-semibold">{t("catalogo.errorTitulo")}</p>
            <p className="text-sm mt-2">{error}</p>
          </div>
        )}

        {/* Sin resultados de búsqueda */}
        {resultadosBusqueda?.length === 0 && !buscando && (
          <p className="mt-10 text-center text-slate-400 dark:text-slate-500">
            {t("catalogo.sinResultados")} "{termino}".
          </p>
        )}

        {/* Grilla de productos: solo los de la página actual */}
        {!cargando && !buscando && !error && productosDeLaPagina.length > 0 && (
          <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {productosDeLaPagina.map((coctel) => (
              <CocktailCard
                key={coctel.id}
                coctel={coctel}
                onVerDetalle={setProductoSeleccionado}
              />
            ))}
          </div>
        )}

        {/* Paginador */}
        {!cargando && !buscando && !error && (
          <Paginador
            paginaActual={paginaActual}
            totalPaginas={totalPaginas}
            onCambiarPagina={cambiarPagina}
          />
        )}
      </div>

      {/* Modal con el detalle del producto seleccionado */}
      {productoSeleccionado && (
        <ProductDetail
          producto={productoSeleccionado}
          onCerrar={() => setProductoSeleccionado(null)}
        />
      )}
    </section>
  );
}

export default Productos;
