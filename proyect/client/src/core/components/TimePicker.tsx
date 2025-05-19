import React, { useState } from "react";

interface TimePickerProps {
  value: string | null;
  onChange: (time: string) => void;
}

export const TimePickerTemporal: React.FC<TimePickerProps> = ({
  value,
  onChange,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const timeSlots = [
    "08:00",
    "09:00",
    "10:00",
    "11:00",
    "12:00",
    "13:00",
    "14:00",
    "15:00",
    "16:00",
    "17:00",
    "18:00",
    "19:00",
  ];

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="px-4 py-2 border border-[#979797] rounded-md bg-[#f5f5f5] hover:bg-[#91cefa] transition-colors"
      >
        {value || "Seleccionar hora"}
      </button>

      {isOpen && (
        <div className="absolute mt-1 bg-white border border-[#979797] rounded-md shadow-lg p-3 z-10 w-full">
          <div className="grid grid-cols-3 gap-2 max-h-40 overflow-y-auto">
            {timeSlots.map((time) => (
              <button
                key={time}
                onClick={() => {
                  onChange(time);
                  setIsOpen(false);
                }}
                className={`px-2 py-1 rounded-md text-sm
                  ${
                    value === time
                      ? "bg-[#1a659e] text-white"
                      : "bg-[#f5f5f5] hover:bg-[#91cefa]"
                  }`}
              >
                {time}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
