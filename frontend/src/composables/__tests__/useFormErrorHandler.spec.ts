import { beforeEach, describe, expect, it, vi } from 'vitest'
import { useFormErrorHandler } from '../useErrorFormHandler'

describe('useFormErrorHandler', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.spyOn(console, 'error').mockImplementation(() => {})
  })

  // ============================================================
  // 1. INHERITED FUNCTIONALITY FROM useErrorHandler
  // ============================================================
  describe('Inherited functionality from useErrorHandler', () => {
    it('must expose errorMessage from useErrorHandler', () => {
      const { errorMessage, handleError } = useFormErrorHandler({
        objectName: 'Equipo',
        gender: 'm'
      })

      handleError({
        response: { status: 500, data: {} }
      })

      expect(errorMessage.value).toContain('Error interno del servidor')
    })

    it('must expose backendErrors from useErrorHandler', () => {
      const { backendErrors, handleError } = useFormErrorHandler()

      handleError({
        config: { method: 'post' },
        response: {
          status: 400,
          data: { name: ['Error'] }
        }
      })

      expect(backendErrors.name).toEqual(['Error'])
    })

    it('must expose hasErrors from useErrorHandler', () => {
      const { hasErrors, handleError } = useFormErrorHandler()

      handleError({
        response: { status: 500, data: {} }
      })

      expect(hasErrors.value).toBe(true)
    })

    it('must expose clearErrors from useErrorHandler', () => {
      const { errorMessage, handleError, clearErrors } = useFormErrorHandler()

      handleError({
        response: { status: 500, data: {} }
      })
      expect(errorMessage.value).not.toBeNull()

      clearErrors()
      expect(errorMessage.value).toBeNull()
    })

    it('must expose hasFieldError from useErrorHandler', () => {
      const { hasFieldError, handleError } = useFormErrorHandler()

      handleError({
        config: { method: 'post' },
        response: {
          status: 400,
          data: { name: ['Error'] }
        }
      })

      expect(hasFieldError('name')).toBe(true)
      expect(hasFieldError('unknown')).toBe(false)
    })

    it('must expose getFieldErrors from useErrorHandler', () => {
      const { getFieldErrors, handleError } = useFormErrorHandler()

      handleError({
        config: { method: 'post' },
        response: {
          status: 400,
          data: { name: ['Error 1', 'Error 2'] }
        }
      })

      expect(getFieldErrors('name')).toEqual(['Error 1', 'Error 2'])
    })
  })

  // ============================================================
  // 2. clearFieldError
  // ============================================================
  describe('clearFieldError', () => {
    it('must remove backend errors for a specific field', () => {
      const { backendErrors, handleError, clearFieldError } = useFormErrorHandler()

      handleError({
        config: { method: 'post' },
        response: {
          status: 400,
          data: {
            name: ['Error 1'],
            email: ['Error 2']
          }
        }
      })

      expect(backendErrors.name).toEqual(['Error 1'])
      expect(backendErrors.email).toEqual(['Error 2'])

      clearFieldError('name')

      expect(backendErrors.name).toBeUndefined()
      expect(backendErrors.email).toEqual(['Error 2'])
    })

    it('must do nothing when field has no errors', () => {
      const { backendErrors, clearFieldError } = useFormErrorHandler()

      expect(backendErrors.unknown).toBeUndefined()
      clearFieldError('unknown')
      expect(backendErrors.unknown).toBeUndefined()
    })

    it('must not affect other fields when clearing one', () => {
      const { backendErrors, handleError, clearFieldError } = useFormErrorHandler()

      handleError({
        config: { method: 'post' },
        response: {
          status: 400,
          data: {
            name: ['Error'],
            email: ['Error'],
            phone: ['Error']
          }
        }
      })

      clearFieldError('email')

      expect(backendErrors.name).toEqual(['Error'])
      expect(backendErrors.email).toBeUndefined()
      expect(backendErrors.phone).toEqual(['Error'])
    })
  })

  // ============================================================
  // 3. getFieldClass
  // ============================================================
  describe('getFieldClass', () => {
    it('must return base class when field has no error', () => {
      const { getFieldClass } = useFormErrorHandler()

      expect(getFieldClass('name')).toBe('form-control')
    })

    it('must return base class plus is-invalid when field has error', () => {
      const { getFieldClass, handleError } = useFormErrorHandler()

      handleError({
        config: { method: 'post' },
        response: {
          status: 400,
          data: { name: ['Error'] }
        }
      })

      expect(getFieldClass('name')).toBe('form-control is-invalid')
    })

    it('must accept a custom base class', () => {
      const { getFieldClass, handleError } = useFormErrorHandler()

      handleError({
        config: { method: 'post' },
        response: {
          status: 400,
          data: { name: ['Error'] }
        }
      })

      expect(getFieldClass('name', 'form-select')).toBe('form-select is-invalid')
    })

    it('must return custom base class without is-invalid when no error', () => {
      const { getFieldClass } = useFormErrorHandler()

      expect(getFieldClass('name', 'form-select')).toBe('form-select')
    })

    it('must be reactive to error changes', () => {
      const { getFieldClass, handleError, clearFieldError } = useFormErrorHandler()

      expect(getFieldClass('name')).toBe('form-control')

      handleError({
        config: { method: 'post' },
        response: {
          status: 400,
          data: { name: ['Error'] }
        }
      })
      expect(getFieldClass('name')).toBe('form-control is-invalid')

      clearFieldError('name')
      expect(getFieldClass('name')).toBe('form-control')
    })
  })

  // ============================================================
  // 4. getFieldErrorsMerged
  // ============================================================
  describe('getFieldErrorsMerged', () => {
    it('must return empty array when no errors', () => {
      const { getFieldErrorsMerged } = useFormErrorHandler()

      expect(getFieldErrorsMerged('name')).toEqual([])
    })

    it('must return only backend errors when no frontend errors', () => {
      const { getFieldErrorsMerged, handleError } = useFormErrorHandler()

      handleError({
        config: { method: 'post' },
        response: {
          status: 400,
          data: { name: ['Backend error'] }
        }
      })

      expect(getFieldErrorsMerged('name')).toEqual(['Backend error'])
    })

    it('must return only frontend errors when no backend errors', () => {
      const { getFieldErrorsMerged } = useFormErrorHandler()

      expect(getFieldErrorsMerged('name', ['Frontend error'])).toEqual(['Frontend error'])
    })

    it('must merge frontend and backend errors in order', () => {
      const { getFieldErrorsMerged, handleError } = useFormErrorHandler()

      handleError({
        config: { method: 'post' },
        response: {
          status: 400,
          data: { name: ['Backend 1', 'Backend 2'] }
        }
      })

      const result = getFieldErrorsMerged('name', ['Frontend 1'])

      expect(result).toEqual(['Frontend 1', 'Backend 1', 'Backend 2'])
      expect(result).toHaveLength(3)
    })

    it('must handle multiple frontend errors', () => {
      const { getFieldErrorsMerged, handleError } = useFormErrorHandler()

      handleError({
        config: { method: 'post' },
        response: {
          status: 400,
          data: { name: ['Backend'] }
        }
      })

      const result = getFieldErrorsMerged('name', ['Frontend 1', 'Frontend 2'])

      expect(result).toEqual(['Frontend 1', 'Frontend 2', 'Backend'])
      expect(result).toHaveLength(3)
    })

    it('must return a new array each time', () => {
      const { getFieldErrorsMerged } = useFormErrorHandler()

      const result1 = getFieldErrorsMerged('name', ['Error'])
      const result2 = getFieldErrorsMerged('name', ['Error'])

      expect(result1).not.toBe(result2)
      expect(result1).toEqual(result2)
    })
  })

  // ============================================================
  // 5. INTEGRATION WITH FORM WORKFLOW
  // ============================================================
  describe('Form workflow integration', () => {
    it('must simulate a complete form validation workflow', () => {
      const { getFieldClass, getFieldErrorsMerged, handleError, clearFieldError } =
        useFormErrorHandler({
          objectName: 'Cliente',
          gender: 'm'
        })

      // Step 1: no errors initially
      expect(getFieldClass('name')).toBe('form-control')
      expect(getFieldErrorsMerged('name')).toEqual([])

      // Step 2: backend returns validation errors
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

      expect(getFieldClass('name')).toBe('form-control is-invalid')
      expect(getFieldErrorsMerged('name', ['Frontend error'])).toEqual([
        'Frontend error',
        'El nombre es requerido'
      ])

      // Step 3: user fixes the name field
      clearFieldError('name')

      expect(getFieldClass('name')).toBe('form-control')
      expect(getFieldClass('email')).toBe('form-control is-invalid')
    })

    it('must handle delete workflow with associated data', () => {
      const { errorMessage, handleError } = useFormErrorHandler({
        objectName: 'Cliente',
        gender: 'm'
      })

      handleError({
        config: { method: 'delete' },
        response: { status: 400, data: {} }
      })

      expect(errorMessage.value).toContain('Cliente con información asociada')
    })

    it('must handle 404 during form load', () => {
      const { errorMessage, handleError } = useFormErrorHandler({
        objectName: 'Kit',
        gender: 'm'
      })

      handleError({
        response: { status: 404, data: {} }
      })

      expect(errorMessage.value).toBe('Kit no encontrado.')
    })
  })

  // ============================================================
  // 6. REAL USE CASES
  // ============================================================
  describe('Real use cases', () => {
    it('must provide correct CSS class for input fields', () => {
      const { getFieldClass, handleError } = useFormErrorHandler()

      handleError({
        config: { method: 'post' },
        response: {
          status: 400,
          data: { username: ['Usuario requerido'] }
        }
      })

      expect(getFieldClass('username')).toBe('form-control is-invalid')
      expect(getFieldClass('other')).toBe('form-control')
    })

    it('must provide correct CSS class for select fields', () => {
      const { getFieldClass, handleError } = useFormErrorHandler()

      handleError({
        config: { method: 'post' },
        response: {
          status: 400,
          data: { item_type: ['Tipo requerido'] }
        }
      })

      expect(getFieldClass('item_type', 'form-select')).toBe('form-select is-invalid')
    })

    it('must combine frontend validation with backend errors', () => {
      const { getFieldErrorsMerged, handleError } = useFormErrorHandler()

      // Simulate a field with frontend validation error and backend error
      handleError({
        config: { method: 'post' },
        response: {
          status: 400,
          data: {
            bank_account: ['La cuenta ya existe']
          }
        }
      })

      const frontendErrors = ['La cuenta debe tener 16 dígitos']
      const allErrors = getFieldErrorsMerged('bank_account', frontendErrors)

      expect(allErrors).toEqual(['La cuenta debe tener 16 dígitos', 'La cuenta ya existe'])
    })
  })

  // ============================================================
  // 7. METHOD CHAINING AND REUSABILITY
  // ============================================================
  describe('Method chaining and reusability', () => {
    it('must work independently across multiple instances', () => {
      const handler1 = useFormErrorHandler({ objectName: 'Cliente', gender: 'm' })
      const handler2 = useFormErrorHandler({ objectName: 'Kit', gender: 'm' })

      handler1.handleError({
        config: { method: 'post' },
        response: {
          status: 400,
          data: { name: ['Cliente error'] }
        }
      })

      handler2.handleError({
        config: { method: 'post' },
        response: {
          status: 400,
          data: { name: ['Kit error'] }
        }
      })

      expect(handler1.getFieldErrorsMerged('name')).toEqual(['Cliente error'])
      expect(handler2.getFieldErrorsMerged('name')).toEqual(['Kit error'])
    })

    it('must not share state between instances', () => {
      const handler1 = useFormErrorHandler()
      const handler2 = useFormErrorHandler()

      handler1.handleError({
        config: { method: 'post' },
        response: {
          status: 400,
          data: { name: ['Error'] }
        }
      })

      expect(handler1.getFieldClass('name')).toBe('form-control is-invalid')
      expect(handler2.getFieldClass('name')).toBe('form-control')
    })
  })
})
