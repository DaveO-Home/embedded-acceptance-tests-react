import React, { Component } from "react";
import ReactDOM from "react-dom";
import PropTypes from "prop-types";
import Setup from "../js/utils/setup";
import App from "../js/app";

App.init();

class Link extends Component {
  render() {
    const props = { src:"views/prod/Test.pdf" };
    return <iframe id="data" name="pdfDO" src={props.src} className="col-lg-12" style={{ height: "750px" }}></iframe>;
  }
}
Link.propTypes = {
  src: PropTypes.string.isRequired,
};

class Pdf extends Component {
  componentDidMount() { setPdfComp(); }
  render() {
    {
      if (App.controllers["Start"]) {
        App.controllers["Start"].initMenu();
      }
      Setup.init();
    }
    return (<span></span>);
  }
}

function getPdfComp() {
  return <Link src="" />;
}

function setPdfComp() {
  ReactDOM.render(
    <Link src="" />,
    document.getElementById("main_container")
  );
}

export { getPdfComp };

export default Pdf;
