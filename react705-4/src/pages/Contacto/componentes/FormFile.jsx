import { useDropzone } from "react-dropzone";
import { useState, useEffect } from "react";

// Cuántos archivos como máximo se pueden adjuntar
const MAX_FILES = 3;

// Un archivo se puede "previsualizar" si es imagen o PDF
function esPrevisualizable(archivo) {
    return archivo.type.startsWith("image/") || archivo.type === "application/pdf";
}

// Ícono simple según el tipo de archivo (para los que no se pueden previsualizar)
function obtenerIcono(archivo) {
    const nombre = archivo.name.toLowerCase();

    if (archivo.type === "application/pdf") return "📕";
    if (nombre.endsWith(".doc") || nombre.endsWith(".docx")) return "📝";
    if (nombre.endsWith(".xls") || nombre.endsWith(".xlsx")) return "📊";
    if (nombre.endsWith(".ppt") || nombre.endsWith(".pptx")) return "📽️";
    if (nombre.endsWith(".zip") || nombre.endsWith(".rar")) return "🗜️";

    return "📄";
}

function FormFile({
    label,
    name,
    required = false,
    error = "",


    maxSizeMB = 2, accept={"application/pdf": [".pdf"]},
    onFilesChange = () => {}, // 👈 nueva prop: notifica al padre (Controller de react-hook-form)
}) {
    // Cada elemento de archivos es: { archivo, preview }
    const [archivos, setArchivos] = useState([]);

    // Mensaje de error (tipo, tamaño o cantidad de archivos)
    const [errorMsg, setErrorMsg] = useState("");

    // Mensaje temporal, por ejemplo "Archivo eliminado"
    const [infoMsg, setInfoMsg] = useState("");

    // Se ejecuta cuando el usuario arrastra o selecciona archivos
    function onDrop(archivosAceptados, archivosRechazados) {
        const espacioDisponible = MAX_FILES - archivos.length;

        if (archivosAceptados.length > 0) {
            if (espacioDisponible <= 0) {
                setErrorMsg(`Solo puedes adjuntar hasta ${MAX_FILES} archivos`);
            } else {
                // Creamos la vista previa solo para los archivos que sí caben
                const archivosNuevos = archivosAceptados
                    .slice(0, espacioDisponible)
                    .map((archivo) => ({
                        archivo,
                        preview: esPrevisualizable(archivo)
                            ? URL.createObjectURL(archivo)
                            : null,
                    }));

                setArchivos([...archivos, ...archivosNuevos]);

                setErrorMsg(
                    archivosAceptados.length > espacioDisponible
                        ? `Solo puedes adjuntar hasta ${MAX_FILES} archivos`
                        : ""
                );
                setInfoMsg("");
            }
        }

        // Manejo de los archivos que la librería rechazó
        if (archivosRechazados.length > 0) {
            const primerError = archivosRechazados[0].errors[0];

            if (primerError.code === "file-too-large") {
                setErrorMsg(`El archivo supera el tamaño máximo de ${maxSizeMB}MB`);
            } else if (primerError.code === "file-invalid-type") {
                setErrorMsg("Tipo de archivo no permitido");
            } else if (primerError.code === "too-many-files") {
                setErrorMsg(`Solo puedes adjuntar hasta ${MAX_FILES} archivos`);
            } else {
                setErrorMsg(primerError.message);
            }
        }
    }

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        multiple: true,
        maxFiles: MAX_FILES,
        maxSize: maxSizeMB * 1024 * 1024, // useDropzone trabaja en bytes
        accept,
        disabled: archivos.length >= MAX_FILES,
    });

    // Quita un archivo de la lista según su posición
    function eliminarArchivo(index) {
        const archivoAEliminar = archivos[index];

        // Si tenía vista previa, liberamos esa memoria de inmediato
        if (archivoAEliminar.preview) {
            URL.revokeObjectURL(archivoAEliminar.preview);
        }

        setArchivos(archivos.filter((_, i) => i !== index));
        setErrorMsg("");
        setInfoMsg("Archivo eliminado correctamente");
    }

    // Por si el componente se desmonta con archivos aún cargados,
    // liberamos toda la memoria de las vistas previas
    useEffect(() => {
        return () => {
            archivos.forEach(({ preview }) => {
                if (preview) URL.revokeObjectURL(preview);
            });
        };
    }, [archivos]);

    // El mensaje de info desaparece solo después de 3 segundos
    useEffect(() => {
        if (!infoMsg) return;

        const temporizador = setTimeout(() => setInfoMsg(""), 3000);
        return () => clearTimeout(temporizador);
    }, [infoMsg]);

    // Cada vez que la lista de archivos cambia, avisamos hacia afuera
    // (mandamos solo los File puros, sin id ni preview, que son detalles internos)
    useEffect(() => {
        onFilesChange(archivos.map((a) => a.archivo));
    }, [archivos]);

    return (
        <div className="flex flex-col gap-2">
            <label
                htmlFor={name}
                className="text-sm font-semibold text-indigo-900 dark:text-slate-300 flex items-center gap-1"
            >
                {label} {required && <span className="text-fuchsia-500">*</span>}
            </label>

            <div
                {...getRootProps()}
                className={`border-2 border-dashed rounded-lg px-4 py-8 text-center transition duration-300 ${
                    archivos.length >= MAX_FILES
                        ? "cursor-not-allowed bg-violet-50/40 dark:bg-slate-800/40 border-violet-100 dark:border-slate-700"
                        : "cursor-pointer hover:border-indigo-400 hover:bg-violet-50/40 dark:hover:bg-slate-800/40"
                } ${errorMsg ? "border-red-400" : "border-violet-200 dark:border-slate-600"}`}
            >
                <input
                    {...getInputProps({
                        id: name,
                        name: name,
                        required: required && archivos.length === 0,
                    })}
                />

                <div className="text-3xl mb-2">📎</div>

                {isDragActive ? (
                    <p className="font-medium text-indigo-600 dark:text-indigo-400">
                        Suelta los archivos aquí...
                    </p>
                ) : archivos.length >= MAX_FILES ? (
                    <p className="text-sm text-violet-400 dark:text-slate-500">
                        Máximo de {MAX_FILES} archivos alcanzado
                    </p>
                ) : (
                    <>
                        <p className="font-medium text-indigo-950 dark:text-slate-100">
                            Arrastra tus archivos aquí
                        </p>
                        <p className="text-sm text-violet-400 dark:text-slate-500 mt-1">
                            o haz clic para seleccionarlos ({archivos.length}/{MAX_FILES})
                        </p>
                    </>
                )}
            </div>

            {infoMsg && (
                <span className="text-sm font-medium text-emerald-600 dark:text-emerald-400">{infoMsg}</span>
            )}

            {/* Lista de archivos seleccionados */}
            {archivos.length > 0 && (
                <div className="flex flex-col gap-3 mt-1">
                    {archivos.map(({ archivo, preview }, index) => (
                        <div
                            key={`${archivo.name}-${archivo.lastModified}-${index}`}
                            className="rounded-lg bg-violet-50/60 dark:bg-slate-800/60 border border-violet-100 dark:border-slate-700 p-3 flex items-center justify-between gap-4"
                        >
                            <div className="flex items-center gap-3 min-w-0">
                                {/* Miniatura: imagen, PDF, o un ícono según el tipo */}
                                {archivo.type.startsWith("image/") && preview && (
                                    <img
                                        src={preview}
                                        alt={`Vista previa de ${archivo.name}`}
                                        className="w-16 h-16 object-cover rounded-lg border border-violet-200 shrink-0"
                                    />
                                )}

                                {archivo.type === "application/pdf" && preview && (
                                    <embed
                                        src={preview}
                                        type="application/pdf"
                                        className="w-16 h-16 rounded-lg border border-violet-200 shrink-0 pointer-events-none"
                                    />
                                )}

                                {!preview && (
                                    <div className="w-16 h-16 flex items-center justify-center rounded-lg bg-violet-100 text-3xl shrink-0">
                                        {obtenerIcono(archivo)}
                                    </div>
                                )}

                                <div className="min-w-0 text-sm text-indigo-950">
                                    <p className="font-semibold truncate">{archivo.name}</p>
                                    <p className="text-violet-500">
                                        {(archivo.size / 1024).toFixed(2)} KB ·{" "}
                                        {archivo.type || "desconocido"}
                                    </p>
                                </div>
                            </div>

                            <button
                                type="button"
                                onClick={() => eliminarArchivo(index)}
                                className="shrink-0 text-sm font-semibold text-red-500 hover:text-red-600 hover:bg-red-50 px-3 py-1.5 rounded-lg transition"
                            >
                                Eliminar
                            </button>
                        </div>
                    ))}
                </div>
            )}

            {(errorMsg || error) && (
                <span className="text-sm text-red-500">{errorMsg || error}</span>
            )}
        </div>
    );
}

export default FormFile;
