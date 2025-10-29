import React, { useState } from 'react';

// Cypress Examples - Educational Examples for Cypress
// Note: Cypress is a next-generation front-end testing tool that enables all developers to write all of their tests

export default function CypressExamples() {
  const [activeExample, setActiveExample] = useState('basics');

  return (
    <div className="examples-container">
      <h1>Cypress Examples</h1>
      <p className="intro">
        Cypress is a next-generation front-end testing tool that enables all developers to write all of their tests. It provides a complete end-to-end testing experience with features like time travel, debugging, and automatic waiting.
      </p>
      
      <div className="example-nav">
        <button onClick={() => setActiveExample('basics')} className={activeExample === 'basics' ? 'active' : ''}>
          Basics
        </button>
        <button onClick={() => setActiveExample('selectors')} className={activeExample === 'selectors' ? 'active' : ''}>
          Selectors
        </button>
        <button onClick={() => setActiveExample('interactions')} className={activeExample === 'interactions' ? 'active' : ''}>
          Interactions
        </button>
        <button onClick={() => setActiveExample('assertions')} className={activeExample === 'assertions' ? 'active' : ''}>
          Assertions
        </button>
        <button onClick={() => setActiveExample('network')} className={activeExample === 'network' ? 'active' : ''}>
          Network
        </button>
        <button onClick={() => setActiveExample('custom')} className={activeExample === 'custom' ? 'active' : ''}>
          Custom Commands
        </button>
      </div>

      <div className="example-content">
        {activeExample === 'basics' && <BasicsExample />}
        {activeExample === 'selectors' && <SelectorsExample />}
        {activeExample === 'interactions' && <InteractionsExample />}
        {activeExample === 'assertions' && <AssertionsExample />}
        {activeExample === 'network' && <NetworkExample />}
        {activeExample === 'custom' && <CustomCommandsExample />}
      </div>
    </div>
  );
}

// Basics Example
function BasicsExample() {
  return (
    <div className="example-section">
      <h2>Cypress Basics</h2>
      <p>Getting started with Cypress testing.</p>
      
      <div className="code-block">
        <h3>Installation</h3>
        <pre>
{`# Install Cypress
npm install cypress --save-dev

# Open Cypress
npx cypress open

# Run Cypress tests
npx cypress run

# Run specific test file
npx cypress run --spec "cypress/e2e/login.cy.js"`}
        </pre>
      </div>

      <div className="code-block">
        <h3>Basic Test Structure</h3>
        <pre>
{`// cypress/e2e/basic.cy.js
describe('My First Test', () => {
  it('Visits the Kitchen Sink', () => {
    cy.visit('https://example.cypress.io')
    cy.contains('type').click()
    
    // Should be on a new URL which includes '/commands/actions'
    cy.url().should('include', '/commands/actions')
    
    // Get an input, type into it and verify that the value has been updated
    cy.get('.action-email')
      .type('fake@email.com')
      .should('have.value', 'fake@email.com')
  })
  
  it('Finds an element', () => {
    cy.visit('https://example.cypress.io')
    
    // Find element with CSS selector
    cy.get('.container')
    
    // Find element by text content
    cy.contains('Kitchen Sink')
    
    // Find element with data attribute
    cy.get('[data-cy="submit"]')
  })
  
  it('Makes assertions', () => {
    cy.visit('https://example.cypress.io')
    
    // Implicit assertion
    cy.get('h1').should('contain', 'Kitchen Sink')
    
    // Explicit assertion
    expect(true).to.be.true
    
    // Chain multiple assertions
    cy.get('button')
      .should('be.visible')
      .and('have.class', 'btn-primary')
      .and('be.enabled')
  })
})`}
        </pre>
      </div>

      <div className="code-block">
        <h3>Test Organization</h3>
        <pre>
{`// cypress/e2e/user-management.cy.js
describe('User Management', () => {
  beforeEach(() => {
    // Run before each test
    cy.visit('/users')
    cy.login('admin@example.com', 'password123')
  })
  
  afterEach(() => {
    // Run after each test
    cy.logout()
  })
  
  context('When logged in as admin', () => {
    it('Can view all users', () => {
      cy.get('[data-cy="user-list"]').should('be.visible')
      cy.get('[data-cy="user-item"]').should('have.length.greaterThan', 0)
    })
    
    it('Can create a new user', () => {
      cy.get('[data-cy="add-user-btn"]').click()
      cy.get('[data-cy="user-name"]').type('John Doe')
      cy.get('[data-cy="user-email"]').type('john@example.com')
      cy.get('[data-cy="save-user"]').click()
      
      cy.get('[data-cy="success-message"]').should('contain', 'User created successfully')
    })
  })
  
  context('When logged in as regular user', () => {
    beforeEach(() => {
      cy.login('user@example.com', 'password123')
    })
    
    it('Cannot view admin features', () => {
      cy.get('[data-cy="admin-panel"]').should('not.exist')
    })
  })
})`}
        </pre>
      </div>
    </div>
  );
}

