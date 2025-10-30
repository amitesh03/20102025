// Date-fns TypeScript Examples - Advanced Date Manipulation Patterns
// This file demonstrates comprehensive TypeScript usage with date-fns library

import {
  // Basic date manipulation
  add,
  sub,
  addDays,
  subDays,
  addWeeks,
  subWeeks,
  addMonths,
  subMonths,
  addYears,
  subYears,
  addHours,
  subHours,
  addMinutes,
  subMinutes,
  addSeconds,
  subSeconds,
  
  // Date comparison
  compareAsc,
  compareDesc,
  isEqual,
  isAfter,
  isBefore,
  isWithinInterval,
  isSameDay,
  isSameHour,
  isSameWeek,
  isSameMonth,
  isSameYear,
  
  // Date validation and parsing
  isValid,
  parse,
  parseISO,
  parseJSON,
  toDate,
  
  // Date formatting
  format,
  formatDistance,
  formatDistanceToNow,
  formatDistanceStrict,
  formatRelative,
  formatISO,
  formatISO9075,
  formatRFC3339,
  formatRFC7231,
  
  // Date components
  getDate,
  getDay,
  getDayOfYear,
  getDaysInMonth,
  getDaysInYear,
  getDecade,
  getHours,
  getISODay,
  getISOWeek,
  getISOWeeksInYear,
  getISOYear,
  getMilliseconds,
  getMinutes,
  getMonth,
  getQuarter,
  getSeconds,
  getTime,
  getUnixTime,
  getWeek,
  getWeekOfMonth,
  getWeeksInMonth,
  getWeekYear,
  getYear,
  
  // Date setting
  setDate,
  setDay,
  setDayOfYear,
  setHours,
  setISODay,
  setISOWeek,
  setISOYear,
  setMilliseconds,
  setMinutes,
  setMonth,
  setQuarter,
  setSeconds,
  setYear,
  
  // Date ranges and intervals
  eachDayOfInterval,
  eachHourOfInterval,
  eachMinuteOfInterval,
  eachMonthOfInterval,
  eachWeekendOfInterval,
  eachWeekendOfMonth,
  eachWeekendOfYear,
  eachWeekOfInterval,
  eachYearOfInterval,
  getOverlappingDaysInIntervals,
  
  // Business days and holidays
  isWeekend,
  isMonday,
  isTuesday,
  isWednesday,
  isThursday,
  isFriday,
  isSaturday,
  isSunday,
  
  // Time zones
  utcToZonedTime,
  zonedTimeToUtc,
  formatInTimeZone,
  
  // Internationalization
  locale,
  enUS,
  enGB,
  es,
  fr,
  de,
  ja,
  zhCN,
  
  // Utilities
  closestTo,
  closestIndexTo,
  max,
  min,
  clamp,
  differenceInDays,
  differenceInHours,
  differenceInMinutes,
  differenceInMonths,
  differenceInQuarters,
  differenceInSeconds,
  differenceInWeeks,
  differenceInYears,
  intervalToDuration,
  secondsToMilliseconds,
  millisecondsToSeconds,
  minutesToSeconds,
  hoursToMinutes,
  daysToWeeks,
  weeksToDays,
  monthsToQuarters,
  monthsToYears,
  quartersToMonths,
  quartersToYears,
  yearsToQuarters,
  yearsToMonths,
} from 'date-fns';

// ===== BASIC TYPES =====

// Enhanced date range interface
interface DateRange {
  start: Date;
  end: Date;
  label?: string;
  type?: 'custom' | 'today' | 'week' | 'month' | 'quarter' | 'year';
}

// Enhanced event interface
interface CalendarEvent {
  id: string;
  title: string;
  description?: string;
  start: Date;
  end: Date;
  allDay: boolean;
  timezone: string;
  recurring?: RecurringRule;
  attendees?: Attendee[];
  location?: string;
  category?: string;
  priority?: 'low' | 'medium' | 'high';
  status?: 'confirmed' | 'tentative' | 'cancelled';
}

