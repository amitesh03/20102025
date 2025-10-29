// React Transition Group Examples with Detailed Comments
// This file demonstrates various React Transition Group concepts with comprehensive explanations

import React, { useState } from 'react';
import {
  CSSTransition,
  TransitionGroup,
  SwitchTransition,
} from 'react-transition-group';

// ===== EXAMPLE 1: BASIC CSS TRANSITIONS =====
/**
 * Basic CSS transitions demonstrating core React Transition Group concepts
 * CSSTransition provides a simple way to animate components when they mount/unmount
 */

// Simple Fade In/Out Component
function FadeExample() {
  const [inProp, setInProp] = useState(false);

  return (
    <div style={{ padding: '20px', textAlign: 'center' }}>
      <h3>Basic Fade Transition</h3>
      
      <CSSTransition
        in={inProp} // Controls whether the component is visible
        timeout={300} // Duration of the transition in milliseconds
        classNames="fade" // CSS class names for different states
        unmountOnExit // Remove component from DOM when not visible
      >
        <div
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
            fontSize: '18px'
          }}
        >
          <div>Fading Content</div>
        </div>
      </CSSTransition>
      
      <button
        onClick={() => setInProp(!inProp)}
        style={{ padding: '10px 20px' }}
      >
        {inProp ? 'Hide' : 'Show'} Content
      </button>
    </div>
  );
}

// Slide In/Out Component
function SlideExample() {
  const [inProp, setInProp] = useState(false);

  return (
    <div style={{ padding: '20px', textAlign: 'center' }}>
      <h3>Slide Transition</h3>
      
      <CSSTransition
        in={inProp}
        timeout={500}
        classNames="slide"
        unmountOnExit
      >
        <div
          style={{
            width: 250,
            height: 150,
            backgroundColor: '#28a745',
            borderRadius: 10,
            margin: '20px auto',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            fontSize: '18px'
          }}
        >
          <div>Sliding Content</div>
        </div>
      </CSSTransition>
      
      <button
        onClick={() => setInProp(!inProp)}
        style={{ padding: '10px 20px' }}
      >
        {inProp ? 'Hide' : 'Show'} Slide
      </button>
    </div>
  );
}

// ===== EXAMPLE 2: TRANSITION GROUP =====
/**
 * TransitionGroup demonstrating list animations
 * TransitionGroup manages multiple child components and animates them as they enter/exit
 */

function AnimatedList() {
  const [items, setItems] = useState([
    { id: 1, text: 'First Item' },
    { id: 2, text: 'Second Item' },
    { id: 3, text: 'Third Item' },
  ]);

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
      <h3>Animated List with TransitionGroup</h3>
      
      <button onClick={addItem} style={{ marginBottom: '20px', marginRight: '10px' }}>
        Add Item
      </button>
      
      <TransitionGroup component="ul" style={{ listStyle: 'none', padding: 0 }}>
        {items.map((item) => (
          <CSSTransition
            key={item.id}
            timeout={300}
            classNames="list-item"
          >
            <li
              style={{
                padding: '10px 15px',
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
            </li>
          </CSSTransition>
        ))}
      </TransitionGroup>
    </div>
  );
}

// ===== EXAMPLE 3: SWITCH TRANSITION =====
/**
 * SwitchTransition demonstrating component switching animations
 * SwitchTransition animates between two components when they switch
 */

function SwitchExample() {
  const [showFirst, setShowFirst] = useState(true);

  return (
    <div style={{ padding: '20px', textAlign: 'center' }}>
      <h3>Switch Transition</h3>
      
      <SwitchTransition mode="out-in">
        <CSSTransition
          key={showFirst ? 'first' : 'second'}
          addEndListener={(node, done) => {
            node.addEventListener('transitionend', done, false);
          }}
          classNames="switch"
        >
          <div
            style={{
              width: 200,
              height: 200,
              backgroundColor: showFirst ? '#ffc107' : '#dc3545',
              borderRadius: 10,
              margin: '20px auto',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              fontSize: '18px'
            }}
          >
            <div>
              {showFirst ? 'First Component' : 'Second Component'}
            </div>
          </div>
        </CSSTransition>
      </SwitchTransition>
      
      <button
        onClick={() => setShowFirst(!showFirst)}
        style={{ padding: '10px 20px' }}
      >
        Switch Component
      </button>
    </div>
  );
}

// ===== EXAMPLE 4: MODAL WITH TRANSITIONS =====
/**
 * Modal example demonstrating complex transition scenarios
 * Combines multiple transition types for a complete modal experience
 */

function ModalExample() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  return (
    <div style={{ padding: '20px', textAlign: 'center' }}>
      <h3>Modal with Transitions</h3>
      
      <button
        onClick={openModal}
        style={{ padding: '10px 20px', marginBottom: '20px' }}
      >
        Open Modal
      </button>
      
      <CSSTransition
        in={isModalOpen}
        timeout={300}
        classNames="modal-backdrop"
        unmountOnExit
      >
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000
          }}
          onClick={closeModal}
        >
          <CSSTransition
            in={isModalOpen}
            timeout={300}
            classNames="modal-content"
            unmountOnExit
          >
            <div
              style={{
                width: 400,
                height: 300,
                backgroundColor: 'white',
                borderRadius: 15,
                padding: '20px',
                boxShadow: '0 10px 25px rgba(0,0,0,0.2)',
                position: 'relative'
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <h3>Animated Modal</h3>
              <p>This modal uses React Transition Group for smooth animations.</p>
              <p>The backdrop and content animate independently.</p>
              
              <button
                onClick={closeModal}
                style={{
                  position: 'absolute',
                  top: '10px',
                  right: '10px',
                  width: '30px',
                  height: '30px',
                  borderRadius: '50%',
                  border: 'none',
                  backgroundColor: '#dc3545',
                  color: 'white',
                  cursor: 'pointer',
                  fontSize: '16px'
                }}
              >
                ×
              </button>
              
              <button
                onClick={closeModal}
                style={{
                  position: 'absolute',
                  bottom: '20px',
                  right: '20px',
                  padding: '10px 20px',
                  backgroundColor: '#007bff',
                  color: 'white',
                  border: 'none',
                  borderRadius: '5px',
                  cursor: 'pointer'
                }}
              >
                Close
              </button>
            </div>
          </CSSTransition>
        </div>
      </CSSTransition>
    </div>
  );
}

