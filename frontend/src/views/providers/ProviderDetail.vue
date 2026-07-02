<script setup>
// vue
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'

// app
import { providerService } from '../../services/providerService'
import ProviderDetailMenu from '../../components/providers/menus/ProviderDetailMenu.vue'
import { errorHandler } from '../../utils/errors/errorHandler.js'

// main object
const provider = ref({
  id: '',
  username: '',
  first_name: '',
  last_name: '',
  license_number: '',
  tcp_code: '',
  personal_id: '',
  bank_account_header: '',
  bank_account: '',
  license_number: ''
})

// loading state
const isLoading = ref(true)

const errorMessage = ref(null)

// routing utilities
const route = useRoute()

// lifecycle
onMounted(async () => {
  try {
    isLoading.value = true

    const resp = await providerService.detailProvider(route.params.id)
    console.log(route.params.id)

    provider.value = resp.data
  } catch (error) {
    console.error('General error', error)
    errorHandler(error, errorMessage)
  } finally {
    isLoading.value = false
  }
})
</script>

<template>
  <div class="row">
    <!-- side menu -->
    <div v-if="provider.id" class="col-md-2">
      <provider-detail-menu :provider="provider" />
    </div>

    <!-- loading order data -->
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
      <h3>{{ provider.first_name }}</h3>
      <p>CI: {{ provider.personal_id }}</p>
      <p>Lic.: {{ provider.license_number }}</p>
      <p>TCP: {{ provider.tcp_code }}</p>
      <p>Titular de Cuenta: {{ provider.bank_account_header }}</p>
      <p>Nro de Cuenta: {{ provider.bank_account }}</p>
    </div>
  </div>
  <!-- end row -->
</template>
