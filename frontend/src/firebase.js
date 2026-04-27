import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCYDDMogq7DO9lTrfYBIDJuB9l06XoGN4o",
  authDomain: "volunteerconect-1e933.firebaseapp.com",
  projectId: "volunteerconect-1e933",
  storageBucket: "volunteerconect-1e933.firebasestorage.app",
  messagingSenderId: "44455423691",
  appId: "1:44455423691:web:b9d1b85f3b3c6f041bf54e",
  measurementId: "G-2ELKS6Z2LZ"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export default app;