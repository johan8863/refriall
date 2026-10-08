// services/__tests__/currencyService.spec.ts
import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import MockAdapter from 'axios-mock-adapter'
import apiBase from '../baseService'
import { currencyService } from '../currencyService'
import type { Currency } from '@/views/currencies/types'
import type { PaginatedResponse } from '@/types/shared'

describe('currencyService', () => {
  let mock: MockAdapter

  const urlCurrencies = '/finance/currencies'

  const createCurrency = (overrides: Partial<Currency> = {}): Currency => ({
    id: 1,
    name: 'USD',
    description: 'US Dollar',
    ...overrides
  })

  const createPaginatedResponse = (
    results: Currency[] = [],
    count: number = results.length
  ): PaginatedResponse<Currency> => ({
    results,
    count,
    next: null,
    previous: null
  })

  beforeEach(() => {
    mock = new MockAdapter(apiBase)
  })

  afterEach(() => {
    mock.restore()
  })

  // ============================================================
  // 1. listCurrencies
  // ============================================================
  describe('listCurrencies', () => {
    it('must call the correct URL', async () => {
      mock.onGet(`${urlCurrencies}/`).reply(200, [])

      await currencyService.listCurrencies()

      expect(mock.history.get).toHaveLength(1)
      expect(mock.history.get[0].url).toBe(`${urlCurrencies}/`)
    })

    it('must not send query params', async () => {
      mock.onGet(`${urlCurrencies}/`).reply(200, [])

      await currencyService.listCurrencies()

      expect(mock.history.get[0].params).toBeUndefined()
    })

    it('must return the currencies array', async () => {
      const currencies = [
        createCurrency({ id: 1, name: 'USD', description: 'US Dollar' }),
        createCurrency({ id: 2, name: 'CUP', description: 'Cuban Peso' })
      ]
      mock.onGet(`${urlCurrencies}/`).reply(200, currencies)

      const result = await currencyService.listCurrencies()

      expect(result.data).toEqual(currencies)
      expect(result.data).toHaveLength(2)
    })

    it('must propagate 500 errors', async () => {
      mock.onGet(`${urlCurrencies}/`).reply(500)

      await expect(currencyService.listCurrencies()).rejects.toBeDefined()
    })
  })

  // ============================================================
  // 2. listCurrencyPagination
  // ============================================================
  describe('listCurrencyPagination', () => {
    it('must call the correct URL', async () => {
      mock.onGet(`${urlCurrencies}/list-pagination/`).reply(200, createPaginatedResponse())

      await currencyService.listCurrencyPagination()

      expect(mock.history.get[0].url).toBe(`${urlCurrencies}/list-pagination/`)
    })

    it('must send page and search as query params', async () => {
      mock.onGet(`${urlCurrencies}/list-pagination/`).reply(200, createPaginatedResponse())

      await currencyService.listCurrencyPagination(2, 'usd')

      expect(mock.history.get[0].params).toEqual({ page: 2, search: 'usd' })
    })

    it('must send empty params when both are null', async () => {
      mock.onGet(`${urlCurrencies}/list-pagination/`).reply(200, createPaginatedResponse())

      await currencyService.listCurrencyPagination(null, null)

      expect(mock.history.get[0].params).toEqual({})
    })

    it('must return the paginated response', async () => {
      const currency = createCurrency({ id: 1, name: 'USD' })
      const response = createPaginatedResponse([currency], 1)
      mock.onGet(`${urlCurrencies}/list-pagination/`).reply(200, response)

      const result = await currencyService.listCurrencyPagination(1, '')

      expect(result.data).toEqual(response)
      expect(result.data.results[0].name).toBe('USD')
    })
  })

  // ============================================================
  // 3. searchCurrency
  // ============================================================
  describe('searchCurrency', () => {
    it('must call the correct URL', async () => {
      mock.onGet(`${urlCurrencies}/list-pagination/`).reply(200, createPaginatedResponse())

      await currencyService.searchCurrency('usd')

      expect(mock.history.get[0].url).toBe(`${urlCurrencies}/list-pagination/`)
    })

    it('must send search and page as query params', async () => {
      mock.onGet(`${urlCurrencies}/list-pagination/`).reply(200, createPaginatedResponse())

      await currencyService.searchCurrency('usd', 3)

      expect(mock.history.get[0].params).toEqual({ search: 'usd', page: 3 })
    })

    it('must omit page when page is 1', async () => {
      mock.onGet(`${urlCurrencies}/list-pagination/`).reply(200, createPaginatedResponse())

      await currencyService.searchCurrency('usd', 1)

      expect(mock.history.get[0].params).toEqual({ search: 'usd' })
    })

    it('must return the paginated response', async () => {
      const currency = createCurrency({ id: 1, name: 'USD' })
      mock
        .onGet(`${urlCurrencies}/list-pagination/`)
        .reply(200, createPaginatedResponse([currency], 1))

      const result = await currencyService.searchCurrency('usd')

      expect(result.data.results[0].name).toBe('USD')
    })
  })

  // ============================================================
  // 4. detailCurrency
  // ============================================================
  describe('detailCurrency', () => {
    it('must call the correct URL with id', async () => {
      mock.onGet(`${urlCurrencies}/1/`).reply(200, createCurrency({ id: 1 }))

      await currencyService.detailCurrency(1)

      expect(mock.history.get[0].url).toBe(`${urlCurrencies}/1/`)
    })

    it('must return the currency', async () => {
      const currency = createCurrency({ id: 42, name: 'USD', description: 'US Dollar' })
      mock.onGet(`${urlCurrencies}/42/`).reply(200, currency)

      const result = await currencyService.detailCurrency(42)

      expect(result.data).toEqual(currency)
      expect(result.data.id).toBe(42)
    })

    it('must propagate 404 errors', async () => {
      mock.onGet(`${urlCurrencies}/999/`).reply(404)

      await expect(currencyService.detailCurrency(999)).rejects.toBeDefined()
    })
  })

  // ============================================================
  // 5. postCurrency
  // ============================================================
  describe('postCurrency', () => {
    it('must call the correct URL with POST', async () => {
      const newCurrency = { name: 'USD', description: 'US Dollar' }
      mock.onPost(`${urlCurrencies}/`).reply(201, createCurrency({ id: 1, ...newCurrency }))

      await currencyService.postCurrency(newCurrency)

      expect(mock.history.post).toHaveLength(1)
      expect(mock.history.post[0].url).toBe(`${urlCurrencies}/`)
    })

    it('must send the body as JSON', async () => {
      const newCurrency = { name: 'USD', description: 'US Dollar' }
      mock.onPost(`${urlCurrencies}/`).reply(201, createCurrency({ id: 1, ...newCurrency }))

      await currencyService.postCurrency(newCurrency)

      expect(JSON.parse(mock.history.post[0].data)).toEqual(newCurrency)
    })

    it('must return the created currency', async () => {
      const createdCurrency = createCurrency({ id: 5, name: 'EUR', description: 'Euro' })
      mock.onPost(`${urlCurrencies}/`).reply(201, createdCurrency)

      const result = await currencyService.postCurrency({ name: 'EUR', description: 'Euro' })

      expect(result.data).toEqual(createdCurrency)
      expect(result.data.id).toBe(5)
    })

    it('must propagate 400 validation errors', async () => {
      mock.onPost(`${urlCurrencies}/`).reply(400, { name: ['El nombre ya existe'] })

      await expect(
        currencyService.postCurrency({ name: 'USD', description: 'US Dollar' })
      ).rejects.toBeDefined()
    })
  })

  // ============================================================
  // 6. putCurrency
  // ============================================================
  describe('putCurrency', () => {
    it('must call the correct URL with PUT', async () => {
      const currency = createCurrency({ id: 1, name: 'USD Updated' })
      mock.onPut(`${urlCurrencies}/1/`).reply(200, currency)

      await currencyService.putCurrency(currency)

      expect(mock.history.put).toHaveLength(1)
      expect(mock.history.put[0].url).toBe(`${urlCurrencies}/1/`)
    })

    it('must send the currency as JSON body', async () => {
      const currency = createCurrency({ id: 1, name: 'USD Updated' })
      mock.onPut(`${urlCurrencies}/1/`).reply(200, currency)

      await currencyService.putCurrency(currency)

      expect(JSON.parse(mock.history.put[0].data)).toEqual(currency)
    })

    it('must return the updated currency', async () => {
      const updatedCurrency = createCurrency({ id: 1, name: 'USD Updated' })
      mock.onPut(`${urlCurrencies}/1/`).reply(200, updatedCurrency)

      const result = await currencyService.putCurrency(updatedCurrency)

      expect(result.data.name).toBe('USD Updated')
    })

    it('must propagate 404 errors', async () => {
      const currency = createCurrency({ id: 999 })
      mock.onPut(`${urlCurrencies}/999/`).reply(404)

      await expect(currencyService.putCurrency(currency)).rejects.toBeDefined()
    })
  })

  // ============================================================
  // 7. deleteCurrency
  // ============================================================
  describe('deleteCurrency', () => {
    it('must call the correct URL with DELETE', async () => {
      mock.onDelete(`${urlCurrencies}/1/`).reply(204)

      await currencyService.deleteCurrency(1)

      expect(mock.history.delete).toHaveLength(1)
      expect(mock.history.delete[0].url).toBe(`${urlCurrencies}/1/`)
    })

    it('must propagate 400 errors when the currency has associated data', async () => {
      mock.onDelete(`${urlCurrencies}/1/`).reply(400, { message: 'Currency with associated bills' })

      await expect(currencyService.deleteCurrency(1)).rejects.toBeDefined()
    })

    it('must propagate 404 errors', async () => {
      mock.onDelete(`${urlCurrencies}/999/`).reply(404)

      await expect(currencyService.deleteCurrency(999)).rejects.toBeDefined()
    })
  })

  // ============================================================
  // 8. INTEGRATION
  // ============================================================
  describe('Integration', () => {
    it('must complete a full CRUD cycle', async () => {
      // Create
      mock.onPost(`${urlCurrencies}/`).reply(201, createCurrency({ id: 1, name: 'USD' }))

      const created = await currencyService.postCurrency({ name: 'USD', description: 'US Dollar' })
      expect(created.data.id).toBe(1)

      // Read
      mock.onGet(`${urlCurrencies}/1/`).reply(200, createCurrency({ id: 1, name: 'USD' }))

      const read = await currencyService.detailCurrency(1)
      expect(read.data.name).toBe('USD')

      // Update
      mock.onPut(`${urlCurrencies}/1/`).reply(200, createCurrency({ id: 1, name: 'USD Updated' }))

      const updated = await currencyService.putCurrency(
        createCurrency({ id: 1, name: 'USD Updated' })
      )
      expect(updated.data.name).toBe('USD Updated')

      // Delete
      mock.onDelete(`${urlCurrencies}/1/`).reply(204)

      await expect(currencyService.deleteCurrency(1)).resolves.toBeDefined()
    })
  })
})
