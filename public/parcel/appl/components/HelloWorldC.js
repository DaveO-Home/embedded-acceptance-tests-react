import React, { Component } from "react"
import ReactDOM from "react-dom"
import App from '../js/app'
import Setup from '../js/utils/setup'
import '../assets/App.css'
import carousel from '../js/carousel'

function Link(props) {
  return <a href={props.url} target="_blank">{props.text}</a>;
}

const welcomeHtml = (
  <div id="welcome" className="App">
    <link href="./App.css" rel="stylesheet" />
    <div className="App-header">
      <img className="App-logo" src="./appl/assets/logo.svg" />
      <h2>Hi - &nbsp;
      <span
          className="txt-rotate"
          data-period="2000"
          data-rotate='[ "Acceptance Testing with a React App" ]'>
        </span>
      </h2>
    </div>
    <br />
    <h2>Getting Started</h2>
    <br />
    <ul className="App-intro">
      <li><Link url="https://reactjs.org/" text="React - A JavaScript library for building user interfaces" /></li>
    </ul>
  </div>
)

class Welcome extends Component {
  componentDidMount() {
    setData()
  }

  render() {
    {
      if (App.controllers['Start']) {
        App.controllers['Start'].initMenu()
      }
      Setup.init()
    }
    return (<span></span>)
  }
}

function setData() {
  ReactDOM.render(
    welcomeHtml,
    document.getElementById("main_container"),
    carousel
  )
}

export default Welcome