// Selectors Example
function SelectorsExample() {
  return (
    <div className="example-section">
      <h2>Selectors in Cypress</h2>
      <p>Different ways to select elements in Cypress.</p>
      
      <div className="code-block">
        <h3>CSS Selectors</h3>
        <pre>
{`// Basic CSS selectors
cy.get('button')                    // Tag selector
cy.get('.btn')                      // Class selector
cy.get('#submit')                    // ID selector
cy.get('[data-cy="submit"]')         // Attribute selector
cy.get('input[type="text"]')          // Attribute with value
cy.get('.btn.primary')               // Multiple classes

// CSS pseudo-selectors
cy.get(':focus')                     // Focused element
cy.get(':disabled')                   // Disabled elements
cy.get(':checked')                    // Checked elements
cy.get(':first-child')                // First child
cy.get(':nth-child(2)')              // Nth child

// CSS combinators
cy.get('form > input')               // Direct child
cy.get('form input')                 // Descendant
cy.get('label + input')              // Adjacent sibling
cy.get('label ~ input')              // General sibling`}
        </pre>
      </div>

      <div className="code-block">
        <h3>Content-based Selectors</h3>
        <pre>
{`// Find by text content
cy.contains('Submit')                 // Exact match
cy.contains('submit', { matchCase: false })  // Case insensitive
cy.contains(/submit/i)               // Regex match

// Find within element
cy.get('.form').contains('Submit')    // Find within form
cy.get('.nav').contains('Home')      // Find within navigation

// Find multiple elements
cy.contains('button', 'Submit')       // Button with text
cy.contains('a', 'Home')            // Link with text

// Find with partial text
cy.contains('Submi')                 // Partial match
cy.contains('mit', { matchCase: false })  // Case insensitive partial`}
        </pre>
      </div>

      <div className="code-block">
        <h3>Testing Library Selectors</h3>
        <pre>
{`// Install Testing Library for Cypress
npm install @testing-library/cypress --save-dev

// Import in support file
// cypress/support/commands.js
import '@testing-library/cypress/add-commands'

// Use in tests
cy.findByRole('button', { name: /submit/i }).click()
cy.findByLabelText('Email address').type('user@example.com')
cy.findByPlaceholderText('Enter your name').type('John Doe')
cy.findByAltText('Company logo').should('be.visible')
cy.findByTitle('Information').click()

// Find multiple elements
cy.findAllByRole('listitem').should('have.length', 5)
cy.findAllByText('Item').should('have.length', 3)

// Within an element
cy.get('.form').within(() => {
  cy.findByLabelText('Email').type('user@example.com')
  cy.findByLabelText('Password').type('password123')
  cy.findByRole('button', { name: 'Submit' }).click()
})`}
        </pre>
      </div>

      <div className="code-block">
        <h3>Best Practices for Selectors</h3>
        <pre>
{`// Use data-* attributes for testing
// HTML
<button data-cy="submit-btn" class="btn btn-primary">Submit</button>

// Test
cy.get('[data-cy="submit-btn"]').click()

// Avoid brittle selectors
// Bad - depends on CSS classes that might change
cy.get('.btn.btn-primary.btn-lg.mt-4').click()

// Bad - depends on DOM structure
cy.get('div > div > button').click()

// Good - uses test-specific attribute
cy.get('[data-cy="submit"]').click()

// Good - uses accessible attributes
cy.get('button[aria-label="Submit"]').click()

// Good - uses semantic HTML
cy.get('main form button[type="submit"]').click()`}
        </pre>
      </div>
    </div>
  );
}

