import { beforeEach, describe, expect, it } from 'vitest'
import { ref, type Ref } from 'vue'
import { useOrderTotalComputed, useOrderPaginate } from '../OrderComposable'
import type { Order, ItemTime, ItemTimeOrder } from '@/views/orders/types'
import type { Item } from '@/views/items/types'

// Helper to build a minimal Item
const createItem = (id: number, price: number): Item =>
  ({
    id,
    code: `CODE-${id}`,
    name: `Item ${id}`,
    item_type: 'prod',
    measurement: 'u',
    price,
    get_item_type: 'Producto',
    get_measurement: 'Uno'
  }) as Item

// Helper to build a minimal ItemTime
const createItemTime = (item: number, times: number): ItemTime => ({
  item,
  times
})

// Helper to build a minimal Order
const createOrder = (itemtime_set: ItemTime[] = []): Order =>
  ({
    id: 1,
    bill: null,
    customer: null,
    customer_dependency: null,
    symptom: '',
    flaw: '',
    repair_description: '',
    folio: 'ORD-001',
    check_diagnosis: false,
    repair: false,
    install: false,
    maintenance: false,
    support: 't',
    kit: 1,
    kit_brand: '',
    kit_model: '',
    kit_serial: '',
    job_description: null,
    itemtime_set,
    itemtimeorder_set: [],
    provider: 1,
    provider_signature_date: '',
    customer_signature_date: '',
    currency: 1,
    check_number: null,
    charge_aprove: null,
    charge_check: null,
    customer_charge: null,
    customer_name: null,
    customer_personal_id: null,
    checked_by: null,
    aproved_by: null
  }) as Order

// ============================================================
// useOrderTotalComputed
// ============================================================
describe('useOrderTotalComputed', () => {
  let items: Ref<Item[]>
  let order: Ref<Order>

  beforeEach(() => {
    items = ref<Item[]>([createItem(1, 100), createItem(2, 50), createItem(3, 25)])
    order = ref<Order>(createOrder())
  })

  // ============================================================
  // 1. INITIAL STATE
  // ============================================================
  describe('Initial state', () => {
    it('must return 0 when there are no items', () => {
      const { orderTotalComputed } = useOrderTotalComputed(order, items)

      expect(orderTotalComputed.value).toBe(0)
    })

    it('must return 0 when all items have item = 0', () => {
      order.value = createOrder([createItemTime(0, 5), createItemTime(0, 10)])

      const { orderTotalComputed } = useOrderTotalComputed(order, items)

      expect(orderTotalComputed.value).toBe(0)
    })
  })

  // ============================================================
  // 2. CALCULATION
  // ============================================================
  describe('Calculation', () => {
    it('must calculate total for a single item', () => {
      order.value = createOrder([createItemTime(1, 2)])

      const { orderTotalComputed } = useOrderTotalComputed(order, items)

      // 100 * 2 = 200
      expect(orderTotalComputed.value).toBe(200)
    })

    it('must calculate total for multiple items', () => {
      order.value = createOrder([
        createItemTime(1, 2), // 100 * 2 = 200
        createItemTime(2, 3) // 50 * 3 = 150
      ])

      const { orderTotalComputed } = useOrderTotalComputed(order, items)

      expect(orderTotalComputed.value).toBe(350)
    })

    it('must ignore items with item = 0', () => {
      order.value = createOrder([
        createItemTime(1, 2), // 100 * 2 = 200
        createItemTime(0, 10), // ignored
        createItemTime(2, 1) // 50 * 1 = 50
      ])

      const { orderTotalComputed } = useOrderTotalComputed(order, items)

      expect(orderTotalComputed.value).toBe(250)
    })

    it('must handle decimal prices', () => {
      items.value = [createItem(1, 19.99), createItem(2, 5.5)]
      order.value = createOrder([
        createItemTime(1, 3), // 19.99 * 3 = 59.97
        createItemTime(2, 2) // 5.5 * 2 = 11.00
      ])

      const { orderTotalComputed } = useOrderTotalComputed(order, items)

      expect(orderTotalComputed.value).toBeCloseTo(70.97, 2)
    })

    it('must handle decimal times', () => {
      items.value = [createItem(1, 100)]
      order.value = createOrder([createItemTime(1, 1.5)])

      const { orderTotalComputed } = useOrderTotalComputed(order, items)

      expect(orderTotalComputed.value).toBe(150)
    })

    it('must handle items with matching codes across entries', () => {
      order.value = createOrder([createItemTime(1, 1), createItemTime(1, 2), createItemTime(1, 3)])

      const { orderTotalComputed } = useOrderTotalComputed(order, items)

      // 100 * 1 + 100 * 2 + 100 * 3 = 600
      expect(orderTotalComputed.value).toBe(600)
    })
  })

  // ============================================================
  // 3. REACTIVITY
  // ============================================================
  describe('Reactivity', () => {
    it('must react to changes in order', () => {
      order.value = createOrder([createItemTime(1, 2)])

      const { orderTotalComputed } = useOrderTotalComputed(order, items)
      expect(orderTotalComputed.value).toBe(200)

      order.value = createOrder([createItemTime(1, 3)])
      expect(orderTotalComputed.value).toBe(300)
    })

    it('must react to changes in items', () => {
      order.value = createOrder([createItemTime(1, 2)])

      const { orderTotalComputed } = useOrderTotalComputed(order, items)
      expect(orderTotalComputed.value).toBe(200)

      items.value = [createItem(1, 150)]
      expect(orderTotalComputed.value).toBe(300)
    })

    it('must react to changes in itemtime_set', () => {
      order.value = createOrder([createItemTime(1, 1)])

      const { orderTotalComputed } = useOrderTotalComputed(order, items)
      expect(orderTotalComputed.value).toBe(100)

      order.value.itemtime_set.push(createItemTime(1, 2))
      expect(orderTotalComputed.value).toBe(300)
    })
  })

  // ============================================================
  // 4. EDGE CASES
  // ============================================================
  describe('Edge cases', () => {
    it('must ignore items that are not found in items list', () => {
      order.value = createOrder([
        createItemTime(1, 2), // 100 * 2 = 200
        createItemTime(999, 5), // not found, ignored
        createItemTime(2, 1) // 50 * 1 = 50
      ])

      const { orderTotalComputed } = useOrderTotalComputed(order, items)

      expect(orderTotalComputed.value).toBe(250)
    })

    it('must return 0 when no items are found', () => {
      order.value = createOrder([createItemTime(999, 5), createItemTime(888, 10)])

      const { orderTotalComputed } = useOrderTotalComputed(order, items)

      expect(orderTotalComputed.value).toBe(0)
    })

    it('must handle large quantities', () => {
      items.value = [createItem(1, 100)]
      order.value = createOrder([createItemTime(1, 1000)])

      const { orderTotalComputed } = useOrderTotalComputed(order, items)

      expect(orderTotalComputed.value).toBe(100000)
    })

    it('must handle zero times', () => {
      items.value = [createItem(1, 100)]
      order.value = createOrder([createItemTime(1, 0)])

      const { orderTotalComputed } = useOrderTotalComputed(order, items)

      expect(orderTotalComputed.value).toBe(0)
    })
  })
})

