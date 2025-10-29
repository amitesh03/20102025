import React, { useState } from 'react';

// Sass Examples - Educational Examples for Sass
// Note: Sass is a CSS preprocessor that extends CSS with features like variables, nesting, and mixins

export default function SassExamples() {
  const [activeExample, setActiveExample] = useState('variables');

  return (
    <div className="examples-container">
      <h1>Sass Examples</h1>
      <p className="intro">
        Sass is a CSS preprocessor that extends CSS with features like variables, nesting, mixins, inheritance, and more. It helps you write more maintainable and reusable CSS.
      </p>
      
      <div className="example-nav">
        <button onClick={() => setActiveExample('variables')} className={activeExample === 'variables' ? 'active' : ''}>
          Variables
        </button>
        <button onClick={() => setActiveExample('nesting')} className={activeExample === 'nesting' ? 'active' : ''}>
          Nesting
        </button>
        <button onClick={() => setActiveExample('mixins')} className={activeExample === 'mixins' ? 'active' : ''}>
          Mixins
        </button>
        <button onClick={() => setActiveExample('inheritance')} className={activeExample === 'inheritance' ? 'active' : ''}>
          Inheritance
        </button>
        <button onClick={() => setActiveExample('functions')} className={activeExample === 'functions' ? 'active' : ''}>
          Functions
        </button>
        <button onClick={() => setActiveExample('modules')} className={activeExample === 'modules' ? 'active' : ''}>
          Modules
        </button>
      </div>

      <div className="example-content">
        {activeExample === 'variables' && <VariablesExample />}
        {activeExample === 'nesting' && <NestingExample />}
        {activeExample === 'mixins' && <MixinsExample />}
        {activeExample === 'inheritance' && <InheritanceExample />}
        {activeExample === 'functions' && <FunctionsExample />}
        {activeExample === 'modules' && <ModulesExample />}
      </div>
    </div>
  );
}

// Variables Example
function VariablesExample() {
  return (
    <div className="example-section">
      <h2>Variables in Sass</h2>
      <p>Using variables to store reusable values.</p>
      
      <div className="code-block">
        <h3>Variable Declaration</h3>
        <pre>
{`// _variables.scss
$primary-color: #007bff;
$secondary-color: #6c757d;
$background-color: #ffffff;
$text-color: #333333;
$font-size-base: 16px;
$spacing-unit: 8px;
$border-radius: 4px;
$font-family: 'Arial', sans-serif;

// You can also use !default flag
$default-padding: 16px;
$important-margin: 20px !default;`}
        </pre>
      </div>

      <div className="code-block">
        <h3>Variable Usage</h3>
        <pre>
{`// styles.scss
@import 'variables';

.container {
  background-color: $background-color;
  color: $text-color;
  font-size: $font-size-base;
  padding: $default-padding;
  margin: $important-margin;
}

.button {
  background-color: $primary-color;
  color: white;
  padding: $spacing-unit calc($spacing-unit * 2);
  border: none;
  border-radius: $border-radius;
  cursor: pointer;
  font-family: $font-family;
}

.button--secondary {
  background-color: $secondary-color;
}

.card {
  background-color: $background-color;
  border-radius: $border-radius;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  padding: $default-padding;
}

// Variable interpolation
.alert {
  border: 1px solid $primary-color;
  padding: $spacing-unit;
  border-radius: $border-radius;
  margin-bottom: $spacing-unit;
  
  &--#{$primary-color} {
    background-color: $primary-color;
    color: white;
  }
}

// Compiled CSS
.container {
  background-color: #ffffff;
  color: #333333;
  font-size: 16px;
  padding: 16px;
  margin: 20px;
}

.button {
  background-color: #007bff;
  color: white;
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-family: "Arial", sans-serif;
}

.button--secondary {
  background-color: #6c757d;
}

.card {
  background-color: #ffffff;
  border-radius: 4px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  padding: 16px;
}

.alert {
  border: 1px solid #007bff;
  padding: 8px;
  border-radius: 4px;
  margin-bottom: 8px;
}

.alert--#007bff {
  background-color: #007bff;
  color: white;
}`}
        </pre>
      </div>

      <div className="code-block">
        <h3>Variable Scope</h3>
        <pre>
{`// _variables.scss
$global-color: #007bff;

// styles.scss
.container {
  $local-color: #6c757d; // Local variable
  
  color: $global-color; // Using global variable
  background-color: $local-color; // Using local variable
}

// You can use !global flag to make a variable global
$global-font-size: 16px !global;

// Or use !default flag to set a default value
$padding: 16px !default;

// You can also use !important flag
$margin: 20px !important;`}
        </pre>
      </div>
    </div>
  );
}

