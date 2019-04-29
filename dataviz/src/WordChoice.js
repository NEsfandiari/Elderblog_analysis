import React, { Component } from "react";
import styled from "styled-components";
import axios from "axios";
import _ from "underscore";
import { ResponsiveSwarmPlot } from "@nivo/swarmplot";

const Container = styled.div`
  height: 60vh;
`;

class WordChoice extends Component {
  state = { tf_idf: [], authors: ["authors"] };
  componentDidMount() {
    this.getWords();
  }

  getWords = async e => {
    if (e) {
      e.preventDefault();
    }
    const data = await axios.get(`http://localhost:5000/words/hi`, {
      "Access-Control-Allow-Origin": "*"
    });
    debugger;
    this.setState({ tf_idf: data.data.tf_data, authors: data.data.authors });
  };
  render() {
    return (
      <Container>
        <div className="header">
          <h4>Word Choice</h4>
        </div>
        <ResponsiveSwarmPlot
          data={_.sample(this.state.tf_idf, 100)}
          groups={this.state.authors}
          groupBy={"author"}
          value="score"
          size={{
            key: "volume",
            values: [4, 20],
            sizes: [6, 20]
          }}
          forceStrength={4}
          simulationIterations={100}
          borderColor={{
            from: "color",
            modifiers: [["darker", 0.6], ["opacity", 0.5]]
          }}
          margin={{
            top: 80,
            right: 100,
            bottom: 80,
            left: 100
          }}
          axisLeft={{
            orient: "left",
            tickSize: 10,
            tickPadding: 5,
            tickRotation: 0,
            legend: "Uniqueness Score",
            legendPosition: "middle",
            legendOffset: -76
          }}
          motionStiffness={50}
          motionDamping={10}
        />
      </Container>
    );
  }
}

export default WordChoice;
