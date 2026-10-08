import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import MockAdapter from 'axios-mock-adapter'
import apiBase from '../baseService'
import { customerDependencyService } from '../customerDependencyService'
import type {
  CustomerDependency,
  CustomerDependencyDetail
} from '@/views/customerDependencies/types'
import type { PaginatedResponse } from '@/types/shared'

describe('customerDependencyService', () => {
  let mock: MockAdapter

  const urlDependencies = '/hr/dependencies'

  const createDependency = (overrides: Partial<CustomerDependency> = {}): CustomerDependency => ({
    id: 1,
    customer: 1,
    name: 'Dependency 1',
    address: 'Address 1',
    province: 'IJV',
    township: 'Nueva Gerona',
    ...overrides
  })

  const createDependencyDetail = (
    overrides: Partial<CustomerDependencyDetail> = {}
  ): CustomerDependencyDetail => ({
    id: 1,
    customer: {
      id: 1,
      customer_type: 'es',
      name: 'Comercio',
      address: 'Address',
      province: 'IJV',
      township: 'Nueva Gerona',
      code: '25100',
      client_nit: null,
      bank_account_header: 'Titular',
      bank_account: '56987523'
    },
    name: 'Dependency 1',
    address: 'Address 1',
    province: 'IJV',
    township: 'Nueva Gerona',
    ...overrides
  })

  const createPaginatedResponse = (
    results: CustomerDependency[] = [],
    count: number = results.length
  ): PaginatedResponse<CustomerDependency> => ({
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
  // 1. searchCustomerDependencies
  // ============================================================
  describe('searchCustomerDependencies', () => {
    it('must call the correct URL with customer id in path', async () => {
      mock.onGet(`${urlDependencies}/?customer=1`).reply(200, [])

      await customerDependencyService.searchCustomerDependencies(1, 'dep')

      expect(mock.history.get[0].url).toBe(`${urlDependencies}/?customer=1`)
    })

    it('must send search as query param', async () => {
      mock.onGet(`${urlDependencies}/?customer=1`).reply(200, [])

      await customerDependencyService.searchCustomerDependencies(1, 'dep')

      expect(mock.history.get[0].params).toEqual({ search: 'dep' })
    })

    it('must return the dependencies array', async () => {
      const dependencies = [createDependency({ id: 1, name: 'Dependency 1' })]
      mock.onGet(`${urlDependencies}/?customer=1`).reply(200, dependencies)

      const result = await customerDependencyService.searchCustomerDependencies(1, 'dep')

      expect(result.data).toEqual(dependencies)
      expect(result.data[0].name).toBe('Dependency 1')
    })

    it('must propagate 500 errors', async () => {
      mock.onGet(`${urlDependencies}/?customer=1`).reply(500)

      await expect(
        customerDependencyService.searchCustomerDependencies(1, 'dep')
      ).rejects.toBeDefined()
    })
  })

  // ============================================================
  // 2. listCustomerDependency
  // ============================================================
  describe('listCustomerDependency', () => {
    it('must call the correct URL without params', async () => {
      mock.onGet(`${urlDependencies}/`).reply(200, [])

      await customerDependencyService.listCustomerDependency()

      expect(mock.history.get[0].url).toBe(`${urlDependencies}/`)
    })

    it('must return the dependencies array', async () => {
      const dependencies = [
        createDependency({ id: 1, name: 'Dep 1' }),
        createDependency({ id: 2, name: 'Dep 2' })
      ]
      mock.onGet(`${urlDependencies}/`).reply(200, dependencies)

      const result = await customerDependencyService.listCustomerDependency()

      expect(result.data).toEqual(dependencies)
      expect(result.data).toHaveLength(2)
    })
  })

  // ============================================================
  // 3. listCustomerDependencyPagination
  // ============================================================
  describe('listCustomerDependencyPagination', () => {
    it('must call the correct URL', async () => {
      mock.onGet(`${urlDependencies}/list-pagination/`).reply(200, createPaginatedResponse())

      await customerDependencyService.listCustomerDependencyPagination()

      expect(mock.history.get[0].url).toBe(`${urlDependencies}/list-pagination/`)
    })

    it('must send page and search as query params', async () => {
      mock.onGet(`${urlDependencies}/list-pagination/`).reply(200, createPaginatedResponse())

      await customerDependencyService.listCustomerDependencyPagination(2, 'dep')

      expect(mock.history.get[0].params).toEqual({ page: 2, search: 'dep' })
    })

    it('must send empty params when both are null', async () => {
      mock.onGet(`${urlDependencies}/list-pagination/`).reply(200, createPaginatedResponse())

      await customerDependencyService.listCustomerDependencyPagination(null, null)

      expect(mock.history.get[0].params).toEqual({})
    })

    it('must return the paginated response', async () => {
      const dependency = createDependency({ id: 1, name: 'Dep 1' })
      mock
        .onGet(`${urlDependencies}/list-pagination/`)
        .reply(200, createPaginatedResponse([dependency], 1))

      const result = await customerDependencyService.listCustomerDependencyPagination(1, '')

      expect(result.data.results[0].name).toBe('Dep 1')
    })
  })

  // ============================================================
  // 4. searchCustomerDependency
  // ============================================================
  describe('searchCustomerDependency', () => {
    it('must call the correct URL', async () => {
      mock.onGet(`${urlDependencies}/list-pagination/`).reply(200, createPaginatedResponse())

      await customerDependencyService.searchCustomerDependency('dep')

      expect(mock.history.get[0].url).toBe(`${urlDependencies}/list-pagination/`)
    })

    it('must send search and page as query params', async () => {
      mock.onGet(`${urlDependencies}/list-pagination/`).reply(200, createPaginatedResponse())

      await customerDependencyService.searchCustomerDependency('dep', 3)

      expect(mock.history.get[0].params).toEqual({ search: 'dep', page: 3 })
    })

    it('must omit page when page is 1', async () => {
      mock.onGet(`${urlDependencies}/list-pagination/`).reply(200, createPaginatedResponse())

      await customerDependencyService.searchCustomerDependency('dep', 1)

      expect(mock.history.get[0].params).toEqual({ search: 'dep' })
    })
  })

  // ============================================================
  // 5. detailCustomerDependency
  // ============================================================
  describe('detailCustomerDependency', () => {
    it('must call the correct URL with id', async () => {
      mock.onGet(`${urlDependencies}/1/`).reply(200, createDependencyDetail({ id: 1 }))

      await customerDependencyService.detailCustomerDependency(1)

      expect(mock.history.get[0].url).toBe(`${urlDependencies}/1/`)
    })

    it('must return the dependency with customer info', async () => {
      const detail = createDependencyDetail({ id: 42 })
      mock.onGet(`${urlDependencies}/42/`).reply(200, detail)

      const result = await customerDependencyService.detailCustomerDependency(42)

      expect(result.data).toEqual(detail)
      expect(result.data.customer.name).toBe('Comercio')
    })

    it('must propagate 404 errors', async () => {
      mock.onGet(`${urlDependencies}/999/`).reply(404)

      await expect(customerDependencyService.detailCustomerDependency(999)).rejects.toBeDefined()
    })
  })

  // ============================================================
  // 6. postCustomerDependency
  // ============================================================
  describe('postCustomerDependency', () => {
    it('must call the correct URL with POST', async () => {
      const newDependency = createDependency()
      mock.onPost(`${urlDependencies}/`).reply(201, newDependency)

      await customerDependencyService.postCustomerDependency(newDependency)

      expect(mock.history.post).toHaveLength(1)
      expect(mock.history.post[0].url).toBe(`${urlDependencies}/`)
    })

    it('must send the body as JSON', async () => {
      const newDependency = createDependency()
      mock.onPost(`${urlDependencies}/`).reply(201, newDependency)

      await customerDependencyService.postCustomerDependency(newDependency)

      expect(JSON.parse(mock.history.post[0].data)).toEqual(newDependency)
    })

    it('must return the created dependency', async () => {
      const createdDependency = createDependency({ id: 5, name: 'New Dep' })
      mock.onPost(`${urlDependencies}/`).reply(201, createdDependency)

      const result = await customerDependencyService.postCustomerDependency(createdDependency)

      expect(result.data.id).toBe(5)
    })

    it('must propagate 400 validation errors', async () => {
      mock.onPost(`${urlDependencies}/`).reply(400, { name: ['Nombre duplicado'] })

      await expect(
        customerDependencyService.postCustomerDependency(createDependency())
      ).rejects.toBeDefined()
    })
  })

  // ============================================================
  // 7. putCustomerDependency
  // ============================================================
  describe('putCustomerDependency', () => {
    it('must call the correct URL with PUT', async () => {
      const dependency = createDependency({ id: 1, name: 'Updated' })
      mock.onPut(`${urlDependencies}/1/`).reply(200, dependency)

      await customerDependencyService.putCustomerDependency(dependency)

      expect(mock.history.put).toHaveLength(1)
      expect(mock.history.put[0].url).toBe(`${urlDependencies}/1/`)
    })

    it('must send the dependency as JSON body', async () => {
      const dependency = createDependency({ id: 1, name: 'Updated' })
      mock.onPut(`${urlDependencies}/1/`).reply(200, dependency)

      await customerDependencyService.putCustomerDependency(dependency)

      expect(JSON.parse(mock.history.put[0].data)).toEqual(dependency)
    })

    it('must return the updated dependency', async () => {
      const updatedDependency = createDependency({ id: 1, name: 'Updated' })
      mock.onPut(`${urlDependencies}/1/`).reply(200, updatedDependency)

      const result = await customerDependencyService.putCustomerDependency(updatedDependency)

      expect(result.data.name).toBe('Updated')
    })
  })

  // ============================================================
  // 8. deleteCustomerDependency
  // ============================================================
  describe('deleteCustomerDependency', () => {
    it('must call the correct URL with DELETE', async () => {
      mock.onDelete(`${urlDependencies}/1/`).reply(204)

      await customerDependencyService.deleteCustomerDependency(1)

      expect(mock.history.delete).toHaveLength(1)
      expect(mock.history.delete[0].url).toBe(`${urlDependencies}/1/`)
    })

    it('must propagate 400 errors when the dependency has associated data', async () => {
      mock.onDelete(`${urlDependencies}/1/`).reply(400)

      await expect(customerDependencyService.deleteCustomerDependency(1)).rejects.toBeDefined()
    })

    it('must propagate 404 errors', async () => {
      mock.onDelete(`${urlDependencies}/999/`).reply(404)

      await expect(customerDependencyService.deleteCustomerDependency(999)).rejects.toBeDefined()
    })
  })
})
