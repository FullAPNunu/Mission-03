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
    <div
      style={{ maxWidth: 720, margin: "2rem auto", fontFamily: "system-ui" }}
    >
      <h1>AI Mock Interviewer</h1>

      {/* Job title input */}
      <label>
        Job Title:&nbsp;
        <input
          value={jobTitle}
          onChange={(e) => setJobTitle(e.target.value)}
          placeholder="e.g., Junior Developer"
          style={{ width: 300 }}
        />
      </label>

      {/* Conversation Log display */}
      <div
        style={{
          border: "1px solid #ccc",
          borderRadius: 8,
          padding: 12,
          height: 280,
          overflowY: "auto",
          marginTop: 16,
          background: "#fff",
        }}
      >
        {log.map((m, i) => (
          <div key={i} style={{ marginBottom: 10 }}>
            <strong>{m.role === "interviewer" ? "Interviewer" : "Me"}:</strong>{" "}
            {m.text}
          </div>
        ))}
      </div>

      {/* User answer input and submit Button  */}
      <div style={{ marginTop: 12 }}>
        <input
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
          placeholder="Type your answer…"
          style={{ width: 520 }}
        />
        <button onClick={sendAnswer} style={{ marginLeft: 8 }}>
          Submit
        </button>
      </div>
    </div>
  );
}
