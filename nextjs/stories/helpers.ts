function generateRandomDate(start: Date, end: Date): Date {
  return new Date(
    start.getTime() + Math.random() * (end.getTime() - start.getTime())
  );
}

const getRandomColor = (): string => {
  const colors = [
    "#FF6633",
    "#FFB399",
    "#FF33FF",
    "#FFFF99",
    "#00B3E6",
    "#E6B333",
    "#3366E6",
    "#999966",
    "#99FF99",
    "#B34D4D",
    "#80B300",
    "#809900",
    "#E6B3B3",
    "#6680B3",
    "#66991A",
    "#FF99E6",
    "#CCFF1A",
    "#FF1A66",
    "#E6331A",
    "#33FFCC",
    "#66994D",
    "#B366CC",
    "#4D8000",
    "#B33300",
    "#CC80CC",
    "#66664D",
    "#991AFF",
    "#E666FF",
    "#4DB3FF",
    "#1AB399",
    "#E666B3",
    "#33991A",
    "#CC9999",
    "#B3B31A",
    "#00E680",
    "#4D8066",
    "#809980",
    "#E6FF80",
    "#1AFF33",
    "#999933",
    "#FF3380",
    "#CCCC00",
    "#66E64D",
    "#4D80CC",
    "#9900B3",
    "#E64D66",
    "#4DB380",
    "#FF4D4D",
    "#99E6E6",
    "#6666FF",
  ];
  return colors[Math.floor(Math.random() * colors.length)];
};

export function generateRandomEvents(
  numEvents: number
): { start: Date; end: Date }[] {
  const events: {
    start: Date;
    end: Date;
    canEdit: boolean;
    data: { id: string };
    title: string;
    color: string;
  }[] = [];

  for (let i = 0; i < numEvents; i++) {
    // Set a random start date within the next year
    const startDate = generateRandomDate(
      new Date(),
      new Date(new Date().setFullYear(new Date().getFullYear() + 1))
    );

    // Define possible durations in milliseconds (1 hour to 1 year)
    const minDuration = 60 * 60 * 1000; // 1 hour
    const maxDuration = 365 * 24 * 60 * 60 * 1000; // 1 year

    // Generate a random duration between 1 hour and 1 year
    const duration = minDuration + Math.random() * (maxDuration - minDuration);

    // Calculate end date
    const endDate = new Date(startDate.getTime() + duration);

    events.push({
      start: startDate,
      end: endDate,
      canEdit: true,
      data: { id: String(Math.random() + i) },
      title: String(i),
      color: getRandomColor(),
    });
  }

  return events;
}

export function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1) + min);
}
