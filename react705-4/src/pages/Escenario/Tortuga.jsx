function Tortuga({ posicion }) {
  return (
    <div
      className="relative mx-auto flex h-24 w-24 items-center justify-center transition-transform duration-150 ease-out"
      style={{ transform: `translateX(${posicion}px)` }}
    >
      {/* sombra debajo de la tortuga */}
      <span className="absolute -bottom-1 h-3 w-16 rounded-full bg-black/20 blur-sm" />
      <span className="text-6xl drop-shadow-lg">🐢</span>
    </div>
  );
}

export default Tortuga;
