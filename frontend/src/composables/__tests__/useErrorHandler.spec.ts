// composables/__tests__/useErrorHandler.spec.ts
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { useErrorHandler } from '../useErrorHandler'

describe('useErrorHandler', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    // Silence console.error during error handling tests
    vi.spyOn(console, 'error').mockImplementation(() => {})
  })

  // ============================================================
  // 1. INITIAL STATE
  // ============================================================
  describe('Initial state', () => {
    it('must start with no errors', () => {
      const { errorMessage, backendErrors, hasErrors } = useErrorHandler({
        objectName: 'Kit',
        gender: 'm'
      })

      expect(errorMessage.value).toBeNull()
      expect(backendErrors).toEqual({})
      expect(hasErrors.value).toBe(false)
    })

    it('must use default objectName and gender when options are omitted', () => {
      const { errorMessage, handleError } = useErrorHandler()

      handleError({
        response: { status: 404, data: {} }
      })

      expect(errorMessage.value).toContain('Objeto no encontrada')
    })
  })

  // ============================================================
  // 2. NETWORK ERRORS (no response)
  // ============================================================
  describe('Network errors', () => {
    it('must handle request errors without response', () => {
      const { errorMessage, hasErrors, handleError } = useErrorHandler({
        objectName: 'Kit',
        gender: 'm'
      })

      handleError({
        request: {},
        response: null
      })

      expect(errorMessage.value).toContain('Servidor no responde')
      expect(hasErrors.value).toBe(true)
    })

    it('must handle unexpected errors without request or response', () => {
      const { errorMessage, hasErrors, handleError } = useErrorHandler({
        objectName: 'Kit',
        gender: 'm'
      })

      handleError(new Error('Unknown error'))

      expect(errorMessage.value).toContain('Error inesperado')
      expect(hasErrors.value).toBe(true)
    })
  })

  // ============================================================
  // 3. HTTP STATUS ERRORS
  // ============================================================
  describe('HTTP status errors', () => {
    it('must handle 400 with delete method', () => {
      const { errorMessage, handleError } = useErrorHandler({
        objectName: 'Cliente',
        gender: 'm'
      })

      handleError({
        config: { method: 'delete' },
        response: { status: 400, data: {} }
      })

      expect(errorMessage.value).toContain('Cliente con información asociada')
    })

    it('must handle 400 with validation errors', () => {
      const { backendErrors, hasErrors, handleError } = useErrorHandler({
        objectName: 'Cliente',
        gender: 'm'
      })

      handleError({
        config: { method: 'post' },
        response: {
          status: 400,
          data: {
            name: ['El nombre es requerido'],
            email: ['Email inválido']
          }
        }
      })

      expect(backendErrors.name).toEqual(['El nombre es requerido'])
      expect(backendErrors.email).toEqual(['Email inválido'])
      expect(hasErrors.value).toBe(true)
    })

    it('must handle 400 with invalid non-object data', () => {
      const { errorMessage, handleError } = useErrorHandler({
        objectName: 'Moneda',
        gender: 'f'
      })

      handleError({
        config: { method: 'post' },
        response: { status: 400, data: null }
      })

      expect(errorMessage.value).toContain('Moneda con datos incorrectos')
    })

    it('must handle 401 unauthorized', () => {
      const { errorMessage, handleError } = useErrorHandler()

      handleError({
        response: { status: 401, data: {} }
      })

      expect(errorMessage.value).toContain('No autorizado')
    })

    it('must handle 403 forbidden', () => {
      const { errorMessage, handleError } = useErrorHandler()

      handleError({
        response: { status: 403, data: {} }
      })

      expect(errorMessage.value).toContain('No tiene permisos')
    })

    it('must handle 404 with masculine gender', () => {
      const { errorMessage, handleError } = useErrorHandler({
        objectName: 'Kit',
        gender: 'm'
      })

      handleError({
        response: { status: 404, data: {} }
      })

      expect(errorMessage.value).toBe('Kit no encontrado.')
    })

    it('must handle 404 with feminine gender', () => {
      const { errorMessage, handleError } = useErrorHandler({
        objectName: 'Factura',
        gender: 'f'
      })

      handleError({
        response: { status: 404, data: {} }
      })

      expect(errorMessage.value).toBe('Factura no encontrada.')
    })

    it('must handle 500 internal server error', () => {
      const { errorMessage, handleError } = useErrorHandler()

      handleError({
        response: { status: 500, data: {} }
      })

      expect(errorMessage.value).toContain('Error interno del servidor')
    })

    it('must handle unknown status with data.detail', () => {
      const { errorMessage, handleError } = useErrorHandler()

      handleError({
        response: { status: 418, data: { detail: 'I am a teapot' } }
      })

      expect(errorMessage.value).toBe('I am a teapot')
    })

    it('must handle unknown status with data.message', () => {
      const { errorMessage, handleError } = useErrorHandler()

      handleError({
        response: { status: 418, data: { message: 'Custom message' } }
      })

      expect(errorMessage.value).toBe('Custom message')
    })

    it('must handle unknown status with no data', () => {
      const { errorMessage, handleError } = useErrorHandler()

      handleError({
        response: { status: 418, data: {} }
      })

      expect(errorMessage.value).toBe('Error desconocido.')
    })
  })

  // ============================================================
  // 4. CLEAR ERRORS
  // ============================================================
  describe('clearErrors', () => {
    it('must clear errorMessage', () => {
      const { errorMessage, handleError, clearErrors } = useErrorHandler()

      handleError({
        response: { status: 500, data: {} }
      })
      expect(errorMessage.value).not.toBeNull()

      clearErrors()
      expect(errorMessage.value).toBeNull()
    })

    it('must clear backendErrors', () => {
      const { backendErrors, handleError, clearErrors } = useErrorHandler()

      handleError({
        config: { method: 'post' },
        response: {
          status: 400,
          data: { name: ['Error 1'], email: ['Error 2'] }
        }
      })

      expect(Object.keys(backendErrors).length).toBeGreaterThan(0)

      clearErrors()
      expect(Object.keys(backendErrors).length).toBe(0)
    })

    it('must reset hasErrors to false', () => {
      const { hasErrors, handleError, clearErrors } = useErrorHandler()

      handleError({
        response: { status: 500, data: {} }
      })
      expect(hasErrors.value).toBe(true)

      clearErrors()
      expect(hasErrors.value).toBe(false)
    })

    it('must clear errors before handling new error', () => {
      const { errorMessage, handleError } = useErrorHandler()

      handleError({
        response: { status: 500, data: {} }
      })
      expect(errorMessage.value).toContain('Error interno')

      handleError({
        response: { status: 401, data: {} }
      })
      expect(errorMessage.value).toContain('No autorizado')
      expect(errorMessage.value).not.toContain('Error interno')
    })
  })

  // ============================================================
  // 5. FIELD ERRORS
  // ============================================================
  describe('Field errors', () => {
    it('must detect field errors with hasFieldError', () => {
      const { hasFieldError, handleError } = useErrorHandler()

      handleError({
        config: { method: 'post' },
        response: {
          status: 400,
          data: { name: ['Error'] }
        }
      })

      expect(hasFieldError('name')).toBe(true)
      expect(hasFieldError('email')).toBe(false)
    })

    it('must return field errors with getFieldErrors', () => {
      const { getFieldErrors, handleError } = useErrorHandler()

      handleError({
        config: { method: 'post' },
        response: {
          status: 400,
          data: { name: ['Error 1', 'Error 2'] }
        }
      })

      expect(getFieldErrors('name')).toEqual(['Error 1', 'Error 2'])
      expect(getFieldErrors('email')).toEqual([])
    })

    it('must return empty array for non-existent fields', () => {
      const { getFieldErrors } = useErrorHandler()

      expect(getFieldErrors('unknown')).toEqual([])
    })

    it('must return false when field has empty errors array', () => {
      const { hasFieldError, handleError } = useErrorHandler()

      handleError({
        config: { method: 'post' },
        response: {
          status: 400,
          data: { name: [] }
        }
      })

      expect(hasFieldError('name')).toBe(false)
    })
  })

  // ============================================================
  // 6. GENDER HANDLING
  // ============================================================
  describe('Gender handling', () => {
    it('must use masculine form for 404', () => {
      const { errorMessage, handleError } = useErrorHandler({
        objectName: 'Artículo',
        gender: 'm'
      })

      handleError({
        response: { status: 404, data: {} }
      })

      expect(errorMessage.value).toBe('Artículo no encontrado.')
    })

    it('must use feminine form for 404', () => {
      const { errorMessage, handleError } = useErrorHandler({
        objectName: 'Orden',
        gender: 'f'
      })

      handleError({
        response: { status: 404, data: {} }
      })

      expect(errorMessage.value).toBe('Orden no encontrada.')
    })

    it('must default to masculine form when gender is invalid', () => {
      const { errorMessage, handleError } = useErrorHandler({
        objectName: 'Test',
        gender: 'x' as 'm' | 'f'
      })

      handleError({
        response: { status: 404, data: {} }
      })

      expect(errorMessage.value).toBe('Test no encontrado.')
    })
  })

  // ============================================================
  // 7. REAL USE CASES
  // ============================================================
  describe('Real use cases', () => {
    it('must handle customer deletion with orders', () => {
      const { errorMessage, handleError } = useErrorHandler({
        objectName: 'Cliente',
        gender: 'm'
      })

      handleError({
        config: { method: 'delete' },
        response: { status: 400, data: {} }
      })

      expect(errorMessage.value).toContain('Cliente con información asociada')
    })

    it('must handle kit form validation errors', () => {
      const { backendErrors, hasFieldError, getFieldErrors, handleError } = useErrorHandler({
        objectName: 'Equipo',
        gender: 'm'
      })

      handleError({
        config: { method: 'post' },
        response: {
          status: 400,
          data: {
            name: ['El nombre es requerido'],
            code: ['El código debe ser único']
          }
        }
      })

      expect(hasFieldError('name')).toBe(true)
      expect(getFieldErrors('name')).toEqual(['El nombre es requerido'])
      expect(getFieldErrors('code')).toEqual(['El código debe ser único'])
    })

    it('must handle expired session', () => {
      const { errorMessage, hasErrors, handleError } = useErrorHandler()

      handleError({
        response: { status: 401, data: {} }
      })

      expect(errorMessage.value).toContain('No autorizado')
      expect(hasErrors.value).toBe(true)
    })

    it('must handle server down scenario', () => {
      const { errorMessage, hasErrors, handleError } = useErrorHandler()

      handleError({
        request: {},
        response: null
      })

      expect(errorMessage.value).toContain('Servidor no responde')
      expect(hasErrors.value).toBe(true)
    })
  })

  // ============================================================
  // 8. CONSOLE LOGGING
  // ============================================================
  describe('Console logging', () => {
    it('must log errors to console', () => {
      const consoleSpy = vi.spyOn(console, 'error')
      const { handleError } = useErrorHandler()

      const mockError = {
        response: { status: 500, data: {} }
      }

      handleError(mockError)

      expect(consoleSpy).toHaveBeenCalledWith('Error caught:', mockError)
    })
  })
})
