import React, { useState } from 'react'
import { useForm, Controller, useFieldArray } from 'react-hook-form'
import './FormExample.css'

// Example 1: Basic Form
const BasicForm = () => {
  const { register, handleSubmit, formState: { errors } } = useForm()
  
  const onSubmit = (data) => {
    console.log('Form data:', data)
    alert(`Form submitted: ${JSON.stringify(data, null, 2)}`)
  }
  
  return (
    <div className="form-example">
      <h3>Basic Form</h3>
      <form onSubmit={handleSubmit(onSubmit)} className="form">
        <div className="form-group">
          <label>First Name</label>
          <input 
            {...register('firstName', { required: 'First name is required' })}
            placeholder="Enter your first name"
          />
          {errors.firstName && <p className="error">{errors.firstName.message}</p>}
        </div>
        
        <div className="form-group">
          <label>Last Name</label>
          <input 
            {...register('lastName', { required: 'Last name is required' })}
            placeholder="Enter your last name"
          />
          {errors.lastName && <p className="error">{errors.lastName.message}</p>}
        </div>
        
        <div className="form-group">
          <label>Email</label>
          <input 
            type="email"
            {...register('email', { 
              required: 'Email is required',
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: 'Invalid email address'
              }
            })}
            placeholder="Enter your email"
          />
          {errors.email && <p className="error">{errors.email.message}</p>}
        </div>
        
        <div className="form-group">
          <label>Age</label>
          <input 
            type="number"
            {...register('age', { 
              required: 'Age is required',
              min: {
                value: 18,
                message: 'You must be at least 18 years old'
              }
            })}
            placeholder="Enter your age"
          />
          {errors.age && <p className="error">{errors.age.message}</p>}
        </div>
        
        <button type="submit" className="submit-btn">Submit</button>
      </form>
    </div>
  )
}

// Example 2: Advanced Validation
const AdvancedForm = () => {
  const { register, handleSubmit, watch, formState: { errors } } = useForm()
  const password = watch('password')
  
  const onSubmit = (data) => {
    console.log('Form data:', data)
    alert(`Form submitted: ${JSON.stringify(data, null, 2)}`)
  }
  
  return (
    <div className="form-example">
      <h3>Advanced Validation</h3>
      <form onSubmit={handleSubmit(onSubmit)} className="form">
        <div className="form-group">
          <label>Username</label>
          <input 
            {...register('username', { 
              required: 'Username is required',
              minLength: {
                value: 3,
                message: 'Username must be at least 3 characters'
              },
              maxLength: {
                value: 20,
                message: 'Username must be less than 20 characters'
              },
              pattern: {
                value: /^[a-zA-Z0-9_]+$/,
                message: 'Username can only contain letters, numbers, and underscores'
              }
            })}
            placeholder="Enter username"
          />
          {errors.username && <p className="error">{errors.username.message}</p>}
        </div>
        
        <div className="form-group">
          <label>Password</label>
          <input 
            type="password"
            {...register('password', { 
              required: 'Password is required',
              minLength: {
                value: 8,
                message: 'Password must be at least 8 characters'
              },
              pattern: {
                value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
                message: 'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'
              }
            })}
            placeholder="Enter password"
          />
          {errors.password && <p className="error">{errors.password.message}</p>}
        </div>
        
        <div className="form-group">
          <label>Confirm Password</label>
          <input 
            type="password"
            {...register('confirmPassword', { 
              required: 'Please confirm your password',
              validate: value => value === password || 'Passwords do not match'
            })}
            placeholder="Confirm password"
          />
          {errors.confirmPassword && <p className="error">{errors.confirmPassword.message}</p>}
        </div>
        
        <div className="form-group">
          <label>Phone Number</label>
          <input 
            {...register('phone', { 
              required: 'Phone number is required',
              pattern: {
                value: /^\+?[1-9]\d{1,14}$/,
                message: 'Please enter a valid phone number'
              }
            })}
            placeholder="+1234567890"
          />
          {errors.phone && <p className="error">{errors.phone.message}</p>}
        </div>
        
        <button type="submit" className="submit-btn">Submit</button>
      </form>
    </div>
  )
}

