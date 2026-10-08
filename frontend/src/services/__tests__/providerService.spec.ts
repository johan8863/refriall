import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import MockAdapter from 'axios-mock-adapter'
import apiBase from '../baseService'
import { providerService } from '../providerService'
import type {
  Provider,
  ProviderChangePassword,
  ProviderChangeSelfPassword
} from '@/views/providers/types'
import type { PaginatedResponse } from '@/types/shared'

describe('providerService', () => {
  let mock: MockAdapter

  const urlProviders = '/hr/providers'

  const createProvider = (overrides: Partial<Provider> = {}): Provider => ({
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
    personal_id: '71040201984',
    ...overrides
  })

  const createPaginatedResponse = (
    results: Provider[] = [],
    count: number = results.length
  ): PaginatedResponse<Provider> => ({
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
  // 1. listProvider
  // ============================================================
  describe('listProvider', () => {
    it('must call the correct URL', async () => {
      mock.onGet(`${urlProviders}/list-pagination/`).reply(200, createPaginatedResponse())

      await providerService.listProvider()

      expect(mock.history.get[0].url).toBe(`${urlProviders}/list-pagination/`)
    })

    it('must send page and search as query params', async () => {
      mock.onGet(`${urlProviders}/list-pagination/`).reply(200, createPaginatedResponse())

      await providerService.listProvider(2, 'pedro')

      expect(mock.history.get[0].params).toEqual({ page: 2, search: 'pedro' })
    })

    it('must send empty params when both are null', async () => {
      mock.onGet(`${urlProviders}/list-pagination/`).reply(200, createPaginatedResponse())

      await providerService.listProvider(null, null)

      expect(mock.history.get[0].params).toEqual({})
    })

    it('must return the paginated response', async () => {
      const provider = createProvider({ id: 1, first_name: 'Pedro' })
      mock
        .onGet(`${urlProviders}/list-pagination/`)
        .reply(200, createPaginatedResponse([provider], 1))

      const result = await providerService.listProvider(1, '')

      expect(result.data.results[0].first_name).toBe('Pedro')
    })
  })

  // ============================================================
  // 2. searchProviders
  // ============================================================
  describe('searchProviders', () => {
    it('must call the correct URL', async () => {
      mock.onGet(`${urlProviders}/list-pagination/`).reply(200, createPaginatedResponse())

      await providerService.searchProviders('pedro')

      expect(mock.history.get[0].url).toBe(`${urlProviders}/list-pagination/`)
    })

    it('must send search and page as query params', async () => {
      mock.onGet(`${urlProviders}/list-pagination/`).reply(200, createPaginatedResponse())

      await providerService.searchProviders('pedro', 3)

      expect(mock.history.get[0].params).toEqual({ search: 'pedro', page: 3 })
    })

    it('must omit page when page is 1', async () => {
      mock.onGet(`${urlProviders}/list-pagination/`).reply(200, createPaginatedResponse())

      await providerService.searchProviders('pedro', 1)

      expect(mock.history.get[0].params).toEqual({ search: 'pedro' })
    })
  })

  // ============================================================
  // 3. listAllProviders
  // ============================================================
  describe('listAllProviders', () => {
    it('must call the correct URL without params', async () => {
      mock.onGet(`${urlProviders}/`).reply(200, [])

      await providerService.listAllProviders()

      expect(mock.history.get[0].url).toBe(`${urlProviders}/`)
    })

    it('must return the providers array', async () => {
      const providers = [
        createProvider({ id: 1, username: 'p1' }),
        createProvider({ id: 2, username: 'p2' })
      ]
      mock.onGet(`${urlProviders}/`).reply(200, providers)

      const result = await providerService.listAllProviders()

      expect(result.data).toHaveLength(2)
    })
  })

  // ============================================================
  // 4. listProviderCurrencyOrderNoBill
  // ============================================================
  describe('listProviderCurrencyOrderNoBill', () => {
    it('must call the correct URL with currency in path', async () => {
      mock.onGet(`${urlProviders}/get-provider-order-currency-no-bill/1/`).reply(200, [])

      await providerService.listProviderCurrencyOrderNoBill(1)

      expect(mock.history.get[0].url).toBe(`${urlProviders}/get-provider-order-currency-no-bill/1/`)
    })

    it('must return the providers array', async () => {
      const providers = [createProvider({ id: 1 })]
      mock.onGet(`${urlProviders}/get-provider-order-currency-no-bill/1/`).reply(200, providers)

      const result = await providerService.listProviderCurrencyOrderNoBill(1)

      expect(result.data).toEqual(providers)
    })
  })

  // ============================================================
  // 5. detailProvider
  // ============================================================
  describe('detailProvider', () => {
    it('must call the correct URL with id', async () => {
      mock.onGet(`${urlProviders}/1/`).reply(200, createProvider({ id: 1 }))

      await providerService.detailProvider(1)

      expect(mock.history.get[0].url).toBe(`${urlProviders}/1/`)
    })

    it('must return the provider', async () => {
      const provider = createProvider({ id: 42, first_name: 'Pedro' })
      mock.onGet(`${urlProviders}/42/`).reply(200, provider)

      const result = await providerService.detailProvider(42)

      expect(result.data.id).toBe(42)
      expect(result.data.first_name).toBe('Pedro')
    })

    it('must propagate 404 errors', async () => {
      mock.onGet(`${urlProviders}/999/`).reply(404)

      await expect(providerService.detailProvider(999)).rejects.toBeDefined()
    })
  })

  // ============================================================
  // 6. postProvider
  // ============================================================
  describe('postProvider', () => {
    it('must call the correct URL with POST', async () => {
      const newProvider = createProvider()
      mock.onPost(`${urlProviders}/`).reply(201, newProvider)

      await providerService.postProvider(newProvider)

      expect(mock.history.post).toHaveLength(1)
      expect(mock.history.post[0].url).toBe(`${urlProviders}/`)
    })

    it('must send the body as JSON', async () => {
      const newProvider = createProvider()
      mock.onPost(`${urlProviders}/`).reply(201, newProvider)

      await providerService.postProvider(newProvider)

      expect(JSON.parse(mock.history.post[0].data)).toEqual(newProvider)
    })

    it('must return the created provider', async () => {
      const createdProvider = createProvider({ id: 5, username: 'newprovider' })
      mock.onPost(`${urlProviders}/`).reply(201, createdProvider)

      const result = await providerService.postProvider(createdProvider)

      expect(result.data.id).toBe(5)
    })

    it('must propagate 400 validation errors', async () => {
      mock.onPost(`${urlProviders}/`).reply(400, { username: ['Ya existe'] })

      await expect(providerService.postProvider(createProvider())).rejects.toBeDefined()
    })
  })

  // ============================================================
  // 7. putProvider
  // ============================================================
  describe('putProvider', () => {
    it('must call the correct URL with PUT', async () => {
      const provider = createProvider({ id: 1, first_name: 'Updated' })
      mock.onPut(`${urlProviders}/1/`).reply(200, provider)

      await providerService.putProvider(provider)

      expect(mock.history.put).toHaveLength(1)
      expect(mock.history.put[0].url).toBe(`${urlProviders}/1/`)
    })

    it('must return the updated provider', async () => {
      const updatedProvider = createProvider({ id: 1, first_name: 'Updated' })
      mock.onPut(`${urlProviders}/1/`).reply(200, updatedProvider)

      const result = await providerService.putProvider(updatedProvider)

      expect(result.data.first_name).toBe('Updated')
    })
  })

  // ============================================================
  // 8. deleteProvider
  // ============================================================
  describe('deleteProvider', () => {
    it('must call the correct URL with DELETE', async () => {
      mock.onDelete(`${urlProviders}/1/`).reply(204)

      await providerService.deleteProvider(1)

      expect(mock.history.delete).toHaveLength(1)
      expect(mock.history.delete[0].url).toBe(`${urlProviders}/1/`)
    })

    it('must propagate 400 errors when the provider has associated data', async () => {
      mock.onDelete(`${urlProviders}/1/`).reply(400)

      await expect(providerService.deleteProvider(1)).rejects.toBeDefined()
    })
  })

  // ============================================================
  // 9. changeSelfPassword
  // ============================================================
  describe('changeSelfPassword', () => {
    it('must call the correct URL with POST', async () => {
      const credentials: ProviderChangeSelfPassword = {
        current_password: 'old',
        new_password: 'new',
        confirm_new_password: 'new'
      }
      mock.onPost(`${urlProviders}/change-password/`).reply(200, { detail: 'OK' })

      await providerService.changeSelfPassword(credentials)

      expect(mock.history.post).toHaveLength(1)
      expect(mock.history.post[0].url).toBe(`${urlProviders}/change-password/`)
    })

    it('must send credentials as JSON body', async () => {
      const credentials: ProviderChangeSelfPassword = {
        current_password: 'old',
        new_password: 'new',
        confirm_new_password: 'new'
      }
      mock.onPost(`${urlProviders}/change-password/`).reply(200, { detail: 'OK' })

      await providerService.changeSelfPassword(credentials)

      expect(JSON.parse(mock.history.post[0].data)).toEqual(credentials)
    })

    it('must return the detail message', async () => {
      const credentials: ProviderChangeSelfPassword = {
        current_password: 'old',
        new_password: 'new',
        confirm_new_password: 'new'
      }
      mock
        .onPost(`${urlProviders}/change-password/`)
        .reply(200, { detail: 'Contraseña actualizada' })

      const result = await providerService.changeSelfPassword(credentials)

      expect(result.data.detail).toBe('Contraseña actualizada')
    })

    it('must propagate 400 errors for wrong current password', async () => {
      mock.onPost(`${urlProviders}/change-password/`).reply(400, {
        current_password: ['Clave incorrecta']
      })

      await expect(
        providerService.changeSelfPassword({
          current_password: 'wrong',
          new_password: 'new',
          confirm_new_password: 'new'
        })
      ).rejects.toBeDefined()
    })
  })

  // ============================================================
  // 10. changePassword (admin)
  // ============================================================
  describe('changePassword', () => {
    it('must call the correct URL with id and POST', async () => {
      const credentials: ProviderChangePassword = {
        new_password: 'new',
        confirm_new_password: 'new'
      }
      mock.onPost(`${urlProviders}/1/admin-reset-password/`).reply(200, { detail: 'OK' })

      await providerService.changePassword(1, credentials)

      expect(mock.history.post).toHaveLength(1)
      expect(mock.history.post[0].url).toBe(`${urlProviders}/1/admin-reset-password/`)
    })

    it('must send credentials as JSON body', async () => {
      const credentials: ProviderChangePassword = {
        new_password: 'new',
        confirm_new_password: 'new'
      }
      mock.onPost(`${urlProviders}/1/admin-reset-password/`).reply(200, { detail: 'OK' })

      await providerService.changePassword(1, credentials)

      expect(JSON.parse(mock.history.post[0].data)).toEqual(credentials)
    })

    it('must return the detail message', async () => {
      const credentials: ProviderChangePassword = {
        new_password: 'new',
        confirm_new_password: 'new'
      }
      mock
        .onPost(`${urlProviders}/1/admin-reset-password/`)
        .reply(200, { detail: 'Clave cambiada con éxito' })

      const result = await providerService.changePassword(1, credentials)

      expect(result.data.detail).toContain('cambiada')
    })

    it('must propagate 403 errors when the user is not admin', async () => {
      mock.onPost(`${urlProviders}/1/admin-reset-password/`).reply(403)

      await expect(
        providerService.changePassword(1, {
          new_password: 'new',
          confirm_new_password: 'new'
        })
      ).rejects.toBeDefined()
    })
  })

  // ============================================================
  // 11. INTEGRATION
  // ============================================================
  describe('Integration', () => {
    it('must complete a full CRUD cycle', async () => {
      // Create
      mock.onPost(`${urlProviders}/`).reply(201, createProvider({ id: 1 }))

      const created = await providerService.postProvider(createProvider())
      expect(created.data.id).toBe(1)

      // Read
      mock.onGet(`${urlProviders}/1/`).reply(200, createProvider({ id: 1 }))

      const read = await providerService.detailProvider(1)
      expect(read.data.id).toBe(1)

      // Update
      mock.onPut(`${urlProviders}/1/`).reply(200, createProvider({ id: 1, first_name: 'Updated' }))

      const updated = await providerService.putProvider(
        createProvider({ id: 1, first_name: 'Updated' })
      )
      expect(updated.data.first_name).toBe('Updated')

      // Delete
      mock.onDelete(`${urlProviders}/1/`).reply(204)

      await expect(providerService.deleteProvider(1)).resolves.toBeDefined()
    })
  })
})
