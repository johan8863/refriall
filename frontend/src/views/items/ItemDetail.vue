<script setup lang="ts">
// vue
import { ref } from 'vue'
import { onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'

// app
import { itemService } from '@/services/itemService'
import ItemDetailMenu from '@/components/items/menus/ItemDetailMenu.vue'
import DeleteModal from '@/components/common/DeleteModal.vue'
import { useResourceLoader } from '@/composables/useResourceLoader'
import { useErrorHandler } from '@/composables/useErrorHandler'
import type { Item } from './types'

// Routing
const route = useRoute()
const router = useRouter()

// State
const showDeleteModal = ref(false)
const isDeleting = ref(false)

// Error handler for deletion
const {
  errorMessage: deletingError,
  handleError,
  clearErrors
} = useErrorHandler({
  objectName: 'Artículo'
})

// Resource loader with integrated error handling
const {
  data: item,
  isLoading,
  errorMessage: itemBackendErrors,
  load: loadItem
} = useResourceLoader<Item>(itemService.detailItem, {
  initialData: {
    id: 0,
    code: '',
    name: '',
    item_type: 'prod',
    measurement: null,
    price: 0,
    get_item_type: '',
    get_measurement: null
  },
  objectName: 'Artículo',
  gender: 'm',
  onError: (err) => {
    console.error('Error loading item:', err)
  }
})

// Computed for modal fields
const deleteModalFields = computed(() => {
  return [
    { key: 'code', label: 'Código', value: item.value?.code },
    { key: 'name', label: 'Nombre', value: item.value?.name },
    { key: 'item_type', label: 'Tipo', value: item.value?.get_item_type },
    {
      key: 'price',
      label: 'Precio',
      value: item.value?.price ? `$${item.value.price.toFixed(2)}` : 'No especificado'
    }
  ]
})

// Delete methods
const openDeleteModal = () => {
  clearErrors()
  showDeleteModal.value = true
}

const closeDeleteModal = () => {
  showDeleteModal.value = false
}

const confirmDelete = async () => {
  isDeleting.value = true
  try {
    await itemService.deleteItem(item.value.id)
    closeDeleteModal()
    router.push({ name: 'items' })
  } catch (error) {
    console.error('Error deleting item:', error)
    handleError(error)
    isDeleting.value = false
  }
}

// Lifecycle
onMounted(async () => {
  await loadItem(route.params.id)
})
</script>

<template>
  <div class="row">
    <!-- side menu -->
    <div class="col-md-2">
      <ItemDetailMenu :is-loading="isLoading" :item="item" @on-delete="openDeleteModal" />
    </div>

    <!-- main content -->

    <!-- loading item data -->
    <div v-if="isLoading" class="col-md-6">
      <div class="d-flex justify-content-center align-items-center" style="min-height: 200px">
        <span role="status" class="text-primary">Cargando datos... </span>
        <span class="spinner-border spinner-border-sm text-primary" aria-hidden="true"></span>
      </div>
    </div>

    <!-- error message -->
    <div v-else-if="itemBackendErrors" class="col-md-6">
      <p class="form-text text-danger">
        {{ itemBackendErrors }}
      </p>
    </div>

    <!-- displaying item data -->
    <div v-else class="col-md-6">
      <h3>
        Artículo: <small>{{ item.name }}</small>
      </h3>
      <hr />
      <p><strong>Código:</strong> {{ item.code || 'No especificado' }}</p>
      <p><strong>Tipo:</strong> {{ item.get_item_type || 'No especificado' }}</p>
      <p><strong>U/M:</strong> {{ item.get_measurement || 'No especificado' }}</p>
      <p><strong>Precio:</strong> {{ (item.price || 0).toFixed(2) }}</p>
    </div>
  </div>
  <!-- end row -->

  <!-- Delete Confirmation Modal -->
  <DeleteModal
    v-model:show="showDeleteModal"
    title="Confirmar Eliminación"
    item-name="el artículo"
    :item-id="item?.id"
    :item-identifier="item?.name"
    :item-fields="deleteModalFields"
    :is-deleting="isDeleting"
    :error-message="deletingError"
    variant="danger"
    @confirm="confirmDelete"
    @cancel="closeDeleteModal"
  />
</template>
