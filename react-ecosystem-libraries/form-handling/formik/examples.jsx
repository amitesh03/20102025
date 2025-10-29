import React, { useState } from 'react';

// Example 1: Basic Form with useFormik Hook
function BasicFormExample() {
  const [submittedData, setSubmittedData] = useState(null);
  
  // In real app, this would be:
  // const formik = useFormik({
  //   initialValues: {
  //     firstName: '',
  //     lastName: '',
  //     email: '',
  //   },
  //   validationSchema: Yup.object({
  //     firstName: Yup.string().required('Required'),
  //     lastName: Yup.string().required('Required'),
  //     email: Yup.string().email('Invalid email').required('Required'),
  //   }),
  //   onSubmit: (values, { setSubmitting }) => {
  //     setTimeout(() => {
  //       alert(JSON.stringify(values, null, 2));
  //       setSubmitting(false);
  //     }, 1000);
  //   },
  // });
  
  const handleSubmit = (e) => {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const values = Object.fromEntries(formData.entries());
    
    // Simulate API call
    setTimeout(() => {
      setSubmittedData(values);
    }, 1000);
  };
  
  return (
    <div className="formik-example">
      <h2>Basic Form with useFormik Hook</h2>
      <p>Demonstrates a basic form using Formik's useFormik hook.</p>
      
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
// Basic form with Formik
import React from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';

const BasicForm = () => {
  const formik = useFormik({
    initialValues: {
      firstName: '',
      lastName: '',
      email: '',
    },
    validationSchema: Yup.object({
      firstName: Yup.string().required('Required'),
      lastName: Yup.string().required('Required'),
      email: Yup.string().email('Invalid email').required('Required'),
    }),
    onSubmit: (values, { setSubmitting }) => {
      setTimeout(() => {
        alert(JSON.stringify(values, null, 2));
        setSubmitting(false);
      }, 1000);
    },
  });
  
  return (
    <form onSubmit={formik.handleSubmit}>
      <div>
        <label htmlFor="firstName">First Name</label>
        <input
          id="firstName"
          name="firstName"
          type="text"
          onChange={formik.handleChange}
          value={formik.values.firstName}
        />
        {formik.errors.firstName && <div>{formik.errors.firstName}</div>}
      </div>
      
      <div>
        <label htmlFor="lastName">Last Name</label>
        <input
          id="lastName"
          name="lastName"
          type="text"
          onChange={formik.handleChange}
          value={formik.values.lastName}
        />
        {formik.errors.lastName && <div>{formik.errors.lastName}</div>}
      </div>
      
      <div>
        <label htmlFor="email">Email</label>
        <input
          id="email"
          name="email"
          type="email"
          onChange={formik.handleChange}
          value={formik.values.email}
        />
        {formik.errors.email && <div>{formik.errors.email}</div>}
      </div>
      
      <button type="submit" disabled={formik.isSubmitting}>
        {formik.isSubmitting ? 'Submitting...' : 'Submit'}
      </button>
    </form>
  );
};
      `}</pre>
    </div>
  );
}

// Example 2: Form with Formik Component
function FormikComponentExample() {
  const [submittedData, setSubmittedData] = useState(null);
  
  // In real app, this would be:
  // const validationSchema = Yup.object({
  //   email: Yup.string().email('Invalid email').required('Required'),
  //   password: Yup.string().min(8, 'Password must be at least 8 characters').required('Required'),
  // });
  
  const handleSubmit = (values, { setSubmitting }) => {
    // Simulate API call
    setTimeout(() => {
      setSubmittedData(values);
      setSubmitting(false);
    }, 1000);
  };
  
  return (
    <div className="formik-example">
      <h2>Form with Formik Component</h2>
      <p>Demonstrates using Formik's Formik component for form management.</p>
      
      <form className="form-example">
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
        
        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            id="password"
            name="password"
            type="password"
            placeholder="Enter your password"
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
// Form with Formik component
import React from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';

const LoginForm = () => {
  const validationSchema = Yup.object({
    email: Yup.string().email('Invalid email').required('Required'),
    password: Yup.string().min(8, 'Password must be at least 8 characters').required('Required'),
  });
  
  return (
    <Formik
      initialValues={{ email: '', password: '' }}
      validationSchema={validationSchema}
      onSubmit={(values, { setSubmitting }) => {
        setTimeout(() => {
          alert(JSON.stringify(values, null, 2));
          setSubmitting(false);
        }, 1000);
      }}
    >
      {({ errors, touched, isSubmitting }) => (
        <Form>
          <div>
            <label htmlFor="email">Email</label>
            <Field
              id="email"
              name="email"
              type="email"
              placeholder="Enter your email"
            />
            {errors.email && touched.email && (
              <ErrorMessage name="email" component="div" className="error" />
            )}
          </div>
          
          <div>
            <label htmlFor="password">Password</label>
            <Field
              id="password"
              name="password"
              type="password"
              placeholder="Enter your password"
            />
            {errors.password && touched.password && (
              <ErrorMessage name="password" component="div" className="error" />
            )}
          </div>
          
          <button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Submitting...' : 'Submit'}
          </button>
        </Form>
      )}
    </Formik>
  );
};
      `}</pre>
    </div>
  );
}

