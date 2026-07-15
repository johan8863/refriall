import { useErrorHandler } from './useErrorHandler'

/**
 * Form error handling specific composable
 */
export const useFormErrorHandler = (options = {}) => {
  const errorHandler = useErrorHandler(options)

  // clear errors when touching a field
  const clearFieldError = (fieldName) => {
    if (errorHandler.backendErrors[fieldName]) {
      delete errorHandler.backendErrors[fieldName]
    }
  }

  // get CSS class for a field with errors
  const getFieldClass = (fieldName, baseClass = 'form-control') => {
    const hasError = errorHandler.hasFieldError(fieldName)
    return hasError ? `${baseClass} is-invalid` : baseClass
  }

  // get error messages for a field (frontend + backend)
  const getFieldErrorsMerged = (fieldName, frontendErrors = []) => {
    const backend = errorHandler.getFieldErrors(fieldName)
    return [...frontendErrors, ...backend]
  }

  return {
    // everuthing from useErrorHandler
    ...errorHandler,

    // form methods
    clearFieldError,
    getFieldClass,
    getFieldErrorsMerged
  }
}
