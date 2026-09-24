import { useState } from "react";
import {
  Bot,
  ChevronDown,
  MessageCircle,
  Send,
  Sparkles,
  X,
} from "lucide-react";

type Message = {
  id: number;
  sender: "bot" | "user";
  text: string;
};

const starterQuestions = [
  "Meri sabse important skill gap kya hai?",
  "Mera selected role kaisa match karta hai?",
  "Mujhe apna roadmap samjhao.",
  "Mujhe ek project suggest karo.",
];

const API_BASE_URL = "http://127.0.0.1:8000";

function getCareerContext() {
  try {
    const resume = JSON.parse(
      sessionStorage.getItem("careerpilot_resume") || "null",
    );

    const role = JSON.parse(
      sessionStorage.getItem("careerpilot_role") || "null",
    );

    const alignment = JSON.parse(
      sessionStorage.getItem("careerpilot_alignment") || "null",
    );

    const gaps = JSON.parse(
      sessionStorage.getItem("careerpilot_gaps") || "null",
    );

    const roadmap = JSON.parse(
      sessionStorage.getItem("careerpilot_roadmap") || "null",
    );

    const project = JSON.parse(
      sessionStorage.getItem("careerpilot_project") || "null",
    );

    return {
      resume,
      role,
      alignment,
      gaps,
      roadmap,
      project,
    };
  } catch {
    return {
      resume: null,
      role: null,
      alignment: null,
      gaps: null,
      roadmap: null,
      project: null,
    };
  }
}

