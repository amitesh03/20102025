import React, { useState } from 'react'
import './UILibrariesExample.css'

// Note: This is a demonstration of how to use UI libraries
// In a real project, you would install and import the actual libraries

// MUI (Material-UI) Examples
const MUIExample = () => {
  const [value, setValue] = useState(0)
  const [textFieldValue, setTextFieldValue] = useState('')
  const [checked, setChecked] = useState(false)
  const [selected, setSelected] = useState('')
  
  return (
    <div className="ui-example mui-example">
      <h3>Material-UI (MUI) Components</h3>
      <p className="library-note">
        Note: This is a demonstration of MUI components. In a real project, 
        install @mui/material and @emotion/react/styled.
      </p>
      
      <div className="component-section">
        <h4>Buttons</h4>
        <div className="button-group">
          <button className="mui-button mui-button-contained">Contained</button>
          <button className="mui-button mui-button-outlined">Outlined</button>
          <button className="mui-button mui-button-text">Text</button>
        </div>
      </div>
      
      <div className="component-section">
        <h4>Text Field</h4>
        <div className="text-field-container">
          <label className="mui-label">Text Field</label>
          <input 
            type="text" 
            className="mui-textfield"
            value={textFieldValue}
            onChange={(e) => setTextFieldValue(e.target.value)}
            placeholder="Enter text"
          />
        </div>
      </div>
      
      <div className="component-section">
        <h4>Checkbox</h4>
        <div className="checkbox-container">
          <label className="mui-checkbox-label">
            <input 
              type="checkbox" 
              className="mui-checkbox"
              checked={checked}
              onChange={(e) => setChecked(e.target.checked)}
            />
            Accept terms and conditions
          </label>
        </div>
      </div>
      
      <div className="component-section">
        <h4>Slider</h4>
        <div className="slider-container">
          <input 
            type="range" 
            min="0" 
            max="100" 
            value={value}
            onChange={(e) => setValue(e.target.value)}
            className="mui-slider"
          />
          <span className="slider-value">{value}</span>
        </div>
      </div>
      
      <div className="component-section">
        <h4>Select</h4>
        <div className="select-container">
          <label className="mui-label">Select Option</label>
          <select 
            className="mui-select"
            value={selected}
            onChange={(e) => setSelected(e.target.value)}
          >
            <option value="">Select an option</option>
            <option value="option1">Option 1</option>
            <option value="option2">Option 2</option>
            <option value="option3">Option 3</option>
          </select>
        </div>
      </div>
      
      <div className="component-section">
        <h4>Card</h4>
        <div className="mui-card">
          <div className="mui-card-header">
            <h5>Card Title</h5>
            <p className="mui-card-subtitle">Card Subtitle</p>
          </div>
          <div className="mui-card-content">
            <p>This is a MUI card component with header and content sections.</p>
          </div>
          <div className="mui-card-actions">
            <button className="mui-button mui-button-text">Learn More</button>
          </div>
        </div>
      </div>
    </div>
  )
}

// Chakra UI Examples
const ChakraExample = () => {
  const [value, setValue] = useState(0)
  const [inputValue, setInputValue] = useState('')
  const [isChecked, setIsChecked] = useState(false)
  const [selectedOption, setSelectedOption] = useState('')
  
  return (
    <div className="ui-example chakra-example">
      <h3>Chakra UI Components</h3>
      <p className="library-note">
        Note: This is a demonstration of Chakra UI components. In a real project, 
        install @chakra-ui/react and @emotion/react/styled.
      </p>
      
      <div className="component-section">
        <h4>Buttons</h4>
        <div className="button-group">
          <button className="chakra-button chakra-button-solid">Solid</button>
          <button className="chakra-button chakra-button-outline">Outline</button>
          <button className="chakra-button chakra-button-ghost">Ghost</button>
          <button className="chakra-button chakra-button-link">Link</button>
        </div>
      </div>
      
      <div className="component-section">
        <h4>Input</h4>
        <div className="input-container">
          <input 
            type="text" 
            className="chakra-input"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Enter value"
          />
        </div>
      </div>
      
      <div className="component-section">
        <h4>Checkbox</h4>
        <div className="checkbox-container">
          <label className="chakra-checkbox-label">
            <input 
              type="checkbox" 
              className="chakra-checkbox"
              checked={isChecked}
              onChange={(e) => setIsChecked(e.target.checked)}
            />
            <span>Check me</span>
          </label>
        </div>
      </div>
      
      <div className="component-section">
        <h4>Slider</h4>
        <div className="slider-container">
          <input 
            type="range" 
            min="0" 
            max="100" 
            value={value}
            onChange={(e) => setValue(e.target.value)}
            className="chakra-slider"
          />
          <span className="slider-value">{value}</span>
        </div>
      </div>
      
      <div className="component-section">
        <h4>Select</h4>
        <div className="select-container">
          <select 
            className="chakra-select"
            value={selectedOption}
            onChange={(e) => setSelectedOption(e.target.value)}
          >
            <option value="">Select option</option>
            <option value="a">Option A</option>
            <option value="b">Option B</option>
            <option value="c">Option C</option>
          </select>
        </div>
      </div>
      
      <div className="component-section">
        <h4>Card</h4>
        <div className="chakra-card">
          <div className="chakra-card-header">
            <h5>Chakra Card</h5>
          </div>
          <div className="chakra-card-body">
            <p>This is a Chakra UI card with clean, accessible design.</p>
          </div>
          <div className="chakra-card-footer">
            <button className="chakra-button chakra-button-solid">Action</button>
          </div>
        </div>
      </div>
    </div>
  )
}