// Example 3: Dynamic Fields
const DynamicForm = () => {
  const { register, handleSubmit, control, formState: { errors } } = useForm({
    defaultValues: {
      skills: [{ name: '' }],
      socialLinks: [{ platform: '', url: '' }]
    }
  })
  
  const { fields: skillFields, append: appendSkill, remove: removeSkill } = useFieldArray({
    control,
    name: 'skills'
  })
  
  const { fields: socialFields, append: appendSocial, remove: removeSocial } = useFieldArray({
    control,
    name: 'socialLinks'
  })
  
  const onSubmit = (data) => {
    console.log('Form data:', data)
    alert(`Form submitted: ${JSON.stringify(data, null, 2)}`)
  }
  
  return (
    <div className="form-example">
      <h3>Dynamic Fields</h3>
      <form onSubmit={handleSubmit(onSubmit)} className="form">
        <div className="form-group">
          <label>Full Name</label>
          <input 
            {...register('fullName', { required: 'Full name is required' })}
            placeholder="Enter your full name"
          />
          {errors.fullName && <p className="error">{errors.fullName.message}</p>}
        </div>
        
        <div className="dynamic-section">
          <div className="section-header">
            <h4>Skills</h4>
            <button 
              type="button" 
              onClick={() => appendSkill({ name: '' })}
              className="add-btn"
            >
              Add Skill
            </button>
          </div>
          
          {skillFields.map((field, index) => (
            <div key={field.id} className="dynamic-field">
              <input 
                {...register(`skills.${index}.name`, { 
                  required: 'Skill name is required' 
                })}
                placeholder="Enter skill"
              />
              {skillFields.length > 1 && (
                <button 
                  type="button" 
                  onClick={() => removeSkill(index)}
                  className="remove-btn"
                >
                  Remove
                </button>
              )}
            </div>
          ))}
        </div>
        
        <div className="dynamic-section">
          <div className="section-header">
            <h4>Social Links</h4>
            <button 
              type="button" 
              onClick={() => appendSocial({ platform: '', url: '' })}
              className="add-btn"
            >
              Add Social Link
            </button>
          </div>
          
          {socialFields.map((field, index) => (
            <div key={field.id} className="dynamic-field-group">
              <select 
                {...register(`socialLinks.${index}.platform`, { 
                  required: 'Platform is required' 
                })}
              >
                <option value="">Select platform</option>
                <option value="twitter">Twitter</option>
                <option value="linkedin">LinkedIn</option>
                <option value="github">GitHub</option>
                <option value="instagram">Instagram</option>
              </select>
              <input 
                {...register(`socialLinks.${index}.url`, { 
                  required: 'URL is required' 
                })}
                placeholder="Enter URL"
              />
              {socialFields.length > 1 && (
                <button 
                  type="button" 
                  onClick={() => removeSocial(index)}
                  className="remove-btn"
                >
                  Remove
                </button>
              )}
            </div>
          ))}
        </div>
        
        <button type="submit" className="submit-btn">Submit</button>
      </form>
    </div>
  )
}

