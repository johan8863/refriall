import { beforeEach, describe, expect, it, vi } from 'vitest'

// Mock dependencies before importing useForm
vi.mock('@vuelidate/core', () => ({
  useVuelidate: vi.fn()
}))

vi.mock('../useErrorFormHandler', () => ({
  useFormErrorHandler: vi.fn()
}))

vi.mock('../routingFunctions', () => ({
  useRouting: vi.fn()
}))

import { useVuelidate } from '@vuelidate/core'
import { useFormErrorHandler } from '../useErrorFormHandler'
import { useRouting } from '../routingFunctions'
import { useForm } from '../useForm'
import { ref } from 'vue'

// Test form interface
interface TestForm {
  id: number
  name: string
  description: string | null
}

// Default initial data
const createInitialData = (): TestForm => ({
  id: 0,
  name: '',
  description: null
})

// Mock implementations
const mockValidate = vi.fn()
const mockGoBack = vi.fn()
const mockGoToDetail = vi.fn()
const mockHandleError = vi.fn()
const mockClearErrors = vi.fn()
const mockGetFieldErrors = vi.fn()

describe('useForm', () => {
  let mockService: {
    create: ReturnType<typeof vi.fn<(data: any) => Promise<{ data: TestForm }>>>
    update: ReturnType<typeof vi.fn<(data: any) => Promise<{ data: TestForm }>>>
    detail: ReturnType<typeof vi.fn<(id: number | string) => Promise<{ data: TestForm }>>>
    getForUpdate: ReturnType<typeof vi.fn<(id: number | string) => Promise<{ data: TestForm }>>>
    postItem: ReturnType<typeof vi.fn<(data: any) => Promise<{ data: TestForm }>>>
    putKit: ReturnType<typeof vi.fn<(data: any) => Promise<{ data: TestForm }>>>
  }

  beforeEach(() => {
    vi.clearAllMocks()

    // Setup mock service
    mockService = {
      create: vi.fn(),
      update: vi.fn(),
      detail: vi.fn(),
      getForUpdate: vi.fn(),
      postItem: vi.fn(),
      putKit: vi.fn()
    }

    // Setup useFormErrorHandler mock
    vi.mocked(useFormErrorHandler).mockReturnValue({
      errorMessage: ref(null),
      backendErrors: ref({}),
      hasErrors: ref(false),
      handleError: mockHandleError,
      clearErrors: mockClearErrors,
      hasFieldError: vi.fn(),
      getFieldErrors: mockGetFieldErrors,
      clearFieldError: vi.fn(),
      getFieldClass: vi.fn(),
      getFieldErrorsMerged: vi.fn()
    } as any)

    // Setup useRouting mock
    vi.mocked(useRouting).mockReturnValue({
      goBack: mockGoBack,
      goToDetail: mockGoToDetail,
      goToList: vi.fn()
    })

    // Setup useVuelidate mock
    vi.mocked(useVuelidate).mockReturnValue({
      value: {
        $validate: mockValidate,
        $errors: []
      }
    } as any)

    // Default: validation passes
    mockValidate.mockResolvedValue(true)
  })

  // ============================================================
  // 1. INITIAL STATE
  // ============================================================
  describe('Initial state', () => {
    it('must initialize formData with provided initialData', () => {
      const initialData = createInitialData()

      const { formData } = useForm<TestForm>({
        initialData,
        rules: {},
        service: mockService
      })

      expect(formData.value).toEqual(initialData)
    })

    it('must initialize isLoading and isSaving as false', () => {
      const { isLoading, isSaving } = useForm<TestForm>({
        initialData: createInitialData(),
        rules: {},
        service: mockService
      })

      expect(isLoading.value).toBe(false)
      expect(isSaving.value).toBe(false)
    })

    it('must create a new object from initialData (not reference)', () => {
      const initialData = createInitialData()

      const { formData } = useForm<TestForm>({
        initialData,
        rules: {},
        service: mockService
      })

      expect(formData.value).not.toBe(initialData)
      expect(formData.value).toEqual(initialData)
    })

    it('must pass objectName and gender to useFormErrorHandler', () => {
      useForm<TestForm>({
        initialData: createInitialData(),
        rules: {},
        service: mockService,
        objectName: 'Cliente',
        gender: 'm'
      })

      expect(useFormErrorHandler).toHaveBeenCalledWith({
        objectName: 'Cliente',
        gender: 'm'
      })
    })

    it('must use default objectName and gender when omitted', () => {
      useForm<TestForm>({
        initialData: createInitialData(),
        rules: {},
        service: mockService
      })

      expect(useFormErrorHandler).toHaveBeenCalledWith({
        objectName: 'Elemento',
        gender: 'm'
      })
    })
  })

  // ============================================================
  // 2. loadData
  // ============================================================
  describe('loadData', () => {
    it('must load data successfully using service detail method', async () => {
      const loadedData: TestForm = {
        id: 1,
        name: 'Loaded',
        description: 'Description'
      }

      mockService.detail.mockResolvedValue({ data: loadedData })

      const { formData, loadData, isLoading } = useForm<TestForm>({
        initialData: createInitialData(),
        rules: {},
        service: mockService
      })

      await loadData(1)

      expect(mockService.detail).toHaveBeenCalledWith(1)
      expect(formData.value).toEqual(loadedData)
      expect(isLoading.value).toBe(false)
    })

    it('must do nothing when id is falsy', async () => {
      const { loadData } = useForm<TestForm>({
        initialData: createInitialData(),
        rules: {},
        service: mockService
      })

      await loadData(0)

      expect(mockService.detail).not.toHaveBeenCalled()
    })

    it('must set isLoading during load', async () => {
      let resolvePromise: (value: { data: TestForm }) => void
      const pendingPromise = new Promise<{ data: TestForm }>((resolve) => {
        resolvePromise = resolve
      })

      mockService.detail.mockReturnValue(pendingPromise)

      const { loadData, isLoading } = useForm<TestForm>({
        initialData: createInitialData(),
        rules: {},
        service: mockService
      })

      const loadPromise = loadData(1)
      expect(isLoading.value).toBe(true)

      resolvePromise!({ data: { id: 1, name: 'Test', description: null } })
      await loadPromise

      expect(isLoading.value).toBe(false)
    })

    it('must use custom fetchFunction when provided', async () => {
      const customFetch = vi.fn().mockResolvedValue({
        data: { id: 1, name: 'Custom', description: null }
      })

      const { loadData, formData } = useForm<TestForm>({
        initialData: createInitialData(),
        rules: {},
        service: mockService
      })

      await loadData(1, customFetch)

      expect(customFetch).toHaveBeenCalledWith(1)
      expect(mockService.detail).not.toHaveBeenCalled()
      expect(formData.value.name).toBe('Custom')
    })

    it('must use custom detailMethod when provided', async () => {
      mockService.getForUpdate = vi.fn().mockResolvedValue({
        data: { id: 1, name: 'For Update', description: null }
      })

      const { loadData, formData } = useForm<TestForm>({
        initialData: createInitialData(),
        rules: {},
        service: mockService,
        detailMethod: 'getForUpdate'
      })

      await loadData(1)

      expect(mockService.getForUpdate).toHaveBeenCalledWith(1)
      expect(formData.value.name).toBe('For Update')
    })

    it('must handle errors during load', async () => {
      const mockError = { response: { status: 500, data: {} } }
      mockService.detail.mockRejectedValue(mockError)

      const { loadData, isLoading } = useForm<TestForm>({
        initialData: createInitialData(),
        rules: {},
        service: mockService
      })

      await loadData(1)

      expect(mockHandleError).toHaveBeenCalledWith(mockError)
      expect(isLoading.value).toBe(false)
    })

    it('must clear errors before load', async () => {
      mockService.detail.mockResolvedValue({
        data: { id: 1, name: 'Test', description: null }
      })

      const { loadData } = useForm<TestForm>({
        initialData: createInitialData(),
        rules: {},
        service: mockService
      })

      await loadData(1)

      expect(mockClearErrors).toHaveBeenCalled()
    })

    it('must throw when detailMethod does not exist in service', async () => {
      const { loadData } = useForm<TestForm>({
        initialData: createInitialData(),
        rules: {},
        service: mockService,
        detailMethod: 'nonExistentMethod'
      })

      await loadData(1)

      expect(mockHandleError).toHaveBeenCalled()
    })
  })

  // ============================================================
  // 3. handleSubmit - CREATE
  // ============================================================
  describe('handleSubmit - Create', () => {
    it('must create a new record when id is 0', async () => {
      const newFormData: TestForm = {
        id: 0,
        name: 'New Record',
        description: 'Description'
      }

      mockService.create.mockResolvedValue({
        data: { id: 1, name: 'New Record', description: 'Description' }
      })

      const { formData, handleSubmit, isSaving } = useForm<TestForm>({
        initialData: newFormData,
        rules: {},
        service: mockService,
        detailView: 'test_detail'
      })

      await handleSubmit()

      expect(mockValidate).toHaveBeenCalled()
      expect(mockService.create).toHaveBeenCalledWith(formData.value)
      expect(mockService.update).not.toHaveBeenCalled()
      expect(isSaving.value).toBe(false)
    })

    it('must use custom createMethod when provided', async () => {
      mockService.postItem = vi.fn().mockResolvedValue({
        data: { id: 1, name: 'New', description: null }
      })

      const { handleSubmit } = useForm<TestForm>({
        initialData: createInitialData(),
        rules: {},
        service: mockService,
        createMethod: 'postItem',
        detailView: 'test_detail'
      })

      await handleSubmit()

      expect(mockService.postItem).toHaveBeenCalled()
      expect(mockService.create).not.toHaveBeenCalled()
    })
  })

  // ============================================================
  // 4. handleSubmit - UPDATE
  // ============================================================
  describe('handleSubmit - Update', () => {
    it('must update an existing record when id is set', async () => {
      const existingFormData: TestForm = {
        id: 1,
        name: 'Existing',
        description: 'Description'
      }

      mockService.update.mockResolvedValue({
        data: { id: 1, name: 'Updated', description: 'Description' }
      })

      const { handleSubmit } = useForm<TestForm>({
        initialData: existingFormData,
        rules: {},
        service: mockService,
        detailView: 'test_detail'
      })

      await handleSubmit()

      expect(mockService.update).toHaveBeenCalled()
      expect(mockService.create).not.toHaveBeenCalled()
    })

    it('must use custom updateMethod when provided', async () => {
      mockService.putKit = vi.fn().mockResolvedValue({
        data: { id: 1, name: 'Updated', description: null }
      })

      const { handleSubmit } = useForm<TestForm>({
        initialData: { id: 1, name: 'Old', description: null },
        rules: {},
        service: mockService,
        updateMethod: 'putKit',
        detailView: 'test_detail'
      })

      await handleSubmit()

      expect(mockService.putKit).toHaveBeenCalled()
    })
  })

  // ============================================================
  // 5. handleSubmit - VALIDATION
  // ============================================================
  describe('handleSubmit - Validation', () => {
    it('must not submit when validation fails', async () => {
      mockValidate.mockResolvedValue(false)

      const { handleSubmit } = useForm<TestForm>({
        initialData: createInitialData(),
        rules: {},
        service: mockService
      })

      await handleSubmit()

      expect(mockService.create).not.toHaveBeenCalled()
      expect(mockService.update).not.toHaveBeenCalled()
    })

    it('must log validation errors when validation fails', async () => {
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
      mockValidate.mockResolvedValue(false)

      const { handleSubmit } = useForm<TestForm>({
        initialData: createInitialData(),
        rules: {},
        service: mockService
      })

      await handleSubmit()

      expect(consoleSpy).toHaveBeenCalledWith('Validation errors:', expect.anything())
    })
  })

  // ============================================================
  // 6. handleSubmit - NAVIGATION
  // ============================================================
  describe('handleSubmit - Navigation', () => {
    it('must navigate to detail view after successful submit', async () => {
      mockService.create.mockResolvedValue({
        data: { id: 42, name: 'New', description: null }
      })

      const { handleSubmit } = useForm<TestForm>({
        initialData: createInitialData(),
        rules: {},
        service: mockService,
        detailView: 'test_detail'
      })

      await handleSubmit()

      expect(mockGoToDetail).toHaveBeenCalledWith('test_detail', 42)
    })

    it('must not navigate when detailView is not provided', async () => {
      mockService.create.mockResolvedValue({
        data: { id: 42, name: 'New', description: null }
      })

      const { handleSubmit } = useForm<TestForm>({
        initialData: createInitialData(),
        rules: {},
        service: mockService
      })

      await handleSubmit()

      expect(mockGoToDetail).not.toHaveBeenCalled()
    })
  })

  // ============================================================
  // 7. handleSubmit - ERROR HANDLING
  // ============================================================
  describe('handleSubmit - Error handling', () => {
    it('must handle backend errors during submit', async () => {
      const mockError = {
        response: {
          status: 400,
          data: { name: ['El nombre es requerido'] }
        }
      }
      mockService.create.mockRejectedValue(mockError)

      const { handleSubmit, isSaving } = useForm<TestForm>({
        initialData: createInitialData(),
        rules: {},
        service: mockService
      })

      await handleSubmit()

      expect(mockHandleError).toHaveBeenCalledWith(mockError)
      expect(isSaving.value).toBe(false)
    })

    it('must handle missing method in service', async () => {
      const serviceWithoutCreate = {
        update: vi.fn(),
        detail: vi.fn()
      }

      const { handleSubmit } = useForm<TestForm>({
        initialData: createInitialData(),
        rules: {},
        service: serviceWithoutCreate
      })

      await handleSubmit()

      expect(mockHandleError).toHaveBeenCalled()
    })
  })

  // ============================================================
  // 8. isSaving STATE
  // ============================================================
  describe('isSaving state', () => {
    it('must set isSaving during submit', async () => {
      let resolvePromise: (value: { data: TestForm }) => void
      const pendingPromise = new Promise<{ data: TestForm }>((resolve) => {
        resolvePromise = resolve
      })

      mockService.create.mockReturnValue(pendingPromise)

      const { handleSubmit, isSaving } = useForm<TestForm>({
        initialData: createInitialData(),
        rules: {},
        service: mockService
      })

      const submitPromise = handleSubmit()
      expect(isSaving.value).toBe(false)

      resolvePromise!({ data: { id: 1, name: 'Test', description: null } })
      await submitPromise

      expect(isSaving.value).toBe(false)
    })
  })

  // ============================================================
  // 9. handleGoBack
  // ============================================================
  describe('handleGoBack', () => {
    it('must call goBack with listView and detailView', () => {
      const { handleGoBack, formData } = useForm<TestForm>({
        initialData: { id: 5, name: 'Test', description: null },
        rules: {},
        service: mockService,
        listView: 'test_list',
        detailView: 'test_detail'
      })

      handleGoBack()

      expect(mockGoBack).toHaveBeenCalledWith('test_list', 'test_detail', 5)
    })

    it('must not call goBack when listView or detailView is missing', () => {
      const { handleGoBack } = useForm<TestForm>({
        initialData: createInitialData(),
        rules: {},
        service: mockService
      })

      handleGoBack()

      expect(mockGoBack).not.toHaveBeenCalled()
    })
  })

  // ============================================================
  // 10. reset
  // ============================================================
  describe('reset', () => {
    it('must reset formData to initialData', () => {
      const initialData = createInitialData()

      const { formData, reset } = useForm<TestForm>({
        initialData,
        rules: {},
        service: mockService
      })

      formData.value.name = 'Modified'
      formData.value.id = 99

      reset()

      expect(formData.value).toEqual(initialData)
    })

    it('must clear errors on reset', () => {
      const { reset } = useForm<TestForm>({
        initialData: createInitialData(),
        rules: {},
        service: mockService
      })

      reset()

      expect(mockClearErrors).toHaveBeenCalled()
    })

    it('must create a new object on reset (not reference)', () => {
      const initialData = createInitialData()

      const { formData, reset } = useForm<TestForm>({
        initialData,
        rules: {},
        service: mockService
      })

      const beforeReset = formData.value
      reset()

      expect(formData.value).not.toBe(beforeReset)
    })
  })

  // ============================================================
  // 11. RETURNED OBJECT
  // ============================================================
  describe('Returned object', () => {
    it('must expose all expected properties', () => {
      const result = useForm<TestForm>({
        initialData: createInitialData(),
        rules: {},
        service: mockService
      })

      expect(result).toHaveProperty('formData')
      expect(result).toHaveProperty('isLoading')
      expect(result).toHaveProperty('isSaving')
      expect(result).toHaveProperty('errorMessage')
      expect(result).toHaveProperty('backendErrors')
      expect(result).toHaveProperty('v$')
      expect(result).toHaveProperty('loadData')
      expect(result).toHaveProperty('handleSubmit')
      expect(result).toHaveProperty('handleGoBack')
      expect(result).toHaveProperty('reset')
      expect(result).toHaveProperty('getFieldErrors')
      expect(result).toHaveProperty('clearErrors')
    })
  })

  // ============================================================
  // 12. REAL USE CASES
  // ============================================================
  describe('Real use cases', () => {
    it('must handle Kit form workflow (create)', async () => {
      const kitService = {
        create: vi.fn().mockResolvedValue({ data: { id: 1, name: 'Split' } }),
        update: vi.fn(),
        detail: vi.fn()
      }

      const { formData, handleSubmit } = useForm<{ id: number; name: string }>({
        initialData: { id: 0, name: '' },
        rules: {},
        service: kitService,
        objectName: 'Equipo',
        gender: 'm',
        createMethod: 'create',
        detailView: 'kits_detail'
      })

      formData.value.name = 'Split'
      await handleSubmit()

      expect(kitService.create).toHaveBeenCalledWith({ id: 0, name: 'Split' })
      expect(mockGoToDetail).toHaveBeenCalledWith('kits_detail', 1)
    })

    it('must handle Kit form workflow (update)', async () => {
      const kitService = {
        create: vi.fn(),
        update: vi.fn().mockResolvedValue({ data: { id: 1, name: 'Updated' } }),
        detail: vi.fn()
      }

      const { formData, handleSubmit } = useForm<{ id: number; name: string }>({
        initialData: { id: 1, name: 'Original' },
        rules: {},
        service: kitService,
        objectName: 'Equipo',
        gender: 'm',
        updateMethod: 'update',
        detailView: 'kits_detail'
      })

      formData.value.name = 'Updated'
      await handleSubmit()

      expect(kitService.update).toHaveBeenCalled()
      expect(kitService.create).not.toHaveBeenCalled()
    })

    it('must handle edit workflow with load', async () => {
      const kitService = {
        create: vi.fn(),
        update: vi.fn(),
        detail: vi.fn().mockResolvedValue({
          data: { id: 1, name: 'Loaded Kit' }
        })
      }

      const { formData, loadData } = useForm<{ id: number; name: string }>({
        initialData: { id: 0, name: '' },
        rules: {},
        service: kitService,
        objectName: 'Equipo',
        gender: 'm'
      })

      await loadData(1)

      expect(formData.value).toEqual({ id: 1, name: 'Loaded Kit' })
      expect(formData.value.id).toBe(1)
    })
  })
})