// Ant Design Examples
const AntDesignExample = () => {
  const [value, setValue] = useState(0)
  const [inputValue, setInputValue] = useState('')
  const [checked, setChecked] = useState(false)
  const [selected, setSelected] = useState('')
  const [activeTab, setActiveTab] = useState('1')
  
  return (
    <div className="ui-example ant-design-example">
      <h3>Ant Design Components</h3>
      <p className="library-note">
        Note: This is a demonstration of Ant Design components. In a real project, 
        install antd and @ant-design/icons.
      </p>
      
      <div className="component-section">
        <h4>Buttons</h4>
        <div className="button-group">
          <button className="ant-button ant-button-primary">Primary</button>
          <button className="ant-button ant-button-default">Default</button>
          <button className="ant-button ant-button-dashed">Dashed</button>
          <button className="ant-button ant-button-link">Link</button>
        </div>
      </div>
      
      <div className="component-section">
        <h4>Input</h4>
        <div className="input-container">
          <input 
            type="text" 
            className="ant-input"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Basic input"
          />
        </div>
      </div>
      
      <div className="component-section">
        <h4>Checkbox</h4>
        <div className="checkbox-container">
          <label className="ant-checkbox-label">
            <input 
              type="checkbox" 
              className="ant-checkbox"
              checked={checked}
              onChange={(e) => setChecked(e.target.checked)}
            />
            <span>Checkbox</span>
          </label>
        </div>
      </div>
      
      <div className="component-section">
        <h4>Slider</h4>
        <div className="slider-container">
          <input 
            type="range" 
            min="0" 
            max="100" 
            value={value}
            onChange={(e) => setValue(e.target.value)}
            className="ant-slider"
          />
          <span className="slider-value">{value}</span>
        </div>
      </div>
      
      <div className="component-section">
        <h4>Select</h4>
        <div className="select-container">
          <select 
            className="ant-select"
            value={selected}
            onChange={(e) => setSelected(e.target.value)}
          >
            <option value="">Please select</option>
            <option value="jack">Jack</option>
            <option value="lucy">Lucy</option>
            <option value="tom">Tom</option>
          </select>
        </div>
      </div>
      
      <div className="component-section">
        <h4>Tabs</h4>
        <div className="ant-tabs">
          <div className="ant-tabs-nav">
            <button 
              className={`ant-tabs-tab ${activeTab === '1' ? 'ant-tabs-tab-active' : ''}`}
              onClick={() => setActiveTab('1')}
            >
              Tab 1
            </button>
            <button 
              className={`ant-tabs-tab ${activeTab === '2' ? 'ant-tabs-tab-active' : ''}`}
              onClick={() => setActiveTab('2')}
            >
              Tab 2
            </button>
            <button 
              className={`ant-tabs-tab ${activeTab === '3' ? 'ant-tabs-tab-active' : ''}`}
              onClick={() => setActiveTab('3')}
            >
              Tab 3
            </button>
          </div>
          <div className="ant-tabs-content">
            <div className={`ant-tabs-pane ${activeTab === '1' ? 'ant-tabs-pane-active' : ''}`}>
              Content of Tab Pane 1
            </div>
            <div className={`ant-tabs-pane ${activeTab === '2' ? 'ant-tabs-pane-active' : ''}`}>
              Content of Tab Pane 2
            </div>
            <div className={`ant-tabs-pane ${activeTab === '3' ? 'ant-tabs-pane-active' : ''}`}>
              Content of Tab Pane 3
            </div>
          </div>
        </div>
      </div>
      
      <div className="component-section">
        <h4>Card</h4>
        <div className="ant-card">
          <div className="ant-card-head">
            <h5>Ant Design Card</h5>
          </div>
          <div className="ant-card-body">
            <p>This is an Ant Design card component with enterprise-class design.</p>
          </div>
        </div>
      </div>
    </div>
  )
}

