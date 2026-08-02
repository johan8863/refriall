<script setup>
// vue
import { onMounted } from 'vue'
import { useRoute } from 'vue-router'

// app
import { itemService } from '../../services/itemService'
import ItemDetailMenu from '../../components/items/menus/ItemDetailMenu.vue'
import { useResourceLoader } from '../../composables/useResourceLoader.js'

// Routing
const route = useRoute()

// Resource loader with integrated error handling
const {
  data: item,
  isLoading,
  errorMessage: itemBackendErrors,
  load: loadItem
} = useResourceLoader(itemService.detailItem, {
  initialData: {
    id: null,
    code: '',
    name: '',
    get_item_type: '',
    get_measurement: '',
    price: 0
  },
  objectName: 'Artículo',
  gender: 'm',
  onError: (err) => {
    console.error('Error loading item:', err)
  }
})

// Lifecycle
onMounted(async () => {
  await loadItem(route.params.id)
})
</script>

<template>
  <div class="row">
    <!-- side menu -->
    <div class="col-md-2">
      <ItemDetailMenu :is-loading="isLoading" :item="item" />
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
</template>
