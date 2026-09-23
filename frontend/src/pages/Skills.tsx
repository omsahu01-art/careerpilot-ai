import { useEffect, useState, type ReactNode } from "react";
import {
  ArrowLeft,
  ArrowRight,
  Brain,
  CheckCircle2,
  Database,
  FileText,
  GraduationCap,
  Lightbulb,
  Loader2,
  Sparkles,
  Target,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

type Skill = {
  skill: string;
  level: string;
  confidence: number;
  evidence: string;
  source: string;
};

type StoredResumeData = {
  file_id?: string;
  original_filename?: string;
  resume_text?: string;
  skill_count?: number;
  skills?: Skill[];
};

type SkillCard = {
  name: string;
  level: string;
  confidence: number;
  evidence: string;
  source: string;
  icon: ReactNode;
};

const iconMap: Record<string, ReactNode> = {
  Python: <Brain size={20} />,
  SQL: <Database size={20} />,
  Excel: <FileText size={20} />,
  "Power BI": <Target size={20} />,
  Pandas: <Database size={20} />,
  "Machine Learning": <Brain size={20} />,
  "Generative AI": <Sparkles size={20} />,
  "Artificial Intelligence": <Brain size={20} />,
  "Data Analytics": <Target size={20} />,
};

export default function Skills() {
  const navigate = useNavigate();

  const [skills, setSkills] = useState<SkillCard[]>([]);
  const [resumeName, setResumeName] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const storedData = sessionStorage.getItem(
        "careerpilot_resume"
      );

      if (!storedData) {
        setLoading(false);
        return;
      }

      const data: StoredResumeData = JSON.parse(storedData);

      const backendSkills = data.skills ?? [];

      const formattedSkills: SkillCard[] = backendSkills.map(
        (skill) => ({
          name: skill.skill,
          level: skill.level,
          confidence: skill.confidence,
          evidence: skill.evidence,
          source: skill.source,
          icon:
            iconMap[skill.skill] ?? (
              <Sparkles size={20} />
            ),
        })
      );

      setSkills(formattedSkills);
      setResumeName(data.original_filename ?? "");
    } catch (error) {
      console.error(
        "Could not load resume skill data:",
        error
      );
    } finally {
      setLoading(false);
    }
  }, []);

  const handleContinue = () => {
    navigate("/role-select");
  };

  const getLevelClass = (level: string) => {
    if (level === "Advanced") {
      return "bg-emerald-500/10 text-emerald-400 border-emerald-500/20";
    }

    if (level === "Intermediate") {
      return "bg-violet-500/10 text-violet-400 border-violet-500/20";
    }

    return "bg-amber-500/10 text-amber-400 border-amber-500/20";
  };

  const averageConfidence =
    skills.length > 0
      ? Math.round(
          skills.reduce(
            (total, skill) => total + skill.confidence,
            0
          ) / skills.length
        )
      : 0;

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      {/* Header */}
      <header className="border-b border-white/10">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
          <button
            onClick={() => navigate("/parsing")}
            className="flex items-center gap-2 text-sm text-slate-400 transition hover:text-white"
          >
            <ArrowLeft size={18} />
            Back
          </button>

          <div className="text-lg font-bold">
            CareerPilot{" "}
            <span className="text-violet-400">
              AI
            </span>
          </div>

          <div className="text-sm text-slate-500">
            Step 3 of 10
          </div>
        </div>
      </header>

      {/* Progress */}
      <div className="border-b border-white/10">
        <div className="mx-auto flex max-w-7xl gap-1 px-6">
          <div className="h-1 flex-1 rounded-full bg-violet-500" />
          <div className="h-1 flex-1 rounded-full bg-violet-500" />
          <div className="h-1 flex-1 rounded-full bg-violet-500" />

          {Array.from({ length: 7 }).map((_, index) => (
            <div
              key={index}
              className="h-1 flex-1 rounded-full bg-white/10"
            />
          ))}
        </div>
      </div>

      {/* Main */}
      <main className="mx-auto max-w-7xl px-6 py-14">
        {/* Title */}
        <div className="text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-violet-500/10 text-violet-400">
            <Brain size={30} />
          </div>

          <div className="mt-6 inline-flex items-center gap-2 rounded-full border border-violet-500/20 bg-violet-500/10 px-4 py-2 text-xs font-medium text-violet-300">
            <Sparkles size={14} />
            AI Skill Extraction
          </div>

          <h1 className="mt-5 text-4xl font-bold">
            Skills detected from your resume
          </h1>

          <p className="mx-auto mt-4 max-w-2xl text-slate-400">
            CareerPilot analyzed your resume and identified
            skills that are explicitly supported by the
            uploaded document.
          </p>

          {resumeName && (
            <div className="mt-4 flex items-center justify-center gap-2 text-sm text-slate-500">
              <FileText size={15} />
              {resumeName}
            </div>
          )}
        </div>

        {/* Loading */}
        {loading && (
          <div className="mx-auto mt-12 flex max-w-xl items-center justify-center gap-3 rounded-2xl border border-white/10 bg-white/[0.03] p-8 text-slate-400">
            <Loader2
              size={22}
              className="animate-spin text-violet-400"
            />
            Loading extracted skills...
          </div>
        )}

        {/* Empty State */}
        {!loading && skills.length === 0 && (
          <div className="mx-auto mt-12 max-w-xl rounded-2xl border border-amber-500/20 bg-amber-500/5 p-8 text-center">
            <Lightbulb
              size={28}
              className="mx-auto text-amber-400"
            />

            <h2 className="mt-4 text-lg font-semibold">
              No skills detected
            </h2>

            <p className="mt-2 text-sm leading-6 text-slate-400">
              We could not detect any supported skills from
              this resume yet. Try uploading a resume with
              clearer skills or project descriptions.
            </p>
          </div>
        )}

        {/* Summary */}
        {!loading && skills.length > 0 && (
          <>
            <div className="mx-auto mt-12 grid max-w-5xl gap-4 md:grid-cols-4">
              <SummaryCard
                icon={<Target size={20} />}
                label="Skills Detected"
                value={skills.length.toString()}
              />

              <SummaryCard
                icon={<CheckCircle2 size={20} />}
                label="Explicit Skills"
                value={skills
                  .filter(
                    (skill) =>
                      skill.confidence >= 70
                  )
                  .length.toString()}
              />

              <SummaryCard
                icon={<Brain size={20} />}
                label="Avg Confidence"
                value={`${averageConfidence}%`}
              />

              <SummaryCard
                icon={<GraduationCap size={20} />}
                label="Source"
                value="Resume"
              />
            </div>

            {/* Skills */}
            <section className="mx-auto mt-10 max-w-5xl">
              <div className="mb-5 flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-semibold">
                    Detected Skills
                  </h2>

                  <p className="mt-1 text-sm text-slate-500">
                    Skills are supported by evidence found
                    in your resume.
                  </p>
                </div>

                <div className="rounded-lg border border-emerald-500/20 bg-emerald-500/10 px-3 py-2 text-xs text-emerald-400">
                  {skills.length} skills found
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                {skills.map((skill) => (
                  <div
                    key={skill.name}
                    className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 transition hover:border-violet-500/30 hover:bg-white/[0.05]"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-violet-500/10 text-violet-400">
                          {skill.icon}
                        </div>

                        <div>
                          <h3 className="font-semibold">
                            {skill.name}
                          </h3>

                          <span
                            className={`mt-1 inline-flex rounded-full border px-2 py-1 text-[11px] ${getLevelClass(
                              skill.level
                            )}`}
                          >
                            {skill.level}
                          </span>
                        </div>
                      </div>

                      <div className="text-right">
                        <div className="text-sm font-semibold text-white">
                          {skill.confidence}%
                        </div>

                        <div className="text-[11px] text-slate-600">
                          confidence
                        </div>
                      </div>
                    </div>

                    {/* Confidence */}
                    <div className="mt-5">
                      <div className="h-2 overflow-hidden rounded-full bg-white/10">
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-violet-500 to-cyan-400"
                          style={{
                            width: `${skill.confidence}%`,
                          }}
                        />
                      </div>
                    </div>

                    {/* Evidence */}
                    <div className="mt-5 rounded-xl border border-white/10 bg-black/10 p-4">
                      <div className="mb-2 flex items-center gap-2 text-xs font-medium text-slate-400">
                        <CheckCircle2
                          size={14}
                          className="text-emerald-400"
                        />
                        Resume Evidence
                      </div>

                      <p className="text-sm leading-6 text-slate-500">
                        "{skill.evidence}"
                      </p>
                    </div>

                    <div className="mt-4 flex items-center justify-between text-[11px] text-slate-600">
                      <span>
                        Source: {skill.source}
                      </span>

                      <span>
                        Evidence-based detection
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* AI Insight */}
            <section className="mx-auto mt-10 max-w-5xl">
              <div className="rounded-2xl border border-violet-500/20 bg-gradient-to-r from-violet-500/10 to-cyan-500/5 p-6">
                <div className="flex items-start gap-4">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-violet-500/10 text-violet-400">
                    <Lightbulb size={21} />
                  </div>

                  <div>
                    <h3 className="font-semibold">
                      CareerPilot Insight
                    </h3>

                    <p className="mt-2 text-sm leading-6 text-slate-400">
                      Your resume currently shows a strong
                      foundation in data and analytics-related
                      skills. In the next step, you can select
                      a target role and compare these skills
                      against its requirements.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* Continue */}
            <div className="mx-auto mt-10 flex max-w-5xl justify-end">
              <button
                onClick={handleContinue}
                className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-cyan-500 px-6 py-3.5 font-semibold transition hover:scale-[1.02]"
              >
                Continue to Role Selection
                <ArrowRight size={18} />
              </button>
            </div>
          </>
        )}
      </main>
    </div>
  );
}

function SummaryCard({
  icon,
  label,
  value,
}: {
  icon: ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-500/10 text-violet-400">
          {icon}
        </div>

        <div>
          <p className="text-xs text-slate-500">
            {label}
          </p>

          <p className="mt-1 text-xl font-bold">
            {value}
          </p>
        </div>
      </div>
    </div>
  );
}