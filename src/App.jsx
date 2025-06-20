import React, { useState, useEffect } from "react";
import API from "./components/axios";
import "./App.css";
import Main from "./Main";
import Login from "./components/Login";
import Signup from "./components/Signup";

export default function App() {
  const [loginIsShown, setLoginIsShown] = useState(true);
  return (
    <>
      {localStorage.getItem("username").length === 0 ||
      localStorage.getItem("token").length === 0 ? (
        loginIsShown ? (
          <Login setLoginIsShown={setLoginIsShown} />
        ) : (
          <Signup setLoginIsShown={setLoginIsShown} />
        )
      ) : (
        <Main />
      )}
    </>
  );
}
