// Lottie React Examples with Detailed Comments
// This file demonstrates various Lottie React concepts with comprehensive explanations

import React, { useState, useRef, useEffect } from 'react';
import { useLottie, useLottieInteractivity, Lottie } from 'lottie-react';

// Mock animation data for demonstration (in real usage, you'd import .json files)
const mockAnimationData = {
  "v": "5.5.7",
  "fr": 30,
  "ip": 0,
  "op": 60,
  "w": 1920,
  "h": 1080,
  "nm": "Comp 1",
  "ddd": 0,
  "assets": [],
  "layers": [
    {
      "ddd": 0,
      "ind": 1,
      "ty": 4,
      "nm": "Shape Layer 1",
      "sr": 1,
      "ks": {
        "o": { "a": 0, "k": 100 },
        "r": { "a": 0, "k": 0 },
        "p": { "a": 0, "k": [960, 540] },
        "s": { "a": 0, "k": [100, 100, 100] }
      },
      "ao": 0,
      "shapes": [
        {
          "ty": "gr",
          "it": [
            {
              "ty": "sh",
              "ind": 0,
              "ks": {
                "o": { "a": 0, "k": 100 },
                "r": { "a": 0, "k": 50 },
                "p": { "a": 0, "k": [0, 0] },
                "s": { "a": 0, "k": [100, 100] }
              },
              "fill": {
                "c": [
                  { "i": [[0, 0.8, 0.8, 1]], "o": [0, 0.8, 0.8, 1], "v": [0.2, 0.4, 0.8], "g": 2 }
                ]
              }
            }
          ]
        }
      ],
      "ip": 0,
      "op": 60,
      "st": 0
    }
  ]
};

// ===== EXAMPLE 1: BASIC LOTTIE ANIMATION =====
/**
 * Basic Lottie animation demonstrating core concepts
 * useLottie hook provides simple animation playback
 */

function BasicLottie() {
  const [isPlaying, setIsPlaying] = useState(true);
  const [animationSpeed, setAnimationSpeed] = useState(1);

  const style = {
    height: 300,
    width: 300,
    border: '2px solid #e0e0e0',
    borderRadius: '10px',
    overflow: 'hidden',
  };

  const options = {
    animationData: mockAnimationData,
    loop: true,
    autoplay: isPlaying,
  };

  const { View, play, pause, setSpeed, stop, goToAndPlay } = useLottie(options, style);

  const handleSpeedChange = (newSpeed) => {
    setAnimationSpeed(newSpeed);
    setSpeed(newSpeed);
  };

  const handleRestart = () => {
    goToAndPlay(0, true);
  };

  return (
    <div style={{ padding: '20px', textAlign: 'center' }}>
      <h3>Basic Lottie Animation</h3>
      
      <div style={{ marginBottom: '20px' }}>
        <View />
      </div>
      
      <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', flexWrap: 'wrap' }}>
        <button onClick={() => setIsPlaying(!isPlaying)} style={{ padding: '8px 16px' }}>
          {isPlaying ? 'Pause' : 'Play'}
        </button>
        <button onClick={stop} style={{ padding: '8px 16px' }}>
          Stop
        </button>
        <button onClick={handleRestart} style={{ padding: '8px 16px' }}>
          Restart
        </button>
      </div>
      
      <div style={{ marginTop: '20px' }}>
        <label style={{ marginRight: '10px' }}>Speed:</label>
        <input 
          type="range" 
          min="0.1" 
          max="3" 
          step="0.1" 
          value={speed}
          onChange={(e) => handleSpeedChange(parseFloat(e.target.value))}
          style={{ width: '200px' }}
        />
        <span style={{ marginLeft: '10px' }}>{animationSpeed}x</span>
      </div>
    </div>
  );
}

// ===== EXAMPLE 2: LOTTIE COMPONENT =====
/**
 * Lottie component demonstrating declarative usage
 * Lottie component provides simple props-based control
 */

