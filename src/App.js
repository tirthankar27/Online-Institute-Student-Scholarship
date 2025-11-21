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
  const signupEndpoint = process.env.REACT_APP_SIGNUP_ENDPOINT;
  const loginEndpoint = process.env.REACT_APP_LOGIN_ENDPOINT;
  const postEndpoint = process.env.REACT_APP_POST_SCHOLARSHIP_ENDPOINT;
  const getEndpoint = process.env.REACT_APP_GET_SCHOLARSHIP_ENDPOINT;
  const scholarshipEndpoint = process.env.REACT_APP_SCHOLARSHIP_ENDPOINT;
  const applyEndpoint = process.env.REACT_APP_APPLY_ENDPOINT;
  const getApllications = process.env.REACT_APP_APPLICATIONS;
  const allApplications = process.env.REACT_APP_ALL_APPLICATIONS;
  const updateBackend = process.env.REACT_APP_UPDATE_STATUS;
  const approvedStudents = process.env.REACT_APP_APPROVED_STUDENTS;
  const approvedapplicationendpoint = process.env.REACT_APP_APPROVED_APPLICATION;
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
      <div>
        <BrowserRouter basename="/scholarship">
          <Navbar username={username} setUsername={setUsername} />
          <Alert alert={alert} />
          <Routes>
            <Route exact path="/" element={<Home />} />
            <Route
              exact
              path="/schemes"
              element={<Schemes getendpoint={getEndpoint} />}
            />
            <Route exact path="/how-to-apply" element={<HowToApply />} />
            <Route exact path="/about" element={<About />} />
            <Route
              exact
              path="/login"
              element={
                <Login
                  loginendpoint={loginEndpoint}
                  setUsername={setUsername}
                  showAlert={showAlert}
                />
              }
            />
            <Route
              exact
              path="/signup"
              element={
                <SignUp signupendpoint={signupEndpoint} showAlert={showAlert} />
              }
            />
            <Route
              exact
              path="/postscholarship"
              element={<Post postendpoint={postEndpoint} />}
            />
            <Route
              exact
              path="/dashboard"
              element={<Dashboard getendpoint={getEndpoint} />}
            />
            <Route exact path="/applications" element={<Applications />} />
            <Route exact path="/support" element={<Support />} />
            <Route
              path="/apply/:id"
              element={
                <ApplicationForm
                  applyendpoint={applyEndpoint}
                  scholarshipendpoint={scholarshipEndpoint}
                />
              }
            />
            <Route exact path="/my-applications" element={<MyApplications approvedApplication = {approvedapplicationendpoint} getapplications={getApllications} scholarshipendpoint={scholarshipEndpoint}/>}/>
            <Route exact path="/review" element={<AuthorityReview update={updateBackend} applications={allApplications} getapplications={getApllications} scholarshipendpoint={scholarshipEndpoint}/>}/>
            <Route exact path="/manage-applications" element={<ManageApplications getendpoint={getEndpoint} approved={approvedStudents} update={updateBackend} applications={allApplications} getapplications={getApllications} scholarshipendpoint={scholarshipEndpoint}/>}/>
          </Routes>
        </BrowserRouter>
      </div>
    </AuthProvider>
  );
}

export default App;
