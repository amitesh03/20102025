import React, { useState } from 'react';

// Example 1: Basic Form with Form Component
function BasicFormExample() {
  const [submittedData, setSubmittedData] = useState(null);
  
  // In real app, this would be:
  // import { Form, Field } from 'react-final-form';
  
  const handleSubmit = (values) => {
    // Simulate API call
    setTimeout(() => {
      setSubmittedData(values);
    }, 1000);
  };
  
  return (
    <div className="react-final-form-example">
      <h2>Basic Form with Form Component</h2>
      <p>Demonstrates a basic form using React Final Form's Form component.</p>
      
      <form onSubmit={handleSubmit} className="form-example">
        <div className="form-group">
          <label htmlFor="firstName">First Name</label>
          <input
            id="firstName"
            name="firstName"
            type="text"
            placeholder="Enter your first name"
            required
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="lastName">Last Name</label>
          <input
            id="lastName"
            name="lastName"
            type="text"
            placeholder="Enter your last name"
            required
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            id="email"
            name="email"
            type="email"
            placeholder="Enter your email"
            required
          />
        </div>
        
        <button type="submit">Submit</button>
      </form>
      
      {submittedData && (
        <div className="submitted-data">
          <h3>Submitted Data:</h3>
          <pre>{JSON.stringify(submittedData, null, 2)}</pre>
        </div>
      )}
      
      <pre>{`
// Basic form with React Final Form
import { Form, Field } from 'react-final-form';

const BasicForm = () => {
  const handleSubmit = (values) => {
    console.log('Form submitted:', values);
  };

  return (
    <Form onSubmit={handleSubmit}>
      {({ handleSubmit, form, submitting, pristine, values }) => (
        <form onSubmit={handleSubmit}>
          <div>
            <label>First Name</label>
            <Field name="firstName" component="input" placeholder="First Name" />
          </div>
          
          <div>
            <label>Last Name</label>
            <Field name="lastName" component="input" placeholder="Last Name" />
          </div>
          
          <div>
            <label>Email</label>
            <Field name="email" component="input" type="email" placeholder="Email" />
          </div>
          
          <button type="submit" disabled={submitting || pristine}>
            Submit
          </button>
        </form>
      )}
    </Form>
  );
};
      `}</pre>
    </div>
  );
}

// Example 2: Form with Validation
function ValidationExample() {
  const [submittedData, setSubmittedData] = useState(null);
  const [errors, setErrors] = useState({});
  
  // In real app, this would be:
  // import { Form, Field } from 'react-final-form';
  
  const validate = (values) => {
    const newErrors = {};
    
    if (!values.firstName) {
      newErrors.firstName = 'First name is required';
    }
    
    if (!values.lastName) {
      newErrors.lastName = 'Last name is required';
    }
    
    if (!values.email) {
      newErrors.email = 'Email is required';
    } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.email)) {
      newErrors.email = 'Invalid email address';
    }
    
    return newErrors;
  };
  
  const handleSubmit = (values) => {
    const validationErrors = validate(values);
    
    if (Object.keys(validationErrors).length === 0) {
      // Simulate API call
      setTimeout(() => {
        setSubmittedData(values);
      }, 1000);
    } else {
      setErrors(validationErrors);
    }
  };
  
  return (
    <div className="react-final-form-example">
      <h2>Form with Validation</h2>
      <p>Demonstrates form validation with React Final Form.</p>
      
      <form onSubmit={handleSubmit} className="form-example">
        <div className="form-group">
          <label htmlFor="firstName">First Name</label>
          <input
            id="firstName"
            name="firstName"
            type="text"
            placeholder="Enter your first name"
            required
          />
          {errors.firstName && <div className="error">{errors.firstName}</div>}
        </div>
        
        <div className="form-group">
          <label htmlFor="lastName">Last Name</label>
          <input
            id="lastName"
            name="lastName"
            type="text"
            placeholder="Enter your last name"
            required
          />
          {errors.lastName && <div className="error">{errors.lastName}</div>}
        </div>
        
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            id="email"
            name="email"
            type="email"
            placeholder="Enter your email"
            required
          />
          {errors.email && <div className="error">{errors.email}</div>}
        </div>
        
        <button type="submit">Submit</button>
      </form>
      
      {submittedData && (
        <div className="submitted-data">
          <h3>Submitted Data:</h3>
          <pre>{JSON.stringify(submittedData, null, 2)}</pre>
        </div>
      )}
      
      <pre>{`
// Form with validation
import { Form, Field } from 'react-final-form';

const ValidationForm = () => {
  const validate = (values) => {
    const errors = {};
    
    if (!values.firstName) {
      errors.firstName = 'First name is required';
    }
    
    if (!values.lastName) {
      errors.lastName = 'Last name is required';
    }
    
    if (!values.email) {
      errors.email = 'Email is required';
    } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.email)) {
      errors.email = 'Invalid email address';
    }
    
    return errors;
  };

  const handleSubmit = (values) => {
    console.log('Form submitted:', values);
  };

  return (
    <Form onSubmit={handleSubmit} validate={validate}>
      {({ handleSubmit, form, submitting, pristine, values }) => (
        <form onSubmit={handleSubmit}>
          <div>
            <label>First Name</label>
            <Field name="firstName" component="input" placeholder="First Name" />
            {form.errors.firstName && <span>{form.errors.firstName}</span>}
          </div>
          
          <div>
            <label>Last Name</label>
            <Field name="lastName" component="input" placeholder="Last Name" />
            {form.errors.lastName && <span>{form.errors.lastName}</span>}
          </div>
          
          <div>
            <label>Email</label>
            <Field name="email" component="input" type="email" placeholder="Email" />
            {form.errors.email && <span>{form.errors.email}</span>}
          </div>
          
          <button type="submit" disabled={submitting || pristine}>
            Submit
          </button>
        </form>
      )}
    </Form>
  );
};
      `}</pre>
    </div>
  );
}

