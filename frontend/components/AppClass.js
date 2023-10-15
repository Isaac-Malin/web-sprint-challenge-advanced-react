import React, { Component } from "react";
import axios from "axios";

const URL = "http://localhost:9000/api/result";

const initialMessage = "";
const initialEmail = "";

class AppClass extends Component {
  constructor(props) {
    super(props);
    this.state = {
      message: initialMessage,
      email: initialEmail,
      steps: 0,
      index: 4,
    };
  }

  getXY() {
    let x = (this.state.index % 3) + 1;
    let y = Math.ceil((this.state.index + 1) / 3);
    return [x, y];
  }

  getXYMessage() {
    let cords = this.getXY();
    return `Coordinates (${cords[0]}, ${cords[1]})`;
  }

  reset() {
    this.setState({
      message: initialMessage,
      email: initialEmail,
      steps: 0,
      index: 4,
    });
  }

  getNextIndex(direction) {
    let x = this.state.index % 3;
    let y = Math.floor(this.state.index / 3);

    switch (direction) {
      case "left":
        x = x > 0 ? x - 1 : x;
        break;
      case "up":
        y = y > 0 ? y - 1 : y;
        break;
      case "right":
        x = x < 2 ? x + 1 : x;
        break;
      case "down":
        y = y < 2 ? y + 1 : y;
        break;
      default:
        break;
    }

    if (x >= 0 && x <= 2 && y >= 0 && y <= 2) {
      return y * 3 + x;
    }

    return this.state.index;
  }

  move = (evt) => {
    const direction = evt.target.id;
    const newIndex = this.getNextIndex(direction);

    if (newIndex !== this.state.index) {
      this.setState((prevState) => ({
        index: newIndex,
        steps: prevState.steps + 1,
        message: "",
      }));
    } else {
      this.setState({
        message: `You can't go ${direction}`,
      });
    }
  };

  onChange = (evt) => {
    this.setState({
      email: evt.target.value,
    });
  };

  onSubmit = (evt) => {
    evt.preventDefault();

    axios
      .post(URL, { x: this.state.index % 3, y: Math.floor(this.state.index / 3), steps: this.state.steps, email: this.state.email })
      .then((response) => {
        this.setState({
          message: response.data.message,
        });
      })
      .catch((error) => {
        this.setState({
          message: error.response.data.message,
        });
      });
  };

  render() {
    return (
      <div id="wrapper" className={this.props.className}>
        <div className="info">
          <h3 id="coordinates">{this.getXYMessage()}</h3>
          <h3 id="steps">You moved {this.state.steps} times</h3>
        </div>
        <div id="grid">
          {[0, 1, 2, 3, 4, 5, 6, 7, 8].map((idx) => (
            <div
              key={idx}
              className={`square${idx === this.state.index ? " active" : ""}`}
            >
              {idx === this.state.index ? "B" : null}
            </div>
          ))}
        </div>
        <div className="info">
          <h3 id="message">{this.state.message}</h3>
        </div>
        <div id="keypad">
          <button onClick={this.move} id="left">
            LEFT
          </button>
          <button onClick={this.move} id="up">
            UP
          </button>
          <button onClick={this.move} id="right">
            RIGHT
          </button>
          <button onClick={this.move} id="down">
            DOWN
          </button>
          <button onClick={this.reset} id="reset">
            reset
          </button>
        </div>
        <form onSubmit={this.onSubmit}>
          <input
            onChange={this.onChange}
            id="email"
            type="email"
            placeholder="type email"
          />
          <input id="submit" type="submit" />
        </form>
      </div>
    );
  }
}

export default AppClass;