// Example 3: Field-Level Validation
function FieldValidationExample() {
  const [submittedData, setSubmittedData] = useState(null);
  const [errors, setErrors] = useState({});
  
  // Custom validation functions
  const validateEmail = (value) => {
    let error;
    if (!value) {
      error = 'Email is required';
    } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(value)) {
      error = 'Invalid email address';
    }
    return error;
  };
  
  const validateUsername = (value) => {
    let error;
    if (!value) {
      error = 'Username is required';
    } else if (value.length < 3) {
      error = 'Username must be at least 3 characters';
    } else if (value.length > 20) {
      error = 'Username must be at most 20 characters';
    }
    return error;
  };
  
  const validatePassword = (value) => {
    let error;
    if (!value) {
      error = 'Password is required';
    } else if (value.length < 8) {
      error = 'Password must be at least 8 characters';
    }
    return error;
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const values = Object.fromEntries(formData.entries());
    
    // Validate all fields
    const newErrors = {};
    newErrors.email = validateEmail(values.email);
    newErrors.username = validateUsername(values.username);
    newErrors.password = validatePassword(values.password);
    
    setErrors(newErrors);
    
    // If no errors, submit the form
    if (!newErrors.email && !newErrors.username && !newErrors.password) {
      // Simulate API call
      setTimeout(() => {
        setSubmittedData(values);
      }, 1000);
    }
  };
  
  return (
    <div className="formik-example">
      <h2>Field-Level Validation</h2>
      <p>Demonstrates custom field-level validation with Formik.</p>
      
      <form onSubmit={handleSubmit} className="form-example">
        <div className="form-group">
          <label htmlFor="username">Username</label>
          <input
            id="username"
            name="username"
            type="text"
            placeholder="Enter your username"
            required
          />
          {errors.username && <div className="error">{errors.username}</div>}
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
        
        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            id="password"
            name="password"
            type="password"
            placeholder="Enter your password"
            required
          />
          {errors.password && <div className="error">{errors.password}</div>}
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
// Field-level validation with Formik
import React from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';

// Custom validation functions
const validateEmail = (value) => {
  let error;
  if (!value) {
    error = 'Email is required';
  } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(value)) {
    error = 'Invalid email address';
  }
  return error;
};

const validateUsername = (value) => {
  let error;
  if (!value) {
    error = 'Username is required';
  } else if (value.length < 3) {
    error = 'Username must be at least 3 characters';
  }
  return error;
};

