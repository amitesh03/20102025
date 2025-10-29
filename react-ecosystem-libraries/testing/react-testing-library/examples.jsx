import React from 'react';

// React Testing Library Examples Component
// This component demonstrates various React Testing Library patterns and features

const ReactTestingLibraryExamples = () => {
  return (
    <div className="rtl-examples">
      <h1>React Testing Library Examples</h1>
      <p>Comprehensive examples of React Testing Library patterns and features</p>
      
      <div className="example-section">
        <h2>Basic Rendering</h2>
        <p>render, screen queries, and basic assertions</p>
      </div>
      
      <div className="example-section">
        <h2>User Interactions</h2>
        <p>fireEvent, userEvent, and simulating user behavior</p>
      </div>
      
      <div className="example-section">
        <h2>Async Testing</h2>
        <p>waitFor, findBy, and testing async operations</p>
      </div>
      
      <div className="example-section">
        <h2>Mocking</h2>
        <p>Mocking functions, modules, and API calls</p>
      </div>
      
      <div className="example-section">
        <h2>Advanced Queries</h2>
        <p>Custom queries, query priorities, and accessibility</p>
      </div>
    </div>
  );
};

export default ReactTestingLibraryExamples;

/*
// BASIC RENDERING EXAMPLES

// Example 1: Simple component rendering and querying
import {render, screen} from '@testing-library/react';
import '@testing-library/jest-dom';
import MyComponent from './MyComponent';

test('renders component with text', () => {
  render(<MyComponent />);
  
  // Using getByText - throws if not found
  expect(screen.getByText('Hello World')).toBeInTheDocument();
  
  // Using queryByText - returns null if not found
  expect(screen.queryByText('Not Found')).toBeNull();
  
  // Using findByText - async, waits for element
  expect(screen.findByText('Async Text')).resolves.toBeInTheDocument();
});

// Example 2: Different query methods
test('demonstrates different query methods', () => {
  render(<MyComponent />);
  
  // getBy methods - throw if not found
  expect(screen.getByRole('button')).toBeInTheDocument();
  expect(screen.getByLabelText('Username')).toBeInTheDocument();
  expect(screen.getByPlaceholderText('Enter email')).toBeInTheDocument();
  expect(screen.getByAltText('Company logo')).toBeInTheDocument();
  expect(screen.getByTitle('Tooltip text')).toBeInTheDocument();
  expect(screen.getByDisplayValue('Default value')).toBeInTheDocument();
  
  // queryBy methods - return null if not found
  expect(screen.queryByRole('nonexistent')).toBeNull();
  
  // findBy methods - async, wait for element
  expect(screen.findByRole('alert')).resolves.toBeInTheDocument();
});

// Example 3: Testing component props
test('renders with different props', () => {
  const {rerender} = render(<Greeting name="John" />);
  
  expect(screen.getByText('Hello, John!')).toBeInTheDocument();
  
  // Rerender with new props
  rerender(<Greeting name="Jane" />);
  expect(screen.getByText('Hello, Jane!')).toBeInTheDocument();
});

// Example 4: Testing conditional rendering
test('conditionally renders content based on props', () => {
  const {rerender} = render(<UserCard user={null} />);
  
  expect(screen.getByText('No user data')).toBeInTheDocument();
  expect(screen.queryByText('John Doe')).toBeNull();
  
  rerender(<UserCard user={{name: 'John Doe', email: 'john@example.com'}} />);
  
  expect(screen.getByText('John Doe')).toBeInTheDocument();
  expect(screen.getByText('john@example.com')).toBeInTheDocument();
  expect(screen.queryByText('No user data')).toBeNull();
});


// USER INTERACTIONS EXAMPLES

// Example 1: Basic click events
import {render, screen, fireEvent} from '@testing-library/react';
import Counter from './Counter';

test('increments counter when button is clicked', () => {
  render(<Counter />);
  
  const button = screen.getByRole('button', {name: /increment/i});
  const countDisplay = screen.getByText(/count:/i);
  
  expect(countDisplay).toHaveTextContent('Count: 0');
  
  fireEvent.click(button);
  expect(countDisplay).toHaveTextContent('Count: 1');
  
  fireEvent.click(button);
  expect(countDisplay).toHaveTextContent('Count: 2');
});

// Example 2: Form interactions
import {render, screen, fireEvent} from '@testing-library/react';
import LoginForm from './LoginForm';

test('submits form with correct data', () => {
  const handleSubmit = jest.fn();
  render(<LoginForm onSubmit={handleSubmit} />);
  
  const usernameInput = screen.getByLabelText(/username/i);
  const passwordInput = screen.getByLabelText(/^password/i);
  const submitButton = screen.getByRole('button', {name: /submit/i});
  
  fireEvent.change(usernameInput, {target: {value: 'testuser'}});
  fireEvent.change(passwordInput, {target: {value: 'password123'}});
  fireEvent.click(submitButton);
  
  expect(handleSubmit).toHaveBeenCalledWith({
    username: 'testuser',
    password: 'password123'
  });
});

// Example 3: Using userEvent for more realistic interactions
import {render, screen} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import SearchForm from './SearchForm';

test('performs search with userEvent', async () => {
  const user = userEvent.setup();
  const onSearch = jest.fn();
  render(<SearchForm onSearch={onSearch} />);
  
  const searchInput = screen.getByRole('textbox', {name: /search/i});
  const searchButton = screen.getByRole('button', {name: /search/i});
  
  await user.type(searchInput, 'React Testing');
  await user.click(searchButton);
  
  expect(onSearch).toHaveBeenCalledWith('React Testing');
});

// Example 4: Complex interactions
test('handles complex user interactions', async () => {
  const user = userEvent.setup();
  render(<TodoList />);
  
  // Add new todo
  const input = screen.getByPlaceholderText(/add new todo/i);
  const addButton = screen.getByRole('button', {name: /add/i});
  
  await user.type(input, 'Learn React Testing Library');
  await user.click(addButton);
  
  expect(screen.getByText('Learn React Testing Library')).toBeInTheDocument();
  
  // Mark as complete
  const checkbox = screen.getByRole('checkbox');
  await user.click(checkbox);
  
  expect(checkbox).toBeChecked();
  
  // Delete todo
  const deleteButton = screen.getByRole('button', {name: /delete/i});
  await user.click(deleteButton);
  
  expect(screen.queryByText('Learn React Testing Library')).not.toBeInTheDocument();
});


// ASYNC TESTING EXAMPLES

// Example 1: Testing async data fetching
import {render, screen, waitFor} from '@testing-library/react';
import '@testing-library/jest-dom';
import UserList from './UserList';

// Mock the API module
jest.mock('./api', () => ({
  fetchUsers: jest.fn(),
}));

import {fetchUsers} from './api';

test('displays loading state and then user data', async () => {
  const mockUsers = [
    {id: 1, name: 'John Doe'},
    {id: 2, name: 'Jane Smith'},
  ];
  
  fetchUsers.mockResolvedValue(mockUsers);
  
  render(<UserList />);
  
  // Check loading state
  expect(screen.getByText('Loading...')).toBeInTheDocument();
  
  // Wait for data to load
  await waitFor(() => {
    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('Jane Smith')).toBeInTheDocument();
  });
  
  // Loading state should be gone
  expect(screen.queryByText('Loading...')).not.toBeInTheDocument();
});

// Example 2: Using findBy queries for async elements
test('finds elements that appear asynchronously', async () => {
  render(<AsyncComponent />);
  
  // findBy waits for the element to appear
  const asyncElement = await screen.findByText('Async content loaded');
  expect(asyncElement).toBeInTheDocument();
  
  // Can also use with timeout
  const delayedElement = await screen.findByText(
    'Delayed content',
    {},
    {timeout: 3000}
  );
  expect(delayedElement).toBeInTheDocument();
});

// Example 3: Testing error states
test('handles API errors gracefully', async () => {
  fetchUsers.mockRejectedValue(new Error('Network error'));
  
  render(<UserList />);
  
  // Wait for error message
  await waitFor(() => {
    expect(screen.getByText(/error loading users/i)).toBeInTheDocument();
  });
  
  expect(screen.queryByText('Loading...')).not.toBeInTheDocument();
});

// Example 4: Testing with waitForElementToBeRemoved
test('removes loading indicator after data loads', async () => {
  fetchUsers.mockResolvedValue(mockUsers);
  
  render(<UserList />);
  
  const loadingElement = screen.getByText('Loading...');
  expect(loadingElement).toBeInTheDocument();
  
  // Wait for element to be removed
  await waitForElementToBeRemoved(() => 
    screen.getByText('Loading...')
  );
  
  expect(screen.getByText('John Doe')).toBeInTheDocument();
});


// MOCKING EXAMPLES

// Example 1: Mocking child components
jest.mock('./ChildComponent', () => ({
  __esModule: true,
  default: ({title}) => <div data-testid="mock-child">{title}</div>,
}));

test('renders parent with mocked child', () => {
  render(<ParentComponent title="Test Title" />);
  
  expect(screen.getByTestId('mock-child')).toHaveTextContent('Test Title');
});

// Example 2: Mocking API calls with MSW
import {rest} from 'msw';
import {setupServer} from 'msw/node';
import {render, screen, waitFor} from '@testing-library/react';
import UserProfile from './UserProfile';

const server = setupServer(
  rest.get('/api/users/:id', (req, res, ctx) => {
    const {id} = req.params;
    if (id === '1') {
      return res(
        ctx.json({
          id: 1,
          name: 'John Doe',
          email: 'john@example.com',
        })
      );
    }
    return res(ctx.status(404));
  })
);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

test('displays user profile data', async () => {
  render(<UserProfile userId="1" />);
  
  await waitFor(() => {
    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('john@example.com')).toBeInTheDocument();
  });
});

// Example 3: Mocking hooks
jest.mock('./useAuth', () => ({
  useAuth: () => ({
    user: {name: 'Test User', role: 'admin'},
    login: jest.fn(),
    logout: jest.fn(),
  }),
}));

test('displays user info from mocked hook', () => {
  render(<Header />);
  
  expect(screen.getByText('Test User')).toBeInTheDocument();
  expect(screen.getByText('Admin')).toBeInTheDocument();
});

// Example 4: Mocking timers
jest.useFakeTimers();

test('shows message after delay', () => {
  render(<DelayedMessage delay={1000} message="Hello after delay" />);
  
  expect(screen.queryByText('Hello after delay')).not.toBeInTheDocument();
  
  // Fast-forward time
  jest.advanceTimersByTime(1000);
  
  expect(screen.getByText('Hello after delay')).toBeInTheDocument();
});

afterAll(() => {
  jest.useRealTimers();
});


// ADVANCED QUERIES EXAMPLES

// Example 1: Custom queries
import {buildQueries, queryHelpers} from '@testing-library/react';

const queryAllByDataCy = container =>
  container.querySelectorAll(`[data-cy]`);

const getMultipleError = (c, dataCyValue) =>
  `Found multiple elements with the data-cy attribute of: ${dataCyValue}`;

const getMissingError = (c, dataCyValue) =>
  `Unable to find an element with the data-cy attribute of: ${dataCyValue}`;

const [
  queryByDataCy,
  getAllByDataCy,
  getByDataCy,
  findAllByDataCy,
  findByDataCy,
] = buildQueries(queryAllByDataCy, getMultipleError, getMissingError);

// Add custom queries to screen
screen.queryByDataCy = queryByDataCy.bind(null, document.body);
screen.getAllByDataCy = getAllByDataCy.bind(null, document.body);
screen.getByDataCy = getByDataCy.bind(null, document.body);
screen.findAllByDataCy = findAllByDataCy.bind(null, document.body);
screen.findByDataCy = findByDataCy.bind(null, document.body);

test('uses custom data-cy queries', () => {
  render(<ComponentWithCustomAttributes />);
  
  expect(screen.getByDataCy('submit-button')).toBeInTheDocument();
  expect(screen.queryByDataCy('error-message')).toBeNull();
});

// Example 2: Testing accessibility
import {render, screen} from '@testing-library/react';
import {axe, toHaveNoViolations} from 'jest-axe';

expect.extend(toHaveNoViolations);

test('component is accessible', async () => {
  const {container} = render(<AccessibleComponent />);
  const results = await axe(container);
  
  expect(results).toHaveNoViolations();
});

// Example 3: Testing with different screen readers
test('provides proper ARIA labels', () => {
  render(<FormComponent />);
  
  // Check for proper labeling
  expect(screen.getByLabelText('Email address')).toBeInTheDocument();
  expect(screen.getByRole('button', {name: 'Submit form'})).toBeInTheDocument();
  expect(screen.getByRole('alert')).toBeInTheDocument();
});

// Example 4: Testing focus management
test('manages focus correctly', async () => {
  const user = userEvent.setup();
  render(<ModalComponent />);
  
  const openButton = screen.getByRole('button', {name: 'Open modal'});
  await user.click(openButton);
  
  // Focus should move to modal
  expect(screen.getByRole('dialog')).toHaveFocus();
  
  // Tab navigation should stay within modal
  await user.tab();
  expect(screen.getByRole('button', {name: 'Close'})).toHaveFocus();
});


// TESTING HOOKS EXAMPLES

// Example 1: Testing custom hooks with renderHook
import {renderHook, act} from '@testing-library/react';
import useCounter from './useCounter';

test('useCounter hook', () => {
  const {result} = renderHook(() => useCounter());
  
  expect(result.current.count).toBe(0);
  expect(typeof result.current.increment).toBe('function');
  expect(typeof result.current.decrement).toBe('function');
  expect(typeof result.current.reset).toBe('function');
});

test('increments and decrements counter', () => {
  const {result} = renderHook(() => useCounter());
  
  act(() => {
    result.current.increment();
  });
  expect(result.current.count).toBe(1);
  
  act(() => {
    result.current.decrement();
  });
  expect(result.current.count).toBe(0);
});

test('resets counter', () => {
  const {result} = renderHook(() => useCounter());
  
  act(() => {
    result.current.increment();
    result.current.increment();
  });
  expect(result.current.count).toBe(2);
  
  act(() => {
    result.current.reset();
  });
  expect(result.current.count).toBe(0);
});

// Example 2: Testing hooks with initial values
test('useCounter with initial value', () => {
  const {result} = renderHook(() => useCounter(5));
  
  expect(result.current.count).toBe(5);
  
  act(() => {
    result.current.increment();
  });
  expect(result.current.count).toBe(6);
});

// Example 3: Testing async hooks
test('useAsyncData hook', async () => {
  const mockData = {id: 1, name: 'Test Data'};
  const mockFetch = jest.fn().mockResolvedValue(mockData);
  
  const {result} = renderHook(() => useAsyncData(mockFetch));
  
  expect(result.current.loading).toBe(true);
  expect(result.current.data).toBeNull();
  expect(result.current.error).toBeNull();
  
  await act(async () => {
    await new Promise(resolve => setTimeout(resolve, 0));
  });
  
  expect(result.current.loading).toBe(false);
  expect(result.current.data).toEqual(mockData);
  expect(result.current.error).toBeNull();
});


// TESTING CONTEXT EXAMPLES

// Example 1: Testing components with context
import {render, screen} from '@testing-library/react';
import {ThemeContext, ThemeProvider} from './theme';
import ThemedComponent from './ThemedComponent';

test('renders with light theme', () => {
  render(
    <ThemeProvider theme="light">
      <ThemedComponent />
    </ThemeProvider>
  );
  
  expect(screen.getByText('Light Theme')).toBeInTheDocument();
  expect(screen.getByText('Light Theme')).toHaveClass('light-theme');
});

test('renders with dark theme', () => {
  render(
    <ThemeProvider theme="dark">
      <ThemedComponent />
    </ThemeProvider>
  );
  
  expect(screen.getByText('Dark Theme')).toBeInTheDocument();
  expect(screen.getByText('Dark Theme')).toHaveClass('dark-theme');
});

// Example 2: Testing with custom context wrapper
const customRender = (ui, {providerProps, ...renderOptions}) => {
  return render(
    <ThemeContext.Provider {...providerProps}>
      {ui}
    </ThemeContext.Provider>,
    renderOptions
  );
};

test('renders with custom context value', () => {
  customRender(<ThemedComponent />, {
    providerProps: {value: {theme: 'custom', colors: {primary: 'blue'}}},
  });
  
  expect(screen.getByText('Custom Theme')).toBeInTheDocument();
});


// TESTING ROUTING EXAMPLES

// Example 1: Testing with React Router
import {render, screen} from '@testing-library/react';
import {MemoryRouter} from 'react-router-dom';
import App from './App';

test('navigates to different routes', () => {
  render(
    <MemoryRouter initialEntries={['/']}>
      <App />
    </MemoryRouter>
  );
  
  expect(screen.getByText('Home Page')).toBeInTheDocument();
  
  // Navigate to about page
  const aboutLink = screen.getByRole('link', {name: /about/i});
  fireEvent.click(aboutLink);
  
  expect(screen.getByText('About Page')).toBeInTheDocument();
});

// Example 2: Testing route parameters
test('displays user profile with correct ID', () => {
  render(
    <MemoryRouter initialEntries={['/users/123']}>
      <App />
    </MemoryRouter>
  );
  
  expect(screen.getByText('User ID: 123')).toBeInTheDocument();
});


// TESTING FORMS EXAMPLES

// Example 1: Testing controlled components
test('controlled form input', async () => {
  const user = userEvent.setup();
  const onSubmit = jest.fn();
  
  render(<ContactForm onSubmit={onSubmit} />);
  
  const nameInput = screen.getByLabelText(/name/i);
  const emailInput = screen.getByLabelText(/email/i);
  const submitButton = screen.getByRole('button', {name: /submit/i});
  
  await user.type(nameInput, 'John Doe');
  await user.type(emailInput, 'john@example.com');
  await user.click(submitButton);
  
  expect(onSubmit).toHaveBeenCalledWith({
    name: 'John Doe',
    email: 'john@example.com',
  });
});

// Example 2: Testing form validation
test('displays validation errors', async () => {
  const user = userEvent.setup();
  render(<ValidationForm />);
  
  const submitButton = screen.getByRole('button', {name: /submit/i});
  await user.click(submitButton);
  
  expect(screen.getByText(/name is required/i)).toBeInTheDocument();
  expect(screen.getByText(/email is required/i)).toBeInTheDocument();
  
  const nameInput = screen.getByLabelText(/name/i);
  await user.type(nameInput, 'John');
  
  expect(screen.queryByText(/name is required/i)).not.toBeInTheDocument();
  expect(screen.getByText(/email is required/i)).toBeInTheDocument();
});


// PERFORMANCE TESTING EXAMPLES

// Example 1: Testing large lists
test('renders large list efficiently', () => {
  const largeData = Array.from({length: 1000}, (_, i) => ({
    id: i,
    name: `Item ${i}`,
  }));
  
  const startTime = performance.now();
  render(<VirtualizedList items={largeData} />);
  const endTime = performance.now();
  
  // Should render quickly
  expect(endTime - startTime).toBeLessThan(100);
  
  // Should only render visible items
  expect(screen.getAllByRole('listitem')).toHaveLength(10);
});

// Example 2: Testing re-renders
test('minimizes unnecessary re-renders', () => {
  const renderSpy = jest.fn();
  
  const ExpensiveComponent = React.memo(({data}) => {
    renderSpy();
    return <div>{data}</div>;
  });
  
  const {rerender} = render(<ExpensiveComponent data="initial" />);
  expect(renderSpy).toHaveBeenCalledTimes(1);
  
  rerender(<ExpensiveComponent data="initial" />);
  expect(renderSpy).toHaveBeenCalledTimes(1); // Should not re-render
  
  rerender(<ExpensiveComponent data="changed" />);
  expect(renderSpy).toHaveBeenCalledTimes(2); // Should re-render
});
*/