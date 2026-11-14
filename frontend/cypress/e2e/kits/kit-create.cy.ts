describe('Kit create', () => {
  const createdKit = { id: 5, name: 'New Kit' }

  beforeEach(() => {
    cy.login()
  })

  it('must create a kit and redirect to its detail view', () => {
    cy.intercept('POST', '**/api/stock/kits/', {
      statusCode: 201,
      body: createdKit
    }).as('createKit')

    cy.intercept('GET', '**/api/stock/kits/5/', {
      statusCode: 200,
      body: createdKit
    }).as('getKitAfterCreate')

    cy.visit('/stock/kits/create')

    cy.get('[data-cy="kit-name-input"]').type('New Kit')
    cy.get('[data-cy="kit-submit-button"]').click()

    cy.wait('@createKit').its('request.body').should('deep.equal', {
      id: 0,
      name: 'New Kit'
    })

    cy.wait('@getKitAfterCreate')
    cy.url().should('include', '/stock/kits/5/detail')
    cy.get('[data-cy="kit-detail-name"]').should('have.text', 'New Kit')
  })

  it('must show a frontend validation error when name is empty', () => {
    cy.intercept('POST', '**/api/stock/kits/').as('createKit')

    cy.visit('/stock/kits/create')
    cy.get('[data-cy="kit-submit-button"]').click()

    cy.get('[data-cy="kit-name-frontend-error"]').should('be.visible')
    cy.get('@createKit.all').should('have.length', 0)
  })

  it('must show a backend error when the name already exists', () => {
    cy.intercept('POST', '**/api/stock/kits/', {
      statusCode: 400,
      body: { name: ['Kit with this name already exists'] }
    }).as('createKit')

    cy.visit('/stock/kits/create')
    cy.get('[data-cy="kit-name-input"]').type('Split')
    cy.get('[data-cy="kit-submit-button"]').click()

    cy.wait('@createKit')
    cy.get('[data-cy="kit-name-backend-error"]').should('be.visible')
  })

  it('must show an error when the server is down', () => {
    cy.intercept('POST', '**/api/stock/kits/', { forceNetworkError: true }).as('createKit')

    cy.visit('/stock/kits/create')
    cy.get('[data-cy="kit-name-input"]').type('New Kit')
    cy.get('[data-cy="kit-submit-button"]').click()

    cy.wait('@createKit')
    cy.get('[data-cy="kit-form-error"]').should('be.visible')
  })
})
