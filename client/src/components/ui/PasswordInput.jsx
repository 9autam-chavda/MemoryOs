import React from "react";
import { Eye, EyeOff } from "lucide-react";

const PasswordInput = ({ id, label, value, onChange, name, autoComplete, disabled, show, onToggleShow, onBlur, ...rest }) => {
  return (
    <div className="relative">
      <input
        id={id}
        name={name}
        type={show ? "text" : "password"}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        disabled={disabled}
        autoComplete={autoComplete}
        placeholder=" "
        className="peer w-full rounded-2xl border border-zinc-800 bg-zinc-900/80 px-4 py-4 pr-12 text-sm text-zinc-100 outline-none transition focus:border-blue-500/40"
        {...rest}
      />

      <button type="button" onClick={onToggleShow} className="absolute right-3 top-3 rounded px-2 py-1 text-zinc-300 transition hover:text-zinc-100" aria-label="Toggle password visibility">
        {show ? <EyeOff size={18} /> : <Eye size={18} />}
      </button>

      <label htmlFor={id} className="pointer-events-none absolute left-4 top-3 origin-left -translate-y-1/2 transform text-sm text-zinc-400 transition-all peer-placeholder-shown:top-4 peer-focus:top-3 peer-focus:-translate-y-1/2">
        {label}
      </label>
    </div>
  );
};

export default PasswordInput;
