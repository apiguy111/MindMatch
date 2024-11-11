import React, { useEffect, useState } from "react";
import "./grid.css";
// import Lottie from "react-lottie";
import image from "../images/stopwatch.png";
// import animation from "../images/done.json";

const Grid = () => {
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [randomNumbers, setRandomNumbers] = useState([]);
  const [revealedIndices, setRevealedIndices] = useState([]);
  const [matchedIndices, setMatchedIndices] = useState([]);
  const [selectedIndices, setSelectedIndices] = useState([]);
  const [score, setScore] = useState(0);
  const [timerRunning, setTimerRunning] = useState(true);
  const [isFirstClick, setIsFirstClick] = useState(true);
  // const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    if (timerRunning) {
      const interval = setInterval(() => {
        setElapsedSeconds((prev) => prev + 1);
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [timerRunning]);

  const hour = Math.floor(elapsedSeconds / 3600);
  const minute = Math.floor((elapsedSeconds % 3600) / 60);
  const second = elapsedSeconds % 60;

  useEffect(() => {
    generateNumbers();
  }, []);

  const generateNumbers = () => {
    const uniqueNumbers = new Set();
    while (uniqueNumbers.size < 8) {
      const randomNum = Math.floor(Math.random() * 89) + 11;
      uniqueNumbers.add(randomNum);
    }

    const numbers = Array.from(uniqueNumbers).flatMap((num) => [num, num]);

    for (let i = numbers.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [numbers[i], numbers[j]] = [numbers[j], numbers[i]];
    }

    setRevealedIndices([]);
    setMatchedIndices([]);
    setScore(0);
    setRandomNumbers(numbers);
    setSelectedIndices([]);
    setTimerRunning(true);
    setElapsedSeconds(0);
  };

  const update = () => {
    generateNumbers();
    setTimerRunning(false);
    setIsFirstClick(true);
    // setIsModalOpen(false);
  };

  const handleActivate = (index) => {
    if (revealedIndices.includes(index) || matchedIndices.includes(index)) {
      return;
    }

    if (isFirstClick) {
      setTimerRunning(true);
      setIsFirstClick(false);
    }

    setRevealedIndices((prev) => [...prev, index]);
    setSelectedIndices((prev) => [...prev, index]);

    if (selectedIndices.length === 1) {
      const firstIndex = selectedIndices[0];

      if (randomNumbers[firstIndex] === randomNumbers[index]) {
        // Match found
        setMatchedIndices((prev) => [...prev, firstIndex, index]);
        setScore((prevScore) => prevScore + 2);
        setSelectedIndices([]);
      } else {
        // No match
        setScore((prevScore) => prevScore - 1);
        setTimeout(() => {
          setRevealedIndices((prev) =>
            prev.filter((i) => i !== firstIndex && i !== index)
          );
          setSelectedIndices([]);
        }, 500);
      }
    }
  };

  useEffect(() => {
    if (matchedIndices.length === randomNumbers.length && timerRunning) {
      setTimerRunning(false);
      // setIsModalOpen(true);
    }
  }, [matchedIndices, randomNumbers.length, timerRunning]);

  // const defaultOptions = {
  //   loop: false,
  //   autoplay: true,
  //   animationData: animation,
  //   rendererSettings: {
  //     preserveAspectRatio: "xMidYMid slice",
  //   },
  // };

  return (
    <div className="container">
      <p className="heading">MindMatch</p>

      <div className="gridContainer">
        {randomNumbers.map((num, index) => (
          <div
            key={index}
            className={`eachGrid ${
              matchedIndices.includes(index)
                ? "matched"
                : revealedIndices.includes(index)
                ? selectedIndices.length === 1 && selectedIndices[0] === index
                  ? "firstReveal"
                  : selectedIndices.length === 2 &&
                    randomNumbers[selectedIndices[0]] ===
                      randomNumbers[selectedIndices[1]]
                  ? "secondReveal"
                  : "mismatch"
                : ""
            }`}
            onClick={() => handleActivate(index)}
          >
            {(revealedIndices.includes(index) ||
              matchedIndices.includes(index)) &&
              num}
          </div>
        ))}
      </div>
      <div className="buttonContainer">
        <button className="button" onClick={update}>
          Reset
        </button>
        <div className="timerContainer">
          <img src={image} alt="" className="img" />
          <div className="timer">
            {String(hour).padStart(2, "0")}:{String(minute).padStart(2, "0")}:
            {String(second).padStart(2, "0")}{" "}
          </div>
        </div>
        <div className="scoreContainer">
          <p className="score">Score: {score}</p>
        </div>
      </div>
      {/* {isModalOpen && (
        <div className="modal">
          <div className="modal-content">
            <Lottie
              options={defaultOptions}
              height={200}
              width={200}
              className="lottie"
            />
            <h2>Congratulations!</h2>
            <p>Total Score: {score}</p>
            <p>
              Time Taken: {String(hour).padStart(2, "0")}:
              {String(minute).padStart(2, "0")}:
              {String(second).padStart(2, "0")}
            </p>
            <button className="continueButton" onClick={update}>
              Continue
            </button>
          </div>
        </div>
      )} */}
    </div>
  );
};

export default Grid;
