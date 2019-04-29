import React, { Component } from "react";
import styled from "styled-components";
import axios from "axios";
import _ from "lodash";
import { ResponsiveSwarmPlot } from "@nivo/swarmplot";

const Container = styled.div`
  height: 60vh;
`;

class WordChoice extends Component {
  state = {
    tf_idf: [],
    sample_data: [{ author: "Venkatesh Rao", score: 5, word: "2x2", id: ".1" }],
    authors: ["Venkatesh Rao"]
  };
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
    const sample_data = this.getRandom(data.data);
    this.setState({
      tf_idf: data.data,
      sample_data: sample_data
    });
  };

  getRandom = arr => {
    const sample_data = [];
    arr.forEach(arr => {
      if (this.state.authors.includes(arr[0])) {
        const authorSample = _.sampleSize(arr[1], 100);
        sample_data.push(...authorSample);
      }
    });
    return sample_data;
  };

  handleNewWords = () => {
    const sample_data = this.getRandom(this.state.tf_idf);
    this.setState({ sample_data: sample_data });
  };

  render() {
    return (
      <Container>
        <div className="header">
          <h4>Word Choice</h4>
        </div>
        <ResponsiveSwarmPlot
          data={this.state.sample_data}
          groups={this.state.authors}
          groupBy="author"
          value="score"
          identity={item => {
            return item.id;
          }}
          label={item => {
            return item.data.word;
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
        <button onClick={this.handleNewWords}>New Words</button>
      </Container>
    );
  }
}

export default WordChoice;
