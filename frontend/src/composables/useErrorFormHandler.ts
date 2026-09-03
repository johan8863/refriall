import { useErrorHandler } from './useErrorHandler'

interface UseErrorFormHandlerOptions {
  objectName?: string
  gender?: 'm' | 'f'
}

interface FieldErrors {
  [key: string]: string[]
}

/**
 * Form error handling specific composable
 */
export const useFormErrorHandler = (options: UseErrorFormHandlerOptions = {}) => {
  const errorHandler = useErrorHandler(options)

  /**
   * Clears errors for a specific field.
   * @param fieldName - The field to be cleared.
   */
  const clearFieldError = (fieldName: string): void => {
    if (errorHandler.backendErrors[fieldName]) {
      delete errorHandler.backendErrors[fieldName]
    }
  }

  /**
   * Get CSS class for a field with errors
   * @param fieldName - Name of the field
   * @param baseClass - Base CSS class (default: 'form-control')
   * @returns Combined CSS class string
   */
  const getFieldClass = (fieldName: string, baseClass: string = 'form-control'): string => {
    const hasError = errorHandler.hasFieldError(fieldName)
    return hasError ? `${baseClass} is-invalid` : baseClass
  }

  /**
   * Get error messages for a field (frontend + backend combined)
   * @param fieldName - Name of the field
   * @param frontendErrors - Array of frontend error messages
   * @returns Combined array of error messages
   */
  const getFieldErrorsMerged = (fieldName: string, frontendErrors: string[] = []): string[] => {
    const backend = errorHandler.getFieldErrors(fieldName)
    return [...frontendErrors, ...backend]
  }

  return {
    // Everything from useErrorHandler
    ...errorHandler,

    // Form-specific methods
    clearFieldError,
    getFieldClass,
    getFieldErrorsMerged
  }
}
