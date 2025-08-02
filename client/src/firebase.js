import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore"; // Firestore を使う場合
import { getAuth } from "firebase/auth"; // 認証を使う場合

const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT_ID.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const db = getFirestore(app); // Firestore
const auth = getAuth(app); // 認証

export { db, auth };
