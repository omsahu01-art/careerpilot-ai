import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowRight,
  BrainCircuit,
  CheckCircle2,
  FileText,
  Sparkles,
  Target,
} from "lucide-react";

export default function Demo() {
  const navigate = useNavigate();

  useEffect(() => {
    const demoResume = {
      filename: "Demo_Candidate_Resume.pdf",
      file_size: 48231,
      text_length: 3200,
      skills: [
        {
          skill: "Python",
          level: "Intermediate",
          confidence: 90,
          evidence: "Built data analysis and automation projects using Python.",
          source: "Resume",
        },
        {
          skill: "SQL",
          level: "Intermediate",
          confidence: 88,
          evidence: "Used SQL for querying and analyzing structured datasets.",
          source: "Resume",
        },
        {
          skill: "Pandas",
          level: "Intermediate",
          confidence: 86,
          evidence: "Used Pandas for data cleaning and analysis.",
          source: "Resume",
        },
        {
          skill: "Excel",
          level: "Intermediate",
          confidence: 84,
          evidence: "Worked with Excel for data analysis and reporting.",
          source: "Resume",
        },
        {
          skill: "Power BI",
          level: "Intermediate",
          confidence: 82,
          evidence: "Created dashboards and reports using Power BI.",
          source: "Resume",
        },
        {
          skill: "Machine Learning",
          level: "Beginner",
          confidence: 76,
          evidence: "Completed machine learning projects using Python.",
          source: "Resume",
        },
      ],
    };

    sessionStorage.setItem(
      "careerpilot_resume",
      JSON.stringify(demoResume)
    );
  }, []);

  const startDemo = () => {
    navigate("/skills");
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <div className="mx-auto flex min-h-screen max-w-6xl items-center px-6 py-16">
        <div className="grid w-full gap-10 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="flex flex-col justify-center">
            <div className="mb-6 inline-flex w-fit items-center gap-2 rounded-full border border-violet-400/20 bg-violet-500/10 px-4 py-2 text-sm text-violet-200">
              <Sparkles className="h-4 w-4" />
              CareerPilot AI Demo Mode
            </div>

            <h1 className="max-w-3xl text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
              Experience your
              <span className="bg-gradient-to-r from-violet-400 to-cyan-400 bg-clip-text text-transparent">
                {" "}
                career intelligence dashboard.
              </span>
            </h1>

            <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-400">
              Explore how CareerPilot AI converts a resume into skills,
              role alignment, skill gaps, a personalized roadmap, and
              practical projects.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <button
                onClick={startDemo}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-violet-600 px-6 py-3.5 font-semibold transition hover:bg-violet-500"
              >
                Start Interactive Demo
                <ArrowRight className="h-5 w-5" />
              </button>

              <button
                onClick={() => navigate("/")}
                className="rounded-xl border border-white/10 bg-white/5 px-6 py-3.5 font-semibold text-slate-200 transition hover:bg-white/10"
              >
                Back to Home
              </button>
            </div>

            <p className="mt-5 text-sm text-slate-500">
              Demo data is fictional and is used only to showcase the
              CareerPilot AI workflow.
            </p>
          </div>

          <div className="relative">
            <div className="absolute -inset-6 rounded-3xl bg-violet-500/10 blur-3xl" />

            <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/[0.04] p-6 shadow-2xl backdrop-blur-xl">
              <div className="flex items-center justify-between border-b border-white/10 pb-5">
                <div className="flex items-center gap-3">
                  <div className="rounded-xl bg-violet-500/15 p-3">
                    <BrainCircuit className="h-6 w-6 text-violet-300" />
                  </div>

                  <div>
                    <p className="font-semibold">Demo Candidate</p>
                    <p className="text-sm text-slate-500">
                      Data Analyst pathway
                    </p>
                  </div>
                </div>

                <CheckCircle2 className="h-5 w-5 text-emerald-400" />
              </div>

              <div className="mt-6 space-y-4">
                <div className="rounded-2xl border border-white/10 bg-slate-900/70 p-4">
                  <div className="flex items-center gap-3">
                    <FileText className="h-5 w-5 text-cyan-300" />
                    <div>
                      <p className="text-sm font-medium">Resume analyzed</p>
                      <p className="text-xs text-slate-500">
                        6 relevant skills detected
                      </p>
                    </div>
                  </div>
                </div>

                <div className="rounded-2xl border border-white/10 bg-slate-900/70 p-4">
                  <div className="flex items-center gap-3">
                    <Target className="h-5 w-5 text-violet-300" />
                    <div>
                      <p className="text-sm font-medium">
                        Target role selected
                      </p>
                      <p className="text-xs text-slate-500">
                        Data Analyst
                      </p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div className="rounded-2xl border border-emerald-400/10 bg-emerald-400/5 p-4">
                    <p className="text-2xl font-bold text-emerald-300">4</p>
                    <p className="mt-1 text-xs text-slate-400">Matched</p>
                  </div>

                  <div className="rounded-2xl border border-amber-400/10 bg-amber-400/5 p-4">
                    <p className="text-2xl font-bold text-amber-300">1</p>
                    <p className="mt-1 text-xs text-slate-400">Partial</p>
                  </div>

                  <div className="rounded-2xl border border-rose-400/10 bg-rose-400/5 p-4">
                    <p className="text-2xl font-bold text-rose-300">1</p>
                    <p className="mt-1 text-xs text-slate-400">Missing</p>
                  </div>
                </div>

                <div className="rounded-2xl border border-violet-400/10 bg-violet-500/5 p-5">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-slate-400">
                        Role Alignment
                      </p>
                      <p className="mt-1 text-3xl font-bold">75%</p>
                    </div>

                    <div className="rounded-full bg-violet-500/15 px-3 py-1 text-xs font-medium text-violet-300">
                      Evidence based
                    </div>
                  </div>

                  <div className="mt-4 h-2 overflow-hidden rounded-full bg-white/10">
                    <div className="h-full w-[75%] rounded-full bg-gradient-to-r from-violet-500 to-cyan-400" />
                  </div>
                </div>
              </div>

              <div className="mt-6 rounded-xl border border-white/10 bg-white/[0.03] p-4 text-sm text-slate-400">
                CareerPilot AI identifies what you already have,
                what is missing, and what to build next.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}