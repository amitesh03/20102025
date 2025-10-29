import React from 'react'
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom'
import './App.css'
import './components/Home.css'

// Import example components (we'll create these next)
import Home from './components/Home'
import Fundamentals from './examples/fundamentals/Fundamentals'
import ReactRouterExample from './examples/react-router/ReactRouterExample'
import ReduxExample from './examples/redux/ReduxExample'
import ReactQueryExample from './examples/react-query/ReactQueryExample'
import FormExample from './examples/react-hook-form/FormExample'
import StylingExample from './examples/styling/StylingExample'
import AnimationExample from './examples/framer-motion/AnimationExample'
import AltStateExample from './examples/alt-state/AltStateExample'
import TestingExample from './examples/testing/TestingExample'
import UILibrariesExample from './examples/ui-libraries/UILibrariesExample'
import BeginnerProjects from './projects/BeginnerProjects'

function App() {
  return (
    <Router>
      <div className="app">
        <nav className="navbar">
          <h1>React Learning Examples</h1>
          <ul className="nav-links">
            <li><Link to="/">Home</Link></li>
            <li><Link to="/fundamentals">Fundamentals</Link></li>
            <li><Link to="/react-router">React Router</Link></li>
            <li><Link to="/redux">Redux Toolkit</Link></li>
            <li><Link to="/react-query">React Query</Link></li>
            <li><Link to="/forms">React Hook Form</Link></li>
            <li><Link to="/styling">Styling</Link></li>
            <li><Link to="/animations">Framer Motion</Link></li>
            <li><Link to="/alt-state">Alt State Management</Link></li>
            <li><Link to="/testing">Testing</Link></li>
            <li><Link to="/ui-libraries">UI Libraries</Link></li>
            <li><Link to="/projects">Projects</Link></li>
          </ul>
        </nav>

        <main className="main-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/fundamentals" element={<Fundamentals />} />
            <Route path="/react-router" element={<ReactRouterExample />} />
            <Route path="/redux" element={<ReduxExample />} />
            <Route path="/react-query" element={<ReactQueryExample />} />
            <Route path="/forms" element={<FormExample />} />
            <Route path="/styling" element={<StylingExample />} />
            <Route path="/animations" element={<AnimationExample />} />
            <Route path="/alt-state" element={<AltStateExample />} />
            <Route path="/testing" element={<TestingExample />} />
            <Route path="/ui-libraries" element={<UILibrariesExample />} />
            <Route path="/projects" element={<BeginnerProjects />} />
          </Routes>
        </main>
      </div>
    </Router>
  )
}

export default App