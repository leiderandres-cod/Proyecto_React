import hero from "../assets/hero.png";
import reactLogo from "../assets/React_Router.webp";
import viteLogo from "../assets/vite_img.jfif";
import reactRouterLogo from "../assets/react.png";
import tailwindLogo from "../assets/Tailwind_CSS.webp";
import { useLanguage } from "../context/LanguageContext";

function Inicio() {
  const { t } = useLanguage();

  const tecnologias = [
    { nombre: "React", descripcion: t("inicio.reactDesc"), imagen: reactLogo },
    { nombre: "Vite", descripcion: t("inicio.viteDesc"), imagen: viteLogo },
    { nombre: "Tailwind CSS", descripcion: t("inicio.tailwindDesc"), imagen: tailwindLogo },
    { nombre: "React Router", descripcion: t("inicio.routerDesc"), imagen: reactRouterLogo },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 transition-colors">
      <section className="bg-gradient-to-r from-slate-900 via-purple-900 to-slate-900 text-white">
        <div className="max-w-6xl mx-auto px-6 py-20">
          <div className="flex flex-col items-center text-center">
            <img
              src={hero}
              alt="React705"
              className="w-40 h-40 object-contain mb-8"
            />
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              {t("inicio.titulo")}
            </h1>
            <p className="max-w-3xl text-lg md:text-xl text-slate-300 mb-8">
              {t("inicio.parrafo1")}
            </p>
            <p className="max-w-3xl text-slate-400 mb-8">
              {t("inicio.parrafo2")}
            </p>
            <button
              className="
                bg-pink-400
                hover:bg-pink-500
                hover:scale-105
                hover:shadow-lg
                hover:shadow-pink-300/40
                text-white
                font-semibold
                px-8
                py-3
                rounded-lg
                transition-all
                duration-300
              "
            >
              {t("inicio.boton")}
            </button>
          </div>
        </div>
      </section>

      {/* TECNOLOGÍAS */}
      <section className="max-w-6xl mx-auto px-6 py-16">
        <h2 className="text-3xl md:text-4xl font-bold text-center text-slate-800 dark:text-slate-100 mb-4">
          {t("inicio.tecnologiasTitulo")}
        </h2>
        <p className="text-center text-slate-600 dark:text-slate-400 max-w-2xl mx-auto mb-12">
          {t("inicio.tecnologiasSubtitulo")}
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {tecnologias.map((tecnologia) => (
            <div
              key={tecnologia.nombre}
              className="
                bg-white
                dark:bg-slate-800
                rounded-2xl
                shadow-md
                ring-1
                ring-purple-100
                dark:ring-slate-700
                p-6
                text-center
                hover:-translate-y-2
                hover:shadow-xl
                hover:shadow-purple-100
                dark:hover:shadow-none
                hover:ring-pink-200
                transition-all
                duration-300
              "
            >
              <div className="h-24 flex items-center justify-center mb-5">
                <img
                  src={tecnologia.imagen}
                  alt={tecnologia.nombre}
                  className="max-h-16 max-w-full w-auto object-contain"
                />
              </div>
              <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-3">
                {tecnologia.nombre}
              </h3>
              <p className="text-slate-600 dark:text-slate-400 text-sm">
                {tecnologia.descripcion}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* APRENDIZAJE */}
      <section className="bg-slate-100 dark:bg-slate-900 transition-colors">
        <div className="max-w-6xl mx-auto px-6 py-16">
          <h2 className="text-3xl font-bold text-center text-slate-800 dark:text-slate-100 mb-12">
            {t("inicio.aprenderemosTitulo")}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow">
              <h3 className="font-bold text-xl mb-2 text-slate-800 dark:text-slate-100">
                {t("inicio.componentesTitulo")}
              </h3>
              <p className="text-slate-600 dark:text-slate-400">
                {t("inicio.componentesTexto")}
              </p>
            </div>

            <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow">
              <h3 className="font-bold text-xl mb-2 text-slate-800 dark:text-slate-100">
                {t("inicio.navegacionTitulo")}
              </h3>
              <p className="text-slate-600 dark:text-slate-400">
                {t("inicio.navegacionTexto")}
              </p>
            </div>

            <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow">
              <h3 className="font-bold text-xl mb-2 text-slate-800 dark:text-slate-100">
                {t("inicio.apisTitulo")}
              </h3>
              <p className="text-slate-600 dark:text-slate-400">
                {t("inicio.apisTexto")}
              </p>
            </div>

            <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow">
              <h3 className="font-bold text-xl mb-2 text-slate-800 dark:text-slate-100">
                {t("inicio.tailwindTitulo")}
              </h3>
              <p className="text-slate-600 dark:text-slate-400">
                {t("inicio.tailwindTexto")}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-slate-900 text-slate-400 text-center py-8">
        <p>{t("inicio.footer")}</p>
      </footer>
    </div>
  );
}

export default Inicio;
