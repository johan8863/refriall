// composables/useForm.js
import { ref } from 'vue'
import { useVuelidate } from '@vuelidate/core'
import { useFormErrorHandler } from './useErrorFormHandler.js'

/**
 * Composable for handling forms with validation and CRUD operations
 *
 * @param {Object} options - Configuration options
 * @param {Object} options.initialData - Initial form data
 * @param {Object} options.rules - Vuelidate validation rules
 * @param {Object} options.service - Service object with CRUD methods
 * @param {string} options.objectName - Name of the object (for error messages)
 * @param {string} options.gender - Gender of the object ('m' or 'f')
 * @param {Function} options.onSuccess - Callback on successful submit
 * @param {string} options.createMethod - Name of the create method (default: 'create')
 * @param {string} options.updateMethod - Name of the update method (default: 'update')
 * @param {string} options.detailMethod - Name of the detail method (default: 'detail')
 */
export const useForm = (options = {}) => {
  const {
    initialData = {},
    rules = {},
    service,
    objectName = 'Elemento',
    gender = 'm',
    onSuccess = null,
    createMethod = 'create',
    updateMethod = 'update',
    detailMethod = 'detail'
  } = options

  const formData = ref({ ...initialData })
  const isLoading = ref(false)
  const isSaving = ref(false)

  const { errorMessage, backendErrors, handleError, getFieldErrors, clearErrors } =
    useFormErrorHandler({
      objectName,
      gender
    })

  const v$ = useVuelidate(rules, formData)

  /**
   * Load data for editing
   * @param {number|string} id - ID of the record to load
   * @param {Function} fetchFunction - Optional custom fetch function
   */
  const loadData = async (id, fetchFunction = null) => {
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
      return data
    } catch (error) {
      handleError(error)
      throw error
    } finally {
      isLoading.value = false
    }
  }

  /**
   * Submit the form (create or update)
   * @returns {Promise<Object>} Response data
   */
  const submit = async () => {
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

      if (onSuccess) {
        onSuccess(data)
      }
      return data
    } catch (error) {
      handleError(error)
      throw error
    } finally {
      isSaving.value = false
    }
  }

  /**
   * Reset form to initial state
   */
  const reset = () => {
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
    submit,
    reset,
    getFieldErrors,
    clearErrors
  }
}
