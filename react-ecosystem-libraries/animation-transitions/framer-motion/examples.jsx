// Framer Motion Examples with Detailed Comments
// This file demonstrates various Framer Motion concepts with comprehensive explanations

import React, { useState } from 'react';
import {
  motion,
  AnimatePresence,
  useMotionValue,
  useSpring,
  useScroll,
  useTransform,
  LayoutGroup,
} from 'framer-motion';

// ===== EXAMPLE 1: BASIC ANIMATIONS =====
/**
 * Basic animations demonstrating core Framer Motion concepts
 * Framer Motion provides a declarative API for animations
 */

// Simple Box Animation
function AnimatedBox() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div style={{ padding: '20px', textAlign: 'center' }}>
      <h3>Basic Box Animation</h3>
      
      <motion.div
        className="box"
        layout // Animate layout changes
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        style={{
          width: 150,
          height: 150,
          backgroundColor: '#007bff',
          borderRadius: 10,
          margin: '20px auto',
          cursor: 'pointer'
        }}
        onClick={() => setIsOpen(!isOpen)}
      />
      
      <button
        onClick={() => setIsOpen(!isOpen)}
        style={{ marginTop: '10px', padding: '10px 20px' }}
      >
        Toggle Box Animation
      </button>
    </div>
  );
}

// Hover and Tap Animations
function InteractiveCard() {
  return (
    <div style={{ padding: '20px', textAlign: 'center' }}>
      <h3>Hover and Tap Animations</h3>
      
      <motion.div
        className="card"
        whileHover={{ 
          scale: 1.05, 
          backgroundColor: '#28a745',
          transition: { duration: 0.2 }
        }}
        whileTap={{ 
          scale: 0.95, 
          backgroundColor: '#dc3545',
          transition: { duration: 0.1 }
        }}
        style={{
          width: 200,
          height: 200,
          backgroundColor: '#007bff',
          borderRadius: 10,
          margin: '20px auto',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          fontSize: '18px',
          cursor: 'pointer'
        }}
      >
        <div>
          <h4>Interactive Card</h4>
          <p>Hover or tap me!</p>
        </div>
      </motion.div>
    </div>
  );
}

// ===== EXAMPLE 2: GESTURE ANIMATIONS =====
/**
 * Gesture animations demonstrating drag, pan, and other gestures
 * Framer Motion provides comprehensive gesture support
 */

function DraggableBox() {
  return (
    <div style={{ padding: '20px', textAlign: 'center' }}>
      <h3>Draggable Box</h3>
      
      <motion.div
        drag
        dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
        dragElastic={0.2}
        style={{
          width: 150,
          height: 150,
          backgroundColor: '#17a2b8',
          borderRadius: 10,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          cursor: 'grab'
        }}
        whileDrag={{ 
          scale: 1.1, 
          backgroundColor: '#138496',
          cursor: 'grabbing'
        }}
      >
        <div>Drag Me!</div>
      </motion.div>
    </div>
  );
}

function PanGestureExample() {
  const [x, setX] = useState(0);
  const [y, setY] = useState(0);

  const handlePan = (event, info) => {
    // Update position based on pan gesture
    setX(x + info.delta.x);
    setY(y + info.delta.y);
  };

  return (
    <div style={{ padding: '20px', textAlign: 'center' }}>
      <h3>Pan Gesture</h3>
      
      <motion.div
        onPan={handlePan}
        style={{
          width: 200,
          height: 200,
          backgroundColor: '#ffc107',
          borderRadius: 10,
          position: 'relative',
          margin: '20px auto',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'grab'
        }}
      >
        <div>
          <p>Pan around!</p>
          <p>Position: ({Math.round(x)}, {Math.round(y)})</p>
        </div>
      </motion.div>
    </div>
  );
}

// ===== EXAMPLE 3: SPRING ANIMATIONS =====
/**
 * Spring animations demonstrating physics-based animations
 * useSpring provides spring physics for natural movement
 */

