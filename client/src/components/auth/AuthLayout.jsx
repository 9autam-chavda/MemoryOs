import { Brain } from "lucide-react";

function AuthLayout({ children, split = false, title = "Your personal memory library" }) {
  return <main className="auth-canvas"><div className={`auth-shell ${split ? "auth-shell-split" : "auth-shell-single"}`}>{split && <aside className="auth-brand"><div className="auth-logo"><Brain size={20} /></div><p className="mt-6 text-sm font-medium text-[var(--text-primary)]">MemoryOS</p><h1 className="mt-3 text-3xl font-semibold tracking-tight text-[var(--text-primary)]">{title}</h1><p className="mt-3 max-w-sm text-[15px] leading-6 text-[var(--text-secondary)]">A private place to keep your knowledge organized and retrievable.</p></aside>}<section className="auth-card">{children}</section></div></main>;
}
export default AuthLayout;
