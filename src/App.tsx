import {
  CalendarCheck2Icon,
  ClockCheckIcon,
  EyeClosedIcon,
  FootprintsIcon,
  PauseIcon,
  PlayIcon,
  SquareStopIcon,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";

function App() {
  let lsBreakStreaks = localStorage.getItem("breakStreaks");
  let lsDayStreaks = localStorage.getItem("dayStreaks");

  if (!lsBreakStreaks) {
    localStorage.setItem("breakStreaks", "0");
    lsBreakStreaks = "0";
  }
  if (!lsDayStreaks) {
    localStorage.setItem("dayStreaks", "0");
    lsDayStreaks = "0";
  }

  const [breakStreaks, setBreakStreaks] = useState(Number(lsBreakStreaks));
  const [dayStreaks, setDayStreaks] = useState(Number(lsDayStreaks));
  const [started, setStarted] = useState(false);

  const timeStart = useRef<number>(0);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [breakStarted, setBreakStarted] = useState(false);

  const intervalId = useRef(0);

  function startTimer() {
    stopTimers();
    timeStart.current = Date.now();
    setStarted(true);
    intervalId.current = setInterval(() => {
      console.log(
        `${Math.floor(timeRemaining / 60000)}:${String(
          Math.floor((timeRemaining % 60000) / 60000)
        ).padStart(2, "0")}`
      );
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
    console.log("Bnreak");
    stopTimers();
    timeStart.current = Date.now();
    setBreakStarted(true);
    intervalId.current = setInterval(() => {
      if (timeStart.current + 20000 - Date.now()) {
        setTimeRemaining(0);
        startTimer();
      } else {
        setTimeRemaining(Date.now() - timeStart.current);
      }
    }, 100);
  }

  function stopTimers() {
    clearInterval(intervalId.current);
  }
  return (
    <div className="w-full h-full">
      <div className="flex flex-col gap-2 items-center justify-center h-full w-full">
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
          {String(Math.floor((timeRemaining % 60000) / 1000)).padStart(2, "0")}
        </div>
        <div className="bg-amber-900 items-center justify-center flex flex-col text-center p-2 rounded-full relative -top-4">
          <p>until your next eye break</p>
        </div>
        <div className="flex flex-row gap-3">
          {started ? (
            <button className="bg-green-950 rounded-full p-6 flex flex-row gap-2 border-green-900 border-3 border-solid hover:bg-green-900">
              <PauseIcon width={24} height={24} />
              <p>Pause</p>
            </button>
          ) : (
            <button
              onClick={startTimer}
              className="bg-green-950 rounded-full p-6 flex flex-row gap-2 border-green-900 border-3 border-solid hover:bg-green-900"
            >
              <PlayIcon width={24} height={24} />
              <p>Start</p>
            </button>
          )}
          <button
            onClick={startBreak}
            className="bg-blue-900 rounded-full p-6 flex flex-row gap-2 border-blue-950 border-3 border-solid"
          >
            <EyeClosedIcon width={24} height={24} />
            <p>Break</p>
          </button>
          <button
            onClick={stopTimers}
            className="bg-orange-900 rounded-full p-6 flex flex-row gap-2 border-orange-950 border-3 border-solid"
          >
            <SquareStopIcon width={24} height={24} />
            <p>Stop</p>
          </button>
        </div>
        <div className="flex flex-row gap-3 bg-amber-900 rounded-sm p-4">
          <div className="flex flex-col gap-1">
            <div className="flex flex-row gap-1 items-center">
              <FootprintsIcon width={24} height={24} />
              <p className="text-2xl font-bold">24</p>
            </div>
            <p>break streaks</p>
          </div>
          <div className="flex flex-col gap-1">
            <div className="flex flex-row gap-1 items-center">
              <ClockCheckIcon width={24} height={24} />
              <p className="text-2xl font-bold">7.5</p>
            </div>
            <p>rested hours</p>
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
    </div>
  );
}

export default App;
