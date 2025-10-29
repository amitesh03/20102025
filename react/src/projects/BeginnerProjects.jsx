import React, { useState, useEffect } from 'react'
import './BeginnerProjects.css'

// Todo Application
const TodoApp = () => {
  const [todos, setTodos] = useState([
    { id: 1, text: 'Learn React', completed: true },
    { id: 2, text: 'Build a todo app', completed: false },
  ])
  const [inputValue, setInputValue] = useState('')
  const [filter, setFilter] = useState('all')
  
  const addTodo = () => {
    if (inputValue.trim()) {
      setTodos([
        ...todos,
        { id: Date.now(), text: inputValue, completed: false }
      ])
      setInputValue('')
    }
  }
  
  const toggleTodo = (id) => {
    setTodos(todos.map(todo =>
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ))
  }
  
  const deleteTodo = (id) => {
    setTodos(todos.filter(todo => todo.id !== id))
  }
  
  const filteredTodos = todos.filter(todo => {
    if (filter === 'completed') return todo.completed
    if (filter === 'active') return !todo.completed
    return true
  })
  
  const completedCount = todos.filter(todo => todo.completed).length
  
  useEffect(() => {
    localStorage.setItem('todos', JSON.stringify(todos))
  }, [todos])
  
  return (
    <div className="project-container">
      <h3>Todo Application</h3>
      <div className="todo-app">
        <div className="todo-input">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="What needs to be done?"
            onKeyPress={(e) => e.key === 'Enter' && addTodo()}
          />
          <button onClick={addTodo}>Add</button>
        </div>
        
        <div className="todo-filters">
          <button
            className={filter === 'all' ? 'active' : ''}
            onClick={() => setFilter('all')}
          >
            All ({todos.length})
          </button>
          <button
            className={filter === 'active' ? 'active' : ''}
            onClick={() => setFilter('active')}
          >
            Active ({todos.length - completedCount})
          </button>
          <button
            className={filter === 'completed' ? 'active' : ''}
            onClick={() => setFilter('completed')}
          >
            Completed ({completedCount})
          </button>
        </div>
        
        <ul className="todo-list">
          {filteredTodos.map(todo => (
            <li key={todo.id} className={todo.completed ? 'completed' : ''}>
              <input
                type="checkbox"
                checked={todo.completed}
                onChange={() => toggleTodo(todo.id)}
              />
              <span>{todo.text}</span>
              <button onClick={() => deleteTodo(todo.id)}>×</button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

// Weather App
const WeatherApp = () => {
  const [city, setCity] = useState('New York')
  const [weather, setWeather] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  
  const apiKey = 'demo-key' // In a real app, use a real API key
  
  const fetchWeather = async () => {
    setLoading(true)
    setError('')
    
    try {
      // Simulate API call with mock data
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Mock weather data
      const mockData = {
        name: city,
        main: {
          temp: Math.round(Math.random() * 30 + 10),
          feels_like: Math.round(Math.random() * 30 + 10),
          humidity: Math.round(Math.random() * 100)
        },
        weather: [
          {
            main: 'Clear',
            description: 'clear sky',
            icon: '01d'
          }
        ],
        wind: {
          speed: Math.round(Math.random() * 10)
        }
      }
      
      setWeather(mockData)
    } catch (err) {
      setError('Failed to fetch weather data')
    } finally {
      setLoading(false)
    }
  }
  
  useEffect(() => {
    fetchWeather()
  }, [])
  
  return (
    <div className="project-container">
      <h3>Weather App</h3>
      <div className="weather-app">
        <div className="weather-input">
          <input
            type="text"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            placeholder="Enter city name"
          />
          <button onClick={fetchWeather} disabled={loading}>
            {loading ? 'Loading...' : 'Get Weather'}
          </button>
        </div>
        
        {error && <div className="error">{error}</div>}
        
        {weather && (
          <div className="weather-display">
            <h2>{weather.name}</h2>
            <div className="weather-main">
              <div className="temperature">
                {weather.main.temp}°C
              </div>
              <div className="description">
                {weather.weather[0].description}
              </div>
            </div>
            <div className="weather-details">
              <div>Feels like: {weather.main.feels_like}°C</div>
              <div>Humidity: {weather.main.humidity}%</div>
              <div>Wind: {weather.wind.speed} m/s</div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

// Personal Portfolio
const PersonalPortfolio = () => {
  const [activeSection, setActiveSection] = useState('about')
  
  const skills = [
    'React', 'JavaScript', 'HTML', 'CSS', 'Git', 'Node.js'
  ]
  
  const projects = [
    {
      title: 'Todo App',
      description: 'A simple todo application built with React',
      tech: ['React', 'CSS']
    },
    {
      title: 'Weather App',
      description: 'Weather application with API integration',
      tech: ['React', 'API', 'CSS']
    }
  ]
  
  return (
    <div className="project-container">
      <h3>Personal Portfolio</h3>
      <div className="portfolio">
        <header className="portfolio-header">
          <h1>John Doe</h1>
          <p>Frontend Developer</p>
          <div className="portfolio-nav">
            <button
              className={activeSection === 'about' ? 'active' : ''}
              onClick={() => setActiveSection('about')}
            >
              About
            </button>
            <button
              className={activeSection === 'skills' ? 'active' : ''}
              onClick={() => setActiveSection('skills')}
            >
              Skills
            </button>
            <button
              className={activeSection === 'projects' ? 'active' : ''}
              onClick={() => setActiveSection('projects')}
            >
              Projects
            </button>
            <button
              className={activeSection === 'contact' ? 'active' : ''}
              onClick={() => setActiveSection('contact')}
            >
              Contact
            </button>
          </div>
        </header>
        
        <main className="portfolio-content">
          {activeSection === 'about' && (
            <section className="portfolio-section">
              <h2>About Me</h2>
              <p>
                I'm a passionate frontend developer with a love for creating 
                beautiful and functional web applications. I specialize in React 
                and modern JavaScript technologies.
              </p>
            </section>
          )}
          
          {activeSection === 'skills' && (
            <section className="portfolio-section">
              <h2>Skills</h2>
              <div className="skills-grid">
                {skills.map(skill => (
                  <div key={skill} className="skill-item">
                    {skill}
                  </div>
                ))}
              </div>
            </section>
          )}
          
          {activeSection === 'projects' && (
            <section className="portfolio-section">
              <h2>Projects</h2>
              <div className="projects-grid">
                {projects.map((project, index) => (
                  <div key={index} className="project-card">
                    <h3>{project.title}</h3>
                    <p>{project.description}</p>
                    <div className="project-tech">
                      {project.tech.map(tech => (
                        <span key={tech} className="tech-tag">
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}
          
          {activeSection === 'contact' && (
            <section className="portfolio-section">
              <h2>Contact</h2>
              <div className="contact-info">
                <p>Email: john.doe@example.com</p>
                <p>GitHub: github.com/johndoe</p>
                <p>LinkedIn: linkedin.com/in/johndoe</p>
              </div>
            </section>
          )}
        </main>
      </div>
    </div>
  )
}

// Simple E-commerce Product Listing
const EcommerceProductListing = () => {
  const [products] = useState([
    {
      id: 1,
      name: 'Laptop',
      price: 999,
      category: 'Electronics',
      image: 'https://picsum.photos/seed/laptop/200/200.jpg',
      description: 'High-performance laptop for professionals'
    },
    {
      id: 2,
      name: 'Smartphone',
      price: 699,
      category: 'Electronics',
      image: 'https://picsum.photos/seed/phone/200/200.jpg',
      description: 'Latest smartphone with amazing features'
    },
    {
      id: 3,
      name: 'Headphones',
      price: 199,
      category: 'Electronics',
      image: 'https://picsum.photos/seed/headphones/200/200.jpg',
      description: 'Noise-cancelling wireless headphones'
    },
    {
      id: 4,
      name: 'Watch',
      price: 299,
      category: 'Accessories',
      image: 'https://picsum.photos/seed/watch/200/200.jpg',
      description: 'Smart watch with fitness tracking'
    }
  ])
  
  const [cart, setCart] = useState([])
  const [cartTotal, setCartTotal] = useState(0)
  const [showCart, setShowCart] = useState(false)
  
  useEffect(() => {
    const total = cart.reduce((sum, item) => sum + item.price, 0)
    setCartTotal(total)
  }, [cart])
  
  const addToCart = (product) => {
    setCart([...cart, product])
  }
  
  const removeFromCart = (index) => {
    setCart(cart.filter((_, i) => i !== index))
  }
  
  return (
    <div className="project-container">
      <h3>Simple E-commerce Product Listing</h3>
      <div className="ecommerce">
        <header className="ecommerce-header">
          <h1>My Store</h1>
          <button 
            className="cart-button"
            onClick={() => setShowCart(!showCart)}
          >
            Cart ({cart.length}) - ${cartTotal}
          </button>
        </header>
        
        {showCart && (
          <div className="cart">
            <h3>Shopping Cart</h3>
            {cart.length === 0 ? (
              <p>Your cart is empty</p>
            ) : (
              <div>
                {cart.map((item, index) => (
                  <div key={index} className="cart-item">
                    <span>{item.name}</span>
                    <span>${item.price}</span>
                    <button onClick={() => removeFromCart(index)}>Remove</button>
                  </div>
                ))}
                <div className="cart-total">
                  Total: ${cartTotal}
                </div>
              </div>
            )}
          </div>
        )}
        
        <div className="products-grid">
          {products.map(product => (
            <div key={product.id} className="product-card">
              <img src={product.image} alt={product.name} />
              <h3>{product.name}</h3>
              <p className="product-price">${product.price}</p>
              <p className="product-description">{product.description}</p>
              <button 
                className="add-to-cart"
                onClick={() => addToCart(product)}
              >
                Add to Cart
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// Main Component
const BeginnerProjects = () => {
  const [activeProject, setActiveProject] = useState('todo')
  
  const projects = [
    { id: 'todo', name: 'Todo Application', component: TodoApp },
    { id: 'weather', name: 'Weather App', component: WeatherApp },
    { id: 'portfolio', name: 'Personal Portfolio', component: PersonalPortfolio },
    { id: 'ecommerce', name: 'E-commerce Listing', component: EcommerceProductListing }
  ]
  
  const ActiveProjectComponent = projects.find(p => p.id === activeProject)?.component
  
  return (
    <div className="beginner-projects">
      <div className="example-container">
        <div className="example-header">
          <h2>Beginner Projects</h2>
          <p>Practice your React skills with these beginner-friendly projects</p>
        </div>
        
        <div className="example-section">
          <h3>Project Selection</h3>
          <div className="project-tabs">
            {projects.map(project => (
              <button
                key={project.id}
                className={activeProject === project.id ? 'active' : ''}
                onClick={() => setActiveProject(project.id)}
              >
                {project.name}
              </button>
            ))}
          </div>
        </div>
        
        <div className="project-content">
          {ActiveProjectComponent && <ActiveProjectComponent />}
        </div>
        
        <div className="exercise">
          <h4>Project Challenges:</h4>
          <ul>
            <li>Add local storage persistence to save data</li>
            <li>Implement search and filter functionality</li>
            <li>Add animations and transitions</li>
            <li>Create a responsive design for mobile devices</li>
            <li>Add form validation</li>
            <li>Implement error handling</li>
            <li>Add loading states</li>
            <li>Create custom hooks for reusable logic</li>
          </ul>
        </div>
      </div>
    </div>
  )
}

export default BeginnerProjects