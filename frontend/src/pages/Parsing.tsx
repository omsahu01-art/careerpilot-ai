import { useEffect, useState } from "react";
import { CheckCircle2, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Parsing() {
  const navigate = useNavigate();

  const steps = [
    "Resume received",
    "Reading resume",
    "Extracting sections",
    "Detecting skills",
    "Preparing analysis",
  ];

  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    if (currentStep < steps.length - 1) {
      const timer = setTimeout(() => {
        setCurrentStep((prev) => prev + 1);
      }, 700);

      return () => clearTimeout(timer);
    } else {
      const timer = setTimeout(() => {
        navigate("/skills");
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, [currentStep, navigate]);

  return (
    <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center px-6">
      <div className="w-full max-w-2xl rounded-3xl border border-white/10 bg-white/[0.03] p-10">
        <h1 className="text-3xl font-bold text-center">
          Analyzing Resume
        </h1>

        <p className="mt-3 text-center text-slate-400">
          CareerPilot AI is understanding your profile...
        </p>

        <div className="mt-10 space-y-4">
          {steps.map((step, index) => (
            <div
              key={step}
              className="flex items-center gap-4 rounded-xl border border-white/10 p-4"
            >
              {index < currentStep ? (
                <CheckCircle2 className="text-emerald-400" />
              ) : index === currentStep ? (
                <Loader2 className="animate-spin text-violet-400" />
              ) : (
                <div className="h-5 w-5 rounded-full border border-slate-600" />
              )}

              <span
                className={
                  index <= currentStep
                    ? "text-white"
                    : "text-slate-500"
                }
              >
                {step}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
