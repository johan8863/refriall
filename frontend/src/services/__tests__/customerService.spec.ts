import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import MockAdapter from 'axios-mock-adapter'
import apiBase from '../baseService'
import { customerService } from '../customerService'
import type { Customer, CustomerDetail, CustomerType } from '@/views/customers/types'
import type { PaginatedResponse } from '@/types/shared'

describe('customerService', () => {
  let mock: MockAdapter

  const urlCustomers = '/hr/customers'

  const createCustomer = (overrides: Partial<Customer> = {}): Customer => ({
    id: 1,
    customer_type: 'es' as CustomerType,
    name: 'Comercio',
    address: 'Carretera Aeropuerto Km 4',
    province: 'IJV',
    township: 'Nueva Gerona',
    code: '25100',
    client_nit: '45214',
    bank_account_header: 'Titular Comercio',
    bank_account: '56987523',
    ...overrides
  })

  const createCustomerDetail = (overrides: Partial<CustomerDetail> = {}): CustomerDetail => ({
    ...createCustomer(),
    get_dependencies: [],
    ...overrides
  })

  const createPaginatedResponse = (
    results: Customer[] = [],
    count: number = results.length
  ): PaginatedResponse<Customer> => ({
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
  // 1. listCustomer
  // ============================================================
  describe('listCustomer', () => {
    it('must call the correct URL', async () => {
      mock.onGet(`${urlCustomers}/list-pagination/`).reply(200, createPaginatedResponse())

      await customerService.listCustomer()

      expect(mock.history.get).toHaveLength(1)
      expect(mock.history.get[0].url).toBe(`${urlCustomers}/list-pagination/`)
    })

    it('must send page and search as query params', async () => {
      mock.onGet(`${urlCustomers}/list-pagination/`).reply(200, createPaginatedResponse())

      await customerService.listCustomer(2, 'comercio')

      expect(mock.history.get[0].params).toEqual({ page: 2, search: 'comercio' })
    })

    it('must send empty params when both are null', async () => {
      mock.onGet(`${urlCustomers}/list-pagination/`).reply(200, createPaginatedResponse())

      await customerService.listCustomer(null, null)

      expect(mock.history.get[0].params).toEqual({})
    })

    it('must return the paginated response', async () => {
      const customer = createCustomer({ id: 1, name: 'Comercio' })
      mock
        .onGet(`${urlCustomers}/list-pagination/`)
        .reply(200, createPaginatedResponse([customer], 1))

      const result = await customerService.listCustomer(1, '')

      expect(result.data.results[0].name).toBe('Comercio')
    })

    it('must propagate 500 errors', async () => {
      mock.onGet(`${urlCustomers}/list-pagination/`).reply(500)

      await expect(customerService.listCustomer()).rejects.toBeDefined()
    })
  })

  // ============================================================
  // 2. searchCustomers
  // ============================================================
  describe('searchCustomers', () => {
    it('must call the correct URL', async () => {
      mock.onGet(`${urlCustomers}/list-pagination/`).reply(200, createPaginatedResponse())

      await customerService.searchCustomers('comercio')

      expect(mock.history.get[0].url).toBe(`${urlCustomers}/list-pagination/`)
    })

    it('must send search and page as query params', async () => {
      mock.onGet(`${urlCustomers}/list-pagination/`).reply(200, createPaginatedResponse())

      await customerService.searchCustomers('comercio', 3)

      expect(mock.history.get[0].params).toEqual({ search: 'comercio', page: 3 })
    })

    it('must omit page when page is 1', async () => {
      mock.onGet(`${urlCustomers}/list-pagination/`).reply(200, createPaginatedResponse())

      await customerService.searchCustomers('comercio', 1)

      expect(mock.history.get[0].params).toEqual({ search: 'comercio' })
    })

    it('must return the paginated response', async () => {
      const customer = createCustomer({ id: 1, name: 'Comercio' })
      mock
        .onGet(`${urlCustomers}/list-pagination/`)
        .reply(200, createPaginatedResponse([customer], 1))

      const result = await customerService.searchCustomers('comercio')

      expect(result.data.results[0].name).toBe('Comercio')
    })
  })

  // ============================================================
  // 3. listAllCustomers
  // ============================================================
  describe('listAllCustomers', () => {
    it('must call the correct URL without params', async () => {
      mock.onGet(`${urlCustomers}/`).reply(200, [])

      await customerService.listAllCustomers()

      expect(mock.history.get[0].url).toBe(`${urlCustomers}/`)
      expect(mock.history.get[0].params).toBeUndefined()
    })

    it('must return the customers array', async () => {
      const customers = [
        createCustomer({ id: 1, name: 'Comercio' }),
        createCustomer({ id: 2, name: 'Aeropuerto' })
      ]
      mock.onGet(`${urlCustomers}/`).reply(200, customers)

      const result = await customerService.listAllCustomers()

      expect(result.data).toEqual(customers)
      expect(result.data).toHaveLength(2)
    })
  })

  // ============================================================
  // 4. listCustomerOrdersNoBill
  // ============================================================
  describe('listCustomerOrdersNoBill', () => {
    it('must call the correct URL with currency and provider params in the path', async () => {
      mock.onGet(`${urlCustomers}/customer-order-currency-provider-no-bill/1/2/`).reply(200, [])

      await customerService.listCustomerOrdersNoBill(1, 2)

      expect(mock.history.get[0].url).toBe(
        `${urlCustomers}/customer-order-currency-provider-no-bill/1/2/`
      )
    })

    it('must return the customers array', async () => {
      const customers = [createCustomer({ id: 1, name: 'Comercio' })]
      mock
        .onGet(`${urlCustomers}/customer-order-currency-provider-no-bill/1/2/`)
        .reply(200, customers)

      const result = await customerService.listCustomerOrdersNoBill(1, 2)

      expect(result.data).toEqual(customers)
      expect(result.data[0].name).toBe('Comercio')
    })

    it('must propagate 500 errors', async () => {
      mock.onGet(`${urlCustomers}/customer-order-currency-provider-no-bill/1/2/`).reply(500)

      await expect(customerService.listCustomerOrdersNoBill(1, 2)).rejects.toBeDefined()
    })
  })

  // ============================================================
  // 5. detailCustomer
  // ============================================================
  describe('detailCustomer', () => {
    it('must call the correct URL with id', async () => {
      mock.onGet(`${urlCustomers}/1/`).reply(200, createCustomerDetail({ id: 1 }))

      await customerService.detailCustomer(1)

      expect(mock.history.get[0].url).toBe(`${urlCustomers}/1/`)
    })

    it('must return the customer with dependencies', async () => {
      const customerDetail = createCustomerDetail({
        id: 42,
        name: 'Comercio',
        get_dependencies: []
      })
      mock.onGet(`${urlCustomers}/42/`).reply(200, customerDetail)

      const result = await customerService.detailCustomer(42)

      expect(result.data).toEqual(customerDetail)
      expect(result.data.get_dependencies).toEqual([])
    })

    it('must propagate 404 errors', async () => {
      mock.onGet(`${urlCustomers}/999/`).reply(404)

      await expect(customerService.detailCustomer(999)).rejects.toBeDefined()
    })
  })

  // ============================================================
  // 6. postCustomer
  // ============================================================
  describe('postCustomer', () => {
    it('must call the correct URL with POST', async () => {
      const newCustomer = createCustomer()
      mock.onPost(`${urlCustomers}/`).reply(201, newCustomer)

      await customerService.postCustomer(newCustomer)

      expect(mock.history.post).toHaveLength(1)
      expect(mock.history.post[0].url).toBe(`${urlCustomers}/`)
    })

    it('must send the body as JSON', async () => {
      const newCustomer = createCustomer()
      mock.onPost(`${urlCustomers}/`).reply(201, newCustomer)

      await customerService.postCustomer(newCustomer)

      expect(JSON.parse(mock.history.post[0].data)).toEqual(newCustomer)
    })

    it('must return the created customer', async () => {
      const createdCustomer = createCustomer({ id: 5, name: 'New Customer' })
      mock.onPost(`${urlCustomers}/`).reply(201, createdCustomer)

      const result = await customerService.postCustomer(createdCustomer)

      expect(result.data).toEqual(createdCustomer)
      expect(result.data.id).toBe(5)
    })

    it('must propagate 400 validation errors', async () => {
      mock.onPost(`${urlCustomers}/`).reply(400, { name: ['El nombre ya existe'] })

      await expect(customerService.postCustomer(createCustomer())).rejects.toBeDefined()
    })
  })

  // ============================================================
  // 7. putCustomer
  // ============================================================
  describe('putCustomer', () => {
    it('must call the correct URL with PUT', async () => {
      const customer = createCustomer({ id: 1, name: 'Updated' })
      mock.onPut(`${urlCustomers}/1/`).reply(200, customer)

      await customerService.putCustomer(customer)

      expect(mock.history.put).toHaveLength(1)
      expect(mock.history.put[0].url).toBe(`${urlCustomers}/1/`)
    })

    it('must send the customer as JSON body', async () => {
      const customer = createCustomer({ id: 1, name: 'Updated' })
      mock.onPut(`${urlCustomers}/1/`).reply(200, customer)

      await customerService.putCustomer(customer)

      expect(JSON.parse(mock.history.put[0].data)).toEqual(customer)
    })

    it('must return the updated customer', async () => {
      const updatedCustomer = createCustomer({ id: 1, name: 'Updated' })
      mock.onPut(`${urlCustomers}/1/`).reply(200, updatedCustomer)

      const result = await customerService.putCustomer(updatedCustomer)

      expect(result.data.name).toBe('Updated')
    })

    it('must propagate 404 errors', async () => {
      const customer = createCustomer({ id: 999 })
      mock.onPut(`${urlCustomers}/999/`).reply(404)

      await expect(customerService.putCustomer(customer)).rejects.toBeDefined()
    })
  })

  // ============================================================
  // 8. deleteCustomer
  // ============================================================
  describe('deleteCustomer', () => {
    it('must call the correct URL with DELETE', async () => {
      mock.onDelete(`${urlCustomers}/1/`).reply(204)

      await customerService.deleteCustomer(1)

      expect(mock.history.delete).toHaveLength(1)
      expect(mock.history.delete[0].url).toBe(`${urlCustomers}/1/`)
    })

    it('must propagate 400 errors when the customer has associated data', async () => {
      mock.onDelete(`${urlCustomers}/1/`).reply(400, { message: 'Customer with orders' })

      await expect(customerService.deleteCustomer(1)).rejects.toBeDefined()
    })

    it('must propagate 404 errors', async () => {
      mock.onDelete(`${urlCustomers}/999/`).reply(404)

      await expect(customerService.deleteCustomer(999)).rejects.toBeDefined()
    })
  })

  // ============================================================
  // 9. INTEGRATION
  // ============================================================
  describe('Integration', () => {
    it('must complete a full CRUD cycle', async () => {
      // Create
      mock.onPost(`${urlCustomers}/`).reply(201, createCustomer({ id: 1 }))

      const created = await customerService.postCustomer(createCustomer())
      expect(created.data.id).toBe(1)

      // Read
      mock.onGet(`${urlCustomers}/1/`).reply(200, createCustomerDetail({ id: 1 }))

      const read = await customerService.detailCustomer(1)
      expect(read.data.id).toBe(1)

      // Update
      mock.onPut(`${urlCustomers}/1/`).reply(200, createCustomer({ id: 1, name: 'Updated' }))

      const updated = await customerService.putCustomer(createCustomer({ id: 1, name: 'Updated' }))
      expect(updated.data.name).toBe('Updated')

      // Delete
      mock.onDelete(`${urlCustomers}/1/`).reply(204)

      await expect(customerService.deleteCustomer(1)).resolves.toBeDefined()
    })
  })
})
