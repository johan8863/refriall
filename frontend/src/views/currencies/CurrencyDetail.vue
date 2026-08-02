<script setup>
// vue
import { onMounted } from 'vue'
import { useRoute } from 'vue-router'

// app
import { currencyService } from '../../services/currencyService'
import CurrencyDetailMenu from '../../components/currencies/menus/CurrencyDetailMenu.vue'
import { useResourceLoader } from '../../composables/useResourceLoader.js'

// Routing
const route = useRoute()

// Resource loader with integrated error handling
const {
  data: currency,
  isLoading,
  errorMessage,
  load: loadCurrency
} = useResourceLoader(currencyService.detailCurrency, {
  initialData: {
    id: null,
    name: '',
    description: ''
  },
  objectName: 'Moneda',
  gender: 'f',
  onError: (err) => {
    console.error('Error loading currency:', err)
  }
})

// Lifecycle
onMounted(async () => {
  await loadCurrency(route.params.id)
})
</script>

<template>
  <div class="row">
    <!-- side menu -->
    <div class="col-md-2">
      <currency-detail-menu :is-loading="isLoading" :currency="currency" />
    </div>

    <!-- main content -->

    <!-- loading currency data -->
    <div v-if="isLoading" class="col-md-4">
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

    <!-- displaying currency data -->
    <div v-else class="col-md-4">
      <h3>{{ currency.name }}</h3>
      <p>{{ currency.description || 'Sin descripción' }}</p>
    </div>
  </div>
</template>
