

import { initializeApp, getApps, getApp } from "firebase/app";
import { getMessaging } from "firebase/messaging";


const firebaseConfig = {
    apiKey: "AIzaSyAxi-7xEvsmZt4Ym6Z0ARXAWaczQNlQF08",
    authDomain: "e-commerce-37919.firebaseapp.com",
    projectId: "e-commerce-37919",
    storageBucket: "e-commerce-37919.firebasestorage.app",
    messagingSenderId: "347749647162",
    appId: "1:347749647162:web:7260ace74cbb0f2f6e0603",
    measurementId: "G-5J1X7ZQYW6"
};
// Prevent re-initialization (important in Next.js)
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

// ⚠️ Only create messaging in browser
const messaging =
    typeof window !== "undefined" ? getMessaging(app) : null;

export { firebaseConfig, messaging };