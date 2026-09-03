import { ref, type Ref } from 'vue'
import { useVuelidate } from '@vuelidate/core'
import { useFormErrorHandler } from './useErrorFormHandler'
import { useRouting } from './routingFunctions'

interface Service<T> {
  create?: (data: any) => Promise<{ data: T }>
  update?: (data: any) => Promise<{ data: T }>
  detail?: (id: number | string) => Promise<{ data: T }>
  [key: string]: any
}

interface UseFormOptions<T> {
  initialData: T
  rules: any
  service: Service<T>
  objectName?: string
  gender?: 'm' | 'f'
  createMethod?: string
  updateMethod?: string
  detailMethod?: string
  listView?: string
  detailView?: string
}

/**
 * Composable for handling forms with validation and CRUD operations
 */
export const useForm = <T extends Record<string, any>>(options: UseFormOptions<T>) => {
  const {
    initialData,
    rules = {},
    service,
    objectName = 'Elemento',
    gender = 'm' as 'm' | 'f',
    createMethod = 'create',
    updateMethod = 'update',
    detailMethod = 'detail',
    listView,
    detailView
  } = options

  // Refs
  const formData = ref({ ...initialData })
  const isLoading: Ref<boolean> = ref(false)
  const isSaving: Ref<boolean> = ref(false)

  // Error handling
  const { errorMessage, backendErrors, handleError, getFieldErrors, clearErrors } =
    useFormErrorHandler({
      objectName,
      gender
    })

  const { goBack, goToDetail } = useRouting()

  const handleGoBack = (): void => {
    if (listView && detailView) {
      goBack(listView, detailView, formData.value.id)
    }
  }

  const v$ = useVuelidate(rules, formData)

  /**
   * Load data for editing
   * @param id - ID of the record to load
   * @param fetchFunction - Optional custom fetch function
   */
  const loadData = async (id: number | string, fetchFunction: any = null): Promise<void> => {
    if (!id) return
    isLoading.value = true
    clearErrors()
    try {
      const fn = fetchFunction || service[detailMethod]
      if (!fn) {
        throw new Error(`Method "${detailMethod}" not found in service. 
          Please provide a custom fetchFunction or add "${detailMethod}" to your service.`)
      }
      const { data } = await fn(id)
      formData.value = data
    } catch (error) {
      handleError(error)
    } finally {
      isLoading.value = false
    }
  }

  /**
   * Submit the form (create or update)
   */
  const handleSubmit = async (): Promise<void> => {
    // Validate form
    if (!(await v$.value.$validate())) {
      console.error('Validation errors:', v$.value.$errors)
      return
    }

    isSaving.value = true
    try {
      const isUpdate = !!formData.value.id
      const methodName = isUpdate ? updateMethod : createMethod
      const method = service[methodName]

      if (!method) {
        throw new Error(`Method "${methodName}" not found in service. 
          Please ensure your service has "${methodName}" or configure it in useForm options.`)
      }

      const { data } = await method(formData.value)
      // Navigate to detail view on success
      if (detailView) {
        goToDetail(detailView, data.id)
      }
    } catch (error) {
      handleError(error)
    } finally {
      isSaving.value = false
    }
  }

  /**
   * Reset form to initial state
   */
  const reset = (): void => {
    formData.value = { ...initialData }
    clearErrors()
  }

  return {
    // State
    formData,
    isLoading,
    isSaving,
    errorMessage,
    backendErrors,
    v$,

    // Methods
    loadData,
    handleSubmit,
    handleGoBack,
    reset,
    getFieldErrors,
    clearErrors
  }
}
