import React, { useState } from "react";
import axios from "axios";

const URL = "http://localhost:9000/api/result";

const initialMessage = "";
const initialEmail = "";

export default function AppFunctional(props) {
  const [message, setMessage] = useState(initialMessage);
  const [email, setEmail] = useState(initialEmail);
  const [steps, setSteps] = useState(0);
  const [index, setIndex] = useState(4);

  function getXY() {
    let x = (index % 3) + 1;
    let y = Math.ceil((index + 1) / 3);
    return [x, y];
  }

  function getXYMessage() {
    let cords = getXY();
    return `Coordinates (${cords[0]}, ${cords[1]})`;
  }

  function reset() {
    setMessage(initialMessage);
    setEmail(initialEmail);
    setSteps(0);
    setIndex(4);
  }

  function getNextIndex(direction) {
    let x = index % 3;
    let y = Math.floor(index / 3);

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

    return y * 3 + x;
  }

  function move(evt) {
    const direction = evt.target.id;
    const newIndex = getNextIndex(direction);

    // Check if the movement is valid (newIndex is within the grid boundaries)
    if (newIndex >= 0 && newIndex <= 8) {
      setIndex(newIndex);
      setSteps(steps + 1);
      setMessage(""); // Clear previous message
    } else {
      setMessage("Cannot move in that direction.");
    }
  }

  function onChange(evt) {
    setEmail(evt.target.value);
  }

  function onSubmit(evt) {
    evt.preventDefault();
    // Make a POST request to the server endpoint with email and current coordinates
    axios
      .post(URL, {
        x: index % 3,
        y: Math.ceil((index + 1) / 3),
        steps: steps,
        email: email,
      })
      .then((res) => {
        setMessage(res.data.message);
        console.log(res.data);
      })
      .catch((error) => {
        console.log(error)
        setMessage(error.response.data.message);
      });
  }

  return (
    <div id="wrapper" className={props.className}>
      <div className="info">
        <h3 id="coordinates">{getXYMessage()}</h3>
        <h3 id="steps">You moved {steps} times</h3>
      </div>
      <div id="grid">
        {[0, 1, 2, 3, 4, 5, 6, 7, 8].map((idx) => (
          <div key={idx} className={`square${idx === index ? " active" : ""}`}>
            {idx === index ? "B" : null}
          </div>
        ))}
      </div>

      <div className="info">
        <h3 id="message">{message}</h3>
      </div>
      <div id="keypad">
        <button onClick={move} id="left">
          LEFT
        </button>
        <button onClick={move} id="up">
          UP
        </button>
        <button onClick={move} id="right">
          RIGHT
        </button>
        <button onClick={move} id="down">
          DOWN
        </button>
        <button onClick={reset} id="reset">
          reset
        </button>
      </div>
      <form onSubmit={onSubmit}>
        <input
          onChange={(evt) => onChange(evt)}
          id="email"
          type="email"
          placeholder="type email"
        ></input>
        <input id="submit" type="submit"></input>
      </form>
    </div>
  );
}
