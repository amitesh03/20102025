import React from 'react';

// Playwright Examples Component
// This component demonstrates various Playwright testing patterns and features

const PlaywrightExamples = () => {
  return (
    <div className="playwright-examples">
      <h1>Playwright Testing Framework Examples</h1>
      <p>Comprehensive examples of Playwright testing patterns and features</p>
      
      <div className="example-section">
        <h2>Basic Setup</h2>
        <p>Browser launching, page creation, and basic navigation</p>
      </div>
      
      <div className="example-section">
        <h2>Locators and Selectors</h2>
        <p>Element selection strategies and interaction patterns</p>
      </div>
      
      <div className="example-section">
        <h2>Assertions and Auto-Waiting</h2>
        <p>Web-first assertions with automatic waiting</p>
      </div>
      
      <div className="example-section">
        <h2>Network Interception</h2>
        <p>API mocking, request/response handling</p>
      </div>
      
      <div className="example-section">
        <h2>Advanced Features</h2>
        <p>Fixtures, parallel testing, and debugging</p>
      </div>
    </div>
  );
};

export default PlaywrightExamples;

/*
// BASIC SETUP EXAMPLES

// Example 1: Browser launching and page creation
const { chromium, firefox, webkit } = require('playwright');

(async () => {
  // Launch different browsers
  const chromeBrowser = await chromium.launch({ headless: false });
  const firefoxBrowser = await firefox.launch();
  const safariBrowser = await webkit.launch();

  // Create browser contexts (isolated sessions)
  const context = await chromeBrowser.newContext({
    viewport: { width: 1920, height: 1080 },
    userAgent: 'Custom User Agent',
    locale: 'en-US',
    permissions: ['geolocation', 'notifications'],
    ignoreHTTPSErrors: true
  });

  // Create pages
  const page = await context.newPage();
  await page.goto('https://example.com');

  // Take screenshot
  await page.screenshot({ path: 'example.png', fullPage: true });

  // Cleanup
  await context.close();
  await chromeBrowser.close();
})();

// Example 2: Basic page interactions
import { test, expect } from '@playwright/test';

test('basic navigation and interaction', async ({ page }) => {
  // Navigate to URL
  await page.goto('https://playwright.dev/');

  // Wait for element and click
  await page.getByRole('link', { name: 'Get started' }).click();
  
  // Wait for navigation
  await expect(page).toHaveURL(/.*intro/);

  // Fill form
  await page.getByLabel('Name').fill('John Doe');
  await page.getByLabel('Email').fill('john@example.com');
  
  // Select dropdown
  await page.selectOption('#country', 'USA');
  
  // Check checkbox
  await page.getByRole('checkbox', { name: 'Subscribe' }).check();
  
  // Submit form
  await page.getByRole('button', { name: 'Submit' }).click();
  
  // Verify success
  await expect(page.getByText('Form submitted successfully')).toBeVisible();
});

// Example 3: Multiple pages and tabs
test('working with multiple pages', async ({ browser }) => {
  const context = await browser.newContext();
  
  // First page
  const page1 = await context.newPage();
  await page1.goto('https://example.com/page1');
  
  // Second page
  const page2 = await context.newPage();
  await page2.goto('https://example.com/page2');
  
  // Switch between pages
  await page1.bringToFront();
  await expect(page1).toHaveTitle('Page 1');
  
  await page2.bringToFront();
  await expect(page2).toHaveTitle('Page 2');
  
  await context.close();
});


// LOCATORS AND SELECTORS EXAMPLES

// Example 1: Different locator strategies
test('locator strategies', async ({ page }) => {
  await page.goto('https://example.com');

  // Role-based locator (recommended for accessibility)
  await page.getByRole('button', { name: 'Submit' }).click();
  await page.getByRole('link', { name: 'Learn more' }).click();
  await page.getByRole('textbox', { name: 'Username' }).fill('testuser');

  // Text-based locators
  await page.getByText('Welcome to our site').click();
  await page.getByText(/welcome/i).click(); // Case insensitive regex
  
  // Test ID locator (best for testing)
  await page.getByTestId('submit-button').click();
  await page.getByTestId('user-profile').isVisible();

  // Label locator for form fields
  await page.getByLabel('Email address').fill('user@example.com');
  await page.getByLabel('Password', { exact: true }).fill('password123');

  // Placeholder locator
  await page.getByPlaceholder('Enter your name').fill('John Doe');
  await page.getByPlaceholder(/search/i).type('Playwright');

  // Alt text locator for images
  await page.getByAltText('Company logo').click();
  await page.getByAltText(/logo/i).isVisible();

  // Title locator
  await page.getByTitle('Tooltip information').hover();

  // CSS selector
  await page.locator('.btn-primary').click();
  await page.locator('#user-form').isVisible();

  // XPath selector
  await page.locator('//button[contains(text(), "Submit")]').click();
  await page.locator('//div[@class="card" and .//h2[text()="Product"]]').click();
});

// Example 2: Chaining and filtering locators
test('locator chaining and filtering', async ({ page }) => {
  await page.goto('https://example.com/products');

  // Chain locators
  const addToCartButton = page
    .getByRole('listitem')
    .filter({ hasText: 'Product 1' })
    .getByRole('button', { name: 'Add to cart' });
  
  await addToCartButton.click();

  // Filter by multiple conditions
  const activeItems = page
    .getByRole('listitem')
    .filter({ has: page.getByRole('checkbox', { checked: true }) })
    .filter({ hasNot: page.getByText('Archived') });

  // Get first/last/nth element
  const firstProduct = page.getByRole('listitem').first();
  const lastProduct = page.getByRole('listitem').last();
  const thirdProduct = page.getByRole('listitem').nth(2);

  // Working with multiple elements
  const allButtons = page.getByRole('button');
  const buttonCount = await allButtons.count();
  console.log(`Found ${buttonCount} buttons`);

  // Iterate through elements
  for (const button of await allButtons.all()) {
    const text = await button.textContent();
    console.log(`Button text: ${text}`);
  }

  // Map elements to values
  const productNames = await page
    .getByRole('listitem')
    .allInnerTexts();
  
  console.log('Product names:', productNames);
});

// Example 3: Working with forms and inputs
test('form interactions', async ({ page }) => {
  await page.goto('https://example.com/contact');

  // Text inputs
  await page.getByLabel('First Name').fill('John');
  await page.getByLabel('Last Name').fill('Doe');
  await page.getByLabel('Email').fill('john.doe@example.com');

  // Textarea
  await page.getByLabel('Message').fill('This is a test message');

  // Select dropdown
  await page.getByLabel('Country').selectOption('United States');
  await page.getByLabel('State').selectOption({ label: 'California' });

  // Multi-select
  await page.getByLabel('Interests').selectOption(['Technology', 'Sports', 'Music']);

  // Radio buttons
  await page.getByLabel('Male').check();
  await page.getByLabel('Newsletter').check();

  // Checkboxes
  await page.getByLabel('I agree to terms').check();
  await page.getByLabel('Send me updates').uncheck();

  // File upload
  await page.getByLabel('Upload file').setInputFiles('path/to/file.pdf');

  // Date input
  await page.getByLabel('Birth Date').fill('1990-01-01');

  // Range slider
  await page.getByLabel('Volume').fill('75');

  // Color picker
  await page.getByLabel('Theme Color').fill('#ff0000');

  // Submit form
  await page.getByRole('button', { name: 'Submit' }).click();
});


// ASSERTIONS AND AUTO-WAITING EXAMPLES

// Example 1: Basic assertions
test('basic assertions with auto-waiting', async ({ page }) => {
  await page.goto('https://example.com');

  // Element visibility assertions
  await expect(page.getByText('Welcome')).toBeVisible();
  await expect(page.getByText('Hidden content')).toBeHidden();
  await expect(page.locator('#modal')).not.toBeVisible();

  // Text content assertions
  await expect(page.getByTestId('status')).toHaveText('Success');
  await expect(page.getByTestId('message')).toContainText('completed');
  await expect(page.getByTestId('title')).toHaveText(/welcome/i); // Regex

  // Element state assertions
  await expect(page.getByRole('button')).toBeEnabled();
  await expect(page.getByRole('button', { name: 'Disabled' })).toBeDisabled();
  await expect(page.getByRole('checkbox')).toBeChecked();
  await expect(page.getByRole('textbox')).toBeEditable();
  await expect(page.getByRole('textbox')).toBeFocused();

  // Attribute assertions
  await expect(page.locator('#link')).toHaveAttribute('href', '/about');
  await expect(page.locator('#button')).toHaveClass(/btn-primary/);
  await expect(page.locator('#input')).toHaveValue('test value');
  await expect(page.locator('#select')).toHaveValue('option1');

  // Count assertions
  await expect(page.getByRole('listitem')).toHaveCount(5);
  await expect(page.locator('.error')).toHaveCount(0);
});

// Example 2: URL and navigation assertions
test('navigation assertions', async ({ page }) => {
  await page.goto('https://example.com');

  // Click navigation link
  await page.getByRole('link', { name: 'About' }).click();

  // URL assertions
  await expect(page).toHaveURL(/.*about/);
  await expect(page).toHaveURL('https://example.com/about');
  await expect(page).not.toHaveURL('/login');

  // Title assertions
  await expect(page).toHaveTitle('About Us');
  await expect(page).toHaveTitle(/about/i);
});

// Example 3: Advanced assertions and custom matchers
test('advanced assertions', async ({ page }) => {
  await page.goto('https://example.com/dashboard');

  // Soft assertions (don't stop test execution)
  await expect.soft(page.getByTestId('widget1')).toBeVisible();
  await expect.soft(page.getByTestId('widget2')).toBeVisible();
  await expect.soft(page.getByTestId('widget3')).toBeVisible();

  // Custom expect message
  await expect(page.getByText('Login'), 'User should see login button').toBeVisible();

  // Element position and size
  const element = page.getByTestId('card');
  await expect(element).toBeInViewport();
  await expect(element).toHaveCSS('color', 'rgb(255, 0, 0)');

  // Screenshot assertions
  await expect(page).toHaveScreenshot('dashboard.png');
  await expect(element).toHaveScreenshot('card.png');

  // Non-retrying assertions for synchronous checks
  expect(2 + 2).toBe(4);
  expect('hello world').toContain('hello');
  expect([1, 2, 3]).toHaveLength(3);
});


// NETWORK INTERCEPTION EXAMPLES

// Example 1: Mocking API responses
test('API mocking and interception', async ({ page }) => {
  // Mock GET request to users API
  await page.route('**/api/users', route => {
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify([
        { id: 1, name: 'John Doe', email: 'john@example.com' },
        { id: 2, name: 'Jane Smith', email: 'jane@example.com' }
      ])
    });
  });

  // Mock POST request
  await page.route('**/api/users', route => {
    const postData = route.request().postDataJSON();
    route.fulfill({
      status: 201,
      contentType: 'application/json',
      body: JSON.stringify({
        id: 3,
        ...postData,
        createdAt: new Date().toISOString()
      })
    });
  });

  // Mock error response
  await page.route('**/api/error', route => {
    route.fulfill({
      status: 500,
      contentType: 'application/json',
      body: JSON.stringify({ error: 'Internal Server Error' })
    });
  });

  await page.goto('https://example.com/users');

  // Verify mocked data is displayed
  await expect(page.getByText('John Doe')).toBeVisible();
  await expect(page.getByText('Jane Smith')).toBeVisible();

  // Create new user
  await page.getByLabel('Name').fill('New User');
  await page.getByLabel('Email').fill('newuser@example.com');
  await page.getByRole('button', { name: 'Create' }).click();

  // Verify new user appears
  await expect(page.getByText('New User')).toBeVisible();
});

