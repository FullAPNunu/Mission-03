import { useMemo, useState } from "react";

export default function App() {
  // UI state
  const [jobTitle, setJobTitle] = useState("Junior Developer");
  const [log, setLog] = useState([
    { role: "interviewer", text: "Tell me about yourself." },
  ]);
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

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

    return [
      systemMsg,
      ...history,
      { role: "user", content: nextUserText },
    ];
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
        <h1 className="text-5xl font-bold mb-2 text-white text-center">
          Turner&apos;s AI Interviewer
        </h1>
        <p className="text-center text-gray-300 mb-6">
          Progress: <strong>{Math.min(qCount, MAX_QUESTIONS)}</strong> / {MAX_QUESTIONS}
        </p>

        {/* Job title input */}
        <label className="block mb-4 text-white">
          <span className="font-semibold text-xl">Job Title:&nbsp;</span>
          <input
            value={jobTitle}
            onChange={(e) => setJobTitle(e.target.value)}
            placeholder="e.g., Junior Developer"
            className="input input-bordered input-lg w-80 bg-gray-100 text-gray-800 rounded-xl"
            disabled={loading}
          />
        </label>

        {/* Conversation Log */}
        <div className="border rounded-lg p-6 h-96 min-h-[400px] overflow-y-auto bg-white my-4 shadow-lg text-lg text-black">
          {log.map((m, i) => (
            <div key={i} className="mb-2">
              <strong>{m.role === "interviewer" ? "Interviewer" : "Me"}:</strong>{" "}
              {m.text}
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
                ? "Interview complete. Click Finalize to get the evaluation, or Restart."
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
            className={`btn btn-lg btn-block mt-4 ${loading ? "btn-disabled" : "btn-primary"}`}
          >
            {loading ? "Thinking…" : "Submit"}
          </button>
        ) : (
          <div className="flex gap-3 mt-4">
            <button onClick={restart} className="btn btn-lg btn-secondary flex-1">
              Restart Interview
            </button>
          </div>
        )}

        {/* Small hint */}
        <p className="text-gray-300 mt-3 text-sm">
          Model: <code>{MODEL}</code> • Endpoint: <code>{API_URL}</code>
        </p>
      </div>
    </div>
  );
}
