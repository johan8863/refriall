import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import MockAdapter from 'axios-mock-adapter'
import apiBase from '../baseService'
import { itemService } from '../itemService'
import type { Item, ItemType, Measurement } from '@/views/items/types'
import type { PaginatedResponse } from '@/types/shared'

describe('itemService', () => {
  let mock: MockAdapter

  const urlItems = '/stock/items'

  const createItem = (overrides: Partial<Item> = {}): Item => ({
    id: 1,
    code: 'AG-0001',
    name: 'Silver Weld',
    item_type: 'prod' as ItemType,
    measurement: 'u' as Measurement,
    price: 36.88,
    get_item_type: 'Producto',
    get_measurement: 'Uno',
    ...overrides
  })

  const createPaginatedResponse = (
    results: Item[] = [],
    count: number = results.length
  ): PaginatedResponse<Item> => ({
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
  // 1. listItem
  // ============================================================
  describe('listItem', () => {
    it('must call the correct URL', async () => {
      mock.onGet(`${urlItems}/list-pagination/`).reply(200, createPaginatedResponse())

      await itemService.listItem()

      expect(mock.history.get[0].url).toBe(`${urlItems}/list-pagination/`)
    })

    it('must send page and search as query params', async () => {
      mock.onGet(`${urlItems}/list-pagination/`).reply(200, createPaginatedResponse())

      await itemService.listItem(2, 'weld')

      expect(mock.history.get[0].params).toEqual({ page: 2, search: 'weld' })
    })

    it('must omit page when page is null', async () => {
      mock.onGet(`${urlItems}/list-pagination/`).reply(200, createPaginatedResponse())

      await itemService.listItem(null, 'weld')

      expect(mock.history.get[0].params).toEqual({ search: 'weld' })
    })

    it('must return the paginated response', async () => {
      const item = createItem({ id: 1, code: 'AG-0001', name: 'Silver Weld' })
      mock.onGet(`${urlItems}/list-pagination/`).reply(200, createPaginatedResponse([item], 1))

      const result = await itemService.listItem(1, '')

      expect(result.data.results[0].code).toBe('AG-0001')
    })

    it('must propagate 500 errors', async () => {
      mock.onGet(`${urlItems}/list-pagination/`).reply(500)

      await expect(itemService.listItem()).rejects.toBeDefined()
    })
  })

  // ============================================================
  // 2. searchItems
  // ============================================================
  describe('searchItems', () => {
    it('must call the correct URL', async () => {
      mock.onGet(`${urlItems}/list-pagination/`).reply(200, createPaginatedResponse())

      await itemService.searchItems('weld')

      expect(mock.history.get[0].url).toBe(`${urlItems}/list-pagination/`)
    })

    it('must send search and page as query params', async () => {
      mock.onGet(`${urlItems}/list-pagination/`).reply(200, createPaginatedResponse())

      await itemService.searchItems('weld', 3)

      expect(mock.history.get[0].params).toEqual({ search: 'weld', page: 3 })
    })

    it('must omit page when page is 1', async () => {
      mock.onGet(`${urlItems}/list-pagination/`).reply(200, createPaginatedResponse())

      await itemService.searchItems('weld', 1)

      expect(mock.history.get[0].params).toEqual({ search: 'weld' })
    })

    it('must return the paginated response', async () => {
      const item = createItem({ id: 1, name: 'Silver Weld' })
      mock.onGet(`${urlItems}/list-pagination/`).reply(200, createPaginatedResponse([item], 1))

      const result = await itemService.searchItems('weld')

      expect(result.data.results[0].name).toBe('Silver Weld')
    })
  })

  // ============================================================
  // 3. listItemsForSelect
  // ============================================================
  describe('listItemsForSelect', () => {
    it('must call the correct URL without params', async () => {
      mock.onGet(urlItems).reply(200, [])

      await itemService.listItemsForSelect()

      expect(mock.history.get[0].url).toBe(urlItems)
    })

    it('must send search param when provided', async () => {
      mock.onGet(urlItems).reply(200, [])

      await itemService.listItemsForSelect('weld')

      expect(mock.history.get[0].params).toEqual({ search: 'weld' })
    })

    it('must send empty params when search is null', async () => {
      mock.onGet(urlItems).reply(200, [])

      await itemService.listItemsForSelect(null)

      expect(mock.history.get[0].params).toEqual({})
    })

    it('must return the items array', async () => {
      const items = [
        createItem({ id: 1, name: 'Silver Weld' }),
        createItem({ id: 2, name: 'Refrigeration Oil' })
      ]
      mock.onGet(urlItems).reply(200, items)

      const result = await itemService.listItemsForSelect()

      expect(result.data).toEqual(items)
      expect(result.data).toHaveLength(2)
    })
  })

  // ============================================================
  // 4. detailItem
  // ============================================================
  describe('detailItem', () => {
    it('must call the correct URL with id', async () => {
      mock.onGet(`${urlItems}/1/`).reply(200, createItem({ id: 1 }))

      await itemService.detailItem(1)

      expect(mock.history.get[0].url).toBe(`${urlItems}/1/`)
    })

    it('must return the item', async () => {
      const item = createItem({ id: 42, code: 'RO-0007', name: 'Refrigeration Oil' })
      mock.onGet(`${urlItems}/42/`).reply(200, item)

      const result = await itemService.detailItem(42)

      expect(result.data).toEqual(item)
      expect(result.data.id).toBe(42)
      expect(result.data.code).toBe('RO-0007')
    })

    it('must propagate 404 errors', async () => {
      mock.onGet(`${urlItems}/999/`).reply(404)

      await expect(itemService.detailItem(999)).rejects.toBeDefined()
    })
  })

  // ============================================================
  // 5. postItem
  // ============================================================
  describe('postItem', () => {
    it('must call the correct URL with POST', async () => {
      const newItem = {
        code: 'AG-0001',
        name: 'Silver Weld',
        item_type: 'prod' as ItemType,
        measurement: 'u' as Measurement,
        price: 36.88
      }
      mock.onPost(`${urlItems}/`).reply(201, createItem({ id: 1, ...newItem }))

      await itemService.postItem(newItem)

      expect(mock.history.post).toHaveLength(1)
      expect(mock.history.post[0].url).toBe(`${urlItems}/`)
    })

    it('must send the body as JSON', async () => {
      const newItem = {
        code: 'AG-0001',
        name: 'Silver Weld',
        item_type: 'prod' as ItemType,
        measurement: 'u' as Measurement,
        price: 36.88
      }
      mock.onPost(`${urlItems}/`).reply(201, createItem({ id: 1, ...newItem }))

      await itemService.postItem(newItem)

      expect(JSON.parse(mock.history.post[0].data)).toEqual(newItem)
    })

    it('must return the created item', async () => {
      const createdItem = createItem({ id: 5, code: 'RO-0007', name: 'Refrigeration Oil' })
      mock.onPost(`${urlItems}/`).reply(201, createdItem)

      const result = await itemService.postItem({
        code: 'RO-0007',
        name: 'Refrigeration Oil',
        item_type: 'prod' as ItemType,
        measurement: 'lts' as Measurement,
        price: 61.63
      })

      expect(result.data).toEqual(createdItem)
      expect(result.data.id).toBe(5)
    })

    it('must propagate 400 validation errors', async () => {
      mock.onPost(`${urlItems}/`).reply(400, { code: ['El código ya existe'] })

      await expect(
        itemService.postItem({
          code: 'AG-0001',
          name: 'Silver Weld',
          item_type: 'prod' as ItemType,
          measurement: 'u' as Measurement,
          price: 36.88
        })
      ).rejects.toBeDefined()
    })
  })

  // ============================================================
  // 6. putItem
  // ============================================================
  describe('putItem', () => {
    it('must call the correct URL with PUT', async () => {
      const item = createItem({ id: 1, name: 'Updated Item' })
      mock.onPut(`${urlItems}/1/`).reply(200, item)

      await itemService.putItem(item)

      expect(mock.history.put).toHaveLength(1)
      expect(mock.history.put[0].url).toBe(`${urlItems}/1/`)
    })

    it('must send the item as JSON body', async () => {
      const item = createItem({ id: 1, name: 'Updated Item' })
      mock.onPut(`${urlItems}/1/`).reply(200, item)

      await itemService.putItem(item)

      expect(JSON.parse(mock.history.put[0].data)).toEqual(item)
    })

    it('must return the updated item', async () => {
      const updatedItem = createItem({ id: 1, name: 'Updated Item' })
      mock.onPut(`${urlItems}/1/`).reply(200, updatedItem)

      const result = await itemService.putItem(updatedItem)

      expect(result.data.name).toBe('Updated Item')
    })

    it('must propagate 404 errors', async () => {
      const item = createItem({ id: 999 })
      mock.onPut(`${urlItems}/999/`).reply(404)

      await expect(itemService.putItem(item)).rejects.toBeDefined()
    })
  })

  // ============================================================
  // 7. deleteItem
  // ============================================================
  describe('deleteItem', () => {
    it('must call the correct URL with DELETE', async () => {
      mock.onDelete(`${urlItems}/1/`).reply(204)

      await itemService.deleteItem(1)

      expect(mock.history.delete).toHaveLength(1)
      expect(mock.history.delete[0].url).toBe(`${urlItems}/1/`)
    })

    it('must propagate 400 errors when the item has associated data', async () => {
      mock.onDelete(`${urlItems}/1/`).reply(400, { message: 'Item with associated orders' })

      await expect(itemService.deleteItem(1)).rejects.toBeDefined()
    })

    it('must propagate 404 errors', async () => {
      mock.onDelete(`${urlItems}/999/`).reply(404)

      await expect(itemService.deleteItem(999)).rejects.toBeDefined()
    })
  })

  // ============================================================
  // 8. INTEGRATION
  // ============================================================
  describe('Integration', () => {
    it('must complete a full CRUD cycle', async () => {
      // Create
      mock.onPost(`${urlItems}/`).reply(201, createItem({ id: 1, code: 'AG-0001' }))

      const created = await itemService.postItem({
        code: 'AG-0001',
        name: 'Silver Weld',
        item_type: 'prod' as ItemType,
        measurement: 'u' as Measurement,
        price: 36.88
      })
      expect(created.data.id).toBe(1)

      // Read
      mock.onGet(`${urlItems}/1/`).reply(200, createItem({ id: 1, code: 'AG-0001' }))

      const read = await itemService.detailItem(1)
      expect(read.data.code).toBe('AG-0001')

      // Update
      mock.onPut(`${urlItems}/1/`).reply(200, createItem({ id: 1, name: 'Updated' }))

      const updated = await itemService.putItem(createItem({ id: 1, name: 'Updated' }))
      expect(updated.data.name).toBe('Updated')

      // Delete
      mock.onDelete(`${urlItems}/1/`).reply(204)

      await expect(itemService.deleteItem(1)).resolves.toBeDefined()
    })
  })
})
