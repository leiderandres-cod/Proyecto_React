import { forwardRef } from "react";


const FormSelect = forwardRef(function FormSelect(
  {
    label,
    name,
    options = [],
    required = false,
    placeholder = "Selecciona una opción",
    error = "",
    ...rest
  },
  ref
) {
  return (
    <div className="flex flex-col gap-2">
      <label
        htmlFor={name}
        className="text-sm font-semibold text-indigo-900 dark:text-slate-300 flex items-center gap-1"
      >
        {label} {required && <span className="text-fuchsia-500">*</span>}
      </label>

      <select
        id={name}
        name={name}
        ref={ref}
        {...rest}
        className="w-full border border-violet-200 dark:border-slate-600 rounded-lg px-4 py-2.5 text-indigo-950 dark:text-slate-100 bg-white dark:bg-slate-800 cursor-pointer outline-none transition duration-300 hover:border-violet-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
      >
        <option value="">{placeholder}</option>
        {options.map((option) => {
          const value = typeof option === "string" ? option : option.value;
          const text = typeof option === "string" ? option : option.label;
          return (
            <option key={value} value={value}>
              {text}
            </option>
          );
        })}
      </select>

      {error && <span className="text-sm text-red-500">{error}</span>}
    </div>
  );
});

export default FormSelect;
