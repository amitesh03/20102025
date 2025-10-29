/**
 * LinguiJS Examples
 * 
 * LinguiJS is a lightweight, yet powerful internationalization framework for JavaScript.
 * It provides tools for message extraction, translation, and formatting.
 */

// Example 1: Basic setup with LinguiJS
/*
// App.js
import React from 'react';
import { i18n } from '@lingui/core';
import { I18nProvider, Trans } from '@lingui/react';
import { en, es } from 'make-plural/plurals';

// Activate locale
i18n.load('en', {
  plurals: en,
  messages: {}
});
i18n.load('es', {
  plurals: es,
  messages: {}
});
i18n.activate('en');

function App() {
  const [locale, setLocale] = React.useState('en');
  
  const changeLanguage = (newLocale) => {
    i18n.load(newLocale, {
      plurals: newLocale === 'en' ? en : es,
      messages: {}
    });
    i18n.activate(newLocale);
    setLocale(newLocale);
  };
  
  return (
    <I18nProvider i18n={i18n}>
      <div>
        <h1>
          <Trans id="welcome.title">Welcome to LinguiJS</Trans>
        </h1>
        <p>
          <Trans id="welcome.description">
            This is a sample application demonstrating internationalization.
          </Trans>
        </p>
        <button onClick={() => changeLanguage(locale === 'en' ? 'es' : 'en')}>
          <Trans id="language.switch">Switch Language</Trans>
        </button>
      </div>
    </I18nProvider>
  );
}

export default App;
*/

// Example 2: Using Trans component with variables
/*
// components/UserProfile.jsx
import React from 'react';
import { Trans } from '@lingui/react';

function UserProfile({ user }) {
  return (
    <div>
      <h2>
        <Trans id="user.profile.title">User Profile</Trans>
      </h2>
      <p>
        <Trans id="user.profile.name">
          Name: <strong>{user.name}</strong>
        </Trans>
      </p>
      <p>
        <Trans id="user.profile.email">
          Email: <a href={`mailto:${user.email}`}>{user.email}</a>
        </Trans>
      </p>
      <p>
        <Trans id="user.profile.memberSince">
          Member since: {user.memberSince, date, long}
        </Trans>
      </p>
    </div>
  );
}

export default UserProfile;
*/

// Example 3: Using t macro for translations
/*
// components/ShoppingCart.jsx
import React from 'react';
import { t } from '@lingui/macro';
import { Trans } from '@lingui/react';

function ShoppingCart({ items, total }) {
  return (
    <div>
      <h2>{t`Shopping Cart`}</h2>
      <p>
        {t`You have ${items.length} items in your cart.`}
      </p>
      <p>
        {t`Total: ${total, number, currency}`}
      </p>
      <button>
        {t`Checkout`}
      </button>
    </div>
  );
}

export default ShoppingCart;
*/

// Example 4: Pluralization with LinguiJS
/*
// components/Notification.jsx
import React from 'react';
import { Trans, plural } from '@lingui/macro';

function Notification({ count }) {
  return (
    <div>
      <Trans id="notification.count">
        {plural(count, {
          one: 'You have # notification',
          other: 'You have # notifications'
        })}
      </Trans>
    </div>
  );
}

export default Notification;
*/

// Example 5: Select formatting
/*
// components/Greeting.jsx
import React from 'react';
import { Trans, select } from '@lingui/macro';

function Greeting({ user }) {
  return (
    <div>
      <Trans id="greeting.message">
        {select(user.gender, {
          male: 'Hello, Mr. {name}',
          female: 'Hello, Ms. {name}',
          other: 'Hello, {name}'
        }, { name: user.name })}
      </Trans>
    </div>
  );
}

export default Greeting;
*/

