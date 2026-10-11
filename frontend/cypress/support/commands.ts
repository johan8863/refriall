// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })
// cypress/support/commands.ts

interface LoginCredentials {
  username: string
  password: string
}

/**
 * Custom command to authenticate against the Django backend.
 * Stores the tokens directly in localStorage.
 *
 * Must be called before cy.visit() so that the app reads the
 * tokens on its first render.
 *
 * @example
 * ```typescript
 * beforeEach(() => {
 *   cy.login({ username: 'provider1', password: 'pass123' })
 *   cy.visit('/stock/kits')
 * })
 * ```
 */
Cypress.Commands.add('login', (credentials: LoginCredentials) => {
  cy.request({
    method: 'POST',
    url: 'http://127.0.0.1:8000/api/auth/token/',
    body: {
      username: credentials.username,
      password: credentials.password
    }
  }).then((response) => {
    window.localStorage.setItem('refriall_auth_access_token', response.body.access)
    window.localStorage.setItem('refriall_auth_refresh_token', response.body.refresh)
  })
})

declare global {
  namespace Cypress {
    interface Chainable {
      login(credentials: LoginCredentials): Chainable<void>
    }
  }
}

export {}
