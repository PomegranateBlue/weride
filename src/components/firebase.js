import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";
import { getFirestore } from "firebase/firestore";
import firebase from "firebase/app";
const firebaseConfig = {
//only my key
};

const app = initializeApp(firebaseConfig);

const firestoreDB = getFirestore(app);
const realTimeDB = getDatabase(app);

export { firestoreDB, realTimeDB };
