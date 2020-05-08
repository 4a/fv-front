import React from "react";
import { render } from "react-dom";

import { createStore } from "redux";
import { Provider } from "react-redux";

import reducers from "./reducers";
import middleware from "./middleware";

import App from "./App";
import "./css/lib/material-icons.css";
import "./css/index.css";
import * as serviceWorker from "./serviceWorker";

serviceWorker.unregister();

const store = createStore(reducers, {}, middleware); // reducer, initial state, middleware

render(
    <Provider store={store}>
        <App />
    </Provider>,
    document.getElementById("root")
);
