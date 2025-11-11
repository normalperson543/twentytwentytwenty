import {
  BrainIcon,
  CalendarCheck2Icon,
  ClockCheckIcon,
  EyeClosedIcon,
  FastForwardIcon,
  FootprintsIcon,
  PauseIcon,
  PlayIcon,
  RulerIcon,
  SquareStopIcon,
} from "lucide-react";
import { useRef, useState } from "react";
import startTimerFile from "./assets/start-timer.mp3";
import startBreakFile from "./assets/start-break.mp3";
import endBreakFile from "./assets/end-break.mp3";
import TimerBar from "./components/timer-bar";
function App() {
  let lsBreaks = localStorage.getItem("breaks");
  let lsDayStreaks = localStorage.getItem("dayStreaks");

  if (!lsBreaks) {
    localStorage.setItem("breaks", "0");
    lsBreaks = "0";
  }
  if (!lsDayStreaks) {
    localStorage.setItem("dayStreaks", "0");
    lsDayStreaks = "0";
  }

  const [breaks, setBreaks] = useState(Number(lsBreaks));
  const [dayStreaks, setDayStreaks] = useState(Number(lsDayStreaks));
  const [started, setStarted] = useState(false);
  const timeStart = useRef<number>(0);
  const [timeRemaining, setTimeRemaining] = useState(1200000);
  const [breakStarted, setBreakStarted] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [readyToStartBreak, setReadyToStartBreak] = useState(false);
  const pauseCheckpoint = useRef<number>(0);

  const intervalId = useRef(0);

  const startTimerAudio = new Audio(startTimerFile);
  const startBreakAudio = new Audio(startBreakFile);
  const endBreakAudio = new Audio(endBreakFile);

  function startTimer() {
    startTimerAudio.play();
    console.log("timer");
    stopTimers();
    timeStart.current = Date.now();
    setStarted(true);
    setBreakStarted(false);
    resumeTimer();
  }

  function resumeTimer() {
    intervalId.current = setInterval(() => {
      if (timeStart.current + 1200000 - Date.now() <= 0) {
        setTimeRemaining(0);
      } else {
        console.log(Date.now());
        console.log(timeStart.current);
        setTimeRemaining(timeStart.current + 1200000 - Date.now());
      }
    }, 100);
  }
  function startBreak() {
    console.log("Bnreak");
    setReadyToStartBreak(false)
    stopTimers();
    timeStart.current = Date.now();
    setBreakStarted(true);
    resumeBreak();
  }

  function resumeBreak() {
    intervalId.current = setInterval(() => {
      if (timeStart.current + 20000 - Date.now() <= 0) {
        nextRound();
      } else {
        setTimeRemaining(timeStart.current + 20000 - Date.now());
      }
    }, 100);
  }

  function stopClicked() {
    stopTimers();
    setStarted(false);
    setBreakStarted(false);
    setTimeRemaining(1200000);
  }
  function stopTimers() {
    clearInterval(intervalId.current);
  }

  function nextRound() {
    endBreakAudio.play();
    setBreaks(breaks + 1);
    localStorage.setItem("breaks", breaks.toString());
    setTimeRemaining(0);
    startTimer();
  }

  function resumeTimerButtonClicked() {
    setIsPaused(false);
    timeStart.current = Date.now() - pauseCheckpoint.current;
    if (breakStarted) {
      resumeBreak();
    } else {
      resumeTimer();
    }
  }
  function pauseTimerButtonClicked() {
    console.log("Trying to stop timers...");
    pauseCheckpoint.current = Date.now() - timeStart.current;
    setIsPaused(true);
    stopTimers();
  }
  function prepareStartBreak() {
    startBreakAudio.play();
    setReadyToStartBreak(true);
    stopTimers()
  }
  return (
    <div className="w-full h-full">
      <div className="flex flex-col gap-2 items-center justify-center h-full w-full">
        {breakStarted ? (
          <TimerBar
            progressBarBgColor="#002570"
            barBgColor="#001133"
            progressPercentage={(timeRemaining / 20000) * 100}
          >
            {Math.floor(timeRemaining / 60000)}:
            {String(Math.floor((timeRemaining % 60000) / 1000)).padStart(
              2,
              "0"
            )}
          </TimerBar>
        ) : (
          <TimerBar
            progressBarBgColor="#943900"
            barBgColor="#572100"
            progressPercentage={(timeRemaining / 1200000) * 100}
          >
            {Math.floor(timeRemaining / 60000)}:
            {String(Math.floor((timeRemaining % 60000) / 1000)).padStart(
              2,
              "0"
            )}
          </TimerBar>
        )}
        {breakStarted ?
          <div className="bg-blue-900 items-center justify-center flex flex-col text-center p-2 rounded-full relative -top-4">
            <p>until your break is over</p>
          </div>
        :
          <div className="bg-amber-900 items-center justify-center flex flex-col text-center p-2 rounded-full relative -top-4">
          <p>until your next eye break</p>
        </div>
        }
        
        <div className="flex flex-row gap-3">
          {started ? (
            isPaused ? (
              <button
                onClick={resumeTimerButtonClicked}
                className="bg-green-950 rounded-full p-6 flex flex-row gap-2 border-green-900 border-3 border-solid hover:bg-green-900"
              >
                <PlayIcon width={24} height={24} />
                <p>Continue</p>
              </button>
            ) : (
              <button
                onClick={pauseTimerButtonClicked}
                className="bg-green-950 rounded-full p-6 flex flex-row gap-2 border-green-900 border-3 border-solid hover:bg-green-900"
              >
                <PauseIcon width={24} height={24} />
                <p>Pause</p>
              </button>
            )
          ) : (
            <button
              onClick={startTimer}
              className="bg-green-950 rounded-full p-6 flex flex-row gap-2 border-green-900 border-3 border-solid hover:bg-green-900"
            >
              <PlayIcon width={24} height={24} />
              <p>Start</p>
            </button>
          )}
          {breakStarted ? (
            <button
              onClick={nextRound}
              className="bg-blue-900 rounded-full p-6 flex flex-row gap-2 border-blue-950 border-3 border-solid"
            >
              <FastForwardIcon width={24} height={24} />
              <p>Skip Break</p>
            </button>
          ) : (
            <button
              onClick={prepareStartBreak}
              className="bg-blue-900 rounded-full p-6 flex flex-row gap-2 border-blue-950 border-3 border-solid"
            >
              <EyeClosedIcon width={24} height={24} />
              <p>Break</p>
            </button>
          )}
          <button
            onClick={stopClicked}
            className="bg-orange-900 rounded-full p-6 flex flex-row gap-2 border-orange-950 border-3 border-solid"
          >
            <SquareStopIcon width={24} height={24} />
            <p>Stop</p>
          </button>
        </div>
        <div className="flex flex-row gap-3 bg-amber-900 rounded-sm p-4">
          <div className="flex flex-col gap-1">
            <div className="flex flex-row gap-1 items-center">
              <BrainIcon width={24} height={24} />
              <p className="text-2xl font-bold">{breaks}</p>
            </div>
            <p>total breaks</p>
          </div>
          <div className="flex flex-col gap-1">
            <div className="flex flex-row gap-1 items-center">
              <FootprintsIcon width={24} height={24} />
              <p className="text-2xl font-bold">0</p>
            </div>
            <p>break streaks</p>
          </div>
          <div className="flex flex-col gap-1">
            <div className="flex flex-row gap-1 items-center">
              <ClockCheckIcon width={24} height={24} />
              <p className="text-2xl font-bold">
                {Math.round(breaks * (1 / 3) * 100) / 100}
              </p>
            </div>
            <p>rested minutes</p>
          </div>
          <div className="flex flex-col gap-1">
            <div className="flex flex-row gap-1 items-center">
              <CalendarCheck2Icon width={24} height={24} />
              <p className="text-2xl font-bold">18</p>
            </div>
            <p>day streak</p>
          </div>
        </div>
      </div>
      {readyToStartBreak && (
        <div className="bg-amber-950 p-8 w-1/2 h-1/2 rounded-sm absolute top-1/2 left-1/2 -translate-1/2 shadow-xl shadow-amber-900 flex flex-col gap-3 justify-center items-center">
          <div className="absolute -top-24 left-0 w-full shadow-xl shadow-blue-900">
            <TimerBar
              progressBarBgColor="#002570"
              barBgColor="#001133"
              progressPercentage={100}
            >
              0:20
            </TimerBar>
          </div>
          <h2 className="text-2xl font-bold">
            It's been 20 minutes, time to take a break.
          </h2>
          <div className="flex flex-row w-full justify-around">
            <div className="flex flex-col gap-2 items-center text-center">
              <ClockCheckIcon width={60} height={60} />
              <p>Every</p>
              <p className="text-5xl font-bold">20</p>
              <p>minutes...</p>
            </div>
            <div className="flex flex-col gap-2 items-center text-center">
              <RulerIcon width={60} height={60} />
              <p>Look at something</p>
              <p className="text-5xl font-bold">20</p>
              <p>feet away...</p>
            </div>
            <div className="flex flex-col gap-2 items-center text-center">
              <EyeClosedIcon width={60} height={60} />
              <p>For</p>
              <p className="text-5xl font-bold">20</p>
              <p>seconds</p>
            </div>
          </div>
          <div className="flex flex-row gap-2">
            <button
              onClick={startBreak}
              className="bg-green-900 rounded-full p-6 flex flex-row gap-2 border-green-950 border-3 border-solid"
            >
              <EyeClosedIcon width={24} height={24} />
              <p>Start Break</p>
            </button>
            <button
              onClick={nextRound}
              className="bg-blue-900 rounded-full p-6 flex flex-row gap-2 border-blue-950 border-3 border-solid"
            >
              <FastForwardIcon width={24} height={24} />
              <p>Skip Break</p>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
