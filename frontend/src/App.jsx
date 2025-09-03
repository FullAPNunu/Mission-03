import { useState } from "react";

export default function App() {
<<<<<<< HEAD
  // State for job title input
  const [jobTitle, setJobTitle] = useState("Junior Developer");
  // Conversation Log: array of message objects {role,text}
  const [log, setLog] = useState([
    { role: "interviewer", text: "Tell me about yourself." },
  ]);
  // State for the user's current answer input
  const [answer, setAnswer] = useState("");

  // Send the user's answer with conversation log to the backend
  const sendAnswer = async () => {
    const body = {
      jobTitle,
      conversation: log,
    };

    // POST request to backend/ interview endpoint
    const res = await fetch("/interview", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    const data = await res.json(); // { role, text } from backend placeholder

    // Update conversation log with user's answer and AI's response
    setLog((prev) => [...prev, { role: "user", text: answer }, data]);
    setAnswer(""); // Clear input field
  };
=======
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
  const API_URL = "http://localhost:5050/interview"; // use proxy? switch to "/interview"

  // Map our UI log -> backend "messages" format
  function toBackendMessages(uiLog, nextUserText) {
    // System prompt guides the interviewer style & context
    const systemMsg = {
      role: "system",
      content:
        `You are a concise, professional interviewer for a ${jobTitle} role. ` +
        `Ask one question at a time, 1–2 sentences max. Keep tone friendly but focused.`,
    };

    // Convert prior turns:
    // interviewer -> assistant, user -> user
    const history = uiLog.map((m) => ({
      role: m.role === "interviewer" ? "assistant" : "user",
      content: m.text,
    }));

    // Append the user's new answer
    const withNext = [
      systemMsg,
      ...history,
      { role: "user", content: nextUserText },
    ];

    return withNext;
  }
>>>>>>> Karl

  // Send the user's answer with conversation log to the backend
  const sendAnswer = async () => {
    setErrorMsg("");

    const trimmed = answer.trim();
    if (!trimmed || loading) return;

    setLoading(true);
    try {
      const payload = {
        model: MODEL,
        messages: toBackendMessages(log, trimmed),
        // temperature: 0.7, // optional
      };

      const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || `HTTP ${res.status}`);
      }

      const data = await res.json(); // { model, role: "assistant", text }
      // Update UI log:
      // - push user's answer
      // - push interviewer reply (backend returns assistant role)
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
  };

  return (
    <div className="min-h-screen bg-gray-800">
<<<<<<< HEAD
      <div className="max-w-2xl mx-auto my-8 ">
        {/* Title block with primary color */}
        <div className="mb-6">
          <div className="rounded-xl bg-primary text-white text-center py-6 shadow-lg">
            <h1 className="text-5xl font-bold m-0">Turner's AI Interviewer</h1>
          </div>
        </div>

        {/* Job title input */}
        <label className="block mb-4 text-white">
          <span className="font-semibold text-xl">Job Title:&nbsp;</span>
          <input
            value={jobTitle}
            onChange={(e) => setJobTitle(e.target.value)}
            placeholder="e.g., Junior Developer"
            className="input input-bordered input-primary input-lg w-80 bg-gray-100 text-gray-800 text-primary font-bold rounded-xl"
          />
        </label>

        {/* Conversation Log display with chat bubbles */}

        <div className="h-96 min-h-[400px] overflow-y-auto bg-white my-8 shadow-lg text-lg p-4 rounded-lg flex flex-col gap-2">
          {log.map((m, i) => (
            <div
              key={i}
              className={`chat ${
                m.role === "user" ? "chat-end" : "chat-start"
              }`}
            >
              <div
                className={`chat-bubble ${
                  m.role === "user"
                    ? "bg-primary text-white"
                    : "bg-gray-200 text-black"
                }`}
              >
                <span className="font-bold mr-2">
                  {m.role === "interviewer" ? "Interviewer" : "Me"}:
                </span>
                {m.text}
              </div>
            </div>
          ))}
        </div>

        {/* User answer input and submit Button  */}
=======
      <div className="max-w-2xl mx-auto my-8 font-sans">
        <h1 className="text-5xl font-bold mb-6 text-white text-center">
          Turner's AI Interviewer
        </h1>

        {/* Job title input */}
        <label className="block mb-4 text-white">
          <span className="font-semibold text-xl">Job Title:&nbsp;</span>
          <input
            value={jobTitle}
            onChange={(e) => setJobTitle(e.target.value)}
            placeholder="e.g., Junior Developer"
            className="input input-bordered input-lg w-80 bg-gray-100 text-gray-800 rounded-xl"
          />
        </label>

        {/* Conversation Log */}
        <div className="border rounded-lg p-6 h-96 min-h-[400px] overflow-y-auto bg-white my-8 shadow-lg text-lg text-black">
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

        {/* Answer input + submit */}
>>>>>>> Karl
        <div className="flex items-center gap-2">
          <textarea
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            placeholder="Type your answer…"
            className="textarea textarea-primary textarea-lg flex-1 bg-gray-100 text-gray-800 rounded-xl"
<<<<<<< HEAD
=======
            disabled={loading}
>>>>>>> Karl
          />
        </div>
        <button
          onClick={sendAnswer}
<<<<<<< HEAD
          className="btn btn-lg btn-block btn-primary mt-4"
        >
          Submit
        </button>
=======
          disabled={loading || !answer.trim()}
          className={`btn btn-lg btn-block mt-4 ${loading ? "btn-disabled" : "btn-primary"}`}
        >
          {loading ? "Thinking…" : "Submit"}
        </button>

        {/* Small hint */}
        <p className="text-gray-300 mt-3 text-sm">
          Model: <code>{MODEL}</code> • Endpoint: <code>{API_URL}</code>
        </p>
>>>>>>> Karl
      </div>
    </div>
  );
}
