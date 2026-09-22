import { useState, useEffect } from "react";
import { obtenerCocteles } from "../services/cocktailApi";

// Rango de precio: entre 15.000 y 60.000 pesos
const RANGO_PRECIO = { min: 15000, max: 60000 };

function precioAleatorio() {
  return (
    Math.floor(Math.random() * (RANGO_PRECIO.max - RANGO_PRECIO.min + 1)) +
    RANGO_PRECIO.min
  );
}

// Hook personalizado que trae los cócteles de TheCocktailDB para el catálogo
export function useCocteles(limit = 12) {
  const [cocteles, setCocteles] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let activo = true;

    async function cargarCocteles() {
      try {
        setCargando(true);
        setError(null);

        const resultados = await obtenerCocteles(limit);

        // le agregamos el precio a cada cóctel (la API no maneja precios)
        const lista = resultados.map((coctel) => ({
          ...coctel,
          precio: precioAleatorio(),
        }));

        if (activo) setCocteles(lista);
      } catch (err) {
        if (activo) setError(err.message);
      } finally {
        if (activo) setCargando(false);
      }
    }

    cargarCocteles();

    return () => {
      activo = false;
    };
  }, [limit]);

  return { cocteles, cargando, error };
}
