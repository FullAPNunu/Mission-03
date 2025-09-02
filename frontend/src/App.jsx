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

        {/* Conversation Log display */}
        <div className="border rounded-lg p-6 h-96 min-h-[400px] overflow-y-auto bg-white my-8 shadow-lg text-lg text-black">
          {log.map((m, i) => (
            <div key={i} className="mb-2">
              <strong>
                {m.role === "interviewer" ? "Interviewer" : "Me"}:
              </strong>{" "}
              {m.text}
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
