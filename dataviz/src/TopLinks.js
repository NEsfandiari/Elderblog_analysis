import React, { Component } from "react";
import styled from "styled-components";
import axios from "axios";
import { ResponsiveBar } from "@nivo/bar";

const Container = styled.div`
  height: 60vh;
  .selection {
    border: 2rem;
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    align-items: center;
    width: 50rem;
  }
  .slider {
    p {
      text-align: center;
    }
  }
  .date_range {
    display: flex;
    justify-content: space-around;
    align-items: flex-end;
    width: 50rem;
  }
  .input {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }
  button {
    height: 2rem;
    width: 5rem;
  }
`;

class TopLinks extends Component {
  state = {
    top_data: [],
    bars: 5,
    start_date: 2007,
    end_date: 2019,
    non_ribbonfarm: false,
    search: "false"
  };

  componentDidMount() {
    this.getTop();
  }

  getTop = async e => {
    if (e) {
      e.preventDefault();
    }
    const top_data = await axios.get(
      `http://localhost:5000/counter/${this.state.start_date}-${
        this.state.end_date
      }-${this.state.non_ribbonfarm}-${this.state.search}`,
      {
        "Access-Control-Allow-Origin": "*"
      }
    );
    this.setState({ top_data: top_data.data });
  };

  handleOutlink = node => {
    window.open(node.indexValue, "_blank");
  };

  onChange = e => {
    if (e.target.type === "checkbox") {
      this.setState({ [e.target.name]: e.target.checked });
    } else {
      this.setState({ [e.target.name]: e.target.value });
    }
  };

  render() {
    const topData = this.state.top_data;
    const barData = [];
    if (topData.length > 0) {
      let limit = this.state.bars;
      if (this.state.bars > topData.length) limit = topData.length;
      for (let i = 0; i < limit; i++) {
        barData.push({ link: topData[i][0], count: topData[i][1] });
      }
    }
    return (
      <Container>
        <div className="header">
          <h4>Top In-Linked Items On Ribbonfarm</h4>
        </div>
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
            scheme: "pastel1"
          }}
          colorBy={item => {
            const parser = document.createElement("a");
            parser.href = item.indexValue;
            if (parser.hostname.includes("www")) {
              parser.hostname = parser.hostname.slice(4);
            }
            return parser.hostname;
          }}
          animate={true}
          motionStiffness={90}
          motionDamping={15}
          enableGridY={true}
          axisBottom={null}
          tooltip={item => {
            const parser = document.createElement("a");
            parser.href = item.indexValue;
            return (
              <div style={{ ...item.theme }}>
                <p>Hostname: {parser.hostname}</p>
                <p>Pathname: {parser.pathname}</p>
                <p>Count: {item.value}</p>
              </div>
            );
          }}
          onClick={this.handleOutlink}
        />

        <div className="selection">
          <div className="slider">
            <p># of bars {this.state.bars}</p>
            <input
              onChange={this.onChange}
              type="range"
              name="bars"
              min="1"
              max={topData.length}
              value={this.state.bar}
              class="slider"
            />
          </div>

          <form className="date_range" onSubmit={this.getTop}>
            <div className="input">
              <p>Start Year: {this.state.start_date}</p>
              <input
                onChange={this.onChange}
                name="start_date"
                type="number"
                min="2007"
                max={this.state.end_date}
                value={this.state.date}
                placeholder={this.state.start_date}
              />
            </div>

            <div className="input">
              <p>End Year: {this.state.end_date}</p>
              <input
                onChange={this.onChange}
                name="end_date"
                type="number"
                min={this.state.start_date}
                max="2019"
                placeholder={this.state.end_date}
                value={this.state.date}
              />
            </div>

            <div className="input">
              <p>Non-Ribbonfarm</p>
              <input
                onChange={this.onChange}
                name="non_ribbonfarm"
                type="checkbox"
                checked={
                  this.state.search !== "false"
                    ? true
                    : this.state.non_ribbonfarm
                }
              />
            </div>
            <div className="input">
              <p>Sub Category</p>
              <select onChange={this.onChange} name="search">
                <option value={false}>None</option>
                <option value="amazon">Books</option>
                <option value="wikipedia">Wiki's</option>
                <option value="twitter">Tweets</option>
                <option value="youtube">Videos</option>
              </select>
            </div>
            <button>Refresh Data</button>
          </form>
        </div>
      </Container>
    );
  }
}

export default TopLinks;
