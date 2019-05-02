import React, { Component } from "react";
import styled from "styled-components";
import Spinner from "react-spinkit";
import _ from "lodash";
import { ResponsiveSwarmPlot } from "@nivo/swarmplot";

const Container = styled.div`
  padding: 2rem;
  height: 60vh;
  .content {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 50vh;
  }
  .check_boxes {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-around;
    padding-right: 5rem;
    padding-bottom: 3rem;
  }

  .input {
    display: flex;
    flex-direction: column;
    align-items: center;
    font-size: 0.8rem;
    padding: 0.5rem;
  }
  @media (max-width: 500px) {
    .check_boxes {
      padding-right: 1rem;
    }
  }
`;

class WordChoice extends Component {
  state = {
    tf_idf: this.props.wordData,
    sample_data: [],
    authors: ["Venkatesh Rao"],
    updated: false
  };
  componentDidMount() {
    const sample_data = this.getRandom(this.state.tf_idf);
    this.setState({
      sample_data: sample_data
    });
  }
  componentDidUpdate() {
    if (!this.state.updated && this.props.wordData.length > 2) {
      this.setState({
        tf_idf: this.props.wordData,
        updated: true
      });
      this.getRandom(this.props.wordData);
    }
  }

  getRandom = arr => {
    const sample_data = [];
    arr.forEach(arr => {
      if (this.state.authors.includes(arr[0])) {
        const authorSample = _.sampleSize(arr[1], 50);
        sample_data.push(...authorSample);
      }
    });
    return sample_data;
  };

  handleNewWords = () => {
    const sample_data = this.getRandom(this.state.tf_idf);
    this.setState({ sample_data: sample_data });
  };

  handleNewAuthor = e => {
    const newState = this.state.authors;
    if (e.target.checked && this.state.authors.length < 4) {
      newState.push(e.target.value);
      this.setState({ authors: [...newState] });
    } else if (!e.target.checked && this.state.authors.length > 1) {
      newState.splice(newState.indexOf(e.target.value), 1);
      this.setState({ authors: [...newState] });
    }
  };

  render() {
    const checkBoxes = this.state.tf_idf.map(arr => (
      <div className="input">
        <p>{arr[0]}</p>
        <input
          onChange={this.handleNewAuthor}
          name="authors"
          type="checkbox"
          value={arr[0]}
          checked={this.state.authors.includes(arr[0])}
        />
      </div>
    ));
    return (
      <Container>
        <div className="header">
          <h4>Word Choice</h4>
        </div>

        {!this.state.updated ? (
          <div className="content">
            <p>
              Analyzing 1.2 Million Words! <br /> Please Wait up to 30 seconds.
            </p>
            <Spinner name="pacman" />
          </div>
        ) : (
          <ResponsiveSwarmPlot
            data={this.state.sample_data}
            groups={this.state.authors}
            groupBy="author"
            value="score"
            size={item => {
              const size = item.articles.length * parseInt(item.score);
              if (size > 20) return 20;
              else return size;
            }}
            identity={item => {
              return item.id;
            }}
            label={item => {
              return item.data.word;
            }}
            forceStrength={2}
            simulationIterations={60}
            colorBy={item => {
              return item.value;
            }}
            borderColor={{
              from: "color",
              modifiers: [["darker", 0.6], ["opacity", 0.5]]
            }}
            margin={{
              top: 50,
              right: 50,
              bottom: 50,
              left: 85
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
        )}
        <div className="selection">
          <button onClick={this.handleNewWords}>New Words</button>
          <div className="check_boxes">{checkBoxes}</div>
        </div>
      </Container>
    );
  }
}

export default WordChoice;