// Example 4: Controlled Components
const ControlledForm = () => {
  const { control, handleSubmit, formState: { errors } } = useForm()
  
  const onSubmit = (data) => {
    console.log('Form data:', data)
    alert(`Form submitted: ${JSON.stringify(data, null, 2)}`)
  }
  
  return (
    <div className="form-example">
      <h3>Controlled Components</h3>
      <form onSubmit={handleSubmit(onSubmit)} className="form">
        <div className="form-group">
          <label>Country</label>
          <Controller
            name="country"
            control={control}
            rules={{ required: 'Please select a country' }}
            render={({ field }) => (
              <select {...field}>
                <option value="">Select a country</option>
                <option value="us">United States</option>
                <option value="uk">United Kingdom</option>
                <option value="ca">Canada</option>
                <option value="au">Australia</option>
              </select>
            )}
          />
          {errors.country && <p className="error">{errors.country.message}</p>}
        </div>
        
        <div className="form-group">
          <label>Gender</label>
          <Controller
            name="gender"
            control={control}
            rules={{ required: 'Please select gender' }}
            render={({ field }) => (
              <div className="radio-group">
                <label>
                  <input type="radio" {...field} value="male" />
                  Male
                </label>
                <label>
                  <input type="radio" {...field} value="female" />
                  Female
                </label>
                <label>
                  <input type="radio" {...field} value="other" />
                  Other
                </label>
              </div>
            )}
          />
          {errors.gender && <p className="error">{errors.gender.message}</p>}
        </div>
        
        <div className="form-group">
          <label>Interests</label>
          <Controller
            name="interests"
            control={control}
            rules={{ required: 'Please select at least one interest' }}
            render={({ field }) => (
              <div className="checkbox-group">
                <label>
                  <input 
                    type="checkbox" 
                    checked={field.value?.includes('sports') || false}
                    onChange={(e) => {
                      const newValue = e.target.checked
                        ? [...(field.value || []), 'sports']
                        : (field.value || []).filter(item => item !== 'sports')
                      field.onChange(newValue)
                    }}
                  />
                  Sports
                </label>
                <label>
                  <input 
                    type="checkbox" 
                    checked={field.value?.includes('music') || false}
                    onChange={(e) => {
                      const newValue = e.target.checked
                        ? [...(field.value || []), 'music']
                        : (field.value || []).filter(item => item !== 'music')
                      field.onChange(newValue)
                    }}
                  />
                  Music
                </label>
                <label>
                  <input 
                    type="checkbox" 
                    checked={field.value?.includes('travel') || false}
                    onChange={(e) => {
                      const newValue = e.target.checked
                        ? [...(field.value || []), 'travel']
                        : (field.value || []).filter(item => item !== 'travel')
                      field.onChange(newValue)
                    }}
                  />
                  Travel
                </label>
              </div>
            )}
          />
          {errors.interests && <p className="error">{errors.interests.message}</p>}
        </div>
        
        <div className="form-group">
          <label>Bio</label>
          <Controller
            name="bio"
            control={control}
            rules={{ 
              required: 'Bio is required',
              minLength: {
                value: 10,
                message: 'Bio must be at least 10 characters'
              }
            }}
            render={({ field }) => (
              <textarea {...field} rows={4} placeholder="Tell us about yourself..." />
            )}
          />
          {errors.bio && <p className="error">{errors.bio.message}</p>}
        </div>
        
        <button type="submit" className="submit-btn">Submit</button>
      </form>
    </div>
  )
}

// Example 5: Form with File Upload
const FileUploadForm = () => {
  const { register, handleSubmit, watch, formState: { errors } } = useForm()
  const file = watch('profilePicture')
  
  const onSubmit = (data) => {
    console.log('Form data:', data)
    alert(`Form submitted: ${JSON.stringify(data, null, 2)}`)
  }
  
  return (
    <div className="form-example">
      <h3>File Upload Form</h3>
      <form onSubmit={handleSubmit(onSubmit)} className="form">
        <div className="form-group">
          <label>Profile Picture</label>
          <input 
            type="file"
            {...register('profilePicture', { 
              required: 'Please upload a profile picture',
              validate: {
                lessThan10MB: files => files[0]?.size < 10000000 || 'Max 10MB',
                acceptedFormats: files => 
                  ['image/jpeg', 'image/png', 'image/gif'].includes(files[0]?.type) ||
                  'Only JPEG, PNG, or GIF files are allowed'
              }
            })}
          />
          {errors.profilePicture && <p className="error">{errors.profilePicture.message}</p>}
          {file && file.length > 0 && (
            <p className="file-info">Selected: {file[0].name}</p>
          )}
        </div>
        
        <div className="form-group">
          <label>Resume</label>
          <input 
            type="file"
            {...register('resume', { 
              required: 'Please upload your resume',
              validate: {
                lessThan5MB: files => files[0]?.size < 5000000 || 'Max 5MB',
                acceptedFormats: files => 
                  ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'].includes(files[0]?.type) ||
                  'Only PDF or Word documents are allowed'
              }
            })}
          />
          {errors.resume && <p className="error">{errors.resume.message}</p>}
        </div>
        
        <div className="form-group">
          <label>Cover Letter</label>
          <textarea 
            {...register('coverLetter', { 
              required: 'Cover letter is required',
              minLength: {
                value: 50,
                message: 'Cover letter must be at least 50 characters'
              }
            })}
            rows={6}
            placeholder="Write your cover letter..."
          />
          {errors.coverLetter && <p className="error">{errors.coverLetter.message}</p>}
        </div>
        
        <button type="submit" className="submit-btn">Submit Application</button>
      </form>
    </div>
  )
}

