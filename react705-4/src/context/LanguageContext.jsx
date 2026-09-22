import { createContext, useContext, useState } from "react";
import translations from "../i18n/translations";

const LanguageContext = createContext();

export function LanguageProvider({ children }) {
  const [idioma, setIdioma] = useState("es");

  const cambiarIdioma = () => {
    setIdioma((actual) => (actual === "es" ? "en" : "es"));
  };

  // t("carrito.total") -> busca dentro de translations[idioma] la clave
  // "carrito" y luego "total". Así organizamos los textos por sección.
  const t = (clave) => {
    const partes = clave.split(".");
    let valor = translations[idioma];

    for (const parte of partes) {
      valor = valor?.[parte];
    }

    // si por algún motivo la clave no existe, devolvemos la clave misma
    // para que sea fácil detectar el error en pantalla
    return valor ?? clave;
  };

  return (
    <LanguageContext.Provider value={{ idioma, cambiarIdioma, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}
