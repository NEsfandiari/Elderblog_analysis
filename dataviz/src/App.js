import React, { Component } from "react";
import axios from "axios";

class App extends Component {
  state = { data: [] };
  async componentDidMount() {
    const data = await axios.get("http://localhost:5000/", {
      "Access-Control-Allow-Origin": "*"
    });
    this.setState({ data: data.data.data });
  }

  render() {
    const data = this.state.data.map(link => <li>{link.Link}</li>);
    return (
      <div className="App">
        <h1>Data Visualization</h1>
        <ul>{data}</ul>
      </div>
    );
  }
}

export default App;
