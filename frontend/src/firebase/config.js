// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyA2JBIKkz97HN_DgHtlcEL2BFFr7ybxLrE",
  authDomain: "social-media-528ef.firebaseapp.com",
  projectId: "social-media-528ef",
  storageBucket: "social-media-528ef.appspot.com",
  messagingSenderId: "152652573195",
  appId: "1:152652573195:web:8f476e35ffab85ddeeb50e",
  measurementId: "G-XSF1CBDLYN",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();
const storage = getStorage(app);

export { auth, provider, storage };
