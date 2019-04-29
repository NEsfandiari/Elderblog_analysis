import React, { Component } from "react";
import styled from "styled-components";
import axios from "axios";
const Container = styled.div``;

class WordChoice extends Component {
  state = {};
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
    this.setState({ tf_data: data[0], idf_data: data[1] });
  };
  render() {
    return (
      <Container>
        <div className="header">
          <h4>Word Choice</h4>
        </div>
      </Container>
    );
  }
}

export default WordChoice;
