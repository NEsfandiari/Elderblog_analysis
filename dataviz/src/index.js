import React from "react";
import ReactDOM from "react-dom";
import TopLinks from "./TopLinks";
import App from "./App";
import WordChoice from "./WordChoice";
import * as serviceWorker from "./serviceWorker";
import { Route, BrowserRouter as Router } from "react-router-dom";

const routing = (
  <Router>
    <link
      rel="stylesheet"
      href="//brick.freetls.fastly.net/Ubuntu:300,400,500,700,300i,400i,500i,700i"
    />
    <div style={{ fontFamily: "Ubuntu" }}>
      <Route path="/" component={App} />
      <Route path="/links" component={TopLinks} />
      <Route path="/words" component={WordChoice} />
    </div>
  </Router>
);

ReactDOM.render(routing, document.getElementById("root"));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
