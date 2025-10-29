import React, { useState } from 'react';
import { 
  format, 
  parseISO, 
  isValid, 
  addDays, 
  subDays, 
  addMonths, 
  subMonths, 
  addYears, 
  subYears,
  startOfDay, 
  endOfDay, 
  startOfWeek, 
  endOfWeek, 
  startOfMonth, 
  endOfMonth,
  differenceInDays, 
  differenceInWeeks, 
  differenceInMonths, 
  differenceInYears,
  isAfter, 
  isBefore, 
  isEqual,
  isToday, 
  isYesterday, 
  isTomorrow,
  isWeekend,
  formatDistanceToNow,
  formatRelative,
  eachDayOfInterval,
  eachWeekOfInterval,
  eachMonthOfInterval,
  getDay,
  getMonth,
  getYear,
  getDate,
  getHours,
  getMinutes,
  getSeconds,
  set,
  setDay,
  setMonth,
  setYear,
  setDate,
  setHours,
  setMinutes,
  setSeconds,
  min,
  max,
  closestTo,
  isDate,
  isFuture,
  isPast,
  isLeapYear,
  getDaysInMonth,
  getWeeksInMonth,
  getISOWeek,
  getISOWeeksInYear,
  getQuarter,
  getDayOfYear,
  getWeekOfMonth,
  getWeekOfYear,
  getUnixTime,
  fromUnixTime,
  parse,
  toDate,
  intervalToDuration,
  durationToMilliseconds,
  millisecondsToDuration,
  milliseconds,
  secondsToMilliseconds,
  minutesToMilliseconds,
  hoursToMilliseconds,
  daysToMilliseconds,
  weeksToMilliseconds,
  monthsToMilliseconds,
  yearsToMilliseconds,
  millisecondsToSeconds,
  millisecondsToMinutes,
  millisecondsToHours,
  millisecondsToDays,
  millisecondsToWeeks,
  millisecondsToMonths,
  millisecondsToYears,
  secondsToMinutes,
  secondsToHours,
  secondsToDays,
  secondsToWeeks,
  secondsToMonths,
  secondsToYears,
  minutesToHours,
  minutesToDays,
  minutesToWeeks,
  minutesToMonths,
  minutesToYears,
  hoursToDays,
  hoursToWeeks,
  hoursToMonths,
  hoursToYears,
  daysToWeeks,
  daysToMonths,
  daysToYears,
  weeksToMonths,
  weeksToYears,
  monthsToYears,
  roundToNearestMinutes,
  roundToNearestHours,
  roundToNearestDays,
  roundToNearestWeeks,
  roundToNearestMonths,
  roundToNearestYears,
  ceilToNearestMinutes,
  ceilToNearestHours,
  ceilToNearestDays,
  ceilToNearestWeeks,
  ceilToNearestMonths,
  ceilToNearestYears,
  floorToNearestMinutes,
  floorToNearestHours,
  floorToNearestDays,
  floorToNearestWeeks,
  floorToNearestMonths,
  floorToNearestYears,
  add,
  sub,
  addMilliseconds,
  subMilliseconds,
  addSeconds,
  subSeconds,
  addMinutes,
  subMinutes,
  addHours,
  subHours,
  addWeeks,
  subWeeks,
  addQuarters,
  subQuarters,
  compareAsc,
  compareDesc,
  isEqual as isEqualFn,
  isWithinInterval,
  isSameDay,
  isSameHour,
  isSameMinute,
  isSameMonth,
  isSameQuarter,
  isSameSecond,
  isSameWeek,
  isSameYear,
  isAfter as isAfterFn,
  isBefore as isBeforeFn,
  isFriday,
  isMonday,
  isSaturday,
  isSunday,
  isThursday,
  isTuesday,
  isWednesday,
  isThisHour,
  isThisISOWeek,
  isThisMinute,
  isThisMonth,
  isThisQuarter,
  isThisSecond,
  isThisWeek,
  isThisYear,
  isToday as isTodayFn,
  isTomorrow as isTomorrowFn,
  isYesterday as isYesterdayFn,
  isWeekend as isWeekendFn,
  lastDayOfISOWeek,
  lastDayOfMonth,
  lastDayOfQuarter,
  lastDayOfWeek,
  lastDayOfYear,
  lightFormat,
  longFormatters,
  match,
  parseJSON,
  setQuarter,
  startOfDecade,
  startOfHour,
  startOfISOWeek,
  startOfISOWeekYear,
  startOfMinute,
  startOfQuarter,
  startOfSecond,
  startOfToday,
  startOfTomorrow,
  startOfYesterday,
  startOfYear,
  subBusinessDays,
  subQuarters,
  subWeeks,
  subYears as subYearsFn,
  toDate as toDateFn,
  transform,
  utcToZonedTime,
  zonedTimeToUtc
} from 'date-fns';

