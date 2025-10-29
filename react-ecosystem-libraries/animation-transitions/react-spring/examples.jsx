// React Spring Examples with Detailed Comments
// This file demonstrates various React Spring concepts with comprehensive explanations

import React, { useState, useRef, useEffect } from 'react';
import {
  useSpring,
  animated,
  useTrail,
  useTransition,
  useChain,
  useSpringRef,
  config,
  Spring,
  Trail,
  Transition,
} from '@react-spring/web';

// ===== EXAMPLE 1: BASIC SPRING ANIMATIONS =====
/**
 * Basic spring animations demonstrating core React Spring concepts
 * useSpring hook provides physics-based animations
 */

function BasicSpring() {
  const [isToggled, setIsToggled] = useState(false);

  // Basic useSpring hook with from/to animation
  const springs = useSpring({
    from: { 
      opacity: 0, 
      transform: 'scale(0.5) rotate(0deg)' 
    },
    to: { 
      opacity: isToggled ? 1 : 0.5, 
      transform: isToggled ? 'scale(1) rotate(180deg)' : 'scale(0.8) rotate(0deg)' 
    },
    config: {
      tension: 200,
      friction: 20,
    },
  });

  return (
    <div style={{ padding: '20px', textAlign: 'center' }}>
      <h3>Basic Spring Animation</h3>
      
      <animated.div
        style={{
          width: 150,
          height: 150,
          backgroundColor: '#007bff',
          borderRadius: 10,
          margin: '20px auto',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          fontSize: '18px',
          cursor: 'pointer',
          ...springs,
        }}
        onClick={() => setIsToggled(!isToggled)}
      >
        <div>Click Me!</div>
      </animated.div>
      
      <button
        onClick={() => setIsToggled(!isToggled)}
        style={{ padding: '10px 20px' }}
      >
        Toggle Animation
      </button>
    </div>
  );
}

// ===== EXAMPLE 2: SPRING WITH API CONTROL =====
/**
 * Spring animation with API control demonstrating programmatic animation control
 * useSpring returns [springs, api] for manual control
 */

function ApiControlledSpring() {
  const [springs, api] = useSpring(() => ({
    from: { x: 0, y: 0, scale: 1 },
  }));

  const handleMove = (direction) => {
    api.start({
      to: {
        x: direction === 'right' ? 200 : direction === 'left' ? -200 : 0,
        y: direction === 'down' ? 200 : direction === 'up' ? -200 : 0,
        scale: 1.2,
      },
      config: config.wobbly,
    });

    // Reset scale after animation
    setTimeout(() => {
      api.start({ scale: 1 });
    }, 500);
  };

  const handleReset = () => {
    api.start({
      to: { x: 0, y: 0, scale: 1 },
      config: config.gentle,
    });
  };

  return (
    <div style={{ padding: '20px', textAlign: 'center' }}>
      <h3>API Controlled Spring</h3>
      
      <div style={{ 
        height: '300px', 
        position: 'relative', 
        margin: '20px auto',
        width: '400px',
        border: '1px dashed #ccc',
        borderRadius: '10px'
      }}>
        <animated.div
          style={{
            width: 80,
            height: 80,
            backgroundColor: '#28a745',
            borderRadius: '50%',
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: springs.to(
              (x, y, scale) => `translate(calc(-50% + ${x}px), calc(-50% + ${y}px)) scale(${scale})`
            ),
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            fontSize: '12px',
          }}
        >
          Move Me
        </animated.div>
      </div>
      
      <div style={{ marginTop: '20px' }}>
        <button onClick={() => handleMove('up')} style={{ margin: '5px' }}>↑</button>
        <br />
        <button onClick={() => handleMove('left')} style={{ margin: '5px' }}>←</button>
        <button onClick={handleReset} style={{ margin: '5px' }}>Reset</button>
        <button onClick={() => handleMove('right')} style={{ margin: '5px' }}>→</button>
        <br />
        <button onClick={() => handleMove('down')} style={{ margin: '5px' }}>↓</button>
      </div>
    </div>
  );
}

