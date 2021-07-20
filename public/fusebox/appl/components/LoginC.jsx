import React from "react";
import start from "../js/controller/start";

class Login extends React.Component {
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