const DateFnsExamples = () => {
  const [selectedExample, setSelectedExample] = useState('formatting');
  const [currentDate, setCurrentDate] = useState(new Date());
  const [customDate, setCustomDate] = useState(new Date());
  const [dateInput, setDateInput] = useState('');
  const [result, setResult] = useState('');

  const handleDateInputChange = (e) => {
    setDateInput(e.target.value);
    try {
      const parsedDate = parseISO(e.target.value);
      if (isValid(parsedDate)) {
        setCustomDate(parsedDate);
      }
    } catch (error) {
      // Invalid date format
    }
  };

  const renderFormattingExamples = () => (
    <div className="example-section">
      <h3>Date Formatting</h3>
      <div className="code-example">
        <pre>{`// Basic formatting
format(new Date(), 'yyyy-MM-dd') // "${format(new Date(), 'yyyy-MM-dd')}"
format(new Date(), 'MMMM do, yyyy') // "${format(new Date(), 'MMMM do, yyyy')}"
format(new Date(), 'h:mm:ss a') // "${format(new Date(), 'h:mm:ss a')}"`}</pre>
      </div>
      <div className="interactive-example">
        <h4>Try it yourself:</h4>
        <input 
          type="date" 
          value={dateInput} 
          onChange={handleDateInputChange}
          placeholder="Select a date"
        />
        <div className="result">
          <p>ISO Format: {format(customDate, 'yyyy-MM-dd')}</p>
          <p>Long Format: {format(customDate, 'PPPP')}</p>
          <p>Time Only: {format(customDate, 'p')}</p>
        </div>
      </div>
    </div>
  );

  const renderManipulationExamples = () => (
    <div className="example-section">
      <h3>Date Manipulation</h3>
      <div className="code-example">
        <pre>{`// Adding and subtracting time
addDays(new Date(), 7) // "${format(addDays(new Date(), 7), 'yyyy-MM-dd')}"
subMonths(new Date(), 3) // "${format(subMonths(new Date(), 3), 'yyyy-MM-dd')}"
addYears(new Date(), 1) // "${format(addYears(new Date(), 1), 'yyyy-MM-dd')}"`}</pre>
      </div>
      <div className="interactive-example">
        <h4>Try it yourself:</h4>
        <div className="button-group">
          <button onClick={() => setCurrentDate(addDays(currentDate, 1))}>+1 Day</button>
          <button onClick={() => setCurrentDate(subDays(currentDate, 1))}>-1 Day</button>
          <button onClick={() => setCurrentDate(addMonths(currentDate, 1))}>+1 Month</button>
          <button onClick={() => setCurrentDate(subMonths(currentDate, 1))}>-1 Month</button>
          <button onClick={() => setCurrentDate(addYears(currentDate, 1))}>+1 Year</button>
          <button onClick={() => setCurrentDate(subYears(currentDate, 1))}>-1 Year</button>
        </div>
        <div className="result">
          <p>Current Date: {format(currentDate, 'PPPP')}</p>
        </div>
      </div>
    </div>
  );

  const renderComparisonExamples = () => (
    <div className="example-section">
      <h3>Date Comparison</h3>
      <div className="code-example">
        <pre>{`// Comparing dates
isAfter(new Date(), subDays(new Date(), 1)) // ${isAfter(new Date(), subDays(new Date(), 1))}
isBefore(new Date(), addDays(new Date(), 1)) // ${isBefore(new Date(), addDays(new Date(), 1))}
isEqual(new Date(), new Date()) // ${isEqual(new Date(), new Date())}`}</pre>
      </div>
      <div className="interactive-example">
        <h4>Try it yourself:</h4>
        <div className="button-group">
          <button onClick={() => setResult(isToday(customDate) ? 'Today' : 'Not Today')}>
            Is Today?
          </button>
          <button onClick={() => setResult(isWeekend(customDate) ? 'Weekend' : 'Weekday')}>
            Is Weekend?
          </button>
          <button onClick={() => setResult(isYesterday(customDate) ? 'Yesterday' : 'Not Yesterday')}>
            Is Yesterday?
          </button>
          <button onClick={() => setResult(isTomorrow(customDate) ? 'Tomorrow' : 'Not Tomorrow')}>
            Is Tomorrow?
          </button>
        </div>
        <div className="result">
          <p>Result: {result}</p>
        </div>
      </div>
    </div>
  );

  const renderDifferenceExamples = () => (
    <div className="example-section">
      <h3>Date Difference</h3>
      <div className="code-example">
        <pre>{`// Calculating differences
differenceInDays(addDays(new Date(), 7), new Date()) // ${differenceInDays(addDays(new Date(), 7), new Date())}
differenceInMonths(addMonths(new Date(), 3), new Date()) // ${differenceInMonths(addMonths(new Date(), 3), new Date())}
differenceInYears(addYears(new Date(), 1), new Date()) // ${differenceInYears(addYears(new Date(), 1), new Date())}`}</pre>
      </div>
      <div className="interactive-example">
        <h4>Try it yourself:</h4>
        <div className="button-group">
          <button onClick={() => setResult(`${differenceInDays(customDate, new Date())} days`)}>
            Days from Today
          </button>
          <button onClick={() => setResult(`${differenceInWeeks(customDate, new Date())} weeks`)}>
            Weeks from Today
          </button>
          <button onClick={() => setResult(`${differenceInMonths(customDate, new Date())} months`)}>
            Months from Today
          </button>
          <button onClick={() => setResult(`${differenceInYears(customDate, new Date())} years`)}>
            Years from Today
          </button>
        </div>
        <div className="result">
          <p>Result: {result}</p>
        </div>
      </div>
    </div>
  );

  const renderRangeExamples = () => (
    <div className="example-section">
      <h3>Date Ranges</h3>
      <div className="code-example">
        <pre>{`// Working with date ranges
const start = startOfWeek(new Date())
const end = endOfWeek(new Date())
eachDayOfInterval({ start, end }) // ${eachDayOfInterval({ start: startOfWeek(new Date()), end: endOfWeek(new Date()) }).map(d => format(d, 'EEE')).join(', ')}`}</pre>
      </div>
      <div className="interactive-example">
        <h4>Try it yourself:</h4>
        <div className="button-group">
          <button onClick={() => {
            const start = startOfMonth(customDate);
            const end = endOfMonth(customDate);
            setResult(`${eachDayOfInterval({ start, end }).length} days in month`);
          }}>
            Days in Month
          </button>
          <button onClick={() => {
            const start = startOfWeek(customDate);
            const end = endOfWeek(customDate);
            setResult(`${eachDayOfInterval({ start, end }).length} days in week`);
          }}>
            Days in Week
          </button>
          <button onClick={() => {
            const start = startOfYear(customDate);
            const end = endOfYear(customDate);
            setResult(`${eachMonthOfInterval({ start, end }).length} months in year`);
          }}>
            Months in Year
          </button>
        </div>
        <div className="result">
          <p>Result: {result}</p>
        </div>
      </div>
    </div>
  );

  const renderRelativeExamples = () => (
    <div className="example-section">
      <h3>Relative Time</h3>
      <div className="code-example">
        <pre>{`// Relative time formatting
formatDistanceToNow(subDays(new Date(), 5)) // "${formatDistanceToNow(subDays(new Date(), 5))}"
formatRelative(subDays(new Date(), 1)) // "${formatRelative(subDays(new Date(), 1))}"`}</pre>
      </div>
      <div className="interactive-example">
        <h4>Try it yourself:</h4>
        <div className="button-group">
          <button onClick={() => setResult(formatDistanceToNow(subDays(new Date(), 1)))}>
            1 Day Ago
          </button>
          <button onClick={() => setResult(formatDistanceToNow(subDays(new Date(), 7)))}>
            1 Week Ago
          </button>
          <button onClick={() => setResult(formatDistanceToNow(subMonths(new Date(), 1)))}>
            1 Month Ago
          </button>
          <button onClick={() => setResult(formatDistanceToNow(addDays(new Date(), 1)))}>
            1 Day From Now
          </button>
        </div>
        <div className="result">
          <p>Result: {result}</p>
        </div>
      </div>
    </div>
  );

  const renderUtilityExamples = () => (
    <div className="example-section">
      <h3>Utility Functions</h3>
      <div className="code-example">
        <pre>{`// Utility functions
getDay(new Date()) // ${getDay(new Date())} (0 = Sunday, 1 = Monday, etc.)
getMonth(new Date()) // ${getMonth(new Date())} (0 = January, 1 = February, etc.)
getYear(new Date()) // ${getYear(new Date())}
getDaysInMonth(new Date()) // ${getDaysInMonth(new Date())}
isLeapYear(new Date()) // ${isLeapYear(new Date())}`}</pre>
      </div>
      <div className="interactive-example">
        <h4>Try it yourself:</h4>
        <div className="button-group">
          <button onClick={() => setResult(`Day of week: ${getDay(customDate)}`)}>
            Day of Week
          </button>
          <button onClick={() => setResult(`Month: ${getMonth(customDate)}`)}>
            Month Number
          </button>
          <button onClick={() => setResult(`Year: ${getYear(customDate)}`)}>
            Year
          </button>
          <button onClick={() => setResult(`Days in month: ${getDaysInMonth(customDate)}`)}>
            Days in Month
          </button>
          <button onClick={() => setResult(`Is leap year: ${isLeapYear(customDate)}`)}>
            Is Leap Year
          </button>
        </div>
        <div className="result">
          <p>Result: {result}</p>
        </div>
      </div>
    </div>
  );

  return (
    <div className="library-examples">
      <h2>date-fns Examples</h2>
      <p>date-fns is a modern JavaScript date utility library that provides a comprehensive set of functions for working with dates.</p>
      
      <div className="example-navigation">
        <button 
          className={selectedExample === 'formatting' ? 'active' : ''}
          onClick={() => setSelectedExample('formatting')}
        >
          Formatting
        </button>
        <button 
          className={selectedExample === 'manipulation' ? 'active' : ''}
          onClick={() => setSelectedExample('manipulation')}
        >
          Manipulation
        </button>
        <button 
          className={selectedExample === 'comparison' ? 'active' : ''}
          onClick={() => setSelectedExample('comparison')}
        >
          Comparison
        </button>
        <button 
          className={selectedExample === 'difference' ? 'active' : ''}
          onClick={() => setSelectedExample('difference')}
        >
          Difference
        </button>
        <button 
          className={selectedExample === 'range' ? 'active' : ''}
          onClick={() => setSelectedExample('range')}
        >
          Ranges
        </button>
        <button 
          className={selectedExample === 'relative' ? 'active' : ''}
          onClick={() => setSelectedExample('relative')}
        >
          Relative Time
        </button>
        <button 
          className={selectedExample === 'utility' ? 'active' : ''}
          onClick={() => setSelectedExample('utility')}
        >
          Utilities
        </button>
      </div>

      <div className="example-content">
        {selectedExample === 'formatting' && renderFormattingExamples()}
        {selectedExample === 'manipulation' && renderManipulationExamples()}
        {selectedExample === 'comparison' && renderComparisonExamples()}
        {selectedExample === 'difference' && renderDifferenceExamples()}
        {selectedExample === 'range' && renderRangeExamples()}
        {selectedExample === 'relative' && renderRelativeExamples()}
        {selectedExample === 'utility' && renderUtilityExamples()}
      </div>

      <div className="installation">
        <h3>Installation</h3>
        <pre><code>npm install date-fns</code></pre>
      </div>

      <div className="resources">
        <h3>Resources</h3>
        <ul>
          <li><a href="https://date-fns.org/" target="_blank" rel="noopener noreferrer">Official Documentation</a></li>
          <li><a href="https://github.com/date-fns/date-fns" target="_blank" rel="noopener noreferrer">GitHub Repository</a></li>
        </ul>
      </div>
    </div>
  );
};

export default DateFnsExamples;