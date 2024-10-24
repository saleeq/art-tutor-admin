// src/utils/firebase.ts
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyABSTNP_xrUT6hvyIleNdaQZb1BB0LWGyc",
  appId: "1:793080395202:web:3826834e65c4865c9b525b",
  messagingSenderId: "793080395202",
  projectId: "articulate-lesson-builder",
  authDomain: "articulate-lesson-builder.firebaseapp.com",
  storageBucket: "articulate-lesson-builder.appspot.com",
};

const app = initializeApp(firebaseConfig);
const secondaryDb = getFirestore(app);
const auth = getAuth(app);

export { auth, secondaryDb };