// Interactions Example
function InteractionsExample() {
  return (
    <div className="example-section">
      <h2>Interactions in Cypress</h2>
      <p>Simulating user interactions with elements.</p>
      
      <div className="code-block">
        <h3>Clicking</h3>
        <pre>
{`// Basic click
cy.get('button').click()

// Click with options
cy.get('button').click({ force: true })  // Force click even if covered
cy.get('button').click({ multiple: true })  // Click multiple elements

// Double click
cy.get('button').dblclick()

// Right click
cy.get('button').rightclick()

// Click at specific position
cy.get('button').click(10, 10)  // Click at coordinates (x, y)
cy.get('button').click('topLeft')  // Click at position
cy.get('button').click('bottomRight')

// Click with modifier keys
cy.get('button').click({ shiftKey: true })
cy.get('button').click({ ctrlKey: true })
cy.get('button').click({ metaKey: true })  // Cmd on Mac, Ctrl on Windows`}
        </pre>
      </div>

      <div className="code-block">
        <h3>Typing</h3>
        <pre>
{`// Basic typing
cy.get('input').type('Hello World')

// Type with special characters
cy.get('input').type('Hello{enter}World')
cy.get('input').type('Hello{del}World')
cy.get('input').type('Hello{selectall}World')

// Type with options
cy.get('input').type('Hello World', { delay: 100 })  // Delay between keystrokes
cy.get('input').type('Hello World', { force: true })  // Force typing

// Clear and type
cy.get('input').clear().type('New text')

// Append text
cy.get('input').type('{moveToEnd} appended')

// Type special keys
cy.get('input').type('{backspace}')
cy.get('input').type('{uparrow}')
cy.get('input').type('{downarrow}')
cy.get('input').type('{leftarrow}')
cy.get('input').type('{rightarrow}')`}
        </pre>
      </div>

      <div className="code-block">
        <h3>Form Interactions</h3>
        <pre>
{`// Check/uncheck checkboxes
cy.get('[type="checkbox"]').check()
cy.get('[type="checkbox"]').uncheck()
cy.get('[type="checkbox"]').check({ force: true })

// Select radio buttons
cy.get('[type="radio"]').check('option1')
cy.get('[type="radio"]').check('option2', { force: true })

// Select dropdown options
cy.get('select').select('option1')
cy.get('select').select(['option1', 'option2'])  // Multiple select
cy.get('select').select(1)  // Select by index

// File upload
cy.get('input[type="file"]').selectFile('path/to/file.jpg')
cy.get('input[type="file"]').selectFile(['file1.jpg', 'file2.png'])

// Submit form
cy.get('form').submit()
cy.get('[type="submit"]').click()`}
        </pre>
      </div>

      <div className="code-block">
        <h3>Mouse and Keyboard Events</h3>
        <pre>
{`// Mouse events
cy.get('button').mouseover()
cy.get('button').mouseout()
cy.get('button').mousedown()
cy.get('button').mouseup()

// Drag and drop
cy.get('#draggable').drag('#droppable')

// Scroll
cy.get('.container').scrollTo('bottom')
cy.get('.container').scrollTo('top')
cy.get('.container').scrollTo('center')
cy.get('.container').scrollTo(0, 100)  // Scroll to coordinates

// Keyboard events
cy.get('input').type('{alt}')
cy.get('input').type('{shift}')
cy.get('input').type('{ctrl}')
cy.get('input').type('{meta}')  // Cmd on Mac, Ctrl on Windows

// Focus and blur
cy.get('input').focus()
cy.get('input').blur()

// Hover
cy.get('button').trigger('mouseover')
cy.get('button').trigger('mouseenter')
cy.get('button').trigger('mouseleave')`}
        </pre>
      </div>
    </div>
  );
}

