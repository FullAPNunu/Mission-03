import { useMemo, useState, useRef, useEffect } from "react";
import ReactMarkdown from "react-markdown";

export default function App() {
  // UI state
  const [jobTitle, setJobTitle] = useState("");
  const [log, setLog] = useState([
    { role: "interviewer", text: "Tell me about yourself." },
  ]);
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const chatContainerRef = useRef(null);
  const lastMessageRef = useRef(null);

  // ---- constants ----
  const MODEL = "gemini-2.5-flash";
  const API_URL = "http://localhost:5050/interview"; // use "/interview" if proxying via Vite
  const MAX_QUESTIONS = 7;

  // Count interviewer questions
  const qCount = useMemo(
    () => log.filter((m) => m.role === "interviewer").length,
    [log]
  );
  const reachedLimit = qCount >= MAX_QUESTIONS;

  // Scroll to Top of the latest message when log changes
  useEffect(() => {
    if (lastMessageRef.current) {
      lastMessageRef.current.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  }, [log]);

  // Map our UI log -> backend "messages" format with dynamic instruction
  function toBackendMessages(uiLog, nextUserText) {
    const systemMsg = {
      role: "system",
      content:
        `You are an expert interviewer for the role: ${jobTitle}.\n` +
        `Questions asked so far: ${qCount}.\n` +
        (qCount < 6
          ? [
              `- Ask exactly ONE new, targeted question next.`,
              `- Keep it 1–2 sentences, no preamble.`,
              `- Adapt to the user's latest answer and ${jobTitle} competencies.`,
              `- If you have asked ${MAX_QUESTIONS} questions already, say "Thank you for your time. Let's proceed to the final evaluation."`,
            ].join("\n")
          : [
              `- Do NOT ask any more questions.`,
              `- Provide a Final Evaluation only with:`,
              `  1) Strengths`,
              `  2) Areas to improve`,
              `  3) 3 concrete tips for ${jobTitle}`,
              `  4) Overall rating out of 10`,
              `- Keep it concise and actionable.`,
            ].join("\n")),
    };

    // Convert UI turns (interviewer->assistant, user->user)
    const history = uiLog.map((m) => ({
      role: m.role === "interviewer" ? "assistant" : "user",
      content: m.text,
    }));

    return [systemMsg, ...history, { role: "user", content: nextUserText }];
  }

  async function sendAnswer() {
    setErrorMsg("");
    const trimmed = answer.trim();
    if (!trimmed || loading) return;

    setLoading(true);
    try {
      const messages = toBackendMessages(log, trimmed);
      const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ model: MODEL, messages }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || `HTTP ${res.status}`);
      }
      const data = await res.json(); // { model, role:"assistant", text }

      // Append my answer + model reply
      setLog((prev) => [
        ...prev,
        { role: "user", text: trimmed },
        { role: "interviewer", text: data.text ?? "(no reply)" },
      ]);
      setAnswer("");
    } catch (e) {
      console.error(e);
      setErrorMsg(e.message || "Request failed");
    } finally {
      setLoading(false);
    }
  }

  function restart() {
    setLog([{ role: "interviewer", text: "Tell me about yourself." }]);
    setAnswer("");
    setErrorMsg("");
  }

  return (
    <div className="min-h-screen bg-gray-800">
      <div className="max-w-2xl mx-auto my-8 font-sans">
        <div className="border-2 border-primary p-4 mb-4 text-center rounded-lg">
          <h1 className="text-5xl font-bold mb-2 text-white text-center">
            Turner&apos;s AI Interviewer
          </h1>
        </div>

        {/* Radial Progress Bar */}
        <div className="flex justify-center mb-4">
          <div
            className="radial-progress text-primary"
            style={{
              "--value": (qCount / MAX_QUESTIONS) * 100,
              "--size": "2.8rem",
            }}
            role="progressbar"
          >
            {Math.min(qCount, MAX_QUESTIONS)} / {MAX_QUESTIONS}
          </div>
        </div>

        {/* Job title input */}
        <label className="block mb-4 text-white">
          <span className="font-semibold text-xl">Job Title:&nbsp;</span>
          <input
            value={jobTitle}
            onChange={(e) => setJobTitle(e.target.value)}
            placeholder="e.g. Junior Developer"
            className="input input-bordered input-lg w-80 bg-gray-100 text-primary rounded-xl"
            disabled={loading}
          />
        </label>

        {/* Conversation Log */}
        <div
          ref={chatContainerRef}
          className="h-96 min-h-[400px] overflow-y-auto bg-white my-4 shadow-lg text-lg p-4 rounded-lg flex flex-col gap-2"
        >
          {log.map((m, i) => (
            <div
              key={i}
              ref={i === log.length - 1 ? lastMessageRef : null}
              className={`chat ${
                m.role === "user" ? "chat-end" : "chat-start"
              }`}
            >
              <div
                className={`chat-bubble ${
                  m.role === "user"
                    ? "bg-primary text-white"
                    : "bg-black text-white"
                }`}
              >
                <span className="font-bold mr-2">
                  {m.role === "interviewer" ? "Interviewer" : "Me"}:
                </span>
                <ReactMarkdown>{m.text}</ReactMarkdown>
              </div>
            </div>
          ))}
        </div>

        {/* Error */}
        {errorMsg && (
          <div className="text-red-300 bg-red-900/40 border border-red-700 rounded-md px-3 py-2 mb-3">
            {errorMsg}
          </div>
        )}

        {/* Answer input + buttons */}
        <div className="flex items-center gap-2">
          <textarea
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            placeholder={
              reachedLimit
                ? "Interview completed! Click Restart to begin a new interview."
                : "Type your answer…"
            }
            className="textarea textarea-primary textarea-lg flex-1 bg-gray-100 text-gray-800 rounded-xl"
            disabled={loading || reachedLimit}
          />
        </div>

        {!reachedLimit ? (
          <button
            onClick={sendAnswer}
            disabled={loading || !answer.trim()}
            className={`btn btn-lg btn-block mt-4 ${
              loading ? "btn-disabled" : "btn-primary"
            }`}
          >
            {loading ? "Thinking…" : "Submit"}
          </button>
        ) : (
          <div className="flex gap-3 mt-4">
            <button onClick={restart} className="btn btn-lg btn-info flex-1">
              Restart Interview
            </button>
          </div>
        )}

        {loading && (
          <div className="flex justify-center my-4">
            <span className="loading loading-dots loading-xl"></span>
          </div>
        )}

        {/* Small hint
        <p className="text-gray-300 mt-3 text-sm">
          Model: <code>{MODEL}</code> • Endpoint: <code>{API_URL}</code>
        </p> */}
      </div>
    </div>
  );
}
