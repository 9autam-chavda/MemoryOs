import React from "react";

const InputField = ({ id, label, type = "text", value, onChange, name, autoComplete, disabled, required, onBlur, ...rest }) => {
  return (
    <div className="relative">
      <input
        id={id}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        disabled={disabled}
        autoComplete={autoComplete}
        required={required}
        placeholder=" "
        className="peer w-full rounded-2xl border border-zinc-800 bg-zinc-900/80 px-4 py-4 text-sm text-zinc-100 outline-none transition focus:border-blue-500/40"
        {...rest}
      />
      <label htmlFor={id} className="pointer-events-none absolute left-4 top-3 origin-left -translate-y-1/2 transform text-sm text-zinc-400 transition-all peer-placeholder-shown:top-4 peer-focus:top-3 peer-focus:-translate-y-1/2">
        {label}
      </label>
    </div>
  );
};

export default InputField;