// Example 6: Message extraction with Babel plugin
/*
// .babelrc
{
  "presets": ["@babel/preset-react"],
  "plugins": [
    ["@lingui/babel-plugin-transform-js", {
      "extractBabelOptions": {
        "presets": ["@babel/preset-react"]
      }
    }]
  ]
}

// package.json scripts
{
  "scripts": {
    "extract": "lingui extract",
    "compile": "lingui compile",
    "add-locale": "lingui add-locale"
  }
}

// After running npm run extract, messages will be extracted to locale files
// locale/en/messages.json
{
  "welcome.title": "Welcome to LinguiJS",
  "welcome.description": "This is a sample application demonstrating internationalization.",
  "language.switch": "Switch Language"
}
*/

// Example 7: Loading translations dynamically
/*
// utils/i18n.js
import { i18n } from '@lingui/core';
import { en, es, fr } from 'make-plural/plurals';

async function loadCatalog(locale) {
  try {
    const catalog = await import(`../locale/${locale}/messages.js`);
    i18n.load(locale, catalog.messages);
    i18n.activate(locale);
  } catch (error) {
    console.error(`Failed to load locale: ${locale}`, error);
    // Fallback to English
    const catalog = await import('../locale/en/messages.js');
    i18n.load('en', catalog.messages);
    i18n.activate('en');
  }
}

export { loadCatalog };

// App.js
import React, { useState, useEffect } from 'react';
import { I18nProvider } from '@lingui/react';
import { loadCatalog } from './utils/i18n';

function App() {
  const [locale, setLocale] = useState('en');
  const [catalogLoaded, setCatalogLoaded] = useState(false);
  
  useEffect(() => {
    loadCatalog(locale).then(() => {
      setCatalogLoaded(true);
    });
  }, [locale]);
  
  if (!catalogLoaded) {
    return <div>Loading translations...</div>;
  }
  
  return (
    <I18nProvider i18n={i18n}>
      <div>
        <button onClick={() => setLocale('en')}>English</button>
        <button onClick={() => setLocale('es')}>Español</button>
        <button onClick={() => setLocale('fr')}>Français</button>
      </div>
    </I18nProvider>
  );
}

export default App;
*/

// Example 8: Context-based internationalization
/*
// context/LanguageContext.js
import React, { createContext, useContext, useState } from 'react';
import { i18n } from '@lingui/core';
import { loadCatalog } from '../utils/i18n';

const LanguageContext = createContext();

export function LanguageProvider({ children }) {
  const [locale, setLocale] = useState('en');
  const [loading, setLoading] = useState(false);
  
  const changeLanguage = async (newLocale) => {
    setLoading(true);
    try {
      await loadCatalog(newLocale);
      setLocale(newLocale);
      localStorage.setItem('locale', newLocale);
    } catch (error) {
      console.error('Failed to change language:', error);
    } finally {
      setLoading(false);
    }
  };
  
  React.useEffect(() => {
    const savedLocale = localStorage.getItem('locale') || 'en';
    changeLanguage(savedLocale);
  }, []);
  
  return (
    <LanguageContext.Provider value={{ locale, changeLanguage, loading }}>
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
  const { locale, changeLanguage, loading } = useLanguage();
  
  return (
    <div>
      <label>
        Language:
        <select 
          value={locale} 
          onChange={(e) => changeLanguage(e.target.value)}
          disabled={loading}
        >
          <option value="en">English</option>
          <option value="es">Español</option>
          <option value="fr">Français</option>
        </select>
        {loading && <span>Loading...</span>}
      </label>
    </div>
  );
}

export default LanguageSelector;
*/

// Example 9: Advanced formatting with LinguiJS
/*
// components/AdvancedFormatting.jsx
import React from 'react';
import { Trans, plural, select, defineMessage } from '@lingui/macro';

// Define message outside component for better performance
const complexMessage = defineMessage({
  id: 'complex.message',
  comment: 'This message shows various formatting options',
  message: 'On {date, date, long}, {name} {gender, select, male {bought} female {bought} other {purchased}} {count, plural, =0 {nothing} =1 {one item} other {# items}} for {amount, number, currency}.'
});

function AdvancedFormatting({ transaction }) {
  return (
    <div>
      <Trans id="simple.message">
        Hello, {name}! You have {count, plural, =0 {no messages} =1 {one message} other {# messages}}.
      </Trans>
      
      <Trans 
        id={complexMessage.id}
        comment={complexMessage.comment}
        message={complexMessage.message}
        values={{
          date: transaction.date,
          name: transaction.name,
          gender: transaction.gender,
          count: transaction.itemCount,
          amount: transaction.amount
        }}
      />
    </div>
  );
}

export default AdvancedFormatting;
*/