const FieldValidationForm = () => {
  return (
    <Formik
      initialValues={{ username: '', email: '' }}
      onSubmit={(values, { setSubmitting }) => {
        setTimeout(() => {
          alert(JSON.stringify(values, null, 2));
          setSubmitting(false);
        }, 1000);
      }}
    >
      {({ errors, touched, isSubmitting }) => (
        <Form>
          <div>
            <label htmlFor="username">Username</label>
            <Field
              id="username"
              name="username"
              validate={validateUsername}
            />
            {errors.username && touched.username && (
              <ErrorMessage name="username" component="div" className="error" />
            )}
          </div>
          
          <div>
            <label htmlFor="email">Email</label>
            <Field
              id="email"
              name="email"
              type="email"
              validate={validateEmail}
            />
            {errors.email && touched.email && (
              <ErrorMessage name="email" component="div" className="error" />
            )}
          </div>
          
          <button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Submitting...' : 'Submit'}
          </button>
        </Form>
      )}
    </Formik>
  );
};
      `}</pre>
    </div>
  );
}

// Example 4: Checkbox Group
function CheckboxGroupExample() {
  const [submittedData, setSubmittedData] = useState(null);
  
  const handleSubmit = (values, { setSubmitting }) => {
    // Simulate API call
    setTimeout(() => {
      setSubmittedData(values);
      setSubmitting(false);
    }, 1000);
  };
  
  return (
    <div className="formik-example">
      <h2>Checkbox Group</h2>
      <p>Demonstrates handling checkbox groups with Formik.</p>
      
      <form className="form-example">
        <div className="form-group">
          <label>Select your interests:</label>
          <div className="checkbox-group">
            <label>
              <input type="checkbox" name="interests" value="coding" />
              Coding
            </label>
          </div>
          
          <div className="checkbox-group">
            <label>
              <input type="checkbox" name="interests" value="reading" />
              Reading
            </label>
          </div>
          
          <div className="checkbox-group">
            <label>
              <input type="checkbox" name="interests" value="hiking" />
              Hiking
            </label>
          </div>
          
          <div className="checkbox-group">
            <label>
              <input type="checkbox" name="interests" value="gaming" />
              Gaming
            </label>
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
// Checkbox group with Formik
import React from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';

const CheckboxGroupForm = () => {
  return (
    <Formik
      initialValues={{
        interests: [],
      }}
      onSubmit={(values, { setSubmitting }) => {
        setTimeout(() => {
          alert(JSON.stringify(values, null, 2));
          setSubmitting(false);
        }, 1000);
      }}
    >
      {({ values, handleChange, isSubmitting }) => (
        <Form>
          <div>
            <label>Select your interests:</label>
            <div className="checkbox-group">
              <label>
                <Field
                  type="checkbox"
                  name="interests"
                  value="coding"
                  onChange={handleChange}
                  checked={values.interests.includes('coding')}
                />
                Coding
              </label>
            </div>
            
            <div className="checkbox-group">
              <label>
                <Field
                  type="checkbox"
                  name="interests"
                  value="reading"
                  onChange={handleChange}
                  checked={values.interests.includes('reading')}
                />
                Reading
              </label>
            </div>
            
            <div className="checkbox-group">
              <label>
                <Field
                  type="checkbox"
                  name="interests"
                  value="hiking"
                  onChange={handleChange}
                  checked={values.interests.includes('hiking')}
                />
                Hiking
              </label>
            </div>
            
            <div className="checkbox-group">
              <label>
                <Field
                  type="checkbox"
                  name="interests"
                  value="gaming"
                  onChange={handleChange}
                  checked={values.interests.includes('gaming')}
                />
                Gaming
              </label>
            </div>
          </div>
          
          <button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Submitting...' : 'Submit'}
          </button>
        </Form>
      )}
    </Formik>
  );
};
      `}</pre>
    </div>
  );
}

