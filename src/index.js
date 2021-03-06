import React, { Component } from "react";
import ReactDOM from "react-dom";
import * as serviceWorker from "./serviceWorker";
import { Route, BrowserRouter as Router } from "react-router-dom";
import axios from "axios";
import App from "./App";
import TopLinks from "./TopLinks";
import WordChoice from "./WordChoice";
import EigenPosts from "./EigenPosts";

class Routing extends Component {
  state = {
    wordData: [
      [
        "Venkatesh Rao",
        [
          {
            author: "Venkatesh Rao",
            score: 5,
            word: "2x2",
            id: ".1",
            articles: []
          }
        ]
      ]
    ]
  };
  async componentDidMount() {
    const hostname =
      window.location.hostname === "localhost"
        ? "http://localhost:5000/"
        : "https://elderblog-analysis-server.herokuapp.com/";
    const data = await axios.get(`${hostname}data/words`, {
      "Access-Control-Allow-Origin": "*"
    });
    this.setState({ wordData: data.data });
  }
  render() {
    return (
      <Router>
        <link
          rel="stylesheet"
          href="//brick.freetls.fastly.net/Ubuntu:300,400,500,700,300i,400i,500i,700i"
        />
        <div style={{ fontFamily: "Ubuntu" }}>
          <Route path="/" component={App} />
          <Route path="/links" component={TopLinks} />
          <Route
            path="/words"
            render={props => (
              <WordChoice {...props} wordData={this.state.wordData} />
            )}
          />
          <Route path="/posts" component={EigenPosts} />
        </div>
      </Router>
    );
  }
}

ReactDOM.render(<Routing />, document.getElementById("root"));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