// Example 2: Request and response modification
test('modify requests and responses', async ({ page }) => {
  // Modify request headers
  await page.route('**/api/data', route => {
    const headers = route.request().headers();
    route.continue({
      headers: {
        ...headers,
        'Authorization': 'Bearer token123',
        'X-Custom-Header': 'test-value'
      }
    });
  });

  // Modify request body
  await page.route('**/api/submit', route => {
    const postData = route.request().postDataJSON();
    route.continue({
      postData: JSON.stringify({
        ...postData,
        timestamp: Date.now(),
        deviceId: 'test-device'
      })
    });
  });

  // Modify response
  await page.route('**/api/profile', async route => {
    const response = await route.fetch();
    const json = await response.json();
    
    route.fulfill({
      response,
      body: JSON.stringify({
        ...json,
        lastLogin: new Date().toISOString(),
        status: 'active'
      })
    });
  });

  await page.goto('https://example.com/profile');
  await expect(page.getByText('Last login:')).toBeVisible();
});

// Example 3: Network monitoring and debugging
test('network monitoring', async ({ page }) => {
  const requests = [];
  const responses = [];

  // Monitor all requests
  page.on('request', request => {
    requests.push({
      url: request.url(),
      method: request.method(),
      headers: request.headers(),
      postData: request.postData()
    });
  });

  // Monitor all responses
  page.on('response', response => {
    responses.push({
      url: response.url(),
      status: response.status(),
      headers: response.headers()
    });
  });

  // Wait for specific request
  const apiCall = page.waitForRequest('**/api/critical-data');
  
  await page.goto('https://example.com');
  await page.getByRole('button', { name: 'Load Data' }).click();
  
  const request = await apiCall;
  console.log('Critical API request:', request.url());

  // Verify network activity
  expect(requests.length).toBeGreaterThan(0);
  expect(responses.some(r => r.status === 200)).toBeTruthy();
});


