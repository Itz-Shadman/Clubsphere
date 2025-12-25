import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBH9rG-JcdlG9gq9Lw0aoLkmiNG7Xezv5k",
  authDomain: "clubsphere-d884a.firebaseapp.com",
  projectId: "clubsphere-d884a",
  storageBucket: "clubsphere-d884a.appspot.com",
  messagingSenderId: "112046046578",
  appId: "1:112046046578:web:3c98b01c4bf103e47d71eb",
  measurementId: "G-RMHN9GLV41"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Export instances to be used in AuthProvider
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export default app;