import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { mount, type VueWrapper } from '@vue/test-utils'
import FormField from '../FormField.vue'

describe('FormField', () => {
  let wrapper: VueWrapper

  const createProps = (overrides: Record<string, unknown> = {}) => ({
    label: 'Test Label',
    modelValue: '',
    type: 'text',
    errorKey: 'test_field',
    ...overrides
  })

  const createValidation = (overrides: Record<string, unknown> = {}) => ({
    $error: false,
    $errors: [],
    $touch: vi.fn(),
    ...overrides
  })

  afterEach(() => {
    if (wrapper) {
      wrapper.unmount()
    }
  })

  // ============================================================
  // 1. RENDERING
  // ============================================================
  describe('Rendering', () => {
    it('must render the label', () => {
      wrapper = mount(FormField, {
        props: createProps({ label: 'Nombre' })
      })

      expect(wrapper.find('label').text()).toContain('Nombre')
    })

    it('must render the required asterisk when required is true', () => {
      wrapper = mount(FormField, {
        props: createProps({ required: true })
      })

      expect(wrapper.find('label').text()).toContain('*')
      expect(wrapper.find('.text-danger').exists()).toBe(true)
    })

    it('must not render the asterisk when required is false', () => {
      wrapper = mount(FormField, {
        props: createProps({ required: false })
      })

      expect(wrapper.find('label').text()).not.toContain('*')
    })

    it('must set the id on the input from errorKey', () => {
      wrapper = mount(FormField, {
        props: createProps({ errorKey: 'custom_key' })
      })

      const input = wrapper.find('input')
      expect(input.attributes('id')).toBe('custom_key')
    })

    it('must set the label for attribute from errorKey', () => {
      wrapper = mount(FormField, {
        props: createProps({ errorKey: 'custom_key' })
      })

      const label = wrapper.find('label')
      expect(label.attributes('for')).toBe('custom_key')
    })
  })

  // ============================================================
  // 2. TEXT INPUT (default)
  // ============================================================
  describe('Text input', () => {
    it('must render a text input by default', () => {
      wrapper = mount(FormField, {
        props: createProps()
      })

      const input = wrapper.find('input[type="text"]')
      expect(input.exists()).toBe(true)
    })

    it('must display the modelValue', () => {
      wrapper = mount(FormField, {
        props: createProps({ modelValue: 'test value' })
      })

      const input = wrapper.find('input')
      expect((input.element as HTMLInputElement).value).toBe('test value')
    })

    it('must emit update:modelValue on input', async () => {
      wrapper = mount(FormField, {
        props: createProps({ modelValue: '' })
      })

      const input = wrapper.find('input')
      await input.setValue('new value')

      expect(wrapper.emitted('update:modelValue')).toBeTruthy()
      expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['new value'])
    })

    it('must apply the placeholder when provided', () => {
      wrapper = mount(FormField, {
        props: createProps({ placeholder: 'Enter text' })
      })

      const input = wrapper.find('input')
      expect(input.attributes('placeholder')).toBe('Enter text')
    })

    it('must apply the disabled attribute when disabled is true', () => {
      wrapper = mount(FormField, {
        props: createProps({ disabled: true })
      })

      const input = wrapper.find('input')
      expect(input.attributes('disabled')).toBeDefined()
    })

    it('must support the number type', () => {
      wrapper = mount(FormField, {
        props: createProps({ type: 'number' })
      })

      const input = wrapper.find('input[type="number"]')
      expect(input.exists()).toBe(true)
    })

    it('must support the date type', () => {
      wrapper = mount(FormField, {
        props: createProps({ type: 'date' })
      })

      const input = wrapper.find('input[type="date"]')
      expect(input.exists()).toBe(true)
    })

    it('must support the password type', () => {
      wrapper = mount(FormField, {
        props: createProps({ type: 'password' })
      })

      const input = wrapper.find('input[type="password"]')
      expect(input.exists()).toBe(true)
    })
  })

  // ============================================================
  // 3. SELECT INPUT
  // ============================================================
  describe('Select input', () => {
    const options = [
      { value: 'a', label: 'Option A' },
      { value: 'b', label: 'Option B' },
      { value: 'c', label: 'Option C' }
    ]

    it('must render a select when type is "select"', () => {
      wrapper = mount(FormField, {
        props: createProps({ type: 'select', options })
      })

      const select = wrapper.find('select')
      expect(select.exists()).toBe(true)
    })

    it('must render all options plus a placeholder', () => {
      wrapper = mount(FormField, {
        props: createProps({ type: 'select', options })
      })

      const optionElements = wrapper.findAll('option')
      expect(optionElements).toHaveLength(4) // 1 placeholder + 3 options
      expect(optionElements[0].text()).toContain('Seleccione')
      expect(optionElements[1].text()).toContain('Option A')
    })

    it('must set the correct value on options', () => {
      wrapper = mount(FormField, {
        props: createProps({ type: 'select', options })
      })

      const optionElements = wrapper.findAll('option')
      expect(optionElements[1].attributes('value')).toBe('a')
      expect(optionElements[2].attributes('value')).toBe('b')
      expect(optionElements[3].attributes('value')).toBe('c')
    })

    it('must apply the form-select class', () => {
      wrapper = mount(FormField, {
        props: createProps({ type: 'select', options })
      })

      const select = wrapper.find('select')
      expect(select.classes()).toContain('form-select')
    })

    it('must emit update:modelValue on change', async () => {
      wrapper = mount(FormField, {
        props: createProps({ type: 'select', options, modelValue: '' })
      })

      const select = wrapper.find('select')
      await select.setValue('b')

      expect(wrapper.emitted('update:modelValue')).toBeTruthy()
      expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['b'])
    })

    it('must render select with no options gracefully', () => {
      wrapper = mount(FormField, {
        props: createProps({ type: 'select', options: [] })
      })

      const optionElements = wrapper.findAll('option')
      expect(optionElements).toHaveLength(1) // Only placeholder
    })
  })

  // ============================================================
  // 4. TEXTAREA INPUT
  // ============================================================
  describe('Textarea input', () => {
    it('must render a textarea when type is "textarea"', () => {
      wrapper = mount(FormField, {
        props: createProps({ type: 'textarea' })
      })

      expect(wrapper.find('textarea').exists()).toBe(true)
    })

    it('must display the modelValue', () => {
      wrapper = mount(FormField, {
        props: createProps({ type: 'textarea', modelValue: 'multiline\nvalue' })
      })

      const textarea = wrapper.find('textarea')
      expect((textarea.element as HTMLTextAreaElement).value).toBe('multiline\nvalue')
    })

    it('must emit update:modelValue on input', async () => {
      wrapper = mount(FormField, {
        props: createProps({ type: 'textarea', modelValue: '' })
      })

      const textarea = wrapper.find('textarea')
      await textarea.setValue('new content')

      expect(wrapper.emitted('update:modelValue')).toBeTruthy()
    })

    it('must apply the rows attribute', () => {
      wrapper = mount(FormField, {
        props: createProps({ type: 'textarea', rows: 5 })
      })

      const textarea = wrapper.find('textarea')
      expect(textarea.attributes('rows')).toBe('5')
    })

    it('must default rows to 3 when not provided', () => {
      wrapper = mount(FormField, {
        props: createProps({ type: 'textarea' })
      })

      const textarea = wrapper.find('textarea')
      expect(textarea.attributes('rows')).toBe('3')
    })
  })

  // ============================================================
  // 5. CHECKBOX INPUT
  // ============================================================
  describe('Checkbox input', () => {
    it('must render a checkbox when type is "checkbox"', () => {
      wrapper = mount(FormField, {
        props: createProps({ type: 'checkbox', modelValue: false })
      })

      const input = wrapper.find('input[type="checkbox"]')
      expect(input.exists()).toBe(true)
    })

    it('must be checked when modelValue is true', () => {
      wrapper = mount(FormField, {
        props: createProps({ type: 'checkbox', modelValue: true })
      })

      const input = wrapper.find('input[type="checkbox"]')
      expect((input.element as HTMLInputElement).checked).toBe(true)
    })

    it('must be unchecked when modelValue is false', () => {
      wrapper = mount(FormField, {
        props: createProps({ type: 'checkbox', modelValue: false })
      })

      const input = wrapper.find('input[type="checkbox"]')
      expect((input.element as HTMLInputElement).checked).toBe(false)
    })

    it('must emit update:modelValue with true when checked', async () => {
      wrapper = mount(FormField, {
        props: createProps({ type: 'checkbox', modelValue: false })
      })

      const input = wrapper.find('input[type="checkbox"]')
      await input.setValue(true)

      expect(wrapper.emitted('update:modelValue')).toBeTruthy()
      expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([true])
    })

    it('must apply the form-check class', () => {
      wrapper = mount(FormField, {
        props: createProps({ type: 'checkbox' })
      })

      const input = wrapper.find('input[type="checkbox"]')
      expect(input.classes()).toContain('form-check')
    })
  })

  // ============================================================
  // 6. VALIDATION STATE
  // ============================================================
  describe('Validation state', () => {
    it('must not apply is-invalid when validation has no errors', () => {
      wrapper = mount(FormField, {
        props: createProps({
          validation: createValidation({ $error: false })
        })
      })

      const input = wrapper.find('input')
      expect(input.classes()).not.toContain('is-invalid')
    })

    it('must apply is-invalid when validation has errors', () => {
      wrapper = mount(FormField, {
        props: createProps({
          validation: createValidation({
            $error: true,
            $errors: [{ $message: 'Field is required' }]
          })
        })
      })

      const input = wrapper.find('input')
      expect(input.classes()).toContain('is-invalid')
    })

    it('must display frontend error messages', () => {
      wrapper = mount(FormField, {
        props: createProps({
          validation: createValidation({
            $error: true,
            $errors: [{ $message: 'Field is required' }, { $message: 'Field must be unique' }]
          })
        })
      })

      const text = wrapper.text()
      expect(text).toContain('Field is required')
      expect(text).toContain('Field must be unique')
    })

    it('must not apply is-invalid when validation is null', () => {
      wrapper = mount(FormField, {
        props: createProps({ validation: null })
      })

      const input = wrapper.find('input')
      expect(input.classes()).not.toContain('is-invalid')
    })

    it('must not apply is-invalid when validation is undefined', () => {
      wrapper = mount(FormField, {
        props: createProps({ validation: undefined })
      })

      const input = wrapper.find('input')
      expect(input.classes()).not.toContain('is-invalid')
    })
  })

  // ============================================================
  // 7. BACKEND ERRORS
  // ============================================================
  describe('Backend errors', () => {
    it('must display backend errors when provided', () => {
      wrapper = mount(FormField, {
        props: createProps({
          backendErrors: ['Backend error 1', 'Backend error 2']
        })
      })

      const text = wrapper.text()
      expect(text).toContain('Backend error 1')
      expect(text).toContain('Backend error 2')
    })

    it('must apply is-invalid when backendErrors has items', () => {
      wrapper = mount(FormField, {
        props: createProps({
          backendErrors: ['Backend error']
        })
      })

      const input = wrapper.find('input')
      expect(input.classes()).toContain('is-invalid')
    })

    it('must not apply is-invalid when backendErrors is empty', () => {
      wrapper = mount(FormField, {
        props: createProps({
          backendErrors: []
        })
      })

      const input = wrapper.find('input')
      expect(input.classes()).not.toContain('is-invalid')
    })

    it('must combine frontend and backend errors', () => {
      wrapper = mount(FormField, {
        props: createProps({
          validation: createValidation({
            $error: true,
            $errors: [{ $message: 'Frontend error' }]
          }),
          backendErrors: ['Backend error']
        })
      })

      const text = wrapper.text()
      expect(text).toContain('Frontend error')
      expect(text).toContain('Backend error')
    })
  })

  // ============================================================
  // 8. BLUR EVENT
  // ============================================================
  describe('Blur event', () => {
    it('must emit blur when the input loses focus', async () => {
      wrapper = mount(FormField, {
        props: createProps()
      })

      const input = wrapper.find('input')
      await input.trigger('blur')

      expect(wrapper.emitted('blur')).toBeTruthy()
    })

    it('must emit blur when the select loses focus', async () => {
      wrapper = mount(FormField, {
        props: createProps({ type: 'select', options: [] })
      })

      const select = wrapper.find('select')
      await select.trigger('blur')

      expect(wrapper.emitted('blur')).toBeTruthy()
    })

    it('must emit blur when the textarea loses focus', async () => {
      wrapper = mount(FormField, {
        props: createProps({ type: 'textarea' })
      })

      const textarea = wrapper.find('textarea')
      await textarea.trigger('blur')

      expect(wrapper.emitted('blur')).toBeTruthy()
    })
  })

  // ============================================================
  // 9. ERROR MESSAGES RENDERING
  // ============================================================
  describe('Error messages rendering', () => {
    it('must not render an error container when there are no errors', () => {
      wrapper = mount(FormField, {
        props: createProps()
      })

      expect(wrapper.find('.text-danger').exists()).toBe(false)
    })

    it('must render error messages with the correct class', () => {
      wrapper = mount(FormField, {
        props: createProps({
          validation: createValidation({
            $error: true,
            $errors: [{ $message: 'Error' }]
          })
        })
      })

      const errorElements = wrapper.findAll('.text-danger')
      expect(errorElements.length).toBeGreaterThan(0)
    })
  })

  // ============================================================
  // 10. INTEGRATION
  // ============================================================
  describe('Integration', () => {
    it('must handle a full text input workflow', async () => {
      const $touch = vi.fn()

      wrapper = mount(FormField, {
        props: createProps({
          modelValue: '',
          validation: createValidation({ $touch })
        })
      })

      // Type into the input
      const input = wrapper.find('input')
      await input.setValue('typed value')

      expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['typed value'])

      // Blur the input
      await input.trigger('blur')

      expect(wrapper.emitted('blur')).toBeTruthy()
    })

    it('must handle a full select workflow', async () => {
      const options = [
        { value: '1', label: 'One' },
        { value: '2', label: 'Two' }
      ]

      wrapper = mount(FormField, {
        props: createProps({
          type: 'select',
          modelValue: '',
          options
        })
      })

      const select = wrapper.find('select')
      await select.setValue('2')

      expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['2'])
    })

    it('must handle validation errors appearing after touch', async () => {
      const $touch = vi.fn()

      wrapper = mount(FormField, {
        props: createProps({
          validation: createValidation({
            $error: false,
            $errors: [],
            $touch
          })
        })
      })

      // Initially no error
      expect(wrapper.find('input').classes()).not.toContain('is-invalid')

      // Update validation to show an error
      await wrapper.setProps({
        validation: createValidation({
          $error: true,
          $errors: [{ $message: 'Now required' }],
          $touch
        })
      })

      expect(wrapper.find('input').classes()).toContain('is-invalid')
      expect(wrapper.text()).toContain('Now required')
    })
  })
})
