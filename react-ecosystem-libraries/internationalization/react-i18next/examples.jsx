/**
 * React i18next Examples
 * 
 * react-i18next is a powerful internationalization framework for React that is based on
 * i18next. It provides components and hooks for easy integration with React applications.
 */

// Example 1: Basic setup with react-i18next
/*
// i18n/index.js
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// Import translation files
import enTranslations from './locales/en.json';
import esTranslations from './locales/es.json';

i18n
  .use(initReactI18next)
  .init({
    resources: {
      en: {
        translation: enTranslations
      },
      es: {
        translation: esTranslations
      }
    },
    lng: 'en', // Default language
    fallbackLng: 'en', // Fallback language
    interpolation: {
      escapeValue: false // React already escapes values
    }
  });

export default i18n;

// i18n/locales/en.json
{
  "welcome": "Welcome to React i18next",
  "description": "This is a sample application demonstrating internationalization.",
  "greeting": "Hello, {{name}}!",
  "language.switch": "Switch Language"
}

// i18n/locales/es.json
{
  "welcome": "Bienvenido a React i18next",
  "description": "Esta es una aplicación de ejemplo que demuestra la internacionalización.",
  "greeting": "¡Hola, {{name}}!",
  "language.switch": "Cambiar Idioma"
}

// App.js
import React from 'react';
import { useTranslation } from 'react-i18next';
import './i18n';

function App() {
  const { t, i18n } = useTranslation();
  
  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
  };
  
  return (
    <div>
      <h1>{t('welcome')}</h1>
      <p>{t('description')}</p>
      <p>{t('greeting', { name: 'John' })}</p>
      <button onClick={() => changeLanguage('en')}>English</button>
      <button onClick={() => changeLanguage('es')}>Español</button>
    </div>
  );
}

export default App;
*/

// Example 2: Using Trans component
/*
// components/Welcome.jsx
import React from 'react';
import { Trans, useTranslation } from 'react-i18next';

function Welcome({ name }) {
  const { t } = useTranslation();
  
  return (
    <div>
      <h1>{t('welcome.title')}</h1>
      <Trans i18nKey="welcome.message">
        Welcome to <strong>{{ name }}</strong>, your profile is ready.
      </Trans>
    </div>
  );
}

export default Welcome;

// i18n/locales/en.json
{
  "welcome.title": "Welcome",
  "welcome.message": "Welcome to <1>{{ name }}</1>, your profile is ready."
}
*/

// Example 3: Pluralization
/*
// components/Notification.jsx
import React from 'react';
import { useTranslation } from 'react-i18next';

function Notification({ count }) {
  const { t } = useTranslation();
  
  return (
    <div>
      <h2>{t('notification.title')}</h2>
      <p>
        {t('notification.count', { count })}
      </p>
    </div>
  );
}

export default Notification;

// i18n/locales/en.json
{
  "notification.title": "Notifications",
  "notification.count_one": "You have {{count}} notification",
  "notification.count_other": "You have {{count}} notifications"
}

// i18n/locales/es.json
{
  "notification.title": "Notificaciones",
  "notification.count_one": "Tienes {{count}} notificación",
  "notification.count_other": "Tienes {{count}} notificaciones"
}
*/

// Example 4: Using namespaces
/*
// i18n/index.js
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import enCommon from './locales/en/common.json';
import enHome from './locales/en/home.json';
import esCommon from './locales/es/common.json';
import esHome from './locales/es/home.json';

i18n
  .use(initReactI18next)
  .init({
    resources: {
      en: {
        common: enCommon,
        home: enHome
      },
      es: {
        common: esCommon,
        home: esHome
      }
    },
    lng: 'en',
    fallbackLng: 'en',
    defaultNS: 'common',
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;

// components/Home.jsx
import React from 'react';
import { useTranslation } from 'react-i18next';

function Home() {
  const { t } = useTranslation(['home', 'common']);
  
  return (
    <div>
      <h1>{t('home:title')}</h1>
      <p>{t('home:description')}</p>
      <button>{t('common:button.save')}</button>
      <button>{t('common:button.cancel')}</button>
    </div>
  );
}

export default Home;

// i18n/locales/en/home.json
{
  "title": "Home Page",
  "description": "Welcome to our application"
}

// i18n/locales/en/common.json
{
  "button": {
    "save": "Save",
    "cancel": "Cancel"
  }
}
*/

