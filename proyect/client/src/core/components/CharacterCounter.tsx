import React from "react";

interface CharacterCounterProps {
  text: string | undefined;
  maxLength: number;
  className?: string;
}

export const CharacterCounter: React.FC<CharacterCounterProps> = ({
  text,
  maxLength,
  className = "",
}) => {
  const currentLength = text?.length ?? 0;
  const isLimitExceeded = currentLength >= maxLength;

  return (
    <span
      className={`text-sm ${
        isLimitExceeded ? "text-error" : "text-black"
      } ${className}`}
    >
      {currentLength}/{maxLength} caracteres
    </span>
  );
};
