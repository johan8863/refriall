describe('Kit list', () => {
  // Helper: response type from BaseCustomPagination
  const paginated = (
    results: Array<{ id: number; name: string }>,
    overrides: Partial<{ count: number; next: string | null; previous: string | null }> = {}
  ) => ({
    count: overrides.count ?? results.length,
    next: overrides.next ?? null,
    previous: overrides.previous ?? null,
    results
  })

  const kitsPage1 = [
    { id: 1, name: 'Split' },
    { id: 2, name: 'Mini Split' }
  ]

  beforeEach(() => {
    cy.login()
  })

  it('must show the kits list on load', () => {
    cy.intercept('GET', '**/api/stock/kits/list-pagination/**', {
      statusCode: 200,
      body: paginated(kitsPage1)
    }).as('getKits')

    cy.visit('/stock/kits')
    // listKit always sends page=1, even with no search
    cy.wait('@getKits').its('request.url').should('include', 'page=1')

    cy.get('[data-cy="kit-list-table"]').should('be.visible')
    cy.get('[data-cy="kit-row-1"]').should('contain.text', 'Split')
    cy.get('[data-cy="kit-row-2"]').should('contain.text', 'Mini Split')

    cy.get('[data-cy="kit-list-empty"]').should('not.exist')
    cy.get('[data-cy="kit-list-error"]').should('not.exist')
  })

  it('must show the empty state when there are no kits', () => {
    cy.intercept('GET', '**/api/stock/kits/list-pagination/**', {
      statusCode: 200,
      body: paginated([])
    }).as('getKits')

    cy.visit('/stock/kits')
    cy.wait('@getKits')

    cy.get('[data-cy="kit-list-empty"]').should('be.visible')
    cy.get('[data-cy="kit-list-empty"]').should('contain.text', 'No hay equipos registrados')
    // No search → no "Volver a lista completa" button
    cy.get('[data-cy="kit-list-empty-clear"]').should('not.exist')
  })

  it('must search kits by name', () => {
    let currentBody = paginated(kitsPage1)

    cy.intercept('GET', '**/api/stock/kits/list-pagination/**', (req) => {
      req.reply({ statusCode: 200, body: currentBody })
    }).as('getKits')

    cy.visit('/stock/kits')
    cy.wait('@getKits').its('request.url').should('include', 'page=1')

    // cambia la respuesta para la siguiente llamada
    cy.then(() => (currentBody = paginated([{ id: 1, name: 'Split' }], { count: 1 })))

    cy.get('[data-cy="search-input"]').type('Split')
    cy.get('[data-cy="search-submit"]').click()

    cy.wait('@getKits').then((interception) => {
      expect(interception.request.url).to.include('search=Split')
      expect(interception.request.url).to.include('page=1')
    })

    cy.get('[data-cy="kit-row-1"]').should('contain.text', 'Split')
    cy.get('[data-cy="kit-row-2"]').should('not.exist')
  })

  it('must show "no results" state and allow clearing the search', () => {
    cy.intercept('GET', '**/api/stock/kits/list-pagination/**', {
      statusCode: 200,
      body: paginated(kitsPage1)
    }).as('getKitsInitial')

    cy.visit('/stock/kits')
    cy.wait('@getKitsInitial')

    cy.intercept('GET', '**/api/stock/kits/list-pagination/**', {
      statusCode: 200,
      body: paginated([])
    }).as('getKitsSearchEmpty')

    cy.get('[data-cy="search-input"]').type('NoExiste')
    cy.get('[data-cy="search-submit"]').click()
    cy.wait('@getKitsSearchEmpty')

    cy.get('[data-cy="kit-list-empty"]').should('contain.text', 'No se encontraron equipos')
    cy.get('[data-cy="kit-list-empty-clear"]').should('be.visible')

    // Clear from the empty state → back to full list
    cy.intercept('GET', '**/api/stock/kits/list-pagination/**', {
      statusCode: 200,
      body: paginated(kitsPage1)
    }).as('getKitsAfterClear')

    cy.get('[data-cy="kit-list-empty-clear"]').click()
    cy.wait('@getKitsAfterClear').its('request.url').should('include', 'page=1')

    cy.get('[data-cy="kit-row-1"]').should('contain.text', 'Split')
    cy.get('[data-cy="kit-row-2"]').should('contain.text', 'Mini Split')
    cy.get('[data-cy="kit-list-empty"]').should('not.exist')
  })

  it('must navigate between pages', () => {
    // Page 1: next → page 2, no previous
    cy.intercept('GET', '**/api/stock/kits/list-pagination/**', {
      statusCode: 200,
      body: paginated(kitsPage1, {
        count: 13,
        next: 'http://127.0.0.1:8000/api/stock/kits/list-pagination/?page=2',
        previous: null
      })
    }).as('getKitsPage1')

    cy.visit('/stock/kits')
    cy.wait('@getKitsPage1')

    cy.get('[data-cy="pagination-prev"]').should('not.exist')
    cy.get('[data-cy="pagination-next"]').should('be.visible')
    cy.get('[data-cy="pagination-current-page"]').should('contain.text', '1')

    // Page 2: previous → page 1, no next
    cy.intercept('GET', '**/api/stock/kits/list-pagination/**', {
      statusCode: 200,
      body: paginated([{ id: 3, name: 'Chiller' }], {
        count: 3,
        next: null,
        previous: 'http://127.0.0.1:8000/api/stock/kits/list-pagination/?page=1'
      })
    }).as('getKitsPage2')

    cy.get('[data-cy="pagination-next"]').click()
    cy.wait('@getKitsPage2').its('request.url').should('include', 'page=2')

    cy.get('[data-cy="kit-row-3"]').should('contain.text', 'Chiller')
    cy.get('[data-cy="pagination-current-page"]').should('contain.text', '2')
    cy.get('[data-cy="pagination-next"]').should('not.exist')
    cy.get('[data-cy="pagination-prev"]').should('be.visible')
  })

  it('must show an error when the backend fails', () => {
    cy.intercept('GET', '**/api/stock/kits/list-pagination/**', {
      statusCode: 500,
      body: { detail: 'Server error' }
    }).as('getKitsError')

    cy.visit('/stock/kits')
    cy.wait('@getKitsError')

    cy.get('[data-cy="kit-list-error"]').should('be.visible')
    cy.get('[data-cy="kit-list-table"]').should('not.exist')
    cy.get('[data-cy="kit-list-empty"]').should('not.exist')
  })
})
