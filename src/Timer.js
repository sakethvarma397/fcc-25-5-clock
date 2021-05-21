import React, { useEffect, useRef, useState } from "react";

const Timer = () => {
  const audioElement = useRef();
  const timerIdRef = useRef(0);
  const [breakLength, setBreaklength] = useState(5);
  const [sessionLength, setSessionlength] = useState(25);
  const [displayTime, setDisplayTime] = useState(sessionLength * 60);
  const [timertype, setTimertype] = useState("Session");

  useEffect(() => {
    setDisplayTime(sessionLength * 60);
  }, [sessionLength]);

  useEffect(() => {
    if (displayTime === 0) {
      audioElement.current.currentTime = 0;
      audioElement.current.play();
      if (timertype === "Session") {
        setTimertype("Break");
        setDisplayTime(breakLength * 60);
      } else {
        setTimertype("Session");
        setDisplayTime(sessionLength * 60);
      }
    }
  }, [displayTime, breakLength, sessionLength, timertype]);

  useEffect(() => {
    return () => clearInterval(timerIdRef.current);
  }, []);

  const controlTimer = () => {
    if (timerIdRef.current) {
      window.clearInterval(timerIdRef.current);
      timerIdRef.current = 0;
    } else {
      timerIdRef.current = window.setInterval(() => {
        setDisplayTime((prevDisplayTime) => prevDisplayTime - 1);
      }, 1000);
    }
  };

  const resetTimer = () => {
    audioElement.current.pause();
    audioElement.current.currentTime = 0;
    if (timerIdRef.current) {
      window.clearInterval(timerIdRef.current);
      timerIdRef.current = 0;
    }
    setTimertype("Session");
    setSessionlength(25);
    setBreaklength(5);
    setDisplayTime(25 * 60);
  };

  const printTime = (value) => {
    let min = Math.floor(value / 60)
      .toString()
      .padStart(2, "0");
    let sec = value % 60;
    sec = sec.toString().padStart(2, "0");
    return min + ":" + sec;
  };

  return (
    <div>
      <TimerControl
        key="break"
        tag="break"
        length={breakLength}
        setLength={setBreaklength}
      ></TimerControl>
      <TimerControl
        key="session"
        tag="session"
        length={sessionLength}
        setLength={setSessionlength}
      ></TimerControl>
      <div className="timer">
        <div id="timer-label">{timertype}</div>
        <div id="time-left">{printTime(displayTime)}</div>
        <div>
          <button onClick={controlTimer} id="start_stop">
            Run
          </button>
          <button onClick={resetTimer} id="reset">
            Reset
          </button>
        </div>
      </div>
      <audio
        id="beep"
        preload="auto"
        ref={audioElement}
        src="https://raw.githubusercontent.com/freeCodeCamp/cdn/master/build/testable-projects-fcc/audio/BeepSound.wav"
      ></audio>
    </div>
  );
};

const TimerControl = ({ tag, length, setLength }) => {
  const handleClick = (key) => {
    if (key === "+") {
      if (length <= 59) {
        setLength(length + 1);
      }
    }
    if (key === "-") {
      if (length > 1) {
        setLength(length - 1);
      }
    }
  };
  return (
    <div className="customize">
      <div id={`${tag}-label`}>{tag} length</div>
      <div id={`${tag}-length`}>{length}</div>
      <div>
        <button onClick={() => handleClick("+")} id={`${tag}-increment`}>
          +
        </button>
        <button onClick={() => handleClick("-")} id={`${tag}-decrement`}>
          -
        </button>
      </div>
    </div>
  );
};

export default Timer;
