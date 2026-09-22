import { ArrowLeft } from "lucide-react";

function BotonIzquierda({ mover }) {
  return (
    <button
      onClick={mover}
      className="flex items-center gap-2 rounded-lg bg-slate-800 px-4 py-2 text-sm font-semibold text-white transition duration-300 hover:bg-slate-700"
    >
      <ArrowLeft size={16} />
      Izquierda
    </button>
  );
}

export default BotonIzquierda;
