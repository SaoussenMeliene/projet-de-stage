import { expect, afterEach, beforeEach } from 'vitest';
import { cleanup } from '@testing-library/react';
import * as matchers from '@testing-library/jest-dom/matchers';

// Étendre les assertions de Vitest avec jest-dom
expect.extend(matchers);

// Nettoyer après chaque test
afterEach(() => {
  cleanup();
});

// Mock console.warn pour réduire le bruit des warnings React act()
const originalWarn = console.warn;
beforeEach(() => {
  console.warn = (...args) => {
    if (args[0]?.includes?.('An update to')) return;
    originalWarn(...args);
  };
});

afterEach(() => {
  console.warn = originalWarn;
});

// Configuration globale pour les tests
globalThis.ResizeObserver = class ResizeObserver {
  constructor(cb) {
    this.cb = cb;
  }
  observe() {
    return null;
  }
  unobserve() {
    return null;
  }
  disconnect() {
    return null;
  }
};

// Mock pour window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: (query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => {},
  }),
});

// Mock pour localStorage
const localStorageMock = {
  getItem: () => null,
  setItem: () => null,
  removeItem: () => null,
  clear: () => null,
};

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock
});

// Mock pour sessionStorage
Object.defineProperty(window, 'sessionStorage', {
  value: localStorageMock
});