// Comparison Component
const ComparisonTable = () => {
  return (
    <div className="comparison-section">
      <h3>UI Library Comparison</h3>
      <div className="comparison-table">
        <table>
          <thead>
            <tr>
              <th>Feature</th>
              <th>Material-UI</th>
              <th>Chakra UI</th>
              <th>Ant Design</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Design Philosophy</td>
              <td>Google Material Design</td>
              <td>Simple, accessible, composable</td>
              <td>Enterprise-class design language</td>
            </tr>
            <tr>
              <td>Component Count</td>
              <td>50+</td>
              <td>30+</td>
              <td>60+</td>
            </tr>
            <tr>
              <td>Customization</td>
              <td>Theme system, CSS-in-JS</td>
              <td>Style props, theme tokens</td>
              <td>Less variables, config system</td>
            </tr>
            <tr>
              <td>TypeScript</td>
              <td>Excellent support</td>
              <td>Excellent support</td>
              <td>Good support</td>
            </tr>
            <tr>
              <td>Bundle Size</td>
              <td>Large</td>
              <td>Medium</td>
              <td>Large</td>
            </tr>
            <tr>
              <td>Learning Curve</td>
              <td>Moderate</td>
              <td>Easy</td>
              <td>Moderate</td>
            </tr>
            <tr>
              <td>Documentation</td>
              <td>Excellent</td>
              <td>Excellent</td>
              <td>Good</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  )
}

// Main Component
const UILibrariesExample = () => {
  const [activeTab, setActiveTab] = useState('mui')
  
  return (
    <div className="ui-libraries-example">
      <div className="example-container">
        <div className="example-header">
          <h2>UI Component Libraries</h2>
          <p>Learn how to use popular UI component libraries in React</p>
        </div>
        
        <div className="example-section">
          <h3>Installation Examples</h3>
          <div className="code-block">
            <pre>{`# Material-UI (MUI)
npm install @mui/material @emotion/react @emotion/styled

# Chakra UI
npm install @chakra-ui/react @emotion/react @emotion/styled framer-motion

# Ant Design
npm install antd`}</pre>
          </div>
        </div>
        
        <div className="example-section">
          <h3>Basic Usage</h3>
          <div className="code-block">
            <pre>{`// Material-UI
import Button from '@mui/material/Button'
<Button variant="contained" onClick={handleClick}>
  Click me
</Button>

// Chakra UI
import { Button } from '@chakra-ui/react'
<Button colorScheme="blue" onClick={handleClick}>
  Click me
</Button>

// Ant Design
import { Button } from 'antd'
<Button type="primary" onClick={handleClick}>
  Click me
</Button>`}</pre>
          </div>
        </div>
        
        <div className="example-section">
          <h3>Interactive Examples</h3>
          <div className="tab-navigation">
            <button 
              className={activeTab === 'mui' ? 'active' : ''}
              onClick={() => setActiveTab('mui')}
            >
              Material-UI
            </button>
            <button 
              className={activeTab === 'chakra' ? 'active' : ''}
              onClick={() => setActiveTab('chakra')}
            >
              Chakra UI
            </button>
            <button 
              className={activeTab === 'antd' ? 'active' : ''}
              onClick={() => setActiveTab('antd')}
            >
              Ant Design
            </button>
            <button 
              className={activeTab === 'comparison' ? 'active' : ''}
              onClick={() => setActiveTab('comparison')}
            >
              Comparison
            </button>
          </div>
          
          <div className="tab-content">
            {activeTab === 'mui' && <MUIExample />}
            {activeTab === 'chakra' && <ChakraExample />}
            {activeTab === 'antd' && <AntDesignExample />}
            {activeTab === 'comparison' && <ComparisonTable />}
          </div>
        </div>
        
        <div className="exercise">
          <h4>Exercise:</h4>
          <p>Create a dashboard application using your chosen UI library:</p>
          <ul>
            <li>Build a responsive layout with navigation and sidebar</li>
            <li>Create data visualization components with charts</li>
            <li>Implement forms with validation</li>
            <li>Add tables with sorting and filtering</li>
            <li>Create modal dialogs and notifications</li>
            <li>Customize the theme to match your brand</li>
            <li>Ensure accessibility standards are met</li>
          </ul>
        </div>
      </div>
    </div>
  )
}

export default UILibrariesExample