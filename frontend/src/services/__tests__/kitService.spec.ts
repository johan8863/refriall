import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import MockAdapter from 'axios-mock-adapter'
import apiBase from '../baseService'
import { kitService } from '../kitService'
import type { Kit } from '@/views/kits/types'
import type { PaginatedResponse } from '@/types/shared'

describe('kitService', () => {
  let mock: MockAdapter

  const urlKit = '/stock/kits'

  const createKit = (overrides: Partial<Kit> = {}): Kit => ({
    id: 1,
    name: 'Split',
    ...overrides
  })

  const createPaginatedResponse = (
    results: Kit[] = [],
    count: number = results.length
  ): PaginatedResponse<Kit> => ({
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
  // 1. listKit
  // ============================================================
  describe('listKit', () => {
    it('must call the correct URL', async () => {
      mock.onGet(`${urlKit}/list-pagination/`).reply(200, createPaginatedResponse())

      await kitService.listKit()

      expect(mock.history.get).toHaveLength(1)
      expect(mock.history.get[0].url).toBe(`${urlKit}/list-pagination/`)
    })

    it('must send page and search as query params', async () => {
      mock.onGet(`${urlKit}/list-pagination/`).reply(200, createPaginatedResponse())

      await kitService.listKit(2, 'split')

      expect(mock.history.get[0].params).toEqual({ page: 2, search: 'split' })
    })

    it('must omit page when page is 0', async () => {
      mock.onGet(`${urlKit}/list-pagination/`).reply(200, createPaginatedResponse())

      await kitService.listKit(0, '')

      expect(mock.history.get[0].params).toEqual({})
    })

    it('must omit search when search is empty', async () => {
      mock.onGet(`${urlKit}/list-pagination/`).reply(200, createPaginatedResponse())

      await kitService.listKit(1, '')

      expect(mock.history.get[0].params).toEqual({ page: 1 })
    })

    it('must return the paginated response', async () => {
      const kit = createKit({ id: 1, name: 'Split' })
      const response = createPaginatedResponse([kit], 1)

      mock.onGet(`${urlKit}/list-pagination/`).reply(200, response)

      const result = await kitService.listKit(1, '')

      expect(result.data).toEqual(response)
      expect(result.data.results).toHaveLength(1)
      expect(result.data.results[0].name).toBe('Split')
    })

    it('must propagate 500 errors', async () => {
      mock.onGet(`${urlKit}/list-pagination/`).reply(500)

      await expect(kitService.listKit(1, '')).rejects.toBeDefined()
    })

    it('must propagate 401 errors', async () => {
      mock.onGet(`${urlKit}/list-pagination/`).reply(401)

      await expect(kitService.listKit(1, '')).rejects.toBeDefined()
    })
  })

  // ============================================================
  // 2. searchKits
  // ============================================================
  describe('searchKits', () => {
    it('must call the correct URL', async () => {
      mock.onGet(`${urlKit}/list-pagination/`).reply(200, createPaginatedResponse())

      await kitService.searchKits('split')

      expect(mock.history.get[0].url).toBe(`${urlKit}/list-pagination/`)
    })

    it('must send search and page as query params', async () => {
      mock.onGet(`${urlKit}/list-pagination/`).reply(200, createPaginatedResponse())

      await kitService.searchKits('split', 3)

      expect(mock.history.get[0].params).toEqual({ search: 'split', page: 3 })
    })

    it('must omit page when page is 1', async () => {
      mock.onGet(`${urlKit}/list-pagination/`).reply(200, createPaginatedResponse())

      await kitService.searchKits('split', 1)

      expect(mock.history.get[0].params).toEqual({ search: 'split' })
    })

    it('must return the paginated response', async () => {
      const kit = createKit({ id: 2, name: 'Split Inverter' })
      mock.onGet(`${urlKit}/list-pagination/`).reply(200, createPaginatedResponse([kit], 1))

      const result = await kitService.searchKits('split')

      expect(result.data.results[0].name).toBe('Split Inverter')
    })
  })

  // ============================================================
  // 3. getAllKits
  // ============================================================
  describe('getAllKits', () => {
    it('must call the correct URL without params', async () => {
      mock.onGet(`${urlKit}/`).reply(200, [])

      await kitService.getAllKits()

      expect(mock.history.get[0].url).toBe(`${urlKit}/`)
      expect(mock.history.get[0].params).toBeUndefined()
    })

    it('must return the array of kits', async () => {
      const kits = [createKit({ id: 1, name: 'Split' }), createKit({ id: 2, name: 'Oven' })]
      mock.onGet(`${urlKit}/`).reply(200, kits)

      const result = await kitService.getAllKits()

      expect(result.data).toEqual(kits)
      expect(result.data).toHaveLength(2)
    })
  })

  // ============================================================
  // 4. detailKit
  // ============================================================
  describe('detailKit', () => {
    it('must call the correct URL with id', async () => {
      mock.onGet(`${urlKit}/1/`).reply(200, createKit({ id: 1 }))

      await kitService.detailKit(1)

      expect(mock.history.get[0].url).toBe(`${urlKit}/1/`)
    })

    it('must return the kit', async () => {
      const kit = createKit({ id: 42, name: 'Split' })
      mock.onGet(`${urlKit}/42/`).reply(200, kit)

      const result = await kitService.detailKit(42)

      expect(result.data).toEqual(kit)
      expect(result.data.id).toBe(42)
      expect(result.data.name).toBe('Split')
    })

    it('must propagate 404 errors', async () => {
      mock.onGet(`${urlKit}/999/`).reply(404, { detail: 'Not found' })

      await expect(kitService.detailKit(999)).rejects.toBeDefined()
    })
  })

  // ============================================================
  // 5. postKit
  // ============================================================
  describe('postKit', () => {
    it('must call the correct URL with POST', async () => {
      const newKit = { name: 'Split' }
      mock.onPost(`${urlKit}/`).reply(201, createKit({ id: 1, name: 'Split' }))

      await kitService.postKit(newKit)

      expect(mock.history.post).toHaveLength(1)
      expect(mock.history.post[0].url).toBe(`${urlKit}/`)
    })

    it('must send the body as JSON', async () => {
      const newKit = { name: 'Split' }
      mock.onPost(`${urlKit}/`).reply(201, createKit({ id: 1, name: 'Split' }))

      await kitService.postKit(newKit)

      expect(JSON.parse(mock.history.post[0].data)).toEqual(newKit)
    })

    it('must return the created kit', async () => {
      const createdKit = createKit({ id: 5, name: 'New Kit' })
      mock.onPost(`${urlKit}/`).reply(201, createdKit)

      const result = await kitService.postKit({ name: 'New Kit' })

      expect(result.data).toEqual(createdKit)
      expect(result.data.id).toBe(5)
    })

    it('must propagate 400 validation errors', async () => {
      mock.onPost(`${urlKit}/`).reply(400, { name: ['El nombre es requerido'] })

      await expect(kitService.postKit({ name: '' })).rejects.toBeDefined()
    })
  })

  // ============================================================
  // 6. putKit
  // ============================================================
  describe('putKit', () => {
    it('must call the correct URL with PUT', async () => {
      const kit = createKit({ id: 1, name: 'Updated' })
      mock.onPut(`${urlKit}/1/`).reply(200, kit)

      await kitService.putKit(kit)

      expect(mock.history.put).toHaveLength(1)
      expect(mock.history.put[0].url).toBe(`${urlKit}/1/`)
    })

    it('must send the kit as JSON body', async () => {
      const kit = createKit({ id: 1, name: 'Updated' })
      mock.onPut(`${urlKit}/1/`).reply(200, kit)

      await kitService.putKit(kit)

      expect(JSON.parse(mock.history.put[0].data)).toEqual(kit)
    })

    it('must return the updated kit', async () => {
      const updatedKit = createKit({ id: 1, name: 'Updated' })
      mock.onPut(`${urlKit}/1/`).reply(200, updatedKit)

      const result = await kitService.putKit(updatedKit)

      expect(result.data.name).toBe('Updated')
    })

    it('must propagate 404 errors', async () => {
      const kit = createKit({ id: 999 })
      mock.onPut(`${urlKit}/999/`).reply(404)

      await expect(kitService.putKit(kit)).rejects.toBeDefined()
    })
  })

  // ============================================================
  // 7. deleteKit
  // ============================================================
  describe('deleteKit', () => {
    it('must call the correct URL with DELETE', async () => {
      mock.onDelete(`${urlKit}/1/`).reply(204)

      await kitService.deleteKit(1)

      expect(mock.history.delete).toHaveLength(1)
      expect(mock.history.delete[0].url).toBe(`${urlKit}/1/`)
    })

    it('must not send a body', async () => {
      mock.onDelete(`${urlKit}/1/`).reply(204)

      await kitService.deleteKit(1)

      expect(mock.history.delete[0].data).toBeUndefined()
    })

    it('must propagate 400 errors when the kit has associated data', async () => {
      mock.onDelete(`${urlKit}/1/`).reply(400, { message: 'Kit with associated orders' })

      await expect(kitService.deleteKit(1)).rejects.toBeDefined()
    })

    it('must propagate 404 errors', async () => {
      mock.onDelete(`${urlKit}/999/`).reply(404)

      await expect(kitService.deleteKit(999)).rejects.toBeDefined()
    })
  })

  // ============================================================
  // 8. INTEGRATION
  // ============================================================
  describe('Integration', () => {
    it('must complete a full CRUD cycle', async () => {
      // Create
      mock.onPost(`${urlKit}/`).reply(201, createKit({ id: 1, name: 'New Kit' }))

      const created = await kitService.postKit({ name: 'New Kit' })
      expect(created.data.id).toBe(1)

      // Read
      mock.onGet(`${urlKit}/1/`).reply(200, createKit({ id: 1, name: 'New Kit' }))

      const read = await kitService.detailKit(1)
      expect(read.data.name).toBe('New Kit')

      // Update
      mock.onPut(`${urlKit}/1/`).reply(200, createKit({ id: 1, name: 'Updated Kit' }))

      const updated = await kitService.putKit(createKit({ id: 1, name: 'Updated Kit' }))
      expect(updated.data.name).toBe('Updated Kit')

      // Delete
      mock.onDelete(`${urlKit}/1/`).reply(204)

      await expect(kitService.deleteKit(1)).resolves.toBeDefined()
    })
  })
})
