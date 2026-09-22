import { useState } from "react";
import { useForm } from "react-hook-form";
import { X, User, LogOut } from "lucide-react";
import Swal from "sweetalert2";
import { useAuth } from "../../context/AuthContext";
import { useLanguage } from "../../context/LanguageContext";

// Modal con el formulario de inicio de sesión (simulado)
function LoginModal({ onCerrar }) {
  const { iniciarSesion } = useAuth();
  const { t } = useLanguage();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  function onSubmit(datos) {
    iniciarSesion(datos);
    onCerrar();
  }

  return (
    <div
      className="fixed inset-0 z-[80] flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4"
      onClick={onCerrar}
    >
      <div
        className="relative w-full max-w-sm bg-white dark:bg-slate-800 rounded-3xl shadow-2xl p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onCerrar}
          className="absolute top-3 right-3 p-2 rounded-full text-slate-400 dark:text-slate-500 hover:bg-rose-100 dark:hover:bg-rose-950/40 hover:text-rose-500 transition-colors duration-300"
        >
          <X size={18} />
        </button>

        <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-1">{t("login.iniciarSesion")}</h3>
        <p className="text-sm text-slate-500 dark:text-slate-400 mb-5">
          {t("login.subtitulo")}
        </p>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="text-sm font-medium text-slate-600 dark:text-slate-300">{t("login.nombre")}</label>
            <input
              {...register("nombre", { required: t("login.nombreObligatorio") })}
              className="mt-1 w-full rounded-xl ring-1 ring-slate-200 dark:ring-slate-600 bg-white dark:bg-slate-900 px-3 py-2.5 text-sm text-slate-700 dark:text-slate-200 focus:ring-2 focus:ring-pink-300 outline-none transition-all duration-300"
              placeholder={t("login.nombrePlaceholder")}
            />
            {errors.nombre && (
              <p className="text-xs text-rose-500 mt-1">{errors.nombre.message}</p>
            )}
          </div>

          <div>
            <label className="text-sm font-medium text-slate-600 dark:text-slate-300">{t("login.correo")}</label>
            <input
              type="email"
              {...register("correo", {
                required: t("login.correoObligatorio"),
                pattern: { value: /^\S+@\S+$/, message: t("login.correoInvalido") },
              })}
              className="mt-1 w-full rounded-xl ring-1 ring-slate-200 dark:ring-slate-600 bg-white dark:bg-slate-900 px-3 py-2.5 text-sm text-slate-700 dark:text-slate-200 focus:ring-2 focus:ring-pink-300 outline-none transition-all duration-300"
              placeholder={t("login.correoPlaceholder")}
            />
            {errors.correo && (
              <p className="text-xs text-rose-500 mt-1">{errors.correo.message}</p>
            )}
          </div>

          <button
            type="submit"
            className="w-full bg-pink-400 hover:bg-pink-500 hover:shadow-lg hover:shadow-pink-200 text-white font-semibold py-2.5 rounded-xl transition-all duration-300"
          >
            {t("login.entrar")}
          </button>
        </form>
      </div>
    </div>
  );
}

// Modal para "Verificar perfil": muestra los datos del usuario logueado
function ProfileModal({ onCerrar }) {
  const { usuario, cerrarSesion } = useAuth();
  const { t } = useLanguage();

  // Antes de cerrar sesión, preguntamos si está seguro (lo pide el reto)
  async function manejarSalir() {
    const confirmacion = await Swal.fire({
      icon: "question",
      title: t("login.confirmarSalirTitulo"),
      text: t("login.confirmarSalirTexto"),
      showCancelButton: true,
      confirmButtonText: t("login.confirmarSalirSi"),
      cancelButtonText: t("login.confirmarSalirNo"),
      customClass: {
        popup: "rounded-2xl",
        confirmButton:
          "bg-rose-400 hover:bg-rose-500 text-white rounded-xl px-5 py-2 mx-2",
        cancelButton:
          "bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-xl px-5 py-2 mx-2",
      },
      buttonsStyling: false,
    });

    if (!confirmacion.isConfirmed) return; // canceló, no hacemos nada

    // Al confirmar: cerramos sesión y el Header vuelve a mostrarse
    // como antes de loguearse (porque estaAutenticado pasa a false)
    cerrarSesion();
    onCerrar();
  }

  return (
    <div
      className="fixed inset-0 z-[80] flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4"
      onClick={onCerrar}
    >
      <div
        className="relative w-full max-w-sm bg-white dark:bg-slate-800 rounded-3xl shadow-2xl p-6 text-center"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onCerrar}
          className="absolute top-3 right-3 p-2 rounded-full text-slate-400 dark:text-slate-500 hover:bg-rose-100 dark:hover:bg-rose-950/40 hover:text-rose-500 transition-colors duration-300"
        >
          <X size={18} />
        </button>

        <div className="mx-auto w-16 h-16 rounded-full bg-gradient-to-br from-pink-200 to-purple-200 flex items-center justify-center text-purple-600 font-bold text-2xl mb-4">
          {usuario.nombre.charAt(0).toUpperCase()}
        </div>

        <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100">{usuario.nombre}</h3>
        <p className="text-sm text-slate-500 dark:text-slate-400">{usuario.correo}</p>
        <p className="text-xs text-slate-400 dark:text-slate-500 mt-2">
          {t("login.sesionIniciada")} {usuario.fechaIngreso}
        </p>

        <button
          onClick={manejarSalir}
          className="mt-6 w-full inline-flex items-center justify-center gap-2 bg-rose-50 dark:bg-rose-950/40 hover:bg-rose-100 dark:hover:bg-rose-950/70 text-rose-500 font-semibold py-2.5 rounded-xl transition-all duration-300"
        >
          <LogOut size={16} /> {t("login.cerrarSesion")}
        </button>
      </div>
    </div>
  );
}

function Login() {
  const { estaAutenticado, usuario } = useAuth();
  const { t } = useLanguage();
  const [modalAbierto, setModalAbierto] = useState(false);

  if (estaAutenticado) {
    return (
      <>
        <button
          onClick={() => setModalAbierto(true)}
          className="flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white font-medium px-4 py-2 rounded-lg text-sm transition-all duration-300 hover:scale-105"
        >
          <User size={16} className="text-pink-300" />
          {usuario.nombre.split(" ")[0]}
        </button>
        {modalAbierto && <ProfileModal onCerrar={() => setModalAbierto(false)} />}
      </>
    );
  }

  return (
    <>
      <button
        onClick={() => setModalAbierto(true)}
        className="bg-pink-400 hover:bg-pink-500 hover:shadow-lg hover:shadow-pink-300/50 text-white font-semibold px-5 py-2 rounded-lg text-sm transition-all duration-300 hover:scale-105"
      >
        {t("login.iniciarSesion")}
      </button>
      {modalAbierto && <LoginModal onCerrar={() => setModalAbierto(false)} />}
    </>
  );
}

export default Login;