// ============================================================
// useOrderPaginate
// ============================================================
describe('useOrderPaginate', () => {
  // Helper to build order-like object for pagination
  const createPaginateInput = (itemCount: number) => ({
    id: 1,
    folio: 'ORD-001',
    itemtimeorder_set: Array.from({ length: itemCount }, (_, i) => ({
      id: i + 1,
      item: i + 1,
      times: 1
    })) as ItemTimeOrder[]
  })

  // ============================================================
  // 1. SINGLE PAGE
  // ============================================================
  describe('Single page', () => {
    it('must return a single page when items fit', () => {
      const { paginate } = useOrderPaginate()
      const order = createPaginateInput(5)

      const pages = paginate(order, 10)

      expect(pages).toHaveLength(1)
      expect(pages[0].itemtimeorder_set).toHaveLength(5)
    })

    it('must preserve other order properties in the page', () => {
      const { paginate } = useOrderPaginate()
      const order = createPaginateInput(3)

      const pages = paginate(order, 10)

      expect(pages[0].id).toBe(1)
      expect(pages[0].folio).toBe('ORD-001')
      expect(pages[0].itemtimeorder_set).toHaveLength(3)
    })
  })

  // ============================================================
  // 2. MULTIPLE PAGES
  // ============================================================
  describe('Multiple pages', () => {
    it('must return multiple pages when items exceed page size', () => {
      const { paginate } = useOrderPaginate()
      const order = createPaginateInput(25)

      const pages = paginate(order, 10)

      expect(pages).toHaveLength(3)
      expect(pages[0].itemtimeorder_set).toHaveLength(10)
      expect(pages[1].itemtimeorder_set).toHaveLength(10)
      expect(pages[2].itemtimeorder_set).toHaveLength(5)
    })

    it('must return exact number of pages when items divide evenly', () => {
      const { paginate } = useOrderPaginate()
      const order = createPaginateInput(20)

      const pages = paginate(order, 10)

      expect(pages).toHaveLength(2)
      expect(pages[0].itemtimeorder_set).toHaveLength(10)
      expect(pages[1].itemtimeorder_set).toHaveLength(10)
    })

    it('must return correct items per page', () => {
      const { paginate } = useOrderPaginate()
      const order = createPaginateInput(5)

      const pages = paginate(order, 2)

      expect(pages).toHaveLength(3)
      expect(pages[0].itemtimeorder_set[0].id).toBe(1)
      expect(pages[1].itemtimeorder_set[0].id).toBe(3)
      expect(pages[2].itemtimeorder_set[0].id).toBe(5)
    })

    it('must not duplicate items across pages', () => {
      const { paginate } = useOrderPaginate()
      const order = createPaginateInput(10)

      const pages = paginate(order, 3)
      const allIds = pages.flatMap((p) => p.itemtimeorder_set.map((item) => item.id))

      expect(allIds).toHaveLength(10)
      expect(new Set(allIds).size).toBe(10)
    })
  })

  // ============================================================
  // 3. EDGE CASES
  // ============================================================
  describe('Edge cases', () => {
    it('must return empty array when there are no items', () => {
      const { paginate } = useOrderPaginate()
      const order = createPaginateInput(0)

      const pages = paginate(order, 10)

      expect(pages).toHaveLength(0)
    })

    it('must handle exactly one item per page', () => {
      const { paginate } = useOrderPaginate()
      const order = createPaginateInput(3)

      const pages = paginate(order, 1)

      expect(pages).toHaveLength(3)
      pages.forEach((page) => {
        expect(page.itemtimeorder_set).toHaveLength(1)
      })
    })

    it('must handle page size larger than total items', () => {
      const { paginate } = useOrderPaginate()
      const order = createPaginateInput(3)

      const pages = paginate(order, 100)

      expect(pages).toHaveLength(1)
      expect(pages[0].itemtimeorder_set).toHaveLength(3)
    })

    it('must handle a single item', () => {
      const { paginate } = useOrderPaginate()
      const order = createPaginateInput(1)

      const pages = paginate(order, 10)

      expect(pages).toHaveLength(1)
      expect(pages[0].itemtimeorder_set).toHaveLength(1)
    })
  })

  // ============================================================
  // 4. PROPERTY PRESERVATION
  // ============================================================
  describe('Property preservation', () => {
    it('must preserve custom properties in every page', () => {
      const { paginate } = useOrderPaginate()
      const order = {
        id: 42,
        folio: 'ORD-CUSTOM',
        customer_name: 'Test Customer',
        itemtimeorder_set: Array.from({ length: 7 }, (_, i) => ({
          id: i + 1,
          item: i + 1,
          times: 1
        })) as ItemTimeOrder[]
      }

      const pages = paginate(order, 3)

      expect(pages).toHaveLength(3)
      pages.forEach((page) => {
        expect(page.id).toBe(42)
        expect(page.folio).toBe('ORD-CUSTOM')
        expect(page.customer_name).toBe('Test Customer')
      })
    })

    it('must not include original itemtimeorder_set in pages', () => {
      const { paginate } = useOrderPaginate()
      const order = createPaginateInput(5)

      const pages = paginate(order, 2)

      pages.forEach((page) => {
        expect(page.itemtimeorder_set).toBeDefined()
        expect(page.itemtimeorder_set.length).toBeLessThanOrEqual(2)
      })
    })
  })

  // ============================================================
  // 5. REAL USE CASE
  // ============================================================
  describe('Real use case: order PDF pagination', () => {
    it('must paginate an order with many items for PDF', () => {
      const { paginate } = useOrderPaginate()
      const order = {
        id: 1,
        folio: 'ORD-2024-001',
        customer_name: 'Comercio',
        itemtimeorder_set: Array.from({ length: 25 }, (_, i) => ({
          id: i + 1,
          item: { id: i + 1, name: `Item ${i + 1}`, price: 100 },
          times: 1
        })) as ItemTimeOrder[]
      }

      const pages = paginate(order, 12)

      expect(pages).toHaveLength(3) // 12, 12, 1
      expect(pages[0].itemtimeorder_set).toHaveLength(12)
      expect(pages[1].itemtimeorder_set).toHaveLength(12)
      expect(pages[2].itemtimeorder_set).toHaveLength(1)
    })

    it('must paginate an order with exactly 12 items', () => {
      const { paginate } = useOrderPaginate()
      const order = {
        id: 1,
        folio: 'ORD-2024-002',
        itemtimeorder_set: Array.from({ length: 12 }, (_, i) => ({
          id: i + 1,
          item: i + 1,
          times: 1
        })) as ItemTimeOrder[]
      }

      const pages = paginate(order, 12)

      expect(pages).toHaveLength(1)
      expect(pages[0].itemtimeorder_set).toHaveLength(12)
    })
  })
})
