import React, { useState, useEffect, useRef } from 'react';

// Note: These examples demonstrate React Hook Form concepts in a web-compatible format
// In a real app, you would install react-hook-form and use its actual hooks

// Example 1: Basic Form Setup
function BasicFormExample() {
  const [formData, setFormData] = useState(null);
  const [errors, setErrors] = useState({});
  
  // Simulate useForm hook
  const mockUseForm = (defaultValues = {}) => {
    const [values, setValues] = useState(defaultValues);
    const [formErrors, setFormErrors] = useState({});
    
    const register = (name, validation = {}) => ({
      name,
      onChange: (e) => {
        const value = e.target.value;
        setValues(prev => ({ ...prev, [name]: value }));
        
        // Basic validation
        if (validation.required && !value) {
          setFormErrors(prev => ({ ...prev, [name]: 'This field is required' }));
        } else {
          setFormErrors(prev => ({ ...prev, [name]: undefined }));
        }
      },
      value: values[name] || '',
      error: formErrors[name]
    });
    
    const handleSubmit = (callback) => (e) => {
      e.preventDefault();
      setFormData(values);
      callback(values);
    };
    
    return {
      register,
      handleSubmit,
      formState: { errors: formErrors },
      values
    };
  };
  
  const { register, handleSubmit, formState } = mockUseForm();
  
  return (
    <div className="rhf-example">
      <h2>Basic Form Setup</h2>
      <p>Demonstrates React Hook Form basic usage.</p>
      
      <form onSubmit={handleSubmit((data) => console.log(data))}>
        <div className="form-group">
          <label>First Name:</label>
          <input {...register('firstName')} />
          {formState.errors.firstName && (
            <p className="error">{formState.errors.firstName}</p>
          )}
        </div>
        
        <div className="form-group">
          <label>Last Name:</label>
          <input {...register('lastName', { required: true })} />
          {formState.errors.lastName && (
            <p className="error">{formState.errors.lastName}</p>
          )}
        </div>
        
        <div className="form-group">
          <label>Age:</label>
          <input {...register('age', { pattern: /\d+/ })} />
          {formState.errors.age && (
            <p className="error">Please enter number for age.</p>
          )}
        </div>
        
        <button type="submit">Submit</button>
      </form>
      
      {formData && (
        <div className="submitted-data">
          <h3>Submitted Data:</h3>
          <pre>{JSON.stringify(formData, null, 2)}</pre>
        </div>
      )}
      
      <pre>{`
// React Hook Form Basic Usage:
import { useForm } from 'react-hook-form';

function BasicForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = (data) => {
    console.log('Form data:', data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input {...register('firstName')} placeholder="First Name" />
      {errors.firstName && <p>{errors.firstName.message}</p>}
      
      <input {...register('lastName', { required: true })} placeholder="Last Name" />
      {errors.lastName && <p>{errors.lastName.message}</p>}
      
      <input {...register('age', { pattern: /\d+/ })} placeholder="Age" />
      {errors.age && <p>{errors.age.message}</p>}
      
      <button type="submit">Submit</button>
    </form>
  );
}
      `}</pre>
    </div>
  );
}

