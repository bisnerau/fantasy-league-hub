// Dates and times on Irish clocks, spelled the same on the server and in every
// browser. Each engine ships its own locale data (Node and Chrome write
// "27 Sept, 18:00", Safari "27 Sep at 18:00"), and a server/client mismatch
// breaks hydration, so only numeric fields come from Intl and the words and
// punctuation are ours.

const weekdays = [
  'Sunday',
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
];
const months = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
];

const irishClock = new Intl.DateTimeFormat('en-US', {
  timeZone: 'Europe/Dublin',
  year: 'numeric',
  month: 'numeric',
  day: 'numeric',
  hour: '2-digit',
  minute: '2-digit',
  hourCycle: 'h23',
});

export interface IrishTimeOptions {
  /** Lead with the weekday: "Sunday" or "Sun". */
  weekday?: 'long' | 'short';
  /** Include the day and month (default true). */
  date?: boolean;
  year?: boolean;
  time?: boolean;
}

/**
 * Formats an instant on Irish clocks, e.g. "Sunday 27 Sep, 18:00",
 * "Sun 18:00" or "27 Sep 2026". Throws a RangeError for an invalid date,
 * like Intl.DateTimeFormat.
 */
export function formatIrishTime(
  value: string | number | Date,
  { weekday, date = true, year = false, time = false }: IrishTimeOptions = {},
) {
  const field: Record<string, number> = {};
  for (const part of irishClock.formatToParts(new Date(value))) {
    if (part.type !== 'literal') field[part.type] = Number(part.value);
  }
  const day =
    weekdays[
      new Date(Date.UTC(field.year, field.month - 1, field.day)).getUTCDay()
    ];
  const words = [
    weekday === 'long' ? day : weekday === 'short' ? day.slice(0, 3) : null,
    date ? `${field.day} ${months[field.month - 1]}` : null,
    date && year ? String(field.year) : null,
  ].filter(Boolean);
  if (!time) return words.join(' ');
  // Some engines write midnight as hour 24 even with h23.
  const clock = `${String(field.hour % 24).padStart(2, '0')}:${String(
    field.minute,
  ).padStart(2, '0')}`;
  if (!words.length) return clock;
  return `${words.join(' ')}${date ? ',' : ''} ${clock}`;
}
