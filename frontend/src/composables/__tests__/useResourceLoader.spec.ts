import { beforeEach, describe, expect, it, vi } from 'vitest'
import { useResourceLoader } from '../useResourceLoader'
import type { AxiosResponse } from 'axios'

interface TestResource {
  id: number
  name: string
  description: string | null
}

const fetchResource = vi.fn()

const createResource = (overrides: Partial<TestResource> = {}): TestResource => ({
  id: 1,
  name: 'Test Resource',
  description: null,
  ...overrides
})

const createAxiosResponse = <T>(data: T): AxiosResponse<T> =>
  ({
    data,
    status: 200,
    statusText: 'OK',
    headers: {},
    config: {} as any
  }) as AxiosResponse<T>

describe('useResourceLoader', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.spyOn(console, 'error').mockImplementation(() => {})
  })

  // ============================================================
  // 1. INITIAL STATE
  // ============================================================
  describe('Initial state', () => {
    it('must initialize data with initialData', () => {
      const initialData = createResource({ id: 0, name: '' })

      const { data } = useResourceLoader<TestResource>(fetchResource, {
        initialData,
        objectName: 'Resource',
        gender: 'm'
      })

      expect(data.value).toEqual(initialData)
    })

    it('must initialize isLoading to false', () => {
      const { isLoading } = useResourceLoader<TestResource>(fetchResource, {
        initialData: createResource()
      })

      expect(isLoading.value).toBe(false)
    })

    it('must initialize error to null', () => {
      const { error } = useResourceLoader<TestResource>(fetchResource, {
        initialData: createResource()
      })

      expect(error.value).toBeNull()
    })

    it('must initialize data to null when initialData is omitted', () => {
      const { data } = useResourceLoader<TestResource>(fetchResource)

      expect(data.value).toBeNull()
    })
  })

  // ============================================================
  // 2. SUCCESSFUL LOAD
  // ============================================================
  describe('Successful load', () => {
    it('must load the resource and update data', async () => {
      const resource = createResource({ id: 1, name: 'Loaded' })
      fetchResource.mockResolvedValue(createAxiosResponse(resource))

      const { data, load, isLoading } = useResourceLoader<TestResource>(fetchResource, {
        initialData: createResource({ id: 0, name: '' })
      })

      await load(1)

      expect(data.value).toEqual(resource)
      expect(data.value.id).toBe(1)
      expect(data.value.name).toBe('Loaded')
      expect(isLoading.value).toBe(false)
      expect(fetchResource).toHaveBeenCalledWith(1)
    })

    it('must set isLoading to true during load', async () => {
      let resolvePromise: (value: AxiosResponse<TestResource>) => void
      const pendingPromise = new Promise<AxiosResponse<TestResource>>((resolve) => {
        resolvePromise = resolve
      })

      fetchResource.mockReturnValue(pendingPromise)

      const { load, isLoading } = useResourceLoader<TestResource>(fetchResource, {
        initialData: createResource({ id: 0 })
      })

      const loadPromise = load(1)
      expect(isLoading.value).toBe(true)

      resolvePromise!(createAxiosResponse(createResource({ id: 1 })))
      await loadPromise

      expect(isLoading.value).toBe(false)
    })

    it('must return the full AxiosResponse from load', async () => {
      const resource = createResource()
      const axiosResponse = createAxiosResponse(resource)
      fetchResource.mockResolvedValue(axiosResponse)

      const { load } = useResourceLoader<TestResource>(fetchResource, {
        initialData: createResource()
      })

      const response = await load(1)

      expect(response).toEqual(axiosResponse)
      expect(response.data).toEqual(resource)
    })

    it('must call onSuccess with the full AxiosResponse', async () => {
      const resource = createResource()
      const axiosResponse = createAxiosResponse(resource)
      const onSuccess = vi.fn()
      fetchResource.mockResolvedValue(axiosResponse)

      const { load } = useResourceLoader<TestResource>(fetchResource, {
        initialData: createResource(),
        onSuccess
      })

      await load(1)

      expect(onSuccess).toHaveBeenCalledWith(axiosResponse)
      expect(onSuccess).toHaveBeenCalledTimes(1)
    })
  })

  // ============================================================
  // 3. ERROR HANDLING
  // ============================================================
  describe('Error handling', () => {
    it('must handle 500 error and set errorMessage', async () => {
      const mockError = { response: { status: 500, data: {} } }
      fetchResource.mockRejectedValue(mockError)

      const { errorMessage, load, isLoading } = useResourceLoader<TestResource>(fetchResource, {
        initialData: createResource(),
        objectName: 'Resource',
        gender: 'm'
      })

      await expect(load(1)).rejects.toBeDefined()

      expect(errorMessage.value).toContain('Error interno del servidor')
      expect(isLoading.value).toBe(false)
    })

    it('must handle 404 error with masculine gender', async () => {
      fetchResource.mockRejectedValue({ response: { status: 404, data: {} } })

      const { errorMessage, load } = useResourceLoader<TestResource>(fetchResource, {
        initialData: createResource(),
        objectName: 'Kit',
        gender: 'm'
      })

      await expect(load(1)).rejects.toBeDefined()

      expect(errorMessage.value).toContain('Kit no encontrado')
    })

    it('must handle 404 error with feminine gender', async () => {
      fetchResource.mockRejectedValue({ response: { status: 404, data: {} } })

      const { errorMessage, load } = useResourceLoader<TestResource>(fetchResource, {
        initialData: createResource(),
        objectName: 'Factura',
        gender: 'f'
      })

      await expect(load(1)).rejects.toBeDefined()

      expect(errorMessage.value).toContain('Factura no encontrada')
    })

    it('must handle network error', async () => {
      fetchResource.mockRejectedValue({ request: {}, response: null })

      const { errorMessage, load } = useResourceLoader<TestResource>(fetchResource, {
        initialData: createResource()
      })

      await expect(load(1)).rejects.toBeDefined()

      expect(errorMessage.value).toContain('Servidor no responde')
    })

    it('must handle unexpected error', async () => {
      fetchResource.mockRejectedValue(new Error('Unexpected'))

      const { errorMessage, load } = useResourceLoader<TestResource>(fetchResource, {
        initialData: createResource()
      })

      await expect(load(1)).rejects.toBeDefined()

      expect(errorMessage.value).toContain('Error inesperado')
    })

    it('must call onError callback when provided', async () => {
      const mockError = { response: { status: 500, data: {} } }
      const onError = vi.fn()
      fetchResource.mockRejectedValue(mockError)

      const { load } = useResourceLoader<TestResource>(fetchResource, {
        initialData: createResource(),
        onError
      })

      await expect(load(1)).rejects.toBeDefined()

      expect(onError).toHaveBeenCalledWith(mockError)
      expect(onError).toHaveBeenCalledTimes(1)
    })

    it('must re-throw the error after handling', async () => {
      const mockError = { response: { status: 500, data: {} } }
      fetchResource.mockRejectedValue(mockError)

      const { load } = useResourceLoader<TestResource>(fetchResource, {
        initialData: createResource()
      })

      await expect(load(1)).rejects.toEqual(mockError)
    })

    it('must store the error in the error ref', async () => {
      const mockError = { response: { status: 500, data: {} } }
      fetchResource.mockRejectedValue(mockError)

      const { load, error } = useResourceLoader<TestResource>(fetchResource, {
        initialData: createResource()
      })

      await expect(load(1)).rejects.toBeDefined()

      expect(error.value).toEqual(mockError)
    })

    it('must clear previous errors before loading', async () => {
      fetchResource.mockRejectedValueOnce({ response: { status: 500, data: {} } })

      const { errorMessage, load } = useResourceLoader<TestResource>(fetchResource, {
        initialData: createResource()
      })

      await expect(load(1)).rejects.toBeDefined()
      expect(errorMessage.value).not.toBeNull()

      fetchResource.mockResolvedValueOnce(createAxiosResponse(createResource({ id: 1 })))
      await load(1)
      expect(errorMessage.value).toBeNull()
    })
  })

  // ============================================================
  // 4. RESET
  // ============================================================
  describe('reset', () => {
    it('must reset data to initialData', async () => {
      const initialData = createResource({ id: 0, name: '' })
      fetchResource.mockResolvedValue(createAxiosResponse(createResource({ id: 1, name: 'Test' })))

      const { data, load, reset } = useResourceLoader<TestResource>(fetchResource, {
        initialData
      })

      await load(1)
      expect(data.value.name).toBe('Test')

      reset()
      expect(data.value).toEqual(initialData)
    })

    it('must reset isLoading to false', async () => {
      fetchResource.mockResolvedValue(createAxiosResponse(createResource()))

      const { load, reset, isLoading } = useResourceLoader<TestResource>(fetchResource, {
        initialData: createResource()
      })

      await load(1)
      reset()

      expect(isLoading.value).toBe(false)
    })

    it('must clear errors on reset', async () => {
      fetchResource.mockRejectedValue({ response: { status: 500, data: {} } })

      const { load, reset, errorMessage, error } = useResourceLoader<TestResource>(fetchResource, {
        initialData: createResource()
      })

      await expect(load(1)).rejects.toBeDefined()
      expect(errorMessage.value).not.toBeNull()
      expect(error.value).not.toBeNull()

      reset()
      expect(errorMessage.value).toBeNull()
      expect(error.value).toBeNull()
    })
  })

  // ============================================================
  // 5. hasData
  // ============================================================
  describe('hasData', () => {
    it('must return false when data is null', () => {
      const { hasData } = useResourceLoader<TestResource>(fetchResource)

      expect(hasData.value).toBe(false)
    })

    it('must return true when data has a value', async () => {
      fetchResource.mockResolvedValue(createAxiosResponse(createResource({ id: 1 })))

      const { load, hasData } = useResourceLoader<TestResource>(fetchResource, {
        initialData: createResource({ id: 0 })
      })

      await load(1)

      expect(hasData.value).toBe(true)
    })
  })

  // ============================================================
  // 6. CLEAR ERRORS
  // ============================================================
  describe('clearErrors', () => {
    it('must clear errorMessage', async () => {
      fetchResource.mockRejectedValue({ response: { status: 500, data: {} } })

      const { load, clearErrors, errorMessage } = useResourceLoader<TestResource>(fetchResource, {
        initialData: createResource()
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
        .mockResolvedValueOnce(createAxiosResponse(createResource({ id: 1, name: 'First' })))
        .mockResolvedValueOnce(createAxiosResponse(createResource({ id: 2, name: 'Second' })))

      const { data, load } = useResourceLoader<TestResource>(fetchResource, {
        initialData: createResource({ id: 0, name: '' })
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
      const bill: Bill = { id: 1, folio: 'F-001', total: 1500.5 }
      const fetchBill = vi.fn().mockResolvedValue(createAxiosResponse(bill))

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
      const fetchBill = vi.fn().mockRejectedValue({ response: { status: 404, data: {} } })

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
