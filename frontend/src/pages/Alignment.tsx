import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  CircleAlert,
  CircleX,
  Info,
  Sparkles,
  Target,
} from "lucide-react";

type MatchStatus = "matched" | "partial" | "missing";

type SkillMatch = {
  skill: string;
  required: string;
  current: string;
  status: MatchStatus;
  evidence: string;
  confidence: number;
  source: string;
};

type Role = {
  id: string;
  title: string;
  description: string;
  skills: string[];
};

type MatchingData = {
  role?: Role;
  matches?: SkillMatch[];
  summary?: {
    matched: number;
    partial: number;
    missing: number;
    total: number;
  };
  alignmentPreview?: number;
};

function StatusIcon({ status }: { status: MatchStatus }) {
  if (status === "matched") {
    return <CheckCircle2 className="h-4 w-4 text-emerald-400" />;
  }

  if (status === "partial") {
    return <CircleAlert className="h-4 w-4 text-amber-400" />;
  }

  return <CircleX className="h-4 w-4 text-rose-400" />;
}

function StatusText({ status }: { status: MatchStatus }) {
  if (status === "matched") {
    return <span className="text-emerald-300">Matched</span>;
  }

  if (status === "partial") {
    return <span className="text-amber-300">Partial</span>;
  }

  return <span className="text-rose-300">Missing</span>;
}

