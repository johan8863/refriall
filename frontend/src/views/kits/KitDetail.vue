<script setup>
// vue
import { onMounted } from 'vue'
import { useRoute } from 'vue-router'

// app
import { kitService } from '../../services/kitService'
import KitDetailMenu from '../../components/kits/menus/KitDetailMenu.vue'
import { useResourceLoader } from '../../composables/useResourceLoader.js'

// Routing
const route = useRoute()

// Resource loader with integrated error handling
const {
  data: kit,
  isLoading,
  errorMessage,
  load: loadKit
} = useResourceLoader(kitService.detailKit, {
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

// Lifecycle
onMounted(async () => {
  await loadKit(route.params.id)
})
</script>

<template>
  <div class="row">
    <!-- side menu -->
    <div class="col-md-2">
      <kit-detail-menu :kit="kit" :is-loading="isLoading" />
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
      <p><strong>Nombre:</strong> {{ kit.name }}</p>
    </div>
  </div>
  <!-- end row -->
</template>
