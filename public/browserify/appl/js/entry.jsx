import React from "react";
import ReactDOM from "react-dom";
import Menulinks from "../Menulinks";

// Render when not testing
if (typeof testit === 'undefined' || (typeof testit !== 'undefined' && !testit)) {
  ReactDOM.render(
    <Menulinks />,
    document.getElementById("root")
  )
}
