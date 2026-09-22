import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import Swal from "sweetalert2";

import FormInput from "./componentes/FormInput";
import FormSelect from "./componentes/FormSelect";
import FormArea from "./componentes/FormArea";
import FormFile from "./componentes/FormFile";
import { generos, paises, ciudades } from "./paises";


function ContactoForm() {
  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    mode: "onBlur", // valida cada campo cuando pierde el foco, no solo al enviar
    defaultValues: {
      primerNombre: "",
      segundoNombre: "",
      primerApellido: "",
      segundoApellido: "",
      genero: "",
      pais: "",
      ciudad: "",
      correo: "",
      telefono: "",
      mensaje: "",
      archivo: [],
    },
  });

  const [enviando, setEnviando] = useState(false);

  // a. Función onSubmit asíncrona: recoge los datos, arma el FormData
  // y los envía a Formspree usando fetch (react-hook-form solo valida).
  const onSubmit = async (data) => {
    setEnviando(true);

    // b. y c. Creamos el FormData y lo llenamos con los datos del formulario,
    // manejando el caso especial del campo "archivo" (lista de files).
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      if (key === "archivo") {
        value.forEach((file) => formData.append("archivo", file));
      } else {
        formData.append(key, value);
      }
    });

    try {
      // d. Petición POST a Formspree usando la variable de entorno del .env
      const response = await fetch(import.meta.env.VITE_FORMSPREE_ENDPOINT, {
        method: "POST",
        body: formData,
        headers: { Accept: "application/json" },
      });

      if (response.ok) {
        // e. Todo salió bien
        console.log("Datos del formulario:", data);
        Swal.fire({
          icon: "success",
          title: "¡Mensaje enviado!",
          text: "Tu mensaje fue enviado correctamente",
          confirmButtonColor: "#0ea5e9",
        });
        reset();
      } else {
        // e. Formspree respondió con error
        const resultado = await response.json();
        const mensajeError = resultado.errors
          ? resultado.errors.map((e) => e.message).join(", ")
          : "Ocurrió un error al enviar el formulario";

        Swal.fire({
          icon: "error",
          title: "No se pudo enviar",
          text: mensajeError,
          confirmButtonColor: "#0ea5e9",
        });
      }
    } catch (error) {
      // f. Error de red
      console.error("Error de red al enviar el formulario:", error);
      Swal.fire({
        icon: "error",
        title: "No se pudo enviar",
        text: "Revisa tu conexión a internet e intenta de nuevo.",
        confirmButtonColor: "#0ea5e9",
      });
    } finally {
      // g. Siempre dejamos el estado de envío en false al terminar
      setEnviando(false);
    }
  };

  // Se ejecuta cuando handleSubmit detecta campos inválidos
  const onError = () => {
    Swal.fire({
      icon: "warning",
      title: "Campos incompletos",
      text: "Revisa los campos marcados en rojo antes de enviar.",
      confirmButtonColor: "#0ea5e9",
    });
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit, onError)}
      className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl shadow-indigo-950/10 dark:shadow-none hover:shadow-2xl hover:shadow-violet-400/20 dark:hover:shadow-none transition-shadow duration-500 p-8 md:p-10 flex flex-col gap-8 border border-violet-100 dark:border-slate-700"
    >
      {/* Datos personales */}
      <div>
        <h3 className="text-lg font-bold text-indigo-950 dark:text-slate-100 mb-4 pb-2 border-b border-violet-200 dark:border-slate-700">
          Datos personales
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <FormInput
            label="Primer Nombre"
            placeholder="Escribe tu primer nombre"
            required
            error={errors.primerNombre?.message}
            {...register("primerNombre", {
              required: "El primer nombre es obligatorio",
            })}
          />

          <FormInput
            label="Segundo Nombre"
            placeholder="Escribe tu segundo nombre"
            {...register("segundoNombre")}
          />

          <FormInput
            label="Primer Apellido"
            placeholder="Escribe tu primer apellido"
            required
            error={errors.primerApellido?.message}
            {...register("primerApellido", {
              required: "El primer apellido es obligatorio",
            })}
          />

          <FormInput
            label="Segundo Apellido"
            placeholder="Escribe tu segundo apellido"
            {...register("segundoApellido")}
          />

          <FormSelect
            label="Género"
            options={generos}
            required
            error={errors.genero?.message}
            {...register("genero", {
              required: "Selecciona un género",
            })}
          />

          <FormSelect
            label="País"
            options={paises}
            required
            error={errors.pais?.message}
            {...register("pais", {
              required: "Selecciona un país",
            })}
          />

          <FormSelect
            label="Ciudad"
            options={ciudades}
            required
            error={errors.ciudad?.message}
            {...register("ciudad", {
              required: "Selecciona una ciudad",
            })}
          />
        </div>
      </div>

      {/* Datos de contacto */}
      <div>
        <h3 className="text-lg font-bold text-indigo-950 dark:text-slate-100 mb-4 pb-2 border-b border-violet-200 dark:border-slate-700">
          Datos de contacto
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <FormInput
            label="Correo"
            type="email"
            placeholder="ejemplo@correo.com"
            required
            error={errors.correo?.message}
            {...register("correo", {
              required: "El correo es obligatorio",
              pattern: {
                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                message: "Ingresa un correo válido",
              },
            })}
          />

          <FormInput
            label="Teléfono"
            type="tel"
            placeholder="300 000 0000"
            required
            error={errors.telefono?.message}
            {...register("telefono", {
              required: "El teléfono es obligatorio",
            })}
          />
        </div>
      </div>

      {/* Mensaje */}
      <div>
        <h3 className="text-lg font-bold text-indigo-950 dark:text-slate-100 mb-4 pb-2 border-b border-violet-200 dark:border-slate-700">
          Cuéntame más
        </h3>
        <div className="flex flex-col gap-5">
          <FormArea
            label="Mensaje"
            placeholder="Escribe tu mensaje aquí..."
            required
            error={errors.mensaje?.message}
            {...register("mensaje", {
              required: "El mensaje es obligatorio",
            })}
          />

          <Controller
            name="archivo"
            control={control} // 👈 viene de useForm(), es el "cerebro" que conecta todo
            render={({ field }) => ( // 👈 aquí renderizamos FormFile, y "field" trae lo necesario para conectarlo
              <FormFile
                label="Adjuntar archivo"
                name="archivo"
                accept={{
                  //"application/pdf": [".pdf"],
                  "image/png": [".png"],
                  "image/jpeg": [".jpg", ".jpeg"],
                  "image/webp": [".webp"],
                }}
                onFilesChange={field.onChange} // 👈 el puente hacia react-hook-form
                error={errors.archivo?.message}
              />
            )}
          />
        </div>
      </div>

      {/* Botón */}
      <div className="flex flex-col items-center gap-3">
        <button
          type="submit"
          disabled={enviando}
          className="bg-gradient-to-r from-indigo-600 to-fuchsia-500 hover:from-indigo-700 hover:to-fuchsia-600 text-white font-semibold px-8 py-3.5 rounded-lg transition duration-300 hover:shadow-lg hover:shadow-fuchsia-500/30 hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:translate-y-0"
        >
          {enviando ? "Enviando..." : "Enviar mensaje"}
        </button>
      </div>
    </form>
  );
}

export default ContactoForm;
