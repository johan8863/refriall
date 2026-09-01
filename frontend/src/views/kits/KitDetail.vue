<script setup lang="ts">
// vue
import { onMounted, ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'

// app
import type { Kit } from './types'
import { kitService } from '../../services/kitService'
import KitDetailMenu from '../../components/kits/menus/KitDetailMenu.vue'
import DeleteModal from '../../components/common/DeleteModal.vue'
import { useResourceLoader } from '../../composables/useResourceLoader'
import { useErrorHandler } from '../../composables/useErrorHandler'

// hello dear typescript...
// this is the first fragment of typescript code to test the dev
// dependencies installed
import { sum, greet, type User } from '../../utils/helloTS'

const result = sum(4, 7)
const hello = greet('Gisela')
const johan: User = {
  id: 1,
  firstName: 'Johan',
  email: 'jtravieso8863@gmail.com'
}

// refriall code

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
  objectName: 'Equipo'
})

// Resource loader with integrated error handling
const {
  data: kit,
  isLoading,
  errorMessage,
  load: loadKit
} = useResourceLoader<Kit>(kitService.detailKit, {
  initialData: {
    id: null,
    name: ''
  },
  objectName: 'Equipo',
  gender: 'm',
  onError: (err) => {
    console.error('Error loading kit:', err)
  }
})

// Computed for modal fields
const deleteModalFields = computed(() => {
  return [
    {
      key: 'name',
      label: 'Nombre',
      value: kit.value?.name
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
    await kitService.deleteKit(kit.value.id)
    closeDeleteModal()
    router.push({ name: 'kits' })
  } catch (error) {
    console.error('Error deleting kit:', error)
    handleError(error)
    isDeleting.value = false
  }
}

// Lifecycle
onMounted(async () => await loadKit(route.params.id))
</script>

<template>
  <div class="row">
    <!-- side menu -->
    <div class="col-md-2">
      <KitDetailMenu :kit="kit" :is-loading="isLoading" @on-delete="openDeleteModal" />
    </div>

    <!-- main content -->

    <!-- loading kit data -->
    <div v-if="isLoading" class="col-md-6">
      <div class="d-flex justify-content-center align-items-center" style="min-height: 200px">
        <span role="status" class="text-primary">Cargando datos... </span>
        <span class="spinner-border spinner-border-sm text-primary" aria-hidden="true"></span>
      </div>
    </div>

    <!-- error message -->
    <div v-else-if="errorMessage" class="col-md-4">
      <p class="form-text text-danger">
        {{ errorMessage }}
      </p>
    </div>

    <!-- displaying kit data -->
    <div v-else class="col-md-4">
      <h3>{{ kit.name }}</h3>
      <hr />
      <p><strong>ID:</strong> {{ kit.id }}</p>
      <p><strong>Nombre:</strong> {{ kit.name }}</p>
    </div>
  </div>
  <!-- end row -->

  <!-- Delete Confirmation Modal -->
  <DeleteModal
    v-model:show="showDeleteModal"
    title="Confirmar Eliminación"
    item-name="el equipo"
    :item-id="kit?.id"
    :item-identifier="kit?.name"
    :item-fields="deleteModalFields"
    :is-deleting="isDeleting"
    :error-message="deletingError"
    variant="danger"
    @confirm="confirmDelete"
    @cancel="closeDeleteModal"
  />
</template>
