const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

app.get("/health", (_req, res) => res.json({ ok: true }));

// TODO: /interview endpoint will forward to Gemini/OpenAI
app.post("/interview", async (req, res) => {
  // placeholder
  res.json({ role: "interviewer", text: "Tell me about yourself." });
});

const port = process.env.PORT || 5050;
app.listen(port, () => console.log(`Backend running on :${port}`));
