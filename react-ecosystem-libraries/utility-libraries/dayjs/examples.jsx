import React, { useState } from 'react';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import advancedFormat from 'dayjs/plugin/advancedFormat';
import weekOfYear from 'dayjs/plugin/weekOfYear';
import isoWeek from 'dayjs/plugin/isoWeek';
import quarterOfYear from 'dayjs/plugin/quarterOfYear';
import duration from 'dayjs/plugin/duration';
import isBetween from 'dayjs/plugin/isBetween';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';
import weekday from 'dayjs/plugin/weekday';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import arraySupport from 'dayjs/plugin/arraySupport';
import objectSupport from 'dayjs/plugin/objectSupport';
import pluralGetSet from 'dayjs/plugin/pluralGetSet';
import calendar from 'dayjs/plugin/calendar';
import dayOfYear from 'dayjs/plugin/dayOfYear';
import weekYear from 'dayjs/plugin/weekYear';
import minMax from 'dayjs/plugin/minMax';
import localizedFormat from 'dayjs/plugin/localizedFormat';

// Extend dayjs with plugins
dayjs.extend(relativeTime);
dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(advancedFormat);
dayjs.extend(weekOfYear);
dayjs.extend(isoWeek);
dayjs.extend(quarterOfYear);
dayjs.extend(duration);
dayjs.extend(isBetween);
dayjs.extend(isSameOrBefore);
dayjs.extend(isSameOrAfter);
dayjs.extend(weekday);
dayjs.extend(customParseFormat);
dayjs.extend(arraySupport);
dayjs.extend(objectSupport);
dayjs.extend(pluralGetSet);
dayjs.extend(calendar);
dayjs.extend(dayOfYear);
dayjs.extend(weekYear);
dayjs.extend(minMax);
dayjs.extend(localizedFormat);

