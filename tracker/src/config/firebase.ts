import { getFirestore } from 'firebase/firestore';
import { initializeApp } from "firebase/app";

const firebaseConfig = {
  apiKey: "AIzaSyBwMQShY4YfGz6hx4x464kGWJI858OjFvQ",
  authDomain: "expense-tracker-ef756.firebaseapp.com",
  projectId: "expense-tracker-ef756",
  storageBucket: "expense-tracker-ef756.firebasestorage.app",
  messagingSenderId: "806022071579",
  appId: "1:806022071579:web:1851e0d9be8a24ec38bfbe"
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app)