// Nesting Example
function NestingExample() {
  return (
    <div className="example-section">
      <h2>Nesting in Sass</h2>
      <p>Using nesting to create more organized and maintainable styles.</p>
      
      <div className="code-block">
        <h3>Basic Nesting</h3>
        <pre>
{`// styles.scss
.nav {
  display: flex;
  list-style: none;
  margin: 0;
  padding: 0;
  
  &__item {
    margin-right: 16px;
    
    &:last-child {
      margin-right: 0;
    }
    
    &__link {
      color: #333;
      text-decoration: none;
      
      &:hover {
        color: #007bff;
      }
    }
  }
}

.card {
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  padding: 16px;
  
  &__header {
    font-size: 18px;
    font-weight: bold;
    margin-bottom: 8px;
  }
  
  &__content {
    color: #666;
    line-height: 1.5;
  }
  
  &__footer {
    margin-top: 16px;
    padding-top: 8px;
    border-top: 1px solid #eee;
  }
}

// Compiled CSS
.nav {
  display: flex;
  list-style: none;
  margin: 0;
  padding: 0;
}

.nav__item {
  margin-right: 16px;
}

.nav__item:last-child {
  margin-right: 0;
}

.nav__item__link {
  color: #333;
  text-decoration: none;
}

.nav__item__link:hover {
  color: #007bff;
}

.card {
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  padding: 16px;
}

.card__header {
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 8px;
}

.card__content {
  color: #666;
  line-height: 1.5;
}

.card__footer {
  margin-top: 16px;
  padding-top: 8px;
  border-top: 1px solid #eee;
}`}
        </pre>
      </div>

      <div className="code-block">
        <h3>Advanced Nesting</h3>
        <pre>
{`// styles.scss
.button {
  background-color: #007bff;
  color: white;
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: bold;
  
  &--primary {
    background-color: #007bff;
  }
  
  &--secondary {
    background-color: #6c757d;
  }
  
  &--large {
    padding: 12px 24px;
    font-size: 18px;
  }
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  }
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
  
  // Parent selector with &
  .container & {
    margin: 16px;
  }
}

// Compiled CSS
.button {
  background-color: #007bff;
  color: white;
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: bold;
}

.button--primary {
  background-color: #007bff;
}

.button--secondary {
  background-color: #6c757d;
}

.button--large {
  padding: 12px 24px;
  font-size: 18px;
}

.button:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

.button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.container .button {
  margin: 16px;
}`}
        </pre>
      </div>
    </div>
  );
}