// Example 5: Async Submission
function AsyncSubmissionExample() {
  const [submittedData, setSubmittedData] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const handleSubmit = async (values, { setSubmitting }) => {
    setIsSubmitting(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setSubmittedData(values);
    } catch (error) {
      console.error('Submission error:', error);
    } finally {
      setSubmitting(false);
    }
  };
  
  return (
    <div className="formik-example">
      <h2>Async Submission</h2>
      <p>Demonstrates handling asynchronous form submissions with Formik.</p>
      
      <form className="form-example">
        <div className="form-group">
          <label htmlFor="title">Title</label>
          <input
            id="title"
            name="title"
            type="text"
            placeholder="Enter a title"
            required
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="content">Content</label>
          <textarea
            id="content"
            name="content"
            placeholder="Enter content"
            rows="4"
            required
          />
        </div>
        
        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Submitting...' : 'Submit'}
        </button>
      </form>
      
      {submittedData && (
        <div className="submitted-data">
          <h3>Submitted Data:</h3>
          <pre>{JSON.stringify(submittedData, null, 2)}</pre>
        </div>
      )}
      
      <pre>{`
// Async submission with Formik
import React from 'react';
import { Formik, Form, Field } from 'formik';

const AsyncSubmissionForm = () => {
  return (
    <Formik
      initialValues={{
        title: '',
        content: '',
      }}
      onSubmit={async (values, { setSubmitting }) => {
        setSubmitting(true);
        
        try {
          // Simulate API call
          await new Promise(resolve => setTimeout(resolve, 2000));
          
          alert('Form submitted successfully!');
        } catch (error) {
          console.error('Submission error:', error);
        } finally {
          setSubmitting(false);
        }
      }}
    >
      {({ values, handleChange, isSubmitting }) => (
        <Form>
          <div>
            <label htmlFor="title">Title</label>
            <Field
              id="title"
              name="title"
              type="text"
              placeholder="Enter a title"
              onChange={handleChange}
              value={values.title}
            />
          </div>
          
          <div>
            <label htmlFor="content">Content</label>
            <Field
              id="content"
              name="content"
              as="textarea"
              placeholder="Enter content"
              rows="4"
              onChange={handleChange}
              value={values.content}
            />
          </div>
          
          <button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Submitting...' : 'Submit'}
          </button>
        </Form>
      )}
    </Formik>
  );
};
      `}</pre>
    </div>
  );
}

