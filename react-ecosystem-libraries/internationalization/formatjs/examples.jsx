/**
 * FormatJS Examples
 * 
 * FormatJS is a set of JavaScript libraries for internationalization that includes
 * React Intl, a library for React components that provide internationalization support.
 */

// Example 1: Basic setup with React Intl
/*
// App.js
import React from 'react';
import { IntlProvider, FormattedMessage } from 'react-intl';

// Define messages for different languages
const messages = {
  'en': {
    greeting: 'Hello, {name}!',
    welcome: 'Welcome to our application',
    today: 'Today is {date, date, long}'
  },
  'es': {
    greeting: '¡Hola, {name}!',
    welcome: 'Bienvenido a nuestra aplicación',
    today: 'Hoy es {date, date, long}'
  }
};

function App() {
  const [locale, setLocale] = React.useState('en');
  const [name] = React.useState('John');
  
  return (
    <IntlProvider locale={locale} messages={messages[locale]}>
      <div>
        <h1>
          <FormattedMessage 
            id="greeting" 
            values={{ name }} 
          />
        </h1>
        <p>
          <FormattedMessage id="welcome" />
        </p>
        <p>
          <FormattedMessage 
            id="today" 
            values={{ date: new Date() }} 
          />
        </p>
        <button onClick={() => setLocale(locale === 'en' ? 'es' : 'en')}>
          Switch Language
        </button>
      </div>
    </IntlProvider>
  );
}

export default App;
*/

// Example 2: Using FormattedDate, FormattedTime, and FormattedNumber
/*
// components/DateTimeDisplay.jsx
import React from 'react';
import { 
  FormattedDate, 
  FormattedTime, 
  FormattedNumber,
  FormattedRelativeTime 
} from 'react-intl';

function DateTimeDisplay() {
  const now = new Date();
  const price = 1234.56;
  const percentage = 0.75;
  
  return (
    <div>
      <h2>Date and Time Formatting</h2>
      <p>
        Date: <FormattedDate value={now} />
      </p>
      <p>
        Time: <FormattedTime value={now} />
      </p>
      <p>
        Date and Time: <FormattedDate value={now} year="numeric" month="long" day="numeric" hour="2-digit" minute="2-digit" />
      </p>
      
      <h2>Number Formatting</h2>
      <p>
        Price: <FormattedNumber value={price} style="currency" currency="USD" />
      </p>
      <p>
        Percentage: <FormattedNumber value={percentage} style="percent" />
      </p>
      <p>
        Decimal: <FormattedNumber value={price} minimumFractionDigits={2} />
      </p>
      
      <h2>Relative Time</h2>
      <p>
        5 seconds ago: <FormattedRelativeTime value={-5} unit="second" />
      </p>
      <p>
        In 3 days: <FormattedRelativeTime value={3} unit="day" />
      </p>
    </div>
  );
}

export default DateTimeDisplay;
*/

// Example 3: Using useIntl hook
/*
// hooks/useFormattedMessage.js
import { useIntl } from 'react-intl';

export function useCustomMessage() {
  const intl = useIntl();
  
  return {
    formatMessage: (id, values = {}) => {
      return intl.formatMessage({ id }, values);
    },
    formatDate: (date, options = {}) => {
      return intl.formatDate(date, options);
    },
    formatTime: (time, options = {}) => {
      return intl.formatTime(time, options);
    },
    formatNumber: (number, options = {}) => {
      return intl.formatNumber(number, options);
    }
  };
}

// components/UserProfile.jsx
import React from 'react';
import { useCustomMessage } from '../hooks/useFormattedMessage';

function UserProfile({ user }) {
  const { formatMessage, formatDate, formatNumber } = useCustomMessage();
  
  return (
    <div>
      <h2>{formatMessage('user.profile.title')}</h2>
      <p>{formatMessage('user.profile.name', { name: user.name })}</p>
      <p>{formatMessage('user.profile.memberSince', { date: user.memberSince })}</p>
      <p>{formatMessage('user.profile.balance', { balance: user.balance })}</p>
    </div>
  );
}

export default UserProfile;
*/

// Example 4: Pluralization and Select formatting
/*
// messages/en.json
{
  "cart.items": "{count, plural, =0 {No items} =1 {One item} other {# items}}",
  "notification": "{type, select, error {Error: {message}} warning {Warning: {message}} other {Info: {message}}}",
  "gender": "{gender, select, male {He} female {She} other {They}} likes this."
}

// components/Cart.jsx
import React from 'react';
import { FormattedMessage } from 'react-intl';

function Cart({ itemCount, notification }) {
  return (
    <div>
      <h2>
        <FormattedMessage 
          id="cart.items" 
          values={{ count: itemCount }} 
        />
      </h2>
      <p>
        <FormattedMessage 
          id="notification" 
          values={{ 
            type: notification.type, 
            message: notification.message 
          }} 
        />
      </p>
      <p>
        <FormattedMessage 
          id="gender" 
          values={{ gender: 'male' }} 
        />
      </p>
    </div>
  );
}

export default Cart;
*/

// Example 5: Rich text formatting
/*
// messages/en.json
{
  "welcome.message": "Welcome to <bold>{appName}</bold>. Please <link>read our terms</link>.",
  "terms.link": "read our terms"
}

// components/Welcome.jsx
import React from 'react';
import { FormattedMessage } from 'react-intl';

function Welcome({ appName }) {
  return (
    <div>
      <FormattedMessage 
        id="welcome.message"
        values={{
          appName,
          bold: (chunks) => <strong>{chunks}</strong>,
          link: (chunks) => <a href="/terms">{chunks}</a>
        }}
      />
    </div>
  );
}

export default Welcome;
*/