// Mixins Example
function MixinsExample() {
  return (
    <div className="example-section">
      <h2>Mixins in Sass</h2>
      <p>Creating and using mixins for reusable style patterns.</p>
      
      <div className="code-block">
        <h3>Basic Mixins</h3>
        <pre>
{`// _mixins.scss
@mixin button-style($bg-color, $text-color: white) {
  background-color: $bg-color;
  color: $text-color;
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: bold;
  transition: all 0.2s;
}

@mixin card-style($bg-color: white, $shadow: true) {
  background-color: $bg-color;
  border-radius: 8px;
  padding: 16px;
  
  @if $shadow {
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  }
}

@mixin center-flex {
  display: flex;
  justify-content: center;
  align-items: center;
}

@mixin responsive($breakpoint) {
  @media (max-width: $breakpoint) {
    @content;
  }
}

// styles.scss
@import 'mixins';

.button {
  @include button-style(#007bff);
}

.button--secondary {
  @include button-style(#6c757d);
}

.card {
  @include card-style(white, true);
}

.card--no-shadow {
  @include card-style(white, false);
}

.container {
  @include center-flex;
}

.mobile-only {
  @include responsive(768px) {
    font-size: 14px;
  }
}

// Compiled CSS
.button {
  background-color: #007bff;
  color: white;
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: bold;
  transition: all 0.2s;
}

.button--secondary {
  background-color: #6c757d;
  color: white;
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: bold;
  transition: all 0.2s;
}

.card {
  background-color: white;
  border-radius: 8px;
  padding: 16px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.card--no-shadow {
  background-color: white;
  border-radius: 8px;
  padding: 16px;
}

.container {
  display: flex;
  justify-content: center;
  align-items: center;
}

@media (max-width: 768px) {
  .mobile-only {
    font-size: 14px;
  }
}`}
        </pre>
      </div>

      <div className="code-block">
        <h3>Mixins with Arguments</h3>
        <pre>
{`// _mixins.scss
@mixin font-size($size) {
  @if $size == small {
    font-size: 12px;
  } @else if $size == medium {
    font-size: 16px;
  } @else if $size == large {
    font-size: 20px;
  } @else {
    font-size: 16px; // Default
  }
}

@mixin triangle($size, $color, $direction: up) {
  width: 0;
  height: 0;
  border-left: $size solid transparent;
  border-right: $size solid transparent;
  
  @if $direction == up {
    border-bottom: $size solid $color;
  } @else if $direction == down {
    border-top: $size solid $color;
  } @else if $direction == left {
    border-right: $size solid $color;
  } @else if $direction == right {
    border-left: $size solid $color;
  }
}

// styles.scss
@import 'mixins';

.text-small {
  @include font-size(small);
}

.text-medium {
  @include font-size(medium);
}

.text-large {
  @include font-size(large);
}

.arrow-up {
  @include triangle(10px, #007bff, up);
}

.arrow-down {
  @include triangle(10px, #007bff, down);
}

// Compiled CSS
.text-small {
  font-size: 12px;
}

.text-medium {
  font-size: 16px;
}

.text-large {
  font-size: 20px;
}

.arrow-up {
  width: 0;
  height: 0;
  border-left: 10px solid transparent;
  border-right: 10px solid transparent;
  border-bottom: 10px solid #007bff;
}

.arrow-down {
  width: 0;
  height: 0;
  border-left: 10px solid transparent;
  border-right: 10px solid transparent;
  border-top: 10px solid #007bff;
}`}
        </pre>
      </div>
    </div>
  );
}

// Inheritance Example
function InheritanceExample() {
  return (
    <div className="example-section">
      <h2>Inheritance in Sass</h2>
      <p>Using @extend to inherit styles from other selectors.</p>
      
      <div className="code-block">
        <h3>Basic Inheritance</h3>
        <pre>
{`// styles.scss
%button-base {
  display: inline-block;
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: bold;
  text-align: center;
  transition: all 0.2s;
}

%card-base {
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  padding: 16px;
}

.button {
  @extend %button-base;
  background-color: #007bff;
  color: white;
}

.button--secondary {
  @extend %button-base;
  background-color: #6c757d;
}

.card {
  @extend %card-base;
}

.card--no-shadow {
  @extend %card-base;
  box-shadow: none;
}

// Compiled CSS
.button, .button--secondary {
  display: inline-block;
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: bold;
  text-align: center;
  transition: all 0.2s;
}

.button {
  background-color: #007bff;
  color: white;
}

.button--secondary {
  background-color: #6c757d;
  color: white;
}

.card, .card--no-shadow {
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  padding: 16px;
}

.card--no-shadow {
  box-shadow: none;
}`}
        </pre>
      </div>

      <div className="code-block">
        <h3>Chaining Inheritance</h3>
        <pre>
{`// styles.scss
%message-base {
  padding: 12px 16px;
  border-radius: 4px;
  margin-bottom: 8px;
}

%message-info {
  @extend %message-base;
  background-color: #d1ecf1;
  color: #0c5460;
  border: 1px solid #bee5eb;
}

%message-success {
  @extend %message-base;
  background-color: #d4edda;
  color: #155724;
  border: 1px solid #c3e6cb;
}

%message-warning {
  @extend %message-base;
  background-color: #fff3cd;
  color: #856404;
  border: 1px solid #ffeeba;
}

%message-error {
  @extend %message-base;
  background-color: #f8d7da;
  color: #721c24;
  border: 1px solid #f5c6cb;
}

.message {
  @extend %message-base;
}

.message--info {
  @extend %message-info;
}

.message--success {
  @extend %message-success;
}

.message--warning {
  @extend %message-warning;
}

.message--error {
  @extend %message-error;
}

// Compiled CSS
.message, .message--info, .message--success, .message--warning, .message--error {
  padding: 12px 16px;
  border-radius: 4px;
  margin-bottom: 8px;
}

.message--info {
  background-color: #d1ecf1;
  color: #0c5460;
  border: 1px solid #bee5eb;
}

.message--success {
  background-color: #d4edda;
  color: #155724;
  border: 1px solid #c3e6cb;
}

.message--warning {
  background-color: #fff3cd;
  color: #856404;
  border: 1px solid #ffeeba;
}

.message--error {
  background-color: #f8d7da;
  color: #721c24;
  border: 1px solid #f5c6cb;
}`}
        </pre>
      </div>
    </div>
  );
}

