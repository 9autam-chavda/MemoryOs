function Card({ as: Component = "div", interactive = false, className = "", children, ...props }) {
  return (
    <Component className={`ui-card ${interactive ? "ui-card-interactive" : ""} ${className}`.trim()} {...props}>
      {children}
    </Component>
  );
}

export default Card;