// Example 5: Lazy loading translations
/*
// i18n/index.js
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import Backend from 'i18next-http-backend';
import LanguageDetector from 'i18next-browser-languagedetector';

i18n
  .use(Backend)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    fallbackLng: 'en',
    debug: process.env.NODE_ENV === 'development',
    interpolation: {
      escapeValue: false
    },
    backend: {
      loadPath: '/locales/{{lng}}/{{ns}}.json'
    }
  });

export default i18n;

// components/LanguageLoader.jsx
import React, { Suspense } from 'react';
import { useTranslation } from 'react-i18next';

function LazyComponent() {
  const { t, ready } = useTranslation('lazy', { useSuspense: false });
  
  if (!ready) {
    return <div>Loading translations...</div>;
  }
  
  return <div>{t('lazy.message')}</div>;
}

function LanguageLoader() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <LazyComponent />
    </Suspense>
  );
}

export default LanguageLoader;
*/

// Example 6: Context-based language switching
/*
// context/LanguageContext.js
import React, { createContext, useContext, useState } from 'react';
import { useTranslation } from 'react-i18next';

const LanguageContext = createContext();

export function LanguageProvider({ children }) {
  const { i18n } = useTranslation();
  const [currentLanguage, setCurrentLanguage] = useState(i18n.language);
  
  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
    setCurrentLanguage(lng);
    localStorage.setItem('language', lng);
  };
  
  React.useEffect(() => {
    const savedLanguage = localStorage.getItem('language');
    if (savedLanguage && savedLanguage !== i18n.language) {
      changeLanguage(savedLanguage);
    }
  }, []);
  
  return (
    <LanguageContext.Provider value={{ currentLanguage, changeLanguage }}>
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
  const { currentLanguage, changeLanguage } = useLanguage();
  
  return (
    <div>
      <label>
        Language:
        <select 
          value={currentLanguage} 
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

// Example 7: Advanced formatting
/*
// components/AdvancedFormatting.jsx
import React from 'react';
import { useTranslation } from 'react-i18next';

function AdvancedFormatting({ user, items, price, date }) {
  const { t } = useTranslation();
  
  return (
    <div>
      <h2>{t('advanced.title')}</h2>
      <p>{t('advanced.user', { name: user.name, gender: user.gender })}</p>
      <p>{t('advanced.items', { count: items.length })}</p>
      <p>{t('advanced.price', { price })}</p>
      <p>{t('advanced.date', { date })}</p>
    </div>
  );
}

export default AdvancedFormatting;

// i18n/locales/en.json
{
  "advanced.title": "Advanced Formatting",
  "advanced.user_male": "Hello, Mr. {{name}}",
  "advanced.user_female": "Hello, Ms. {{name}}",
  "advanced.user_other": "Hello, {{name}}",
  "advanced.items_zero": "No items",
  "advanced.items_one": "One item",
  "advanced.items_other": "{{count}} items",
  "advanced.price": "Price: {{price, currency}}",
  "advanced.date": "Date: {{date, date, long}}"
}

// i18n/locales/es.json
{
  "advanced.title": "Formato Avanzado",
  "advanced.user_male": "Hola, Sr. {{name}}",
  "advanced.user_female": "Hola, Sra. {{name}}",
  "advanced.user_other": "Hola, {{name}}",
  "advanced.items_zero": "Sin artículos",
  "advanced.items_one": "Un artículo",
  "advanced.items_other": "{{count}} artículos",
  "advanced.price": "Precio: {{price, currency}}",
  "advanced.date": "Fecha: {{date, date, long}}"
}
*/