// API TESTING EXAMPLES

// Example 1: Direct API testing
test('API request context', async ({ request }) => {
  // GET request
  const getResponse = await request.get('https://api.github.com/users/microsoft');
  expect(getResponse.ok()).toBeTruthy();
  expect(getResponse.status()).toBe(200);
  
  const userData = await getResponse.json();
  expect(userData.name).toBe('Microsoft');
  expect(userData.public_repos).toBeGreaterThan(0);

  // POST request with headers and body
  const postResponse = await request.post('https://api.example.com/users', {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer token123'
    },
    data: {
      name: 'John Doe',
      email: 'john@example.com',
      role: 'user'
    }
  });
  expect(postResponse.ok()).toBeTruthy();
  expect(postResponse.status()).toBe(201);
  
  const newUser = await postResponse.json();
  expect(newUser.id).toBeDefined();
  expect(newUser.name).toBe('John Doe');

  // PUT request
  await request.put(`https://api.example.com/users/${newUser.id}`, {
    data: { name: 'John Updated', role: 'admin' }
  });

  // DELETE request
  const deleteResponse = await request.delete(`https://api.example.com/users/${newUser.id}`);
  expect(deleteResponse.status()).toBe(204);

  // API assertions
  await expect(getResponse).toBeOK();
  await expect(postResponse).toBeOK();
});