interface RecurringRule {
  frequency: 'daily' | 'weekly' | 'monthly' | 'yearly';
  interval: number;
  count?: number;
  until?: Date;
  daysOfWeek?: number[];
  dayOfMonth?: number;
  weekOfMonth?: number;
  monthOfYear?: number;
}

interface Attendee {
  id: string;
  name: string;
  email: string;
  status: 'accepted' | 'declined' | 'tentative';
  isOrganizer: boolean;
}

// Enhanced holiday interface
interface Holiday {
  id: string;
  name: string;
  date: Date;
  type: 'national' | 'religious' | 'cultural';
  recurring: boolean;
  timezone?: string;
  description?: string;
}

// Enhanced business hours interface
interface BusinessHours {
  id: string;
  name: string;
  timezone: string;
  hours: DaySchedule[];
  holidays: Holiday[];
  exceptions: Exception[];
}

interface DaySchedule {
  dayOfWeek: number; // 0-6 (Sunday-Saturday)
  open: string; // HH:mm format
  close: string; // HH:mm format
  isOpen: boolean;
  breaks?: Break[];
}

interface Break {
  start: string; // HH:mm format
  end: string; // HH:mm format
  description?: string;
}

interface Exception {
  date: Date;
  isOpen: boolean;
  openTime?: string;
  closeTime?: string;
  reason?: string;
}

// Enhanced date statistics interface
interface DateStatistics {
  totalDays: number;
  weekdays: number;
  weekends: number;
  businessDays: number;
  holidays: number;
  workingHours: number;
  averageHoursPerDay: number;
  peakDay: string;
  leastProductiveDay: string;
}

// ===== BASIC DATE MANIPULATION =====

// Advanced date manipulation with type safety
const manipulateDates = (baseDate: Date): {
  future: {
    oneDay: Date;
    oneWeek: Date;
    oneMonth: Date;
    oneYear: Date;
    custom: Date;
  };
  past: {
    oneDay: Date;
    oneWeek: Date;
    oneMonth: Date;
    oneYear: Date;
    custom: Date;
  };
  components: {
    year: number;
    month: number;
    day: number;
    hour: number;
    minute: number;
    second: number;
    millisecond: number;
    dayOfWeek: number;
    dayOfYear: number;
    weekOfYear: number;
    quarter: number;
  };
} => {
  // Future dates
  const future = {
    oneDay: addDays(baseDate, 1),
    oneWeek: addWeeks(baseDate, 1),
    oneMonth: addMonths(baseDate, 1),
    oneYear: addYears(baseDate, 1),
    custom: add(baseDate, { years: 2, months: 3, days: 10, hours: 5 }),
  };

  // Past dates
  const past = {
    oneDay: subDays(baseDate, 1),
    oneWeek: subWeeks(baseDate, 1),
    oneMonth: subMonths(baseDate, 1),
    oneYear: subYears(baseDate, 1),
    custom: sub(baseDate, { years: 1, months: 6, days: 15, hours: 3 }),
  };

  // Date components
  const components = {
    year: getYear(baseDate),
    month: getMonth(baseDate),
    day: getDate(baseDate),
    hour: getHours(baseDate),
    minute: getMinutes(baseDate),
    second: getSeconds(baseDate),
    millisecond: getMilliseconds(baseDate),
    dayOfWeek: getDay(baseDate),
    dayOfYear: getDayOfYear(baseDate),
    weekOfYear: getISOWeek(baseDate),
    quarter: getQuarter(baseDate),
  };

  return { future, past, components };
};

// ===== DATE COMPARISON =====