export default function CareerAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      sender: "bot",
      text: "Hi! I'm your CareerPilot Assistant. Ask me about your skills, role alignment, skill gaps, roadmap, or projects.",
    },
  ]);

  const sendMessage = async (messageText?: string) => {
    const text = (messageText ?? input).trim();

    if (!text || isLoading) {
      return;
    }

    const userMessage: Message = {
      id: Date.now(),
      sender: "user",
      text,
    };

    setMessages((currentMessages) => [
      ...currentMessages,
      userMessage,
    ]);

    setInput("");
    setIsLoading(true);

    try {
      const context = getCareerContext();

      const response = await fetch(
        `${API_BASE_URL}/api/chat`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            message: text,
            context,
          }),
        },
      );

      if (!response.ok) {
        throw new Error(
          `Chat request failed with status ${response.status}`,
        );
      }

      const data = await response.json();

      const botMessage: Message = {
        id: Date.now() + 1,
        sender: "bot",
        text:
          data.message ||
          "I received your message, but I could not generate a response.",
      };

      setMessages((currentMessages) => [
        ...currentMessages,
        botMessage,
      ]);
    } catch (error) {
      console.error("Career Assistant error:", error);

      const errorMessage: Message = {
        id: Date.now() + 1,
        sender: "bot",
        text:
          "I'm unable to connect to the CareerPilot backend right now. Please make sure the FastAPI server is running and try again.",
      };

      setMessages((currentMessages) => [
        ...currentMessages,
        errorMessage,
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (
    event: React.FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();
    sendMessage();
  };

  if (!isOpen) {
    return (
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-50 flex items-center gap-3 rounded-full bg-slate-950 px-5 py-3.5 text-white shadow-2xl shadow-slate-900/20 transition hover:-translate-y-1 hover:bg-slate-800"
        aria-label="Open CareerPilot Assistant"
      >
        <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10">
          <Bot size={20} />
        </span>

        <span className="hidden text-sm font-semibold sm:inline">
          Career Assistant
        </span>

        <Sparkles
          size={17}
          className="text-amber-300"
        />
      </button>
    );
  }

  return (
    <div className="fixed bottom-5 right-5 z-50 w-[calc(100vw-2.5rem)] max-w-[390px]">
      <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-2xl shadow-slate-900/20">

        {/* Header */}
        <div className="flex items-center justify-between bg-slate-950 px-4 py-4 text-white">
          <div className="flex min-w-0 items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-white/10">
              <Bot size={21} />
            </div>

            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <p className="truncate text-sm font-bold">
                  CareerPilot Assistant
                </p>

                <span className="h-2 w-2 rounded-full bg-emerald-400" />
              </div>

              <p className="text-xs text-slate-300">
                Career guidance based on your analysis
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() =>
                setIsMinimized((value) => !value)
              }
              className="rounded-lg p-2 text-slate-300 transition hover:bg-white/10 hover:text-white"
              aria-label={
                isMinimized
                  ? "Expand assistant"
                  : "Minimize assistant"
              }
            >
              <ChevronDown
                size={18}
                className={
                  isMinimized ? "rotate-180" : ""
                }
              />
            </button>

            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="rounded-lg p-2 text-slate-300 transition hover:bg-white/10 hover:text-white"
              aria-label="Close assistant"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {!isMinimized && (
          <>
            {/* Messages */}
            <div className="max-h-[390px] min-h-[260px] space-y-3 overflow-y-auto bg-slate-50 p-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${
                    message.sender === "user"
                      ? "justify-end"
                      : "justify-start"
                  }`}
                >
                  <div
                    className={`max-w-[86%] rounded-2xl px-4 py-3 text-sm leading-6 ${
                      message.sender === "user"
                        ? "rounded-br-md bg-slate-950 text-white"
                        : "rounded-bl-md border border-slate-200 bg-white text-slate-700"
                    }`}
                  >
                    {message.text}
                  </div>
                </div>
              ))}

              {isLoading && (
                <div className="flex justify-start">
                  <div className="rounded-2xl rounded-bl-md border border-slate-200 bg-white px-4 py-3 text-sm text-slate-500">
                    <div className="flex items-center gap-2">
                      <span>Thinking</span>

                      <span className="flex gap-1">
                        <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-slate-400" />
                        <span
                          className="h-1.5 w-1.5 animate-bounce rounded-full bg-slate-400"
                          style={{
                            animationDelay: "120ms",
                          }}
                        />
                        <span
                          className="h-1.5 w-1.5 animate-bounce rounded-full bg-slate-400"
                          style={{
                            animationDelay: "240ms",
                          }}
                        />
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Starter questions */}
            {messages.length === 1 && (
              <div className="border-t border-slate-100 bg-white px-4 py-3">
                <div className="mb-2 flex items-center gap-2">
                  <MessageCircle
                    size={14}
                    className="text-slate-400"
                  />

                  <p className="text-xs font-semibold text-slate-500">
                    Try asking
                  </p>
                </div>

                <div className="flex flex-wrap gap-2">
                  {starterQuestions.map(
                    (question) => (
                      <button
                        key={question}
                        type="button"
                        onClick={() =>
                          sendMessage(question)
                        }
                        disabled={isLoading}
                        className="rounded-full border border-slate-200 bg-white px-3 py-2 text-left text-xs font-medium text-slate-600 transition hover:border-slate-400 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        {question}
                      </button>
                    ),
                  )}
                </div>
              </div>
            )}

            {/* Input */}
            <form
              onSubmit={handleSubmit}
              className="border-t border-slate-200 bg-white p-3"
            >
              <div className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 p-1.5 focus-within:border-slate-400">
                <input
                  type="text"
                  value={input}
                  onChange={(event) =>
                    setInput(event.target.value)
                  }
                  placeholder="Ask about your career..."
                  disabled={isLoading}
                  className="min-w-0 flex-1 bg-transparent px-3 py-2 text-sm text-slate-800 outline-none placeholder:text-slate-400 disabled:opacity-50"
                />

                <button
                  type="submit"
                  disabled={
                    !input.trim() || isLoading
                  }
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-950 text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-40"
                  aria-label="Send message"
                >
                  <Send size={17} />
                </button>
              </div>

              <p className="mt-2 px-1 text-[10px] leading-4 text-slate-400">
                CareerPilot Assistant uses your existing
                career analysis context.
              </p>
            </form>
          </>
        )}
      </div>
    </div>
  );
}