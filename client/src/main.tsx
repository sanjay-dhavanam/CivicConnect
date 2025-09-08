import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";

// Firebase Imports and Initialization
import { initializeApp } from "firebase/app";

// Your web app's Firebase configuration
const firebaseConfig = {
apiKey: import.meta.env.VITE_APP_FIREBASE_API_KEY,
authDomain: import.meta.env.VITE_APP_FIREBASE_AUTH_DOMAIN,
projectId: import.meta.env.VITE_APP_FIREBASE_PROJECT_ID,
storageBucket: import.meta.env.VITE_APP_FIREBASE_STORAGE_BUCKET,
messagingSenderId: import.meta.env.VITE_APP_FIREBASE_MESSAGING_SENDER_ID,
appId: import.meta.env.VITE_APP_FIREBASE_APP_ID,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

createRoot(document.getElementById("root")!).render(
<QueryClientProvider client={queryClient}>
<App />
</QueryClientProvider>
);