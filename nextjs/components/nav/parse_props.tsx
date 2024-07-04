import React from "react";

export const parseProps = ({
  now,
  time: time,
  setTime: setTime,
}: {
  now?: Date;
  time?: Date;
  setTime?: React.Dispatch<React.SetStateAction<Date>>;
}) => {
  return {
    now: now ?? new Date(),
    time: time ?? new Date(),
    setTime: setTime,
  };
};
