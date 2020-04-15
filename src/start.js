import React from "react";
import ReactDOM from "react-dom";
import Welcome from "./welcome";
import App from "./app";
// import * as io from "socket.io-client";

// io.connect();

// let elem = <App />;

// if (location.pathname == "/welcome") {
//     elem = <Welcome />;
// }
////////////////REDUX BOILERPLATE MIDDLEWARE//////////
import { Provider } from "react-redux";
import { createStore, applyMiddleware } from "redux";
import reduxPromise from "redux-promise";
import { composeWithDevTools } from "redux-devtools-extension";
import reducer from "./reducer.js";

const store = createStore(
    reducer,
    composeWithDevTools(applyMiddleware(reduxPromise))
);
////////////////////////////////////////////////
let elem;

if (location.pathname === "/welcome") {
    elem = <Welcome />;
} else {
    elem = (
        <Provider store={store}>
            <App />
        </Provider>
    );
}

ReactDOM.render(elem, document.querySelector("main"));
