# Turner’s AI Interviewer

A modern, user-friendly AI-powered interview simulator built with React, Tailwind CSS, DaisyUI, and Google Gemini API.

---

## Features

- **Conversational AI Interviewer:** Simulates a real interview experience for any job title.
- **Modern UI/UX:** Responsive design using Tailwind CSS and DaisyUI.
- **Chat Bubbles:** Clear distinction between user and interviewer messages.
- **Markdown Support:** AI responses (including final evaluations) are rendered with headings, lists, and formatting.
- **Radial Progress Bar:** Visualizes interview progress.
- **Auto-Scroll:** Chat log always shows the latest message.
- **Loading & Error Feedback:** Spinners and error messages for smooth user experience.

---

## Monorepo Structure

- `frontend/` — React app (UI/UX, chat, progress, etc.)
- `backend/` — Node.js/Express server (handles Gemini API requests)

---

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18+ recommended)
- [npm](https://www.npmjs.com/)
- Google Gemini API key (for backend)

---

### Installation

#### 1. Clone the repository

```sh
git clone https://github.com/your-username/your-repo-name.git
cd your-repo-name
```

#### 2. Install dependencies

**Frontend:**

```sh
cd frontend
npm install
```

**Backend:**

```sh
cd ../backend
npm install
```

---

### Configuration

#### Backend

- Create a `.env` file in the `backend` directory:
  ```
  GEMINI_API_KEY=your-google-gemini-api-key
  ```
- (Optional) Adjust `server.js` for your preferred port or Gemini model.

---

### Running the App

**Start the backend:**

```sh
cd backend
npm start
```

or (if using nodemon):

```sh
npx nodemon server.js
```

**Start the frontend:**

```sh
cd ../frontend
npm run dev
```

- The frontend will be available at [http://localhost:5173](http://localhost:5173) (or as shown in your terminal).
- The backend runs on [http://localhost:5050](http://localhost:5050) by default.

---

## Usage

1. Enter a job title (e.g., "Junior Developer").
2. Answer the AI interviewer’s questions in the chat.
3. Watch your progress in the radial progress bar.
4. At the end, receive a detailed, well-formatted evaluation.
5. Click **Restart Interview** to try again.

---

## Tech Stack

- **Frontend:** React, Tailwind CSS, DaisyUI, React Markdown
- **Backend:** Node.js, Express, Google Gemini API

---

## Contributing

Pull requests are welcome! For major changes, please open an issue first to discuss what you would like to change.

---

## License

[MIT](LICENSE)

---

## Acknowledgements

- [Tailwind CSS](https://tailwindcss.com/)
- [DaisyUI](https://daisyui.com/)
- [React Markdown](https://github.com/remarkjs/react-markdown)
- [Google Gemini API](https://ai.google.dev/)
