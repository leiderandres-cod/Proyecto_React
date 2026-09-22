import { RotateCcw } from "lucide-react";

function BotonInicio({ mover }) {
  return (
    <button
      onClick={mover}
      className="flex items-center gap-2 rounded-lg bg-cyan-500 px-4 py-2 text-sm font-semibold text-white transition duration-300 hover:bg-cyan-600"
    >
      <RotateCcw size={16} />
      Inicio
    </button>
  );
}

export default BotonInicio;