// Assertions Example
function AssertionsExample() {
  return (
    <div className="example-section">
      <h2>Assertions in Cypress</h2>
      <p>Verifying element states and values.</p>
      
      <div className="code-block">
        <h3>Implicit Assertions</h3>
        <pre>
{`// Most commands have built-in assertions
cy.get('button')  // Asserts element exists
cy.get('button').click()  // Asserts element is visible and clickable
cy.get('input').type('text')  // Asserts element is typeable

// Should assertions
cy.get('button').should('be.visible')
cy.get('button').should('have.class', 'active')
cy.get('button').should('have.text', 'Submit')
cy.get('button').should('have.attr', 'disabled')
cy.get('button').should('have.css', 'color', 'rgb(255, 0, 0)')

// And assertions (chaining)
cy.get('button')
  .should('be.visible')
  .and('have.class', 'active')
  .and('have.text', 'Submit')
  .and('not.have.attr', 'disabled')

// Negative assertions
cy.get('button').should('not.be.disabled')
cy.get('button').should('not.have.class', 'hidden')
cy.get('button').should('not.contain', 'Cancel')`}
        </pre>
      </div>

      <div className="code-block">
        <h3>Explicit Assertions</h3>
        <pre>
{`// Using expect
expect(true).to.be.true
expect(false).to.be.false
expect('Hello').to.equal('Hello')
expect('Hello').to.not.equal('World')
expect(5).to.be.greaterThan(3)
expect(5).to.be.lessThan(10)
expect([1, 2, 3]).to.include(2)
expect([1, 2, 3]).to.have.length(3)

// Using assert
assert.isOk(true, 'true is ok')
assert.isNotOk(false, 'false is not ok')
assert.equal(5, 5, '5 equals 5')
assert.notEqual(5, 3, '5 does not equal 3')
assert.deepEqual({a: 1}, {a: 1}, 'objects are equal')
assert.notDeepEqual({a: 1}, {a: 2}, 'objects are not equal')

// Custom assertions
expect(element).to.have.attr('data-cy')
expect(element).to.have.descendants('button')
expect(element).to.have.css('display', 'block')`}
        </pre>
      </div>

      <div className="code-block">
        <h3>Value Assertions</h3>
        <pre>
{`// Text content
cy.get('h1').should('have.text', 'Page Title')
cy.get('h1').should('contain', 'Page')
cy.get('h1').should('not.contain', 'Home')

// Input values
cy.get('input').should('have.value', 'Default value')
cy.get('input').should('have.value', '')  // Empty input
cy.get('textarea').should('have.value', 'Multi-line text')

// Attributes
cy.get('button').should('have.attr', 'type', 'submit')
cy.get('button').should('have.attr', 'disabled')
cy.get('button').should('not.have.attr', 'disabled')

// CSS properties
cy.get('button').should('have.css', 'color', 'rgb(255, 255, 255)')
cy.get('button').should('have.css', 'background-color', 'rgb(0, 123, 255)')
cy.get('button').should('have.css', 'font-size', '16px')

// Classes
cy.get('button').should('have.class', 'btn')
cy.get('button').should('have.class', 'btn-primary')
cy.get('button').should('not.have.class', 'disabled')`}
        </pre>
      </div>

      <div className="code-block">
        <h3>State Assertions</h3>
        <pre>
{`// Visibility
cy.get('button').should('be.visible')
cy.get('button').should('not.be.visible')
cy.get('button').should('be.hidden')
cy.get('button').should('exist')
cy.get('button').should('not.exist')

// Focus
cy.get('input').should('be.focused')
cy.get('input').should('not.be.focused')

// Enabled/disabled
cy.get('button').should('be.enabled')
cy.get('button').should('be.disabled')
cy.get('button').should('not.be.disabled')

// Checked/unchecked
cy.get('[type="checkbox"]').should('be.checked')
cy.get('[type="checkbox"]').should('not.be.checked')
cy.get('[type="radio"]').should('be.checked')

// Selected
cy.get('option').should('be.selected')
cy.get('option').should('not.be.selected')`}
        </pre>
      </div>
    </div>
  );
}

