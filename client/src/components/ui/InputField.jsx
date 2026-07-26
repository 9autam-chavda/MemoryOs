const InputField = ({ id, label, type = "text", value, onChange, name, autoComplete, disabled, required, onBlur, invalid, ...rest }) => {
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
        aria-invalid={invalid ? "true" : "false"}
        aria-required={required ? "true" : "false"}
        className="ui-input peer h-[52px] px-4 text-[15px]"
        {...rest}
      />
      <label htmlFor={id} className="pointer-events-none absolute left-4 top-3 origin-left -translate-y-1/2 transform text-sm text-[var(--text-secondary)] transition-all peer-placeholder-shown:top-4 peer-focus:top-3 peer-focus:-translate-y-1/2">
        {label}
      </label>
    </div>
  );
};

export default InputField;
