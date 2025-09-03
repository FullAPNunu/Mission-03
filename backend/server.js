const express = require("express");
const cors = require("cors");
require("dotenv").config();

const { z } = require("zod");
const { GoogleGenerativeAI } = require("@google/generative-ai");

const app = express();
app.use(cors());
app.use(express.json({ limit: "1mb" }));

// --- request log (handy while debugging)
app.use((req, _res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// ---- Health
app.get("/health", (_req, res) => {
  res.json({ ok: true, ts: Date.now(), pid: process.pid, file: __filename });
});

// ---- Config
const GEMINI_DEFAULT = "gemini-2.5-flash";
const GEMINI_ALLOWED = new Set(["gemini-2.5-flash", "gemini-2.5-pro"]);

const BodySchema = z.object({
  model: z.string().optional(),
  temperature: z.number().min(0).max(2).optional(),
  messages: z.array(
    z.object({
      role: z.enum(["system", "user", "assistant"]),
      content: z.string(),
    })
  ).min(1),
});

function pickModel(model) {
  return model && GEMINI_ALLOWED.has(model) ? model : GEMINI_DEFAULT;
}
function splitSystem(messages) {
  const system = messages
    .filter(m => m.role === "system")
    .map(m => m.content)
    .join("\n\n");
  const dialog = messages.filter(m => m.role !== "system");
  return { system, dialog };
}

// ---- Interview (Gemini 2.5)
app.post("/interview", async (req, res) => {
  const parsed = BodySchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: "Invalid payload", issues: parsed.error.flatten() });
  }

  const { model, temperature, messages } = parsed.data;
  const chosenModel = pickModel(model);
  const temp = temperature ?? 0.7;
  const { system, dialog } = splitSystem(messages);

  try {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const gModel = genAI.getGenerativeModel({ model: chosenModel });

    const prompt = [
      system ? `SYSTEM:\n${system}` : "",
      ...dialog.map(m => `${m.role.toUpperCase()}:\n${m.content}`),
    ].filter(Boolean).join("\n\n");

    const result = await gModel.generateContent({
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      generationConfig: { temperature: temp },
    });

    const text = result?.response?.text() ?? "";
    res.json({ model: chosenModel, role: "assistant", text });
  } catch (err) {
    console.error("Interview error:", err?.message || err);
    res.status(500).json({ error: "Model call failed", detail: String(err?.message || err) });
  }
});

// ---- Start
const port = process.env.PORT || 5050;
app.listen(port, () => console.log(`API listening on http://localhost:${port}`));
