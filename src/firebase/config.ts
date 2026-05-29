import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyDJTKHaf9jlZAmzhSHUUpzWeTjCdmizrdc",
    authDomain: "edulab-c4b6f.firebaseapp.com",
    projectId: "edulab-c4b6f",
    storageBucket: "edulab-c4b6f.firebasestorage.app",
    messagingSenderId: "987933474938",
    appId: "1:987933474938:web:60c067f51b9fea69bc7bc3",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();