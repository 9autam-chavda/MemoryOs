import { useEffect, useState } from "react";
import { Palette, History } from "lucide-react";

import { useTheme } from "../contexts/ThemeContext";
import AppLayout from "../components/layout/AppLayout";
import AssistantHistory from "../components/settings/AssistantHistory";

function Settings() {
  const { theme, setTheme } = useTheme();

  const [activeTab, setActiveTab] = useState("appearance");

  useEffect(() => {
    document.title = "Settings · MemoryOS";
  }, []);

  return (
    <AppLayout>
      <div className="mx-auto w-full max-w-6xl py-8">

        <h1 className="mb-8 text-3xl font-bold text-[var(--text-primary)]">
          Settings
        </h1>

        <div className="grid grid-cols-[260px_1fr] gap-8">

          {/* Left Navigation */}

          <aside className="rounded-2xl border border-[var(--border-subtle)] bg-[var(--surface-panel)] p-3">

            <button
              onClick={() => setActiveTab("appearance")}
              className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left transition ${
                activeTab === "appearance"
                  ? "bg-[var(--accent-soft)] text-[var(--accent)]"
                  : "text-[var(--text-secondary)] hover:bg-white/[0.04]"
              }`}
            >
              <Palette size={18} />
              Appearance
            </button>

            <button
              onClick={() => setActiveTab("history")}
              className={`mt-2 flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left transition ${
                activeTab === "history"
                  ? "bg-[var(--accent-soft)] text-[var(--accent)]"
                  : "text-[var(--text-secondary)] hover:bg-white/[0.04]"
              }`}
            >
              <History size={18} />
              Assistant History
            </button>

          </aside>

          {/* Right Panel */}

          <section className="rounded-2xl border border-[var(--border-subtle)] bg-[var(--surface-panel)] p-8">

            {activeTab === "appearance" && (
              <>
                <h2 className="text-2xl font-semibold text-[var(--text-primary)]">
                  Appearance
                </h2>

                <p className="mt-2 text-sm text-[var(--text-secondary)]">
                  Choose how MemoryOS looks on your device.
                </p>

                <div className="mt-8 flex flex-wrap gap-3">

                  <button
                    onClick={() => setTheme("light")}
                    className={`rounded-full px-5 py-2.5 transition ${
                      theme === "light"
                        ? "bg-white text-black"
                        : "bg-white/5 text-white"
                    }`}
                  >
                    Light
                  </button>

                  <button
                    onClick={() => setTheme("dark")}
                    className={`rounded-full px-5 py-2.5 transition ${
                      theme === "dark"
                        ? "bg-white text-black"
                        : "bg-white/5 text-white"
                    }`}
                  >
                    Dark
                  </button>

                  <button
                    onClick={() => setTheme("system")}
                    className={`rounded-full px-5 py-2.5 transition ${
                      theme === "system"
                        ? "bg-white text-black"
                        : "bg-white/5 text-white"
                    }`}
                  >
                    System
                  </button>

                </div>
              </>
            )}

            {activeTab === "history" && (
              <AssistantHistory />
            )}

          </section>

        </div>

      </div>
    </AppLayout>
  );
}

export default Settings;