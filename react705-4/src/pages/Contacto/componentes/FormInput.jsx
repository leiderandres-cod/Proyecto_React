import { forwardRef } from "react";


const FormInput = forwardRef(function FormInput(
  {
    label,
    name,
    type = "text",
    required = false,
    placeholder = "",
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

      <input
        id={name}
        name={name}
        type={type}
        placeholder={placeholder}
        ref={ref}
        {...rest}
        className="w-full border border-violet-200 dark:border-slate-600 rounded-lg px-4 py-2.5 text-indigo-950 dark:text-slate-100 bg-white dark:bg-slate-800 placeholder:text-violet-300 dark:placeholder:text-slate-500 outline-none transition duration-300 hover:border-violet-400 hover:bg-violet-50/40 dark:hover:bg-slate-700 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 focus:bg-white dark:focus:bg-slate-700"
      />

      {error && <span className="text-sm text-red-500">{error}</span>}
    </div>
  );
});

export default FormInput;