function SpringAnimation() {
  const [isToggled, setIsToggled] = useState(false);
  
  // Spring configuration for smooth, physics-based animation
  const springConfig = {
    tension: 300,    // Stiffness of the spring
    friction: 30,    // How much the spring resists movement
    mass: 1,        // Weight of the object
  };

  return (
    <div style={{ padding: '20px', textAlign: 'center' }}>
      <h3>Spring Animation</h3>
      
      <motion.div
        animate={{
          rotate: isToggled ? 180 : 0,
          scale: isToggled ? 1.2 : 1,
        }}
        transition={{
          type: 'spring',
          stiffness: springConfig.tension,
          damping: springConfig.friction,
          mass: springConfig.mass,
        }}
        style={{
          width: 100,
          height: 100,
          backgroundColor: '#28a745',
          borderRadius: 10,
          margin: '20px auto',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          cursor: 'pointer'
        }}
        onClick={() => setIsToggled(!isToggled)}
      >
        <div>Spring!</div>
      </motion.div>
      
      <button
        onClick={() => setIsToggled(!isToggled)}
        style={{ marginTop: '10px', padding: '10px 20px' }}
      >
        Toggle Spring
      </button>
    </div>
  );
}

function AnimatedProgress() {
  const [progress, setProgress] = useState(0);

  // Animated value for progress
  const progressValue = useMotionValue(0);

  // Spring animation for progress bar
  const progressSpring = useSpring(progressValue, {
    stiffness: 100,
    damping: 20,
  });

  const handleProgressChange = (newProgress) => {
    setProgress(newProgress);
    progressValue.set(newProgress);
  };

  return (
    <div style={{ padding: '20px', textAlign: 'center' }}>
      <h3>Animated Progress Bar</h3>
      
      <div style={{ width: 300, margin: '20px auto' }}>
        <motion.div
          style={{
            height: 30,
            backgroundColor: '#e9ecef',
            borderRadius: 15,
            overflow: 'hidden'
          }}
        >
          <motion.div
            style={{
              height: '100%',
              backgroundColor: '#28a745',
              borderRadius: 15,
              scaleX: progressSpring.x, // Use spring value for horizontal scale
            }}
          />
        </motion.div>
      </div>
      
      <div style={{ marginTop: '20px' }}>
        <input
          type="range"
          min="0"
          max="100"
          value={progress}
          onChange={(e) => handleProgressChange(Number(e.target.value))}
          style={{ width: 300 }}
        />
        <p>Progress: {Math.round(progress)}%</p>
      </div>
    </div>
  );
}

// ===== EXAMPLE 4: LAYOUT ANIMATIONS =====
/**
 * Layout animations demonstrating automatic position transitions
 * LayoutGroup and layout prop for smooth reordering
 */

