import React, { useState } from 'react'
import { motion, AnimatePresence, useMotionValue, useTransform, useSpring } from 'framer-motion'
import './AnimationExample.css'

// Example 1: Basic Animations
const BasicAnimations = () => {
  const [isVisible, setIsVisible] = useState(true)
  
  return (
    <div className="animation-example">
      <h3>Basic Animations</h3>
      
      <div className="animation-controls">
        <button onClick={() => setIsVisible(!isVisible)}>
          Toggle Visibility
        </button>
      </div>
      
      <AnimatePresence>
        {isVisible && (
          <motion.div
            className="animation-box"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5 }}
            transition={{ duration: 0.5 }}
          />
        )}
      </AnimatePresence>
      
      <div className="animation-row">
        <motion.div
          className="animation-box small"
          animate={{ x: [0, 100, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        />
        
        <motion.div
          className="animation-box small"
          animate={{ y: [0, -50, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        />
        
        <motion.div
          className="animation-box small"
          animate={{ rotate: [0, 180, 360] }}
          transition={{ duration: 2, repeat: Infinity }}
        />
      </div>
    </div>
  )
}

// Example 2: Gesture Animations
const GestureAnimations = () => {
  const [isDragging, setIsDragging] = useState(false)
  
  return (
    <div className="animation-example">
      <h3>Gesture Animations</h3>
      
      <div className="gesture-container">
        <motion.div
          className="draggable-box"
          drag
          dragConstraints={{ left: -100, right: 100, top: -100, bottom: 100 }}
          dragElastic={0.2}
          onDragStart={() => setIsDragging(true)}
          onDragEnd={() => setIsDragging(false)}
          whileDrag={{ scale: 1.1, rotate: 5 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Drag me!
        </motion.div>
        
        <motion.div
          className="tap-box"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9, rotate: 5 }}
          transition={{ type: 'spring', stiffness: 400, damping: 10 }}
        >
          Tap me!
        </motion.div>
      </div>
      
      <div className="gesture-row">
        <motion.div
          className="swipe-box"
          whileHover={{ x: 10 }}
          transition={{ type: 'spring', stiffness: 300 }}
        >
          Hover →
        </motion.div>
        
        <motion.div
          className="swipe-box"
          whileHover={{ x: -10 }}
          transition={{ type: 'spring', stiffness: 300 }}
        >
          ← Hover
        </motion.div>
      </div>
    </div>
  )
}

// Example 3: Variants
const variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 }
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  },
  exit: {
    opacity: 0,
    transition: {
      staggerChildren: 0.05,
      staggerDirection: -1
    }
  }
}

const VariantsExample = () => {
  const [items, setItems] = useState([1, 2, 3, 4, 5])
  const [showItems, setShowItems] = useState(true)
  
  const addItem = () => {
    setItems([...items, items.length + 1])
  }
  
  const removeItem = () => {
    if (items.length > 0) {
      setItems(items.slice(0, -1))
    }
  }
  
  return (
    <div className="animation-example">
      <h3>Animation Variants</h3>
      
      <div className="animation-controls">
        <button onClick={() => setShowItems(!showItems)}>
          Toggle Items
        </button>
        <button onClick={addItem}>
          Add Item
        </button>
        <button onClick={removeItem}>
          Remove Item
        </button>
      </div>
      
      <AnimatePresence mode="wait">
        {showItems && (
          <motion.div
            className="variants-container"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            {items.map(item => (
              <motion.div
                key={item}
                className="variant-item"
                variants={variants}
                layout
                transition={{ type: 'spring', stiffness: 300 }}
              >
                Item {item}
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// Example 4: Scroll Animations
const ScrollAnimations = () => {
  const [scrollY, setScrollY] = useState(0)
  
  React.useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])
  
  return (
    <div className="animation-example">
      <h3>Scroll Animations</h3>
      
      <div className="scroll-container">
        <motion.div
          className="scroll-box"
          style={{ y: scrollY * 0.5 }}
        >
          Parallax
        </motion.div>
        
        <motion.div
          className="scroll-box"
          animate={{ rotate: scrollY }}
        >
          Rotate on scroll
        </motion.div>
        
        <motion.div
          className="scroll-box"
          animate={{ scale: 1 + scrollY * 0.001 }}
        >
          Scale on scroll
        </motion.div>
      </div>
      
      <div className="scroll-indicator">
        Scroll the page to see animations
        <br />
        Current scroll: {Math.round(scrollY)}px
      </div>
    </div>
  )
}

// Example 5: Layout Animations
const LayoutAnimations = () => {
  const [items, setItems] = useState([
    { id: 1, text: 'Item 1' },
    { id: 2, text: 'Item 2' },
    { id: 3, text: 'Item 3' }
  ])
  
  const shuffle = () => {
    setItems([...items].sort(() => Math.random() - 0.5))
  }
  
  const addItem = () => {
    const newId = Math.max(...items.map(item => item.id)) + 1
    setItems([...items, { id: newId, text: `Item ${newId}` }])
  }
  
  const removeItem = (id) => {
    setItems(items.filter(item => item.id !== id))
  }
  
  return (
    <div className="animation-example">
      <h3>Layout Animations</h3>
      
      <div className="animation-controls">
        <button onClick={shuffle}>Shuffle</button>
        <button onClick={addItem}>Add Item</button>
      </div>
      
      <motion.div className="layout-container" layout>
        <AnimatePresence>
          {items.map(item => (
            <motion.div
              key={item.id}
              className="layout-item"
              layout
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ type: 'spring' }}
              onClick={() => removeItem(item.id)}
            >
              {item.text}
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>
    </div>
  )
}

// Example 6: Physics Animations
const PhysicsAnimations = () => {
  const x = useMotionValue(0)
  const background = useTransform(
    x,
    [-100, 0, 100],
    ['#ef4444', '#3b82f6', '#10b981']
  )
  const scale = useTransform(x, [-100, 0, 100], [0.5, 1, 1.5])
  const rotate = useTransform(x, [-100, 0, 100], [-45, 0, 45])
  
  const springConfig = { damping: 10, stiffness: 100 }
  const animatedX = useSpring(x, springConfig)
  const animatedScale = useSpring(scale, springConfig)
  const animatedRotate = useSpring(rotate, springConfig)
  
  return (
    <div className="animation-example">
      <h3>Physics Animations</h3>
      
      <div className="physics-container">
        <motion.div
          className="physics-box"
          style={{
            x: animatedX,
            scale: animatedScale,
            rotate: animatedRotate,
            background
          }}
          drag="x"
          dragConstraints={{ left: -100, right: 100 }}
          dragElastic={0.2}
        />
        
        <div className="physics-controls">
          <button onClick={() => x.set(-100)}>Left</button>
          <button onClick={() => x.set(0)}>Center</button>
          <button onClick={() => x.set(100)}>Right</button>
        </div>
      </div>
      
      <div className="physics-info">
        <p>Drag the box or use buttons to see physics-based animations</p>
        <p>The box uses spring physics for smooth, natural movement</p>
      </div>
    </div>
  )
}

// Example 7: Complex Animation Sequence
const ComplexAnimation = () => {
  const [isAnimating, setIsAnimating] = useState(false)
  
  const sequenceVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        when: 'beforeChildren',
        staggerChildren: 0.3,
        delayChildren: 0.2
      }
    }
  }
  
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: 'spring',
        stiffness: 100
      }
    }
  }
  
  return (
    <div className="animation-example">
      <h3>Complex Animation Sequence</h3>
      
      <div className="animation-controls">
        <button onClick={() => setIsAnimating(!isAnimating)}>
          {isAnimating ? 'Reset' : 'Start Animation'}
        </button>
      </div>
      
      <AnimatePresence>
        {isAnimating && (
          <motion.div
            className="complex-container"
            variants={sequenceVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
          >
            <motion.div variants={itemVariants} className="complex-item">
              First
            </motion.div>
            <motion.div variants={itemVariants} className="complex-item">
              Second
            </motion.div>
            <motion.div variants={itemVariants} className="complex-item">
              Third
            </motion.div>
            <motion.div variants={itemVariants} className="complex-item">
              Fourth
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// Main Component
const AnimationExample = () => {
  const [activeTab, setActiveTab] = useState('basic')
  
  return (
    <div className="framer-motion-example">
      <div className="example-container">
        <div className="example-header">
          <h2>Framer Motion Examples</h2>
          <p>Learn declarative animations and gestures with Framer Motion</p>
        </div>
        
        <div className="example-section">
          <h3>Basic Animation Setup</h3>
          <div className="code-block">
            <pre>{`import { motion, AnimatePresence } from 'framer-motion'

<motion.div
  initial={{ opacity: 0 }}
  animate={{ opacity: 1 }}
  exit={{ opacity: 0 }}
  transition={{ duration: 0.5 }}
>
  Animated content
</motion.div>`}</pre>
          </div>
        </div>
        
        <div className="example-section">
          <h3>Gesture Animations</h3>
          <div className="code-block">
            <pre>{`<motion.div
  drag
  dragConstraints={{ left: -100, right: 100 }}
  whileHover={{ scale: 1.1 }}
  whileTap={{ scale: 0.9 }}
>
  Draggable element
</motion.div>`}</pre>
          </div>
        </div>
        
        <div className="example-section">
          <h3>Interactive Examples</h3>
          <div className="tab-navigation">
            <button 
              className={activeTab === 'basic' ? 'active' : ''}
              onClick={() => setActiveTab('basic')}
            >
              Basic
            </button>
            <button 
              className={activeTab === 'gestures' ? 'active' : ''}
              onClick={() => setActiveTab('gestures')}
            >
              Gestures
            </button>
            <button 
              className={activeTab === 'variants' ? 'active' : ''}
              onClick={() => setActiveTab('variants')}
            >
              Variants
            </button>
            <button 
              className={activeTab === 'scroll' ? 'active' : ''}
              onClick={() => setActiveTab('scroll')}
            >
              Scroll
            </button>
            <button 
              className={activeTab === 'layout' ? 'active' : ''}
              onClick={() => setActiveTab('layout')}
            >
              Layout
            </button>
            <button 
              className={activeTab === 'physics' ? 'active' : ''}
              onClick={() => setActiveTab('physics')}
            >
              Physics
            </button>
            <button 
              className={activeTab === 'complex' ? 'active' : ''}
              onClick={() => setActiveTab('complex')}
            >
              Complex
            </button>
          </div>
          
          <div className="tab-content">
            {activeTab === 'basic' && <BasicAnimations />}
            {activeTab === 'gestures' && <GestureAnimations />}
            {activeTab === 'variants' && <VariantsExample />}
            {activeTab === 'scroll' && <ScrollAnimations />}
            {activeTab === 'layout' && <LayoutAnimations />}
            {activeTab === 'physics' && <PhysicsAnimations />}
            {activeTab === 'complex' && <ComplexAnimation />}
          </div>
        </div>
        
        <div className="exercise">
          <h4>Exercise:</h4>
          <p>Create an interactive animation showcase with Framer Motion:</p>
          <ul>
            <li>Build a card gallery with hover and tap animations</li>
            <li>Implement a drag-and-drop interface with smooth animations</li>
            <li>Create a page transition system between different views</li>
            <li>Add scroll-triggered animations for content reveal</li>
            <li>Build a physics-based interactive playground</li>
            <li>Create a loading animation sequence with staggered elements</li>
          </ul>
        </div>
      </div>
    </div>
  )
}

export default AnimationExample