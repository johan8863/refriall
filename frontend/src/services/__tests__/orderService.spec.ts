import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import MockAdapter from 'axios-mock-adapter'
import apiBase from '../baseService'
import { orderService } from '../orderService'
import type { Order, OrderDetail, OrderList } from '@/views/orders/types'
import type { PaginatedResponse } from '@/types/shared'

describe('orderService', () => {
  let mock: MockAdapter

  const urlOrders = '/finance/orders'

  const createOrder = (overrides: Partial<Order> = {}): Order =>
    ({
      id: 1,
      bill: null,
      customer: null,
      customer_dependency: null,
      symptom: 'No enfría',
      flaw: 'Salidero',
      repair_description: 'Completamiento',
      folio: 'ORD-001',
      check_diagnosis: true,
      repair: false,
      install: false,
      maintenance: false,
      support: 't',
      kit: 1,
      kit_brand: 'High Prestige',
      kit_model: 'PSE-18R4',
      kit_serial: 'SER-001',
      job_description: null,
      itemtime_set: [],
      itemtimeorder_set: [],
      provider: 1,
      provider_signature_date: '2026-01-01',
      customer_signature_date: null,
      currency: 1,
      check_number: null,
      charge_aprove: null,
      charge_check: null,
      customer_charge: null,
      customer_name: null,
      customer_personal_id: null,
      checked_by: null,
      aproved_by: null,
      ...overrides
    }) as Order

  const createOrderList = (overrides: Partial<OrderList> = {}): OrderList => ({
    id: 1,
    folio: 'ORD-001',
    customer: null,
    customer_dependency: null,
    get_total_amount: 1500.5,
    ...overrides
  })

  const createOrderDetail = (overrides: Partial<OrderDetail> = {}): OrderDetail =>
    ({
      ...createOrder(),
      get_total_amount: 1500.5,
      get_total_amount_revision: 600,
      get_total_amount_prod: 27577.8,
      get_total_amount_concept: 15603,
      get_total_amount_repair: 8058.75,
      get_total_amount_maintenace: 2201.25,
      get_total_amount_install: 4200,
      get_total_amount_unmounting: 2100,
      get_order_support: 'Taller',
      ...overrides
    }) as OrderDetail

  const createPaginatedResponse = (
    results: OrderList[] = [],
    count: number = results.length
  ): PaginatedResponse<OrderList> => ({
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
  // 1. listOrder
  // ============================================================
  describe('listOrder', () => {
    it('must call the correct URL', async () => {
      mock.onGet(`${urlOrders}/list-pagination/`).reply(200, createPaginatedResponse())

      await orderService.listOrder()

      expect(mock.history.get).toHaveLength(1)
      expect(mock.history.get[0].url).toBe(`${urlOrders}/list-pagination/`)
    })

    it('must send page and search as query params', async () => {
      mock.onGet(`${urlOrders}/list-pagination/`).reply(200, createPaginatedResponse())

      await orderService.listOrder(2, 'ord')

      expect(mock.history.get[0].params).toEqual({ page: 2, search: 'ord' })
    })

    it('must send empty params when both are null', async () => {
      mock.onGet(`${urlOrders}/list-pagination/`).reply(200, createPaginatedResponse())

      await orderService.listOrder(null, null)

      expect(mock.history.get[0].params).toEqual({})
    })

    it('must return the paginated response', async () => {
      const order = createOrderList({ id: 1, folio: 'ORD-001' })
      mock.onGet(`${urlOrders}/list-pagination/`).reply(200, createPaginatedResponse([order], 1))

      const result = await orderService.listOrder(1, '')

      expect(result.data.results[0].folio).toBe('ORD-001')
    })

    it('must propagate 500 errors', async () => {
      mock.onGet(`${urlOrders}/list-pagination/`).reply(500)

      await expect(orderService.listOrder()).rejects.toBeDefined()
    })
  })

  // ============================================================
  // 2. searchOrders
  // ============================================================
  describe('searchOrders', () => {
    it('must call the correct URL', async () => {
      mock.onGet(`${urlOrders}/list-pagination/`).reply(200, createPaginatedResponse())

      await orderService.searchOrders('ord')

      expect(mock.history.get[0].url).toBe(`${urlOrders}/list-pagination/`)
    })

    it('must send search and page as query params', async () => {
      mock.onGet(`${urlOrders}/list-pagination/`).reply(200, createPaginatedResponse())

      await orderService.searchOrders('ord', 3)

      expect(mock.history.get[0].params).toEqual({ search: 'ord', page: 3 })
    })

    it('must omit page when page is 1', async () => {
      mock.onGet(`${urlOrders}/list-pagination/`).reply(200, createPaginatedResponse())

      await orderService.searchOrders('ord', 1)

      expect(mock.history.get[0].params).toEqual({ search: 'ord' })
    })

    it('must return the paginated response', async () => {
      const order = createOrderList({ id: 1, folio: 'ORD-001' })
      mock.onGet(`${urlOrders}/list-pagination/`).reply(200, createPaginatedResponse([order], 1))

      const result = await orderService.searchOrders('ord')

      expect(result.data.results[0].folio).toBe('ORD-001')
    })
  })

  // ============================================================
  // 3. detailOrder
  // ============================================================
  describe('detailOrder', () => {
    it('must call the correct URL with id and /order-detail/', async () => {
      mock.onGet(`${urlOrders}/1/order-detail/`).reply(200, createOrderDetail({ id: 1 }))

      await orderService.detailOrder(1)

      expect(mock.history.get[0].url).toBe(`${urlOrders}/1/order-detail/`)
    })

    it('must return the order detail', async () => {
      const detail = createOrderDetail({ id: 42, folio: 'ORD-042' })
      mock.onGet(`${urlOrders}/42/order-detail/`).reply(200, detail)

      const result = await orderService.detailOrder(42)

      expect(result.data.folio).toBe('ORD-042')
      expect(result.data.get_total_amount).toBe(1500.5)
    })

    it('must propagate 404 errors', async () => {
      mock.onGet(`${urlOrders}/999/order-detail/`).reply(404)

      await expect(orderService.detailOrder(999)).rejects.toBeDefined()
    })
  })

  // ============================================================
  // 4. detailOrderUpdate
  // ============================================================
  describe('detailOrderUpdate', () => {
    it('must call the correct URL with id only', async () => {
      mock.onGet(`${urlOrders}/1/`).reply(200, createOrder({ id: 1 }))

      await orderService.detailOrderUpdate(1)

      expect(mock.history.get[0].url).toBe(`${urlOrders}/1/`)
    })

    it('must return the order', async () => {
      const order = createOrder({ id: 42, folio: 'ORD-042' })
      mock.onGet(`${urlOrders}/42/`).reply(200, order)

      const result = await orderService.detailOrderUpdate(42)

      expect(result.data.id).toBe(42)
    })

    it('must propagate 404 errors', async () => {
      mock.onGet(`${urlOrders}/999/`).reply(404)

      await expect(orderService.detailOrderUpdate(999)).rejects.toBeDefined()
    })
  })

  // ============================================================
  // 5. postOrder
  // ============================================================
  describe('postOrder', () => {
    it('must call the correct URL with POST', async () => {
      const newOrder = createOrder()
      mock.onPost(`${urlOrders}/`).reply(201, newOrder)

      await orderService.postOrder(newOrder)

      expect(mock.history.post).toHaveLength(1)
      expect(mock.history.post[0].url).toBe(`${urlOrders}/`)
    })

    it('must send the body as JSON', async () => {
      const newOrder = createOrder()
      mock.onPost(`${urlOrders}/`).reply(201, newOrder)

      await orderService.postOrder(newOrder)

      expect(JSON.parse(mock.history.post[0].data)).toEqual(newOrder)
    })

    it('must return the created order', async () => {
      const createdOrder = createOrder({ id: 5, folio: 'ORD-005' })
      mock.onPost(`${urlOrders}/`).reply(201, createdOrder)

      const result = await orderService.postOrder(createdOrder)

      expect(result.data.id).toBe(5)
    })

    it('must propagate 400 validation errors', async () => {
      mock.onPost(`${urlOrders}/`).reply(400, {
        non_field_errors: ['Debe incluir al menos una modalidad.']
      })

      await expect(orderService.postOrder(createOrder())).rejects.toBeDefined()
    })
  })

  // ============================================================
  // 6. putOrder
  // ============================================================
  describe('putOrder', () => {
    it('must call the correct URL with PUT', async () => {
      const order = createOrder({ id: 1, folio: 'ORD-001' })
      mock.onPut(`${urlOrders}/1/`).reply(200, order)

      await orderService.putOrder(order)

      expect(mock.history.put).toHaveLength(1)
      expect(mock.history.put[0].url).toBe(`${urlOrders}/1/`)
    })

    it('must send the order as JSON body', async () => {
      const order = createOrder({ id: 1, folio: 'ORD-001' })
      mock.onPut(`${urlOrders}/1/`).reply(200, order)

      await orderService.putOrder(order)

      expect(JSON.parse(mock.history.put[0].data)).toEqual(order)
    })

    it('must return the updated order', async () => {
      const updatedOrder = createOrder({ id: 1, folio: 'ORD-001-UPD' })
      mock.onPut(`${urlOrders}/1/`).reply(200, updatedOrder)

      const result = await orderService.putOrder(updatedOrder)

      expect(result.data.folio).toBe('ORD-001-UPD')
    })
  })

  // ============================================================
  // 7. deleteOrder
  // ============================================================
  describe('deleteOrder', () => {
    it('must call the correct URL with DELETE', async () => {
      mock.onDelete(`${urlOrders}/1/`).reply(204)

      await orderService.deleteOrder(1)

      expect(mock.history.delete).toHaveLength(1)
      expect(mock.history.delete[0].url).toBe(`${urlOrders}/1/`)
    })

    it('must propagate 400 errors when the order is associated with a bill', async () => {
      mock.onDelete(`${urlOrders}/1/`).reply(400, { id: 1, folio: 'F-001' })

      await expect(orderService.deleteOrder(1)).rejects.toBeDefined()
    })

    it('must propagate 404 errors', async () => {
      mock.onDelete(`${urlOrders}/999/`).reply(404)

      await expect(orderService.deleteOrder(999)).rejects.toBeDefined()
    })
  })

  // ============================================================
  // 8. getOrdersFromCustomerNotMatched
  // ============================================================
  describe('getOrdersFromCustomerNotMatched', () => {
    it('must call the correct URL with currency, provider and customer in path', async () => {
      mock.onGet(`${urlOrders}/orders-from-currency-customer-free-bill/1/2/3/`).reply(200, [])

      await orderService.getOrdersFromCustomerNotMatched(1, 2, 3)

      expect(mock.history.get[0].url).toBe(
        `${urlOrders}/orders-from-currency-customer-free-bill/1/2/3/`
      )
    })

    it('must return the orders array', async () => {
      const orders = [createOrderList({ id: 1, folio: 'ORD-001' })]
      mock.onGet(`${urlOrders}/orders-from-currency-customer-free-bill/1/2/3/`).reply(200, orders)

      const result = await orderService.getOrdersFromCustomerNotMatched(1, 2, 3)

      expect(result.data).toEqual(orders)
      expect(result.data[0].folio).toBe('ORD-001')
    })

    it('must propagate 500 errors', async () => {
      mock.onGet(`${urlOrders}/orders-from-currency-customer-free-bill/1/2/3/`).reply(500)

      await expect(orderService.getOrdersFromCustomerNotMatched(1, 2, 3)).rejects.toBeDefined()
    })
  })

  // ============================================================
  // 9. getOrdersByIds
  // ============================================================
  describe('getOrdersByIds', () => {
    it('must call the correct URL with POST', async () => {
      mock.onPost(`${urlOrders}/get-orders-by-ids/`).reply(200, [])

      await orderService.getOrdersByIds([1, 2, 3])

      expect(mock.history.post).toHaveLength(1)
      expect(mock.history.post[0].url).toBe(`${urlOrders}/get-orders-by-ids/`)
    })

    it('must send ordersIds in the body', async () => {
      mock.onPost(`${urlOrders}/get-orders-by-ids/`).reply(200, [])

      await orderService.getOrdersByIds([1, 2, 3])

      expect(JSON.parse(mock.history.post[0].data)).toEqual({ ordersIds: [1, 2, 3] })
    })

    it('must return the orders array', async () => {
      const orders = [
        createOrderList({ id: 1, folio: 'ORD-001' }),
        createOrderList({ id: 2, folio: 'ORD-002' })
      ]
      mock.onPost(`${urlOrders}/get-orders-by-ids/`).reply(200, orders)

      const result = await orderService.getOrdersByIds([1, 2])

      expect(result.data).toHaveLength(2)
    })

    it('must handle empty array body', async () => {
      mock.onPost(`${urlOrders}/get-orders-by-ids/`).reply(200, [])

      const result = await orderService.getOrdersByIds([])

      expect(JSON.parse(mock.history.post[0].data)).toEqual({ ordersIds: [] })
      expect(result.data).toEqual([])
    })
  })
})
