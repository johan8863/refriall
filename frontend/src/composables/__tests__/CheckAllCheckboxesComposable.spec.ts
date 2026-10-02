import { beforeEach, describe, expect, it, vi } from 'vitest'
import { useResourceLoader } from '../useResourceLoader'

// Test resource interface
interface TestResource {
  id: number
  name: string
  description: string | null
}

// Mock fetch function
const fetchResource = vi.fn()

describe('useResourceLoader', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  // ============================================================
  // 1. INITIAL STATE
  // ============================================================
  describe('Initial state', () => {
    it('must initialize with the provided initialData', () => {
      const initialData: TestResource = {
        id: 0,
        name: '',
        description: null
      }

      const { data, isLoading, errorMessage } = useResourceLoader<TestResource>(fetchResource, {
        initialData,
        objectName: 'Resource',
        gender: 'm'
      })

      expect(data.value).toEqual(initialData)
      expect(isLoading.value).toBe(false)
      expect(errorMessage.value).toBeNull()
    })

    it('must initialize with default values when options are omitted', () => {
      const { data, isLoading } = useResourceLoader<TestResource>(fetchResource)

      expect(data.value).toBeNull()
      expect(isLoading.value).toBe(false)
    })
  })

  // ============================================================
  // 2. SUCCESSFUL LOAD
  // ============================================================
  describe('Successful load', () => {
    it('must load the resource and update data', async () => {
      const resource: TestResource = {
        id: 1,
        name: 'Test Resource',
        description: 'A test description'
      }

      fetchResource.mockResolvedValue({ data: resource })

      const { data, load, isLoading } = useResourceLoader<TestResource>(fetchResource, {
        initialData: { id: 0, name: '', description: null },
        objectName: 'Resource',
        gender: 'm'
      })

      await load(1)

      expect(data.value).toEqual(resource)
      expect(data.value.id).toBe(1)
      expect(data.value.name).toBe('Test Resource')
      expect(isLoading.value).toBe(false)
      expect(fetchResource).toHaveBeenCalledWith(1)
    })

    it('must set isLoading to true during load', async () => {
      let resolvePromise: (value: unknown) => void
      const pendingPromise = new Promise((resolve) => {
        resolvePromise = resolve
      })

      fetchResource.mockReturnValue(pendingPromise)

      const { load, isLoading } = useResourceLoader<TestResource>(fetchResource, {
        initialData: { id: 0, name: '', description: null }
      })

      const loadPromise = load(1)
      expect(isLoading.value).toBe(true)

      resolvePromise!({ data: { id: 1, name: 'Test', description: null } })
      await loadPromise

      expect(isLoading.value).toBe(false)
    })

    it('must return the response from load', async () => {
      const resource: TestResource = {
        id: 1,
        name: 'Test Resource',
        description: null
      }

      fetchResource.mockResolvedValue({ data: resource })

      const { load } = useResourceLoader<TestResource>(fetchResource, {
        initialData: { id: 0, name: '', description: null }
      })

      const response = await load(1)

      expect(response).toEqual({ data: resource })
    })

    it('must call onSuccess callback when provided', async () => {
      const resource: TestResource = {
        id: 1,
        name: 'Test Resource',
        description: null
      }

      const onSuccess = vi.fn()
      fetchResource.mockResolvedValue({ data: resource })

      const { load } = useResourceLoader<TestResource>(fetchResource, {
        initialData: { id: 0, name: '', description: null },
        onSuccess
      })

      await load(1)

      expect(onSuccess).toHaveBeenCalledWith({ data: resource })
      expect(onSuccess).toHaveBeenCalledTimes(1)
    })
  })

  // ============================================================
  // 3. ERROR HANDLING
  // ============================================================
  describe('Error handling', () => {
    it('must handle 500 error and set errorMessage', async () => {
      fetchResource.mockRejectedValue({
        response: {
          status: 500,
          data: {}
        }
      })

      const { errorMessage, load, isLoading } = useResourceLoader<TestResource>(fetchResource, {
        initialData: { id: 0, name: '', description: null },
        objectName: 'Resource',
        gender: 'm'
      })

      await expect(load(1)).rejects.toBeDefined()

      expect(errorMessage.value).toContain('Error interno del servidor')
      expect(isLoading.value).toBe(false)
    })

    it('must handle 404 error with correct gender', async () => {
      fetchResource.mockRejectedValue({
        response: {
          status: 404,
          data: {}
        }
      })

      const { errorMessage, load } = useResourceLoader<TestResource>(fetchResource, {
        initialData: { id: 0, name: '', description: null },
        objectName: 'Kit',
        gender: 'm'
      })

      await expect(load(1)).rejects.toBeDefined()

      expect(errorMessage.value).toContain('Kit no encontrado')
    })

    it('must handle 404 error with feminine gender', async () => {
      fetchResource.mockRejectedValue({
        response: {
          status: 404,
          data: {}
        }
      })

      const { errorMessage, load } = useResourceLoader<TestResource>(fetchResource, {
        initialData: { id: 0, name: '', description: null },
        objectName: 'Factura',
        gender: 'f'
      })

      await expect(load(1)).rejects.toBeDefined()

      expect(errorMessage.value).toContain('Factura no encontrada')
    })

    it('must handle network error', async () => {
      fetchResource.mockRejectedValue({
        request: {},
        response: null
      })

      const { errorMessage, load } = useResourceLoader<TestResource>(fetchResource, {
        initialData: { id: 0, name: '', description: null },
        objectName: 'Resource',
        gender: 'm'
      })

      await expect(load(1)).rejects.toBeDefined()

      expect(errorMessage.value).toContain('Servidor no responde')
    })

    it('must handle unexpected error', async () => {
      fetchResource.mockRejectedValue(new Error('Unexpected'))

      const { errorMessage, load } = useResourceLoader<TestResource>(fetchResource, {
        initialData: { id: 0, name: '', description: null },
        objectName: 'Resource',
        gender: 'm'
      })

      await expect(load(1)).rejects.toBeDefined()

      expect(errorMessage.value).toContain('Error inesperado')
    })

    it('must call onError callback when provided', async () => {
      const onError = vi.fn()
      const mockError = {
        response: {
          status: 500,
          data: {}
        }
      }

      fetchResource.mockRejectedValue(mockError)

      const { load } = useResourceLoader<TestResource>(fetchResource, {
        initialData: { id: 0, name: '', description: null },
        onError
      })

      await expect(load(1)).rejects.toBeDefined()

      expect(onError).toHaveBeenCalledWith(mockError)
      expect(onError).toHaveBeenCalledTimes(1)
    })

    it('must re-throw the error after handling', async () => {
      const mockError = {
        response: {
          status: 500,
          data: {}
        }
      }

      fetchResource.mockRejectedValue(mockError)

      const { load } = useResourceLoader<TestResource>(fetchResource, {
        initialData: { id: 0, name: '', description: null }
      })

      await expect(load(1)).rejects.toEqual(mockError)
    })

    it('must clear previous errors before loading', async () => {
      fetchResource.mockRejectedValueOnce({
        response: { status: 500, data: {} }
      })

      const { errorMessage, load, clearErrors } = useResourceLoader<TestResource>(fetchResource, {
        initialData: { id: 0, name: '', description: null }
      })

      await expect(load(1)).rejects.toBeDefined()
      expect(errorMessage.value).not.toBeNull()

      fetchResource.mockResolvedValueOnce({
        data: { id: 1, name: 'Test', description: null }
      })

      await load(1)
      expect(errorMessage.value).toBeNull()
    })
  })

  // ============================================================
  // 4. RESET
  // ============================================================
  describe('Reset', () => {
    it('must reset data to initialData', async () => {
      const initialData: TestResource = {
        id: 0,
        name: '',
        description: null
      }

      fetchResource.mockResolvedValue({
        data: { id: 1, name: 'Test', description: 'Test' }
      })

      const { data, load, reset } = useResourceLoader<TestResource>(fetchResource, {
        initialData
      })

      await load(1)
      expect(data.value.name).toBe('Test')

      reset()
      expect(data.value).toEqual(initialData)
    })

    it('must reset isLoading to false', async () => {
      fetchResource.mockResolvedValue({
        data: { id: 1, name: 'Test', description: null }
      })

      const { load, reset, isLoading } = useResourceLoader<TestResource>(fetchResource, {
        initialData: { id: 0, name: '', description: null }
      })

      await load(1)
      reset()

      expect(isLoading.value).toBe(false)
    })

    it('must clear errors on reset', async () => {
      fetchResource.mockRejectedValue({
        response: { status: 500, data: {} }
      })

      const { load, reset, errorMessage } = useResourceLoader<TestResource>(fetchResource, {
        initialData: { id: 0, name: '', description: null }
      })

      await expect(load(1)).rejects.toBeDefined()
      expect(errorMessage.value).not.toBeNull()

      reset()
      expect(errorMessage.value).toBeNull()
    })
  })

  // ============================================================
  // 5. HADATA METHOD
  // ============================================================
  describe('hasData', () => {
    it('must return false when data is null', () => {
      const { hasData } = useResourceLoader<TestResource>(fetchResource)

      expect(hasData()).toBe(false)
    })

    it('must return true when data has a value', async () => {
      fetchResource.mockResolvedValue({
        data: { id: 1, name: 'Test', description: null }
      })

      const { load, hasData } = useResourceLoader<TestResource>(fetchResource, {
        initialData: { id: 0, name: '', description: null }
      })

      await load(1)

      expect(hasData()).toBe(true)
    })
  })

  // ============================================================
  // 6. CLEAR ERRORS
  // ============================================================
  describe('clearErrors', () => {
    it('must clear errorMessage', async () => {
      fetchResource.mockRejectedValue({
        response: { status: 500, data: {} }
      })

      const { load, clearErrors, errorMessage } = useResourceLoader<TestResource>(fetchResource, {
        initialData: { id: 0, name: '', description: null }
      })

      await expect(load(1)).rejects.toBeDefined()
      expect(errorMessage.value).not.toBeNull()

      clearErrors()
      expect(errorMessage.value).toBeNull()
    })
  })

  // ============================================================
  // 7. REACTIVITY
  // ============================================================
  describe('Reactivity', () => {
    it('must be reactive to multiple loads', async () => {
      fetchResource
        .mockResolvedValueOnce({
          data: { id: 1, name: 'First', description: null }
        })
        .mockResolvedValueOnce({
          data: { id: 2, name: 'Second', description: null }
        })

      const { data, load } = useResourceLoader<TestResource>(fetchResource, {
        initialData: { id: 0, name: '', description: null }
      })

      await load(1)
      expect(data.value.name).toBe('First')

      await load(2)
      expect(data.value.name).toBe('Second')
      expect(data.value.id).toBe(2)
    })
  })

  // ============================================================
  // 8. REAL USE CASE
  // ============================================================
  describe('Real use case: loading a bill', () => {
    interface Bill {
      id: number
      folio: string
      total: number
    }

    it('must load a bill correctly', async () => {
      const bill: Bill = {
        id: 1,
        folio: 'F-001',
        total: 1500.5
      }

      const fetchBill = vi.fn().mockResolvedValue({ data: bill })

      const { data, load, isLoading, errorMessage } = useResourceLoader<Bill>(fetchBill, {
        initialData: { id: 0, folio: '', total: 0 },
        objectName: 'Factura',
        gender: 'f'
      })

      await load(1)

      expect(data.value).toEqual(bill)
      expect(data.value.folio).toBe('F-001')
      expect(data.value.total).toBe(1500.5)
      expect(isLoading.value).toBe(false)
      expect(errorMessage.value).toBeNull()
      expect(fetchBill).toHaveBeenCalledWith(1)
    })

    it('must handle bill not found', async () => {
      const fetchBill = vi.fn().mockRejectedValue({
        response: { status: 404, data: {} }
      })

      const { errorMessage, load } = useResourceLoader<Bill>(fetchBill, {
        initialData: { id: 0, folio: '', total: 0 },
        objectName: 'Factura',
        gender: 'f'
      })

      await expect(load(999)).rejects.toBeDefined()

      expect(errorMessage.value).toContain('Factura no encontrada')
    })
  })
})