// Advanced date comparison utilities
const compareDates = (dates: Date[]): {
  sorted: {
    ascending: Date[];
    descending: Date[];
  };
  extremes: {
    earliest: Date | undefined;
    latest: Date | undefined;
  };
  comparisons: {
    areAllSameDay: boolean;
    areAllSameMonth: boolean;
    areAllSameYear: boolean;
    isWithinRange: boolean;
  };
  differences: {
    daysBetween: number;
    hoursBetween: number;
    minutesBetween: number;
    monthsBetween: number;
    yearsBetween: number;
  };
} => {
  if (dates.length === 0) {
    return {
      sorted: { ascending: [], descending: [] },
      extremes: { earliest: undefined, latest: undefined },
      comparisons: { areAllSameDay: false, areAllSameMonth: false, areAllSameYear: false, isWithinRange: false },
      differences: { daysBetween: 0, hoursBetween: 0, minutesBetween: 0, monthsBetween: 0, yearsBetween: 0 },
    };
  }

  // Sort dates
  const sorted = {
    ascending: [...dates].sort(compareAsc),
    descending: [...dates].sort(compareDesc),
  };

  // Find extremes
  const extremes = {
    earliest: min(dates),
    latest: max(dates),
  };

  // Comparisons
  const firstDate = dates[0];
  const comparisons = {
    areAllSameDay: dates.every(date => isSameDay(date, firstDate)),
    areAllSameMonth: dates.every(date => isSameMonth(date, firstDate)),
    areAllSameYear: dates.every(date => isSameYear(date, firstDate)),
    isWithinRange: extremes.earliest && extremes.latest && 
                  dates.every(date => isWithinInterval(date, { start: extremes.earliest, end: extremes.latest })),
  };

  // Calculate differences
  const differences = {
    daysBetween: extremes.earliest && extremes.latest ? differenceInDays(extremes.latest, extremes.earliest) : 0,
    hoursBetween: extremes.earliest && extremes.latest ? differenceInHours(extremes.latest, extremes.earliest) : 0,
    minutesBetween: extremes.earliest && extremes.latest ? differenceInMinutes(extremes.latest, extremes.earliest) : 0,
    monthsBetween: extremes.earliest && extremes.latest ? differenceInMonths(extremes.latest, extremes.earliest) : 0,
    yearsBetween: extremes.earliest && extremes.latest ? differenceInYears(extremes.latest, extremes.earliest) : 0,
  };

  return { sorted, extremes, comparisons, differences };
};

// ===== DATE FORMATTING =====

// Advanced date formatting with internationalization
const formatDates = (date: Date, locales: string[] = ['en-US']): {
  standard: {
    iso: string;
    iso9075: string;
    rfc3339: string;
    rfc7231: string;
  };
  localized: Record<string, string>;
  relative: {
    distanceToNow: string;
    distanceStrict: string;
    relative: string;
  };
  custom: {
    short: string;
    medium: string;
    long: string;
    full: string;
    withTime: string;
    withTimezone: string;
  };
} => {
  // Standard formats
  const standard = {
    iso: formatISO(date),
    iso9075: formatISO9075(date),
    rfc3339: formatRFC3339(date),
    rfc7231: formatRFC7231(date),
  };

  // Localized formats
  const localized: Record<string, string> = {};
  locales.forEach(locale => {
    localized[locale] = date.toLocaleString(locale, {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      timeZoneName: 'short',
    });
  });

  // Relative formats
  const relative = {
    distanceToNow: formatDistanceToNow(date, { addSuffix: true }),
    distanceStrict: formatDistanceStrict(date, new Date(), { addSuffix: true }),
    relative: formatRelative(date, new Date()),
  };

  // Custom formats
  const custom = {
    short: format(date, 'MMM d, yyyy'),
    medium: format(date, 'MMMM d, yyyy'),
    long: format(date, 'EEEE, MMMM d, yyyy'),
    full: format(date, 'EEEE, MMMM d, yyyy h:mm a'),
    withTime: format(date, 'yyyy-MM-dd HH:mm:ss'),
    withTimezone: format(date, 'yyyy-MM-dd HH:mm:ss zzz'),
  };

  return { standard, localized, relative, custom };
};

// ===== DATE RANGES AND INTERVALS =====

