import React, { Component } from "react";
// import ReactDOM from "react-dom"
import start from "../js/controller/start";

class Login extends Component {
  render() {
    return (
      <small>
        <a href="#" className="login" onClick={handleClick}>Log In</a>
      </small>
    );
  }
}

function handleClick(e) {
  start["div .login click"](e);
}

export default Login;
