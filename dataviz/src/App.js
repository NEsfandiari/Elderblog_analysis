import React, { Component } from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";
const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  .links {
    display: flex;
    justify-content: space-around;
    width: 20rem;
  }
`;
class App extends Component {
  state = {};
  render() {
    return (
      <Container>
        <h1>Data Visualizations</h1>
        <div className="links">
          <Link to="/links">Top Links</Link>
          <Link to="/words">Semantic Analyszer</Link>
        </div>
      </Container>
    );
  }
}

export default App;