// Example 10: Testing internationalized components
/*
// __tests__/Button.test.jsx
import React from 'react';
import { render, screen } from '@testing-library/react';
import { I18nProvider } from '@lingui/react';
import { i18n } from '@lingui/core';
import Button from '../Button';

// Mock i18n
i18n.load('en', {
  messages: {
    'button.save': 'Save',
    'button.cancel': 'Cancel'
  }
});
i18n.activate('en');

function renderWithI18n(component) {
  return render(
    <I18nProvider i18n={i18n}>
      {component}
    </I18nProvider>
  );
}

test('renders save button with correct text', () => {
  renderWithI18n(<Button type="save" />);
  expect(screen.getByRole('button', { name: /save/i })).toBeInTheDocument();
});

test('renders cancel button with correct text', () => {
  renderWithI18n(<Button type="cancel" />);
  expect(screen.getByRole('button', { name: /cancel/i })).toBeInTheDocument();
});
*/

// Example 11: Working with PO files
/*
// After extraction, you can work with PO files for translation
// locale/en/LC_MESSAGES/messages.po

msgid ""
msgstr ""
"Language: en\n"
"MIME-Version: 1.0\n"
"Content-Type: text/plain; charset=UTF-8\n"

#: src/components/Button.jsx:10
msgid "button.save"
msgstr "Save"

#: src/components/Button.jsx:15
msgid "button.cancel"
msgstr "Cancel"

# After translation, compile with:
# lingui compile
*/

// Example 12: Custom date and number formatting
/*
// utils/formatters.js
import { i18n } from '@lingui/core';

export function formatDate(date, options = {}) {
  return new Intl.DateTimeFormat(i18n.locale, options).format(date);
}

export function formatNumber(number, options = {}) {
  return new Intl.NumberFormat(i18n.locale, options).format(number);
}

export function formatCurrency(amount, currency = 'USD') {
  return new Intl.NumberFormat(i18n.locale, {
    style: 'currency',
    currency
  }).format(amount);
}

// components/PriceDisplay.jsx
import React from 'react';
import { formatCurrency, formatDate } from '../utils/formatters';

function PriceDisplay({ price, date }) {
  return (
    <div>
      <p>Price: {formatCurrency(price)}</p>
      <p>Date: {formatDate(date, { year: 'numeric', month: 'long', day: 'numeric' })}</p>
    </div>
  );
}

export default PriceDisplay;
*/

export const linguijsExamples = {
  description: "Examples of using LinguiJS for internationalization in React applications",
  installation: {
    core: "npm install @lingui/core @lingui/react",
    macros: "npm install @lingui/macro",
    babel: "npm install @lingui/babel-plugin-transform-js --save-dev",
    cli: "npm install @lingui/cli --save-dev",
    plurals: "npm install make-plural"
  },
  components: [
    "I18nProvider: Provides internationalization context",
    "Trans: Component for translating text with markup",
    "t macro: Function for simple translations",
    "plural macro: For pluralization",
    "select macro: For conditional translations"
  ],
  commands: {
    extract: "lingui extract - Extract messages from source code",
    compile: "lingui compile - Compile message catalogs",
    addLocale: "lingui add-locale <locale> - Add new locale"
  },
  features: [
    "Message extraction with Babel plugin",
    "Pluralization support",
    "Select formatting",
    "Rich text formatting",
    "PO file support",
    "Dynamic locale loading"
  ]
};