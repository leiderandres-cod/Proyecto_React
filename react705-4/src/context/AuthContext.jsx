import { createContext, useContext, useState } from "react";
import Swal from "sweetalert2";
import { useLanguage } from "./LanguageContext";

const AuthContext = createContext(null);
const CLAVE_STORAGE = "react705_usuario";

// Este login es "simulado": no hay backend real, pero sí persiste
// el perfil en localStorage para que la sesión sobreviva a un refresh.
// Sirve para practicar el flujo de login / verificar perfil / logout.
export function AuthProvider({ children }) {
  const { t } = useLanguage();

  const [usuario, setUsuario] = useState(() => {
    try {
      const guardado = localStorage.getItem(CLAVE_STORAGE);
      return guardado ? JSON.parse(guardado) : null;
    } catch {
      return null;
    }
  });

  function iniciarSesion({ nombre, correo }) {
    const perfil = {
      nombre,
      correo,
      fechaIngreso: new Date().toLocaleString("es-CO"),
    };
    setUsuario(perfil);
    localStorage.setItem(CLAVE_STORAGE, JSON.stringify(perfil));

    Swal.fire({
      icon: "success",
      title: `${t("login.bienvenida")} ${nombre}!`,
      timer: 1400,
      showConfirmButton: false,
      customClass: { popup: "rounded-2xl" },
    });
  }

  function cerrarSesion() {
    setUsuario(null);
    localStorage.removeItem(CLAVE_STORAGE);
  }

  const value = {
    usuario,
    estaAutenticado: !!usuario,
    iniciarSesion,
    cerrarSesion,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth debe usarse dentro de un <AuthProvider>");
  }
  return context;
}
