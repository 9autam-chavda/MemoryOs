import { useState, useEffect } from "react";
import {
  Menu,
  X,
  ArrowRight,
  BrainCircuit,
  Search,
  Sparkles,
  Upload,
  ShieldCheck,
  Database,
} from "lucide-react";
import logo from "../assets/branding/mos.svg";

export default function LandingPage() {
  const [mobileMenu, setMobileMenu] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const techStack = [
    "React",
    "FastAPI",
    "MongoDB",
    "Cloudinary",
    "Whisper",
    "Gemini",
    "RAG",
  ];

  const supportedFiles = [
    "Images",
    "PDFs",
    "Videos",
    "Audio",
    "Documents",
  ];

  return (
    <div className="min-h-screen bg-[var(--surface-canvas)] text-[var(--text-primary)]">

      {/* ================================
                NAVBAR
      ================================= */}

      <header
        className={`fixed left-0 top-0 z-50 w-full transition-all duration-300 ${
          scrolled
            ? "border-b border-[var(--border-subtle)] bg-[var(--surface-sidebar)]/90 backdrop-blur-lg"
            : "bg-transparent"
        }`}
      >
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">

          {/* Logo */}

          <a
            href="/"
            className="flex items-center gap-3"
          >
            <img
              src={logo}
              alt="MemoryOS"
              className="h-10 w-10"
            />

            <div>
              <h2 className="text-lg font-semibold tracking-tight">
                MemoryOS
              </h2>
            </div>
          </a>

          {/* Desktop Menu */}

          <nav className="hidden items-center gap-8 lg:flex">

            <a
              href="#features"
              className="text-sm text-[var(--text-secondary)] transition hover:text-[var(--text-primary)]"
            >
              Features
            </a>

            <a
              href="#workflow"
              className="text-sm text-[var(--text-secondary)] transition hover:text-[var(--text-primary)]"
            >
              How it Works
            </a>

            <a
              href="#about"
              className="text-sm text-[var(--text-secondary)] transition hover:text-[var(--text-primary)]"
            >
              About
            </a>

            <a
              href="https://github.com/9autam-chavda"
              target="_blank"
              rel="noreferrer"
              className="text-sm text-[var(--text-secondary)] transition hover:text-[var(--text-primary)]"
            >
              GitHub
            </a>

          </nav>

          {/* Buttons */}

          <div className="hidden items-center gap-3 lg:flex">

            <a
              href="/login"
              className="rounded-xl border border-[var(--border-subtle)] px-5 py-2 text-sm transition hover:bg-[var(--surface-overlay)]"
            >
              Sign In
            </a>

            <a
              href="/register"
              className="rounded-xl bg-white px-5 py-2 text-sm font-semibold text-black transition hover:opacity-90"
            >
              Get Started
            </a>

          </div>

          {/* Mobile */}

          <button
            onClick={() => setMobileMenu(!mobileMenu)}
            className="lg:hidden"
          >
            {mobileMenu ? (
              <X size={26} />
            ) : (
              <Menu size={26} />
            )}
          </button>

        </div>

        {mobileMenu && (
          <div className="border-t border-[var(--border-subtle)] bg-[var(--surface-sidebar)] px-6 py-5 lg:hidden">

            <div className="flex flex-col gap-5">

              <a href="#features">Features</a>

              <a href="#workflow">How it Works</a>

              <a href="#about">About</a>

              <a href="/login">
                Sign In
              </a>

              <a
                href="/register"
                className="rounded-xl bg-white py-3 text-center font-medium text-black"
              >
                Get Started
              </a>

            </div>

          </div>
        )}
      </header>

      {/* ================================
                HERO
      ================================= */}

      <section className="mx-auto flex min-h-screen max-w-7xl flex-col justify-center px-6 pt-24">

        <div className="max-w-4xl">

          <h1 className="max-w-5xl text-5xl font-bold leading-tight md:text-7xl">

            Remember Everything.

            <br />

            <span className="text-white">
              Find Anything.
            </span>

          </h1>

          <p className="mt-8 max-w-2xl text-lg leading-8 text-[var(--text-secondary)]">

            MemoryOS transforms your images, PDFs, videos,
            audio recordings and documents into searchable
            knowledge using AI.

            Upload once.

            Find forever.

          </p>

          <div className="mt-10 flex flex-wrap gap-4">

            <a
              href="/register"
              className="flex items-center gap-2 rounded-xl bg-white px-6 py-3 font-semibold text-black transition hover:scale-[1.02]"
            >
              Get Started

              <ArrowRight size={18} />
            </a>

            <a
              href="/login"
              className="rounded-xl border border-[var(--border-subtle)] px-6 py-3 transition hover:bg-[var(--surface-overlay)]"
            >
              Sign In
            </a>

          </div>

          <div className="mt-10 flex flex-wrap gap-3">

            {supportedFiles.map((item) => (
              <span
                key={item}
                className="rounded-full border border-[var(--border-subtle)] bg-[var(--surface-overlay)] px-4 py-2 text-sm text-[var(--text-secondary)]"
              >
                {item}
              </span>
            ))}

          </div>

        </div>

                {/* Right Premium Card */}

        <div className="mt-20 grid gap-6 lg:grid-cols-2 lg:items-center">

          {/* AI Overview */}

          <div className="rounded-3xl border border-[var(--border-subtle)] bg-[var(--surface-overlay)] p-8 shadow-2xl">

            <div className="mb-8 flex items-center justify-between">

              <div>

                <p className="text-sm text-[var(--text-secondary)]">
                  Memory Intelligence
                </p>

                <h3 className="mt-2 text-2xl font-semibold">
                  AI Processing Pipeline
                </h3>

              </div>

              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-violet-500/15">

                <BrainCircuit className="text-violet-400" />

              </div>

            </div>

            <div className="space-y-4">

              {[
                {
                  title: "OCR Extraction",
                  icon: Upload,
                  status: "Completed",
                },
                {
                  title: "Speech Recognition",
                  icon: Sparkles,
                  status: "Completed",
                },
                {
                  title: "AI Summary",
                  icon: Search,
                  status: "Completed",
                },
                {
                  title: "Semantic Embedding",
                  icon: Database,
                  status: "Completed",
                },
              ].map((item) => (

                <div
                  key={item.title}
                  className="flex items-center justify-between rounded-2xl border border-[var(--border-subtle)] bg-[var(--surface-canvas)] px-5 py-4 transition hover:border-violet-500/40"
                >

                  <div className="flex items-center gap-4">

                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-500/10">

                      <item.icon
                        size={18}
                        className="text-violet-400"
                      />

                    </div>

                    <div>

                      <h4 className="font-medium">

                        {item.title}

                      </h4>

                      <p className="text-xs text-[var(--text-secondary)]">

                        Background AI Processing

                      </p>

                    </div>

                  </div>

                  <span className="rounded-full bg-green-500/10 px-3 py-1 text-xs font-medium text-green-400">

                    {item.status}

                  </span>

                </div>

              ))}

            </div>

          </div>

          {/* Tech Stack */}

          <div className="space-y-6">

            <div className="rounded-3xl border border-[var(--border-subtle)] bg-[var(--surface-overlay)] p-8">

              <h3 className="text-2xl font-semibold">

                Built for Modern Knowledge

              </h3>

              <p className="mt-3 leading-7 text-[var(--text-secondary)]">

                MemoryOS automatically understands everything you upload.
                Instead of simply storing files, it creates an intelligent,
                searchable knowledge base powered by AI.

              </p>

            </div>

            <div className="rounded-3xl border border-[var(--border-subtle)] bg-[var(--surface-overlay)] p-8">

              <p className="mb-6 text-sm font-medium text-[var(--text-secondary)]">

                Powered By

              </p>

              <div className="flex flex-wrap gap-3">

                {techStack.map((tech) => (

                  <span
                    key={tech}
                    className="rounded-full border border-[var(--border-subtle)] bg-[var(--surface-canvas)] px-4 py-2 text-sm transition hover:border-violet-500/40 hover:text-violet-300"
                  >
                    {tech}
                  </span>

                ))}

              </div>

            </div>

            <div className="rounded-3xl border border-violet-500/20 bg-gradient-to-br from-violet-500/10 to-blue-500/10 p-8">

              <div className="flex items-center gap-4">

                <ShieldCheck
                  className="text-violet-400"
                  size={28}
                />

                <div>

                  <h3 className="text-lg font-semibold">

                    Private by Design

                  </h3>

                  <p className="mt-2 text-sm leading-6 text-[var(--text-secondary)]">

                    Your uploaded memories remain associated only with your
                    account while AI enhances retrieval through semantic
                    understanding.

                  </p>

                </div>

              </div>

            </div>

          </div>

        </div>

      </section>

            {/* ================================================= */}
      {/* FEATURES */}
      {/* ================================================= */}

      <section
        id="features"
        className="mx-auto max-w-7xl px-6 py-28"
      >
        <div className="mx-auto max-w-3xl text-center">

          <span className="rounded-full border border-[var(--border-subtle)] bg-[var(--surface-overlay)] px-4 py-2 text-sm text-[var(--text-secondary)]">
            Core Features
          </span>

          <h2 className="mt-6 text-4xl font-bold md:text-5xl">
            Your knowledge,
            <br />
            intelligently organized.
          </h2>

          <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-[var(--text-secondary)]">
            MemoryOS doesn't just store files.
            It understands them, connects them,
            and helps you retrieve information naturally.
          </p>

        </div>

        <div className="mt-20 grid gap-8 md:grid-cols-3">

          {/* Card */}

          <div className="group rounded-3xl border border-[var(--border-subtle)] bg-[var(--surface-overlay)] p-8 transition duration-300 hover:-translate-y-2 hover:border-violet-500/40">

            <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-violet-500/10">

              <BrainCircuit
                className="text-violet-400"
                size={26}
              />

            </div>

            <h3 className="text-2xl font-semibold">
              AI Understanding
            </h3>

            <p className="mt-4 leading-7 text-[var(--text-secondary)]">
              OCR, speech recognition, AI summaries,
              smart categories, tags and embeddings are
              automatically generated for every upload.
            </p>

          </div>

          {/* Card */}

          <div className="group rounded-3xl border border-[var(--border-subtle)] bg-[var(--surface-overlay)] p-8 transition duration-300 hover:-translate-y-2 hover:border-violet-500/40">

            <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-violet-500/10">

              <Search
                className="text-violet-400"
                size={26}
              />

            </div>

            <h3 className="text-2xl font-semibold">
              Semantic Search
            </h3>

            <p className="mt-4 leading-7 text-[var(--text-secondary)]">
              Search using meaning instead of filenames.
              MemoryOS understands context so you find
              information exactly how you remember it.
            </p>

          </div>

          {/* Card */}

          <div className="group rounded-3xl border border-[var(--border-subtle)] bg-[var(--surface-overlay)] p-8 transition duration-300 hover:-translate-y-2 hover:border-violet-500/40">

            <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-violet-500/10">

              <Sparkles
                className="text-violet-400"
                size={26}
              />

            </div>

            <h3 className="text-2xl font-semibold">
              AI Assistant
            </h3>

            <p className="mt-4 leading-7 text-[var(--text-secondary)]">
              Ask natural language questions across your
              complete knowledge base using Retrieval
              Augmented Generation.
            </p>

          </div>

        </div>

      </section>

      {/* ================================================= */}
      {/* HOW IT WORKS */}
      {/* ================================================= */}

      <section
        id="workflow"
        className="mx-auto max-w-7xl px-6 py-28"
      >

        <div className="text-center">

          <span className="rounded-full border border-[var(--border-subtle)] bg-[var(--surface-overlay)] px-4 py-2 text-sm text-[var(--text-secondary)]">

            How It Works

          </span>

          <h2 className="mt-6 text-4xl font-bold">

            Four simple steps.

          </h2>

          <p className="mt-5 text-lg text-[var(--text-secondary)]">

            From upload to intelligent retrieval.

          </p>

        </div>

        <div className="mt-20 grid gap-10 md:grid-cols-4">

          {[
            {
              title: "Upload",
              desc: "Images, PDFs, videos, audio and documents.",
            },
            {
              title: "AI Processing",
              desc: "OCR, Whisper, summaries, tags and embeddings.",
            },
            {
              title: "Knowledge",
              desc: "Everything becomes structured and searchable.",
            },
            {
              title: "Ask Anything",
              desc: "Retrieve information naturally using AI.",
            },
          ].map((step, index) => (

            <div
              key={step.title}
              className="relative rounded-3xl border border-[var(--border-subtle)] bg-[var(--surface-overlay)] p-8"
            >

              <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-full bg-violet-500/10 text-lg font-bold text-violet-300">

                {index + 1}

              </div>

              <h3 className="text-xl font-semibold">

                {step.title}

              </h3>

              <p className="mt-4 leading-7 text-[var(--text-secondary)]">

                {step.desc}

              </p>

            </div>

          ))}

        </div>

      </section>
            {/* ========================================= */}
      {/* WHY MEMORYOS */}
      {/* ========================================= */}

      <section
        id="about"
        className="mx-auto max-w-7xl px-6 py-28"
      >
        <div className="mx-auto max-w-3xl text-center">

          <span className="rounded-full border border-[var(--border-subtle)] bg-[var(--surface-overlay)] px-4 py-2 text-sm text-[var(--text-secondary)]">
            Why MemoryOS
          </span>

          <h2 className="mt-6 text-4xl font-bold md:text-5xl">
            Built for people who never want to lose knowledge.
          </h2>

          <p className="mt-6 text-lg leading-8 text-[var(--text-secondary)]">
            Traditional storage remembers files.
            MemoryOS remembers information.
          </p>

        </div>

        <div className="mt-20 grid gap-6 md:grid-cols-2 lg:grid-cols-4">

          {[
            {
              title: "Private",
              desc: "Your memories belong only to you.",
              icon: ShieldCheck,
            },
            {
              title: "Fast",
              desc: "Background AI processing keeps uploads smooth.",
              icon: Upload,
            },
            {
              title: "Intelligent",
              desc: "Search by meaning instead of filenames.",
              icon: BrainCircuit,
            },
            {
              title: "Modern",
              desc: "Built with React, FastAPI, MongoDB and AI.",
              icon: Database,
            },
          ].map((card) => (
            <div
              key={card.title}
              className="rounded-3xl border border-[var(--border-subtle)] bg-[var(--surface-overlay)] p-8 transition duration-300 hover:-translate-y-2 hover:border-violet-500/40"
            >
              <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-2xl bg-violet-500/10">
                <card.icon
                  className="text-violet-400"
                  size={22}
                />
              </div>

              <h3 className="text-xl font-semibold">
                {card.title}
              </h3>

              <p className="mt-4 leading-7 text-[var(--text-secondary)]">
                {card.desc}
              </p>
            </div>
          ))}

        </div>

      </section>

      {/* ========================================= */}
      {/* FINAL CTA */}
      {/* ========================================= */}

      <section className="mx-auto max-w-6xl px-6 py-32">

        <div className="rounded-[32px] border border-[var(--border-subtle)] bg-gradient-to-br from-violet-500/10 to-blue-500/10 p-12 text-center">

          <h2 className="text-5xl font-bold">

            Start Building Your
            <br />
            Second Brain.

          </h2>

          <p className="mx-auto mt-8 max-w-2xl text-lg leading-8 text-[var(--text-secondary)]">

            Capture knowledge once.

            Search it forever.

            Let AI remember everything for you.

          </p>

          <div className="mt-12 flex flex-wrap justify-center gap-4">

            <a
              href="/register"
              className="rounded-xl bg-white px-8 py-4 font-semibold text-black transition hover:scale-105"
            >
              Create Free Account
            </a>

            <a
              href="/login"
              className="rounded-xl border border-[var(--border-subtle)] px-8 py-4 transition hover:bg-[var(--surface-overlay)]"
            >
              Sign In
            </a>

          </div>

        </div>

      </section>

      {/* ========================================= */}
      {/* FOOTER */}
      {/* ========================================= */}

      <footer className="border-t border-[var(--border-subtle)]">

        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-8 px-6 py-10 md:flex-row">

          <div className="flex items-center gap-4">

            <img
              src={logo}
              alt="MemoryOS"
              className="h-10 w-10"
            />

            <div>

              <h3 className="font-semibold">
                MemoryOS
              </h3>

              <p className="text-sm text-[var(--text-secondary)]">
                AI Powered Personal Knowledge Engine
              </p>

            </div>

          </div>

          <div className="flex items-center gap-8 text-sm text-[var(--text-secondary)]">

            <a
              href="https://github.com"
              target="_blank"
              rel="noreferrer"
              className="hover:text-white"
            >
              GitHub
            </a>

            <span>
              Version 1.0
            </span>

            <span>
              Built by Gautam Chavda
            </span>

          </div>

        </div>

      </footer>

    </div>
  );
}