const DayjsExamples = () => {
  const [selectedExample, setSelectedExample] = useState('formatting');
  const [currentDate, setCurrentDate] = useState(dayjs());
  const [customDate, setCustomDate] = useState(dayjs());
  const [dateInput, setDateInput] = useState('');
  const [result, setResult] = useState('');

  const handleDateInputChange = (e) => {
    setDateInput(e.target.value);
    const parsedDate = dayjs(e.target.value);
    if (parsedDate.isValid()) {
      setCustomDate(parsedDate);
    }
  };

  const renderFormattingExamples = () => (
    <div className="example-section">
      <h3>Date Formatting</h3>
      <div className="code-example">
        <pre>{`// Basic formatting
dayjs().format('YYYY-MM-DD') // "${dayjs().format('YYYY-MM-DD')}"
dayjs().format('MMMM Do, YYYY') // "${dayjs().format('MMMM Do, YYYY')}"
dayjs().format('h:mm:ss A') // "${dayjs().format('h:mm:ss A')}"`}</pre>
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
          <p>ISO Format: {customDate.format('YYYY-MM-DD')}</p>
          <p>Long Format: {customDate.format('LLLL')}</p>
          <p>Time Only: {customDate.format('LT')}</p>
        </div>
      </div>
    </div>
  );

  const renderManipulationExamples = () => (
    <div className="example-section">
      <h3>Date Manipulation</h3>
      <div className="code-example">
        <pre>{`// Adding and subtracting time
dayjs().add(7, 'day').format('YYYY-MM-DD') // "${dayjs().add(7, 'day').format('YYYY-MM-DD')}"
dayjs().subtract(3, 'month').format('YYYY-MM-DD') // "${dayjs().subtract(3, 'month').format('YYYY-MM-DD')}"
dayjs().add(1, 'year').format('YYYY-MM-DD') // "${dayjs().add(1, 'year').format('YYYY-MM-DD')}"`}</pre>
      </div>
      <div className="interactive-example">
        <h4>Try it yourself:</h4>
        <div className="button-group">
          <button onClick={() => setCurrentDate(currentDate.add(1, 'day'))}>+1 Day</button>
          <button onClick={() => setCurrentDate(currentDate.subtract(1, 'day'))}>-1 Day</button>
          <button onClick={() => setCurrentDate(currentDate.add(1, 'month'))}>+1 Month</button>
          <button onClick={() => setCurrentDate(currentDate.subtract(1, 'month'))}>-1 Month</button>
          <button onClick={() => setCurrentDate(currentDate.add(1, 'year'))}>+1 Year</button>
          <button onClick={() => setCurrentDate(currentDate.subtract(1, 'year'))}>-1 Year</button>
        </div>
        <div className="result">
          <p>Current Date: {currentDate.format('LLLL')}</p>
        </div>
      </div>
    </div>
  );

  const renderComparisonExamples = () => (
    <div className="example-section">
      <h3>Date Comparison</h3>
      <div className="code-example">
        <pre>{`// Comparing dates
dayjs().isAfter(dayjs().subtract(1, 'day')) // ${dayjs().isAfter(dayjs().subtract(1, 'day'))}
dayjs().isBefore(dayjs().add(1, 'day')) // ${dayjs().isBefore(dayjs().add(1, 'day'))}
dayjs().isSame(dayjs()) // ${dayjs().isSame(dayjs())}`}</pre>
      </div>
      <div className="interactive-example">
        <h4>Try it yourself:</h4>
        <div className="button-group">
          <button onClick={() => setResult(customDate.isSame(dayjs(), 'day') ? 'Today' : 'Not Today')}>
            Is Today?
          </button>
          <button onClick={() => setResult(customDate.day() === 0 || customDate.day() === 6 ? 'Weekend' : 'Weekday')}>
            Is Weekend?
          </button>
          <button onClick={() => setResult(customDate.isSame(dayjs().subtract(1, 'day'), 'day') ? 'Yesterday' : 'Not Yesterday')}>
            Is Yesterday?
          </button>
          <button onClick={() => setResult(customDate.isSame(dayjs().add(1, 'day'), 'day') ? 'Tomorrow' : 'Not Tomorrow')}>
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
dayjs().diff(dayjs().add(7, 'day'), 'day') // ${dayjs().diff(dayjs().add(7, 'day'), 'day')}
dayjs().diff(dayjs().add(3, 'month'), 'month') // ${dayjs().diff(dayjs().add(3, 'month'), 'month')}
dayjs().diff(dayjs().add(1, 'year'), 'year') // ${dayjs().diff(dayjs().add(1, 'year'), 'year')}`}</pre>
      </div>
      <div className="interactive-example">
        <h4>Try it yourself:</h4>
        <div className="button-group">
          <button onClick={() => setResult(`${customDate.diff(dayjs(), 'day')} days`)}>
            Days from Today
          </button>
          <button onClick={() => setResult(`${customDate.diff(dayjs(), 'week')} weeks`)}>
            Weeks from Today
          </button>
          <button onClick={() => setResult(`${customDate.diff(dayjs(), 'month')} months`)}>
            Months from Today
          </button>
          <button onClick={() => setResult(`${customDate.diff(dayjs(), 'year')} years`)}>
            Years from Today
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
dayjs().subtract(5, 'day').fromNow() // "${dayjs().subtract(5, 'day').fromNow()}"
dayjs().subtract(1, 'day').calendar() // "${dayjs().subtract(1, 'day').calendar()}"`}</pre>
      </div>
      <div className="interactive-example">
        <h4>Try it yourself:</h4>
        <div className="button-group">
          <button onClick={() => setResult(dayjs().subtract(1, 'day').fromNow())}>
            1 Day Ago
          </button>
          <button onClick={() => setResult(dayjs().subtract(1, 'week').fromNow())}>
            1 Week Ago
          </button>
          <button onClick={() => setResult(dayjs().subtract(1, 'month').fromNow())}>
            1 Month Ago
          </button>
          <button onClick={() => setResult(dayjs().add(1, 'day').fromNow())}>
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
dayjs().day() // ${dayjs().day()} (0 = Sunday, 1 = Monday, etc.)
dayjs().month() // ${dayjs().month()} (0 = January, 1 = February, etc.)
dayjs().year() // ${dayjs().year()}
dayjs().daysInMonth() // ${dayjs().daysInMonth()}
dayjs().isLeapYear() // ${dayjs().isLeapYear()}`}</pre>
      </div>
      <div className="interactive-example">
        <h4>Try it yourself:</h4>
        <div className="button-group">
          <button onClick={() => setResult(`Day of week: ${customDate.day()}`)}>
            Day of Week
          </button>
          <button onClick={() => setResult(`Month: ${customDate.month()}`)}>
            Month Number
          </button>
          <button onClick={() => setResult(`Year: ${customDate.year()}`)}>
            Year
          </button>
          <button onClick={() => setResult(`Days in month: ${customDate.daysInMonth()}`)}>
            Days in Month
          </button>
          <button onClick={() => setResult(`Is leap year: ${customDate.isLeapYear()}`)}>
            Is Leap Year
          </button>
        </div>
        <div className="result">
          <p>Result: {result}</p>
        </div>
      </div>
    </div>
  );

  const renderPluginExamples = () => (
    <div className="example-section">
      <h3>Plugin Examples</h3>
      <div className="code-example">
        <pre>{`// Using plugins
dayjs.duration(2, 'days').humanize() // "${dayjs.duration(2, 'days').humanize()}"
dayjs().week() // ${dayjs().week()} (week of year)
dayjs().isoWeek() // ${dayjs().isoWeek()} (ISO week)
dayjs().quarter() // ${dayjs().quarter()} (quarter of year)`}</pre>
      </div>
      <div className="interactive-example">
        <h4>Try it yourself:</h4>
        <div className="button-group">
          <button onClick={() => setResult(`Week of year: ${customDate.week()}`)}>
            Week of Year
          </button>
          <button onClick={() => setResult(`ISO week: ${customDate.isoWeek()}`)}>
            ISO Week
          </button>
          <button onClick={() => setResult(`Quarter: ${customDate.quarter()}`)}>
            Quarter
          </button>
          <button onClick={() => setResult(`Day of year: ${customDate.dayOfYear()}`)}>
            Day of Year
          </button>
          <button onClick={() => setResult(`Week year: ${customDate.weekYear()}`)}>
            Week Year
          </button>
        </div>
        <div className="result">
          <p>Result: {result}</p>
        </div>
      </div>
    </div>
  );

  const renderTimezoneExamples = () => (
    <div className="example-section">
      <h3>Timezone Examples</h3>
      <div className="code-example">
        <pre>{`// Working with timezones
dayjs().tz('America/New_York').format('YYYY-MM-DD HH:mm:ss z') // "${dayjs().tz('America/New_York').format('YYYY-MM-DD HH:mm:ss z')}"
dayjs().tz('Europe/London').format('YYYY-MM-DD HH:mm:ss z') // "${dayjs().tz('Europe/London').format('YYYY-MM-DD HH:mm:ss z')}"
dayjs().utc().format() // "${dayjs().utc().format()}"`}</pre>
      </div>
      <div className="interactive-example">
        <h4>Try it yourself:</h4>
        <div className="button-group">
          <button onClick={() => setResult(customDate.tz('America/New_York').format('YYYY-MM-DD HH:mm:ss z'))}>
            New York Time
          </button>
          <button onClick={() => setResult(customDate.tz('Europe/London').format('YYYY-MM-DD HH:mm:ss z'))}>
            London Time
          </button>
          <button onClick={() => setResult(customDate.tz('Asia/Tokyo').format('YYYY-MM-DD HH:mm:ss z'))}>
            Tokyo Time
          </button>
          <button onClick={() => setResult(customDate.utc().format('YYYY-MM-DD HH:mm:ss [UTC]'))}>
            UTC Time
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
      <h2>Day.js Examples</h2>
      <p>Day.js is a minimalist JavaScript library that parses, validates, manipulates, and displays dates and times for modern browsers with a largely Moment.js-compatible API.</p>
      
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
        <button 
          className={selectedExample === 'plugin' ? 'active' : ''}
          onClick={() => setSelectedExample('plugin')}
        >
          Plugins
        </button>
        <button 
          className={selectedExample === 'timezone' ? 'active' : ''}
          onClick={() => setSelectedExample('timezone')}
        >
          Timezones
        </button>
      </div>

      <div className="example-content">
        {selectedExample === 'formatting' && renderFormattingExamples()}
        {selectedExample === 'manipulation' && renderManipulationExamples()}
        {selectedExample === 'comparison' && renderComparisonExamples()}
        {selectedExample === 'difference' && renderDifferenceExamples()}
        {selectedExample === 'relative' && renderRelativeExamples()}
        {selectedExample === 'utility' && renderUtilityExamples()}
        {selectedExample === 'plugin' && renderPluginExamples()}
        {selectedExample === 'timezone' && renderTimezoneExamples()}
      </div>

      <div className="installation">
        <h3>Installation</h3>
        <pre><code>npm install dayjs</code></pre>
      </div>

      <div className="resources">
        <h3>Resources</h3>
        <ul>
          <li><a href="https://day.js.org/" target="_blank" rel="noopener noreferrer">Official Documentation</a></li>
          <li><a href="https://github.com/iamkun/dayjs" target="_blank" rel="noopener noreferrer">GitHub Repository</a></li>
        </ul>
      </div>
    </div>
  );
};

export default DayjsExamples;