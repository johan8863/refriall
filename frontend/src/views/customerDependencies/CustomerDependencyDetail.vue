<script setup>
// vue
import { onMounted } from 'vue'
import { useRoute } from 'vue-router'

// app
import { customerDependecyService } from '../../services/customerDependencyService'
import CustomerDependencyDetailMenu from '../../components/customerDependencies/menus/CustomerDependencyDetailMenu.vue'
import { useResourceLoader } from '../../composables/useResourceLoader.js'

// Routing
const route = useRoute()

// Resource loader with integrated error handling
const {
  data: dependency,
  isLoading,
  errorMessage: customerDependencyBackendErrors,
  load: loadDependency
} = useResourceLoader(customerDependecyService.detailCustomerDependecy, {
  initialData: {
    id: null,
    customer: null,
    name: '',
    address: '',
    province: '',
    township: ''
  },
  objectName: 'Dependencia',
  gender: 'f',
  onError: (err) => {
    console.error('Error loading dependency:', err)
  }
})

// Lifecycle
onMounted(async () => {
  await loadDependency(route.params.id)
})
</script>

<template>
  <div class="row">
    <!-- side menu -->
    <div class="col-md-2">
      <customer-dependency-detail-menu :is-loading="isLoading" :dependency="dependency" />
    </div>

    <!-- main content -->

    <!-- loading dependency data -->
    <div v-if="isLoading" class="col-md-4">
      <div class="d-flex justify-content-center align-items-center" style="min-height: 200px">
        <span role="status" class="text-primary">Cargando datos... </span>
        <span class="spinner-border spinner-border-sm text-primary" aria-hidden="true"></span>
      </div>
    </div>

    <!-- errors -->
    <div v-else-if="customerDependencyBackendErrors" class="col-md-4">
      <p class="form-text text-danger">
        {{ customerDependencyBackendErrors }}
      </p>
    </div>

    <!-- displaying dependency data -->
    <div v-else class="col-md-4">
      <h3>{{ dependency.name }}</h3>
      <hr />
      <p><strong>Nombre:</strong> {{ dependency.name }}</p>
      <p><strong>Dirección:</strong> {{ dependency.address || 'No especificada' }}</p>
      <p><strong>Provincia:</strong> {{ dependency.province || 'No especificada' }}</p>
      <p><strong>Municipio:</strong> {{ dependency.township || 'No especificado' }}</p>
      <p v-if="dependency.customer">
        <strong>Cliente:</strong> {{ dependency.customer.name || 'No especificado' }}
      </p>
    </div>
  </div>
</template>