// Example 2: API testing with browser context
test('API with browser context cookies', async ({ page }) => {
  // Login through UI to get cookies
  await page.goto('https://example.com/login');
  await page.getByLabel('Username').fill('testuser');
  await page.getByLabel('Password').fill('password');
  await page.getByRole('button', { name: 'Login' }).click();
  await expect(page).toHaveURL(/dashboard/);

  // API request will use browser cookies
  const response = await page.request.get('https://api.example.com/profile');
  expect(response.ok()).toBeTruthy();
  
  const profile = await response.json();
  expect(profile.username).toBe('testuser');
  expect(profile.isAuthenticated).toBe(true);
});


// MOBILE EMULATION EXAMPLES

// Example 1: Device emulation
import { test, expect, devices } from '@playwright/test';

test('mobile device emulation', async ({ browser }) => {
  // Emulate iPhone 13
  const iphone13 = devices['iPhone 13'];
  const context = await browser.newContext({
    ...iphone13,
    locale: 'en-US',
    geolocation: { longitude: -122.4194, latitude: 37.7749 },
    permissions: ['geolocation']
  });

  const page = await context.newPage();
  await page.goto('https://maps.google.com');

  // Mobile-specific interactions
  await page.getByText('Your location').tap();
  await expect(page.getByText('Current location')).toBeVisible();

  // Take mobile screenshot
  await page.screenshot({ path: 'mobile-view.png', fullPage: true });

  await context.close();
});