// Advanced date range operations
const processDateRanges = (ranges: DateRange[]): {
  merged: DateRange[];
  overlapped: DateRange[];
  gaps: DateRange[];
  totalDuration: {
    days: number;
    hours: number;
    minutes: number;
  };
  statistics: {
    totalRanges: number;
    averageDuration: number;
    longestRange: DateRange | undefined;
    shortestRange: DateRange | undefined;
  };
} => {
  if (ranges.length === 0) {
    return {
      merged: [],
      overlapped: [],
      gaps: [],
      totalDuration: { days: 0, hours: 0, minutes: 0 },
      statistics: { totalRanges: 0, averageDuration: 0, longestRange: undefined, shortestRange: undefined },
    };
  }

  // Sort ranges by start date
  const sortedRanges = [...ranges].sort((a, b) => compareAsc(a.start, b.start));

  // Merge overlapping ranges
  const merged: DateRange[] = [];
  let currentRange = { ...sortedRanges[0] };

  for (let i = 1; i < sortedRanges.length; i++) {
    const nextRange = sortedRanges[i];
    
    if (isBefore(nextRange.start, currentRange.end) || isSameDay(nextRange.start, currentRange.end)) {
      // Ranges overlap, merge them
      currentRange.end = max([currentRange.end, nextRange.end]);
    } else {
      // No overlap, add current range and start new one
      merged.push(currentRange);
      currentRange = { ...nextRange };
    }
  }
  merged.push(currentRange);

  // Find overlapped ranges
  const overlapped: DateRange[] = [];
  for (let i = 0; i < sortedRanges.length - 1; i++) {
    for (let j = i + 1; j < sortedRanges.length; j++) {
      const range1 = sortedRanges[i];
      const range2 = sortedRanges[j];
      
      if (isWithinInterval(range2.start, { start: range1.start, end: range1.end }) ||
          isWithinInterval(range1.start, { start: range2.start, end: range2.end })) {
        overlapped.push({
          start: max([range1.start, range2.start]),
          end: min([range1.end, range2.end]),
          label: `Overlap: ${range1.label || 'Range'} & ${range2.label || 'Range'}`,
        });
      }
    }
  }

  // Find gaps between ranges
  const gaps: DateRange[] = [];
  for (let i = 0; i < merged.length - 1; i++) {
    const currentEnd = merged[i].end;
    const nextStart = merged[i + 1].start;
    
    if (isBefore(currentEnd, nextStart)) {
      gaps.push({
        start: addDays(currentEnd, 1),
        end: subDays(nextStart, 1),
        label: `Gap between ${merged[i].label || 'Range'} and ${merged[i + 1].label || 'Range'}`,
      });
    }
  }

  // Calculate total duration
  const totalDuration = merged.reduce(
    (acc, range) => {
      const days = differenceInDays(range.end, range.start);
      const hours = differenceInHours(range.end, range.start);
      const minutes = differenceInMinutes(range.end, range.start);
      
      return {
        days: acc.days + days,
        hours: acc.hours + hours,
        minutes: acc.minutes + minutes,
      };
    },
    { days: 0, hours: 0, minutes: 0 }
  );

  // Calculate statistics
  const durations = merged.map(range => differenceInDays(range.end, range.start));
  const statistics = {
    totalRanges: merged.length,
    averageDuration: durations.length > 0 ? durations.reduce((a, b) => a + b, 0) / durations.length : 0,
    longestRange: merged.reduce((longest, current) => 
      !longest || differenceInDays(current.end, current.start) > differenceInDays(longest.end, longest.start) 
        ? current 
        : longest, 
      undefined as DateRange | undefined
    ),
    shortestRange: merged.reduce((shortest, current) => 
      !shortest || differenceInDays(current.end, current.start) < differenceInDays(shortest.end, shortest.start) 
        ? current 
        : shortest, 
      undefined as DateRange | undefined
    ),
  };

  return { merged, overlapped, gaps, totalDuration, statistics };
};

// ===== BUSINESS DAYS AND HOLIDAYS =====

