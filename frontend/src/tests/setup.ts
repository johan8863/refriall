import { config } from '@vue/test-utils'
import { vi } from 'vitest'

/**
 * Global configuration for Vue Test Utils
 * This runs before every test file
 */

// Stub RouterLink globally
config.global.stubs = {
  RouterLink: {
    template: '<a><slot /></a>'
  },
  RouterView: {
    template: '<div><slot /></div>'
  }
}

/**
 * Mock ResizeObserver
 * Bootstrap modal uses it indirectly
 */
class ResizeObserverMock {
  observe = vi.fn()
  unobserve = vi.fn()
  disconnect = vi.fn()
}

globalThis.ResizeObserver = ResizeObserverMock as any

/**
 * Mock matchMedia
 * Some Bootstrap components use it
 */
Object.defineProperty(globalThis.window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation((query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn()
  }))
})

/**
 * Silence console.error during tests
 * Uncomment if you prefer clean test output
 */
// vi.spyOn(console, 'error').mockImplementation(() => {})
