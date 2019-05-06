import React, { Component } from "react";
import styled from "styled-components";
import Spinner from "react-spinkit";
import axios from "axios";
import { ResponsiveLine } from "@nivo/line";

const Container = styled.div`
  height: 50vh;
  padding: 0rem 2rem;
`;

class EigenPosts extends Component {
  state = { eigen_data: [], line_data: [] };
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
      const data = Object.entries(eigen_data.data[author])
        .reverse()
        .map((post, i) => {
          return {
            x: i,
            y: Math.round(100 * post[1]) / 100,
            post: post[0]
          };
        });
      line_data.push({
        id: author,
        data: data
      });
    }
    this.setState({
      eigen_data: eigen_data.data,
      line_data: line_data.slice(7, 10)
    });
  }
  render() {
    const line_data = this.state.line_data;
    return (
      <Container>
        <div className="header">
          <h4>Posts with Unique Word Choice</h4>
        </div>
        {!this.state.eigen_data ? (
          <Spinner name="pacman" />
        ) : (
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
            axisTop={null}
            axisRight={null}
            axisBottom={{
              orient: "bottom",
              tickSize: 5,
              tickPadding: 5,
              tickRotation: 0,
              legend: "Posts in order of Release",
              legendOffset: 36,
              legendPosition: "middle"
            }}
            axisLeft={{
              orient: "left",
              tickSize: 5,
              tickPadding: 5,
              tickRotation: 0,
              legend: "Semantic Uniqueness Score",
              legendOffset: -40,
              legendPosition: "middle"
            }}
            colors={{
              scheme: "nivo"
            }}
            dotSize={10}
            dotColor={{
              theme: "background"
            }}
            dotBorderWidth={2}
            dotBorderColor={{
              from: "color"
            }}
            enableDotLabel={true}
            dotLabel="y"
            dotLabelYOffset={-12}
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
                  : <b>{data.data.post}</b>
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
        )}
      </Container>
    );
  }
}

export default EigenPosts;
