<script setup lang="ts">
import { computed } from 'vue'

interface Field {
  key: string
  label: string
  value: string | number | null | undefined
}

interface Props {
  show: boolean
  title?: string
  itemName?: string
  itemId?: string | number | null
  itemIdentifier?: string
  isDeleting?: boolean
  errorMessage?: string | null
  itemFields?: Field[]
  variant?: 'danger' | 'warning' | 'info'
}

const props = withDefaults(defineProps<Props>(), {
  show: false,
  title: 'Confirmar Eliminación',
  itemName: 'Elemento',
  itemId: null,
  itemIdentifier: '',
  isDeleting: false,
  itemFields: () => [],
  variant: 'danger'
})

const emit = defineEmits<{
  (e: 'update:show', value?: boolean): void
  (e: 'confirm'): void
  (e: 'cancel'): void
}>()

// Computed para controlar visibilidad
const isVisible = computed({
  get: () => props.show,
  set: (value: boolean) => emit('update:show', value)
})

// Methods
const closeModal = (): void => {
  isVisible.value = false
  emit('cancel')
}

const confirmDelete = (): void => {
  emit('confirm')
}

// Computed classes
const headerClass = computed(() => `bg-${props.variant} text-white`)
const iconClass = computed(() =>
  props.variant === 'danger' ? 'bi bi-exclamation-triangle' : 'bi bi-exclamation-circle'
)
</script>

<template>
  <!-- Modal -->
  <div
    class="modal fade"
    :class="{ show: isVisible }"
    :style="{ display: isVisible ? 'block' : 'none' }"
    tabindex="-1"
    aria-hidden="true"
  >
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content">
        <!-- Header -->
        <div class="modal-header" :class="headerClass">
          <h5 class="modal-title"><i :class="iconClass"></i> {{ title }}</h5>
          <button
            type="button"
            class="btn-close btn-close-white"
            @click="closeModal"
            :disabled="isDeleting"
            aria-label="Close"
          ></button>
        </div>

        <!-- Body -->
        <div class="modal-body">
          <!-- Error message -->
          <div v-if="errorMessage" class="alert alert-danger">
            <i class="bi bi-exclamation-circle"></i> {{ errorMessage }}
          </div>

          <!-- Confirmation content -->
          <template v-else>
            <p class="fs-6">¿Está seguro que desea eliminar {{ itemName }}?</p>

            <!-- Item info -->
            <div class="alert alert-warning">
              <template v-if="itemFields && itemFields.length > 0">
                <p v-for="field in itemFields" :key="field.key" class="mb-1">
                  <strong>{{ field.label }}:</strong> {{ field.value || 'No especificado' }}
                </p>
              </template>
              <template v-else>
                <p v-if="itemIdentifier" class="mb-1">
                  <strong>Nombre:</strong> {{ itemIdentifier }}
                </p>
                <p v-if="itemId" class="mb-0"><strong>ID:</strong> {{ itemId }}</p>
              </template>
            </div>

            <p class="text-danger mb-0">
              <small>
                <i class="bi bi-exclamation-circle"></i>
                Esta acción no se puede deshacer.
              </small>
            </p>
          </template>
        </div>

        <!-- Footer -->
        <div class="modal-footer">
          <button
            v-if="!errorMessage"
            type="button"
            :class="`btn btn-${variant}`"
            @click="confirmDelete"
            :disabled="isDeleting"
          >
            <span
              v-if="isDeleting"
              class="spinner-border spinner-border-sm me-1"
              role="status"
            ></span>
            <i v-else class="bi bi-trash"></i>
            {{ isDeleting ? 'Eliminando...' : 'Eliminar' }}
          </button>
          <button
            type="button"
            class="btn btn-secondary"
            @click="closeModal"
            :disabled="isDeleting"
          >
            <i class="bi bi-x-circle"></i> Cancelar
          </button>
        </div>
      </div>
    </div>
  </div>

  <!-- Modal backdrop -->
  <div v-if="isVisible" class="modal-backdrop fade show"></div>
</template>

<style scoped>
.modal-backdrop {
  z-index: 1040;
}

.modal {
  z-index: 1050;
  background-color: rgba(0, 0, 0, 0.5);
}

.modal-content {
  border: none;
  border-radius: 0.5rem;
  box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.15);
}

.modal-header {
  border-radius: 0.5rem 0.5rem 0 0;
}

.modal-footer {
  border-top: 1px solid #dee2e6;
  border-radius: 0 0 0.5rem 0.5rem;
}

.btn-close-white {
  filter: invert(1);
}

/* Animación de entrada */
.modal.fade .modal-dialog {
  transition:
    transform 0.3s ease-out,
    opacity 0.3s ease-out;
  transform: scale(0.8);
  opacity: 0;
}

.modal.fade.show .modal-dialog {
  transform: scale(1);
  opacity: 1;
}

.modal-backdrop.fade {
  opacity: 0;
  transition: opacity 0.3s ease-out;
}

.modal-backdrop.fade.show {
  opacity: 0.5;
}
</style>
