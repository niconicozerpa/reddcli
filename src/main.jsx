"use strict";

import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import thunkMiddleware from "redux-thunk";
import { createStore, applyMiddleware } from "redux";

import PostList from "./posts/postlist.jsx";
import reducer from "./reducers";
import { fetchRedditURL } from "./actions";
import { onURLChange } from "./lib/urlmanager.js";


import "./main.scss";

const store = createStore(
    reducer,
    applyMiddleware(thunkMiddleware)
);

onURLChange((url) => {
    store.dispatch(fetchRedditURL(url));
}, true);

ReactDOM.render(
    <div>
        <Provider store={store}>
            <PostList/>
        </Provider>
    </div>,
    document.getElementById("root")
);