// Network Example
function NetworkExample() {
  return (
    <div className="example-section">
      <h2>Network Requests in Cypress</h2>
      <p>Controlling and monitoring network traffic.</p>
      
      <div className="code-block">
        <h3>Stubbing Network Requests</h3>
        <pre>
{`// Intercept and stub requests
cy.intercept('GET', '/api/users', { fixture: 'users.json' })
cy.intercept('POST', '/api/login', { body: { success: true } })
cy.intercept('DELETE', '/api/users/*', { statusCode: 204 })

// Intercept with dynamic response
cy.intercept('GET', '/api/users', (req) => {
  req.reply((res) => {
    res.send({ users: [] })
  })
})

// Intercept with delay
cy.intercept('GET', '/api/users', (req) => {
  req.reply({ body: [], delay: 1000 })
})

// Intercept with different responses based on request
cy.intercept('POST', '/api/login', (req) => {
  if (req.body.username === 'admin' && req.body.password === 'password') {
    req.reply({ statusCode: 200, body: { token: 'abc123' } })
  } else {
    req.reply({ statusCode: 401, body: { error: 'Invalid credentials' } })
  })
})`}
        </pre>
      </div>

      <div className="code-block">
        <h3>Waiting for Requests</h3>
        <pre>
{`// Wait for specific request
cy.intercept('GET', '/api/users').as('getUsers')
cy.visit('/users')
cy.wait('@getUsers')

// Wait for request and get response
cy.intercept('GET', '/api/users').as('getUsers')
cy.visit('/users')
cy.wait('@getUsers').then((interception) => {
  console.log(interception.response.body)
})

// Wait for multiple requests
cy.intercept('GET', '/api/users').as('getUsers')
cy.intercept('GET', '/api/posts').as('getPosts')
cy.visit('/dashboard')
cy.wait(['@getUsers', '@getPosts'])

// Wait with timeout
cy.wait('@getUsers', { timeout: 10000 })`}
        </pre>
      </div>

      <div className="code-block">
        <h3>Making Requests</h3>
        <pre>
{`// Make GET request
cy.request('/api/users').then((response) => {
  expect(response.status).to.eq(200)
  expect(response.body).to.have.property('users')
})

// Make POST request
cy.request({
  method: 'POST',
  url: '/api/users',
  body: { name: 'John', email: 'john@example.com' }
}).then((response) => {
  expect(response.status).to.eq(201)
})

// Make request with headers
cy.request({
  method: 'GET',
  url: '/api/protected',
  headers: {
    'Authorization': 'Bearer token123'
  }
})

// Make request with options
cy.request({
  method: 'GET',
  url: '/api/data',
  qs: { page: 1, limit: 10 },  // Query parameters
  followRedirect: false,  // Don't follow redirects
  timeout: 5000  // Custom timeout
})`}
        </pre>
      </div>

      <div className="code-block">
        <h3>Network Testing Examples</h3>
        <pre>
{`// Test loading states
cy.intercept('GET', '/api/users', { delay: 2000 }).as('getUsers')
cy.visit('/users')
cy.get('[data-cy="loading"]').should('be.visible')
cy.wait('@getUsers')
cy.get('[data-cy="loading"]').should('not.be.visible')
cy.get('[data-cy="user-list"]').should('be.visible')

// Test error states
cy.intercept('GET', '/api/users', { statusCode: 500 }).as('getUsers')
cy.visit('/users')
cy.wait('@getUsers')
cy.get('[data-cy="error-message"]').should('be.visible')
cy.get('[data-cy="error-message"]').should('contain', 'Failed to load users')

// Test empty states
cy.intercept('GET', '/api/users', { body: [] }).as('getUsers')
cy.visit('/users')
cy.wait('@getUsers')
cy.get('[data-cy="empty-state"]').should('be.visible')
cy.get('[data-cy="empty-state"]').should('contain', 'No users found')

// Test pagination
cy.intercept('GET', '/api/users?page=1', { fixture: 'users-page-1.json' }).as('getUsersPage1')
cy.intercept('GET', '/api/users?page=2', { fixture: 'users-page-2.json' }).as('getUsersPage2')
cy.visit('/users')
cy.wait('@getUsersPage1')
cy.get('[data-cy="next-page"]').click()
cy.wait('@getUsersPage2')`}
        </pre>
      </div>
    </div>
  );
}