function AnimatedList() {
  const [items, setItems] = useState([
    { id: 1, text: 'Item 1' },
    { id: 2, text: 'Item 2' },
    { id: 3, text: 'Item 3' },
    { id: 4, text: 'Item 4' },
  ]);

  const shuffleItems = () => {
    // Shuffle array for demonstration
    const shuffled = [...items].sort(() => Math.random() - 0.5);
    setItems(shuffled);
  };

  const addItem = () => {
    const newItem = {
      id: Date.now(),
      text: `Item ${items.length + 1}`
    };
    setItems([...items, newItem]);
  };

  const removeItem = (id) => {
    setItems(items.filter(item => item.id !== id));
  };

  return (
    <div style={{ padding: '20px', textAlign: 'center' }}>
      <h3>Animated List</h3>
      
      <div style={{ marginBottom: '20px' }}>
        <button onClick={shuffleItems} style={{ marginRight: '10px' }}>
          Shuffle Items
        </button>
        <button onClick={addItem} style={{ marginRight: '10px' }}>
          Add Item
        </button>
      </div>
      
      <LayoutGroup>
        {items.map((item, index) => (
          <motion.div
            key={item.id}
            layout // Enable layout animations
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            transition={{
              opacity: { duration: 0.2 },
              layout: { duration: 0.3 }
            }}
            style={{
              padding: '10px 20px',
              margin: '5px',
              backgroundColor: '#007bff',
              color: 'white',
              borderRadius: 8,
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}
          >
            <span>{item.text}</span>
            <button
              onClick={() => removeItem(item.id)}
              style={{
                padding: '5px 10px',
                backgroundColor: '#dc3545',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              Remove
            </button>
          </motion.div>
        ))}
      </LayoutGroup>
    </div>
  );
}

// ===== EXAMPLE 5: SCROLL ANIMATIONS =====
/**
 * Scroll animations demonstrating scroll-based animations
 * useScroll hook provides scroll position and velocity
 */

function ScrollAnimation() {
  const { scrollY, scrollYProgress } = useScroll();

  return (
    <div style={{ padding: '20px', textAlign: 'center' }}>
      <h3>Scroll Animation</h3>
      
      <div style={{ height: '200vh', position: 'relative' }}>
        {/* Fixed header */}
        <motion.div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            height: 60,
            backgroundColor: '#007bff',
            color: 'white',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000
          }}
        >
          <h4>Scroll Progress: {Math.round(scrollYProgress * 100)}%</h4>
        </motion.div>
        
        {/* Content that responds to scroll */}
        <motion.div
          style={{
            position: 'absolute',
            top: 80,
            left: 50,
            transform: useTransform(scrollY, (y) => `translateY(${y * 0.5}px)`),
          }}
        >
          <div
            style={{
              width: 200,
              height: 200,
              backgroundColor: '#28a745',
              borderRadius: 10,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white'
            }}
          >
            <div>
              <h4>Scroll Position</h4>
              <p>Y: {Math.round(scrollY.get())}px</p>
              <p>Progress: {Math.round(scrollYProgress * 100)}%</p>
            </div>
          </div>
        </motion.div>
        
        {/* Scroll indicator */}
        <motion.div
          style={{
            position: 'fixed',
            bottom: 20,
            right: 20,
            width: 50,
            height: 50,
            backgroundColor: '#ffc107',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
          animate={{
            scale: scrollYProgress > 0.1 ? 1.2 : 1,
            opacity: scrollYProgress > 0.1 ? 1 : 0.5
          }}
        >
          <span style={{ fontSize: '12px' }}>↓</span>
        </motion.div>
      </div>
    </div>
  );
}

// ===== EXAMPLE 6: PRESENCE ANIMATIONS =====
/**
 * Presence animations demonstrating enter/exit transitions
 * AnimatePresence handles component mount/unmount animations
 */

function PresenceAnimation() {
  const [isVisible, setIsVisible] = useState(false);
  const [items, setItems] = useState([
    { id: 1, text: 'First Item' },
    { id: 2, text: 'Second Item' },
    { id: 3, text: 'Third Item' },
  ]);

  const toggleVisibility = () => {
    setIsVisible(!isVisible);
  };

  const addItem = () => {
    const newItem = {
      id: Date.now(),
      text: `Item ${items.length + 1}`
    };
    setItems([...items, newItem]);
  };

  const removeItem = (id) => {
    setItems(items.filter(item => item.id !== id));
  };

  return (
    <div style={{ padding: '20px', textAlign: 'center' }}>
      <h3>Presence Animation</h3>
      
      <button onClick={toggleVisibility} style={{ marginBottom: '20px' }}>
        {isVisible ? 'Hide Modal' : 'Show Modal'}
      </button>
      
      <AnimatePresence>
        {isVisible && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.3 }}
            style={{
              position: 'fixed',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: 400,
              height: 300,
              backgroundColor: 'white',
              borderRadius: 15,
              boxShadow: '0 10px 25px rgba(0,0,0,0.2)',
              zIndex: 1000,
              padding: '20px'
            }}
          >
            <h3>Animated Modal</h3>
            <p>This modal animates in and out smoothly.</p>
            <button
              onClick={toggleVisibility}
              style={{
                padding: '10px 20px',
                backgroundColor: '#dc3545',
                color: 'white',
                border: 'none',
                borderRadius: '5px',
                cursor: 'pointer'
              }}
            >
              Close
            </button>
          </motion.div>
        )}
      </AnimatePresence>
      
      <div style={{ marginTop: '20px' }}>
        <button onClick={addItem} style={{ marginRight: '10px' }}>
          Add Item
        </button>
        
        <LayoutGroup>
          {items.map((item) => (
            <motion.div
              key={item.id}
              layout
              initial={{ opacity: 0, x: -100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 100 }}
              transition={{ duration: 0.3 }}
              style={{
                padding: '10px 15px',
                margin: '5px',
                backgroundColor: '#007bff',
                color: 'white',
                borderRadius: 8,
                display: 'inline-block'
              }}
            >
              {item.text}
            </motion.div>
          ))}
        </LayoutGroup>
      </div>
    </div>
  );
}

