import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { mount, type VueWrapper } from '@vue/test-utils'
import { nextTick } from 'vue'
import DeleteModal from '../DeleteModal.vue'

// Helper to build modal fields
const createFields = () => [
  { key: 'name', label: 'Nombre', value: 'Test Item' },
  { key: 'code', label: 'Código', value: 'CODE-001' }
]

describe('DeleteModal', () => {
  let wrapper: VueWrapper

  // Shared props factory
  const createProps = (overrides: Record<string, unknown> = {}) => ({
    show: true,
    title: 'Confirmar Eliminación',
    itemName: 'el item',
    itemId: 1,
    itemIdentifier: 'Test Item',
    isDeleting: false,
    errorMessage: null,
    itemFields: [],
    variant: 'danger' as const,
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
    it('must render when show is true', () => {
      wrapper = mount(DeleteModal, {
        props: createProps({ show: true })
      })

      expect(wrapper.find('.modal').exists()).toBe(true)
      expect(wrapper.find('.modal').classes()).toContain('show')
      expect(wrapper.find('.modal').attributes('style')).toContain('display: block')
    })

    it('must not be visible when show is false', () => {
      wrapper = mount(DeleteModal, {
        props: createProps({ show: false })
      })

      expect(wrapper.find('.modal').classes()).not.toContain('show')
      expect(wrapper.find('.modal').attributes('style')).toContain('display: none')
    })

    it('must render the title', () => {
      wrapper = mount(DeleteModal, {
        props: createProps({ title: 'Custom Title' })
      })

      expect(wrapper.find('.modal-title').text()).toContain('Custom Title')
    })

    it('must render the item name in the confirmation message', () => {
      wrapper = mount(DeleteModal, {
        props: createProps({ itemName: 'el cliente' })
      })

      expect(wrapper.text()).toContain('¿Está seguro que desea eliminar el cliente?')
    })

    it('must render the modal backdrop when visible', () => {
      wrapper = mount(DeleteModal, {
        props: createProps({ show: true })
      })

      expect(wrapper.find('.modal-backdrop').exists()).toBe(true)
    })

    it('must not render the modal backdrop when not visible', () => {
      wrapper = mount(DeleteModal, {
        props: createProps({ show: false })
      })

      expect(wrapper.find('.modal-backdrop').exists()).toBe(false)
    })
  })

  // ============================================================
  // 2. VARIANT CLASSES
  // ============================================================
  describe('Variant classes', () => {
    it('must apply danger variant by default', () => {
      wrapper = mount(DeleteModal, {
        props: createProps({ variant: 'danger' })
      })

      expect(wrapper.find('.modal-header').classes()).toContain('bg-danger')
    })

    it('must apply warning variant', () => {
      wrapper = mount(DeleteModal, {
        props: createProps({ variant: 'warning' })
      })

      expect(wrapper.find('.modal-header').classes()).toContain('bg-warning')
    })

    it('must apply info variant', () => {
      wrapper = mount(DeleteModal, {
        props: createProps({ variant: 'info' })
      })

      expect(wrapper.find('.modal-header').classes()).toContain('bg-info')
    })

    it('must apply the variant to the confirm button', () => {
      wrapper = mount(DeleteModal, {
        props: createProps({ variant: 'warning' })
      })

      const confirmButton = wrapper.find('.modal-footer button')
      expect(confirmButton.classes()).toContain('btn-warning')
    })
  })

  // ============================================================
  // 3. ITEM FIELDS DISPLAY
  // ============================================================
  describe('Item fields display', () => {
    it('must render custom fields when itemFields is provided', () => {
      wrapper = mount(DeleteModal, {
        props: createProps({ itemFields: createFields() })
      })

      const text = wrapper.text()
      expect(text).toContain('Nombre:')
      expect(text).toContain('Test Item')
      expect(text).toContain('Código:')
      expect(text).toContain('CODE-001')
    })

    it('must render itemIdentifier and itemId when itemFields is empty', () => {
      wrapper = mount(DeleteModal, {
        props: createProps({
          itemFields: [],
          itemIdentifier: 'My Item',
          itemId: 42
        })
      })

      const text = wrapper.text()
      expect(text).toContain('Nombre:')
      expect(text).toContain('My Item')
      expect(text).toContain('ID:')
      expect(text).toContain('42')
    })

    it('must show "No especificado" when field value is null', () => {
      wrapper = mount(DeleteModal, {
        props: createProps({
          itemFields: [{ key: 'name', label: 'Nombre', value: null }]
        })
      })

      expect(wrapper.text()).toContain('No especificado')
    })

    it('must show "No especificado" when field value is undefined', () => {
      wrapper = mount(DeleteModal, {
        props: createProps({
          itemFields: [{ key: 'name', label: 'Nombre', value: undefined }]
        })
      })

      expect(wrapper.text()).toContain('No especificado')
    })

    it('must not render itemIdentifier when it is empty', () => {
      wrapper = mount(DeleteModal, {
        props: createProps({
          itemFields: [],
          itemIdentifier: '',
          itemId: 1
        })
      })

      const text = wrapper.text()
      expect(text).not.toContain('Nombre:')
      expect(text).toContain('ID:')
    })
  })

  // ============================================================
  // 4. EVENT EMISSIONS
  // ============================================================
  describe('Event emissions', () => {
    it('must emit "confirm" when confirm button is clicked', async () => {
      wrapper = mount(DeleteModal, {
        props: createProps()
      })

      const confirmButton = wrapper.findAll('.modal-footer button')[0]
      await confirmButton.trigger('click')

      expect(wrapper.emitted()).toHaveProperty('confirm')
      expect(wrapper.emitted('confirm')).toHaveLength(1)
    })

    it('must emit "cancel" when cancel button is clicked', async () => {
      wrapper = mount(DeleteModal, {
        props: createProps()
      })

      const cancelButton = wrapper.findAll('.modal-footer button')[1]
      await cancelButton.trigger('click')

      expect(wrapper.emitted()).toHaveProperty('cancel')
      expect(wrapper.emitted('cancel')).toHaveLength(1)
    })

    it('must emit "cancel" when close button in header is clicked', async () => {
      wrapper = mount(DeleteModal, {
        props: createProps()
      })

      const closeButton = wrapper.find('.btn-close')
      await closeButton.trigger('click')

      expect(wrapper.emitted()).toHaveProperty('cancel')
    })

    it('must emit "update:show" with false when cancel is clicked', async () => {
      wrapper = mount(DeleteModal, {
        props: createProps({ show: true })
      })

      const cancelButton = wrapper.findAll('.modal-footer button')[1]
      await cancelButton.trigger('click')

      expect(wrapper.emitted('update:show')).toBeTruthy()
      expect(wrapper.emitted('update:show')?.[0]).toEqual([false])
    })
  })

  // ============================================================
  // 5. IS DELETING STATE
  // ============================================================
  describe('isDeleting state', () => {
    it('must disable the confirm button when isDeleting is true', () => {
      wrapper = mount(DeleteModal, {
        props: createProps({ isDeleting: true })
      })

      const confirmButton = wrapper.findAll('.modal-footer button')[0]
      expect(confirmButton.attributes('disabled')).toBeDefined()
    })

    it('must disable the cancel button when isDeleting is true', () => {
      wrapper = mount(DeleteModal, {
        props: createProps({ isDeleting: true })
      })

      const cancelButton = wrapper.findAll('.modal-footer button')[1]
      expect(cancelButton.attributes('disabled')).toBeDefined()
    })

    it('must disable the close button when isDeleting is true', () => {
      wrapper = mount(DeleteModal, {
        props: createProps({ isDeleting: true })
      })

      const closeButton = wrapper.find('.btn-close')
      expect(closeButton.attributes('disabled')).toBeDefined()
    })

    it('must show spinner when isDeleting is true', () => {
      wrapper = mount(DeleteModal, {
        props: createProps({ isDeleting: true })
      })

      expect(wrapper.find('.spinner-border').exists()).toBe(true)
    })

    it('must show "Eliminando..." text when isDeleting is true', () => {
      wrapper = mount(DeleteModal, {
        props: createProps({ isDeleting: true })
      })

      expect(wrapper.text()).toContain('Eliminando...')
    })

    it('must show "Eliminar" text when isDeleting is false', () => {
      wrapper = mount(DeleteModal, {
        props: createProps({ isDeleting: false })
      })

      expect(wrapper.text()).toContain('Eliminar')
      expect(wrapper.text()).not.toContain('Eliminando...')
    })
  })

  // ============================================================
  // 6. ERROR MESSAGE STATE
  // ============================================================
  describe('errorMessage state', () => {
    it('must display the error message when provided', () => {
      wrapper = mount(DeleteModal, {
        props: createProps({ errorMessage: 'No se puede eliminar' })
      })

      expect(wrapper.find('.alert-danger').exists()).toBe(true)
      expect(wrapper.text()).toContain('No se puede eliminar')
    })

    it('must hide the confirmation content when errorMessage is set', () => {
      wrapper = mount(DeleteModal, {
        props: createProps({ errorMessage: 'Error' })
      })

      expect(wrapper.text()).not.toContain('¿Está seguro que desea eliminar')
    })

    it('must hide the confirm button when errorMessage is set', () => {
      wrapper = mount(DeleteModal, {
        props: createProps({ errorMessage: 'Error' })
      })

      const footerButtons = wrapper.findAll('.modal-footer button')
      expect(footerButtons).toHaveLength(1)
      expect(footerButtons[0].text()).toContain('Cancelar')
    })

    it('must show the confirm button when errorMessage is null', () => {
      wrapper = mount(DeleteModal, {
        props: createProps({ errorMessage: null })
      })

      const footerButtons = wrapper.findAll('.modal-footer button')
      expect(footerButtons.length).toBeGreaterThanOrEqual(2)
    })
  })

  // ============================================================
  // 7. WATCH ON SHOW
  // ============================================================
  describe('Watch on show prop', () => {
    it('must save previously focused element when opened', async () => {
      // Create a button that will have focus
      const externalButton = document.createElement('button')
      externalButton.id = 'external-button'
      document.body.appendChild(externalButton)
      externalButton.focus()

      expect(document.activeElement).toBe(externalButton)

      wrapper = mount(DeleteModal, {
        props: createProps({ show: false })
      })

      await wrapper.setProps({ show: true })
      await nextTick()

      // The focused element should still be externalButton since focus restoration happens on close
      expect(document.activeElement).toBe(externalButton)

      document.body.removeChild(externalButton)
    })

    it('must restore focus to previously focused element when closed', async () => {
      // Create a button that will have focus
      const externalButton = document.createElement('button')
      externalButton.id = 'external-button'
      document.body.appendChild(externalButton)
      externalButton.focus()

      wrapper = mount(DeleteModal, {
        props: createProps({ show: false })
      })

      // Open the modal
      await wrapper.setProps({ show: true })
      await nextTick()

      // Close the modal
      await wrapper.setProps({ show: false })
      await nextTick()
      await nextTick() // Extra tick for the async focus restoration

      expect(document.activeElement).toBe(externalButton)

      document.body.removeChild(externalButton)
    })
  })

  // ============================================================
  // 8. BODY CONTENT
  // ============================================================
  describe('Body content', () => {
    it('must show the warning message about irreversible action', () => {
      wrapper = mount(DeleteModal, {
        props: createProps()
      })

      expect(wrapper.text()).toContain('Esta acción no se puede deshacer')
    })

    it('must render the item info in a warning alert', () => {
      wrapper = mount(DeleteModal, {
        props: createProps()
      })

      expect(wrapper.find('.alert-warning').exists()).toBe(true)
    })
  })

  // ============================================================
  // 9. INTEGRATION
  // ============================================================
  describe('Integration', () => {
    it('must handle the full confirm flow', async () => {
      wrapper = mount(DeleteModal, {
        props: createProps({ isDeleting: false })
      })

      const confirmButton = wrapper.findAll('.modal-footer button')[0]
      await confirmButton.trigger('click')

      expect(wrapper.emitted('confirm')).toHaveLength(1)
      // Since we only emit, the parent controls isDeleting
      expect(wrapper.emitted('update:show')).toBeFalsy()
    })

    it('must handle the full cancel flow', async () => {
      wrapper = mount(DeleteModal, {
        props: createProps({ show: true })
      })

      const cancelButton = wrapper.findAll('.modal-footer button')[1]
      await cancelButton.trigger('click')

      expect(wrapper.emitted('cancel')).toHaveLength(1)
      expect(wrapper.emitted('update:show')?.[0]).toEqual([false])
    })

    it('must hide the confirm button when there is an error and allow cancel', async () => {
      wrapper = mount(DeleteModal, {
        props: createProps({
          errorMessage: 'No se puede eliminar',
          show: true
        })
      })

      // Only cancel button is present
      const buttons = wrapper.findAll('.modal-footer button')
      expect(buttons).toHaveLength(1)

      // Click cancel
      await buttons[0].trigger('click')

      expect(wrapper.emitted('cancel')).toHaveLength(1)
      expect(wrapper.emitted('confirm')).toBeFalsy()
    })
  })

  // ============================================================
  // 10. ACCESSIBILITY
  // ============================================================
  describe('Accessibility', () => {
    it('must set aria-hidden to false when visible', () => {
      wrapper = mount(DeleteModal, {
        props: createProps({ show: true })
      })

      expect(wrapper.find('.modal').attributes('aria-hidden')).toBe('false')
    })

    it('must set aria-hidden to true when not visible', () => {
      wrapper = mount(DeleteModal, {
        props: createProps({ show: false })
      })

      expect(wrapper.find('.modal').attributes('aria-hidden')).toBe('true')
    })

    it('must have aria-label on the close button', () => {
      wrapper = mount(DeleteModal, {
        props: createProps()
      })

      const closeButton = wrapper.find('.btn-close')
      expect(closeButton.attributes('aria-label')).toBe('Close')
    })
  })
})
