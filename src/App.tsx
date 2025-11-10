import {
  BrainIcon,
  CalendarCheck2Icon,
  ClockCheckIcon,
  EyeClosedIcon,
  FastForwardIcon,
  FootprintsIcon,
  PauseIcon,
  PlayIcon,
  SquareStopIcon,
} from "lucide-react";
import { useRef, useState } from "react";
import startTimerFile from "./assets/start-timer.mp3";
import startBreakFile from "./assets/start-break.mp3";
import endBreakFile from "./assets/end-break.mp3";
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
        startBreak();
        console.log("starting break");
      } else {
        console.log(Date.now());
        console.log(timeStart.current);
        setTimeRemaining(timeStart.current + 1200000 - Date.now());
      }
    }, 100);
  }
  function startBreak() {
    startBreakAudio.play();
    console.log("Bnreak");
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
    setIsPaused(false)
    resumeTimer()
  }
  function pauseTimerButtonClicked() {
    setIsPaused(true)
    stopTimers()
  }
  return (
    <div className="w-full h-full">
      <div className="flex flex-col gap-2 items-center justify-center h-full w-full">
        {breakStarted ? (
          <div
            style={{
              background: `linear-gradient(to right,#002570 ${String(
                (timeRemaining / 20000) * 100
              )}%, #001133 ${(timeRemaining / 20000) * 100}%)`,
            }}
            className="
            w-1/2 p-8 rounded-sm text-center font-bold text-5xl"
          >
            {Math.floor(timeRemaining / 60000)}:
            {String(Math.floor((timeRemaining % 60000) / 1000)).padStart(
              2,
              "0"
            )}
          </div>
        ) : (
          <div
            style={{
              background: `linear-gradient(to right,#943900 ${String(
                (timeRemaining / 1200000) * 100
              )}%, #572100 ${(timeRemaining / 1200000) * 100}%)`,
            }}
            className="
            w-1/2 p-8 rounded-sm text-center font-bold text-5xl"
          >
            {Math.floor(timeRemaining / 60000)}:
            {String(Math.floor((timeRemaining % 60000) / 1000)).padStart(
              2,
              "0"
            )}
          </div>
        )}
        <div className="bg-amber-900 items-center justify-center flex flex-col text-center p-2 rounded-full relative -top-4">
          <p>until your next eye break</p>
        </div>
        <div className="flex flex-row gap-3">
          {started ? (
            isPaused ? (
              <button onClick={resumeTimerButtonClicked} className="bg-green-950 rounded-full p-6 flex flex-row gap-2 border-green-900 border-3 border-solid hover:bg-green-900">
                <PlayIcon width={24} height={24} />
                <p>Continue</p>
              </button>
            ) : (
              
              <button onClick={pauseTimerButtonClicked} className="bg-green-950 rounded-full p-6 flex flex-row gap-2 border-green-900 border-3 border-solid hover:bg-green-900">
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
              onClick={startBreak}
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
      <div className="bg-amber-950 p-8 w-1/2 h-1/2 rounded-sm absolute "></div>
    </div>
  );
}

export default App;
