import './commands'

// Disable errors detection not caught from the app during tests (useful if not network errors)
Cypress.on('uncaught:exception', (err) => {
  // Ignore network errors or payloads that don't touch tests
  if (err.message.includes('ResizeObserver') || err.message.includes('Loading chunk')) {
    return false
  }
})
