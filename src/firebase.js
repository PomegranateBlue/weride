import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";
import { getFirestore, connectFirestoreEmulator } from "firebase/firestore";
import { getAuth, connectAuthEmulator } from "firebase/auth";
import "firebase/functions";
import "firebase/firestore";
import firebase from "firebase/app";
const firebaseConfig = {
  apiKey: "AIzaSyAQwPECRPL8Hl5plN55XX8rfNUCBjj_tAY",
  authDomain: "taxischedule-33477.firebaseapp.com",
  projectId: "taxischedule-33477",
  storageBucket: "taxischedule-33477.appspot.com",
  messagingSenderId: "674791509208",
  appId: "1:674791509208:web:266a4bdf796481c6035bad",
  measurementId: "G-J11T1ZMY5D",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const firestoreDB = getFirestore(app);

/*if (window.location.hostname === "localhost") {
  connectFirestoreEmulator(firestoreDB, "localhost", 8081);
  connectAuthEmulator(auth, "http://localhost:9099");
}*/

export { auth, firestoreDB };
