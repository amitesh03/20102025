import React, { useState, useEffect } from 'react';
import styles from './CSSModulesExamples.module.css';

// CSS Modules Examples Component
const CSSModulesExamples = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [activeTab, setActiveTab] = useState('basic');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
    rating: 3
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      alert('Form submitted successfully!');
      setFormData({ name: '', email: '', message: '', rating: 3 });
    }, 2000);
  };

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  useEffect(() => {
    // Add dark mode class to body
    if (isDarkMode) {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }
  }, [isDarkMode]);

  return (
    <div className={`${styles.container} ${isDarkMode ? styles.darkMode : ''}`}>
      {/* Header */}
      <header className={styles.header}>
        <div className={styles.headerContent}>
          <h1 className={styles.title}>CSS Modules Examples</h1>
          <button 
            className={styles.themeToggle}
            onClick={toggleTheme}
          >
            {isDarkMode ? '☀️' : '🌙'}
          </button>
        </div>
      </header>

      {/* Navigation */}
      <nav className={styles.navigation}>
        <ul className={styles.navList}>
          <li>
            <button 
              className={`${styles.navButton} ${activeTab === 'basic' ? styles.active : ''}`}
              onClick={() => setActiveTab('basic')}
            >
              Basic
            </button>
          </li>
          <li>
            <button 
              className={`${styles.navButton} ${activeTab === 'composition' ? styles.active : ''}`}
              onClick={() => setActiveTab('composition')}
            >
              Composition
            </button>
          </li>
          <li>
            <button 
              className={`${styles.navButton} ${activeTab === 'theming' ? styles.active : ''}`}
              onClick={() => setActiveTab('theming')}
            >
              Theming
            </button>
          </li>
          <li>
            <button 
              className={`${styles.navButton} ${activeTab === 'animations' ? styles.active : ''}`}
              onClick={() => setActiveTab('animations')}
            >
              Animations
            </button>
          </li>
        </ul>
      </nav>

      <main className={styles.main}>
        {/* Basic Examples */}
        {activeTab === 'basic' && (
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Basic CSS Modules</h2>
            
            {/* Typography */}
            <div className={styles.exampleGroup}>
              <h3 className={styles.exampleTitle}>Typography</h3>
              <p className={styles.paragraph}>
                This is a regular paragraph with basic styling.
              </p>
              <p className={`${styles.paragraph} ${styles.highlighted}`}>
                This paragraph has highlighted styling with a different background color.
              </p>
              <p className={`${styles.paragraph} ${styles.large}`}>
                This is a large paragraph with increased font size.
              </p>
            </div>

            {/* Buttons */}
            <div className={styles.exampleGroup}>
              <h3 className={styles.exampleTitle}>Buttons</h3>
              <div className={styles.buttonGroup}>
                <button className={styles.button}>
                  Primary Button
                </button>
                <button className={`${styles.button} ${styles.secondary}`}>
                  Secondary Button
                </button>
                <button className={`${styles.button} ${styles.outline}`}>
                  Outline Button
                </button>
                <button className={`${styles.button} ${styles.small}`}>
                  Small Button
                </button>
                <button className={`${styles.button} ${styles.large}`}>
                  Large Button
                </button>
              </div>
            </div>

            {/* Cards */}
            <div className={styles.exampleGroup}>
              <h3 className={styles.exampleTitle}>Cards</h3>
              <div className={styles.cardGrid}>
                <div className={styles.card}>
                  <div className={styles.cardHeader}>
                    <h4 className={styles.cardTitle}>Basic Card</h4>
                  </div>
                  <div className={styles.cardContent}>
                    <p>This is a basic card component with header and content.</p>
                  </div>
                  <div className={styles.cardFooter}>
                    <button className={styles.cardButton}>Learn More</button>
                  </div>
                </div>

                <div className={`${styles.card} ${styles.elevated}`}>
                  <div className={styles.cardHeader}>
                    <h4 className={styles.cardTitle}>Elevated Card</h4>
                  </div>
                  <div className={styles.cardContent}>
                    <p>This card has elevated styling with enhanced shadow effects.</p>
                  </div>
                  <div className={styles.cardFooter}>
                    <button className={`${styles.cardButton} ${styles.secondary}`}>View Details</button>
                  </div>
                </div>

                <div className={`${styles.card} ${styles.compact}`}>
                  <div className={styles.cardHeader}>
                    <h4 className={styles.cardTitle}>Compact Card</h4>
                  </div>
                  <div className={styles.cardContent}>
                    <p>This card uses compact styling with reduced padding.</p>
                  </div>
                  <div className={styles.cardFooter}>
                    <button className={`${styles.cardButton} ${styles.accent}`}>Get Started</button>
                  </div>
                </div>
              </div>
            </div>

            {/* Forms */}
            <div className={styles.exampleGroup}>
              <h3 className={styles.exampleTitle}>Form Elements</h3>
              <form className={styles.form} onSubmit={handleSubmit}>
                <div className={styles.formGroup}>
                  <label className={styles.label} htmlFor="name">
                    Name
                  </label>
                  <input
                    className={styles.input}
                    id="name"
                    name="name"
                    type="text"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Enter your name"
                  />
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.label} htmlFor="email">
                    Email
                  </label>
                  <input
                    className={styles.input}
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="Enter your email"
                  />
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.label} htmlFor="message">
                    Message
                  </label>
                  <textarea
                    className={styles.textarea}
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    placeholder="Enter your message"
                    rows="4"
                  />
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.label} htmlFor="rating">
                    Rating: {formData.rating}
                  </label>
                  <input
                    className={styles.range}
                    id="rating"
                    name="rating"
                    type="range"
                    min="1"
                    max="5"
                    value={formData.rating}
                    onChange={handleInputChange}
                  />
                </div>

                <div className={styles.formActions}>
                  <button 
                    type="submit" 
                    className={`${styles.button} ${isLoading ? styles.loading : ''}`}
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <span className={styles.spinner}></span>
                    ) : (
                      'Submit'
                    )}
                  </button>
                  <button 
                    type="button" 
                    className={`${styles.button} ${styles.secondary}`}
                    onClick={() => setFormData({ name: '', email: '', message: '', rating: 3 })}
                  >
                    Reset
                  </button>
                </div>
              </form>
            </div>
          </section>
        )}

        {/* Composition Examples */}
        {activeTab === 'composition' && (
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>CSS Modules Composition</h2>
            
            <div className={styles.exampleGroup}>
              <h3 className={styles.exampleTitle}>Class Composition</h3>
              <div className={styles.compositionDemo}>
                <div className={styles.baseElement}>
                  Base Element
                </div>
                <div className={`${styles.baseElement} ${styles.primary}`}>
                  Base + Primary
                </div>
                <div className={`${styles.baseElement} ${styles.primary} ${styles.large}`}>
                  Base + Primary + Large
                </div>
                <div className={`${styles.baseElement} ${styles.secondary} ${styles.rounded}`}>
                  Base + Secondary + Rounded
                </div>
              </div>
            </div>

            <div className={styles.exampleGroup}>
              <h3 className={styles.exampleTitle}>Pseudo-class Composition</h3>
              <div className={styles.pseudoDemo}>
                <button className={styles.composedButton}>
                  Hover me (inherits hover styles)
                </button>
                <a href="#" className={styles.composedLink}>
                  Link with hover and focus states
                </a>
                <div className={styles.composedCard}>
                  Card with hover effects
                </div>
              </div>
            </div>

            <div className={styles.exampleGroup}>
              <h3 className={styles.exampleTitle}>Media Query Composition</h3>
              <div className={styles.responsiveDemo}>
                <div className={styles.responsiveItem}>
                  <h4>Responsive Item 1</h4>
                  <p>Adapts to screen size</p>
                </div>
                <div className={styles.responsiveItem}>
                  <h4>Responsive Item 2</h4>
                  <p>Changes layout on mobile</p>
                </div>
                <div className={styles.responsiveItem}>
                  <h4>Responsive Item 3</h4>
                  <p>Flexible grid layout</p>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Theming Examples */}
        {activeTab === 'theming' && (
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>CSS Modules Theming</h2>
            
            <div className={styles.exampleGroup}>
              <h3 className={styles.exampleTitle}>Theme Variants</h3>
              <div className={styles.themeDemo}>
                <div className={`${styles.themeCard} ${styles.lightTheme}`}>
                  <h4>Light Theme</h4>
                  <p>Light background with dark text</p>
                </div>
                <div className={`${styles.themeCard} ${styles.darkTheme}`}>
                  <h4>Dark Theme</h4>
                  <p>Dark background with light text</p>
                </div>
                <div className={`${styles.themeCard} ${styles.colorfulTheme}`}>
                  <h4>Colorful Theme</h4>
                  <p>Vibrant colors and gradients</p>
                </div>
                <div className={`${styles.themeCard} ${styles.minimalTheme}`}>
                  <h4>Minimal Theme</h4>
                  <p>Clean and simple design</p>
                </div>
              </div>
            </div>

            <div className={styles.exampleGroup}>
              <h3 className={styles.exampleTitle}>Dynamic Theming</h3>
              <div className={styles.dynamicThemeDemo}>
                <div className={styles.themeControls}>
                  <button className={styles.themeButton}>Primary Color</button>
                  <button className={styles.themeButton}>Secondary Color</button>
                  <button className={styles.themeButton}>Accent Color</button>
                  <button className={styles.themeButton}>Reset Theme</button>
                </div>
                <div className={styles.themePreview}>
                  <div className={styles.previewCard}>
                    <h4>Theme Preview</h4>
                    <p>This card will update based on selected theme.</p>
                    <button className={styles.previewButton}>Sample Button</button>
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Animation Examples */}
        {activeTab === 'animations' && (
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>CSS Modules Animations</h2>
            
            <div className={styles.exampleGroup}>
              <h3 className={styles.exampleTitle}>Transition Effects</h3>
              <div className={styles.animationDemo}>
                <button className={styles.fadeButton}>
                  Fade Effect
                </button>
                <button className={styles.slideButton}>
                  Slide Effect
                </button>
                <button className={styles.scaleButton}>
                  Scale Effect
                </button>
                <button className={styles.rotateButton}>
                  Rotate Effect
                </button>
              </div>
            </div>

            <div className={styles.exampleGroup}>
              <h3 className={styles.exampleTitle}>Loading Animations</h3>
              <div className={styles.loadingDemo}>
                <div className={styles.spinner}></div>
                <div className={styles.dots}>
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
                <div className={styles.pulse}></div>
                <div className={styles.wave}></div>
              </div>
            </div>

            <div className={styles.exampleGroup}>
              <h3 className={styles.exampleTitle}>Interactive Animations</h3>
              <div className={styles.interactiveDemo}>
                <div className={styles.flipCard}>
                  <div className={styles.flipCardFront}>
                    <h4>Front Side</h4>
                    <p>Hover to flip</p>
                  </div>
                  <div className={styles.flipCardBack}>
                    <h4>Back Side</h4>
                    <p>Hidden content</p>
                  </div>
                </div>
                <div className={styles.accordion}>
                  <div className={styles.accordionItem}>
                    <button className={styles.accordionHeader}>
                      Accordion Item 1
                    </button>
                    <div className={styles.accordionContent}>
                      <p>Content that expands and collapses</p>
                    </div>
                  </div>
                  <div className={styles.accordionItem}>
                    <button className={styles.accordionHeader}>
                      Accordion Item 2
                    </button>
                    <div className={styles.accordionContent}>
                      <p>More expandable content</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}
      </main>

      {/* Footer */}
      <footer className={styles.footer}>
        <div className={styles.footerContent}>
          <p className={styles.footerText}>
            CSS Modules Examples - Demonstrating scoped styling and composition
          </p>
          <div className={styles.footerLinks}>
            <a href="#" className={styles.footerLink}>Documentation</a>
            <a href="#" className={styles.footerLink}>GitHub</a>
            <a href="#" className={styles.footerLink}>Examples</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default CSSModulesExamples;