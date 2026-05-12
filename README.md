# VolunteerConnect

VolunteerConnect is a comprehensive platform designed to connect volunteers with meaningful opportunities, streamline event management, and enhance the overall volunteer experience. The platform features event discovery, team organization, attendance tracking, and AI-powered insights to maximize social impact.

## ✨ Features

### Event Management
- **Event Creation & Discovery**: Organizers can create detailed event listings, and volunteers can easily find opportunities based on interests and location.
- **Team Management**: Form and manage volunteer teams with ease.
- **RSVP & Check-in**: Streamlined process for volunteers to sign up and check in at events.

### Attendance Tracking
- **Verification System**: NGOs can verify attendance to award points.
- **Gamification**: Earn points and rank on the global leaderboard.
- **Impact History**: Volunteers can view their complete attendance history and impact metrics.

### AI Enhancements (Gemini Integration)
- **Description Enhancement**: Automatically improves event descriptions to be more professional.
- **Smart Categorization**: Uses AI to categorize events into relevant fields.
- **AI Chatbot**: Helpful assistant for volunteering tips and platform help.

## 🚀 Installation & Setup

Follow these steps to get a local copy of VolunteerConnect running on your machine.

### 📋 Prerequisites
- **Node.js**: [Download and install Node.js](https://nodejs.org/) (v16 or higher recommended)
- **Git**: [Download and install Git](https://git-scm.com/)
- **Firebase Project**: A Firebase project with Firestore, Authentication, and Hosting enabled.
- **Google Cloud**: A project with Gemini API enabled.

---

### 🐧 Linux / macOS Setup

1. **Clone the Repository**:
   ```bash
   git clone https://github.com/NireekshaAP07/VolunteerCOnnect.git
   cd VolunteerCOnnect
   ```

2. **Backend Setup**:
   ```bash
   cd backend
   npm install
   # Create .env and serviceAccountKey.json here (see Secrets section below)
   npm run dev
   ```

3. **Frontend Setup** (Open a new terminal):
   ```bash
   cd frontend
   npm install
   # Create .env here (see Secrets section below)
   npm run dev
   ```

---

### 🪟 Windows Setup

1. **Clone the Repository**:
   Open Command Prompt or PowerShell:
   ```powershell
   git clone https://github.com/NireekshaAP07/VolunteerCOnnect.git
   cd VolunteerCOnnect
   ```

2. **Backend Setup**:
   ```powershell
   cd backend
   npm install
   # Create .env and serviceAccountKey.json here (see Secrets section below)
   npm run dev
   ```

3. **Frontend Setup** (Open a new terminal):
   ```powershell
   cd frontend
   npm install
   # Create .env here (see Secrets section below)
   npm run dev
   ```

---

## 🔐 Secrets & Environment Variables

Since sensitive keys are not pushed to GitHub, you must manually restore them:

### 1. Backend (`/backend`)
Create a file named `.env`:
```env
GEMINI_API_KEY=your_gemini_api_key
PORT=5000
```
Also, place your Firebase **`serviceAccountKey.json`** in the `/backend` folder.

### 2. Frontend (`/frontend`)
Create a file named `.env`:
```env
VITE_FIREBASE_API_KEY="..."
VITE_FIREBASE_AUTH_DOMAIN="..."
VITE_FIREBASE_PROJECT_ID="..."
VITE_FIREBASE_STORAGE_BUCKET="..."
VITE_FIREBASE_MESSAGING_SENDER_ID="..."
VITE_FIREBASE_APP_ID="..."
VITE_GOOGLE_MAPS_API_KEY="..."
```

## 🛠️ Usage
1. Start the backend first (`npm run dev` in `/backend`).
2. Start the frontend (`npm run dev` in `/frontend`).
3. Open `http://localhost:5173` in your browser.

## 📁 Project Structure
```
VolunteerConnect/
├── backend/              # Node.js/Express backend
│   ├── serviceAccountKey.json (Manual)
│   ├── .env (Manual)
│   └── index.js
└── frontend/             # React/Vite frontend
    ├── .env (Manual)
    └── src/              # App logic
```

## 📄 License
[MIT](LICENSE)
