import { CalendarCheck2Icon, ClockCheckIcon, EyeClosedIcon, FootprintsIcon, PauseIcon, PlayIcon, SquareStopIcon } from "lucide-react";
import { useEffect, useState } from "react";

function App() {
  let lsBreakStreaks = localStorage.getItem("breakStreaks")
  let lsDayStreaks = localStorage.getItem("dayStreaks")

  if (!lsBreakStreaks) {
    localStorage.setItem("breakStreaks", "0")
    lsBreakStreaks = "0"
  }
  if (!lsDayStreaks) {
    localStorage.setItem("dayStreaks", "0")
    lsDayStreaks = "0"
  }

  const [breakStreaks, setBreakStreaks] = useState(Number(lsBreakStreaks))
  const [dayStreaks, setDayStreaks] = useState(Number(lsDayStreaks))
  const [started, setStarted] = useState(false)

  const [timeStart, setTimeStart] = useState<number>();
  const [timeRemaining, setTimeRemaining] = useState(0)

  function startTimer() {
    setTimeStart(Date.now())
    setStarted(true)
  }

  useEffect(() => {
    setInterval(() => {
      setTimeReaminig(Date.now() - timeStart)

    }, 100)
  }, [timeStart])
  return (
    <div className="w-full h-full">
      <div className="flex flex-col gap-2 items-center justify-center h-full w-full">
        <div className="bg-amber-800 w-1/2 p-8 rounded-sm text-center font-bold text-5xl">
          19:59
        </div>
        <div className="bg-amber-900 items-center justify-center flex flex-col text-center p-2 rounded-full relative -top-4">
          <p>until your next eye break</p>
        </div>
        <div className="flex flex-row gap-3">
          <button className="bg-green-950 rounded-full p-6 flex flex-row gap-2 border-green-900 border-3 border-solid hover:bg-green-900">
            <PlayIcon width={24} height={24} />
            <p>Start</p>
          </button>
          <button className="bg-green-950 rounded-full p-6 flex flex-row gap-2 border-green-900 border-3 border-solid hover:bg-green-900">
            <PauseIcon width={24} height={24} />
            <p>Pause</p>
          </button>
          <button className="bg-blue-900 rounded-full p-6 flex flex-row gap-2 border-blue-950 border-3 border-solid">
            <EyeClosedIcon width={24} height={24} />
            <p>Break</p>
          </button>
          <button className="bg-orange-900 rounded-full p-6 flex flex-row gap-2 border-orange-950 border-3 border-solid">
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