// Example 3: Form with Custom Field Components
function CustomFieldExample() {
  const [submittedData, setSubmittedData] = useState(null);
  
  // In real app, this would be:
  // import { Form, Field } from 'react-final-form';
  
  // Custom input component
  const CustomInput = ({ input, meta, ...props }) => (
    <div className="custom-input">
      <input {...input} {...props} />
      {meta.touched && meta.error && (
        <div className="error">{meta.error}</div>
      )}
    </div>
  );
  
  // Custom select component
  const CustomSelect = ({ input, meta, ...props }) => (
    <div className="custom-select">
      <select {...input} {...props}>
        <option value="">Select an option</option>
        <option value="option1">Option 1</option>
        <option value="option2">Option 2</option>
        <option value="option3">Option 3</option>
      </select>
      {meta.touched && meta.error && (
        <div className="error">{meta.error}</div>
      )}
    </div>
  );
  
  const handleSubmit = (values) => {
    // Simulate API call
    setTimeout(() => {
      setSubmittedData(values);
    }, 1000);
  };
  
  return (
    <div className="react-final-form-example">
      <h2>Form with Custom Field Components</h2>
      <p>Demonstrates using custom field components with React Final Form.</p>
      
      <form onSubmit={handleSubmit} className="form-example">
        <div className="form-group">
          <label htmlFor="name">Name</label>
          <Field name="name" component={CustomInput} placeholder="Enter your name" />
        </div>
        
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <Field name="email" component={CustomInput} type="email" placeholder="Enter your email" />
        </div>
        
        <div className="form-group">
          <label htmlFor="role">Role</label>
          <Field name="role" component={CustomSelect}>
            <option value="">Select a role</option>
            <option value="user">User</option>
            <option value="admin">Admin</option>
            <option value="moderator">Moderator</option>
          </Field>
        </div>
        
        <button type="submit">Submit</button>
      </form>
      
      {submittedData && (
        <div className="submitted-data">
          <h3>Submitted Data:</h3>
          <pre>{JSON.stringify(submittedData, null, 2)}</pre>
        </div>
      )}
      
      <pre>{`
// Form with custom field components
import { Form, Field } from 'react-final-form';

// Custom input component
const CustomInput = ({ input, meta, ...props }) => (
  <div className="custom-input">
    <input {...input} {...props} />
    {meta.touched && meta.error && (
      <div className="error">{meta.error}</div>
    )}
  </div>
);

// Custom select component
const CustomSelect = ({ input, meta, ...props }) => (
  <div className="custom-select">
    <select {...input} {...props}>
      <option value="">Select an option</option>
      <option value="option1">Option 1</option>
      <option value="option2">Option 2</option>
      <option value="option3">Option 3</option>
    </select>
    {meta.touched && meta.error && (
      <div className="error">{meta.error}</div>
    )}
  </div>
);

const CustomFieldForm = () => {
  const handleSubmit = (values) => {
    console.log('Form submitted:', values);
  };

  return (
    <Form onSubmit={handleSubmit}>
      {({ handleSubmit, form, submitting, pristine, values }) => (
        <form onSubmit={handleSubmit}>
          <div>
            <label>Name</label>
            <Field name="name" component={CustomInput} placeholder="Enter your name" />
          </div>
          
          <div>
            <label>Email</label>
            <Field name="email" component={CustomInput} type="email" placeholder="Enter your email" />
          </div>
          
          <div>
            <label>Role</label>
            <Field name="role" component={CustomSelect}>
              <option value="">Select a role</option>
              <option value="user">User</option>
              <option value="admin">Admin</option>
              <option value="moderator">Moderator</option>
            </Field>
          </div>
          
          <button type="submit" disabled={submitting || pristine}>
            Submit
          </button>
        </form>
      )}
    </Form>
  );
};
      `}</pre>
    </div>
  );
}

