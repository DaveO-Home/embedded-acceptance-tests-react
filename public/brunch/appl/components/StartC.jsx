import React, { Component } from "react";
import ReactDOM from "react-dom";
import start from "../js/controller/start";
import Setup from "../js/utils/setup";
import Helpers from "../js/utils/helpers";

class Start extends React.Component {
  componentDidMount() {
    getStartComp().then(function (StartComp) {
      ReactDOM.render(
        <StartComp />,
        document.getElementById("main_container")
      );
    });
  }

  render() {
    return (<span></span>);
  }
}

function getStartComp() {
  start.initMenu();
  start.index();

  return new Promise(function (resolve, reject) {
    let count = 0;
    Helpers.isLoaded(resolve, reject, {}, start, count, 10);
  }).then(function (resolved) {
    const innerHtml = { __html: resolved };
    Setup.init();

    class Start extends Component {
      render() {
        return (
          <span dangerouslySetInnerHTML={innerHtml} />
        );
      }
    }

    return Start;
  }).catch(function (rejected) {
    console.warn("Failed", rejected);
  });
}

export { getStartComp };

export default Start;