// ===== EXAMPLE 3: TRAIL ANIMATIONS =====
/**
 * Trail animations demonstrating staggered animations
 * useTrail creates multiple springs with staggered animations
 */

function TrailAnimation() {
  const [items, setItems] = useState([
    { id: 1, text: 'Item 1' },
    { id: 2, text: 'Item 2' },
    { id: 3, text: 'Item 3' },
    { id: 4, text: 'Item 4' },
  ]);

  const [isToggled, setIsToggled] = useState(false);

  // useTrail creates a trail of springs
  const trail = useTrail(items.length, {
    from: { 
      opacity: 0, 
      transform: 'translateX(-50px) scale(0.8)' 
    },
    to: { 
      opacity: isToggled ? 1 : 0.3, 
      transform: isToggled ? 'translateX(0px) scale(1)' : 'translateX(-20px) scale(0.9)' 
    },
    config: { 
      tension: 220, 
      friction: 20 
    },
    delay: isToggled ? 100 : 0,
  });

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
      <h3>Trail Animation</h3>
      
      <div style={{ marginBottom: '20px' }}>
        <button onClick={() => setIsToggled(!isToggled)} style={{ marginRight: '10px' }}>
          {isToggled ? 'Collapse' : 'Expand'} Trail
        </button>
        <button onClick={addItem}>Add Item</button>
      </div>
      
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px' }}>
        {trail.map((props, index) => (
          <animated.div
            key={items[index]?.id || index}
            style={{
              padding: '15px 25px',
              backgroundColor: '#ffc107',
              borderRadius: '8px',
              color: '#333',
              fontWeight: 'bold',
              cursor: 'pointer',
              ...props,
            }}
            onClick={() => items[index] && removeItem(items[index].id)}
          >
            {items[index]?.text || 'Loading...'}
          </animated.div>
        ))}
      </div>
    </div>
  );
}

// ===== EXAMPLE 4: TRANSITION ANIMATIONS =====
/**
 * Transition animations demonstrating enter/exit animations
 * useTransition handles component mount/unmount animations
 */

function TransitionAnimation() {
  const [items, setItems] = useState([
    { id: 1, text: 'First Item' },
    { id: 2, text: 'Second Item' },
  ]);

  // useTransition for enter/exit animations
  const transitions = useTransition(items, {
    from: { 
      opacity: 0, 
      transform: 'translateY(-20px) scale(0.8)' 
    },
    enter: { 
      opacity: 1, 
      transform: 'translateY(0px) scale(1)' 
    },
    leave: { 
      opacity: 0, 
      transform: 'translateY(20px) scale(0.8)' 
    },
    config: { 
      tension: 200, 
      friction: 20 
    },
  });

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
      <h3>Transition Animation</h3>
      
      <button onClick={addItem} style={{ marginBottom: '20px', padding: '10px 20px' }}>
        Add Item
      </button>
      
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px' }}>
        {transitions((style, item) => (
          <animated.div
            key={item.id}
            style={{
              padding: '15px 25px',
              backgroundColor: '#dc3545',
              color: 'white',
              borderRadius: '8px',
              cursor: 'pointer',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              minWidth: '200px',
              ...style,
            }}
            onClick={() => removeItem(item.id)}
          >
            <span>{item.text}</span>
            <span style={{ marginLeft: '10px', fontSize: '18px' }}>×</span>
          </animated.div>
        ))}
      </div>
    </div>
  );
}

// ===== EXAMPLE 5: CHAINED ANIMATIONS =====
/**
 * Chained animations demonstrating sequential animation control
 * useChain allows you to chain multiple animations
 */

