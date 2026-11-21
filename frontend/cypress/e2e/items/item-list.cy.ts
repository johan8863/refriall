/**
 * E2E tests for the Item list view.
 *
 * Mirrors `kit-list.cy.ts`:
 * - one `cy.intercept` per test (no overlapping intercepts)
 * - a mutable `currentBody` to serve different responses to the same URL
 * - N requests → N `cy.wait('@getItems')`
 *
 * Notes:
 * - `itemService.listItemPagination(page)` always sends `page`.
 * - `itemService.searchItems(term, page)` always sends `page` (Option A applied).
 * - `usePaginationSearch` computes `totalPages = ceil(count / pageSize)`,
 *   with `pageSize = 10` in `ItemList.vue`. For a second page to exist,
 *   `count` must be > 10.
 */
describe('Item list', () => {
  const paginated = (
    results: Array<Record<string, any>>,
    overrides: Partial<{ count: number; next: string | null; previous: string | null }> = {}
  ) => ({
    count: overrides.count ?? results.length,
    next: overrides.next ?? null,
    previous: overrides.previous ?? null,
    results
  })

  const itemsPage1 = [
    {
      id: 1,
      code: 'SRV-001',
      name: 'Servicio de diagnóstico',
      item_type: 'revision',
      measurement: 'u',
      price: 15.5,
      get_item_type: 'Rev/Diag.',
      get_measurement: 'Uno'
    },
    {
      id: 2,
      code: 'PRD-002',
      name: 'Gas refrigerante R410A',
      item_type: 'prod',
      measurement: 'kg',
      price: 25.0,
      get_item_type: 'Producto',
      get_measurement: 'Kg'
    }
  ]

  beforeEach(() => {
    cy.login()
  })

  // it('must show the items list on load', () => {
  //   cy.intercept('GET', '**/api/stock/items/list-pagination/**', {
  //     statusCode: 200,
  //     body: paginated(itemsPage1)
  //   }).as('getItems')

  //   cy.visit('/stock/items')
  //   cy.wait('@getItems').its('request.url').should('include', 'page=1')

  //   cy.get('[data-cy="item-list-table"]').should('be.visible')

  //   // row 1: revision item
  //   cy.get('[data-cy="item-code-1"]').should('contain.text', 'SRV-001')
  //   cy.get('[data-cy="item-name-1"]').should('contain.text', 'Servicio de diagnóstico')
  //   cy.get('[data-cy="item-type-1"]').should('contain.text', 'Rev/Diag.')
  //   cy.get('[data-cy="item-measurement-1"]').should('contain.text', 'Uno')
  //   cy.get('[data-cy="item-price-1"]').should('contain.text', '$ 15.50')

  //   // row 2: product item with different measurement
  //   cy.get('[data-cy="item-code-2"]').should('contain.text', 'PRD-002')
  //   cy.get('[data-cy="item-type-2"]').should('contain.text', 'Producto')
  //   cy.get('[data-cy="item-measurement-2"]').should('contain.text', 'Kg')
  //   cy.get('[data-cy="item-price-2"]').should('contain.text', '$ 25.00')

  //   cy.get('[data-cy="item-list-empty"]').should('not.exist')
  //   cy.get('[data-cy="item-list-error"]').should('not.exist')
  // })

  // it('must show the empty state when there are no items', () => {
  //   cy.intercept('GET', '**/api/stock/items/list-pagination/**', {
  //     statusCode: 200,
  //     body: paginated([])
  //   }).as('getItems')

  //   cy.visit('/stock/items')
  //   cy.wait('@getItems')

  //   cy.get('[data-cy="item-list-empty"]').should('be.visible')
  //   cy.get('[data-cy="item-list-empty"]').should('contain.text', 'No hay artículos registrados')
  //   cy.get('[data-cy="item-list-empty-clear"]').should('not.exist')
  // })

  // it('must search items by name', () => {
  //   let currentBody = paginated(itemsPage1)

  //   cy.intercept('GET', '**/api/stock/items/list-pagination/**', (req) => {
  //     req.reply({ statusCode: 200, body: currentBody })
  //   }).as('getItems')

  //   cy.visit('/stock/items')
  //   cy.wait('@getItems').its('request.url').should('include', 'page=1')

  //   // search response: only the product
  //   currentBody = paginated([itemsPage1[1]], { count: 1 })

  //   cy.get('[data-cy="search-input"]').type('Gas')
  //   cy.get('[data-cy="search-submit"]').click()

  //   // one request → one cy.wait; assert both search and page on the same interception
  //   cy.wait('@getItems').then((interception) => {
  //     expect(interception.request.url).to.include('search=Gas')
  //     expect(interception.request.url).to.include('page=1')
  //   })

  //   cy.get('[data-cy="item-code-2"]').should('contain.text', 'PRD-002')
  //   cy.get('[data-cy="item-code-1"]').should('not.exist')
  //   cy.get('[data-cy="search-clear"]').should('be.visible')
  // })

  it('must show "no results" state and allow clearing the search', () => {
    let currentBody = paginated(itemsPage1)

    cy.intercept('GET', '**/api/stock/items/list-pagination/**', (req) => {
      req.reply({ statusCode: 200, body: currentBody })
    }).as('getItems')

    cy.visit('/stock/items')
    cy.wait('@getItems').its('request.url').should('include', 'page=1')

    // Search with no results
    cy.then(() => {
      currentBody = paginated([])
    })

    cy.get('[data-cy="search-input"]').type('NoExiste')
    cy.get('[data-cy="search-submit"]').click()
    cy.wait('@getItems').its('request.url').should('include', 'search=NoExiste')

    cy.get('[data-cy="item-list-loading"]').should('not.exist')
    cy.get('[data-cy="item-list-empty"]').should('be.visible')
    cy.get('[data-cy="item-list-empty"]').should('contain.text', 'No se encontraron artículos')
    cy.get('[data-cy="item-list-empty-clear"]').should('be.visible')

    // Clear → back to full list
    cy.then(() => {
      currentBody = paginated(itemsPage1)
    })

    cy.get('[data-cy="item-list-empty-clear"]').click()
    cy.wait('@getItems').its('request.url').should('include', 'page=1')

    cy.get('[data-cy="item-list-loading"]').should('not.exist')
    cy.get('[data-cy="item-list-table"]').should('be.visible')
    cy.contains('[data-cy="item-code-1"]', 'SRV-001').should('be.visible')
    cy.contains('[data-cy="item-code-2"]', 'PRD-002').should('be.visible')
    cy.get('[data-cy="item-list-empty"]').should('not.exist')
  })

  // it('must navigate between pages', () => {
  //   let currentBody = paginated(itemsPage1, {
  //     count: 15,
  //     next: 'http://127.0.0.1:8000/api/stock/items/list-pagination/?page=2',
  //     previous: null
  //   })

  //   cy.intercept('GET', '**/api/stock/items/list-pagination/**', (req) => {
  //     req.reply({ statusCode: 200, body: currentBody })
  //   }).as('getItems')

  //   cy.visit('/stock/items')
  //   cy.wait('@getItems')

  //   cy.get('[data-cy="pagination-prev"]').should('not.exist')
  //   cy.get('[data-cy="pagination-next"]').should('be.visible')
  //   cy.get('[data-cy="pagination-current-page"]').should('contain.text', '1')

  //   // page 2
  //   currentBody = paginated([itemsPage1[0]], {
  //     count: 15,
  //     next: null,
  //     previous: 'http://127.0.0.1:8000/api/stock/items/list-pagination/?page=1'
  //   })

  //   cy.get('[data-cy="pagination-next"]').click()
  //   cy.wait('@getItems').its('request.url').should('include', 'page=2')

  //   cy.get('[data-cy="item-code-1"]').should('contain.text', 'SRV-001')
  //   cy.get('[data-cy="pagination-current-page"]').should('contain.text', '2')
  //   cy.get('[data-cy="pagination-next"]').should('not.exist')
  //   cy.get('[data-cy="pagination-prev"]').should('be.visible')
  // })

  // it('must show an error when the backend fails', () => {
  //   cy.intercept('GET', '**/api/stock/items/list-pagination/**', {
  //     statusCode: 500,
  //     body: { detail: 'Server error' }
  //   }).as('getItems')

  //   cy.visit('/stock/items')
  //   cy.wait('@getItems')

  //   cy.get('[data-cy="item-list-error"]').should('be.visible')
  //   cy.get('[data-cy="item-list-table"]').should('not.exist')
  //   cy.get('[data-cy="item-list-empty"]').should('not.exist')
  // })
})