// Example 6: Multi-Step Form
function MultiStepFormExample() {
  const [step, setStep] = useState(1);
  const [submittedData, setSubmittedData] = useState(null);
  const [formData, setFormData] = useState({
    // Step 1
    firstName: '',
    lastName: '',
    email: '',
    // Step 2
    address: '',
    city: '',
    zipCode: '',
    // Step 3
    paymentMethod: 'credit',
    cardNumber: '',
  });
  
  const nextStep = () => {
    if (step < 3) {
      setStep(step + 1);
    }
  };
  
  const prevStep = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };
  
  const handleSubmit = (values) => {
    setSubmittedData(values);
  };
  
  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div>
            <h3>Step 1: Personal Information</h3>
            <div className="form-group">
              <label htmlFor="firstName">First Name</label>
              <input
                id="firstName"
                name="firstName"
                type="text"
                value={formData.firstName}
                onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="lastName">Last Name</label>
              <input
                id="lastName"
                name="lastName"
                type="text"
                value={formData.lastName}
                onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                required
              />
            </div>
          </div>
        );
      case 2:
        return (
          <div>
            <h3>Step 2: Address</h3>
            <div className="form-group">
              <label htmlFor="address">Address</label>
              <input
                id="address"
                name="address"
                type="text"
                value={formData.address}
                onChange={(e) => setFormData({...formData, address: e.target.value})}
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="city">City</label>
              <input
                id="city"
                name="city"
                type="text"
                value={formData.city}
                onChange={(e) => setFormData({...formData, city: e.target.value})}
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="zipCode">Zip Code</label>
              <input
                id="zipCode"
                name="zipCode"
                type="text"
                value={formData.zipCode}
                onChange={(e) => setFormData({...formData, zipCode: e.target.value})}
                required
              />
            </div>
          </div>
        );
      case 3:
        return (
          <div>
            <h3>Step 3: Payment</h3>
            <div className="form-group">
              <label htmlFor="paymentMethod">Payment Method</label>
              <select
                id="paymentMethod"
                name="paymentMethod"
                value={formData.paymentMethod}
                onChange={(e) => setFormData({...formData, paymentMethod: e.target.value})}
              >
                <option value="credit">Credit Card</option>
                <option value="debit">Debit Card</option>
                <option value="paypal">PayPal</option>
              </select>
            </div>
            
            <div className="form-group">
              <label htmlFor="cardNumber">Card Number</label>
              <input
                id="cardNumber"
                name="cardNumber"
                type="text"
                value={formData.cardNumber}
                onChange={(e) => setFormData({...formData, cardNumber: e.target.value})}
                required
              />
            </div>
          </div>
        );
      default:
        return null;
    }
  };
  
  return (
    <div className="formik-example">
      <h2>Multi-Step Form</h2>
      <p>Demonstrates a multi-step form with Formik.</p>
      
      <div className="step-indicator">
        <div className={`step ${step >= 1 ? 'active' : ''}`}>1</div>
        <div className={`step ${step >= 2 ? 'active' : ''}`}>2</div>
        <div className={`step ${step >= 3 ? 'active' : ''}`}>3</div>
      </div>
      
      {renderStep()}
      
      <div className="step-navigation">
        {step > 1 && (
          <button type="button" onClick={prevStep}>
            Previous
          </button>
        )}
        
        {step < 3 ? (
          <button type="button" onClick={nextStep}>
            Next
          </button>
        ) : (
          <button type="button" onClick={() => handleSubmit(formData)}>
            Submit
          </button>
        )}
      </div>
      
      {submittedData && (
        <div className="submitted-data">
          <h3>Submitted Data:</h3>
          <pre>{JSON.stringify(submittedData, null, 2)}</pre>
        </div>
      )}
      
      <pre>{`
// Multi-step form with Formik
import React, { useState } from 'react';
import { Formik, Form, Field } from 'formik';

const MultiStepForm = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    // Step 1
    firstName: '',
    lastName: '',
    email: '',
    // Step 2
    address: '',
    city: '',
    zipCode: '',
    // Step 3
    paymentMethod: 'credit',
    cardNumber: '',
  });
  
  const nextStep = () => {
    if (step < 3) {
      setStep(step + 1);
    }
  };
  
  const prevStep = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };
  
  const handleSubmit = (values) => {
    alert(JSON.stringify(values, null, 2));
  };
  
  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div>
            <h3>Step 1: Personal Information</h3>
            <div>
              <label htmlFor="firstName">First Name</label>
              <Field
                id="firstName"
                name="firstName"
                type="text"
                value={formData.firstName}
                onChange={(e) => setFormData({...formData, firstName: e.target.value})}
              />
            </div>
            
            <div>
              <label htmlFor="lastName">Last Name</label>
              <Field
                id="lastName"
                name="lastName"
                type="text"
                value={formData.lastName}
                onChange={(e) => setFormData({...formData, lastName: e.target.value})}
              />
            </div>
            
            <div>
              <label htmlFor="email">Email</label>
              <Field
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
              />
            </div>
          </div>
        );
      case 2:
        return (
          <div>
            <h3>Step 2: Address</h3>
            <div>
              <label htmlFor="address">Address</label>
              <Field
                id="address"
                name="address"
                type="text"
                value={formData.address}
                onChange={(e) => setFormData({...formData, address: e.target.value})}
              />
            </div>
            
            <div>
              <label htmlFor="city">City</label>
              <Field
                id="city"
                name="city"
                type="text"
                value={formData.city}
                onChange={(e) => setFormData({...formData, city: e.target.value})}
              />
            </div>
            
            <div>
              <label htmlFor="zipCode">Zip Code</label>
              <Field
                id="zipCode"
                name="zipCode"
                type="text"
                value={formData.zipCode}
                onChange={(e) => setFormData({...formData, zipCode: e.target.value})}
              />
            </div>
          </div>
        );
      case 3:
        return (
          <div>
            <h3>Step 3: Payment</h3>
            <div>
              <label htmlFor="paymentMethod">Payment Method</label>
              <Field
                id="paymentMethod"
                name="paymentMethod"
                as="select"
                value={formData.paymentMethod}
                onChange={(e) => setFormData({...formData, paymentMethod: e.target.value})}
              >
                <option value="credit">Credit Card</option>
                <option value="debit">Debit Card</option>
                <option value="paypal">PayPal</option>
              </Field>
            </div>
            
            <div>
              <label htmlFor="cardNumber">Card Number</label>
              <Field
                id="cardNumber"
                name="cardNumber"
                type="text"
                value={formData.cardNumber}
                onChange={(e) => setFormData({...formData, cardNumber: e.target.value})}
              />
            </div>
          </div>
        );
      default:
        return null;
    }
  };
  
  return (
    <Formik
      initialValues={formData}
      onSubmit={handleSubmit}
    >
      {({ values }) => (
        <Form>
          <div className="step-indicator">
            <div className={\`step \${step >= 1 ? 'active' : ''}\`}>1</div>
            <div className={\`step \${step >= 2 ? 'active' : ''}\`}>2</div>
            <div className={\`step \${step >= 3 ? 'active' : ''}\`}>3</div>
          </div>
          
          {renderStep()}
          
          <div className="step-navigation">
            {step > 1 && (
              <button type="button" onClick={prevStep}>
                Previous
              </button>
            )}
            
            {step < 3 ? (
              <button type="button" onClick={nextStep}>
                Next
              </button>
            ) : (
              <button type="submit">
                Submit
              </button>
            )}
          </div>
        </Form>
      )}
    </Formik>
  );
};
      `}</pre>
    </div>
  );
}