// Functions Example
function FunctionsExample() {
  return (
    <div className="example-section">
      <h2>Functions in Sass</h2>
      <p>Using functions to perform calculations and manipulations.</p>
      
      <div className="code-block">
        <h3>Built-in Functions</h3>
        <pre>
{`// _functions.scss
@function strip-unit($number) {
  @return $number / ($number * 0 + 1);
}

@function em($pixels, $context: 16) {
  @return ($pixels / $context) * 1em;
}

@function rem($pixels) {
  @return ($pixels / 16px) * 1rem;
}

@function lighten($color, $amount) {
  @return mix(white, $color, $amount);
}

@function darken($color, $amount) {
  @return mix(black, $color, $amount);
}

// styles.scss
@import 'functions';
@import 'variables';

.container {
  padding: rem($spacing-unit * 2);
  font-size: em($font-size-base);
}

.button {
  background-color: lighten($primary-color, 10%);
  color: white;
  
  &:hover {
    background-color: darken($primary-color, 10%);
  }
}

.card {
  border-radius: strip-unit($border-radius);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

// Compiled CSS
.container {
  padding: 1rem;
  font-size: 1em;
}

.button {
  background-color: #339af0;
  color: white;
}

.button:hover {
  background-color: #0066cc;
}

.card {
  border-radius: 4;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}`}
        </pre>
      </div>

      <div className="code-block">
        <h3>Custom Functions</h3>
        <pre>
{`// _functions.scss
@function calculate-rem($pixels, $base: 16px) {
  @return ($pixels / $base) * 1rem;
}

@function get-color($color-name) {
  @if $color-name == primary {
    @return #007bff;
  } @else if $color-name == secondary {
    @return #6c757d;
  } @else if $color-name == success {
    @return #28a745;
  } @else if $color-name == warning {
    @return #ffc107;
  } @else if $color-name == danger {
    @return #dc3545;
  } @else {
    @return #6c757d; // Default
  }
}

@function grid-columns($columns) {
  @return repeat($columns, 1fr);
}

// styles.scss
@import 'functions';
@import 'variables';

.container {
  padding: calculate-rem($spacing-unit * 2);
}

.button {
  background-color: get-color(primary);
  color: white;
}

.button--secondary {
  background-color: get-color(secondary);
}

.alert {
  background-color: get-color(warning);
}

.error {
  background-color: get-color(danger);
}

.success {
  background-color: get-color(success);
}

.grid {
  display: grid;
  grid-template-columns: grid-columns(3);
  gap: $spacing-unit;
}

// Compiled CSS
.container {
  padding: 1rem;
}

.button {
  background-color: #007bff;
  color: white;
}

.button--secondary {
  background-color: #6c757d;
}

.alert {
  background-color: #ffc107;
}

.error {
  background-color: #dc3545;
}

.success {
  background-color: #28a745;
}

.grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 8px;
}`}
        </pre>
      </div>
    </div>
  );
}

