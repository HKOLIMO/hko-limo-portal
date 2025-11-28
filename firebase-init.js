// Firebase Initialization - CORRECTED
// This file MUST be imported correctly in all other pages

import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.0/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/11.0.0/firebase-firestore.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/11.0.0/firebase-auth.js";

// ⚠️ REPLACE WITH YOUR FIREBASE CONFIG
const firebaseConfig = {
  apiKey: "AIzaSyDy7z9suF_bpLI7pW4X9ofsZpfmEMc7Eeo",
  authDomain: "hkolimo-firebase.firebaseapp.com",
  databaseURL: "https://hkolimo-firebase-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "hkolimo-firebase",
  storageBucket: "hkolimo-firebase.firebasestorage.app",
  messagingSenderId: "1012271101382",
  appId: "1:1012271101382:web:fc922a415deadf277a2ec7"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Export these for use in other files
export const db = getFirestore(app);
export const auth = getAuth(app);

console.log("✅ Firebase initialized successfully");
