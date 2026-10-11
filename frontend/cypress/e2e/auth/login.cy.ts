import { createValidJwt } from '../../support/helpers/jwt'

describe('Login', () => {
  const MOCK_ACCESS_TOKEN = createValidJwt()
  const MOCK_REFRESH_TOKEN = createValidJwt()

  beforeEach(() => {
    cy.visit('/login')
  })

  // ============================================================
  // 1. SUCCESSFUL LOGIN
  // ============================================================
  describe('Successful login', () => {
    it('must authenticate, store tokens and redirect to home', () => {
      cy.intercept('POST', '**/auth/token/', {
        statusCode: 200,
        body: {
          access: MOCK_ACCESS_TOKEN,
          refresh: MOCK_REFRESH_TOKEN
        }
      }).as('loginRequest')

      cy.get('#username').type('provider1')
      cy.get('#password').type('pass123')
      cy.get('button[type="submit"]').click()

      cy.wait('@loginRequest')

      // 1. Tokens are stored
      cy.window().its('localStorage.refriall_auth_access_token').should('equal', MOCK_ACCESS_TOKEN)
      cy.window()
        .its('localStorage.refriall_auth_refresh_token')
        .should('equal', MOCK_REFRESH_TOKEN)

      // 2. Redirection happened
      cy.url().should('not.include', '/login')
    })
  })

  // ============================================================
  // 2. FAILED LOGIN
  // ============================================================
  describe('Failed login', () => {
    it('must show an error and stay on the login page with invalid credentials', () => {
      cy.intercept('POST', '**/auth/token/', {
        statusCode: 401,
        body: { detail: 'Credenciales inválidas' }
      }).as('loginRequest')

      cy.get('#username').type('wronguser')
      cy.get('#password').type('wrongpass')
      cy.get('button[type="submit"]').click()

      cy.wait('@loginRequest')

      // 1. Error is displayed
      cy.contains('Usuario o Clave incorrectos').should('be.visible')

      // 2. No tokens are stored
      cy.window().its('localStorage.refriall_auth_access_token').should('be.undefined')
      cy.window().its('localStorage.refriall_auth_refresh_token').should('be.undefined')

      // 3. Still on the login page
      cy.url().should('include', '/login')
    })

    it('must show a network error when the server is down', () => {
      cy.intercept('POST', '**/auth/token/', { forceNetworkError: true }).as('loginRequest')

      cy.get('#username').type('provider1')
      cy.get('#password').type('pass123')
      cy.get('button[type="submit"]').click()

      cy.wait('@loginRequest')
      cy.contains('Servidor caído').should('be.visible')
    })
  })
})