// Advanced business day calculations
const calculateBusinessDays = (
  startDate: Date,
  endDate: Date,
  holidays: Holiday[] = [],
  businessHours?: BusinessHours
): {
  totalDays: number;
  businessDays: number;
  weekends: number;
  holidays: number;
  workingDays: Date[];
  nonWorkingDays: Date[];
  statistics: DateStatistics;
  workingHours: {
    total: number;
    average: number;
    byDay: Record<string, number>;
  };
} => {
  // Get all days in the interval
  const allDays = eachDayOfInterval({ start: startDate, end: endDate });
  
  // Filter weekends
  const weekends = allDays.filter(day => isWeekend(day));
  const weekdays = allDays.filter(day => !isWeekend(day));
  
  // Filter holidays
  const holidayDates = holidays.map(holiday => holiday.date);
  const holidayDays = weekdays.filter(day => 
    holidayDates.some(holidayDate => isSameDay(day, holidayDate))
  );
  
  // Calculate business days (weekdays excluding holidays)
  const businessDays = weekdays.filter(day => 
    !holidayDates.some(holidayDate => isSameDay(day, holidayDate))
  );
  
  // Calculate working hours if business hours provided
  let workingHours = { total: 0, average: 0, byDay: {} as Record<string, number> };
  
  if (businessHours) {
    const hoursByDay = businessDays.reduce((acc, day) => {
      const dayOfWeek = getDay(day);
      const daySchedule = businessHours.hours.find(schedule => schedule.dayOfWeek === dayOfWeek);
      
      if (daySchedule && daySchedule.isOpen) {
        const [openHour, openMinute] = daySchedule.open.split(':').map(Number);
        const [closeHour, closeMinute] = daySchedule.close.split(':').map(Number);
        
        const openTime = setHours(setMinutes(day, openMinute), openHour);
        const closeTime = setHours(setMinutes(day, closeMinute), closeHour);
        const dayHours = differenceInHours(closeTime, openTime);
        
        const dayName = format(day, 'EEEE');
        acc[dayName] = (acc[dayName] || 0) + dayHours;
        acc.total += dayHours;
      }
      
      return acc;
    }, { total: 0 } as { total: number; [key: string]: number });
    
    workingHours = {
      total: hoursByDay.total,
      average: businessDays.length > 0 ? hoursByDay.total / businessDays.length : 0,
      byDay: Object.fromEntries(
        Object.entries(hoursByDay).filter(([key]) => key !== 'total')
      ),
    };
  }
  
  // Calculate statistics
  const statistics: DateStatistics = {
    totalDays: allDays.length,
    weekdays: weekdays.length,
    weekends: weekends.length,
    businessDays: businessDays.length,
    holidays: holidayDays.length,
    workingHours: workingHours.total,
    averageHoursPerDay: workingHours.average,
    peakDay: Object.entries(workingHours.byDay).reduce((peak, [day, hours]) => 
      !peak || hours > workingHours.byDay[peak] ? day : peak, ''
    ),
    leastProductiveDay: Object.entries(workingHours.byDay).reduce((least, [day, hours]) => 
      !least || hours < workingHours.byDay[least] ? day : least, ''
    ),
  };
  
  return {
    totalDays: allDays.length,
    businessDays: businessDays.length,
    weekends: weekends.length,
    holidays: holidayDays.length,
    workingDays: businessDays,
    nonWorkingDays: [...weekends, ...holidayDays],
    statistics,
    workingHours,
  };
};

// ===== CALENDAR EVENTS =====

