function generateRandomDate(start: Date, end: Date): Date {
  return new Date(
    start.getTime() + Math.random() * (end.getTime() - start.getTime())
  );
}

export function generateRandomEvents(
  numEvents: number
): { start: Date; end: Date }[] {
  const events: {
    start: Date;
    end: Date;
    canEdit: boolean;
    data: { id: string };
    title: string;
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
    });
  }

  return events;
}

export function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1) + min);
}