function LottieComponent() {
  const [loop, setLoop] = useState(true);
  const [autoplay, setAutoplay] = useState(true);

  const style = {
    height: 250,
    width: 250,
    backgroundColor: '#f5f5f5',
    borderRadius: '10px',
    padding: '10px',
  };

  return (
    <div style={{ padding: '20px', textAlign: 'center' }}>
      <h3>Lottie Component</h3>
      
      <div style={{ marginBottom: '20px' }}>
        <Lottie
          animationData={mockAnimationData}
          loop={loop}
          autoplay={autoplay}
          style={style}
        />
      </div>
      
      <div style={{ display: 'flex', justifyContent: 'center', gap: '10px' }}>
        <label style={{ display: 'flex', alignItems: 'center' }}>
          <input 
            type="checkbox" 
            checked={loop}
            onChange={(e) => setLoop(e.target.checked)}
            style={{ marginRight: '8px' }}
          />
          Loop
        </label>
        
        <label style={{ display: 'flex', alignItems: 'center' }}>
          <input 
            type="checkbox" 
            checked={autoplay}
            onChange={(e) => setAutoplay(e.target.checked)}
            style={{ marginRight: '8px' }}
          />
          Autoplay
        </label>
      </div>
    </div>
  );
}

// ===== EXAMPLE 3: CURSOR INTERACTIVITY =====
/**
 * Cursor interactivity demonstrating mouse-based animation control
 * useLottieInteractivity with cursor mode for interactive animations
 */

function CursorInteractivity() {
  const style = {
    height: 300,
    width: 300,
    border: '3px solid #007bff',
    borderRadius: '10px',
    cursor: 'pointer',
    position: 'relative',
  };

  const options = {
    animationData: mockAnimationData,
    loop: false,
    autoplay: false,
  };

  const lottieObj = useLottie(options, style);
  
  const Animation = useLottieInteractivity({
    lottieObj,
    mode: "cursor",
    actions: [
      {
        position: { x: [0, 1], y: [0, 1] },
        type: "seek",
        frames: [0, 60],
      },
      {
        position: { x: -1, y: -1 },
        type: "stop",
        frames: [0],
      },
    ],
  });

  return (
    <div style={{ padding: '20px', textAlign: 'center' }}>
      <h3>Cursor Interactivity</h3>
      
      <div style={{ marginBottom: '20px' }}>
        <p>Move your cursor from top-left to bottom-right to play the animation</p>
      </div>
      
      {Animation}
      
      <div style={{ marginTop: '20px', fontSize: '14px', color: '#666' }}>
        <p>• Animation follows cursor movement</p>
        <p>• Move from top-left to bottom-right to play</p>
        <p>• Move cursor outside to reset</p>
      </div>
    </div>
  );
}

// ===== EXAMPLE 4: SCROLL INTERACTIVITY =====
/**
 * Scroll interactivity demonstrating scroll-based animation control
 * useLottieInteractivity with scroll mode for scroll-triggered animations
 */

function ScrollInteractivity() {
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.pageYOffset;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = Math.min(scrollTop / docHeight, 1);
      setScrollProgress(progress);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const style = {
    height: 200,
    width: 200,
    border: '2px solid #28a745',
    borderRadius: '10px',
    margin: '20px auto',
  };

  const options = {
    animationData: mockAnimationData,
    loop: false,
    autoplay: false,
  };

  const lottieObj = useLottie(options);
  
  const Animation = useLottieInteractivity({
    lottieObj,
    mode: "scroll",
    actions: [
      {
        visibility: [0, 0.3],
        type: "stop",
        frames: [0],
      },
      {
        visibility: [0.3, 0.7],
        type: "seek",
        frames: [0, 30],
      },
      {
        visibility: [0.7, 1.0],
        type: "loop",
        frames: [30, 60],
      },
    ],
  });

  return (
    <div style={{ padding: '20px', textAlign: 'center' }}>
      <h3>Scroll Interactivity</h3>
      
      <div style={{ marginBottom: '20px' }}>
        <p>Scroll down to control the animation</p>
        <div style={{ 
          width: '300px', 
          height: '20px', 
          backgroundColor: '#e9ecef', 
          borderRadius: '10px',
          margin: '10px auto',
          position: 'relative'
        }}>
          <div style={{
            position: 'absolute',
            left: 0,
            top: 0,
            height: '100%',
            width: `${scrollProgress * 100}%`,
            backgroundColor: '#28a745',
            borderRadius: '10px',
            transition: 'width 0.1s ease'
          }} />
        </div>
        <span style={{ fontSize: '12px', color: '#666' }}>
          {Math.round(scrollProgress * 100)}%
        </span>
      </div>
      
      {Animation}
      
      <div style={{ marginTop: '20px', fontSize: '14px', color: '#666' }}>
        <p>• 0-30% scroll: Animation stopped</p>
        <p>• 30-70% scroll: Animation seeks to frame 30</p>
        <p>• 70-100% scroll: Animation loops frames 30-60</p>
      </div>
      
      {/* Add scrollable content */}
      <div style={{ height: '100vh', marginTop: '50px' }}>
        <p>Keep scrolling to see the full effect...</p>
      </div>
    </div>
  );
}

