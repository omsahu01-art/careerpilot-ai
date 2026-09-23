import { useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  FileText,
  Loader2,
  UploadCloud,
  X,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

type Skill = {
  skill: string;
  level: string;
  confidence: number;
  evidence: string;
  source: string;
};

type UploadResponse = {
  status: string;
  message: string;
  file_id: string;
  original_filename: string;
  file_type: string;
  file_size: number;
  text_length: number;
  skill_count: number;
  skills: Skill[];
  resume_text: string;
};

type ErrorResponse = {
  detail?: string;
};

export default function Upload() {
  const navigate = useNavigate();

  const [file, setFile] = useState<File | null>(null);
  const [dragging, setDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  const handleFile = (selectedFile: File | undefined) => {
    if (!selectedFile) return;

    setError("");

    const allowedTypes = [
      "application/pdf",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];

    const allowedExtensions = [".pdf", ".docx"];
    const fileName = selectedFile.name.toLowerCase();

    const isValidType =
      allowedTypes.includes(selectedFile.type) ||
      allowedExtensions.some((extension) =>
        fileName.endsWith(extension)
      );

    if (!isValidType) {
      setError("Please upload a PDF or DOCX resume.");
      return;
    }

    const maxSize = 10 * 1024 * 1024;

    if (selectedFile.size > maxSize) {
      setError("Resume size must be less than 10 MB.");
      return;
    }

    setFile(selectedFile);
  };

  const handleDrop = (
    event: React.DragEvent<HTMLDivElement>
  ) => {
    event.preventDefault();
    setDragging(false);

    const droppedFile = event.dataTransfer.files[0];

    handleFile(droppedFile);
  };

  const handleContinue = async () => {
    if (!file || uploading) return;

    setUploading(true);
    setError("");

    try {
      const formData = new FormData();

      formData.append("file", file);

      const response = await fetch(
        "http://127.0.0.1:8000/api/resume/upload",
        {
          method: "POST",
          body: formData,
        }
      );

      const data: UploadResponse | ErrorResponse =
        await response.json();

      if (!response.ok) {
        const errorMessage =
          "detail" in data && data.detail
            ? data.detail
            : "Resume upload failed.";

        throw new Error(errorMessage);
      }

      const uploadData = data as UploadResponse;

      /*
       * Store the backend response so the Skills page
       * can use the real extracted resume data.
       */
      sessionStorage.setItem(
        "careerpilot_resume",
        JSON.stringify(uploadData)
      );

      console.log(
        "CareerPilot resume data saved:",
        uploadData
      );

      navigate("/parsing");
    } catch (uploadError) {
      console.error(
        "Resume upload error:",
        uploadError
      );

      if (uploadError instanceof Error) {
        setError(uploadError.message);
      } else {
        setError(
          "Unable to upload resume. Please make sure the backend is running."
        );
      }
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      {/* Header */}
      <header className="border-b border-white/10">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
          <button
            onClick={() => navigate("/")}
            className="flex items-center gap-2 text-sm text-slate-400 transition hover:text-white"
          >
            <ArrowLeft size={18} />
            Back to Home
          </button>

          <div className="text-lg font-bold">
            CareerPilot{" "}
            <span className="text-violet-400">
              AI
            </span>
          </div>

          <div className="text-sm text-slate-500">
            Step 1 of 10
          </div>
        </div>
      </header>

      {/* Progress */}
      <div className="border-b border-white/10">
        <div className="mx-auto flex max-w-7xl gap-1 px-6">
          <div className="h-1 flex-1 rounded-full bg-violet-500" />

          {Array.from({ length: 9 }).map(
            (_, index) => (
              <div
                key={index}
                className="h-1 flex-1 rounded-full bg-white/10"
              />
            )
          )}
        </div>
      </div>

      {/* Main */}
      <main className="mx-auto max-w-4xl px-6 py-16">
        <div className="text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-violet-500/10 text-violet-400">
            <FileText size={30} />
          </div>

          <h1 className="mt-6 text-4xl font-bold">
            Upload your resume
          </h1>

          <p className="mx-auto mt-4 max-w-xl text-slate-400">
            CareerPilot AI will analyze your resume to
            understand your skills, experience, projects,
            education, and certifications.
          </p>
        </div>

        {/* Upload Box */}
        <div
          onDragOver={(event) => {
            event.preventDefault();
            setDragging(true);
          }}
          onDragLeave={() => setDragging(false)}
          onDrop={handleDrop}
          className={`mx-auto mt-12 max-w-2xl rounded-3xl border-2 border-dashed p-10 text-center transition ${
            dragging
              ? "border-violet-400 bg-violet-500/10"
              : "border-white/10 bg-white/[0.03] hover:border-violet-400/50"
          }`}
        >
          {!file ? (
            <>
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-cyan-500/10 text-cyan-400">
                <UploadCloud size={30} />
              </div>

              <h2 className="mt-6 text-xl font-semibold">
                Drop your resume here
              </h2>

              <p className="mt-2 text-sm text-slate-500">
                or choose a file from your computer
              </p>

              <label className="mt-6 inline-flex cursor-pointer items-center gap-2 rounded-xl bg-white px-6 py-3 font-semibold text-slate-950 transition hover:scale-[1.02]">
                <UploadCloud size={18} />
                Choose Resume

                <input
                  type="file"
                  accept=".pdf,.docx"
                  className="hidden"
                  onChange={(event) =>
                    handleFile(
                      event.target.files?.[0]
                    )
                  }
                />
              </label>

              <p className="mt-5 text-xs text-slate-600">
                Supported formats: PDF, DOCX • Maximum
                10 MB
              </p>
            </>
          ) : (
            <>
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-400">
                <CheckCircle2 size={30} />
              </div>

              <h2 className="mt-6 text-xl font-semibold">
                Resume ready
              </h2>

              <p className="mt-2 break-all text-sm text-slate-400">
                {file.name}
              </p>

              <p className="mt-1 text-xs text-slate-600">
                {(file.size / 1024 / 1024).toFixed(
                  2
                )}{" "}
                MB
              </p>

              <button
                onClick={() => {
                  setFile(null);
                  setError("");
                }}
                disabled={uploading}
                className="mt-5 inline-flex items-center gap-2 rounded-lg border border-white/10 px-4 py-2 text-sm text-slate-400 transition hover:bg-white/5 hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
              >
                <X size={16} />
                Remove
              </button>
            </>
          )}
        </div>

        {/* Error */}
        {error && (
          <div className="mx-auto mt-5 max-w-2xl rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-center text-sm text-red-300">
            {error}
          </div>
        )}

        {/* Continue */}
        <div className="mx-auto mt-8 flex max-w-2xl justify-end">
          <button
            onClick={handleContinue}
            disabled={!file || uploading}
            className={`flex items-center gap-2 rounded-xl px-6 py-3.5 font-semibold transition ${
              file && !uploading
                ? "bg-gradient-to-r from-violet-600 to-cyan-500 hover:scale-[1.02]"
                : "cursor-not-allowed bg-white/10 text-slate-600"
            }`}
          >
            {uploading ? (
              <>
                <Loader2
                  size={18}
                  className="animate-spin"
                />
                Analyzing Resume...
              </>
            ) : (
              <>
                Continue to Analysis
                <ArrowRight size={18} />
              </>
            )}
          </button>
        </div>

        {/* Privacy Note */}
        <div className="mx-auto mt-10 max-w-2xl rounded-xl border border-white/10 bg-white/[0.02] p-4 text-center">
          <p className="text-xs leading-5 text-slate-500">
            Your resume is uploaded to the CareerPilot AI
            backend for processing. The system extracts
            text and detects skills using evidence found
            in your resume.
          </p>
        </div>
      </main>
    </div>
  );
}