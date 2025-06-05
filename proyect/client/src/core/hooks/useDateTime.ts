import { useEffect, useState } from "react";

export function useDateTime() {
  const [date, setDate] = useState<string>("");
  const [time, setTime] = useState<string>("");
  const [datetime, setDatetime] = useState<string>("");

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDate(e.target.value);
  };

  const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTime(e.target.value);
  };

  useEffect(() => {
    if (date && time) {
      const combined = `${date}T${time}:00`;
      setDatetime(combined);
    }
  }, [date, time]);

  return {
    date,
    time,
    datetime,
    handleDateChange,
    handleTimeChange,
    setDate,
    setTime,
  };
}