// Advanced calendar event processing
const processCalendarEvents = (events: CalendarEvent[]): {
  upcoming: CalendarEvent[];
  past: CalendarEvent[];
  today: CalendarEvent[];
  conflicts: CalendarEvent[][];
  byCategory: Record<string, CalendarEvent[]>;
  byPriority: Record<string, CalendarEvent[]>;
  byStatus: Record<string, CalendarEvent[]>;
  recurring: CalendarEvent[];
  statistics: {
    total: number;
    byCategory: Record<string, number>;
    byPriority: Record<string, number>;
    byStatus: Record<string, number>;
    averageDuration: number;
    longestEvent: CalendarEvent | undefined;
    shortestEvent: CalendarEvent | undefined;
  };
} => {
  const now = new Date();
  
  // Categorize events by time
  const upcoming = events.filter(event => isAfter(event.start, now));
  const past = events.filter(event => isBefore(event.end, now));
  const today = events.filter(event => 
    isSameDay(event.start, now) || isSameDay(event.end, now) ||
    isWithinInterval(now, { start: event.start, end: event.end })
  );
  
  // Find conflicts (overlapping events)
  const sortedEvents = [...events].sort((a, b) => compareAsc(a.start, b.start));
  const conflicts: CalendarEvent[][] = [];
  
  for (let i = 0; i < sortedEvents.length - 1; i++) {
    const currentEvent = sortedEvents[i];
    const overlappingEvents: CalendarEvent[] = [currentEvent];
    
    for (let j = i + 1; j < sortedEvents.length; j++) {
      const nextEvent = sortedEvents[j];
      
      if (isWithinInterval(nextEvent.start, { start: currentEvent.start, end: currentEvent.end }) ||
          isWithinInterval(currentEvent.start, { start: nextEvent.start, end: nextEvent.end })) {
        overlappingEvents.push(nextEvent);
      } else {
        break;
      }
    }
    
    if (overlappingEvents.length > 1) {
      conflicts.push(overlappingEvents);
    }
  }
  
  // Group events by various criteria
  const byCategory = groupBy(events, 'category');
  const byPriority = groupBy(events, 'priority');
  const byStatus = groupBy(events, 'status');
  const recurring = events.filter(event => event.recurring);
  
  // Calculate statistics
  const durations = events.map(event => differenceInHours(event.end, event.start));
  const statistics = {
    total: events.length,
    byCategory: mapValues(byCategory, (events: CalendarEvent[]) => events.length),
    byPriority: mapValues(byPriority, (events: CalendarEvent[]) => events.length),
    byStatus: mapValues(byStatus, (events: CalendarEvent[]) => events.length),
    averageDuration: durations.length > 0 ? durations.reduce((a, b) => a + b, 0) / durations.length : 0,
    longestEvent: events.reduce((longest, current) => 
      !longest || differenceInHours(current.end, current.start) > differenceInHours(longest.end, longest.start) 
        ? current 
        : longest, 
      undefined as CalendarEvent | undefined
    ),
    shortestEvent: events.reduce((shortest, current) => 
      !shortest || differenceInHours(current.end, current.start) < differenceInHours(shortest.end, shortest.start) 
        ? current 
        : shortest, 
      undefined as CalendarEvent | undefined
    ),
  };
  
  return {
    upcoming,
    past,
    today,
    conflicts,
    byCategory,
    byPriority,
    byStatus,
    recurring,
    statistics,
  };
};

// ===== TIME ZONE OPERATIONS =====

