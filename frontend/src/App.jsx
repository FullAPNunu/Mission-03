import { useState } from 'react'

export default function App() {
  const [jobTitle, setJobTitle] = useState('Junior Developer')
  const [log, setLog] = useState([
    { role: 'interviewer', text: 'Tell me about yourself.' }
  ])
  const [answer, setAnswer] = useState('')

  const sendAnswer = async () => {
    const body = {
      jobTitle,
      conversation: log
    }

    const res = await fetch('/interview', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    })
    const data = await res.json() // { role, text } from backend placeholder

    setLog(prev => [...prev, { role: 'user', text: answer }, data])
    setAnswer('')
  }

  return (
    <div style={{ maxWidth: 720, margin: '2rem auto', fontFamily: 'system-ui' }}>
      <h1>AI Mock Interviewer</h1>

      <label>
        Job Title:&nbsp;
        <input
          value={jobTitle}
          onChange={e => setJobTitle(e.target.value)}
          placeholder="e.g., Junior Developer"
          style={{ width: 300 }}
        />
      </label>

      <div style={{
        border: '1px solid #ccc', borderRadius: 8, padding: 12,
        height: 280, overflowY: 'auto', marginTop: 16, background: '#fff'
      }}>
        {log.map((m, i) => (
          <div key={i} style={{ marginBottom: 10 }}>
            <strong>{m.role === 'interviewer' ? 'Interviewer' : 'Me'}:</strong> {m.text}
          </div>
        ))}
      </div>

      <div style={{ marginTop: 12 }}>
        <input
          value={answer}
          onChange={e => setAnswer(e.target.value)}
          placeholder="Type your answer…"
          style={{ width: 520 }}
        />
        <button onClick={sendAnswer} style={{ marginLeft: 8 }}>Submit</button>
      </div>
    </div>
  )
}
