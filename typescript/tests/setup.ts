// Jest setup file for TypeScript testing
import '@testing-library/jest-dom';

// Type declarations for Jest globals
declare global {
  var jest: any;
}

// Mock localStorage
const localStorageMock = {
  getItem: () => null,
  setItem: () => {},
  removeItem: () => {},
  clear: () => {},
};
(global as any).localStorage = localStorageMock;

// Mock sessionStorage
const sessionStorageMock = {
  getItem: () => null,
  setItem: () => {},
  removeItem: () => {},
  clear: () => {},
};
(global as any).sessionStorage = sessionStorageMock;

// Mock matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: () => ({
    matches: false,
    media: '',
    onchange: null,
    addListener: () => {}, // deprecated
    removeListener: () => {}, // deprecated
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => {},
  }),
});

// Mock ResizeObserver
(global as any).ResizeObserver = () => ({
  observe: () => {},
  unobserve: () => {},
  disconnect: () => {},
});

// Mock IntersectionObserver
(global as any).IntersectionObserver = () => ({
  observe: () => {},
  unobserve: () => {},
  disconnect: () => {},
});