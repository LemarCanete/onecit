// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getAuth} from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDfj9sJyga8-5LV8VHO0iS_JIQGsf6Hlwg",
  authDomain: "onecit-40a54.firebaseapp.com",
  projectId: "onecit-40a54",
  storageBucket: "onecit-40a54.appspot.com",
  messagingSenderId: "559856598929",
  appId: "1:559856598929:web:9799eb920f91069c2a2430"
};


// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app); //for user authentication
export const db = getFirestore(app); //for CRUD usually
export const storage = getStorage(); //for storing files