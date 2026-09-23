import { useNavigate } from "react-router-dom";
import {
  ArrowRight,
  CheckCircle2,
  FileText,
  Target,
  TrendingUp,
  Sparkles,
} from "lucide-react";

export default function Landing() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      {/* Navbar */}
      <nav className="border-b border-white/10 bg-slate-950/80 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
          <button
            onClick={() => navigate("/")}
            className="flex items-center gap-2"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-cyan-400">
              <Sparkles size={19} />
            </div>

            <span className="text-xl font-bold">
              CareerPilot <span className="text-violet-400">AI</span>
            </span>
          </button>

          <button
            onClick={() => navigate("/upload")}
            className="rounded-xl border border-white/10 bg-white/5 px-5 py-2.5 text-sm font-medium transition hover:bg-white/10"
          >
            Get Started
          </button>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute left-1/2 top-0 h-96 w-96 -translate-x-1/2 rounded-full bg-violet-600/20 blur-3xl" />

        <div className="relative mx-auto max-w-7xl px-6 pb-20 pt-24">
          <div className="mx-auto max-w-4xl text-center">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-violet-400/20 bg-violet-500/10 px-4 py-2 text-sm text-violet-300">
              <Sparkles size={16} />
              AI-Powered Career & Skill Readiness
            </div>

            <h1 className="text-5xl font-bold leading-tight tracking-tight md:text-7xl">
              Turn your skills into a{" "}
              <span className="bg-gradient-to-r from-violet-400 to-cyan-400 bg-clip-text text-transparent">
                career roadmap.
              </span>
            </h1>

            <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-slate-400">
              Upload your resume, understand your current skills, identify
              skill gaps for your target role, and get a personalized roadmap
              to become career-ready.
            </p>

            <div className="mt-10 flex flex-col justify-center gap-4 sm:flex-row">
              <button
                onClick={() => navigate("/upload")}
                className="group flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-cyan-500 px-7 py-3.5 font-semibold transition hover:scale-[1.02]"
              >
                Analyze My Skills
                <ArrowRight
                  size={18}
                  className="transition group-hover:translate-x-1"
                />
              </button>

              <button
                onClick={() => navigate("/demo")}
                className="rounded-xl border border-white/10 bg-white/5 px-7 py-3.5 font-semibold transition hover:bg-white/10"
              >
                Explore Demo
              </button>
            </div>
          </div>

          {/* Dashboard Preview */}
          <div className="mx-auto mt-20 max-w-5xl rounded-2xl border border-white/10 bg-white/[0.04] p-3 shadow-2xl">
            <div className="rounded-xl border border-white/10 bg-slate-900 p-6">
              <div className="mb-6 flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-400">Target Role</p>
                  <h3 className="mt-1 text-xl font-semibold">
                    Backend Developer
                  </h3>
                </div>

                <div className="rounded-xl bg-emerald-500/10 px-4 py-2 text-sm font-semibold text-emerald-400">
                  72% Alignment
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-3">
                <DashboardCard
                  icon={<CheckCircle2 size={20} />}
                  title="Matched Skills"
                  value="12"
                  description="Skills supported by resume evidence"
                />

                <DashboardCard
                  icon={<Target size={20} />}
                  title="Skill Gaps"
                  value="5"
                  description="Skills recommended for this role"
                />

                <DashboardCard
                  icon={<TrendingUp size={20} />}
                  title="Roadmap"
                  value="8 Weeks"
                  description="Personalized learning journey"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="border-t border-white/10 py-24">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-sm font-semibold uppercase tracking-widest text-violet-400">
              Career Intelligence
            </p>

            <h2 className="mt-3 text-4xl font-bold">
              From resume to readiness.
            </h2>

            <p className="mt-4 text-slate-400">
              CareerPilot AI connects what you already know with what your
              target role requires.
            </p>
          </div>

          <div className="mt-14 grid gap-6 md:grid-cols-3">
            <FeatureCard
              icon={<FileText />}
              title="Resume Understanding"
              description="Extract skills, projects, experience, education, and certifications from your resume."
            />

            <FeatureCard
              icon={<Target />}
              title="Skill Gap Analysis"
              description="Compare your evidence-backed skills against the requirements of your target role."
            />

            <FeatureCard
              icon={<TrendingUp />}
              title="Personalized Roadmap"
              description="Get a structured learning path and project recommendations designed around your skill gaps."
            />
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="bg-slate-900/50 py-24">
        <div className="mx-auto max-w-7xl px-6">
          <div className="text-center">
            <p className="text-sm font-semibold uppercase tracking-widest text-cyan-400">
              How It Works
            </p>

            <h2 className="mt-3 text-4xl font-bold">
              Your journey in four steps
            </h2>
          </div>

          <div className="mt-14 grid gap-6 md:grid-cols-4">
            <Step
              number="01"
              title="Upload"
              description="Upload your resume and let CareerPilot understand your profile."
            />

            <Step
              number="02"
              title="Analyze"
              description="Extract and normalize your skills with supporting evidence."
            />

            <Step
              number="03"
              title="Align"
              description="Select a target role and identify matched, partial, and missing skills."
            />

            <Step
              number="04"
              title="Grow"
              description="Follow your personalized roadmap and track your progress."
            />
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24">
        <div className="mx-auto max-w-4xl px-6 text-center">
          <div className="rounded-3xl border border-violet-400/20 bg-gradient-to-br from-violet-500/10 to-cyan-500/10 p-12">
            <h2 className="text-4xl font-bold">
              Know where you stand.
              <br />
              Know what to learn next.
            </h2>

            <p className="mx-auto mt-5 max-w-xl text-slate-400">
              CareerPilot AI turns your current profile into an actionable
              skill development plan.
            </p>

            <button
              onClick={() => navigate("/upload")}
              className="mt-8 inline-flex items-center gap-2 rounded-xl bg-white px-7 py-3.5 font-semibold text-slate-950 transition hover:scale-[1.02]"
            >
              Start Your Career Journey
              <ArrowRight size={18} />
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 py-8">
        <div className="mx-auto flex max-w-7xl flex-col justify-between gap-4 px-6 text-sm text-slate-500 md:flex-row">
          <p>© 2026 CareerPilot AI</p>
          <p>Built for career & skill readiness.</p>
        </div>
      </footer>
    </div>
  );
}

function DashboardCard({
  icon,
  title,
  value,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  value: string;
  description: string;
}) {
  return (
    <div className="rounded-xl border border-white/10 bg-white/[0.03] p-5">
      <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-violet-500/10 text-violet-400">
        {icon}
      </div>

      <p className="text-sm text-slate-400">{title}</p>
      <p className="mt-1 text-2xl font-bold">{value}</p>

      <p className="mt-2 text-xs leading-5 text-slate-500">
        {description}
      </p>
    </div>
  );
}

function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-7 transition hover:-translate-y-1 hover:bg-white/[0.05]">
      <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-violet-500/10 text-violet-400">
        {icon}
      </div>

      <h3 className="text-xl font-semibold">{title}</h3>

      <p className="mt-3 leading-7 text-slate-400">{description}</p>
    </div>
  );
}

function Step({
  number,
  title,
  description,
}: {
  number: string;
  title: string;
  description: string;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-slate-950/50 p-6">
      <p className="text-sm font-bold text-violet-400">{number}</p>

      <h3 className="mt-4 text-xl font-semibold">{title}</h3>

      <p className="mt-3 text-sm leading-6 text-slate-400">
        {description}
      </p>
    </div>
  );
}