export default function Alignment() {
  const navigate = useNavigate();

  const [matchingData, setMatchingData] =
    useState<MatchingData | null>(null);

  useEffect(() => {
    const storedMatching = sessionStorage.getItem(
      "careerpilot_matching",
    );

    if (!storedMatching) {
      return;
    }

    try {
      const parsedData: MatchingData =
        JSON.parse(storedMatching);

      setMatchingData(parsedData);
    } catch (error) {
      console.error(
        "Could not read matching data:",
        error,
      );
    }
  }, []);

  const matches = matchingData?.matches || [];
  const role = matchingData?.role;

  const summary = useMemo(() => {
    return {
      matched: matches.filter(
        (item) => item.status === "matched",
      ).length,

      partial: matches.filter(
        (item) => item.status === "partial",
      ).length,

      missing: matches.filter(
        (item) => item.status === "missing",
      ).length,

      total: matches.length,
    };
  }, [matches]);

  const alignment = useMemo(() => {
    if (matches.length === 0) {
      return 0;
    }

    const totalWeight = matches.length * 100;

    const earnedWeight = matches.reduce(
      (total, match) => {
        if (match.status === "matched") {
          return total + 100;
        }

        if (match.status === "partial") {
          return total + 50;
        }

        return total;
      },
      0,
    );

    return Math.round(
      (earnedWeight / totalWeight) * 100,
    );
  }, [matches]);

  const matchedPercentage =
    summary.total > 0
      ? Math.round(
          (summary.matched / summary.total) * 100,
        )
      : 0;

  const partialPercentage =
    summary.total > 0
      ? Math.round(
          (summary.partial / summary.total) * 100,
        )
      : 0;

  const missingPercentage =
    summary.total > 0
      ? Math.round(
          (summary.missing / summary.total) * 100,
        )
      : 0;

  /*
   * IMPORTANT:
   * Save alignment data as soon as the Alignment page
   * has valid matching data.
   *
   * This prevents Gaps from losing the data if the user
   * refreshes the Alignment page or reaches it through
   * another navigation path.
   */
  useEffect(() => {
    if (!matchingData || !role || matches.length === 0) {
      return;
    }

    const alignmentData = {
      role,
      alignment,
      summary,
      matches,
    };

    sessionStorage.setItem(
      "careerpilot_alignment",
      JSON.stringify(alignmentData),
    );
  }, [
    matchingData,
    role,
    matches,
    alignment,
    summary,
  ]);

  const handleContinue = () => {
    if (!matchingData || !role || matches.length === 0) {
      return;
    }

    const alignmentData = {
      role,
      alignment,
      summary,
      matches,
    };

    sessionStorage.setItem(
      "careerpilot_alignment",
      JSON.stringify(alignmentData),
    );

    navigate("/gaps");
  };

  if (!matchingData || !role) {
    return (
      <div className="min-h-screen bg-slate-950 text-white">
        <div className="mx-auto flex min-h-screen max-w-2xl items-center justify-center px-6">
          <div className="w-full rounded-2xl border border-slate-800 bg-slate-900/70 p-8 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-500/10">
              <CircleAlert className="h-7 w-7 text-amber-300" />
            </div>

            <h1 className="mt-5 text-2xl font-bold">
              Matching data not found
            </h1>

            <p className="mt-3 text-sm leading-6 text-slate-400">
              Please complete skill matching before viewing
              your alignment estimate.
            </p>

            <button
              onClick={() => navigate("/matching")}
              className="mt-6 inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-cyan-500 px-5 py-3 text-sm font-semibold"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Matching
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute left-1/4 top-0 h-96 w-96 rounded-full bg-violet-600/10 blur-3xl" />
        <div className="absolute right-0 top-1/3 h-96 w-96 rounded-full bg-cyan-500/10 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-7xl px-6 py-8 lg:px-8">
        <div className="mb-10 flex items-center justify-between">
          <button
            onClick={() => navigate("/matching")}
            className="flex items-center gap-2 text-sm text-slate-400 transition hover:text-white"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Matching
          </button>

          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-cyan-400">
              <Sparkles className="h-5 w-5 text-white" />
            </div>

            <span className="text-lg font-semibold tracking-tight">
              CareerPilot AI
            </span>
          </div>
        </div>

        <div className="mb-12">
          <div className="mb-3 flex items-center justify-between text-xs">
            <span className="font-medium text-violet-300">
              Step 6 of 10
            </span>

            <span className="text-slate-500">
              60% complete
            </span>
          </div>

          <div className="h-1.5 overflow-hidden rounded-full bg-slate-800">
            <div className="h-full w-[60%] rounded-full bg-gradient-to-r from-violet-500 to-cyan-400" />
          </div>
        </div>

        <div className="mx-auto mb-10 max-w-3xl text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-violet-500/20 bg-violet-500/10 px-4 py-2 text-xs font-medium text-violet-300">
            <Target className="h-3.5 w-3.5" />
            Role Alignment
          </div>

          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
            Your Role Alignment Estimate
          </h1>

          <p className="mt-5 text-base leading-7 text-slate-400 sm:text-lg">
            Your current skill evidence compared with the
            selected framework for{" "}
            <span className="font-semibold text-white">
              {role.title}
            </span>
            .
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
          <div className="rounded-3xl border border-slate-800 bg-slate-900/60 p-8 backdrop-blur-xl">
            <div className="flex flex-col items-center justify-center">
              <div
                className="relative flex h-64 w-64 items-center justify-center rounded-full"
                style={{
                  background: `conic-gradient(
                    rgb(139 92 246) ${alignment}%,
                    rgb(30 41 59) ${alignment}% 100%
                  )`,
                }}
              >
                <div className="flex h-52 w-52 flex-col items-center justify-center rounded-full bg-slate-950">
                  <span className="text-6xl font-bold tracking-tight">
                    {alignment}%
                  </span>

                  <span className="mt-2 text-sm text-slate-500">
                    Role alignment
                  </span>
                </div>
              </div>

              <div className="mt-8 text-center">
                <h2 className="text-xl font-semibold">
                  {role.title}
                </h2>

                <p className="mt-2 max-w-xl text-sm leading-6 text-slate-500">
                  This estimate reflects the skills currently
                  detected in your resume against the selected
                  role framework.
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-3xl border border-slate-800 bg-slate-900/60 p-6">
            <div className="mb-6 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-500/10">
                <Sparkles className="h-5 w-5 text-cyan-300" />
              </div>

              <div>
                <h2 className="font-semibold">
                  Alignment Breakdown
                </h2>

                <p className="text-xs text-slate-500">
                  Based on {summary.total} required skills
                </p>
              </div>
            </div>

            <div className="mb-5">
              <div className="mb-2 flex items-center justify-between text-sm">
                <span className="text-slate-400">
                  Matched
                </span>

                <span className="font-semibold text-emerald-300">
                  {summary.matched}
                </span>
              </div>

              <div className="h-2 overflow-hidden rounded-full bg-slate-800">
                <div
                  className="h-full rounded-full bg-emerald-400"
                  style={{
                    width: `${matchedPercentage}%`,
                  }}
                />
              </div>
            </div>

            <div className="mb-5">
              <div className="mb-2 flex items-center justify-between text-sm">
                <span className="text-slate-400">
                  Partial
                </span>

                <span className="font-semibold text-amber-300">
                  {summary.partial}
                </span>
              </div>

              <div className="h-2 overflow-hidden rounded-full bg-slate-800">
                <div
                  className="h-full rounded-full bg-amber-400"
                  style={{
                    width: `${partialPercentage}%`,
                  }}
                />
              </div>
            </div>

            <div>
              <div className="mb-2 flex items-center justify-between text-sm">
                <span className="text-slate-400">
                  Missing
                </span>

                <span className="font-semibold text-rose-300">
                  {summary.missing}
                </span>
              </div>

              <div className="h-2 overflow-hidden rounded-full bg-slate-800">
                <div
                  className="h-full rounded-full bg-rose-400"
                  style={{
                    width: `${missingPercentage}%`,
                  }}
                />
              </div>
            </div>

            <div className="mt-8 rounded-xl border border-violet-500/20 bg-violet-500/5 p-4">
              <p className="text-xs leading-5 text-slate-400">
                <span className="font-semibold text-violet-300">
                  Calculation:
                </span>{" "}
                matched skills contribute 100%, partial skills
                contribute 50%, and missing skills contribute 0%.
              </p>
            </div>
          </div>
        </div>

        <div className="mt-8 rounded-2xl border border-slate-800 bg-slate-900/60 p-6">
          <div className="flex items-start gap-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-violet-500/10">
              <Info className="h-5 w-5 text-violet-300" />
            </div>

            <div>
              <h3 className="font-semibold text-white">
                How to interpret this estimate
              </h3>

              <p className="mt-2 text-sm leading-6 text-slate-400">
                This number represents alignment with the selected
                skill framework based on evidence found in your
                resume. It is not a hiring probability, hiring
                prediction, or guarantee of employment.
              </p>
            </div>
          </div>
        </div>

        <div className="mt-8 overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/60">
          <div className="border-b border-slate-800 px-6 py-5">
            <div className="flex items-center gap-3">
              <Target className="h-5 w-5 text-slate-400" />

              <div>
                <h2 className="font-semibold">
                  Skill Weight Breakdown
                </h2>

                <p className="mt-1 text-xs text-slate-500">
                  Each required skill contributes equally to
                  this estimate.
                </p>
              </div>
            </div>
          </div>

          <div className="divide-y divide-slate-800">
            {matches.map((match) => {
              const contribution =
                match.status === "matched"
                  ? 100
                  : match.status === "partial"
                    ? 50
                    : 0;

              return (
                <div
                  key={match.skill}
                  className="grid gap-4 px-6 py-5 md:grid-cols-[1.4fr_1fr_1fr_120px] md:items-center"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <StatusIcon status={match.status} />

                      <span className="font-medium text-white">
                        {match.skill}
                      </span>
                    </div>

                    <p className="mt-1 pl-6 text-xs text-slate-600">
                      Required: {match.required}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-slate-500">
                      Current
                    </p>

                    <p className="mt-1 text-sm">
                      {match.current}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-slate-500">
                      Status
                    </p>

                    <p className="mt-1 text-sm">
                      <StatusText status={match.status} />
                    </p>
                  </div>

                  <div className="md:text-right">
                    <p className="text-xs text-slate-500">
                      Contribution
                    </p>

                    <p className="mt-1 text-lg font-semibold">
                      {contribution}%
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="mt-8 rounded-2xl border border-cyan-500/20 bg-gradient-to-r from-cyan-500/5 to-violet-500/5 p-6">
          <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-xs font-medium uppercase tracking-wider text-cyan-300">
                Next Step
              </p>

              <h3 className="mt-1 text-lg font-semibold">
                Identify your skill gaps
              </h3>

              <p className="mt-1 text-sm text-slate-500">
                We'll turn the missing and partial skills into a
                personalized learning plan.
              </p>
            </div>

            <button
              onClick={handleContinue}
              className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-cyan-500 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-violet-950/30 transition hover:scale-[1.01]"
            >
              Continue to Skill Gaps
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>

        <div className="mt-8 flex justify-start">
          <button
            onClick={() => navigate("/matching")}
            className="inline-flex items-center gap-2 rounded-xl border border-slate-800 px-5 py-3 text-sm font-medium text-slate-300 transition hover:border-slate-700 hover:bg-slate-900 hover:text-white"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Matching
          </button>
        </div>

        <p className="mt-8 text-center text-xs text-slate-600">
          CareerPilot AI uses resume evidence and a deterministic
          skill framework to calculate this alignment estimate.
        </p>
      </div>
    </div>
  );
}