// Example 4: Form with Initial Values
function InitialValuesExample() {
  const [submittedData, setSubmittedData] = useState(null);
  
  // In real app, this would be:
  // import { Form, Field } from 'react-final-form';
  
  const handleSubmit = (values) => {
    // Simulate API call
    setTimeout(() => {
      setSubmittedData(values);
    }, 1000);
  };
  
  return (
    <div className="react-final-form-example">
      <h2>Form with Initial Values</h2>
      <p>Demonstrates a form with initial values using React Final Form.</p>
      
      <form onSubmit={handleSubmit} className="form-example">
        <div className="form-group">
          <label htmlFor="firstName">First Name</label>
          <input
            id="firstName"
            name="firstName"
            type="text"
            placeholder="Enter your first name"
            defaultValue="John"
            required
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="lastName">Last Name</label>
          <input
            id="lastName"
            name="lastName"
            type="text"
            placeholder="Enter your last name"
            defaultValue="Doe"
            required
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            id="email"
            name="email"
            type="email"
            placeholder="Enter your email"
            defaultValue="john.doe@example.com"
            required
          />
        </div>
        
        <button type="submit">Submit</button>
      </form>
      
      {submittedData && (
        <div className="submitted-data">
          <h3>Submitted Data:</h3>
          <pre>{JSON.stringify(submittedData, null, 2)}</pre>
        </div>
      )}
      
      <pre>{`
// Form with initial values
import { Form, Field } from 'react-final-form';

const InitialValuesForm = () => {
  const handleSubmit = (values) => {
    console.log('Form submitted:', values);
  };

  return (
    <Form
      onSubmit={handleSubmit}
      initialValues={{
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com'
      }}
    >
      {({ handleSubmit, form, submitting, pristine, values }) => (
        <form onSubmit={handleSubmit}>
          <div>
            <label>First Name</label>
            <Field name="firstName" component="input" placeholder="First Name" />
          </div>
          
          <div>
            <label>Last Name</label>
            <Field name="lastName" component="input" placeholder="Last Name" />
          </div>
          
          <div>
            <label>Email</label>
            <Field name="email" component="input" type="email" placeholder="Email" />
          </div>
          
          <button type="submit" disabled={submitting || pristine}>
            Submit
          </button>
        </form>
      )}
    </Form>
  );
};
      `}</pre>
    </div>
  );
}

