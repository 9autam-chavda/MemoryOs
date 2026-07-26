function DashboardHeader({ name }) {
  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";

  return (
    <header>
      <h1 className="text-xl font-semibold tracking-tight text-[var(--text-primary)] sm:text-2xl">
        {greeting}{name ? `, ${name}` : ""}
      </h1>
    </header>
  );
}

export default DashboardHeader;
