// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBcfXJubosSGteoLrnkqRnnuKtmHE5rNRQ",
  authDomain: "pantry-4c520.firebaseapp.com",
  projectId: "pantry-4c520",
  storageBucket: "pantry-4c520.appspot.com",
  messagingSenderId: "389874821902",
  appId: "1:389874821902:web:b1d24e30ad57c078b6855f",
  measurementId: "G-R8YDCYDFYQ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const firestore = getFirestore(app);

export {firestore}