// Example 2: Form Validation
function ValidationExample() {
  const [validationRules, setValidationRules] = useState('onChange');
  const [formData, setFormData] = useState(null);
  
  // Simulate form with validation
  const mockUseForm = (defaultValues = {}) => {
    const [values, setValues] = useState(defaultValues);
    const [formErrors, setFormErrors] = useState({});
    
    const validateField = (name, value, rules) => {
      if (rules.required && !value) {
        return `${name} is required`;
      }
      if (rules.minLength && value.length < rules.minLength) {
        return `${name} must be at least ${rules.minLength} characters`;
      }
      if (rules.pattern && !rules.pattern.test(value)) {
        return `${name} format is invalid`;
      }
      return null;
    };
    
    const register = (name, validation = {}) => ({
      name,
      onChange: (e) => {
        const value = e.target.value;
        setValues(prev => ({ ...prev, [name]: value }));
        
        if (validationRules === 'onChange') {
          const error = validateField(name, value, validation);
          setFormErrors(prev => ({ ...prev, [name]: error }));
        }
      },
      onBlur: (e) => {
        const value = e.target.value;
        if (validationRules === 'onBlur') {
          const error = validateField(name, value, validation);
          setFormErrors(prev => ({ ...prev, [name]: error }));
        }
      },
      value: values[name] || '',
      error: formErrors[name]
    });
    
    const handleSubmit = (callback) => (e) => {
      e.preventDefault();
      
      // Validate all fields
      const allErrors = {};
      Object.keys(validation).forEach(name => {
        const error = validateField(name, values[name], validation[name]);
        if (error) allErrors[name] = error;
      });
      
      setFormErrors(allErrors);
      
      if (Object.keys(allErrors).length === 0) {
        setFormData(values);
        callback(values);
      }
    };
    
    return {
      register,
      handleSubmit,
      formState: { errors: formErrors },
      values
    };
  };
  
  const { register, handleSubmit, formState } = mockUseForm({
    firstName: { required: true, minLength: 2 },
    email: { required: true, pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/ },
    password: { required: true, minLength: 8 }
  });
  
  return (
    <div className="rhf-example">
      <h2>Form Validation</h2>
      <p>Demonstrates different validation strategies.</p>
      
      <div className="validation-controls">
        <label>Validation Mode:</label>
        <select value={validationRules} onChange={(e) => setValidationRules(e.target.value)}>
          <option value="onChange">Validate on Change</option>
          <option value="onBlur">Validate on Blur</option>
          <option value="onSubmit">Validate on Submit</option>
        </select>
      </div>
      
      <form onSubmit={handleSubmit((data) => console.log(data))}>
        <div className="form-group">
          <label>First Name:</label>
          <input {...register('firstName')} />
          {formState.errors.firstName && (
            <p className="error">{formState.errors.firstName}</p>
          )}
        </div>
        
        <div className="form-group">
          <label>Email:</label>
          <input {...register('email')} type="email" />
          {formState.errors.email && (
            <p className="error">{formState.errors.email}</p>
          )}
        </div>
        
        <div className="form-group">
          <label>Password:</label>
          <input {...register('password')} type="password" />
          {formState.errors.password && (
            <p className="error">{formState.errors.password}</p>
          )}
        </div>
        
        <button type="submit">Submit</button>
      </form>
      
      {formData && (
        <div className="submitted-data">
          <h3>Validated Data:</h3>
          <pre>{JSON.stringify(formData, null, 2)}</pre>
        </div>
      )}
      
      <pre>{`
// React Hook Form Validation:
import { useForm } from 'react-hook-form';

function ValidationForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    trigger,
  } = useForm({
    mode: 'onBlur', // or 'onChange', 'onSubmit', 'onTouched'
    defaultValues: {
      firstName: '',
      email: '',
      password: ''
    }
  });

  const onSubmit = (data) => {
    console.log('Validated data:', data);
  };

  // Manual validation trigger
  const validateEmail = () => {
    trigger('email');
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input
        {...register('firstName', {
          required: 'First name is required',
          minLength: {
            value: 2,
            message: 'First name must be at least 2 characters'
          }
        })}
        placeholder="First Name"
      />
      {errors.firstName && <p>{errors.firstName.message}</p>}
      
      <input
        {...register('email', {
          required: 'Email is required',
          pattern: {
            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
            message: 'Invalid email format'
          }
        })}
        placeholder="Email"
        onBlur={validateEmail}
      />
      {errors.email && <p>{errors.email.message}</p>}
      
      <input
        {...register('password', {
          required: 'Password is required',
          minLength: {
            value: 8,
            message: 'Password must be at least 8 characters'
          }
        })}
        type="password"
        placeholder="Password"
      />
      {errors.password && <p>{errors.password.message}</p>}
      
      <button type="submit">Submit</button>
    </form>
  );
}

// Validation with Yup schema
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

const schema = yup.object().shape({
  name: yup.string().required('Name is required'),
  email: yup.string().email('Invalid email').required('Email is required'),
  age: yup.number().positive('Age must be positive').required('Age is required'),
});

function YupValidationForm() {
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm({
    resolver: yupResolver(schema)
  });

  return (
    <form onSubmit={handleSubmit(console.log)}>
      <input {...register('name')} />
      {errors.name && <p>{errors.name.message}</p>}
      
      <input {...register('email')} />
      {errors.email && <p>{errors.email.message}</p>}
      
      <input {...register('age')} type="number" />
      {errors.age && <p>{errors.age.message}</p>}
      
      <button type="submit">Submit</button>
    </form>
  );
}
      `}</pre>
    </div>
  );
}

