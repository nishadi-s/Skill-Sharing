import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
    apiKey: "AIzaSyAUfzVJjibNEAXCCYdTwTCDsI9TXdoxPEk",
    authDomain: "skill-sharing-2d6f6.firebaseapp.com",
    projectId: "skill-sharing-2d6f6",
    storageBucket: "skill-sharing-2d6f6.firebasestorage.app",
    messagingSenderId: "44141195798",
    appId: "1:44141195798:web:9bf032ac58cd6fc7c3fb37",
    measurementId: "G-BMPXN508SP"
  };
const app = initializeApp(firebaseConfig);
const storage = getStorage(app);

export { storage };