import { ShoppingCart } from "lucide-react";
import { useCart } from "../../context/CartContext";

export default function CartButton() {
  const { totalItems, setAbierto } = useCart();

  return (
    <button
      onClick={() => setAbierto(true)}
      className="relative p-2 rounded-full text-slate-200 hover:bg-white/10 hover:text-pink-300 hover:scale-110 transition-all duration-300"
      title="Ver carrito"
    >
      <ShoppingCart size={22} />
      {totalItems > 0 && (
        <span className="absolute -top-1 -right-1 bg-pink-400 text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center ring-2 ring-slate-900">
          {totalItems}
        </span>
      )}
    </button>
  );
}
