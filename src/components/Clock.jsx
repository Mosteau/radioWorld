import { useState } from "react";

function Clock() {
  const time = new Date().toLocaleTimeString();
  const [currentTime, setCurrentTime] = useState(time);

  const updateTime = () => {
    const time2 = new Date().toLocaleTimeString();
    setCurrentTime(time2);
  };
  setInterval(updateTime, 1000);
  return (
    <div className="clock">
      <h1 className="clockh1">{currentTime}</h1>
    </div>
  );
}

export default Clock;
