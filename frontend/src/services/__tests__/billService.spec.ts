import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import MockAdapter from 'axios-mock-adapter'
import apiBase from '../baseService'
import { billService } from '../billService'
import type { Bill, BillDetail, BillForDelete, BillListItem } from '@/views/bills/types'
import type { PaginatedResponse } from '@/types/shared'

describe('billService', () => {
  let mock: MockAdapter

  const urlBills = '/finance/bills'

  const createBill = (overrides: Partial<Bill> = {}): Bill => ({
    id: 1,
    customer: 1,
    currency: 1,
    folio: 'F-001',
    provider: 1,
    provider_signature_date: '2026-01-01',
    customer_signature_date: null,
    orders: [1, 2, 3],
    check_number: null,
    charge_aprove: null,
    charge_check: null,
    customer_charge: null,
    customer_name: null,
    customer_personal_id: null,
    checked_by: null,
    aproved_by: null,
    ...overrides
  })

  const createBillListItem = (overrides: Partial<BillListItem> = {}): BillListItem => ({
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
    folio: 'F-001',
    get_total_amount: 1500.5,
    provider_signature_date: '2026-01-01',
    ...overrides
  })

  const createBillDetail = (overrides: Partial<BillDetail> = {}): BillDetail =>
    ({
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
      currency: { id: 1, name: 'USD', description: 'US Dollar' },
      folio: 'F-001',
      provider: {
        id: 1,
        username: 'provider1',
        first_name: 'Pedro',
        last_name: 'Sosa',
        tcp_code: '07176',
        bank_account_header: 'Titular',
        bank_account: '0689870015131710',
        address: 'Calle 1',
        activity: 'Refrigeración',
        license_number: '888',
        personal_id: '71040201984'
      },
      provider_signature_date: '2026-01-01',
      customer_signature_date: null,
      get_orders: [],
      get_orders_folio: [],
      get_total_amount: 1500.5,
      get_total_amount_revision: 600,
      get_total_amount_prod: 27577.8,
      get_total_amount_concept: 15603,
      get_total_amount_repair: 8058.75,
      get_total_amount_maintenace: 2201.25,
      get_total_amount_install: 4200,
      get_total_amount_unmounting: 2100,
      check_number: null,
      charge_aprove: null,
      charge_check: null,
      customer_charge: null,
      customer_name: null,
      customer_personal_id: null,
      checked_by: null,
      aproved_by: null,
      ...overrides
    }) as BillDetail

  const createBillForDelete = (overrides: Partial<BillForDelete> = {}): BillForDelete => ({
    id: 1,
    folio: 'F-001',
    ...overrides
  })

  const createPaginatedResponse = (
    results: BillListItem[] = [],
    count: number = results.length
  ): PaginatedResponse<BillListItem> => ({
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
  // 1. listBillsPagination
  // ============================================================
  describe('listBillsPagination', () => {
    it('must call the correct URL', async () => {
      mock.onGet(`${urlBills}/list-pagination/`).reply(200, createPaginatedResponse())

      await billService.listBillsPagination()

      expect(mock.history.get).toHaveLength(1)
      expect(mock.history.get[0].url).toBe(`${urlBills}/list-pagination/`)
    })

    it('must send page and search as query params', async () => {
      mock.onGet(`${urlBills}/list-pagination/`).reply(200, createPaginatedResponse())

      await billService.listBillsPagination(2, 'F-001')

      expect(mock.history.get[0].params).toEqual({ page: 2, search: 'F-001' })
    })

    it('must send empty params when both are null', async () => {
      mock.onGet(`${urlBills}/list-pagination/`).reply(200, createPaginatedResponse())

      await billService.listBillsPagination(null, null)

      expect(mock.history.get[0].params).toEqual({})
    })

    it('must return the paginated response', async () => {
      const bill = createBillListItem({ id: 1, folio: 'F-001' })
      mock.onGet(`${urlBills}/list-pagination/`).reply(200, createPaginatedResponse([bill], 1))

      const result = await billService.listBillsPagination(1, '')

      expect(result.data.results[0].folio).toBe('F-001')
    })

    it('must propagate 500 errors', async () => {
      mock.onGet(`${urlBills}/list-pagination/`).reply(500)

      await expect(billService.listBillsPagination()).rejects.toBeDefined()
    })
  })

  // ============================================================
  // 2. searchBills
  // ============================================================
  describe('searchBills', () => {
    it('must call the correct URL', async () => {
      mock.onGet(`${urlBills}/list-pagination/`).reply(200, createPaginatedResponse())

      await billService.searchBills('F-001')

      expect(mock.history.get[0].url).toBe(`${urlBills}/list-pagination/`)
    })

    it('must send search and page as query params', async () => {
      mock.onGet(`${urlBills}/list-pagination/`).reply(200, createPaginatedResponse())

      await billService.searchBills('F-001', 3)

      expect(mock.history.get[0].params).toEqual({ search: 'F-001', page: 3 })
    })

    it('must omit page when page is 1', async () => {
      mock.onGet(`${urlBills}/list-pagination/`).reply(200, createPaginatedResponse())

      await billService.searchBills('F-001', 1)

      expect(mock.history.get[0].params).toEqual({ search: 'F-001' })
    })
  })

  // ============================================================
  // 3. detailBill
  // ============================================================
  describe('detailBill', () => {
    it('must call the correct URL with id', async () => {
      mock.onGet(`${urlBills}/1/`).reply(200, createBillDetail({ id: 1 }))

      await billService.detailBill(1)

      expect(mock.history.get[0].url).toBe(`${urlBills}/1/`)
    })

    it('must return the bill detail', async () => {
      const detail = createBillDetail({ id: 42, folio: 'F-042' })
      mock.onGet(`${urlBills}/42/`).reply(200, detail)

      const result = await billService.detailBill(42)

      expect(result.data.folio).toBe('F-042')
      expect(result.data.get_total_amount).toBe(1500.5)
    })

    it('must propagate 404 errors', async () => {
      mock.onGet(`${urlBills}/999/`).reply(404)

      await expect(billService.detailBill(999)).rejects.toBeDefined()
    })
  })

  // ============================================================
  // 4. getForUpdate
  // ============================================================
  describe('getForUpdate', () => {
    it('must call the correct URL with /get-for-update/', async () => {
      mock.onGet(`${urlBills}/1/get-for-update/`).reply(200, createBill({ id: 1 }))

      await billService.getForUpdate(1)

      expect(mock.history.get[0].url).toBe(`${urlBills}/1/get-for-update/`)
    })

    it('must return the bill data for update', async () => {
      const bill = createBill({ id: 42, folio: 'F-042', orders: [1, 2] })
      mock.onGet(`${urlBills}/42/get-for-update/`).reply(200, bill)

      const result = await billService.getForUpdate(42)

      expect(result.data.id).toBe(42)
      expect(result.data.orders).toEqual([1, 2])
    })

    it('must propagate 404 errors', async () => {
      mock.onGet(`${urlBills}/999/get-for-update/`).reply(404)

      await expect(billService.getForUpdate(999)).rejects.toBeDefined()
    })
  })

  // ============================================================
  // 5. getForDelete
  // ============================================================
  describe('getForDelete', () => {
    it('must call the correct URL with /get-for-delete/', async () => {
      mock.onGet(`${urlBills}/1/get-for-delete/`).reply(200, createBillForDelete({ id: 1 }))

      await billService.getForDelete(1)

      expect(mock.history.get[0].url).toBe(`${urlBills}/1/get-for-delete/`)
    })

    it('must return the minimal bill data', async () => {
      const bill = createBillForDelete({ id: 42, folio: 'F-042' })
      mock.onGet(`${urlBills}/42/get-for-delete/`).reply(200, bill)

      const result = await billService.getForDelete(42)

      expect(result.data).toEqual(bill)
    })
  })

  // ============================================================
  // 6. postBill
  // ============================================================
  describe('postBill', () => {
    it('must call the correct URL with POST', async () => {
      const newBill = createBill()
      mock.onPost(`${urlBills}/`).reply(201, newBill)

      await billService.postBill(newBill)

      expect(mock.history.post).toHaveLength(1)
      expect(mock.history.post[0].url).toBe(`${urlBills}/`)
    })

    it('must send the body as JSON', async () => {
      const newBill = createBill()
      mock.onPost(`${urlBills}/`).reply(201, newBill)

      await billService.postBill(newBill)

      expect(JSON.parse(mock.history.post[0].data)).toEqual(newBill)
    })

    it('must return the created bill', async () => {
      const createdBill = createBill({ id: 5, folio: 'F-005' })
      mock.onPost(`${urlBills}/`).reply(201, createdBill)

      const result = await billService.postBill(createdBill)

      expect(result.data.id).toBe(5)
    })

    it('must propagate 400 validation errors', async () => {
      mock.onPost(`${urlBills}/`).reply(400, { orders: ['Debe seleccionar al menos una orden'] })

      await expect(billService.postBill(createBill())).rejects.toBeDefined()
    })
  })

  // ============================================================
  // 7. putBill
  // ============================================================
  describe('putBill', () => {
    it('must call the correct URL with PUT', async () => {
      const bill = createBill({ id: 1, folio: 'F-001' })
      mock.onPut(`${urlBills}/1/`).reply(200, bill)

      await billService.putBill(bill)

      expect(mock.history.put).toHaveLength(1)
      expect(mock.history.put[0].url).toBe(`${urlBills}/1/`)
    })

    it('must send the bill as JSON body', async () => {
      const bill = createBill({ id: 1, folio: 'F-001' })
      mock.onPut(`${urlBills}/1/`).reply(200, bill)

      await billService.putBill(bill)

      expect(JSON.parse(mock.history.put[0].data)).toEqual(bill)
    })

    it('must return the updated bill', async () => {
      const updatedBill = createBill({ id: 1, folio: 'F-001-UPD' })
      mock.onPut(`${urlBills}/1/`).reply(200, updatedBill)

      const result = await billService.putBill(updatedBill)

      expect(result.data.folio).toBe('F-001-UPD')
    })
  })

  // ============================================================
  // 8. deleteBill
  // ============================================================
  describe('deleteBill', () => {
    it('must call the correct URL with DELETE', async () => {
      mock.onDelete(`${urlBills}/1/`).reply(204)

      await billService.deleteBill(1)

      expect(mock.history.delete).toHaveLength(1)
      expect(mock.history.delete[0].url).toBe(`${urlBills}/1/`)
    })

    it('must propagate 400 errors when the bill has associated data', async () => {
      mock.onDelete(`${urlBills}/1/`).reply(400)

      await expect(billService.deleteBill(1)).rejects.toBeDefined()
    })

    it('must propagate 404 errors', async () => {
      mock.onDelete(`${urlBills}/999/`).reply(404)

      await expect(billService.deleteBill(999)).rejects.toBeDefined()
    })
  })
})