// Example 8: Testing internationalized components
/*
// __tests__/Button.test.jsx
import React from 'react';
import { render, screen } from '@testing-library/react';
import { I18nextProvider } from 'react-i18next';
import i18n from '../i18n';
import Button from '../Button';

const renderWithI18n = (component, options = {}) => {
  const { initialLanguage = 'en', resources = {} } = options;
  
  // Override i18n resources for testing
  if (resources.en) {
    i18n.addResourceBundle('en', 'translation', resources.en, true, true);
  }
  
  return render(
    <I18nextProvider i18n={i18n}>
      {component}
    </I18nextProvider>
  );
};

test('renders save button with correct text', () => {
  renderWithI18n(<Button type="save" />, {
    resources: {
      en: {
        'button.save': 'Save',
        'button.cancel': 'Cancel'
      }
    }
  });
  
  expect(screen.getByRole('button', { name: /save/i })).toBeInTheDocument();
});

test('renders cancel button with correct text', () => {
  renderWithI18n(<Button type="cancel" />, {
    resources: {
      en: {
        'button.save': 'Save',
        'button.cancel': 'Cancel'
      }
    }
  });
  
  expect(screen.getByRole('button', { name: /cancel/i })).toBeInTheDocument();
});
*/

// Example 9: Working with interpolation
/*
// components/InterpolationExample.jsx
import React from 'react';
import { useTranslation } from 'react-i18next';

function InterpolationExample({ user, product }) {
  const { t } = useTranslation();
  
  return (
    <div>
      <h2>{t('interpolation.title')}</h2>
      <p>
        {t('interpolation.welcome', { 
          name: user.name,
          count: user.purchases.length 
        })}
      </p>
      <p>
        {t('interpolation.product', { 
          product: product.name,
          price: product.price,
          currency: 'USD'
        })}
      </p>
      <p>
        {t('interpolation.html', { 
          link: '<a href="/terms">Terms and Conditions</a>' 
        })}
      </p>
    </div>
  );
}

export default InterpolationExample;

// i18n/locales/en.json
{
  "interpolation.title": "Interpolation Examples",
  "interpolation.welcome": "Hello {{name}}, you have made {{count}} purchases.",
  "interpolation.product": "{{product}} costs {{price, currency}}",
  "interpolation.html": "Please read our {{link}} carefully."
}
*/

// Example 10: Custom formatter functions
/*
// i18n/formatters.js
import { i18n } from 'i18next';

// Custom formatter for uppercase
i18n.services.formatter.add('uppercase', (value, lng, options) => {
  return value.toUpperCase();
});

// Custom formatter for currency with symbol
i18n.services.formatter.add('currencySymbol', (value, lng, options) => {
  const currency = options.currency || 'USD';
  const symbols = {
    USD: '$',
    EUR: '€',
    GBP: '£'
  };
  
  return `${symbols[currency] || currency}${value.toFixed(2)}`;
});

// components/CustomFormatter.jsx
import React from 'react';
import { useTranslation } from 'react-i18next';

function CustomFormatter({ amount }) {
  const { t } = useTranslation();
  
  return (
    <div>
      <p>{t('formatter.uppercase', { text: 'hello world' })}</p>
      <p>{t('formatter.currency', { amount, currency: 'USD' })}</p>
    </div>
  );
}

export default CustomFormatter;

// i18n/locales/en.json
{
  "formatter.uppercase": "{{text, uppercase}}",
  "formatter.currency": "Amount: {{amount, currencySymbol}}"
}
*/

export const reactI18nextExamples = {
  description: "Examples of using react-i18next for internationalization in React applications",
  installation: {
    core: "npm install react-i18next i18next",
    backend: "npm install i18next-http-backend",
    detector: "npm install i18next-browser-languagedetector"
  },
  hooks: [
    "useTranslation: Access to translation function and i18n instance",
    "useSSR: For server-side rendering",
    "withTranslation: HOC for class components"
  ],
  components: [
    "Trans: Component for translations with JSX",
    "I18nextProvider: Provider component for i18n instance",
    "I18nContext: Context for accessing i18n instance"
  ],
  features: [
    "Namespace support",
    "Pluralization",
    "Interpolation",
    "Lazy loading",
    "Custom formatters",
    "Language detection",
    "Fallback support"
  ]
};