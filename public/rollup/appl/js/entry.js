import React from "react";
import ReactDOM from "react-dom";
import Menulinks from "../Menulinks";
// if (typeof testit !== 'undefined' && testit) {
//   setTimeout(function () {
//     ReactDOM.render(
//       <Menulinks />,
//       document.getElementById("root")
//     )
//   }, 1000)
// } else {
if (typeof testit === "undefined" || !testit) {
  ReactDOM.render(
    <Menulinks />,
    document.getElementById("root")
  );
}
// }