// ===== EXAMPLE 5: HOVER SEGMENTS =====
/**
 * Hover segments demonstrating segment-based animation control
 * Play specific animation segments on hover
 */

function HoverSegments() {
  const style = {
    height: 250,
    width: 250,
    border: '3px solid #ffc107',
    borderRadius: '10px',
    cursor: 'pointer',
    transition: 'transform 0.2s ease',
  };

  const options = {
    animationData: mockAnimationData,
    loop: false,
    autoplay: false,
  };

  const lottieObj = useLottie(options, style);
  
  const Animation = useLottieInteractivity({
    lottieObj,
    mode: "cursor",
    actions: [
      {
        position: { x: [0, 1], y: [0, 1] },
        type: "loop",
        frames: [20, 40],
      },
      {
        position: { x: -1, y: -1 },
        type: "stop",
        frames: [0],
      },
    ],
  });

  return (
    <div style={{ padding: '20px', textAlign: 'center' }}>
      <h3>Hover Segments</h3>
      
      <div style={{ marginBottom: '20px' }}>
        <p>Hover over the animation to play a specific segment (frames 20-40)</p>
      </div>
      
      <div 
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'scale(1.05)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'scale(1)';
        }}
      >
        {Animation}
      </div>
      
      <div style={{ marginTop: '20px', fontSize: '14px', color: '#666' }}>
        <p>• Hover: Play frames 20-40 in a loop</p>
        <p>• Mouse leave: Stop and reset to frame 0</p>
        <p>• Scale effect on hover for visual feedback</p>
      </div>
    </div>
  );
}

// ===== EXAMPLE 6: MULTI-ANIMATION CONTROLLER =====
/**
 * Multi-animation controller demonstrating multiple Lottie instances
 * Control multiple animations with different states
 */

