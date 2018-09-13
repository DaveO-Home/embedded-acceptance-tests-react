import React, { Component } from "react"
import ReactDOM from "react-dom"
import start from '../js/controller/start'

class Login extends React.Component {
  render() {
    return (
      <small>
        <a href="#" className="login" onClick={handleClick}>Log in</a>
      </small>
    );
  }
}

function handleClick(e) {
  e.preventDefault()
  start['div .login click'](e);
}

export default Login
