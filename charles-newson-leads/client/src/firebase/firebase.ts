// Import the functions you need from the SDKs you need
import { getApp, getApps, initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";



const firebaseConfig = {
  apiKey: "AIzaSyAtNzdjFUkhzyh0Kphols2AnmM8pkIjm9w",
  authDomain: "leads-usher.firebaseapp.com",
  projectId: "leads-usher",
  storageBucket: "leads-usher.appspot.com",
  messagingSenderId: "600146500145",
  appId: "1:600146500145:web:a93a6c828ebfc28a185310",
  measurementId: "G-0MTQ1YC9ZT"
};



const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const firestore = getFirestore(app);
const storage = getStorage(app);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

export { app, firestore, storage, firebaseConfig, auth, googleProvider };
