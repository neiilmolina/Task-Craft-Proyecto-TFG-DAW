import React, { useState } from "react";

interface DatePickerProps {
  value: string; // Formato YYYY-MM-DD
  onChange: (date: string) => void;
}

export const DatePicker: React.FC<DatePickerProps> = ({ value, onChange }) => {
  return (
    <div className="relative">
      <input
        type="date"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="
          px-4 py-2 
          w-full
          border border-[#979797] 
          rounded-md 
          bg-[#f5f5f5]
          focus:outline-none
          focus:ring-2 focus:ring-[#91cefa]
          focus:border-transparent
          text-[#1a659e]
          appearance-none
        "
      />
    </div>
  );
};
