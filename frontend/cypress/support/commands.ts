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
 * Custom command to authenticate against the Django backend
 * and cache the session using cy.session().
 *
 * @example
 * ```typescript
 * beforeEach(() => {
 *   cy.login({ username: 'provider1', password: 'pass123' })
 * })
 * ```
 */
Cypress.Commands.add('login', (credentials: LoginCredentials) => {
  cy.session(
    [credentials.username, credentials.password],
    () => {
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
    },
    {
      // Validate that session is still avtive
      validate() {
        const token = window.localStorage.getItem('refriall_auth_access_token')
        if (!token) {
          throw new Error('No access token in localStorage')
        }
      },
      // clear localstorage before creating a new session
      cacheAcrossSpecs: true
    }
  )
})

declare global {
  namespace Cypress {
    interface Chainable {
      login(credentials: LoginCredentials): Chainable<void>
    }
  }
}

export {}
