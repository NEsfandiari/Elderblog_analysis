import React, { Component } from "react";
import axios from "axios";
import { ResponsiveBar } from "@nivo/bar";

class App extends Component {
  state = { data: [], bars: 5 };
  async componentDidMount() {
    const data = await axios.get("http://localhost:5000/counter", {
      "Access-Control-Allow-Origin": "*"
    });
    this.setState({ data: data.data });
  }

  onSlide = e => {
    this.setState({ bars: e.target.value });
  };

  render() {
    const allData = this.state.data;
    const barData = [];
    if (allData.length > 0) {
      for (let i = 0; i < this.state.bars; i++) {
        barData.push({ link: allData[i][0], count: allData[i][1] });
      }
    }

    return (
      <div className="App" style={{ height: "80vh" }}>
        <h1>Data Visualization</h1>
        <h4>Top In-Linked Items On Ribbonfarm</h4>
        <ResponsiveBar
          data={barData}
          keys={["count"]}
          indexBy="link"
          margin={{
            top: 50,
            right: 130,
            bottom: 50,
            left: 60
          }}
          padding={0.3}
          colors={{
            scheme: "nivo"
          }}
          animate={true}
          motionStiffness={90}
          motionDamping={15}
          enableGridY={true}
          axisBottom={null}
        />
        <div>
          <p># of bars {this.state.bars}</p>
          <input
            onChange={this.onSlide}
            type="range"
            min="1"
            max="100"
            value={this.state.bar}
            class="slider"
          />
        </div>
      </div>
    );
  }
}

export default App;
