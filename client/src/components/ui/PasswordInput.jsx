import { Eye, EyeOff } from "lucide-react";

const PasswordInput = ({ id, label, value, onChange, name, autoComplete, disabled, show, onToggleShow, onBlur, invalid, ...rest }) => {
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
        aria-invalid={invalid ? "true" : "false"}
        aria-required={"true"}
        className="ui-input peer h-[52px] px-4 pr-12 text-[15px]"
        {...rest}
      />

      <button type="button" onClick={onToggleShow} className="absolute right-3 top-2.5 rounded px-2 py-1 text-[var(--text-secondary)] transition hover:text-[var(--text-primary)]" aria-label="Toggle password visibility">
        {show ? <EyeOff size={18} /> : <Eye size={18} />}
      </button>

      <label htmlFor={id} className="pointer-events-none absolute left-4 top-3 origin-left -translate-y-1/2 transform text-sm text-[var(--text-secondary)] transition-all peer-placeholder-shown:top-4 peer-focus:top-3 peer-focus:-translate-y-1/2">
        {label}
      </label>
    </div>
  );
};

export default PasswordInput;
