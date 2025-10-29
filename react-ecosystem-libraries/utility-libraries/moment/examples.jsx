import React, { useState } from 'react';
import moment from 'moment';

const MomentExamples = () => {
  const [selectedExample, setSelectedExample] = useState('basics');
  const [inputDate, setInputDate] = useState('2023-12-25');
  const [inputFormat, setInputFormat] = useState('YYYY-MM-DD');
  const [result, setResult] = useState('');

  const handleDateChange = (e) => {
    setInputDate(e.target.value);
    try {
      const date = moment(e.target.value);
      if (date.isValid()) {
        setResult(date.format('MMMM Do YYYY, h:mm:ss a'));
      } else {
        setResult('Invalid date');
      }
    } catch (error) {
      setResult('Invalid date');
    }
  };

  const renderBasicsExamples = () => (
    <div className="example-section">
      <h3>Basic Usage</h3>
      <div className="code-example">
        <pre>{`// Get current date and time
moment().format() // "${moment().format()}"

// Parse a date string
moment('2023-12-25').format('MMMM Do YYYY') // "${moment('2023-12-25').format('MMMM Do YYYY')}"

// Format a date
moment().format('dddd, MMMM Do YYYY, h:mm:ss a') // "${moment().format('dddd, MMMM Do YYYY, h:mm:ss a')}"

// Add time
moment().add(7, 'days').calendar() // "${moment().add(7, 'days').calendar()}"

// Subtract time
moment().subtract(1, 'year').format('YYYY-MM-DD') // "${moment().subtract(1, 'year').format('YYYY-MM-DD')}"`}</pre>
      </div>
      <div className="interactive-example">
        <h4>Try it yourself:</h4>
        <input 
          type="text" 
          value={inputDate} 
          onChange={handleDateChange}
          placeholder="Enter a date (e.g., 2023-12-25)"
        />
        <div className="button-group">
          <button onClick={() => {
            const date = moment(inputDate);
            if (date.isValid()) {
              setResult(date.format('MMMM Do YYYY'));
            } else {
              setResult('Invalid date');
            }
          }}>
            Format (Month Day Year)
          </button>
          <button onClick={() => {
            const date = moment(inputDate);
            if (date.isValid()) {
              setResult(date.fromNow());
            } else {
              setResult('Invalid date');
            }
          }}>
            From Now
          </button>
          <button onClick={() => {
            const date = moment(inputDate);
            if (date.isValid()) {
              setResult(date.calendar());
            } else {
              setResult('Invalid date');
            }
          }}>
            Calendar
          </button>
        </div>
        <div className="result">
          <p>Result: {result}</p>
        </div>
      </div>
    </div>
  );

  const renderManipulationExamples = () => (
    <div className="example-section">
      <h3>Date Manipulation</h3>
      <div className="code-example">
        <pre>{`// Add time units
moment().add(7, 'days').format() // "${moment().add(7, 'days').format()}"
moment().add(2, 'months').format() // "${moment().add(2, 'months').format()}"
moment().add(3, 'years').format() // "${moment().add(3, 'years').format()}"

// Subtract time units
moment().subtract(7, 'days').format() // "${moment().subtract(7, 'days').format()}"
moment().subtract(2, 'months').format() // "${moment().subtract(2, 'months').format()}"

// Start of time unit
moment().startOf('day').format() // "${moment().startOf('day').format()}"
moment().startOf('month').format() // "${moment().startOf('month').format()}"

// End of time unit
moment().endOf('day').format() // "${moment().endOf('day').format()}"
moment().endOf('month').format() // "${moment().endOf('month').format()}"`}</pre>
      </div>
      <div className="interactive-example">
        <h4>Try it yourself:</h4>
        <div className="button-group">
          <button onClick={() => setResult(moment().add(7, 'days').format('YYYY-MM-DD'))}>
            Add 7 Days
          </button>
          <button onClick={() => setResult(moment().add(1, 'month').format('YYYY-MM-DD'))}>
            Add 1 Month
          </button>
          <button onClick={() => setResult(moment().subtract(7, 'days').format('YYYY-MM-DD'))}>
            Subtract 7 Days
          </button>
          <button onClick={() => setResult(moment().startOf('week').format('YYYY-MM-DD'))}>
            Start of Week
          </button>
          <button onClick={() => setResult(moment().endOf('month').format('YYYY-MM-DD'))}>
            End of Month
          </button>
        </div>
        <div className="result">
          <p>Result: {result}</p>
        </div>
      </div>
    </div>
  );

  const renderQueryExamples = () => (
    <div className="example-section">
      <h3>Date Queries</h3>
      <div className="code-example">
        <pre>{`// Check if a moment is before/after another
moment('2023-01-01').isBefore('2023-12-25') // ${moment('2023-01-01').isBefore('2023-12-25')}
moment('2023-12-25').isAfter('2023-01-01') // ${moment('2023-12-25').isAfter('2023-01-01')}

// Check if a moment is the same as another
moment('2023-12-25').isSame('2023-12-25') // ${moment('2023-12-25').isSame('2023-12-25')}

// Check if a moment is between two others
moment('2023-06-15').isBetween('2023-01-01', '2023-12-31') // ${moment('2023-06-15').isBetween('2023-01-01', '2023-12-31')}

// Check if a year is a leap year
moment('2024-01-01').isLeapYear() // ${moment('2024-01-01').isLeapYear()}
moment('2023-01-01').isLeapYear() // ${moment('2023-01-01').isLeapYear()}

// Check if a date is daylight saving time
moment().isDST() // ${moment().isDST()}`}</pre>
      </div>
      <div className="interactive-example">
        <h4>Try it yourself:</h4>
        <div className="button-group">
          <button onClick={() => setResult(String(moment().isBefore(moment().add(1, 'day'))))}>
            Is Today Before Tomorrow?
          </button>
          <button onClick={() => setResult(String(moment().isAfter(moment().subtract(1, 'day'))))}>
            Is Today After Yesterday?
          </button>
          <button onClick={() => setResult(String(moment('2024-01-01').isLeapYear()))}>
            Is 2024 a Leap Year?
          </button>
          <button onClick={() => setResult(String(moment('2023-06-15').isBetween('2023-01-01', '2023-12-31')))}>
            Is June 15, 2023 Between Jan 1 and Dec 31, 2023?
          </button>
        </div>
        <div className="result">
          <p>Result: {result}</p>
        </div>
      </div>
    </div>
  );

  const renderFormattingExamples = () => (
    <div className="example-section">
      <h3>Date Formatting</h3>
      <div className="code-example">
        <pre>{`// Common formats
moment().format('L') // "${moment().format('L')}"
moment().format('LL') // "${moment().format('LL')}"
moment().format('LLL') // "${moment().format('LLL')}"
moment().format('LLLL') // "${moment().format('LLLL')}"

// Custom formats
moment().format('YYYY-MM-DD') // "${moment().format('YYYY-MM-DD')}"
moment().format('MM/DD/YYYY') // "${moment().format('MM/DD/YYYY')}"
moment().format('dddd, MMMM Do YYYY') // "${moment().format('dddd, MMMM Do YYYY')}"

// Time formats
moment().format('h:mm:ss a') // "${moment().format('h:mm:ss a')}"
moment().format('HH:mm:ss') // "${moment().format('HH:mm:ss')}"
moment().format('h:mm a') // "${moment().format('h:mm a')}"`}</pre>
      </div>
      <div className="interactive-example">
        <h4>Try it yourself:</h4>
        <div className="button-group">
          <button onClick={() => setResult(moment().format('L'))}>
            Locale Date (L)
          </button>
          <button onClick={() => setResult(moment().format('LL'))}>
            Locale Date (LL)
          </button>
          <button onClick={() => setResult(moment().format('LLLL'))}>
            Locale Date (LLLL)
          </button>
          <button onClick={() => setResult(moment().format('YYYY-MM-DD HH:mm:ss'))}>
            ISO Format
          </button>
          <button onClick={() => setResult(moment().format('dddd, MMMM Do YYYY'))}>
            Verbose Format
          </button>
        </div>
        <div className="result">
          <p>Result: {result}</p>
        </div>
      </div>
    </div>
  );

  const renderDurationExamples = () => (
    <div className="example-section">
      <h3>Duration</h3>
      <div className="code-example">
        <pre>{`// Create a duration
moment.duration(1, 'week').humanize() // "${moment.duration(1, 'week').humanize()}"
moment.duration(2, 'days').humanize() // "${moment.duration(2, 'days').humanize()}"
moment.duration(3, 'hours').humanize() // "${moment.duration(3, 'hours').humanize()}"

// Duration with suffix
moment.duration(1, 'week').humanize(true) // "${moment.duration(1, 'week').humanize(true)}"
moment.duration(2, 'days').humanize(true) // "${moment.duration(2, 'days').humanize(true)}"

// Get duration in different units
moment.duration(1, 'day').asHours() // ${moment.duration(1, 'day').asHours()}
moment.duration(1, 'week').asDays() // ${moment.duration(1, 'week').asDays()}
moment.duration(1, 'hour').asMinutes() // ${moment.duration(1, 'hour').asMinutes()}

// Add duration to a moment
moment().add(moment.duration(1, 'week')).format() // "${moment().add(moment.duration(1, 'week')).format()}"`}</pre>
      </div>
      <div className="interactive-example">
        <h4>Try it yourself:</h4>
        <div className="button-group">
          <button onClick={() => setResult(moment.duration(1, 'week').humanize())}>
            1 Week Humanized
          </button>
          <button onClick={() => setResult(moment.duration(1, 'week').humanize(true))}>
            1 Week Humanized (with suffix)
          </button>
          <button onClick={() => setResult(String(moment.duration(1, 'day').asHours()))}>
            1 Day in Hours
          </button>
          <button onClick={() => setResult(String(moment.duration(1, 'week').asDays()))}>
            1 Week in Days
          </button>
          <button onClick={() => setResult(moment().add(moment.duration(2, 'days')).calendar())}>
            Add 2 Days to Today
          </button>
        </div>
        <div className="result">
          <p>Result: {result}</p>
        </div>
      </div>
    </div>
  );

  const renderInternationalizationExamples = () => (
    <div className="example-section">
      <h3>Internationalization</h3>
      <div className="code-example">
        <pre>{`// Set locale
moment.locale('fr') // French
moment().format('LLLL') // "${moment.locale('fr') || moment().format('LLLL')}"

moment.locale('es') // Spanish
moment().format('LLLL') // "${moment.locale('es') || moment().format('LLLL')}"

moment.locale('de') // German
moment().format('LLLL') // "${moment.locale('de') || moment().format('LLLL')}"

moment.locale('ja') // Japanese
moment().format('LLLL') // "${moment.locale('ja') || moment().format('LLLL')}"

// Reset to default locale
moment.locale('en') // English
moment().format('LLLL') // "${moment.locale('en') || moment().format('LLLL')}"`}</pre>
      </div>
      <div className="interactive-example">
        <h4>Try it yourself:</h4>
        <div className="button-group">
          <button onClick={() => {
            moment.locale('fr');
            setResult(moment().format('LLLL'));
          }}>
            French
          </button>
          <button onClick={() => {
            moment.locale('es');
            setResult(moment().format('LLLL'));
          }}>
            Spanish
          </button>
          <button onClick={() => {
            moment.locale('de');
            setResult(moment().format('LLLL'));
          }}>
            German
          </button>
          <button onClick={() => {
            moment.locale('ja');
            setResult(moment().format('LLLL'));
          }}>
            Japanese
          </button>
          <button onClick={() => {
            moment.locale('en');
            setResult(moment().format('LLLL'));
          }}>
            English
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
      <h2>Moment.js Examples</h2>
      <p>Moment.js is a legacy date library for parsing, validating, manipulating, and formatting dates.</p>
      <p><strong>Note:</strong> Moment.js is now in maintenance mode. For new projects, consider using modern alternatives like Luxon, Day.js, or date-fns.</p>
      
      <div className="example-navigation">
        <button 
          className={selectedExample === 'basics' ? 'active' : ''}
          onClick={() => setSelectedExample('basics')}
        >
          Basics
        </button>
        <button 
          className={selectedExample === 'manipulation' ? 'active' : ''}
          onClick={() => setSelectedExample('manipulation')}
        >
          Manipulation
        </button>
        <button 
          className={selectedExample === 'query' ? 'active' : ''}
          onClick={() => setSelectedExample('query')}
        >
          Queries
        </button>
        <button 
          className={selectedExample === 'formatting' ? 'active' : ''}
          onClick={() => setSelectedExample('formatting')}
        >
          Formatting
        </button>
        <button 
          className={selectedExample === 'duration' ? 'active' : ''}
          onClick={() => setSelectedExample('duration')}
        >
          Duration
        </button>
        <button 
          className={selectedExample === 'i18n' ? 'active' : ''}
          onClick={() => setSelectedExample('i18n')}
        >
          i18n
        </button>
      </div>

      <div className="example-content">
        {selectedExample === 'basics' && renderBasicsExamples()}
        {selectedExample === 'manipulation' && renderManipulationExamples()}
        {selectedExample === 'query' && renderQueryExamples()}
        {selectedExample === 'formatting' && renderFormattingExamples()}
        {selectedExample === 'duration' && renderDurationExamples()}
        {selectedExample === 'i18n' && renderInternationalizationExamples()}
      </div>

      <div className="installation">
        <h3>Installation</h3>
        <pre><code>npm install moment</code></pre>
      </div>

      <div className="resources">
        <h3>Resources</h3>
        <ul>
          <li><a href="https://momentjs.com/" target="_blank" rel="noopener noreferrer">Official Documentation</a></li>
          <li><a href="https://github.com/moment/moment" target="_blank" rel="noopener noreferrer">GitHub Repository</a></li>
          <li><a href="https://momentjs.com/docs/#/-project-status/" target="_blank" rel="noopener noreferrer">Project Status (Maintenance Mode)</a></li>
        </ul>
      </div>
    </div>
  );
};

export default MomentExamples;