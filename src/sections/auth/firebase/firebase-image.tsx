// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDv0Moz4oenvp8v4mhBgbUqi6-k6rmK0Ok",
  authDomain: "datamithurunode.firebaseapp.com",
  projectId: "datamithurunode",
  storageBucket: "datamithurunode.appspot.com",
  messagingSenderId: "32242172154",
  appId: "1:32242172154:web:943dc1858301d400440943",
  measurementId: "G-V3JH8HBLGE"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const storage = getStorage(app);

export { storage };
