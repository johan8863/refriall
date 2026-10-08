import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import MockAdapter from 'axios-mock-adapter'
import apiBase from '../baseService'
import { authAPI } from '../authAPI'
import type { LoginCredentials, TokenPairResponse } from '../authAPI'

describe('authAPI', () => {
  let mock: MockAdapter

  const urlTokenPair = '/auth/token/'
  const urlTokenRefresh = '/auth/token/refresh/'

  const createTokenPair = (overrides: Partial<TokenPairResponse> = {}): TokenPairResponse => ({
    access: 'access-token-abc123',
    refresh: 'refresh-token-xyz789',
    ...overrides
  })

  beforeEach(() => {
    mock = new MockAdapter(apiBase)
  })

  afterEach(() => {
    mock.restore()
  })

  // ============================================================
  // 1. tokenPair
  // ============================================================
  describe('tokenPair', () => {
    it('must call the correct URL with POST', async () => {
      const credentials: LoginCredentials = {
        username: 'provider1',
        password: 'pass123'
      }
      mock.onPost(urlTokenPair).reply(200, createTokenPair())

      await authAPI.tokenPair(credentials)

      expect(mock.history.post).toHaveLength(1)
      expect(mock.history.post[0].url).toBe(urlTokenPair)
    })

    it('must send credentials as JSON body', async () => {
      const credentials: LoginCredentials = {
        username: 'provider1',
        password: 'pass123'
      }
      mock.onPost(urlTokenPair).reply(200, createTokenPair())

      await authAPI.tokenPair(credentials)

      expect(JSON.parse(mock.history.post[0].data)).toEqual(credentials)
    })

    it('must return the token pair', async () => {
      const credentials: LoginCredentials = {
        username: 'provider1',
        password: 'pass123'
      }
      const expectedResponse = createTokenPair({
        access: 'access-token-xyz',
        refresh: 'refresh-token-xyz'
      })
      mock.onPost(urlTokenPair).reply(200, expectedResponse)

      const result = await authAPI.tokenPair(credentials)

      expect(result.data).toEqual(expectedResponse)
      expect(result.data.access).toBe('access-token-xyz')
      expect(result.data.refresh).toBe('refresh-token-xyz')
    })

    it('must propagate 401 errors for invalid credentials', async () => {
      const credentials: LoginCredentials = {
        username: 'wronguser',
        password: 'wrongpass'
      }
      mock.onPost(urlTokenPair).reply(401, { detail: 'Credenciales inválidas' })

      await expect(authAPI.tokenPair(credentials)).rejects.toBeDefined()
    })

    it('must propagate 400 errors for malformed credentials', async () => {
      mock.onPost(urlTokenPair).reply(400, { username: ['Este campo es requerido'] })

      await expect(authAPI.tokenPair({ username: '', password: '' })).rejects.toBeDefined()
    })
  })

  // ============================================================
  // 2. tokenRefresh
  // ============================================================
  describe('tokenRefresh', () => {
    it('must call the correct URL with POST', async () => {
      mock.onPost(urlTokenRefresh).reply(200, createTokenPair())

      await authAPI.tokenRefresh({ refresh: 'refresh-token-xyz' })

      expect(mock.history.post).toHaveLength(1)
      expect(mock.history.post[0].url).toBe(urlTokenRefresh)
    })

    it('must send refresh token as JSON body', async () => {
      const refreshData = { refresh: 'refresh-token-xyz' }
      mock.onPost(urlTokenRefresh).reply(200, createTokenPair())

      await authAPI.tokenRefresh(refreshData)

      expect(JSON.parse(mock.history.post[0].data)).toEqual(refreshData)
    })

    it('must return a new token pair', async () => {
      const expectedResponse = createTokenPair({
        access: 'new-access-token',
        refresh: 'new-refresh-token'
      })
      mock.onPost(urlTokenRefresh).reply(200, expectedResponse)

      const result = await authAPI.tokenRefresh({ refresh: 'old-refresh-token' })

      expect(result.data.access).toBe('new-access-token')
      expect(result.data.refresh).toBe('new-refresh-token')
    })

    it('must propagate 401 errors for invalid refresh token', async () => {
      mock.onPost(urlTokenRefresh).reply(401, { detail: 'Token inválido o expirado' })

      await expect(authAPI.tokenRefresh({ refresh: 'invalid-token' })).rejects.toBeDefined()
    })

    it('must propagate 400 errors for missing refresh token', async () => {
      mock.onPost(urlTokenRefresh).reply(400, { refresh: ['Este campo es requerido'] })

      await expect(authAPI.tokenRefresh({ refresh: '' })).rejects.toBeDefined()
    })
  })

  // ============================================================
  // 3. INTEGRATION
  // ============================================================
  describe('Integration', () => {
    it('must complete a full auth cycle: login then refresh', async () => {
      const credentials: LoginCredentials = {
        username: 'provider1',
        password: 'pass123'
      }

      // Step 1: login
      mock.onPost(urlTokenPair).reply(
        200,
        createTokenPair({
          access: 'access-1',
          refresh: 'refresh-1'
        })
      )

      const loginResult = await authAPI.tokenPair(credentials)
      expect(loginResult.data.access).toBe('access-1')
      expect(loginResult.data.refresh).toBe('refresh-1')

      // Step 2: refresh with the refresh token
      mock.onPost(urlTokenRefresh).reply(
        200,
        createTokenPair({
          access: 'access-2',
          refresh: 'refresh-2'
        })
      )

      const refreshResult = await authAPI.tokenRefresh({ refresh: loginResult.data.refresh })
      expect(refreshResult.data.access).toBe('access-2')
      expect(refreshResult.data.refresh).toBe('refresh-2')
    })
  })
})