function ChainedAnimation() {
  const [isAnimating, setIsAnimating] = useState(false);

  // Create refs for chaining
  const springRef = useSpringRef();
  const trailRef = useSpringRef();

  // First spring animation
  const springs = useSpring({
    ref: springRef,
    from: { 
      opacity: 0, 
      transform: 'rotate(0deg) scale(0.5)' 
    },
    to: { 
      opacity: 1, 
      transform: 'rotate(360deg) scale(1)' 
    },
    config: { 
      tension: 200, 
      friction: 20 
    },
  });

  // Trail animation that follows the spring
  const trail = useTrail(3, {
    ref: trailRef,
    from: { 
      opacity: 0, 
      transform: 'translateY(20px)' 
    },
    to: { 
      opacity: 1, 
      transform: 'translateY(0px)' 
    },
    config: { 
      tension: 180, 
      friction: 25 
    },
  });

  // Chain the animations
  useChain([springRef, trailRef], [0, 0.5]);

  const startAnimation = () => {
    setIsAnimating(true);
    springRef.start();
    
    // Reset after animation completes
    setTimeout(() => {
      setIsAnimating(false);
      springRef.stop();
      trailRef.stop();
    }, 3000);
  };

  return (
    <div style={{ padding: '20px', textAlign: 'center' }}>
      <h3>Chained Animation</h3>
      
      <button 
        onClick={startAnimation} 
        disabled={isAnimating}
        style={{ marginBottom: '30px', padding: '10px 20px' }}
      >
        {isAnimating ? 'Animating...' : 'Start Chain Animation'}
      </button>
      
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px' }}>
        <animated.div
          style={{
            width: 100,
            height: 100,
            backgroundColor: '#17a2b8',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            fontSize: '14px',
            ...springs,
          }}
        >
          First
        </animated.div>
        
        <div style={{ display: 'flex', gap: '10px' }}>
          {trail.map((props, index) => (
            <animated.div
              key={index}
              style={{
                width: 60,
                height: 60,
                backgroundColor: '#6f42c1',
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                fontSize: '12px',
                ...props,
              }}
            >
              {index + 1}
            </animated.div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ===== EXAMPLE 6: INTERACTIVE CARD WITH MOUSE =====
/**
 * Interactive card demonstrating mouse-based animations
 * Advanced example with mouse tracking and spring physics
 */

function InteractiveCard() {
  const cardRef = useRef(null);
  const [isHovered, setIsHovered] = useState(false);

  const [{ xys }, api] = useSpring(() => ({
    xys: [0, 0, 1],
    config: { 
      mass: 1, 
      tension: 170, 
      friction: 26,
      clamp: true,
    },
  }));

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    
    const rect = cardRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    
    api.start({
      xys: [
        (y - 0.5) * 20,  // Rotate X based on Y position
        (x - 0.5) * -20, // Rotate Y based on X position
        isHovered ? 1.05 : 1, // Scale on hover
      ],
    });
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    api.start({
      xys: [0, 0, 1],
    });
  };

  return (
    <div style={{ padding: '20px', textAlign: 'center' }}>
      <h3>Interactive 3D Card</h3>
      
      <div style={{ 
        display: 'inline-block', 
        perspective: '1000px',
        margin: '20px'
      }}>
        <animated.div
          ref={cardRef}
          onMouseMove={handleMouseMove}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          style={{
            width: 300,
            height: 200,
            backgroundColor: isHovered ? '#007bff' : '#6c757d',
            borderRadius: '15px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            fontSize: '18px',
            fontWeight: 'bold',
            cursor: 'pointer',
            boxShadow: isHovered ? '0 20px 40px rgba(0,0,0,0.3)' : '0 10px 20px rgba(0,0,0,0.1)',
            transform: xys.to((x, y, s) => 
              `perspective(600px) rotateX(${x}deg) rotateY(${y}deg) scale(${s})`
            ),
          }}
        >
          <div>
            <h4>Hover Over Me!</h4>
            <p>Move your mouse to see the 3D effect</p>
          </div>
        </animated.div>
      </div>
    </div>
  );
}

// ===== EXAMPLE 7: SPRING CONFIG VISUALIZER =====
/**
 * Spring config visualizer demonstrating different spring configurations
 * Shows how different configs affect animation behavior
 */

function ConfigVisualizer() {
  const [configType, setConfigType] = useState('default');
  const [isAnimating, setIsAnimating] = useState(false);

  const configs = {
    default: config.default,
    gentle: config.gentle,
    wobbly: config.wobbly,
    stiff: config.stiff,
    slow: config.slow,
    molasses: config.molasses,
  };

  const springs = useSpring({
    from: { 
      transform: 'translateX(0px) rotate(0deg)' 
    },
    to: { 
      transform: isAnimating ? 'translateX(200px) rotate(360deg)' : 'translateX(0px) rotate(0deg)' 
    },
    config: configs[configType],
  });

  const startAnimation = () => {
    setIsAnimating(true);
    setTimeout(() => setIsAnimating(false), 2000);
  };

  return (
    <div style={{ padding: '20px', textAlign: 'center' }}>
      <h3>Spring Config Visualizer</h3>
      
      <div style={{ marginBottom: '20px' }}>
        <label style={{ marginRight: '10px' }}>Config Type:</label>
        <select 
          value={configType} 
          onChange={(e) => setConfigType(e.target.value)}
          style={{ padding: '5px', marginRight: '10px' }}
        >
          <option value="default">Default</option>
          <option value="gentle">Gentle</option>
          <option value="wobbly">Wobbly</option>
          <option value="stiff">Stiff</option>
          <option value="slow">Slow</option>
          <option value="molasses">Molasses</option>
        </select>
        
        <button onClick={startAnimation} style={{ padding: '10px 20px' }}>
          Animate
        </button>
      </div>
      
      <div style={{ 
        height: '100px', 
        position: 'relative', 
        margin: '20px auto',
        width: '400px',
        border: '1px dashed #ccc',
        borderRadius: '10px'
      }}>
        <animated.div
          style={{
            width: 60,
            height: 60,
            backgroundColor: '#28a745',
            borderRadius: '50%',
            position: 'absolute',
            top: '50%',
            left: '20px',
            transform: springs.transform,
            marginTop: '-30px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            fontSize: '12px',
          }}
        >
          {configType}
        </animated.div>
      </div>
      
      <div style={{ marginTop: '20px', fontSize: '14px', color: '#666' }}>
        <p><strong>Current Config:</strong> {configType}</p>
        <p>Try different configs to see how they affect the animation feel!</p>
      </div>
    </div>
  );
}

// ===== MAIN APP COMPONENT =====
/**
 * Main component that demonstrates all React Spring examples
 */
function ReactSpringExamples() {
  return (
    <div style={{ fontFamily: 'Arial, sans-serif', maxWidth: '1200px', margin: '0 auto', padding: '20px' }}>
      <h1>React Spring Examples</h1>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '30px' }}>
        <BasicSpring />
        <ApiControlledSpring />
        <TrailAnimation />
        <TransitionAnimation />
      </div>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(500px, 1fr))', gap: '30px' }}>
        <ChainedAnimation />
        <InteractiveCard />
        <ConfigVisualizer />
      </div>
      
      <div style={{ 
        marginTop: '40px', 
        padding: '30px', 
        backgroundColor: '#f8f9fa', 
        borderRadius: '10px' 
      }}>
        <h3>React Spring Benefits</h3>
        <ul>
          <li><strong>Physics-based:</strong> Natural spring physics for realistic animations</li>
          <li><strong>Performance:</strong> 60fps animations by default</li>
          <li><strong>Flexible:</strong> Works with any React component</li>
          <li><strong>Declarative:</strong> Simple, intuitive API</li>
          <li><strong>Chainable:</strong> Complex animation sequences</li>
          <li><strong>Configurable:</strong> Fine-tuned spring configurations</li>
          <li><strong>TypeScript Support:</strong> Excellent type safety</li>
          <li><strong>Small Bundle:</strong> Tree-shakable and optimized</li>
          <li><strong>Cross-platform:</strong> Web, Three.js, Native support</li>
        </ul>
        
        <h4>Key Concepts Demonstrated:</h4>
        <ul>
          <li><strong>useSpring:</strong> Basic spring animations</li>
          <li><strong>API Control:</strong> Programmatic animation control</li>
          <li><strong>useTrail:</strong> Staggered animations</li>
          <li><strong>useTransition:</strong> Enter/exit animations</li>
          <li><strong>useChain:</strong> Sequential animations</li>
          <li><strong>Mouse Tracking:</strong> Interactive animations</li>
          <li><strong>Spring Configs:</strong> Animation behavior tuning</li>
        </ul>
      </div>
    </div>
  );
}

export default ReactSpringExamples;