// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyB3m6cyjvria3FpL96-jaCx_Fm2X8Vodd4",
  authDomain: "shareaddaa-616e5.firebaseapp.com",
  projectId: "shareaddaa-616e5",
  storageBucket: "shareaddaa-616e5.firebasestorage.app",
  messagingSenderId: "953662715623",
  appId: "1:953662715623:web:a7f6dc015a8f73f09bd442",
  measurementId: "G-XEGEP8Z0FM"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
const analytics = getAnalytics(app);