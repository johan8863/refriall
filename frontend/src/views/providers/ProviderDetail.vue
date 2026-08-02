<script setup>
// vue
import { onMounted } from 'vue'
import { useRoute } from 'vue-router'

// app
import { providerService } from '../../services/providerService'
import ProviderDetailMenu from '../../components/providers/menus/ProviderDetailMenu.vue'
import { useResourceLoader } from '../../composables/useResourceLoader.js'

// Routing
const route = useRoute()

// Resource loader with integrated error handling
const {
  data: provider,
  isLoading,
  errorMessage,
  load: loadProvider
} = useResourceLoader(providerService.detailProvider, {
  initialData: {
    id: null,
    username: '',
    first_name: '',
    last_name: '',
    license_number: '',
    tcp_code: '',
    personal_id: '',
    bank_account_header: '',
    bank_account: ''
  },
  objectName: 'Proveedor',
  gender: 'm',
  onError: (err) => {
    console.error('Error loading provider:', err)
  }
})

// Computed
const fullName = () => {
  if (!provider.value) return ''
  return (
    `${provider.value.first_name || ''} ${provider.value.last_name || ''}`.trim() || 'Sin nombre'
  )
}

// Lifecycle
onMounted(async () => {
  await loadProvider(route.params.id)
})
</script>

<template>
  <div class="row">
    <!-- side menu -->
    <div class="col-md-2">
      <provider-detail-menu :provider="provider" :is-loading="isLoading" />
    </div>

    <!-- loading provider data -->
    <div v-if="isLoading" class="col-md-4">
      <div class="d-flex justify-content-center align-items-center" style="min-height: 200px">
        <span role="status" class="text-primary">Cargando datos... </span>
        <span class="spinner-border spinner-border-sm text-primary" aria-hidden="true"></span>
      </div>
    </div>

    <!-- error message -->
    <div v-else-if="errorMessage" class="col-md-4">
      <span class="form-text text-danger">
        {{ errorMessage }}
      </span>
    </div>

    <!-- main content -->
    <div v-else class="col-md-4">
      <h3>{{ fullName() }}</h3>
      <hr />
      <p><strong>Nombre de usuario:</strong> {{ provider.username || 'No especificado' }}</p>
      <p><strong>CI:</strong> {{ provider.personal_id || 'No especificado' }}</p>
      <p><strong>Licencia:</strong> {{ provider.license_number || 'No especificada' }}</p>
      <p><strong>Código TCP:</strong> {{ provider.tcp_code || 'No especificado' }}</p>
      <p>
        <strong>Titular de Cuenta:</strong> {{ provider.bank_account_header || 'No especificado' }}
      </p>
      <p><strong>Nro de Cuenta:</strong> {{ provider.bank_account || 'No especificado' }}</p>
    </div>
  </div>
  <!-- end row -->
</template>
