// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics, isSupported } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAjHI2WvQuaZg0vwuRfsCiIm_iOukmVliw",
  authDomain: "eduquest-20d0e.firebaseapp.com",
  projectId: "eduquest-20d0e",
  storageBucket: "eduquest-20d0e.firebasestorage.app",
  messagingSenderId: "911353660311",
  appId: "1:911353660311:web:d7a4be65ef620de218fad2",
  measurementId: "G-C3NXR217ZV"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

// Analytics es opcional: solo se activa si el navegador lo soporta.
isSupported().then((ok) => { if (ok) getAnalytics(app); }).catch(() => {});