import Tortuga from "./Tortuga";
import BotonDerecha from "./BotonDerecha";
import BotonIzquierda from "./BotonIzquierda";
import BotonInicio from "./BotonInicio";
import { useState } from "react";

function Escenario() {
  const [posicion, setPosicion] = useState(0);

  function moverDerecha() {
    setPosicion((prev) => (prev >= 225 ? 230 : prev + 5));
  }

  function moverIzquierda() {
    setPosicion((prev) => (prev <= -225 ? -230 : prev - 5));
  }

  function moverInicio() {
    setPosicion(0);
  }

  return (
    <section className="mx-auto flex max-w-2xl flex-col items-center gap-6 px-6 py-10 text-center">
      <h2 className="text-3xl font-bold text-slate-900 dark:text-slate-100">Carrera de la Tortuga</h2>

      {/* Pista */}
      <div className="relative w-full overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-700 bg-gradient-to-b from-emerald-50 to-emerald-100 dark:from-emerald-950 dark:to-slate-900 p-8 shadow-lg">
        <div className="absolute inset-x-0 top-1/2 h-1 -translate-y-1/2 bg-[repeating-linear-gradient(90deg,#94a3b8_0_16px,transparent_16px_32px)] opacity-60" />
        <Tortuga posicion={posicion} />
      </div>

      {/* Controles */}
      <div className="flex items-center gap-3">
        <BotonIzquierda mover={moverIzquierda} />
        <BotonInicio mover={moverInicio} />
        <BotonDerecha mover={moverDerecha} />
      </div>

      {/* Indicador de posición */}
      <p className="rounded-full bg-slate-900 dark:bg-slate-700 px-4 py-2 text-sm font-medium text-white">
        La posición de Tortuguín es{" "}
        <span className="font-bold text-cyan-400">{posicion}</span>
      </p>
    </section>
  );
}

export default Escenario;
