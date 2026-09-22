import { createContext, useContext, useEffect, useState, useCallback } from "react";
import Swal from "sweetalert2";
import { useLanguage } from "./LanguageContext";

const CartContext = createContext(null);
const CLAVE_STORAGE = "react705_carrito"; // esta es la "variable carrito" en LocalStorage
const IVA = 0.19; // 19%, IVA de Colombia

export function CartProvider({ children }) {
  const { t } = useLanguage();

  // Leemos el carrito guardado en LocalStorage cuando arranca la app
  const [items, setItems] = useState(() => {
    try {
      const guardado = localStorage.getItem(CLAVE_STORAGE);
      return guardado ? JSON.parse(guardado) : [];
    } catch {
      return [];
    }
  });

  const [abierto, setAbierto] = useState(false);

  // Cada vez que "items" cambia, lo volvemos a guardar en LocalStorage.
  // Si items queda como [], esto guarda un arreglo vacío (requisito "g" del reto).
  useEffect(() => {
    localStorage.setItem(CLAVE_STORAGE, JSON.stringify(items));
  }, [items]);

  // useCallback: evita que esta función se vuelva a crear en cada render.
  // Como se la pasamos a muchos componentes (tarjetas, detalle), conviene
  // que React no tenga que recrearla todo el tiempo.
  const agregarAlCarrito = useCallback(
    (producto, cantidad = 1) => {
      setItems((prev) => {
        const existente = prev.find((item) => item.id === producto.id);

        if (existente) {
          return prev.map((item) =>
            item.id === producto.id
              ? { ...item, cantidad: item.cantidad + cantidad }
              : item
          );
        }

        return [...prev, { ...producto, cantidad }];
      });

      Swal.fire({
        icon: "success",
        title: t("carrito.agregado"),
        text: `${producto.name} ${t("carrito.agregadoTexto")}`,
        timer: 1400,
        showConfirmButton: false,
        customClass: { popup: "rounded-2xl" },
      });
    },
    [t]
  );

  const quitarDelCarrito = useCallback((id) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  }, []);

  const cambiarCantidad = useCallback((id, cantidad) => {
    if (cantidad < 1) return; // no dejamos bajar de 1
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, cantidad } : item))
    );
  }, []);

  const vaciarCarrito = useCallback(() => {
    setItems([]);
  }, []);

  // Envía el pedido. Primero pide confirmación, luego "envía" (simulado)
  // y al final muestra éxito o error.
  const enviarPedido = useCallback(async () => {
    if (items.length === 0) return;

    // 1. Pedimos confirmación antes de hacer cualquier cosa (requisito "e")
    const confirmacion = await Swal.fire({
      icon: "question",
      title: t("carrito.confirmarTitulo"),
      text: t("carrito.confirmarTexto"),
      showCancelButton: true,
      confirmButtonText: t("carrito.confirmarSi"),
      cancelButtonText: t("carrito.confirmarNo"),
      customClass: {
        popup: "rounded-2xl",
        confirmButton:
          "bg-pink-400 hover:bg-pink-500 text-white rounded-xl px-5 py-2 mx-2",
        cancelButton:
          "bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-xl px-5 py-2 mx-2",
      },
      buttonsStyling: false,
    });

    if (!confirmacion.isConfirmed) return; // el usuario canceló, no hacemos nada más

    try {
      // 2. Simulamos el "envío" del pedido (aquí en un caso real iría un fetch a un backend)
      await new Promise((resolve, reject) => {
        setTimeout(() => {
          // 15% de probabilidad de simular un error, solo para poder
          // demostrar el mensaje de error que pide el reto
          const falloSimulado = Math.random() < 0.15;
          falloSimulado ? reject(new Error("fallo simulado")) : resolve();
        }, 700);
      });

      // 3a. Éxito: mostramos el mensaje y vaciamos el carrito + LocalStorage
      await Swal.fire({
        icon: "success",
        title: t("carrito.exitoTitulo"),
        text: t("carrito.exitoTexto"),
        confirmButtonText: t("carrito.exitoBoton"),
        customClass: {
          popup: "rounded-2xl",
          confirmButton:
            "bg-pink-400 hover:bg-pink-500 text-white rounded-xl px-5 py-2",
        },
        buttonsStyling: false,
      });

      vaciarCarrito();
      setAbierto(false);
    } catch {
      // 3b. Error: avisamos y dejamos el carrito intacto para que reintente
      Swal.fire({
        icon: "error",
        title: t("carrito.errorTitulo"),
        text: t("carrito.errorTexto"),
        customClass: { popup: "rounded-2xl" },
      });
    }
  }, [items, t, vaciarCarrito]);

  // Subtotal (sin IVA), IVA y Total a pagar
  const totalItems = items.reduce((acc, item) => acc + item.cantidad, 0);
  const subtotal = items.reduce((acc, item) => acc + item.cantidad * item.precio, 0);
  const valorIva = subtotal * IVA;
  const totalPagar = subtotal - valorIva;

  const value = {
    items,
    abierto,
    setAbierto,
    agregarAlCarrito,
    quitarDelCarrito,
    cambiarCantidad,
    vaciarCarrito,
    enviarPedido,
    totalItems,
    subtotal,
    valorIva,
    totalPagar,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

// Hook para consumir el carrito desde cualquier componente
export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart debe usarse dentro de un <CartProvider>");
  }
  return context;
}
