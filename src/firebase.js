// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCYhRORRAea1_NfaENlwNe7pRXDzP-Rpfk",
  authDomain: "mpesa-qr-payment.firebaseapp.com",
  projectId: "mpesa-qr-payment",
  storageBucket: "mpesa-qr-payment.firebasestorage.app",
  messagingSenderId: "675509555097",
  appId: "1:675509555097:web:9be2d051177d701e3d0d08",
  measurementId: "G-6J5HH9DB80"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// Initialize Firebase services
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

// Export the Firebase services so they can be imported in other files
export { auth, db, storage, analytics };