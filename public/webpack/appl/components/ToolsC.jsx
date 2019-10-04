/* eslint no-unused-vars: 0 */
import React, { Component } from "react";
import ReactDOM from "react-dom";
import Table from "../js/controller/table";
import Setup from "../js/utils/setup";
import App from "../js/app";
import Helpers from "../js/utils/helpers";
import ToolsSM from "../js/utils/tools.sm";

class Tools extends React.Component {
    componentDidMount () {
        getToolsComp().then(function (ToolsComp) {
            ReactDOM.render(
                <ToolsComp />,
                document.getElementById("main_container")
            );
        });
    }
    UNSAFE_componentWillReceiveProps () {
        getToolsComp().then(function (ToolsComp) {
            ReactDOM.render(
                <ToolsComp />,
                document.getElementById("main_container")
            );
        });
    }

    render () {
        return (<span></span>);
    }
}

function getToolsComp () {
    ToolsSM.toolsStateManagement();

    return new Promise(function (resolve, reject) {
        let count = 0;
        const controllerName = "Table";
        const actionName = "tools";
        const failMsg = `Load problem with: '${controllerName}/${actionName}'.`;
        App.loadController(controllerName, Table, controller => {
            if (controller &&
                controller[actionName]) {
                controller[actionName]({});
            } else {
                console.error(failMsg);
            }
        }, err => {
            console.error(`${failMsg} - ${err}`);
        });
        Helpers.isLoaded(resolve, reject, {}, Table, count, 10);
    })
        .catch(function (rejected) {
            console.warn("Failed", rejected);
        })
        .then(function (resolved) {
            const innerHtml = { __html: resolved };

            class Tools extends Component {
                componentDidMount () {
                    Table.decorateTable("tools");
                    Helpers.scrollTop();
                    if (App.controllers["Start"]) {
                        App.controllers["Start"].initMenu();
                    }
                    Setup.init();
                    ReactDOM.render(
                        <ToolsSelect />,
                        $("#main_container section")[0]
                    );
                    ReactDOM.render(
                        <ToolsValue />,
                        document.getElementById("tools-state")
                    );
                }
                render () {
                    return (
                        <span dangerouslySetInnerHTML={innerHtml} />
                    );
                }
            }

            return Tools;
        });
}

export { getToolsComp };

export default Tools;

class ToolsValue extends React.Component {
    constructor () {
        super();
        this.state = {
            items: []
        };
    }
    UNSAFE_componentWillMount () {
        const store = ToolsSM.getStore();
        let state = store.getState();

        store.subscribe(() => {
            this.setState({
                items: state.tools.items
            });
        });
    }

    render () {
        const items = ToolsSM.getStore().getState().tools.items;
        let index = -1;
        let message = "unknown";
        items.forEach((item, _index) => {
            if (item.displayed) {
                index = _index;
            }
        });
        if (index !== -1) {
            message = items[index].message;
        }

        return (
            <span>
                {message} (using Redux)
            </span>
        );
    }
}

class ToolsSelect extends React.Component {
    constructor () {
        super();
        this.store = ToolsSM.getStore();
        this.state = {
            items: []
        };
    }

    UNSAFE_componentWillMount () {
        this.store.subscribe(() => {
            let state = this.store.getState();
            this.setState({
                items: state.tools.items
            });
        });
    }
    componentDidMount () {
        $($("#dropdown1 a")[0]).fa({ icon: "check" }); // Default
        ToolsSM.addCategory("Combined");
    }

    onCompletedClick (e) {
        e.preventDefault();
        const controller = App.controllers["Table"];
        const message = e.target.text.trim();
        let store = ToolsSM.getStore();
        const found = ToolsSM.findEntry(message, store.getState().tools.items);

        controller.dropdownEvent(e);
        if (found.idx === -1) {
            ToolsSM.addCategory(message);
        } else {
            ToolsSM.replaceCategory(found.idx);
        }

        $("#dropdown1 a i").each(function () { this.remove(); });
        $(e.target).fa({ icon: "check" });
    }

    render () {
        return (
            <div id="dropdown1" className="dropdown">
                <button className="dropdown-toggle smallerfont"
                    type="button"
                    id="dropdown0"
                    data-toggle="dropdown"
                    aria-haspopup="true"
                    aria-expanded="false"
                >
                    Select Job Type
                </button>
                <div className="dropdown-menu" aria-labelledby="dropdown0">
                    <a className="dropdown-item smallerfont" onClick={this.onCompletedClick.bind(this)}>Combined</a>
                    <a className="dropdown-item smallerfont" onClick={this.onCompletedClick.bind(this)}>Category1</a>
                    <a className="dropdown-item smallerfont" onClick={this.onCompletedClick.bind(this)}>Category2</a>
                </div>
            </div>
        );
    }
}