// ===== EXAMPLE 5: TABS WITH TRANSITIONS =====
/**
 * Tabs example demonstrating content switching with transitions
 * Uses SwitchTransition for smooth tab content changes
 */

function TabsExample() {
  const [activeTab, setActiveTab] = useState(0);

  const tabs = [
    { id: 0, title: 'Tab 1', content: 'Content for Tab 1' },
    { id: 1, title: 'Tab 2', content: 'Content for Tab 2' },
    { id: 2, title: 'Tab 3', content: 'Content for Tab 3' },
  ];

  return (
    <div style={{ padding: '20px', textAlign: 'center' }}>
      <h3>Tabs with Transitions</h3>
      
      <div style={{ marginBottom: '20px' }}>
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            style={{
              padding: '10px 20px',
              margin: '0 5px',
              backgroundColor: activeTab === tab.id ? '#007bff' : '#e9ecef',
              color: activeTab === tab.id ? 'white' : 'black',
              border: 'none',
              borderRadius: '5px 5px 0 0',
              cursor: 'pointer'
            }}
          >
            {tab.title}
          </button>
        ))}
      </div>
      
      <div
        style={{
          padding: '20px',
          backgroundColor: '#f8f9fa',
          borderRadius: '0 10px 10px 10px',
          minHeight: '200px'
        }}
      >
        <SwitchTransition mode="out-in">
          <CSSTransition
            key={activeTab}
            addEndListener={(node, done) => {
              node.addEventListener('transitionend', done, false);
            }}
            classNames="tab-content"
          >
            <div
              style={{
                padding: '20px',
                backgroundColor: 'white',
                borderRadius: '10px',
                boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
              }}
            >
              <h4>{tabs[activeTab].title}</h4>
              <p>{tabs[activeTab].content}</p>
              <p>This content animates smoothly when switching tabs.</p>
            </div>
          </CSSTransition>
        </SwitchTransition>
      </div>
    </div>
  );
}

// ===== EXAMPLE 6: ACCORDION WITH TRANSITIONS =====
/**
 * Accordion example demonstrating expand/collapse animations
 * Uses CSSTransition for smooth height animations
 */

function AccordionExample() {
  const [activeIndex, setActiveIndex] = useState(null);

  const items = [
    { title: 'Section 1', content: 'Content for section 1. This section expands and collapses smoothly.' },
    { title: 'Section 2', content: 'Content for section 2. Click to expand and see more details.' },
    { title: 'Section 3', content: 'Content for section 3. Each section animates independently.' },
  ];

  const toggleSection = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <div style={{ padding: '20px', textAlign: 'center' }}>
      <h3>Accordion with Transitions</h3>
      
      <div style={{ maxWidth: '600px', margin: '0 auto' }}>
        {items.map((item, index) => (
          <div key={index} style={{ marginBottom: '10px' }}>
            <button
              onClick={() => toggleSection(index)}
              style={{
                width: '100%',
                padding: '15px',
                backgroundColor: '#007bff',
                color: 'white',
                border: 'none',
                borderRadius: '5px',
                cursor: 'pointer',
                textAlign: 'left',
                fontSize: '16px'
              }}
            >
              {item.title}
              <span style={{ float: 'right' }}>
                {activeIndex === index ? '−' : '+'}
              </span>
            </button>
            
            <CSSTransition
              in={activeIndex === index}
              timeout={300}
              classNames="accordion"
              unmountOnExit
            >
              <div
                style={{
                  padding: '15px',
                  backgroundColor: '#f8f9fa',
                  borderRadius: '0 0 5px 5px',
                  textAlign: 'left'
                }}
              >
                {item.content}
              </div>
            </CSSTransition>
          </div>
        ))}
      </div>
    </div>
  );
}

