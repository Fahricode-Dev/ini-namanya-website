import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey:            "AIzaSyAFsBmfo_CxcGTEbl0ZooxKkEFQpktspo4",
  authDomain:        "nnevv-app.firebaseapp.com",
  projectId:         "nnevv-app",
  storageBucket:     "nnevv-app.firebasestorage.app",
  messagingSenderId: "14103854164",
  appId:             "1:14103854164:web:4b18e304e67175dfdf01c1",
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
