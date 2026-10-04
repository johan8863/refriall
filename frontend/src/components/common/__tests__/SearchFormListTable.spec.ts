import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { mount, type VueWrapper } from '@vue/test-utils'
import { nextTick } from 'vue'
import SearchFormListTable from '../../SearchFormListTable.vue'

describe('SearchFormListTable', () => {
  let wrapper: VueWrapper

  const createProps = (overrides: Record<string, unknown> = {}) => ({
    modelValue: '',
    isLoading: false,
    hasSearched: false,
    inputPlaceholder: 'Search...',
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
    it('must render the search input', () => {
      wrapper = mount(SearchFormListTable, {
        props: createProps()
      })

      const input = wrapper.find('input[type="search"]')
      expect(input.exists()).toBe(true)
    })

    it('must render the placeholder from props', () => {
      wrapper = mount(SearchFormListTable, {
        props: createProps({ inputPlaceholder: 'Nombre del cliente...' })
      })

      const input = wrapper.find('input[type="search"]')
      expect(input.attributes('placeholder')).toBe('Nombre del cliente...')
    })

    it('must render the submit button with "Buscar" text', () => {
      wrapper = mount(SearchFormListTable, {
        props: createProps()
      })

      const submitButton = wrapper.find('button[type="submit"]')
      expect(submitButton.exists()).toBe(true)
      expect(submitButton.text()).toContain('Buscar')
    })

    it('must render the label with "Búsqueda:" text', () => {
      wrapper = mount(SearchFormListTable, {
        props: createProps()
      })

      expect(wrapper.text()).toContain('Búsqueda:')
    })

    it('must set the correct input id', () => {
      wrapper = mount(SearchFormListTable, {
        props: createProps()
      })

      const input = wrapper.find('input[type="search"]')
      expect(input.attributes('id')).toBe('searchOrderText')
    })
  })

  // ============================================================
  // 2. V-MODEL (defineModel)
  // ============================================================
  describe('v-model binding', () => {
    it('must display the modelValue in the input', () => {
      wrapper = mount(SearchFormListTable, {
        props: createProps({ modelValue: 'test search' })
      })

      const input = wrapper.find('input[type="search"]')
      expect((input.element as HTMLInputElement).value).toBe('test search')
    })

    it('must emit update:modelValue when typing', async () => {
      wrapper = mount(SearchFormListTable, {
        props: createProps({ modelValue: '' })
      })

      const input = wrapper.find('input[type="search"]')
      await input.setValue('new value')

      expect(wrapper.emitted('update:modelValue')).toBeTruthy()
      expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['new value'])
    })

    it('must reflect modelValue changes from parent', async () => {
      wrapper = mount(SearchFormListTable, {
        props: createProps({ modelValue: 'initial' })
      })

      const input = wrapper.find('input[type="search"]')
      expect((input.element as HTMLInputElement).value).toBe('initial')

      await wrapper.setProps({ modelValue: 'updated' })
      expect((input.element as HTMLInputElement).value).toBe('updated')
    })
  })

  // ============================================================
  // 3. SUBMIT HANDLER
  // ============================================================
  describe('Submit handler', () => {
    it('must emit "onHandleSearch" when the form is submitted', async () => {
      wrapper = mount(SearchFormListTable, {
        props: createProps({ modelValue: 'test' })
      })

      const form = wrapper.find('form')
      console.log('Form exists:', form.exists())

      await form.trigger('submit')

      console.log('Emitted after submit:', wrapper.emitted())

      expect(wrapper.emitted('onHandleSearch')).toBeTruthy()
    })

    it('must emit "onHandleSearch" when pressing Enter in the input', async () => {
      wrapper = mount(SearchFormListTable, {
        props: createProps({ modelValue: 'test' })
      })

      const input = wrapper.find('input[type="search"]')
      await input.trigger('keyup.enter')

      expect(wrapper.emitted('onHandleSearch')).toBeTruthy()
    })
  })

  // ============================================================
  // 4. CLEAR SEARCH HANDLER
  // ============================================================
  describe('Clear search handler', () => {
    it('must emit "onClearSearch" when clicking the clear button', async () => {
      wrapper = mount(SearchFormListTable, {
        props: createProps({
          modelValue: 'test',
          hasSearched: true
        })
      })

      const clearButton = wrapper.findAll('button').find((b) => b.text().includes('Limpiar'))
      expect(clearButton).toBeDefined()

      await clearButton!.trigger('click')

      expect(wrapper.emitted('onClearSearch')).toBeTruthy()
    })

    it('must show the clear button when hasSearched is true', () => {
      wrapper = mount(SearchFormListTable, {
        props: createProps({
          modelValue: 'test',
          hasSearched: true
        })
      })

      const clearButton = wrapper.findAll('button').find((b) => b.text().includes('Limpiar'))
      expect(clearButton).toBeDefined()
    })

    it('must hide the clear button when hasSearched is false', () => {
      wrapper = mount(SearchFormListTable, {
        props: createProps({
          modelValue: '',
          hasSearched: false
        })
      })

      const clearButton = wrapper.findAll('button').find((b) => b.text().includes('Limpiar'))
      expect(clearButton).toBeUndefined()
    })
  })

  // ============================================================
  // 5. SEARCH EVENT (NATIVE X BUTTON)
  // ============================================================
  describe('Native search event', () => {
    it('must emit "onClearSearch" when the native search event clears the input', async () => {
      wrapper = mount(SearchFormListTable, {
        props: createProps({
          modelValue: 'test',
          hasSearched: true
        })
      })

      // Simulate the native search event after clearing the input
      const input = wrapper.find('input[type="search"]')
      await input.setValue('')
      await input.trigger('search')
      await nextTick()

      expect(wrapper.emitted('onClearSearch')).toBeTruthy()
    })

    it('must not emit "onClearSearch" when the search event fires with content', async () => {
      wrapper = mount(SearchFormListTable, {
        props: createProps({
          modelValue: 'test',
          hasSearched: true
        })
      })

      const input = wrapper.find('input[type="search"]')
      await input.trigger('search')
      await nextTick()

      // The modelValue is still 'test', so no clear should be emitted
      expect(wrapper.emitted('onClearSearch')).toBeFalsy()
    })
  })

  // ============================================================
  // 6. LOADING STATE
  // ============================================================
  describe('Loading state', () => {
    it('must disable the input when isLoading is true', () => {
      wrapper = mount(SearchFormListTable, {
        props: createProps({ isLoading: true })
      })

      const input = wrapper.find('input[type="search"]')
      expect(input.attributes('disabled')).toBeDefined()
    })

    it('must disable the submit button when isLoading is true', () => {
      wrapper = mount(SearchFormListTable, {
        props: createProps({ isLoading: true, modelValue: 'test' })
      })

      const submitButton = wrapper.find('button[type="submit"]')
      expect(submitButton.attributes('disabled')).toBeDefined()
    })

    it('must disable the clear button when isLoading is true', () => {
      wrapper = mount(SearchFormListTable, {
        props: createProps({
          isLoading: true,
          hasSearched: true,
          modelValue: 'test'
        })
      })

      const clearButton = wrapper.findAll('button').find((b) => b.text().includes('Limpiar'))
      expect(clearButton?.attributes('disabled')).toBeDefined()
    })

    it('must show a spinner in the submit button when isLoading is true', () => {
      wrapper = mount(SearchFormListTable, {
        props: createProps({ isLoading: true, modelValue: 'test' })
      })

      const spinner = wrapper.find('.spinner-border')
      expect(spinner.exists()).toBe(true)
    })

    it('must not show a spinner when isLoading is false', () => {
      wrapper = mount(SearchFormListTable, {
        props: createProps({ isLoading: false, modelValue: 'test' })
      })

      const spinner = wrapper.find('.spinner-border')
      expect(spinner.exists()).toBe(false)
    })
  })

  // ============================================================
  // 7. SUBMIT BUTTON DISABLED STATE
  // ============================================================
  describe('Submit button disabled state', () => {
    it('must disable the submit button when modelValue is empty', () => {
      wrapper = mount(SearchFormListTable, {
        props: createProps({ modelValue: '', isLoading: false })
      })

      const submitButton = wrapper.find('button[type="submit"]')
      expect(submitButton.attributes('disabled')).toBeDefined()
    })

    it('must disable the submit button when modelValue is only whitespace', () => {
      wrapper = mount(SearchFormListTable, {
        props: createProps({ modelValue: '   ', isLoading: false })
      })

      const submitButton = wrapper.find('button[type="submit"]')
      expect(submitButton.attributes('disabled')).toBeDefined()
    })

    it('must enable the submit button when modelValue has content', () => {
      wrapper = mount(SearchFormListTable, {
        props: createProps({ modelValue: 'test', isLoading: false })
      })

      const submitButton = wrapper.find('button[type="submit"]')
      expect(submitButton.attributes('disabled')).toBeUndefined()
    })
  })

  // ============================================================
  // 8. SEARCH INDICATOR
  // ============================================================
  describe('Search indicator', () => {
    it('must show the search indicator when hasSearched is true and modelValue is set', () => {
      wrapper = mount(SearchFormListTable, {
        props: createProps({
          hasSearched: true,
          modelValue: 'test'
        })
      })

      expect(wrapper.text()).toContain('Mostrando resultados para')
      expect(wrapper.text()).toContain('test')
    })

    it('must hide the search indicator when hasSearched is false', () => {
      wrapper = mount(SearchFormListTable, {
        props: createProps({
          hasSearched: false,
          modelValue: 'test'
        })
      })

      expect(wrapper.text()).not.toContain('Mostrando resultados para')
    })

    it('must hide the search indicator when modelValue is empty', () => {
      wrapper = mount(SearchFormListTable, {
        props: createProps({
          hasSearched: true,
          modelValue: ''
        })
      })

      expect(wrapper.text()).not.toContain('Mostrando resultados para')
    })
  })

  // ============================================================
  // 9. INTEGRATION
  // ============================================================
  describe('Integration', () => {
    it('must handle a full search workflow', async () => {
      wrapper = mount(SearchFormListTable, {
        props: createProps({ modelValue: 'search term' }),
        attachTo: document.body
      })

      const submitButton = wrapper.find('button[type="submit"]')
      await submitButton.trigger('click')

      expect(wrapper.emitted('onHandleSearch')).toBeTruthy()
    })

    it('must handle a full clear workflow', async () => {
      wrapper = mount(SearchFormListTable, {
        props: createProps({
          modelValue: 'search term',
          hasSearched: true
        })
      })

      const clearButton = wrapper.findAll('button').find((b) => b.text().includes('Limpiar'))
      await clearButton!.trigger('click')

      expect(wrapper.emitted('onClearSearch')).toBeTruthy()
    })
  })
})
