import { ref } from 'vue'
import { useErrorHandler } from './useErrorHandler.js'

/**
 * Composable for loading a single resource with built-in error handling
 *
 * @param {Function} fetchFunction - Function that fetches the resource (should accept params)
 * @param {Object} options - Configuration options
 * @param {*} options.initialData - Initial value for data ref
 * @param {string} options.objectName - Name of the resource (for error messages)
 * @param {string} options.gender - Gender of the resource ('m' or 'f')
 * @param {Function} options.onSuccess - Callback when load succeeds
 * @param {Function} options.onError - Callback when load fails
 * @returns {Object} Resource state and methods
 */
export const useResourceLoader = (fetchFunction, options = {}) => {
  const {
    initialData = null,
    objectName = 'Recurso',
    gender = 'm',
    onSuccess = null,
    onError = null
  } = options

  // State
  const data = ref(initialData)
  const isLoading = ref(false)
  const error = ref(null)

  // Use error handler for consistent error management
  const { errorMessage, backendErrors, hasErrors, handleError, clearErrors } = useErrorHandler({
    objectName,
    gender
  })

  /**
   * Load the resource
   * @param {*} params - Parameters to pass to fetchFunction
   * @returns {Promise<Object>} Response data
   */
  const load = async (params) => {
    isLoading.value = true
    error.value = null
    clearErrors()

    try {
      const response = await fetchFunction(params)
      data.value = response.data

      if (onSuccess) {
        onSuccess(response)
      }

      return response
    } catch (err) {
      error.value = err
      handleError(err)

      if (onError) {
        onError(err)
      }

      throw err
    } finally {
      isLoading.value = false
    }
  }

  /**
   * Reset the resource to initial state
   */
  const reset = () => {
    data.value = initialData
    isLoading.value = false
    error.value = null
    clearErrors()
  }

  /**
   * Check if the resource has data
   */
  const hasData = () => {
    return data.value !== null && data.value !== undefined
  }

  return {
    // State
    data,
    isLoading,
    error,
    errorMessage,
    backendErrors,
    hasErrors,

    // Methods
    load,
    reset,
    hasData,

    // Error methods (exposed for direct use if needed)
    handleError,
    clearErrors
  }
}