function MultiAnimationController() {
  const [activeAnimation, setActiveAnimation] = useState('idle');
  const [speed, setSpeed] = useState(1);

  const animations = {
    idle: { frames: [0, 0], loop: true },
    walk: { frames: [10, 30], loop: true },
    run: { frames: [40, 60], loop: true },
    jump: { frames: [70, 90], loop: false },
  };

  const style = {
    height: 150,
    width: 150,
    border: '2px solid #dc3545',
    borderRadius: '10px',
    margin: '10px',
  };

  const options = {
    animationData: mockAnimationData,
    loop: false,
    autoplay: false,
  };

  const { View: IdleView, play: playIdle, stop: stopIdle } = useLottie({
    ...options,
    initialSegment: animations.idle.frames,
  }, style);

  const { View: WalkView, play: playWalk, stop: stopWalk } = useLottie({
    ...options,
    initialSegment: animations.walk.frames,
  }, style);

  const { View: RunView, play: playRun, stop: stopRun } = useLottie({
    ...options,
    initialSegment: animations.run.frames,
  }, style);

  const { View: JumpView, play: playJump, stop: stopJump } = useLottie({
    ...options,
    initialSegment: animations.jump.frames,
  }, style);

  const animationRefs = {
    idle: { play: playIdle, stop: stopIdle },
    walk: { play: playWalk, stop: stopWalk },
    run: { play: playRun, stop: stopRun },
    jump: { play: playJump, stop: stopJump },
  };

  const handleAnimationChange = (animationType) => {
    // Stop current animation
    if (animationRefs[activeAnimation]) {
      animationRefs[activeAnimation].stop();
    }
    
    // Start new animation
    setActiveAnimation(animationType);
    if (animationRefs[animationType]) {
      animationRefs[animationType].play();
    }
  };

  const handleSpeedChange = (newSpeed) => {
    setSpeed(newSpeed);
    Object.values(animationRefs).forEach(ref => {
      ref.setSpeed(newSpeed);
    });
  };

  const getAnimationView = (type) => {
    switch (type) {
      case 'idle': return <IdleView />;
      case 'walk': return <WalkView />;
      case 'run': return <RunView />;
      case 'jump': return <JumpView />;
      default: return <IdleView />;
    }
  };

  return (
    <div style={{ padding: '20px', textAlign: 'center' }}>
      <h3>Multi-Animation Controller</h3>
      
      <div style={{ marginBottom: '20px' }}>
        {getAnimationView(activeAnimation)}
      </div>
      
      <div style={{ marginBottom: '20px' }}>
        <label style={{ marginRight: '10px' }}>Speed:</label>
        <input 
          type="range" 
          min="0.1" 
          max="3" 
          step="0.1" 
          value={speed}
          onChange={(e) => handleSpeedChange(parseFloat(e.target.value))}
          style={{ width: '200px' }}
        />
        <span style={{ marginLeft: '10px' }}>{speed}x</span>
      </div>
      
      <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', flexWrap: 'wrap' }}>
        {Object.keys(animations).map(type => (
          <button
            key={type}
            onClick={() => handleAnimationChange(type)}
            style={{
              padding: '8px 16px',
              backgroundColor: activeAnimation === type ? '#007bff' : '#6c757d',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer',
              textTransform: 'capitalize',
            }}
          >
            {type}
          </button>
        ))}
      </div>
      
      <div style={{ marginTop: '20px', fontSize: '14px', color: '#666' }}>
        <p>• Click buttons to switch between animations</p>
        <p>• Each animation has different frame ranges</p>
        <p>• Speed control affects all animations</p>
      </div>
    </div>
  );
}

// ===== EXAMPLE 7: ADVANCED INTERACTIVITY =====
/**
 * Advanced interactivity demonstrating complex interaction patterns
 * Combines multiple interaction modes and segments
 */

function AdvancedInteractivity() {
  const [interactionMode, setInteractionMode] = useState('cursor');
  const [currentFrame, setCurrentFrame] = useState(0);

  const style = {
    height: 300,
    width: 300,
    border: '3px solid #6f42c1',
    borderRadius: '10px',
    position: 'relative',
  };

  const options = {
    animationData: mockAnimationData,
    loop: false,
    autoplay: false,
  };

  const lottieObj = useLottie(options, style);
  
  const Animation = useLottieInteractivity({
    lottieObj,
    mode: interactionMode,
    actions: interactionMode === 'cursor' ? [
      {
        position: { x: [0, 0.5], y: [0, 0.5] },
        type: "seek",
        frames: [0, 20],
      },
      {
        position: { x: [0.5, 1], y: [0, 0.5] },
        type: "seek",
        frames: [20, 40],
      },
      {
        position: { x: [0, 1], y: [0.5, 1] },
        type: "seek",
        frames: [40, 60],
      },
      {
        position: { x: -1, y: -1 },
        type: "stop",
        frames: [0],
      },
    ] : [
      {
        visibility: [0, 0.33],
        type: "seek",
        frames: [0, 20],
      },
      {
        visibility: [0.33, 0.66],
        type: "seek",
        frames: [20, 40],
      },
      {
        visibility: [0.66, 1.0],
        type: "seek",
        frames: [40, 60],
      },
    ],
  });

  useEffect(() => {
    if (lottieObj && lottieObj.current) {
      const updateFrame = () => {
        setCurrentFrame(Math.floor(lottieObj.current.currentFrame));
      };
      
      const interval = setInterval(updateFrame, 100);
      return () => clearInterval(interval);
    }
  }, [lottieObj]);

  return (
    <div style={{ padding: '20px', textAlign: 'center' }}>
      <h3>Advanced Interactivity</h3>
      
      <div style={{ marginBottom: '20px' }}>
        <label style={{ marginRight: '10px' }}>Mode:</label>
        <select 
          value={interactionMode} 
          onChange={(e) => setInteractionMode(e.target.value)}
          style={{ padding: '5px', marginRight: '10px' }}
        >
          <option value="cursor">Cursor Position</option>
          <option value="scroll">Scroll Progress</option>
        </select>
        
        <span style={{ marginLeft: '20px', fontSize: '14px' }}>
          Current Frame: {currentFrame}/60
        </span>
      </div>
      
      <div style={{ marginBottom: '20px' }}>
        {interactionMode === 'cursor' ? (
          <p>Move cursor in different quadrants to seek to different frames:</p>
        ) : (
          <p>Scroll to control animation progress:</p>
        )}
      </div>
      
      {Animation}
      
      <div style={{ marginTop: '20px', fontSize: '14px', color: '#666' }}>
        {interactionMode === 'cursor' ? (
          <>
            <p>• Top-left quadrant: Frames 0-20</p>
            <p>• Top-right quadrant: Frames 20-40</p>
            <p>• Bottom quadrants: Frames 40-60</p>
          </>
        ) : (
          <>
            <p>• 0-33% scroll: Frames 0-20</p>
            <p>• 33-66% scroll: Frames 20-40</p>
            <p>• 66-100% scroll: Frames 40-60</p>
          </>
        )}
      </div>
      
      {interactionMode === 'scroll' && (
        <div style={{ height: '100vh', marginTop: '50px' }}>
          <p>Keep scrolling to see the full effect...</p>
        </div>
      )}
    </div>
  );
}

