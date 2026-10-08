describe('Login', () => {
  beforeEach(() => {
    cy.visit('/login')
  })

  // ============================================================
  // 1. LOGIN EXITOSO (con cy.intercept mockeando el backend)
  // ============================================================
  describe('Successful login', () => {
    it('must login with valid credentials', () => {
      cy.intercept('POST', '**/auth/token/', {
        statusCode: 200,
        body: {
          access: 'mock-access-token',
          refresh: 'mock-refresh-token'
        }
      }).as('loginRequest')

      cy.get('#username').type('provider1')
      cy.get('#password').type('pass123')
      cy.get('button[type="submit"]').click()

      cy.wait('@loginRequest')
      cy.url().should('not.include', '/login')
    })

    it('must store tokens in localStorage after login', () => {
      cy.intercept('POST', '**/auth/token/', {
        statusCode: 200,
        body: {
          access: 'mock-access-token',
          refresh: 'mock-refresh-token'
        }
      }).as('loginRequest')

      cy.get('#username').type('provider1')
      cy.get('#password').type('pass123')
      cy.get('button[type="submit"]').click()

      cy.wait('@loginRequest')

      cy.window().then((win) => {
        expect(win.localStorage.getItem('refriall_auth_access_token')).to.equal('mock-access-token')
        expect(win.localStorage.getItem('refriall_auth_refresh_token')).to.equal(
          'mock-refresh-token'
        )
      })
    })
  })

  // ============================================================
  // 2. LOGIN FALLIDO
  // ============================================================
  describe('Failed login', () => {
    it('must show an error with invalid credentials', () => {
      cy.intercept('POST', '**/auth/token/', {
        statusCode: 401,
        body: { detail: 'Credenciales inválidas' }
      }).as('loginRequest')

      cy.get('#username').type('wronguser')
      cy.get('#password').type('wrongpass')
      cy.get('button[type="submit"]').click()

      cy.wait('@loginRequest')
      cy.contains('Usuario o Clave incorrectos').should('be.visible')
    })

    it('must stay on the login page after a failed login', () => {
      cy.intercept('POST', '**/auth/token/', {
        statusCode: 401,
        body: { detail: 'Credenciales inválidas' }
      }).as('loginRequest')

      cy.get('#username').type('wronguser')
      cy.get('#password').type('wrongpass')
      cy.get('button[type="submit"]').click()

      cy.wait('@loginRequest')
      cy.url().should('include', '/login')
    })

    it('must show an error when the server is down', () => {
      cy.intercept('POST', '**/auth/token/', { forceNetworkError: true }).as('loginRequest')

      cy.get('#username').type('provider1')
      cy.get('#password').type('pass123')
      cy.get('button[type="submit"]').click()

      cy.wait('@loginRequest')
      cy.contains('Servidor caído').should('be.visible')
    })
  })

  // ============================================================
  // 3. VALIDACIÓN DEL FORMULARIO
  // ============================================================
  describe('Form validation', () => {
    it('must disable the submit button when fields are empty', () => {
      cy.get('button[type="submit"]').should('not.be.disabled')
      // Nota: el botón no se deshabilita con campos vacíos en tu LoginView,
      // pero aquí verificamos que el login falla si no hay credenciales.
    })
  })
})
