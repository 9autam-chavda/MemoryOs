function Button({ as: Component = "button", variant = "primary", className = "", type = "button", children, ...props }) {
  return (
    <Component {...(Component === "button" ? { type } : {})} className={`ui-button ui-button-${variant} ${className}`.trim()} {...props}>
      {children}
    </Component>
  );
}

export default Button;
