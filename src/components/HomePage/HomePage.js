import React, { useEffect, useState, useRef } from "react";
import "./HomePage.css";

// Import sound effects
import startSound from "./startSound.mp3";
import tickSound from "./tickSound.mp3";
import winSound from "./winSound.mp3";
import levelUpSound from "./levelUpSound.mp3";

function HomePage() {
  const [count, setCount] = useState(0);
  const [timer, setTimer] = useState(0);
  const [bgColor, setBgColor] = useState("white");
  const [confetti, setConfetti] = useState(false);
  const [paused, setPaused] = useState(false);

  // Use useRef to store the audio instances
  const startSoundRef = useRef(new Audio(startSound));
  const tickSoundRef = useRef(new Audio(tickSound));
  const winSoundRef = useRef(new Audio(winSound));
  const levelUpSoundRef = useRef(new Audio(levelUpSound));

  const playSound = (soundRef) => {
    soundRef.current.currentTime = 0; // Restart sound
    soundRef.current.play();
  };

  // Reset all audio players to stop sound
  const stopAllSounds = () => {
    startSoundRef.current.pause();
    tickSoundRef.current.pause();
    winSoundRef.current.pause();
    levelUpSoundRef.current.pause();

    // Reset time to start from the beginning
    startSoundRef.current.currentTime = 0;
    tickSoundRef.current.currentTime = 0;
    winSoundRef.current.currentTime = 0;
    levelUpSoundRef.current.currentTime = 0;
  };

  const randomColor = () => {
    const colors = [
      "lightblue",
      "lightgreen",
      "lightyellow",
      "lightpink",
      "lightcoral",
    ];
    return colors[Math.floor(Math.random() * colors.length)];
  };

  useEffect(() => {
    if (timer === 0 || paused) return;

    const interval = setInterval(() => {
      setTimer((prevTimer) => {
        if (prevTimer > 0) {
          playSound(tickSoundRef); // Play tick sound only when timer is actively running
          return prevTimer - 1;
        }
        clearInterval(interval);
        return 0;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [timer, paused]);

  useEffect(() => {
    if (timer === 0 && count > 0) {
      setConfetti(true);
      playSound(winSoundRef); // Play win sound
    }
  }, [timer, count]);

  useEffect(() => {
    if (count > 0 && count % 5 === 0) {
      playSound(levelUpSoundRef); // Play level-up sound every 5 clicks
    }
  }, [count]);

  return (
    <div className="home-container" style={{ backgroundColor: bgColor }}>
      <div className="home-timer">Timer: {timer}</div>
      <div className="home-count" style={{ fontSize: count * 2 + 20 }}>
        {count}
      </div>
      <button
        className="home-btn-start btn"
        onClick={() => {
          setTimer(10);
          setCount(0);
          setBgColor(randomColor()); // Change background color randomly
          setPaused(false); // Ensure the timer is not paused
          stopAllSounds(); // Stop any ongoing sounds
          playSound(startSoundRef); // Play start sound
        }}
        disabled={timer !== 0}
      >
        Start
      </button>
      <button
        className="home-btn-click btn"
        onClick={() => setCount(count + 1)}
        disabled={timer === 0 || paused}
      >
        Click me
      </button>
      <button
        className="home-btn-pause btn"
        onClick={() => setPaused(!paused)} // Toggle pause/resume
        disabled={timer === 0}
      >
        {paused ? "Resume" : "Pause"}
      </button>
      <button
        className="home-btn-reset btn"
        onClick={() => {
          setCount(0);
          setTimer(0);
          setBgColor("white");
          setConfetti(false); // Stop confetti
          stopAllSounds(); // Stop all sounds on reset
        }}
      >
        Reset
      </button>

      {confetti && (
        <div className="confetti">
          <span>🎉</span>
          <span>🎉</span>
          <span>🎉</span>
        </div>
      )}

      {/* Progress Bar */}
      <div className="progress-container">
        <div
          className="progress-bar"
          style={{ width: `${(timer / 10) * 100}%` }}
        ></div>
      </div>

      {/* Score Feedback */}
      {count > 0 && count % 3 === 0 && (
        <div className="score-feedback">Nice! Keep going!</div>
      )}
    </div>
  );
}

export default HomePage;
