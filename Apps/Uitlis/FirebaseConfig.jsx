
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getStorage} from 'firebase/storage';
import { getFirestore } from 'firebase/firestore';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: "took-tak.firebaseapp.com",
  projectId: "took-tak",
  storageBucket: "took-tak.appspot.com",
  messagingSenderId: "313275663705",
  appId: "1:313275663705:web:5592c81629de3892d8b848"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const storage=getStorage(app)

export { db ,storage};