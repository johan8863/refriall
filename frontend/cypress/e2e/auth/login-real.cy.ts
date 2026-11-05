// cypress/e2e/auth/login-real.cy.ts

describe('Login (real Django)', () => {
  before(() => {
    // Verify that Django is running before running the tests
    cy.request({
      method: 'GET',
      url: 'http://127.0.0.1:8000/api/',
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.be.oneOf([200, 404]) // API root or 404, both mean Django is up
    })
  })

  beforeEach(() => {
    cy.visit('/login')
  })

  it('must login with real credentials and reach the home page', () => {
    cy.get('#username').type('cypress_test')
    cy.get('#password').type('cypress_pass_123')
    cy.get('button[type="submit"]').click()

    // Real redirection (no mock)
    cy.url().should('not.include', '/login')

    // Tokens are real JWTs
    cy.window().its('localStorage.refriall_auth_access_token').should('exist').and('match', /^eyJ/) // JWTs start with eyJ

    cy.window().its('localStorage.refriall_auth_refresh_token').should('exist').and('match', /^eyJ/)
  })

  it('must fail with real invalid credentials', () => {
    cy.get('#username').type('cypress_test')
    cy.get('#password').type('wrong_password')
    cy.get('button[type="submit"]').click()

    cy.contains('Usuario o Clave incorrectos').should('be.visible')
    cy.url().should('include', '/login')
  })
})
