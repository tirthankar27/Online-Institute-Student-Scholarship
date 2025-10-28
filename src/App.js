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

function App() {
  const signupEndpoint = process.env.REACT_APP_SIGNUP_ENDPOINT;
  const loginEndpoint = process.env.REACT_APP_LOGIN_ENDPOINT;
  const postEndpoint = process.env.REACT_APP_POST_SCHOLARSHIP_ENDPOINT;
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
    <div>
      <BrowserRouter basename="/scholarship">
        <Navbar username={username} setUsername={setUsername} />
        <Alert alert={alert} />
        <Routes>
          <Route exact path="/" element={<Home />} />
          <Route exact path="/schemes" element={<Schemes />} />
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
          <Route exact path="/support" element={<Support />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