// Example 2: Custom viewport and touch
test('custom mobile viewport', async ({ browser }) => {
  const context = await browser.newContext({
    viewport: { width: 375, height: 667 },
    deviceScaleFactor: 2,
    isMobile: true,
    hasTouch: true,
    userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X)'
  });

  const page = await context.newPage();
  await page.goto('https://example.com/mobile-app');

  // Touch interactions
  await page.locator('.menu-button').tap();
  await page.locator('.carousel-item').swipe('left');
  await page.locator('.pinch-area').pinch({ scaleFactor: 1.5 });

  // Multi-touch
  await page.locator('.map').tap({ position: { x: 100, y: 200 } });
  await page.locator('.map').tap({ position: { x: 300, y: 400 } });

  await context.close();
});


// FIXTURES AND TEST ISOLATION EXAMPLES

// Example 1: Page Object Model with fixtures
// fixtures.ts
import { test as base, expect } from '@playwright/test';

class LoginPage {
  constructor(page) {
    this.page = page;
  }

  async goto() {
    await this.page.goto('https://example.com/login');
  }

  async getUsernameField() {
    return this.page.getByLabel('Username');
  }

  async getPasswordField() {
    return this.page.getByLabel('Password');
  }

  async getSubmitButton() {
    return this.page.getByRole('button', { name: 'Login' });
  }

  async login(username, password) {
    await this.getUsernameField().fill(username);
    await this.getPasswordField().fill(password);
    await this.getSubmitButton().click();
  }

  async getErrorMessage() {
    return this.page.getByText('Invalid credentials');
  }
}

// Extend base test with custom fixture
export const testWithLogin = base.extend<{ loginPage: LoginPage }>({
  loginPage: async ({ page }, use) => {
    const loginPage = new LoginPage(page);
    await use(loginPage);
  }
});

// Usage in tests
test('login with page object fixture', async ({ loginPage }) => {
  await loginPage.goto();
  await loginPage.login('user@example.com', 'password');
  
  // Verify login success
  await expect(loginPage.page).toHaveURL(/dashboard/);
});

test('login error handling', async ({ loginPage }) => {
  await loginPage.goto();
  await loginPage.login('invalid@example.com', 'wrongpassword');
  
  // Verify error message
  await expect(loginPage.getErrorMessage()).toBeVisible();
});

// Example 2: Worker-scoped fixtures for shared resources
export const testWithDB = base.extend({}, { db: Database }, {
  db: [async ({}, use) => {
    const db = await connectDatabase();
    await db.seedTestData();
    await use(db);
    await db.cleanup();
  }, { scope: 'worker' }]
});

testWithDB('uses shared database', async ({ page, db }) => {
  const users = await db.getUsers();
  expect(users.length).toBeGreaterThan(0);
  
  await page.goto('https://example.com/users');
  
  // Verify all users from database are displayed
  for (const user of users) {
    await expect(page.getByText(user.name)).toBeVisible();
  }
});


// VISUAL TESTING EXAMPLES

