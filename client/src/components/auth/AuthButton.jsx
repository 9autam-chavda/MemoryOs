function AuthButton({ children, className = "", ...props }) { return <button type="submit" className={`auth-button ${className}`.trim()} {...props}>{children}</button>; }
export default AuthButton;