// Example 5: Form with Render Props
function RenderPropsExample() {
  const [submittedData, setSubmittedData] = useState(null);
  
  // In real app, this would be:
  // import { Form, Field } from 'react-final-form';
  
  const handleSubmit = (values) => {
    // Simulate API call
    setTimeout(() => {
      setSubmittedData(values);
    }, 1000);
  };
  
  return (
    <div className="react-final-form-example">
      <h2>Form with Render Props</h2>
      <p>Demonstrates using render props with React Final Form.</p>
      
      <form onSubmit={handleSubmit} className="form-example">
        <div className="form-group">
          <label htmlFor="firstName">First Name</label>
          <Field name="firstName">
            {({ input, meta }) => (
              <div>
                <input {...input} placeholder="Enter your first name" />
                {meta.touched && meta.error && (
                  <div className="error">{meta.error}</div>
                )}
              </div>
            )}
          </Field>
        </div>
        
        <div className="form-group">
          <label htmlFor="lastName">Last Name</label>
          <Field name="lastName">
            {({ input, meta }) => (
              <div>
                <input {...input} placeholder="Enter your last name" />
                {meta.touched && meta.error && (
                  <div className="error">{meta.error}</div>
                )}
              </div>
            )}
          </Field>
        </div>
        
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <Field name="email">
            {({ input, meta }) => (
              <div>
                <input {...input} type="email" placeholder="Enter your email" />
                {meta.touched && meta.error && (
                  <div className="error">{meta.error}</div>
                )}
              </div>
            )}
          </Field>
        </div>
        
        <button type="submit">Submit</button>
      </form>
      
      {submittedData && (
        <div className="submitted-data">
          <h3>Submitted Data:</h3>
          <pre>{JSON.stringify(submittedData, null, 2)}</pre>
        </div>
      )}
      
      <pre>{`
// Form with render props
import { Form, Field } from 'react-final-form';

const RenderPropsForm = () => {
  const handleSubmit = (values) => {
    console.log('Form submitted:', values);
  };

  return (
    <Form onSubmit={handleSubmit}>
      {({ handleSubmit, form, submitting, pristine, values }) => (
        <form onSubmit={handleSubmit}>
          <div>
            <label>First Name</label>
            <Field name="firstName">
              {({ input, meta }) => (
                <div>
                  <input {...input} placeholder="Enter your first name" />
                  {meta.touched && meta.error && (
                    <div className="error">{meta.error}</div>
                  )}
                </div>
              )}
            </Field>
          </div>
          
          <div>
            <label>Last Name</label>
            <Field name="lastName">
              {({ input, meta }) => (
                <div>
                  <input {...input} placeholder="Enter your last name" />
                  {meta.touched && meta.error && (
                    <div className="error">{meta.error}</div>
                  )}
                </div>
              )}
            </Field>
          </div>
          
          <div>
            <label>Email</label>
            <Field name="email">
              {({ input, meta }) => (
                <div>
                  <input {...input} type="email" placeholder="Enter your email" />
                  {meta.touched && meta.error && (
                    <div className="error">{meta.error}</div>
                  )}
                </div>
              )}
            </Field>
          </div>
          
          <button type="submit" disabled={submitting || pristine}>
            Submit
          </button>
        </form>
      )}
    </Form>
  );
};
      `}</pre>
    </div>
  );
}

// Example 6: Form with Array Fields
function ArrayFieldsExample() {
  const [submittedData, setSubmittedData] = useState(null);
  
  // In real app, this would be:
  // import { Form, Field } from 'react-final-form';
  
  const handleSubmit = (values) => {
    // Simulate API call
    setTimeout(() => {
      setSubmittedData(values);
    }, 1000);
  };
  
  return (
    <div className="react-final-form-example">
      <h2>Form with Array Fields</h2>
      <p>Demonstrates handling array fields with React Final Form.</p>
      
      <form onSubmit={handleSubmit} className="form-example">
        <div className="form-group">
          <label>Skills</label>
          <div className="checkbox-group">
            <div>
              <input name="skills" type="checkbox" value="javascript" />
              <label>JavaScript</label>
            </div>
            <div>
              <input name="skills" type="checkbox" value="react" />
              <label>React</label>
            </div>
            <div>
              <input name="skills" type="checkbox" value="nodejs" />
              <label>Node.js</label>
            </div>
            <div>
              <input name="skills" type="checkbox" value="css" />
              <label>CSS</label>
            </div>
          </div>
        </div>
        
        <button type="submit">Submit</button>
      </form>
      
      {submittedData && (
        <div className="submitted-data">
          <h3>Submitted Data:</h3>
          <pre>{JSON.stringify(submittedData, null, 2)}</pre>
        </div>
      )}
      
      <pre>{`
// Form with array fields
import { Form, Field } from 'react-final-form';

const ArrayFieldsForm = () => {
  const handleSubmit = (values) => {
    console.log('Form submitted:', values);
  };

  return (
    <Form onSubmit={handleSubmit}>
      {({ handleSubmit, form, submitting, pristine, values }) => (
        <form onSubmit={handleSubmit}>
          <div>
            <label>Skills</label>
            <Field name="skills" type="checkbox" value="javascript" />
            <label>JavaScript</label>
          </div>
          <Field name="skills" type="checkbox" value="react" />
          <label>React</label>
          </div>
          <Field name="skills" type="checkbox" value="nodejs" />
          <label>Node.js</label>
          </div>
          <Field name="skills" type="checkbox" value="css" />
          <label>CSS</label>
          </div>
          
          <button type="submit" disabled={submitting || pristine}>
            Submit
          </button>
        </form>
      )}
    </Form>
  );
};
      `}</pre>
    </div>
  );
}

