describe('Kit delete', () => {
  const existingKit = { id: 1, name: 'Split' }

  beforeEach(() => {
    cy.login()
  })

  it('must delete a kit from the detail view', () => {
    cy.intercept('GET', '**/api/stock/kits/1/', {
      statusCode: 200,
      body: existingKit
    }).as('getKit')

    cy.intercept('DELETE', '**/api/stock/kits/1/', { statusCode: 204 }).as('deleteKit')

    cy.intercept('GET', '**/api/stock/kits/list-pagination/**', {
      statusCode: 200,
      body: { results: [], count: 0, next: null, previous: null }
    }).as('getKitsAfterDelete')

    cy.visit('/stock/kits/1/detail')
    cy.wait('@getKit')

    cy.get('[data-cy="kit-delete-menu"]').click()
    cy.get('[data-cy="delete-modal-confirm"]').click()

    cy.wait('@deleteKit')
    cy.url().should('include', '/stock/kits')
    cy.wait('@getKitsAfterDelete')
    cy.get('[data-cy="kit-list-empty"]').should('be.visible')
  })

  it('must cancel the delete and stay on the detail', () => {
    cy.intercept('GET', '**/api/stock/kits/1/', {
      statusCode: 200,
      body: existingKit
    }).as('getKit')

    cy.intercept('DELETE', '**/api/stock/kits/1/').as('deleteKit')

    cy.visit('/stock/kits/1/detail')
    cy.wait('@getKit')

    cy.get('[data-cy="kit-delete-menu"]').click()
    cy.get('[data-cy="delete-modal-cancel"]').click()

    cy.get('[data-cy="delete-modal"]').should('not.be.visible')
    cy.get('@deleteKit.all').should('have.length', 0)
    cy.url().should('include', '/stock/kits/1/detail')
  })

  it('must show a backend error when the kit has associated orders', () => {
    cy.intercept('GET', '**/api/stock/kits/1/', {
      statusCode: 200,
      body: existingKit
    }).as('getKit')

    cy.intercept('DELETE', '**/api/stock/kits/1/', {
      statusCode: 400,
      body: existingKit
    }).as('deleteKit')

    cy.visit('/stock/kits/1/detail')
    cy.wait('@getKit')

    cy.get('[data-cy="kit-delete-menu"]').click()
    cy.get('[data-cy="delete-modal-confirm"]').click()

    cy.wait('@deleteKit')
    cy.get('[data-cy="delete-modal"]').should('be.visible')
    cy.get('[data-cy="delete-modal-error"]').should('be.visible')
    cy.get('[data-cy="delete-modal-confirm"]').should('not.exist')
  })
})