// Modules Example
function ModulesExample() {
  return (
    <div className="example-section">
      <h2>Modules in Sass</h2>
      <p>Organizing styles with modules and partials.</p>
      
      <div className="code-block">
        <h3>File Structure</h3>
        <pre>
{`styles/
├── main.scss
├── _variables.scss
├── _mixins.scss
├── _functions.scss
├── _reset.scss
├── _typography.scss
├── _layout.scss
├── _components/
│   ├── _buttons.scss
│   ├── _cards.scss
│   └── _forms.scss
└── _pages/
    ├── _home.scss
    └── _about.scss`}
        </pre>
      </div>

      <div className="code-block">
        <h3>Importing Modules</h3>
        <pre>
{`// main.scss
@import 'variables';
@import 'mixins';
@import 'functions';
@import 'reset';
@import 'typography';
@import 'layout';
@import 'components/buttons';
@import 'components/cards';
@import 'components/forms';
@import 'pages/home';
@import 'pages/about';

// _variables.scss
$primary-color: #007bff;
$secondary-color: #6c757d;
$background-color: #ffffff;
$text-color: #333333;
$font-size-base: 16px;
$spacing-unit: 8px;
$border-radius: 4px;

// _mixins.scss
@mixin button-style($bg-color, $text-color: white) {
  background-color: $bg-color;
  color: $text-color;
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: bold;
}

// _components/_buttons.scss
.button {
  @include button-style($primary-color);
}

.button--secondary {
  @include button-style($secondary-color);
}

// _typography.scss
body {
  font-family: 'Arial', sans-serif;
  font-size: $font-size-base;
  line-height: 1.5;
  color: $text-color;
}

h1, h2, h3, h4, h5, h6 {
  font-weight: bold;
  margin-bottom: 1rem;
}

h1 {
  font-size: 2.5rem;
}

h2 {
  font-size: 2rem;
}

h3 {
  font-size: 1.75rem;
}

h4 {
  font-size: 1.5rem;
}

h5 {
  font-size: 1.25rem;
}

h6 {
  font-size: 1rem;
}`}
        </pre>
      </div>

      <div className="code-block">
        <h3>Module Namespacing</h3>
        <pre>
{`// _components/_buttons.scss
.c-button {
  @include button-style($primary-color);
}

.c-button--secondary {
  @include button-style($secondary-color);
}

// main.scss
@import 'variables';
@import 'mixins';
@import 'components/buttons';

// Using the components
.button {
  @extend .c-button;
}

.button--secondary {
  @extend .c-button--secondary;
}

// Compiled CSS
.c-button, .button {
  background-color: #007bff;
  color: white;
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: bold;
}

.c-button--secondary, .button--secondary {
  background-color: #6c757d;
  color: white;
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: bold;
}`}
        </pre>
      </div>
    </div>
  );
}

// Add some basic styles for the examples
const style = document.createElement('style');
style.textContent = `
.examples-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  font-family: Arial, sans-serif;
}

.intro {
  font-size: 1.1em;
  color: #666;
  margin-bottom: 30px;
}

.example-nav {
  display: flex;
  gap: 10px;
  margin-bottom: 30px;
  flex-wrap: wrap;
}

.example-nav button {
  padding: 10px 15px;
  border: 1px solid #ddd;
  background: #f5f5f5;
  cursor: pointer;
  border-radius: 4px;
}

.example-nav button.active {
  background: #007bff;
  color: white;
  border-color: #007bff;
}

.example-content {
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 20px;
  background: #f9f9f9;
}

.example-section h2 {
  color: #333;
  border-bottom: 2px solid #007bff;
  padding-bottom: 10px;
}

.code-block {
  margin: 20px 0;
}

.code-block h3 {
  color: #555;
  margin-bottom: 10px;
}

.code-block pre {
  background: #f0f0f0;
  padding: 15px;
  border-radius: 4px;
  overflow-x: auto;
  font-family: 'Courier New', monospace;
  font-size: 14px;
  line-height: 1.4;
}
`;
document.head.appendChild(style);