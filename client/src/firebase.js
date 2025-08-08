// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage"; // 追加
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyB1iTE-33wqY-rzUkjk9495-zhKJ4lrA9w",
  authDomain: "mix-drink-7dd4b.firebaseapp.com",
  projectId: "mix-drink-7dd4b",
  storageBucket: "mix-drink-7dd4b.firebasestorage.app",
  messagingSenderId: "204958486501",
  appId: "1:204958486501:web:0811a157f4e1cb0cf4290c",
  measurementId: "G-20KJ41BNTK",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app);
const auth = getAuth(app);
const storage = getStorage(app); // 追加

export { db, auth, storage }; // storageを追加
