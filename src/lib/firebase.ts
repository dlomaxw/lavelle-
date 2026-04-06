// Firebase configuration for Lavelle
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyCN6dZuYXCJFJzu-FFchQF3jEEMCtl11Iw",
  authDomain: "telemed-54d94.firebaseapp.com",
  projectId: "telemed-54d94",
  storageBucket: "telemed-54d94.firebasestorage.app",
  messagingSenderId: "188238579049",
  appId: "1:188238579049:web:c431587a4d51d952c7a9f8",
  measurementId: "G-PNRSLE1LTY",
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
export const analytics = getAnalytics(app);
export default app;