// Example 6: Extracting messages with Babel plugin
/*
// .babelrc
{
  "presets": ["@babel/preset-react"],
  "plugins": [
    ["@formatjs", {
      "idInterpolationPattern": "[sha512:contenthash:base64:6]",
      "ast": true
    }]
  ]
}

// After running the build, messages will be extracted to a JSON file
// messages/en.json
{
  "app.title": "My Application",
  "user.greeting": "Hello, {name}!",
  "button.save": "Save"
}
*/

// Example 7: Loading messages dynamically
/*
// utils/i18n.js
import { IntlProvider } from 'react-intl';
import React, { useState, useEffect } from 'react';

async function loadMessages(locale) {
  switch (locale) {
    case 'en':
      return import('../messages/en.json');
    case 'es':
      return import('../messages/es.json');
    case 'fr':
      return import('../messages/fr.json');
    default:
      return import('../messages/en.json');
  }
}

function I18nProvider({ children, locale }) {
  const [messages, setMessages] = useState({});
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    setLoading(true);
    loadMessages(locale)
      .then((module) => {
        setMessages(module.default);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Failed to load messages:', error);
        setLoading(false);
      });
  }, [locale]);
  
  if (loading) {
    return <div>Loading translations...</div>;
  }
  
  return (
    <IntlProvider locale={locale} messages={messages}>
      {children}
    </IntlProvider>
  );
}

export default I18nProvider;
*/

// Example 8: Context-based internationalization
/*
// context/LanguageContext.js
import React, { createContext, useContext, useState } from 'react';

const LanguageContext = createContext();

export function LanguageProvider({ children }) {
  const [locale, setLocale] = useState('en');
  
  const changeLanguage = (newLocale) => {
    setLocale(newLocale);
    localStorage.setItem('locale', newLocale);
  };
  
  React.useEffect(() => {
    const savedLocale = localStorage.getItem('locale');
    if (savedLocale) {
      setLocale(savedLocale);
    }
  }, []);
  
  return (
    <LanguageContext.Provider value={{ locale, changeLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}

// components/LanguageSelector.jsx
import React from 'react';
import { useLanguage } from '../context/LanguageContext';

function LanguageSelector() {
  const { locale, changeLanguage } = useLanguage();
  
  return (
    <div>
      <label>
        Language:
        <select 
          value={locale} 
          onChange={(e) => changeLanguage(e.target.value)}
        >
          <option value="en">English</option>
          <option value="es">Español</option>
          <option value="fr">Français</option>
        </select>
      </label>
    </div>
  );
}

export default LanguageSelector;
*/

// Example 9: Advanced formatting with ICU MessageFormat
/*
// messages/en.json
{
  "complex.message": "On {date, date, long}, {name} {gender, select, male {bought} female {bought} other {purchased}} {count, plural, =0 {nothing} =1 {one item} other {# items}} for {amount, number, currency}.",
  "duration": "It took {duration, number, ::duration}"
}

// components/ComplexMessage.jsx
import React from 'react';
import { FormattedMessage } from 'react-intl';

function ComplexMessage({ transaction }) {
  return (
    <div>
      <FormattedMessage 
        id="complex.message"
        values={{
          date: transaction.date,
          name: transaction.name,
          gender: transaction.gender,
          count: transaction.itemCount,
          amount: transaction.amount
        }}
      />
      <br />
      <FormattedMessage 
        id="duration"
        values={{ duration: 3661 }} // 1 hour, 1 minute, 1 second
      />
    </div>
  );
}

export default ComplexMessage;
*/

// Example 10: Testing internationalized components
/*
// __tests__/Button.test.jsx
import React from 'react';
import { render, screen } from '@testing-library/react';
import { IntlProvider } from 'react-intl';
import Button from '../Button';

const messages = {
  'button.save': 'Save',
  'button.cancel': 'Cancel'
};

function renderWithIntl(component, locale = 'en') {
  return render(
    <IntlProvider locale={locale} messages={messages}>
      {component}
    </IntlProvider>
  );
}

test('renders save button with correct text', () => {
  renderWithIntl(<Button type="save" />);
  expect(screen.getByRole('button', { name: /save/i })).toBeInTheDocument();
});

test('renders cancel button with correct text', () => {
  renderWithIntl(<Button type="cancel" />);
  expect(screen.getByRole('button', { name: /cancel/i })).toBeInTheDocument();
});
*/

export const formatjsExamples = {
  description: "Examples of using FormatJS for internationalization in React applications",
  installation: {
    core: "npm install react-intl",
    babel: "npm install @formatjs/babel-plugin --save-dev",
    cli: "npm install @formatjs/cli --save-dev"
  },
  components: [
    "IntlProvider: Provides internationalization context",
    "FormattedMessage: Displays translated messages",
    "FormattedDate: Formats dates according to locale",
    "FormattedTime: Formats times according to locale",
    "FormattedNumber: Formats numbers according to locale",
    "FormattedRelativeTime: Formats relative time"
  ],
  hooks: [
    "useIntl: Access to the intl object",
    "useFormatMessage: Custom hook for message formatting"
  ],
  features: [
    "Pluralization support",
    "Select formatting",
    "Rich text formatting",
    "Date and time formatting",
    "Number and currency formatting",
    "Message extraction with Babel plugin"
  ]
};