// Example 1: Screenshot comparison
test('visual regression testing', async ({ page }) => {
  await page.goto('https://example.com');

  // Full page screenshot comparison
  await expect(page).toHaveScreenshot('homepage.png', {
    fullPage: true,
    maxDiffPixels: 100,
    animations: 'disabled'
  });

  // Element screenshot comparison
  const header = page.locator('header');
  await expect(header).toHaveScreenshot('header.png', {
    maxDiffPixelRatio: 0.1
  });

  // Mask dynamic content before comparison
  await expect(page).toHaveScreenshot('page-with-mask.png', {
    mask: [
      page.locator('.timestamp'),
      page.locator('.ad-banner'),
      page.locator('.random-quote')
    ],
    animations: 'disabled'
  });
});

// Example 2: Custom screenshot options
test('custom screenshot options', async ({ page }) => {
  await page.goto('https://example.com');

  // Screenshot specific area
  const card = page.locator('.product-card').first();
  await card.screenshot({
    path: 'product-card.png',
    style: 'border: 2px solid red'
  });

  // Screenshot with custom clip
  await page.screenshot({
    path: 'custom-area.png',
    clip: {
      x: 100,
      y: 200,
      width: 400,
      height: 300
    }
  });

  // Screenshot with transparent background
  await page.screenshot({
    path: 'transparent-bg.png',
    omitBackground: true
  });
});


// DEBUGGING AND TRACING EXAMPLES

// Example 1: Using trace viewer
test('debugging with traces', async ({ page }) => {
  // Add custom annotations
  await test.info().annotations.push({
    type: 'point',
    x: 100,
    y: 100,
    description: 'Starting test execution'
  });

  await page.goto('https://example.com');
  
  // Attach data to trace
  await test.info().attach('test-data', {
    body: JSON.stringify({ userId: 123, sessionId: 'abc123' }),
    contentType: 'application/json'
  });

  // Pause for debugging (use with --headed mode)
  await page.pause();

  await page.getByRole('button', { name: 'Submit' }).click();
  
  // Add step annotation
  await test.info().annotations.push({
    type: 'point',
    description: 'Form submitted successfully'
  });
});

// Example 2: Console and error monitoring
test('monitoring console and errors', async ({ page }) => {
  const consoleMessages = [];
  const errors = [];

  // Monitor console messages
  page.on('console', msg => {
    consoleMessages.push({
      type: msg.type(),
      text: msg.text(),
      location: msg.location()
    });
  });

  // Monitor page errors
  page.on('pageerror', error => {
    errors.push({
      message: error.message,
      stack: error.stack
    });
  });

  await page.goto('https://example.com');
  await page.getByRole('button', { name: 'Trigger Error' }).click();

  // Assert no JavaScript errors
  expect(errors.length).toBe(0);

  // Assert specific console messages
  expect(consoleMessages.some(msg => msg.text.includes('Application started'))).toBeTruthy();
});


// PARALLEL TESTING EXAMPLES

// Example 1: Parallel test execution
test.describe.configure({ mode: 'parallel' });

test.describe('parallel tests', () => {
  test('parallel test 1', async ({ page }) => {
    await page.goto('https://example.com/test1');
    await expect(page.getByText('Test 1 Content')).toBeVisible();
  });

  test('parallel test 2', async ({ page }) => {
    await page.goto('https://example.com/test2');
    await expect(page.getByText('Test 2 Content')).toBeVisible();
  });

  test('parallel test 3', async ({ page }) => {
    await page.goto('https://example.com/test3');
    await expect(page.getByText('Test 3 Content')).toBeVisible();
  });
});

// Example 2: Serial execution for dependent tests
test.describe.configure({ mode: 'serial' });