// Custom Commands Example
function CustomCommandsExample() {
  return (
    <div className="example-section">
      <h2>Custom Commands in Cypress</h2>
      <p>Creating reusable custom commands.</p>
      
      <div className="code-block">
        <h3>Creating Custom Commands</h3>
        <pre>
{`// cypress/support/commands.js

// Simple custom command
Cypress.Commands.add('login', (username, password) => {
  cy.visit('/login')
  cy.get('[data-cy="username"]').type(username)
  cy.get('[data-cy="password"]').type(password)
  cy.get('[data-cy="login-button"]').click()
})

// Custom command with options
Cypress.Commands.add('login', (username, password, options = {}) => {
  const { timeout = 5000 } = options
  
  cy.visit('/login', { timeout })
  cy.get('[data-cy="username"]').type(username)
  cy.get('[data-cy="password"]').type(password)
  cy.get('[data-cy="login-button"]').click()
})

// Custom command that returns a value
Cypress.Commands.add('getUserId', (username) => {
  cy.request(`/api/users?username=${username}`).then((response) => {
    return response.body.users[0].id
  })
})

// Custom command with chaining
Cypress.Commands.add('fillForm', (formData) => {
  Object.keys(formData).forEach((key) => {
    cy.get(`[data-cy="${key}"]`).type(formData[key])
  })
  return cy
})`}
        </pre>
      </div>

      <div className="code-block">
        <h3>Using Custom Commands</h3>
        <pre>
{`// cypress/e2e/auth.cy.js
describe('Authentication', () => {
  it('Logs in with custom command', () => {
    cy.login('admin@example.com', 'password123')
    cy.url().should('include', '/dashboard')
  })
  
  it('Logs in with timeout option', () => {
    cy.login('admin@example.com', 'password123', { timeout: 10000 })
    cy.url().should('include', '/dashboard')
  })
  
  it('Uses custom command that returns a value', () => {
    cy.getUserId('john@example.com').then((userId) => {
      cy.visit('/users/' + userId)
      cy.get('[data-cy="user-name"]').should('contain', 'John')
    })
  })
  
  it('Uses custom command with chaining', () => {
    cy.fillForm({
      name: 'John Doe',
      email: 'john@example.com',
      password: 'password123'
    })
    cy.get('[data-cy="submit"]').click()
    cy.get('[data-cy="success-message"]').should('be.visible')
  })
})`}
        </pre>
      </div>

      <div className="code-block">
        <h3>Advanced Custom Commands</h3>
        <pre>
{`// Custom command with existing command
Cypress.Commands.add('typeAndVerify', (selector, text, expectedValue) => {
  cy.get(selector).type(text).should('have.value', expectedValue)
})

// Custom command with conditional logic
Cypress.Commands.add('clickIfExists', (selector) => {
  cy.get('body').then((body) => {
    if (body.find(selector).length > 0) {
      cy.get(selector).click()
    }
  })
})

// Custom command for API testing
Cypress.Commands.add('apiRequest', (method, url, body = null) => {
  const options = {
    method,
    url,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + window.localStorage.getItem('token')
    }
  }
  
  if (body) {
    options.body = JSON.stringify(body)
  }
  
  return cy.request(options)
})

// Custom command for component testing
Cypress.Commands.add('mount', (component, props = {}) => {
  const container = document.createElement('div')
  document.body.appendChild(container)
  
  // This would use your framework's mounting method
  // For React: ReactDOM.render(React.createElement(component, props), container)
  // For Vue: createApp(component, props).mount(container)
  
  return cy.get(container)
})`}
        </pre>
      </div>

      <div className="code-block">
        <h3>Type Definitions for Custom Commands</h3>
        <pre>
{`// cypress/support/index.d.ts
declare global {
  namespace Cypress {
    interface Chainable {
      /**
       * Logs in with username and password
       * @param username - The username to login with
       * @param password - The password to login with
       * @param options - Optional configuration
       */
      login(username: string, password: string, options?: { timeout?: number }): Chainable<Element>
      
      /**
       * Gets user ID by username
       * @param username - The username to look up
       */
      getUserId(username: string): Chainable<string>
      
      /**
       * Fills form with data
       * @param formData - Object with form data
       */
      fillForm(formData: Record<string, string>): Chainable<Element>
      
      /**
       * Makes authenticated API request
       * @param method - HTTP method
       * @param url - Request URL
       * @param body - Request body
       */
      apiRequest(method: string, url: string, body?: any): Chainable<Response>
    }
  }
}

export {}`}
        </pre>
      </div>
    </div>
  );
}

// Add some basic styles for the examples
const style = document.createElement('style');
style.textContent = `
.examples-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  font-family: Arial, sans-serif;
}

.intro {
  font-size: 1.1em;
  color: #666;
  margin-bottom: 30px;
}

.example-nav {
  display: flex;
  gap: 10px;
  margin-bottom: 30px;
  flex-wrap: wrap;
}

.example-nav button {
  padding: 10px 15px;
  border: 1px solid #ddd;
  background: #f5f5f5;
  cursor: pointer;
  border-radius: 4px;
}

.example-nav button.active {
  background: #007bff;
  color: white;
  border-color: #007bff;
}

.example-content {
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 20px;
  background: #f9f9f9;
}

.example-section h2 {
  color: #333;
  border-bottom: 2px solid #007bff;
  padding-bottom: 10px;
}

.code-block {
  margin: 20px 0;
}

.code-block h3 {
  color: #555;
  margin-bottom: 10px;
}

.code-block pre {
  background: #f0f0f0;
  padding: 15px;
  border-radius: 4px;
  overflow-x: auto;
  font-family: 'Courier New', monospace;
  font-size: 14px;
  line-height: 1.4;
}
`;
document.head.appendChild(style);