// Example 3: Dynamic Forms with Field Arrays
function FieldArrayExample() {
  const [formData, setFormData] = useState(null);
  
  // Simulate useFieldArray hook
  const mockUseFieldArray = (name, defaultValue = []) => {
    const [fields, setFields] = useState(defaultValue);
    const [values, setValues] = useState(defaultValue);
    
    const append = (value) => {
      const newField = { id: Date.now(), ...value };
      setFields(prev => [...prev, newField]);
      setValues(prev => [...prev, newField]);
    };
    
    const remove = (index) => {
      setFields(prev => prev.filter((_, i) => i !== index));
      setValues(prev => prev.filter((_, i) => i !== index));
    };
    
    return {
      fields,
      append,
      remove,
      register: (index, fieldName) => ({
        name: \`\${name}[\${index}].\${fieldName}\`,
        value: values[index]?.[fieldName] || '',
        onChange: (e) => {
          const newValues = [...values];
          if (!newValues[index]) newValues[index] = {};
          newValues[index][fieldName] = e.target.value;
          setValues(newValues);
        }
      })
    };
  };
  
  const { fields, append, remove, register } = mockUseFieldArray('users', [
    { name: '', email: '' }
  ]);
  
  const mockUseForm = () => {
    const handleSubmit = (callback) => (e) => {
      e.preventDefault();
      setFormData(values);
      callback(values);
    };
    
    return { handleSubmit };
  };
  
  const { handleSubmit } = mockUseForm();
  
  return (
    <div className="rhf-example">
      <h2>Dynamic Forms with Field Arrays</h2>
      <p>Demonstrates managing dynamic form fields.</p>
      
      <form onSubmit={handleSubmit((data) => console.log(data))}>
        {fields.map((field, index) => (
          <div key={field.id} className="field-array-item">
            <h4>User {index + 1}</h4>
            
            <div className="form-group">
              <label>Name:</label>
              <input {...register(index, 'name')} />
            </div>
            
            <div className="form-group">
              <label>Email:</label>
              <input {...register(index, 'email')} type="email" />
            </div>
            
            <button type="button" onClick={() => remove(index)}>
              Remove User
            </button>
          </div>
        ))}
        
        <button type="button" onClick={() => append({ name: '', email: '' })}>
          Add User
        </button>
        
        <button type="submit">Submit All</button>
      </form>
      
      {formData && (
        <div className="submitted-data">
          <h3>Submitted Users:</h3>
          <pre>{JSON.stringify(formData.users, null, 2)}</pre>
        </div>
      )}
      
      <pre>{`
// React Hook Form Field Arrays:
import { useForm, useFieldArray } from 'react-hook-form';

function DynamicForm() {
  const {
    register,
    handleSubmit,
    control,
  } = useForm({
    defaultValues: {
      users: [{ name: '', email: '' }]
    }
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'users'
  });

  const onSubmit = (data) => {
    console.log('Form data:', data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      {fields.map((field, index) => (
        <div key={field.id}>
          <h4>User {index + 1}</h4>
          
          <input
            {...register(\`users.\${index}.name\`)}
            placeholder="Name"
          />
          
          <input
            {...register(\`users.\${index}.email\`)}
            placeholder="Email"
            type="email"
          />
          
          <button type="button" onClick={() => remove(index)}>
            Remove
          </button>
        </div>
      ))}
      
      <button type="button" onClick={() => append({ name: '', email: '' })}>
        Add User
      </button>
      
      <button type="submit">Submit</button>
    </form>
  );
}

// Nested field arrays
function NestedFieldArrayForm() {
  const { control, register, handleSubmit } = useForm();
  
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'users'
  });

  return (
    <form onSubmit={handleSubmit(console.log)}>
      {fields.map((field, index) => (
        <div key={field.id}>
          <input {...register(\`users.\${index}.name\`)} />
          
          {/* Nested field array */}
          <NestedFields nestIndex={index} />
          
          <button type="button" onClick={() => remove(index)}>
            Remove
          </button>
        </div>
      ))}
      
      <button type="button" onClick={() => append({ name: '' })}>
        Add User
      </button>
    </form>
  );
}

function NestedFields({ nestIndex }) {
  const { control, register } = useFormContext();
  
  const { fields, append, remove } = useFieldArray({
    control,
    name: \`users.\${nestIndex}.phones\`
  });

  return (
    <div>
      {fields.map((field, index) => (
        <div key={field.id}>
          <input
            {...register(\`users.\${nestIndex}.phones.\${index}.number\`)}
            placeholder="Phone number"
          />
          <button type="button" onClick={() => remove(index)}>
            Remove Phone
          </button>
        </div>
      ))}
      
      <button type="button" onClick={() => append({ number: '' })}>
        Add Phone
      </button>
    </div>
  );
}
      `}</pre>
    </div>
  );
}

// Example 4: Form Context and Provider
function FormContextExample() {
  const [formData, setFormData] = useState(null);
  
  // Simulate FormProvider and useFormContext
  const mockFormProvider = ({ children, ...methods }) => {
    // In real React Hook Form, this would provide context
    return (
      <div className="form-context">
        {children}
      </div>
    );
  };
  
  const mockUseFormContext = () => {
    // In real React Hook Form, this would consume context
    return {
      register: (name) => ({ name, onChange: () => {} }),
      handleSubmit: (cb) => (e) => {
        e.preventDefault();
        cb({ contextValue: 'from context' });
      }
    };
  };
  
  const NestedComponent = () => {
    const { register, handleSubmit } = mockUseFormContext();
    
    return (
      <div className="nested-component">
        <h4>Nested Component</h4>
        <input {...register('nestedField')} placeholder="Nested field" />
        <button onClick={handleSubmit(console.log)}>
          Submit from Nested
        </button>
      </div>
    );
  };
  
  const mockUseForm = () => {
    const handleSubmit = (callback) => (e) => {
      e.preventDefault();
      setFormData({ submitted: true });
      callback({ topLevelValue: 'from top level' });
    };
    
    return {
      register: (name) => ({ name, onChange: () => {} }),
      handleSubmit
    };
  };
  
  const methods = mockUseForm();
  
  return (
    <div className="rhf-example">
      <h2>Form Context and Provider</h2>
      <p>Demonstrates sharing form state across components.</p>
      
      <mockFormProvider {...methods}>
        <form onSubmit={methods.handleSubmit((data) => console.log(data))}>
          <input {...methods.register('topLevelField')} placeholder="Top level field" />
          <button type="submit">Submit Top Level</button>
        </form>
        
        <NestedComponent />
      </mockFormProvider>
      
      {formData && (
        <div className="submitted-data">
          <h3>Form Submitted!</h3>
          <pre>{JSON.stringify(formData, null, 2)}</pre>
        </div>
      )}
      
      <pre>{`
// React Hook Form Context:
import { useForm, FormProvider, useFormContext } from 'react-hook-form';

// Parent component with FormProvider
function ParentForm() {
  const methods = useForm({
    defaultValues: {
      firstName: '',
      lastName: ''
    }
  });

  return (
    <FormProvider {...methods}>
      <ChildForm />
    </FormProvider>
  );
}

// Child component using useFormContext
function ChildForm() {
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useFormContext(); // Access form methods from context

  return (
    <form onSubmit={handleSubmit(console.log)}>
      <input {...register('firstName')} placeholder="First Name" />
      {errors.firstName && <p>{errors.firstName.message}</p>}
      
      <input {...register('lastName')} placeholder="Last Name" />
      {errors.lastName && <p>{errors.lastName.message}</p>}
      
      <button type="submit">Submit</button>
    </form>
  );
}

// Deeply nested components
function DeeplyNestedComponent() {
  const { register } = useFormContext();
  
  return (
    <div>
      <input {...register('deeplyNested.field')} placeholder="Deeply nested field" />
    </div>
  );
}

// Multiple form contexts
function MultipleForms() {
  const userFormMethods = useForm({ mode: 'onChange' });
  const settingsFormMethods = useForm({ mode: 'onBlur' });

  return (
    <div>
      <FormProvider {...userFormMethods}>
        <UserForm />
      </FormProvider>
      
      <FormProvider {...settingsFormMethods}>
        <SettingsForm />
      </FormProvider>
    </div>
  );
}
      `}</pre>
    </div>
  );
}

// Example 5: Controller Component
function ControllerExample() {
  const [formData, setFormData] = useState(null);
  const [selectValue, setSelectValue] = useState('');
  
  // Simulate Controller component
  const mockController = ({ name, control, render }) => {
    const field = control.fields[name];
    
    return render({
      value: field.value || '',
      onChange: (value) => {
        control.setFieldValue(name, value);
      },
      onBlur: () => {
        control.setFieldTouched(name, true);
      }
    });
  };
  
  const mockUseForm = () => {
    const [values, setValues] = useState({});
    const [errors, setErrors] = useState({});
    
    const control = {
      fields: values,
      setFieldValue: (name, value) => {
        setValues(prev => ({ ...prev, [name]: value }));
      },
      setFieldTouched: (name, touched) => {
        // Handle touched state
      }
    };
    
    const register = (name) => ({
      name,
      value: values[name] || ''
    });
    
    const handleSubmit = (callback) => (e) => {
      e.preventDefault();
      setFormData(values);
      callback(values);
    };
    
    return { control, register, handleSubmit };
  };
  
  const { control, register, handleSubmit } = mockUseForm();
  
  return (
    <div className="rhf-example">
      <h2>Controller Component</h2>
      <p>Demonstrates integrating custom components with React Hook Form.</p>
      
      <form onSubmit={handleSubmit((data) => console.log(data))}>
        {/* Regular input */}
        <div className="form-group">
          <label>Regular Input:</label>
          <input {...register('regularInput')} placeholder="Regular input" />
        </div>
        
        {/* Controller with custom input */}
        <div className="form-group">
          <label>Custom Input with Controller:</label>
          <mockController
            name="customInput"
            control={control}
            render={({ value, onChange }) => (
              <CustomInput
                value={value}
                onChange={onChange}
                placeholder="Custom styled input"
              />
            )}
          />
        </div>
        
        {/* Controller with select */}
        <div className="form-group">
          <label>Custom Select with Controller:</label>
          <mockController
            name="customSelect"
            control={control}
            render={({ value, onChange }) => (
              <CustomSelect
                value={value}
                onChange={onChange}
                options={[
                  { value: 'option1', label: 'Option 1' },
                  { value: 'option2', label: 'Option 2' },
                  { value: 'option3', label: 'Option 3' }
                ]}
              />
            )}
          />
        </div>
        
        <button type="submit">Submit</button>
      </form>
      
      {formData && (
        <div className="submitted-data">
          <h3>Submitted Data:</h3>
          <pre>{JSON.stringify(formData, null, 2)}</pre>
        </div>
      )}
      
      <pre>{`
// React Hook Form Controller:
import { useForm, Controller } from 'react-hook-form';
import { Select } from 'your-select-library';
import { DatePicker } from 'your-date-picker-library';

function CustomComponentsForm() {
  const {
    control,
    handleSubmit,
    formState: { errors }
  } = useForm();

  return (
    <form onSubmit={handleSubmit(console.log)}>
      {/* Controller with custom input */}
      <Controller
        name="firstName"
        control={control}
        rules={{ required: true }}
        render={({ field, fieldState }) => (
          <CustomInput
            {...field}
            error={fieldState.error}
            placeholder="Custom styled input"
          />
        )}
      />
      
      {/* Controller with select */}
      <Controller
        name="country"
        control={control}
        render={({ field }) => (
          <Select
            {...field}
            options={[
              { value: 'us', label: 'United States' },
              { value: 'uk', label: 'United Kingdom' },
              { value: 'ca', label: 'Canada' }
            ]}
          />
        )}
      />
      
      {/* Controller with date picker */}
      <Controller
        name="birthDate"
        control={control}
        render={({ field }) => (
          <DatePicker
            {...field}
            selected={field.value}
            onChange={field.onChange}
          />
        )}
      />
      
      {errors.firstName && <p>{errors.firstName.message}</p>}
      {errors.country && <p>{errors.country.message}</p>}
      {errors.birthDate && <p>{errors.birthDate.message}</p>}
      
      <button type="submit">Submit</button>
    </form>
  );
}

// Custom Input Component
const CustomInput = React.forwardRef(({ value, onChange, error, ...props }, ref) => (
  <div className="custom-input">
    <input
      ref={ref}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className={error ? 'error' : ''}
      {...props}
    />
    {error && <span className="error-message">{error}</span>}
  </div>
));

// Custom Select Component
const CustomSelect = ({ value, onChange, options, ...props }) => (
  <select
    value={value}
    onChange={(e) => onChange(e.target.value)}
    {...props}
  >
    {options.map(option => (
      <option key={option.value} value={option.value}>
        {option.label}
      </option>
    ))}
  </select>
);
      `}</pre>
    </div>
  );
}

// Example 6: Watch and Reset
function WatchResetExample() {
  const [watchValues, setWatchValues] = useState({});
  const [isDirty, setIsDirty] = useState(false);
  
  // Simulate watch and reset functionality
  const mockUseForm = (defaultValues = {}) => {
    const [values, setValues] = useState(defaultValues);
    const [defaultVals] = useState(defaultValues);
    
    const watch = (fieldNames) => {
      if (typeof fieldNames === 'string') {
        return values[fieldNames];
      }
      if (Array.isArray(fieldNames)) {
        return fieldNames.reduce((acc, name) => {
          acc[name] = values[name];
          return acc;
        }, {});
      }
      return values;
    };
    
    const reset = (newValues = defaultVals) => {
      setValues(newValues);
      setIsDirty(false);
    };
    
    const register = (name, validation = {}) => ({
      name,
      onChange: (e) => {
        const value = e.target.value;
        setValues(prev => ({ ...prev, [name]: value }));
        setIsDirty(true);
      },
      value: values[name] || ''
    });
    
    return {
      register,
      watch,
      reset,
      formState: { isDirty }
    };
  };
  
  const { register, watch, reset, formState } = mockUseForm({
    firstName: 'John',
    lastName: 'Doe',
    email: 'john@example.com'
  });
  
  // Update watched values
  useEffect(() => {
    const allValues = watch();
    setWatchValues(allValues);
  }, [watch]);
  
  const handleReset = () => {
    reset({
      firstName: 'John',
      lastName: 'Doe',
      email: 'john@example.com'
    });
  };
  
  const handlePartialReset = () => {
    reset({
      firstName: '',
      lastName: ''
    });
  };
  
  return (
    <div className="rhf-example">
      <h2>Watch and Reset</h2>
      <p>Demonstrates form state monitoring and resetting.</p>
      
      <div className="form-controls">
        <button onClick={handleReset}>Reset All</button>
        <button onClick={handlePartialReset}>Reset First & Last Name</button>
      </div>
      
      <div className="form-status">
        <p>Form is dirty: {formState.isDirty ? 'Yes' : 'No'}</p>
      </div>
      
      <form>
        <div className="form-group">
          <label>First Name:</label>
          <input {...register('firstName')} />
          <p>Watched value: {watchValues.firstName}</p>
        </div>
        
        <div className="form-group">
          <label>Last Name:</label>
          <input {...register('lastName')} />
          <p>Watched value: {watchValues.lastName}</p>
        </div>
        
        <div className="form-group">
          <label>Email:</label>
          <input {...register('email')} type="email" />
          <p>Watched value: {watchValues.email}</p>
        </div>
        
        <div className="form-group">
          <label>Watch All:</label>
          <pre>{JSON.stringify(watchValues, null, 2)}</pre>
        </div>
      </form>
      
      <pre>{`
// React Hook Form Watch and Reset:
import { useForm } from 'react-hook-form';

function WatchResetForm() {
  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { isDirty, dirtyFields }
  } = useForm({
    defaultValues: {
      firstName: 'John',
      lastName: 'Doe',
      email: 'john@example.com'
    }
  });

  // Watch specific fields
  const firstName = watch('firstName');
  const lastName = watch('lastName');
  
  // Watch multiple fields
  const nameFields = watch(['firstName', 'lastName']);
  
  // Watch all fields
  const allValues = watch();
  
  // Watch with callback
  useEffect(() => {
    const subscription = watch((value, { name, type }) => {
      console.log(\`Field \${name} changed to:\`, value);
    });
    
    return () => subscription.unsubscribe();
  }, [watch]);

  const handleReset = () => {
    reset(); // Reset to default values
  };

  const handleResetValues = () => {
    reset({
      firstName: '',
      lastName: '',
      email: ''
    });
  };

  return (
    <form onSubmit={handleSubmit(console.log)}>
      <input {...register('firstName')} />
      <p>First name: {firstName}</p>
      
      <input {...register('lastName')} />
      <p>Last name: {lastName}</p>
      
      <input {...register('email')} />
      <p>Email: {nameFields.email}</p>
      
      <div>
        <h4>All values:</h4>
        <pre>{JSON.stringify(allValues, null, 2)}</pre>
      </div>
      
      <p>Form is dirty: {isDirty ? 'Yes' : 'No'}</p>
      <p>Dirty fields: {Object.keys(dirtyFields).join(', ')}</p>
      
      <button type="button" onClick={handleReset}>Reset to Defaults</button>
      <button type="button" onClick={handleResetValues}>Reset to Empty</button>
      <button type="submit">Submit</button>
    </form>
  );
}
      `}</pre>
    </div>
  );
}

// Example 7: Async Submit and Server Validation
function AsyncSubmitExample() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [serverErrors, setServerErrors] = useState({});
  const [submitData, setSubmitData] = useState(null);
  
  // Simulate async form submission
  const mockUseForm = () => {
    const [values, setValues] = useState({});
    
    const register = (name) => ({
      name,
      onChange: (e) => {
        setValues(prev => ({ ...prev, [name]: e.target.value }));
      },
      value: values[name] || ''
    });
    
    const handleSubmit = (callback) => async (e) => {
      e.preventDefault();
      setIsSubmitting(true);
      setServerErrors({});
      
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // Simulate server validation errors
        if (values.email === 'error@example.com') {
          setServerErrors({
            email: 'This email is already registered'
          });
        } else {
          setSubmitData(values);
        }
      } catch (error) {
        setServerErrors({
          general: 'Server error occurred'
        });
      } finally {
        setIsSubmitting(false);
      }
    };
    
    return { register, handleSubmit };
  };
  
  const { register, handleSubmit } = mockUseForm();
  
  return (
    <div className="rhf-example">
      <h2>Async Submit and Server Validation</h2>
      <p>Demonstrates async form submission with server validation.</p>
      
      <form onSubmit={handleSubmit((data) => console.log(data))}>
        <div className="form-group">
          <label>Name:</label>
          <input {...register('name')} />
          {serverErrors.name && (
            <p className="error">{serverErrors.name}</p>
          )}
        </div>
        
        <div className="form-group">
          <label>Email:</label>
          <input {...register('email')} type="email" />
          {serverErrors.email && (
            <p className="error">{serverErrors.email}</p>
          )}
          <small>Try "error@example.com" to see server validation error</small>
        </div>
        
        <div className="form-group">
          <label>Password:</label>
          <input {...register('password')} type="password" />
          {serverErrors.password && (
            <p className="error">{serverErrors.password}</p>
          )}
        </div>
        
        {serverErrors.general && (
          <div className="error general-error">
            {serverErrors.general}
          </div>
        )}
        
        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Submitting...' : 'Submit'}
        </button>
      </form>
      
      {submitData && (
        <div className="submitted-data">
          <h3>Successfully Submitted!</h3>
          <pre>{JSON.stringify(submitData, null, 2)}</pre>
        </div>
      )}
      
      <pre>{`
// React Hook Form Async Submit:
import { useForm } from 'react-hook-form';

function AsyncSubmitForm() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError
  } = useForm();

  const onSubmit = async (data) => {
    try {
      // Make API call
      const response = await submitToServer(data);
      
      if (response.success) {
        console.log('Form submitted successfully');
      } else {
        // Set server-side validation errors
        Object.keys(response.errors).forEach(field => {
          setError(field, {
            type: 'server',
            message: response.errors[field]
          });
        });
      }
    } catch (error) {
      setError('root.serverError', {
        type: 'server',
        message: 'Network error occurred'
      });
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input {...register('name')} />
      {errors.name && <p>{errors.name.message}</p>}
      
      <input {...register('email')} type="email" />
      {errors.email && <p>{errors.email.message}</p>}
      
      {errors.root?.serverError && (
        <p className="server-error">{errors.root.serverError.message}</p>
      )}
      
      <button type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Submitting...' : 'Submit'}
      </button>
    </form>
  );
}

// Simulated API call
async function submitToServer(data) {
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  if (data.email === 'taken@example.com') {
    return {
      success: false,
      errors: {
        email: 'Email is already taken'
      }
    };
  }
  
  return {
    success: true,
    data: { id: Date.now(), ...data }
  };
}
      `}</pre>
    </div>
  );
}

// Example 8: Conditional Fields and Dependent Validation
function ConditionalFieldsExample() {
  const [formData, setFormData] = useState(null);
  const [showAdvanced, setShowAdvanced] = useState(false);
  
  // Simulate conditional form logic
  const mockUseForm = (defaultValues = {}) => {
    const [values, setValues] = useState(defaultValues);
    const [errors, setErrors] = useState({});
    
    const validateField = (name, value, rules, allValues) => {
      if (rules.required && !value) {
        return `${name} is required`;
      }
      if (rules.validate && !rules.validate(value, allValues)) {
        return rules.message;
      }
      return null;
    };
    
    const register = (name, validation = {}) => ({
      name,
      onChange: (e) => {
        const value = e.target.value;
        setValues(prev => ({ ...prev, [name]: value }));
        
        // Revalidate dependent fields
        Object.keys(validation).forEach(fieldName => {
          const rules = validation[fieldName];
          if (rules?.validate) {
            const error = validateField(fieldName, values[fieldName], rules, { ...values, [name]: value });
            setErrors(prev => ({ ...prev, [fieldName]: error }));
          }
        });
      },
      value: values[name] || '',
      error: errors[name]
    });
    
    const handleSubmit = (callback) => (e) => {
      e.preventDefault();
      
      // Validate all fields
      const allErrors = {};
      Object.keys(values).forEach(name => {
        const validation = register(name).validation;
        const error = validateField(name, values[name], validation, values);
        if (error) allErrors[name] = error;
      });
      
      setErrors(allErrors);
      
      if (Object.keys(allErrors).length === 0) {
        setFormData(values);
        callback(values);
      }
    };
    
    return {
      register,
      handleSubmit,
      formState: { errors },
      values
    };
  };
  
  const { register, handleSubmit, formState, values } = mockUseForm({
    accountType: '',
    email: '',
    password: '',
    confirmPassword: '',
    company: ''
  });
  
  const isAccountTypeCompany = values.accountType === 'company';
  
  return (
    <div className="rhf-example">
      <h2>Conditional Fields and Dependent Validation</h2>
      <p>Demonstrates dynamic form fields based on user input.</p>
      
      <form onSubmit={handleSubmit((data) => console.log(data))}>
        <div className="form-group">
          <label>Account Type:</label>
          <select {...register('accountType')} onChange={(e) => setShowAdvanced(e.target.value === 'company')}>
            <option value="">Select account type</option>
            <option value="personal">Personal</option>
            <option value="company">Company</option>
          </select>
        </div>
        
        <div className="form-group">
          <label>Email:</label>
          <input {...register('email', { required: true })} type="email" />
          {formState.errors.email && (
            <p className="error">{formState.errors.email}</p>
          )}
        </div>
        
        <div className="form-group">
          <label>Password:</label>
          <input {...register('password', { required: true })} type="password" />
          {formState.errors.password && (
            <p className="error">{formState.errors.password}</p>
          )}
        </div>
        
        <div className="form-group">
          <label>Confirm Password:</label>
          <input
            {...register('confirmPassword', {
              required: true,
              validate: value => value === values.password || 'Passwords must match'
            })}
            type="password"
          />
          {formState.errors.confirmPassword && (
            <p className="error">{formState.errors.confirmPassword}</p>
          )}
        </div>
        
        {/* Conditional company fields */}
        {showAdvanced && (
          <div className="advanced-fields">
            <h4>Company Information</h4>
            
            <div className="form-group">
              <label>Company Name:</label>
              <input
                {...register('company', {
                  required: isAccountTypeCompany,
                  validate: value => isAccountTypeCompany && !value ? 'Company name is required' : undefined
                })}
              />
              {formState.errors.company && (
                <p className="error">{formState.errors.company}</p>
              )}
            </div>
          </div>
        )}
        
        <button type="submit">Submit</button>
      </form>
      
      {formData && (
        <div className="submitted-data">
          <h3>Submitted Data:</h3>
          <pre>{JSON.stringify(formData, null, 2)}</pre>
        </div>
      )}
      
      <pre>{`
// React Hook Form Conditional Fields:
import { useForm, watch } from 'react-hook-form';

function ConditionalForm() {
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm();

  const accountType = watch('accountType');
  const password = watch('password');

  return (
    <form onSubmit={handleSubmit(console.log)}>
      <select {...register('accountType')}>
        <option value="">Select account type</option>
        <option value="personal">Personal</option>
        <option value="business">Business</option>
      </select>
      
      <input {...register('email')} type="email" />
      {errors.email && <p>{errors.email.message}</p>}
      
      <input {...register('password')} type="password" />
      {errors.password && <p>{errors.password.message}</p>}
      
      {/* Conditional field */}
      {accountType === 'business' && (
        <div>
          <input
            {...register('companyName', {
              required: accountType === 'business'
            })}
            placeholder="Company Name"
          />
          {errors.companyName && <p>{errors.companyName.message}</p>}
        </div>
      )}
      
      {/* Dependent validation */}
      <input
        {...register('confirmPassword', {
          required: true,
          validate: value => value === password || 'Passwords must match'
        })}
        type="password"
        placeholder="Confirm Password"
      />
      {errors.confirmPassword && <p>{errors.confirmPassword.message}</p>}
      
      <button type="submit">Submit</button>
    </form>
  );
}

// Dynamic field rendering
function DynamicFieldsForm() {
  const { control, register, handleSubmit } = useForm();
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'users'
  });
  const hasUsers = fields.length > 0;

  return (
    <form onSubmit={handleSubmit(console.log)}>
      {fields.map((field, index) => (
        <div key={field.id}>
          <input {...register(\`users.\${index}.name\`)} />
          
          {/* Show email field only if name is entered */}
          {field.name && (
            <input {...register(\`users.\${index}.email\`)} type="email" />
          )}
          
          <button type="button" onClick={() => remove(index)}>
            Remove
          </button>
        </div>
      ))}
      
      <button type="button" onClick={() => append({})}>
        Add User
      </button>
      
      {/* Show submit button only if at least one user has name */}
      {hasUsers && <button type="submit">Submit</button>}
    </form>
  );
}
      `}</pre>
    </div>
  );
}

// Main component that combines all examples
export default function ReactHookFormExamples() {
  const [activeExample, setActiveExample] = useState(0);
  
  const examples = [
    { component: BasicFormExample, title: "Basic Form" },
    { component: ValidationExample, title: "Validation" },
    { component: FieldArrayExample, title: "Field Arrays" },
    { component: FormContextExample, title: "Form Context" },
    { component: ControllerExample, title: "Controller" },
    { component: WatchResetExample, title: "Watch & Reset" },
    { component: AsyncSubmitExample, title: "Async Submit" },
    { component: ConditionalFieldsExample, title: "Conditional Fields" }
  ];
  
  const ActiveExampleComponent = examples[activeExample].component;
  
  return (
    <div className="react-hook-form-examples">
      <h1>React Hook Form Examples</h1>
      <p>Comprehensive examples demonstrating React Hook Form features and patterns.</p>
      
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
        <h2>About React Hook Form</h2>
        <p>
          React Hook Form is a performant, flexible, and extensible forms library for React applications. 
          It provides hooks for form validation, state management, and submission handling with minimal re-renders.
        </p>
        
        <h3>Key Features:</h3>
        <ul>
          <li><strong>Performance</strong>: Minimal re-renders and optimized validation</li>
          <li><strong>Validation</strong>: Built-in validation with schema support</li>
          <li><strong>Field Arrays</strong>: Dynamic field management</li>
          <li><strong>Controller</strong>: Integration with custom components</li>
          <li><strong>Form Context</strong>: Share form state across components</li>
          <li><strong>Watch & Reset</strong>: Monitor and control form state</li>
          <li><strong>TypeScript Support</strong>: Full TypeScript support</li>
          <li><strong>Framework Agnostic</strong>: Works with any UI library</li>
        </ul>
        
        <h3>Installation:</h3>
        <pre>{`npm install react-hook-form`}</pre>
        
        <h3>Basic Usage:</h3>
        <pre>{`import { useForm } from 'react-hook-form';

function MyForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch
  } = useForm();

  const onSubmit = (data) => {
    console.log('Form data:', data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input {...register('firstName')} />
      {errors.firstName && <p>{errors.firstName.message}</p>}
      
      <input {...register('email')} />
      {errors.email && <p>{errors.email.message}</p>}
      
      <button type="submit">Submit</button>
    </form>
  );
}`}</pre>
      </div>
    </div>
  );
}