test.describe('serial tests', () => {
  test('step 1: setup data', async ({ page }) => {
    await page.goto('https://example.com/setup');
    await page.getByRole('button', { name: 'Initialize' }).click();
    await expect(page.getByText('Setup complete')).toBeVisible();
  });

  test('step 2: use setup data', async ({ page }) => {
    await page.goto('https://example.com/use-data');
    await expect(page.getByText('Data available')).toBeVisible();
  });

  test('step 3: cleanup', async ({ page }) => {
    await page.goto('https://example.com/cleanup');
    await page.getByRole('button', { name: 'Clean up' }).click();
    await expect(page.getByText('Cleanup complete')).toBeVisible();
  });
});


// CONFIGURATION EXAMPLES

// Example 1: Complete playwright.config.ts
import { defineConfig, devices } from '@playwright/test';

const config = defineConfig({
  // Test directory and files
  testDir: './tests',
  testMatch: '**/*.spec.ts',
  testIgnore: '**/node_modules/**',
  
  // Global settings
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 2 : undefined,
  
  // Timeout settings
  timeout: 30000,
  expect: { timeout: 5000 },
  
  // Reporter configuration
  reporter: [
    ['html', { open: 'never' }],
    ['json', { outputFile: 'test-results.json' }],
    ['junit', { outputFile: 'junit.xml' }],
    ['line']
  ],
  
  // Global test options
  use: {
    baseURL: 'http://localhost:3000',
    headless: true,
    viewport: { width: 1280, height: 720 },
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    
    // Context options
    locale: 'en-US',
    timezoneId: 'America/New_York',
    permissions: ['geolocation'],
    geolocation: { longitude: -122.4194, latitude: 37.7749 },
    
    // Network options
    ignoreHTTPSErrors: true,
    offline: false
  },
  
  // Browser projects
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
    {
      name: 'Mobile Chrome',
      use: { ...devices['Pixel 5'] },
    },
    {
      name: 'Mobile Safari',
      use: { ...devices['iPhone 13'] },
    }
  ],
  
  // Development server
  webServer: {
    command: 'npm run start',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
    timeout: 120000,
  },
};

export default config;


// AUTHENTICATION EXAMPLES

// Example 1: Authentication setup and reuse
// auth.setup.ts
import { test as setup, expect } from '@playwright/test';
import path from 'path';

const authFile = path.join(__dirname, '../playwright/.auth/user.json');

setup('authenticate', async ({ page }) => {
  // Navigate to login page
  await page.goto('https://github.com/login');

  // Perform login
  await page.getByLabel('Username or email address').fill('username');
  await page.getByLabel('Password').fill('password');
  await page.getByRole('button', { name: 'Sign in' }).click();

  // Wait for authentication to complete
  await page.waitForURL('https://github.com/');
  await expect(page.getByRole('button', { name: 'View profile' })).toBeVisible();

  // Save authentication state
  await page.context().storageState({ path: authFile });
});

// Usage in authenticated tests
test('access protected page', async ({ page }) => {
  // This test will start with saved authentication state
  await page.goto('https://github.com/settings');
  await expect(page.getByRole('heading', { name: 'Settings' })).toBeVisible();
});

// Example 2: Multiple authentication states
export const test = base.extend<{ 
  adminAuth: { page: Page },
  userAuth: { page: Page }
}>({
  adminAuth: [async ({ browser }, use) => {
    const context = await browser.newContext({
      storageState: 'playwright/.auth/admin.json'
    });
    const page = await context.newPage();
    await use({ page });
    await context.close();
  }, { scope: 'test' }],
  
  userAuth: [async ({ browser }, use) => {
    const context = await browser.newContext({
      storageState: 'playwright/.auth/user.json'
    });
    const page = await context.newPage();
    await use({ page });
    await context.close();
  }, { scope: 'test' }]
});

test('admin can access admin panel', async ({ adminAuth }) => {
  await adminAuth.page.goto('https://example.com/admin');
  await expect(adminAuth.page.getByText('Admin Panel')).toBeVisible();
});

test('user cannot access admin panel', async ({ userAuth }) => {
  await userAuth.page.goto('https://example.com/admin');
  await expect(userAuth.page.getByText('Access Denied')).toBeVisible();
});
*/