// ===== MAIN APP COMPONENT =====
/**
 * Main component that demonstrates all Lottie React examples
 */
function LottieExamples() {
  return (
    <div style={{ fontFamily: 'Arial, sans-serif', maxWidth: '1200px', margin: '0 auto', padding: '20px' }}>
      <h1>Lottie React Examples</h1>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '30px' }}>
        <BasicLottie />
        <LottieComponent />
        <CursorInteractivity />
        <HoverSegments />
      </div>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(500px, 1fr))', gap: '30px' }}>
        <ScrollInteractivity />
        <MultiAnimationController />
        <AdvancedInteractivity />
      </div>
      
      <div style={{ 
        marginTop: '40px', 
        padding: '30px', 
        backgroundColor: '#f8f9fa', 
        borderRadius: '10px' 
      }}>
        <h3>Lottie React Benefits</h3>
        <ul>
          <li><strong>Lightweight:</strong> Small bundle size with minimal dependencies</li>
          <li><strong>Performance:</strong> Optimized rendering with canvas/SVG</li>
          <li><strong>Interactive:</strong> Mouse and scroll-based controls</li>
          <li><strong>Flexible:</strong> Works with any Lottie animation</li>
          <li><strong>Segment Control:</strong> Play specific animation segments</li>
          <li><strong>React Hooks:</strong> Modern hook-based API</li>
          <li><strong>TypeScript Support:</strong> Excellent type definitions</li>
          <li><strong>Easy Integration:</strong> Simple component and hook API</li>
          <li><strong>Cross-platform:</strong> Works on web and mobile</li>
        </ul>
        
        <h4>Key Concepts Demonstrated:</h4>
        <ul>
          <li><strong>useLottie:</strong> Basic animation playback</li>
          <li><strong>Lottie Component:</strong> Declarative animation control</li>
          <li><strong>useLottieInteractivity:</strong> Interactive animations</li>
          <li><strong>Cursor Mode:</strong> Mouse-based control</li>
          <li><strong>Scroll Mode:</strong> Scroll-based control</li>
          <li><strong>Segment Control:</strong> Frame range playback</li>
          <li><strong>Multi-instance:</strong> Multiple animations</li>
          <li><strong>Advanced Patterns:</strong> Complex interactions</li>
        </ul>
        
        <h4>Installation:</h4>
        <pre style={{ backgroundColor: '#f1f3f4', padding: '15px', borderRadius: '5px', overflow: 'auto' }}>
{`npm install lottie-react
# or
yarn add lottie-react`}
        </pre>
      </div>
    </div>
  );
}

export default LottieExamples;