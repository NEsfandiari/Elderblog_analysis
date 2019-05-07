import React, { Component } from "react";
import styled from "styled-components";
import axios from "axios";
import { ResponsiveLine } from "@nivo/line";

const Container = styled.div`
  height: 50vh;
  padding: 0rem 2rem;
  .checkboxes {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-around;
    padding-right: 3rem;
    padding-bottom: 3rem;
  }
  .input {
    display: flex;
    flex-direction: column;
    align-items: center;
    font-size: 0.8rem;
    padding: 0.5rem;
  }
`;

class EigenPosts extends Component {
  state = { eigen_data: [], line_data: [], authors: ["Kevin Simler"] };
  async componentDidMount() {
    const hostname =
      window.location.hostname === "localhost"
        ? "http://localhost:5000/"
        : "https://elderblog-analysis-server.herokuapp.com/";
    const eigen_data = await axios.get(`${hostname}data/posts`, {
      "Access-Control-Allow-Origin": "*"
    });
    const line_data = [];
    for (let author in eigen_data.data) {
      if (author !== "Venkatesh Rao") {
        const data = Object.entries(eigen_data.data[author])
          .reverse()
          .map((post, i) => {
            return {
              x: i,
              y: Math.round(100 * post[1]["score"]) / 100,
              post: post[0],
              year: post[1]["year"].slice(-4)
            };
          });
        line_data.push({
          id: author,
          data: data
        });
      } else {
        //TODO create era'd version of venkatesh
      }
    }
    this.setState({
      eigen_data: eigen_data.data,
      line_data: line_data
    });
  }
  handleNewAuthor = e => {
    let oldState = this.state.authors;
    if (e.target.checked) {
      this.setState({ authors: [...oldState, e.target.value] });
    } else {
      oldState.splice(oldState.indexOf(e.target.value), 1);
      this.setState({ authors: [...oldState] });
    }
  };

  render() {
    const line_data = this.state.line_data.filter(author => {
      return this.state.authors.includes(author.id);
    });
    const checkboxes = this.state.line_data.map(author => (
      <div className="input">
        <p>{author.id}</p>
        <input
          onChange={this.handleNewAuthor}
          name="authors"
          type="checkbox"
          value={author.id}
          checked={this.state.authors.includes(author.id) ? true : false}
        />
      </div>
    ));
    return (
      <Container>
        <div className="header">
          <h4>Posts with Unique Word Choice</h4>
        </div>
        <ResponsiveLine
          data={line_data}
          margin={{
            top: 50,
            right: 110,
            bottom: 50,
            left: 60
          }}
          xScale={{
            type: "point"
          }}
          yScale={{
            type: "linear",
            min: "auto",
            max: "auto"
          }}
          axisTop={{
            tickSize: 5,
            tickPadding: 5,
            tickRotation: 0,
            legend: "Posts in order of Release",
            legendOffset: -36,
            legendPosition: "middle"
          }}
          axisRight={null}
          axisBottom={null}
          axisLeft={{
            orient: "left",
            tickSize: 5,
            tickPadding: 5,
            tickRotation: 0,
            legend: "Uniqueness Score",
            legendOffset: -40,
            legendPosition: "middle"
          }}
          colors={{
            scheme: "nivo"
          }}
          dotSize={8}
          dotBorderWidth={2}
          dotBorderColor={{
            from: "color"
          }}
          enableDotLabel={false}
          animate={true}
          motionStiffness={90}
          motionDamping={15}
          tooltip={item => {
            debugger;
            const p_tags = item.data.map(data => (
              <p>
                <span style={{ color: data.serie.color || "black" }}>
                  {data.serie.id}
                </span>{" "}
                : <b>{data.data.post}</b>, {data.data.year}
              </p>
            ));
            return <div style={{ ...item.theme }}>{p_tags}</div>;
          }}
          enableStackTooltip={true}
          legends={[
            {
              anchor: "bottom-right",
              direction: "column",
              justify: false,
              translateX: 100,
              translateY: 0,
              itemsSpacing: 0,
              itemDirection: "left-to-right",
              itemWidth: 80,
              itemHeight: 20,
              itemOpacity: 0.75,
              symbolSize: 12,
              symbolShape: "circle",
              symbolBorderColor: "rgba(0, 0, 0, .5)",
              effects: [
                {
                  on: "hover",
                  style: {
                    itemBackground: "rgba(0, 0, 0, .03)",
                    itemOpacity: 1
                  }
                }
              ]
            }
          ]}
        />
        <div className="checkboxes">{checkboxes}</div>
      </Container>
    );
  }
}

export default EigenPosts;
