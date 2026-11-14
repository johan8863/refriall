describe('Kit update', () => {
  const existingKit = { id: 1, name: 'Split' }

  beforeEach(() => {
    cy.login()
  })

  it('must preload the existing kit in the form', () => {
    cy.intercept('GET', '**/api/stock/kits/1/', {
      statusCode: 200,
      body: existingKit
    }).as('getKit')

    cy.visit('/stock/kits/1/update')
    cy.wait('@getKit')

    cy.get('[data-cy="kit-name-input"]').should('have.value', 'Split')
  })

  it('must update the kit and redirect to its detail view', () => {
    let currentName = 'Split'

    cy.intercept('GET', '**/api/stock/kits/1/', (req) => {
      req.reply({ statusCode: 200, body: { id: 1, name: currentName } })
    }).as('getKit')

    cy.intercept('PUT', '**/api/stock/kits/1/', (req) => {
      currentName = 'Split Updated'
      req.reply({ statusCode: 200, body: { id: 1, name: currentName } })
    }).as('updateKit')

    cy.visit('/stock/kits/1/update')
    cy.wait('@getKit')

    cy.get('[data-cy="kit-name-input"]').clear().type('Split Updated')
    cy.get('[data-cy="kit-submit-button"]').click()

    cy.wait('@updateKit').its('request.body.name').should('eq', 'Split Updated')
    cy.wait('@getKit')
    cy.get('[data-cy="kit-detail-name"]').should('have.text', 'Split Updated')
  })

  it('must show a backend error when the name already exists', () => {
    cy.intercept('GET', '**/api/stock/kits/1/', {
      statusCode: 200,
      body: existingKit
    }).as('getKit')

    cy.intercept('PUT', '**/api/stock/kits/1/', {
      statusCode: 400,
      body: { name: ['Kit with this name already exists'] }
    }).as('updateKit')

    cy.visit('/stock/kits/1/update')
    cy.wait('@getKit')

    cy.get('[data-cy="kit-name-input"]').clear().type('Refrigerator')
    cy.get('[data-cy="kit-submit-button"]').click()

    cy.wait('@updateKit')
    cy.get('[data-cy="kit-name-backend-error"]').should('be.visible')
  })
})
