import React from "react";  // ✅ add this line
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import { ClerkProvider } from "@clerk/clerk-react";
  // Adjust the import based on your environment setup
// Import your Publishable Key
const  PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY
ReactDOM.createRoot(document.getElementById("root")).render(
 <ClerkProvider publishableKey={PUBLISHABLE_KEY}>

    <App />
    </ClerkProvider>

);
