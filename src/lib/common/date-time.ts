export type CalendarDay = {
  date: Date;
  label: string;
  ymd: string;
  inMonth: boolean;
};

export const weekdayLabels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

const monthYearFormatter = new Intl.DateTimeFormat('en', {
  month: 'long',
  year: 'numeric'
});

const shortTimeOptions: Intl.DateTimeFormatOptions = {
  hour: '2-digit',
  minute: '2-digit'
};

export function formatDateTime(value: string | null | undefined, fallback = 'n/a'): string {
  return value ? new Date(value).toLocaleString() : fallback;
}

export function formatShortTime(value: string | null | undefined, fallback = '-'): string {
  return value ? new Date(value).toLocaleTimeString([], shortTimeOptions) : fallback;
}

export function formatMonthYear(date: Date): string {
  return monthYearFormatter.format(date);
}

export function startOfMonth(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), 1);
}

export function addDays(date: Date, days: number): Date {
  const next = new Date(date);
  next.setDate(next.getDate() + days);
  return next;
}

export function addMonths(date: Date, months: number): Date {
  return new Date(date.getFullYear(), date.getMonth() + months, 1);
}

export function pad2(value: number): string {
  return String(value).padStart(2, '0');
}

export function formatDateText(date: Date): string {
  return `${pad2(date.getDate())}.${pad2(date.getMonth() + 1)}.${date.getFullYear()}`;
}

export function formatTimeText(date: Date): string {
  return `${pad2(date.getHours())}:${pad2(date.getMinutes())}`;
}

export function formatYmd(date: Date): string {
  return `${date.getFullYear()}-${pad2(date.getMonth() + 1)}-${pad2(date.getDate())}`;
}

export function parseDateText(text: string): string {
  const match = /^(\d{2})\.(\d{2})\.(\d{4})$/.exec(text.trim());
  if (!match) {
    return '';
  }

  const [, day, month, year] = match;
  const date = new Date(Number(year), Number(month) - 1, Number(day));
  if (
    date.getFullYear() !== Number(year) ||
    date.getMonth() !== Number(month) - 1 ||
    date.getDate() !== Number(day)
  ) {
    return '';
  }

  return formatYmd(date);
}

export function parseTimeText(text: string): string {
  const match = /^([01]\d|2[0-3]):([0-5]\d)$/.exec(text.trim());
  return match ? text.trim() : '';
}

export function buildCalendarDays(cursor: Date): CalendarDay[] {
  const start = startOfMonth(cursor);
  const offset = (start.getDay() + 6) % 7;
  const firstCell = addDays(start, -offset);

  return Array.from({ length: 42 }, (_, index) => {
    const date = addDays(firstCell, index);
    return {
      date,
      label: String(date.getDate()),
      ymd: formatYmd(date),
      inMonth: date.getMonth() === cursor.getMonth()
    };
  });
}

export function parseDateTimeInputValue(
  value: string
): { dateText: string; timeText: string; monthCursor: Date } | null {
  if (!value) {
    return null;
  }

  const directMatch = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})/.exec(value);
  if (directMatch) {
    const [, year, month, day, hour, minute] = directMatch;
    return {
      dateText: `${day}.${month}.${year}`,
      timeText: `${hour}:${minute}`,
      monthCursor: startOfMonth(new Date(Number(year), Number(month) - 1, 1))
    };
  }

  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) {
    return null;
  }

  return {
    dateText: formatDateText(parsed),
    timeText: formatTimeText(parsed),
    monthCursor: startOfMonth(parsed)
  };
}

export function getCurrentMonthCursor(): Date {
  return startOfMonth(new Date());
}

export function getCurrentDateTimeInputValue(): {
  dateText: string;
  timeText: string;
  monthCursor: Date;
} {
  const now = new Date();
  return {
    dateText: formatDateText(now),
    timeText: formatTimeText(now),
    monthCursor: startOfMonth(now)
  };
}