// ===== EXAMPLE 7: COMPLEX ANIMATION SEQUENCES =====
/**
 * Complex animation sequences demonstrating choreographed animations
 * Variants and animation sequences for complex interactions
 */

// Animation variants for different states
const boxVariants = {
  hidden: { 
    opacity: 0, 
    scale: 0.8, 
    rotate: -180 
  },
  visible: { 
    opacity: 1, 
    scale: 1, 
    rotate: 0 
  },
  hover: {
    scale: 1.1,
    rotate: 5,
    transition: { duration: 0.2 }
  },
  tap: {
    scale: 0.9,
    rotate: -5,
    transition: { duration: 0.1 }
  }
};

function ComplexAnimation() {
  const [isAnimating, setIsAnimating] = useState(false);
  const [currentVariant, setCurrentVariant] = useState('hidden');

  const startAnimation = () => {
    setIsAnimating(true);
    setCurrentVariant('visible');
    
    // Reset after animation completes
    setTimeout(() => {
      setIsAnimating(false);
    }, 2000);
  };

  const resetAnimation = () => {
    setCurrentVariant('hidden');
  };

  return (
    <div style={{ padding: '20px', textAlign: 'center' }}>
      <h3>Complex Animation Sequence</h3>
      
      <motion.div
        variants={boxVariants}
        animate={currentVariant}
        transition={{ duration: 0.5, ease: 'easeInOut' }}
        style={{
          width: 150,
          height: 150,
          backgroundColor: '#28a745',
          borderRadius: 10,
          margin: '20px auto',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          cursor: 'pointer'
        }}
        whileHover="hover"
        whileTap="tap"
        onTap={startAnimation}
      >
        <div>
          {isAnimating ? 'Animating...' : 'Tap to Animate'}
        </div>
      </motion.div>
      
      <div style={{ marginTop: '20px' }}>
        <button onClick={startAnimation} disabled={isAnimating} style={{ marginRight: '10px' }}>
          Start Animation
        </button>
        <button onClick={resetAnimation} style={{ marginRight: '10px' }}>
          Reset
        </button>
      </div>
    </div>
  );
}

// ===== MAIN APP COMPONENT =====
/**
 * Main component that demonstrates all Framer Motion examples
 */
function FramerMotionExamples() {
  return (
    <div style={{ fontFamily: 'Arial, sans-serif', maxWidth: '1200px', margin: '0 auto', padding: '20px' }}>
      <h1>Framer Motion Examples</h1>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '30px' }}>
        <AnimatedBox />
        <InteractiveCard />
        <DraggableBox />
        <PanGestureExample />
        <SpringAnimation />
        <AnimatedProgress />
      </div>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '30px' }}>
        <AnimatedList />
        <ScrollAnimation />
        <PresenceAnimation />
        <ComplexAnimation />
      </div>
      
      <div style={{ 
        marginTop: '40px', 
        padding: '30px', 
        backgroundColor: '#f8f9fa', 
        borderRadius: '10px' 
      }}>
        <h3>Framer Motion Benefits</h3>
        <ul>
          <li><strong>Declarative API:</strong> Define animations with simple props</li>
          <li><strong>Physics-based:</strong> Natural spring and physics animations</li>
          <li><strong>Gesture Support:</strong> Built-in drag, pan, tap, and more</li>
          <li><strong>Performance Optimized:</strong> 60fps animations by default</li>
          <li><strong>Layout Animations:</strong> Automatic position transitions</li>
          <li><strong>Server-side Rendering:</strong> Works with Next.js and other frameworks</li>
          <li><strong>TypeScript Support:</strong> Excellent type safety</li>
          <li><strong>Small Bundle Size:</strong> Tree-shakable and optimized</li>
        </ul>
        
        <h4>Key Concepts Demonstrated:</h4>
        <ul>
          <li><strong>Basic Animations:</strong> opacity, scale, rotate, position</li>
          <li><strong>Gestures:</strong> drag, pan, tap, hover</li>
          <li><strong>Springs:</strong> physics-based natural movement</li>
          <li><strong>Layout:</strong> automatic reordering animations</li>
          <li><strong>Scroll:</strong> scroll-based animations</li>
          <li><strong>Presence:</strong> enter/exit transitions</li>
          <li><strong>Variants:</strong> predefined animation states</li>
        </ul>
      </div>
    </div>
  );
}

export default FramerMotionExamples;