// Main Form Example Component
const FormExample = () => {
  const [activeTab, setActiveTab] = useState('basic')
  
  return (
    <div className="react-hook-form-example">
      <div className="example-container">
        <div className="example-header">
          <h2>React Hook Form Examples</h2>
          <p>Learn form handling and validation with React Hook Form</p>
        </div>
        
        <div className="example-section">
          <h3>Basic Setup</h3>
          <div className="code-block">
            <pre>{`import { useForm } from 'react-hook-form'

const { register, handleSubmit, formState: { errors } } = useForm()

const onSubmit = (data) => {
  console.log(data)
}

<form onSubmit={handleSubmit(onSubmit)}>
  <input {...register('fieldName', { required: true })} />
  {errors.fieldName && <p>This field is required</p>}
  <button type="submit">Submit</button>
</form>`}</pre>
          </div>
        </div>
        
        <div className="example-section">
          <h3>Validation Rules</h3>
          <div className="code-block">
            <pre>{`<input 
  {...register('email', { 
    required: 'Email is required',
    pattern: {
      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
      message: 'Invalid email address'
    },
    minLength: {
      value: 5,
      message: 'Email must be at least 5 characters'
    }
  })} 
/>`}</pre>
          </div>
        </div>
        
        <div className="example-section">
          <h3>Interactive Examples</h3>
          <div className="tab-navigation">
            <button 
              className={activeTab === 'basic' ? 'active' : ''}
              onClick={() => setActiveTab('basic')}
            >
              Basic Form
            </button>
            <button 
              className={activeTab === 'advanced' ? 'active' : ''}
              onClick={() => setActiveTab('advanced')}
            >
              Advanced Validation
            </button>
            <button 
              className={activeTab === 'dynamic' ? 'active' : ''}
              onClick={() => setActiveTab('dynamic')}
            >
              Dynamic Fields
            </button>
            <button 
              className={activeTab === 'controlled' ? 'active' : ''}
              onClick={() => setActiveTab('controlled')}
            >
              Controlled Components
            </button>
            <button 
              className={activeTab === 'file' ? 'active' : ''}
              onClick={() => setActiveTab('file')}
            >
              File Upload
            </button>
          </div>
          
          <div className="tab-content">
            {activeTab === 'basic' && <BasicForm />}
            {activeTab === 'advanced' && <AdvancedForm />}
            {activeTab === 'dynamic' && <DynamicForm />}
            {activeTab === 'controlled' && <ControlledForm />}
            {activeTab === 'file' && <FileUploadForm />}
          </div>
        </div>
        
        <div className="exercise">
          <h4>Exercise:</h4>
          <p>Create a comprehensive registration form with React Hook Form that includes:</p>
          <ul>
            <li>Personal information fields with validation</li>
            <li>Address form with country/state/city dropdowns</li>
            <li>Dynamic fields for adding multiple phone numbers</li>
            <li>File upload for profile picture with validation</li>
            <li>Password and confirm password with strength validation</li>
            <li>Terms and conditions checkbox requirement</li>
            <li>Multi-step form with progress indicator</li>
          </ul>
        </div>
      </div>
    </div>
  )
}

export default FormExample