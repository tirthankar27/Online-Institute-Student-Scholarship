import "./App.css";
import React, { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Schemes from "./components/Schemes";
import HowToApply from "./components/Howtoapply";
import About from "./components/About";
import Login from "./components/Login";
import SignUp from "./components/SignUp";
import Home from "./components/Home";
import Support from "./components/Support";
import Alert from "./components/Alert";
import Post from "./components/Post";
import Dashboard from "./components/Dashboard";
import Applications from "./components/Applications";
import ApplicationForm from "./components/ApplicationForm";
import { AuthProvider } from "./context/AuthContext";
import MyApplications from "./components/MyApplications";
import AuthorityReview from "./components/AutrhorityReview";
import ManageApplications from "./components/ManageApplications";

function App() {
  const [username, setUsername] = useState("");
  const [alert, setAlert] = useState(null);

  const showAlert = (message, type) => {
    setAlert({
      msg: message,
      type: type,
    });
    setTimeout(() => {
      setAlert(null);
    }, 1500);
  };

  return (
    <AuthProvider>
      <BrowserRouter basename="/scholarship">
        <Navbar username={username} setUsername={setUsername} />
        <Alert alert={alert} />

        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/schemes" element={<Schemes />} />
          <Route path="/how-to-apply" element={<HowToApply />} />
          <Route path="/about" element={<About />} />
          <Route path="/support" element={<Support />} />
          <Route path="/post" element={<Post />} />
          <Route path="/login" element={<Login showAlert={showAlert} setUsername={setUsername} />} />
          <Route path="/signup" element={<SignUp showAlert={showAlert} />} />

          {/* Protected / Dashboard Routes */}
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/applications" element={<Applications />} />
          <Route path="/apply" element={<ApplicationForm />} />
          <Route path="/my-applications" element={<MyApplications />} />
          <Route path="/authority-review" element={<AuthorityReview />} />
          <Route path="/manage-applications" element={<ManageApplications />} />

          {/* Catch-all: Not Found */}
          <Route path="*" element={<Home />} />
        </Routes>

      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
