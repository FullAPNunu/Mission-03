import { useState } from "react";

export default function App() {
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

  return (
    <div className="min-h-screen bg-gray-800">
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
        <div className="flex items-center gap-2">
          <textarea
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            placeholder="Type your answer…"
            className="textarea textarea-primary textarea-lg flex-1 bg-gray-100 text-gray-800 rounded-xl"
          />
        </div>
        <button
          onClick={sendAnswer}
          className="btn btn-lg btn-block btn-primary mt-4"
        >
          Submit
        </button>
      </div>
    </div>
  );
}
