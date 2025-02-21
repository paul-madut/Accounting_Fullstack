import { initializeApp, getApps } from "firebase/app";

import { getFirestore, collection } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAuth, onAuthStateChanged, User } from "firebase/auth";

// const clientCredentials = {
//   apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
//   authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
//   projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
//   storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
//   messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
//   appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
// };

const clientCredentials = {
  apiKey: "AIzaSyB_8NkdCLpYE771jV3uvbl0MwKek1QZwdY",
  authDomain: "expense-tracker-164ce.firebaseapp.com",
  databaseURL: "https://expense-tracker-164ce-default-rtdb.firebaseio.com",
  projectId: "expense-tracker-164ce",
  storageBucket: "expense-tracker-164ce.firebasestorage.app",
  messagingSenderId: "1029187928341",
  appId: "1:1029187928341:web:751e4c32c8bf0a88aca91c",
  measurementId: "G-PR9M8TVZXM"
};

let app;
if (typeof window !== 'undefined' && getApps().length === 0) {
  app = initializeApp(clientCredentials);
} else {
  app = getApps()[0];
}

const db = getFirestore(app);
const storage = getStorage(app);
const auth = getAuth(app);

const expensesCollection = collection(db, "expenses");
const usersCollection = collection(db, "users");
const categoriesCollection = collection(db, "categories");

export {
  app,
  db,
  auth,
  storage,
  expensesCollection,
  categoriesCollection,
  usersCollection,
};