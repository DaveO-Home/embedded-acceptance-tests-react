import React from "react";
import {/* BrowserRouter as Router, */ Route, Link, HashRouter } from "react-router-dom";
import ReactDOM from "react-dom";
import Start from "./components/StartC";
import Pdf from "./components/PdfC";
import Tools from "./components/ToolsC";
import Contact from "./components/ContactC";
import Welcome from "./components/HelloWorldC";
import Login from "./components/LoginC";
import Dodex from "./components/DodexC";

const SideBar = () => (
    <div className="collapse small show" id="submenu1" aria-expanded="true">
        <ul className="flex-column nav pl-4">
            <li className="nav-item">
                <Link to="/"><i className="fa fa-fw fa-home"></i> Home</Link>
            </li>
            <li className="nav-item" >
                <Link to={{ pathname: "/pdf/test" }}><i className="far fa-fw fa-file-pdf"></i> PDF View</Link>
            </li>
            {/* 
                Added in for testing: font-awesome5 pollutes the url
            */}
            <li className="hidden" >
                <Link to={{ pathname: "/pdf/test" }}><i className="pdf-click"></i></Link>
            </li>
            <li className="nav-header nav-item">Statistics</li>
            <li className="nav-item">
                <Link to="/table/tools"><i className="fa fa-fw fa-table"></i> Tabular View</Link>
            </li>
            <li className="nav-header nav-item">React</li>
            <li className="nav-item">
                <Link to="/welcome"><i className="far fa-fw fa-hand-paper"></i> React Welcome</Link>
            </li>
        </ul>
        <div className="content">
            <Route exact path="/" component={Start} />
            <Route path="/pdf/test" component={Pdf} />
            <Route path="/table/tools" component={Tools} />
            <Route path="/contact" component={Contact} />
            <Route path="/welcome" component={Welcome} />
            <Route component={Start} />
        </div>
    </div>

);

const Menulinks = () => (
    <HashRouter>
        <SideBar />
    </HashRouter>
);

const Dodexlink = () => (
    <Dodex />
);

// For testing Component Login gets loaded in apptest.js
if (typeof testit === "undefined" || (typeof testit !== "undefined" && !testit)) {
    ReactDOM.render(
        <Login />,
        document.getElementById("nav-login")
    );
}

export default Menulinks;
export { Dodexlink };