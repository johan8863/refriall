import { ref, reactive, type Ref, type Reactive } from 'vue'

interface UseErrorHandlerOptions {
  objectName?: string
  gender?: 'f' | 'm'
}

interface BackendErrors {
  [key: string]: string[]
}

/**
 * Composable to handle errors centrally
 * @param {Object} options - configuration
 * @param {string} options.objectName - Object name to the message
 * @param {string} options.gender - Gender ('m' o 'f')
 */
export const useErrorHandler = (options: UseErrorHandlerOptions = {}) => {
  const { objectName = 'Objeto', gender = 'f' } = options

  // errors status
  const errorMessage: Ref<string | null> = ref(null)
  const backendErrors: Reactive<BackendErrors> = reactive({})
  const hasErrors: Ref<boolean> = ref(false)

  // clear errors
  const clearErrors = (): void => {
    errorMessage.value = null
    Object.keys(backendErrors).forEach((key) => {
      delete backendErrors[key]
    })
    hasErrors.value = false
  }

  // handle response errors
  const handleResponseError = (error: any): void => {
    clearErrors()
    hasErrors.value = true

    if (!error.response) {
      if (error.request) {
        errorMessage.value = 'Servidor no responde, intente más tarde.'
      } else {
        errorMessage.value = 'Error inesperado, consulte al desarrollador.'
      }
      return
    }

    const { data, status } = error.response

    switch (status) {
      case 400:
        if (error.config?.method === 'delete') {
          errorMessage.value = `${objectName} con información asociada.`
        } else {
          // form validation errors
          if (data && typeof data === 'object') {
            Object.assign(backendErrors, data)
          } else {
            errorMessage.value = `${objectName} con datos incorrectos.`
          }
        }
        break

      case 401:
        errorMessage.value = 'No autorizado, inicie sesión nuevamente.'
        break

      case 403:
        errorMessage.value = 'No tiene permisos para realizar esta acción.'
        break

      case 404:
        const genderMap: Record<'m' | 'f', string> = { m: 'o', f: 'a' }
        errorMessage.value = `${objectName} no encontrad${genderMap[gender as 'm' | 'f'] || 'o'}.`
        break

      case 500:
        errorMessage.value = 'Error interno del servidor, consulte al desarrollador.'
        break

      default:
        errorMessage.value = data?.detail || data?.message || 'Error desconocido.'
    }
  }

  // handle any error
  const handleError = (error: any): void => {
    console.error('Error caught:', error)
    handleResponseError(error)
  }

  // verufy if backend errors on specific fields
  const hasFieldError = (fieldName: string): boolean => {
    return !!(backendErrors[fieldName] && backendErrors[fieldName].length > 0)
  }

  // get backend errors from specific field
  const getFieldErrors = (fieldName: string): string[] => {
    return backendErrors[fieldName] || []
  }

  return {
    // state
    errorMessage,
    backendErrors,
    hasErrors,

    // methods
    handleError,
    clearErrors,
    hasFieldError,
    getFieldErrors
  }
}
