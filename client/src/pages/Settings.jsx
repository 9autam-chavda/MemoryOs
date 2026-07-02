import { useEffect } from "react";
import { useTheme } from "../contexts/ThemeContext";
import AppLayout from "../components/layout/AppLayout";

function Settings() {
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    document.title = "Settings · MemoryOS";
  }, []);

  return (
    <AppLayout>
      <div className="mx-auto max-w-3xl space-y-6 py-8">
        <section className="rounded-2xl border border-white/[0.06] bg-[var(--surface-panel)] p-6">
          <h2 className="text-lg font-semibold text-zinc-100">Appearance</h2>
          <p className="mt-2 text-sm text-zinc-400">Choose how MemoryOS looks on your device.</p>

          <div className="mt-4 flex items-center gap-3">
            <button className={`rounded-full px-4 py-2 text-sm transition ${theme === 'light' ? 'bg-white text-zinc-900' : 'bg-white/5 text-zinc-200'}`} onClick={() => setTheme('light')}>Light</button>
            <button className={`rounded-full px-4 py-2 text-sm transition ${theme === 'dark' ? 'bg-white text-zinc-900' : 'bg-white/5 text-zinc-200'}`} onClick={() => setTheme('dark')}>Dark</button>
            <button className={`rounded-full px-4 py-2 text-sm transition ${theme === 'system' ? 'bg-white text-zinc-900' : 'bg-white/5 text-zinc-200'}`} onClick={() => setTheme('system')}>System</button>
          </div>
        </section>
      </div>
    </AppLayout>
  );
}

export default Settings;
