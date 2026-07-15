<script setup>
// vue
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'

// app
import CustomerConfirmDeleteMenu from '../../components/customers/menus/CustomerConfirmDeleteMenu.vue'
import { customerService } from '../../services/customerService'
import { useErrorHandler } from '../../composables/useErrorHandler.js'
import { useRouting } from '../../composables/routingFunctions.js'

// customer object to be filled
const customer = ref({
  id: null,
  customer_type: '',
  name: '',
  address: '',
  province: '',
  township: '',
  code: '',
  client_nit: '',
  bank_account_header: '',
  bank_account: ''
})

// loading status
const isLoading = ref(false)

// errors holder object
const { errorMessage, handleError } = useErrorHandler({
  objectName: 'Cliente',
  gender: 'm'
})

// routing utilities
const router = useRouter()
const route = useRoute()

const { goToDetail } = useRouting()

const handleGoToDetail = () => {
  try {
    goToDetail('customers_detail', customer.value.id)
  } catch (error) {}
}

// methods
const getCustomer = async () => {
  // start loading state
  isLoading.value = true
  try {
    // getting data from backend
    const resp = await customerService.detailCustomer(route.params.id)
    customer.value = resp.data
  } catch (error) {
    console.error('General error:', { error })
    handleError(error)
  } finally {
    // stop loading state
    isLoading.value = false
  }
}

const delCustomer = async () => {
  // start loading state
  isLoading.value = true
  try {
    // performing deletion
    await customerService.deleteCustomer(customer.value.id)
    router.push({ name: 'customers' })
  } catch (error) {
    console.error('General error:', { error })
    handleError(error)
  } finally {
    // stop loading state
    isLoading.value = false
  }
}

// lifecycle
onMounted(async () => await getCustomer())
</script>

<template>
  <div class="row">
    <!-- side menu -->
    <div class="col-md-2">
      <CustomerConfirmDeleteMenu :is-loading="isLoading" :customer="customer" />
    </div>

    <!-- loading state -->
    <div v-if="isLoading" class="col-md-4">
      <div class="d-flex justify-content-center align-items-center" style="min-height: 200px">
        <span role="status" class="text-primary">Cargando datos... </span>
        <span class="spinner-border spinner-border-sm text-primary" aria-hidden="true"></span>
      </div>
    </div>

    <div v-else class="col-md-4">
      <!-- error message -->
      <div v-if="errorMessage">
        <span v-if="errorMessage">
          <p class="form-text text-danger">
            {{ errorMessage }}
          </p>
        </span>
      </div>

      <p>Está seguro que desea eliminar el cliente: {{ customer.name }}?</p>
      <div>
        <button class="btn btn-sm btn-danger" @click="delCustomer">Eliminar</button>
        <button class="btn btn-sm btn-secondary" @click="handleGoToDetail">Cancelar</button>
      </div>
    </div>
  </div>
  <!-- end row -->
</template>