// ===== EXAMPLE 7: NOTIFICATION SYSTEM =====
/**
 * Notification system demonstrating dynamic list management
 * Uses TransitionGroup for managing multiple notifications
 */

function NotificationExample() {
  const [notifications, setNotifications] = useState([]);

  const addNotification = () => {
    const types = ['success', 'warning', 'error', 'info'];
    const messages = [
      'Operation completed successfully!',
      'Warning: Please check your input.',
      'Error: Something went wrong.',
      'Info: Here is some information.'
    ];
    
    const randomType = types[Math.floor(Math.random() * types.length)];
    const randomMessage = messages[Math.floor(Math.random() * messages.length)];
    
    const newNotification = {
      id: Date.now(),
      type: randomType,
      message: randomMessage
    };
    
    setNotifications([newNotification, ...notifications]);
  };

  const removeNotification = (id) => {
    setNotifications(notifications.filter(n => n.id !== id));
  };

  const getNotificationStyle = (type) => {
    const styles = {
      success: { backgroundColor: '#28a745' },
      warning: { backgroundColor: '#ffc107' },
      error: { backgroundColor: '#dc3545' },
      info: { backgroundColor: '#17a2b8' }
    };
    return styles[type] || styles.info;
  };

  return (
    <div style={{ padding: '20px', textAlign: 'center' }}>
      <h3>Notification System</h3>
      
      <button
        onClick={addNotification}
        style={{ padding: '10px 20px', marginBottom: '20px' }}
      >
        Add Notification
      </button>
      
      <div style={{ position: 'fixed', top: '20px', right: '20px', zIndex: 1000 }}>
        <TransitionGroup>
          {notifications.map((notification) => (
            <CSSTransition
              key={notification.id}
              timeout={300}
              classNames="notification"
            >
              <div
                style={{
                  ...getNotificationStyle(notification.type),
                  color: 'white',
                  padding: '15px 20px',
                  margin: '10px 0',
                  borderRadius: '8px',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  minWidth: '300px'
                }}
              >
                <span>{notification.message}</span>
                <button
                  onClick={() => removeNotification(notification.id)}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: 'white',
                    fontSize: '18px',
                    cursor: 'pointer',
                    marginLeft: '10px'
                  }}
                >
                  ×
                </button>
              </div>
            </CSSTransition>
          ))}
        </TransitionGroup>
      </div>
    </div>
  );
}

// ===== MAIN APP COMPONENT =====
/**
 * Main component that demonstrates all React Transition Group examples
 */
function ReactTransitionGroupExamples() {
  return (
    <div style={{ fontFamily: 'Arial, sans-serif', maxWidth: '1200px', margin: '0 auto', padding: '20px' }}>
      <h1>React Transition Group Examples</h1>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '30px' }}>
        <FadeExample />
        <SlideExample />
        <SwitchExample />
      </div>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '30px' }}>
        <AnimatedList />
        <ModalExample />
        <TabsExample />
        <AccordionExample />
        <NotificationExample />
      </div>
      
      <div style={{ 
        marginTop: '40px', 
        padding: '30px', 
        backgroundColor: '#f8f9fa', 
        borderRadius: '10px' 
      }}>
        <h3>React Transition Group Benefits</h3>
        <ul>
          <li><strong>Component-based:</strong> Works with any React component</li>
          <li><strong>CSS-based:</strong> Uses CSS transitions and animations</li>
          <li><strong>Flexible:</strong> Supports various transition types</li>
          <li><strong>Lightweight:</strong> Small bundle size</li>
          <li><strong>Accessible:</strong> Maintains accessibility during transitions</li>
          <li><strong>Server-side Rendering:</strong> Works with SSR frameworks</li>
          <li><strong>TypeScript Support:</strong> Good type definitions</li>
        </ul>
        
        <h4>Key Concepts Demonstrated:</h4>
        <ul>
          <li><strong>CSSTransition:</strong> Single component transitions</li>
          <li><strong>TransitionGroup:</strong> List item animations</li>
          <li><strong>SwitchTransition:</strong> Component switching</li>
          <li><strong>Enter/Exit States:</strong> fade, slide, scale animations</li>
          <li><strong>Dynamic Lists:</strong> Adding/removing items</li>
          <li><strong>Complex UI:</strong> modals, tabs, accordions</li>
        </ul>
        
        <h4>CSS Classes Used:</h4>
        <ul>
          <li><strong>fade:</strong> fade-enter, fade-enter-active, fade-exit, fade-exit-active</li>
          <li><strong>slide:</strong> slide-enter, slide-enter-active, slide-exit, slide-exit-active</li>
          <li><strong>list-item:</strong> list-item-enter, list-item-enter-active, list-item-exit, list-item-exit-active</li>
          <li><strong>switch:</strong> switch-enter, switch-enter-active, switch-exit, switch-exit-active</li>
        </ul>
      </div>
    </div>
  );
}

export default ReactTransitionGroupExamples;