// Main component that combines all examples
export default function ReactFinalFormExamples() {
  const [activeExample, setActiveExample] = useState(0);
  
  const examples = [
    { component: BasicFormExample, title: "Basic Form with Form Component" },
    { component: ValidationExample, title: "Form with Validation" },
    { component: CustomFieldExample, title: "Form with Custom Field Components" },
    { component: InitialValuesExample, title: "Form with Initial Values" },
    { component: RenderPropsExample, title: "Form with Render Props" },
    { component: ArrayFieldsExample, title: "Form with Array Fields" }
  ];
  
  const ActiveExampleComponent = examples[activeExample].component;
  
  return (
    <div className="react-final-form-examples">
      <h1>React Final Form Examples</h1>
      <p>Comprehensive examples demonstrating React Final Form features and patterns.</p>
      
      <div className="example-navigation">
        {examples.map((example, index) => (
          <button
            key={index}
            onClick={() => setActiveExample(index)}
            className={activeExample === index ? 'active' : ''}
          >
            {example.title}
          </button>
        ))}
      </div>
      
      <div className="example-content">
        <ActiveExampleComponent />
      </div>
      
      <div className="info-section">
        <h2>About React Final Form</h2>
        <p>
          React Final Form is a high-performance form library for React that provides 
          subscriptions-based form state management using the Observer pattern. 
          It offers a simple API with minimal boilerplate and excellent performance.
        </p>
        
        <h3>Key Features:</h3>
        <ul>
          <li><strong>Subscription-based State</strong>: Uses Observer pattern for efficient re-renders</li>
          <li><strong>Minimal API</strong>: Simple and intuitive API with minimal boilerplate</li>
          <li><strong>Framework Agnostic</strong>: Works with any UI framework</li>
          <li><strong>Field Components</strong>: Built-in Field, Form, and other components</li>
          <li><strong>Render Props</strong>: Flexible render prop pattern for custom rendering</li>
          <li><strong>Validation</strong>: Built-in validation support</li>
          <li><strong>TypeScript Support</strong>: Full TypeScript support</li>
          <li><strong>Performance</strong>: Optimized for performance</li>
          <li><strong>Small Bundle Size</strong>: Lightweight and minimal dependencies</li>
        </ul>
        
        <h3>Installation:</h3>
        <pre>{`# Install React Final Form
npm install --save final-form react-final-form

# or with yarn
yarn add final-form react-final-form`}</pre>
        
        <h3>Basic Usage:</h3>
        <pre>{`import { Form, Field } from 'react-final-form';

const MyForm = () => {
  const handleSubmit = (values) => {
    console.log('Form submitted:', values);
  };

  return (
    <Form onSubmit={handleSubmit}>
      {({ handleSubmit, form, submitting, pristine, values }) => (
        <form onSubmit={handleSubmit}>
          <div>
            <label>First Name</label>
            <Field name="firstName" component="input" placeholder="First Name" />
          </div>
          
          <div>
            <label>Last Name</label>
            <Field name="lastName" component="input" placeholder="Last Name" />
          </div>
          
          <div>
            <label>Email</label>
            <Field name="email" component="input" type="email" placeholder="Email" />
          </div>
          
          <button type="submit" disabled={submitting || pristine}>
            Submit
          </button>
        </form>
      )}
    </Form>
  );
};`}</pre>
      </div>
    </div>
  );
}