// Advanced time zone handling
const handleTimeZones = (
  date: Date,
  fromTimezone: string,
  toTimezone: string
): {
  originalDate: Date;
  convertedDate: Date;
  formatted: {
    original: string;
    converted: string;
    iso: string;
    local: string;
  };
  components: {
    original: {
      year: number;
      month: number;
      day: number;
      hour: number;
      minute: number;
    };
    converted: {
      year: number;
      month: number;
      day: number;
      hour: number;
      minute: number;
    };
  };
  offset: {
    original: string;
    converted: string;
    difference: number;
  };
} => {
  // Convert time zones
  const convertedDate = utcToZonedTime(zonedTimeToUtc(date, fromTimezone), toTimezone);
  
  // Format dates
  const formatted = {
    original: formatInTimeZone(date, fromTimezone, 'yyyy-MM-dd HH:mm:ss zzz'),
    converted: formatInTimeZone(convertedDate, toTimezone, 'yyyy-MM-dd HH:mm:ss zzz'),
    iso: formatISO(convertedDate),
    local: format(convertedDate, 'yyyy-MM-dd HH:mm:ss'),
  };
  
  // Extract components
  const components = {
    original: {
      year: getYear(date),
      month: getMonth(date),
      day: getDate(date),
      hour: getHours(date),
      minute: getMinutes(date),
    },
    converted: {
      year: getYear(convertedDate),
      month: getMonth(convertedDate),
      day: getDate(convertedDate),
      hour: getHours(convertedDate),
      minute: getMinutes(convertedDate),
    },
  };
  
  // Calculate offsets
  const originalOffset = formatInTimeZone(date, fromTimezone, 'XXX');
  const convertedOffset = formatInTimeZone(convertedDate, toTimezone, 'XXX');
  const offsetDifference = differenceInHours(convertedDate, date);
  
  return {
    originalDate: date,
    convertedDate,
    formatted,
    components,
    offset: {
      original: originalOffset,
      converted: convertedOffset,
      difference: offsetDifference,
    },
  };
};

// ===== UTILITY FUNCTIONS =====

// Helper function to group by
const groupBy = <T, K extends keyof any>(array: T[], key: (item: T) => K): Record<K, T[]> => {
  return array.reduce((groups, item) => {
    const group = key(item);
    groups[group] = groups[group] || [];
    groups[group].push(item);
    return groups;
  }, {} as Record<K, T[]>);
};

// Helper function to map values
const mapValues = <T, U>(obj: Record<string, T>, fn: (value: T) => U): Record<string, U> => {
  return Object.fromEntries(
    Object.entries(obj).map(([key, value]) => [key, fn(value)])
  );
};

// Date validation utility
const validateDate = (date: any): date is Date => {
  return date instanceof Date && isValid(date);
};

// Safe date parsing
const safeParse = (dateString: string, formatString?: string): Date | null => {
  try {
    if (formatString) {
      return parse(dateString, formatString, new Date());
    }
    return parseISO(dateString);
  } catch {
    return null;
  }
};

// Date range validation
const isValidDateRange = (start: Date, end: Date): boolean => {
  return isValid(start) && isValid(end) && isBefore(start, end);
};

// ===== EXERCISES =====

/*
EXERCISE 1: Create a scheduling system that:
- Handles recurring events with complex rules
- Detects and resolves scheduling conflicts
- Supports multiple time zones
- Provides availability checking
- Is fully typed

EXERCISE 2: Build a project timeline calculator that:
- Calculates project durations excluding weekends
- Handles holidays and custom non-working days
- Provides critical path analysis
- Supports milestone tracking
- Is fully typed

EXERCISE 3: Create a time tracking system that:
- Tracks work hours across different projects
- Handles overtime calculations
- Supports multiple time zones
- Generates detailed reports
- Is fully typed

EXERCISE 4: Build a reminder system that:
- Sends reminders at appropriate intervals
- Handles recurring reminders
- Supports different reminder types
- Integrates with calendar events
- Is fully typed

EXERCISE 5: Create a date utility library that:
- Provides common date operations
- Supports internationalization
- Handles edge cases and validation
- Includes performance optimizations
- Is fully typed
*/

// Export functions and utilities
export {
  // Basic date manipulation
  manipulateDates,
  
  // Date comparison
  compareDates,
  
  // Date formatting
  formatDates,
  
  // Date ranges and intervals
  processDateRanges,
  
  // Business days and holidays
  calculateBusinessDays,
  
  // Calendar events
  processCalendarEvents,
  
  // Time zone operations
  handleTimeZones,
  
  // Utility functions
  validateDate,
  safeParse,
  isValidDateRange,
};

// Export types
export type {
  DateRange,
  CalendarEvent,
  RecurringRule,
  Attendee,
  Holiday,
  BusinessHours,
  DaySchedule,
  Break,
  Exception,
  DateStatistics,
};