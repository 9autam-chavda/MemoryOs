import logo from "../../assets/branding/mos.svg";

function AuthLayout({
  children,
  split = false,
  title = "Remember Everything. Find Anything.",
}) {
  return (
    <main className="auth-canvas">
      <div
        className={`auth-shell ${
          split ? "auth-shell-split" : "auth-shell-single"
        }`}
      >
        {split && (
          <aside className="auth-brand flex h-full flex-col justify-center px-14">

            {/* Logo */}
            <img
              src={logo}
              alt="MemoryOS"
              className="h-16 w-16 object-contain"
            />

            {/* Brand Name */}
            <p className="mt-8 text-lg font-semibold tracking-tight text-[var(--text-primary)]">
              MemoryOS
            </p>

            {/* Heading */}
            <h1 className="mt-5 max-w-md text-5xl font-bold leading-tight tracking-tight text-[var(--text-primary)]">
              {title}
            </h1>

            {/* Description */}
            <p className="mt-6 max-w-md text-lg leading-8 text-[var(--text-secondary)]">
              Your AI-powered second brain that captures, understands,
              organizes, and instantly retrieves everything that matters.
            </p>

          </aside>
        )}

        <section className="auth-card">
          {children}
        </section>
      </div>
    </main>
  );
}

export default AuthLayout;