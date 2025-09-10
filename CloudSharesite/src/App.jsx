import React from "react"; // ✅ Add this line
import { BrowserRouter as Router, Routes, Route, BrowserRouter } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./index.css";
import Landing from "./pages/Landing";
import Dashboard from "./pages/Dashboard";
import Myfiles from "./pages/Myfiles";
import Transaction from "./pages/Transaction";
import Upload from "./pages/Upload";
import { RedirectToSignIn, SignedIn, SignedOut, SignIn } from "@clerk/clerk-react";
import Subscription from "./pages/Subscription";
import UserCreditsProvider from "./context/UserCreditsContext";
import PublicFileView from "./components/PublicFileView";


function App() {
  return (
    <UserCreditsProvider>
    <BrowserRouter>
    
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/dashboard" element={

          <>

            <SignedIn><Dashboard /></SignedIn>
            <SignedOut><RedirectToSignIn /></SignedOut>
          </>

        } />
        <Route path="/myfiles" element={<>

          <SignedIn><Myfiles /></SignedIn>
          <SignedOut><RedirectToSignIn /></SignedOut>
        </>} />
        <Route path="/public-file-view" element={<PublicFileView />} />
        <Route path="/subscription" element={<>

          <SignedIn><Subscription /></SignedIn>
          <SignedOut><RedirectToSignIn /></SignedOut>
        </>} />
        <Route path="/transaction" element={<>

          <SignedIn><Transaction /></SignedIn>
          <SignedOut><RedirectToSignIn /></SignedOut>
        </>} />
        <Route path="/upload" element={<>

          <SignedIn><Upload /></SignedIn>
          <SignedOut><RedirectToSignIn /></SignedOut>
        </>} />
      
        <Route path="file/:fileId" element={<PublicFileView/>} />
        <Route path="/*" element={<RedirectToSignIn />} />
      </Routes>
      <ToastContainer />
    </BrowserRouter>
    </UserCreditsProvider>
  );
}

export default App;
