# VolunteerConnect

VolunteerConnect is a comprehensive platform designed to connect volunteers with meaningful opportunities, streamline event management, and enhance the overall volunteer experience. The platform features event discovery, team organization, attendance tracking, and AI-powered insights to maximize social impact.

## Features

### Event Management
- **Event Creation & Discovery**: Organizers can create detailed event listings, and volunteers can easily find opportunities based on interests and location.
- **Team Management**: Form and manage volunteer teams with ease.
- **RSVP & Check-in**: Streamlined process for volunteers to sign up and check in at events.

### Attendance Tracking
- **QR Code System**: Secure and efficient attendance tracking using QR codes.
- **Gamification**: Earn points and badges for participation to encourage engagement.
- **History View**: Volunteers can view their complete attendance history and impact metrics.

### AI Enhancements (Gemini Integration)
- **Post-Event Summaries**: Generate engaging social media posts and detailed reports about events.
- **Smart Recommendations**: Get AI-driven suggestions for future events based on interests and past participation.
- **Event Analysis**: Analyze event data to identify trends and areas for improvement.

## Tech Stack

### Frontend
- **Framework**: React with Vite
- **Styling**: Tailwind CSS
- **State Management**: Context API
- **Mapping**: Google Maps Platform
- **AI Integration**: Gemini API
- **Authentication**: Firebase Authentication

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: Firebase Firestore
- **Authentication**: Firebase Authentication
- **API**: Google Gemini API

## Installation & Setup

### Prerequisites
- Node.js (v14 or higher)
- npm (or yarn)
- Firebase Account
- Google Cloud Project with Maps and Gemini APIs enabled

### Backend Setup
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in the `backend/` directory with the following credentials:
   ```env
   GEMINI_API_KEY=your_gemini_api_key
   PORT=5000
   ```
4. Start the server:
   ```bash
   npm run dev
   ```

### Frontend Setup
1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in the `frontend/` directory with the following configuration:
   ```env
   VITE_FIREBASE_API_KEY="your_firebase_api_key"
   VITE_FIREBASE_AUTH_DOMAIN="your_firebase_auth_domain"
   VITE_FIREBASE_PROJECT_ID="your_firebase_project_id"
   VITE_FIREBASE_STORAGE_BUCKET="your_firebase_storage_bucket"
   VITE_FIREBASE_MESSAGING_SENDER_ID="your_firebase_messaging_sender_id"
   VITE_FIREBASE_APP_ID="your_firebase_app_id"
   VITE_FIREBASE_MEASUREMENT_ID="your_firebase_measurement_id"
   VITE_GOOGLE_MAPS_API_KEY="your_google_maps_api_key"
   ```
4. Start the development server:
   ```bash
   npm run dev
   ```

## Usage

1. Open your browser and navigate to `http://localhost:5173` (or the port indicated by the dev server).
2. Sign up or log in using Google Authentication.
3. Explore events, join teams, and track your contributions!

## Project Structure
```
VolunteerConnect/
├── backend/              # Node.js/Express backend
│   ├── node_modules/
│   ├── .env
│   ├── index.js
│   ├── routes/
│   └── controllers/
└── frontend/             # React frontend
    ├── node_modules/
    ├── .env
    ├── src/
    │   ├── components/
    │   ├── pages/
    │   ├── context/
    │   └── services/
    ├── index.html
    └── vite.config.js
```

## Contributing
Pull requests are welcome! Please feel free to submit a PR for any improvements or new features.

## License
[MIT](LICENSE)