// Main component that combines all examples
export default function FormikExamples() {
  const [activeExample, setActiveExample] = useState(0);
  
  const examples = [
    { component: BasicFormExample, title: "Basic Form with useFormik Hook" },
    { component: FormikComponentExample, title: "Form with Formik Component" },
    { component: FieldValidationExample, title: "Field-Level Validation" },
    { component: CheckboxGroupExample, title: "Checkbox Group" },
    { component: AsyncSubmissionExample, title: "Async Submission" },
    { component: MultiStepFormExample, title: "Multi-Step Form" }
  ];
  
  const ActiveExampleComponent = examples[activeExample].component;
  
  return (
    <div className="formik-examples">
      <h1>Formik Examples</h1>
      <p>Comprehensive examples demonstrating Formik features and patterns.</p>
      
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
        <h2>About Formik</h2>
        <p>
          Formik is a popular React library that helps you build forms with ease, 
          reducing the boilerplate code and handling form state, validation, and submission.
        </p>
        
        <h3>Key Features:</h3>
        <ul>
          <li><strong>Form State Management</strong>: Handles form state, values, errors, and touched state</li>
          <li><strong>Validation</strong>: Built-in validation with Yup integration</li>
          <li><strong>Field Components</strong>: Field, Form, ErrorMessage components for easy form building</li>
          <li><strong>Custom Validation</strong>: Support for custom validation functions</li>
          <li><strong>Async Submission</strong>: Handle async form submissions with loading states</li>
          <li><strong>Multi-step Forms</strong>: Support for complex multi-step form flows</li>
          <li><strong>Field Arrays</strong>: Handle arrays of fields like checkboxes</li>
          <li><strong>TypeScript Support</strong>: Full TypeScript support with type safety</li>
          <li><strong>Minimal Boilerplate</strong>: Reduce boilerplate code for form handling</li>
        </ul>
        
        <h3>Installation:</h3>
        <pre>{`# Install Formik
npm install formik

# or with yarn
yarn add formik

# Install Yup for validation (recommended)
npm install yup
yarn add yup`}</pre>
        
        <h3>Basic Usage:</h3>
        <pre>{`import React from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';

const SignupForm = () => {
  const formik = useFormik({
    initialValues: {
      firstName: '',
      lastName: '',
      email: '',
    },
    validationSchema: Yup.object({
      firstName: Yup.string().required('Required'),
      lastName: Yup.string().required('Required'),
      email: Yup.string().email('Invalid email').required('Required'),
    }),
    onSubmit: (values, { setSubmitting }) => {
      setTimeout(() => {
        alert(JSON.stringify(values, null, 2));
        setSubmitting(false);
      }, 1000);
    },
  });
  
  return (
    <form onSubmit={formik.handleSubmit}>
      <div>
        <label htmlFor="firstName">First Name</label>
        <input
          id="firstName"
          name="firstName"
          type="text"
          onChange={formik.handleChange}
          value={formik.values.firstName}
        />
        {formik.errors.firstName && <div>{formik.errors.firstName}</div>}
      </div>
      
      <div>
        <label htmlFor="lastName">Last Name</label>
        <input
          id="lastName"
          name="lastName"
          type="text"
          onChange={formik.handleChange}
          value={formik.values.lastName}
        />
        {formik.errors.lastName && <div>{formik.errors.lastName}</div>}
      </div>
      
      <div>
        <label htmlFor="email">Email</label>
        <input
          id="email"
          name="email"
          type="email"
          onChange={formik.handleChange}
          value={formik.values.email}
        />
        {formik.errors.email && <div>{formik.errors.email}</div>}
      </div>
      
      <button type="submit" disabled={formik.isSubmitting}>
        {formik.isSubmitting ? 'Submitting...' : 'Submit'}
      </button>
    </form>
  );
};`}</pre>
      </div>
    </div>
  );
}