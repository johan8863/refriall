<script setup>
// vue
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'

// app
import { customerService } from '../../services/customerService'
import CustomerConfirmDeleteMenu from '../../components/customers/menus/CustomerConfirmDeleteMenu.vue'

// customer object to be filled
const customer = ref({
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

// errors holder object
const errorMessage = ref(null)

// routing utilities
const router = useRouter()
const route = useRoute()

// lifecycle
onMounted(async () => {
  try {
    const resp = await customerService.detailCustomer(route.params.id)
    customer.value = resp.data
  } catch (error) {
    onsole.log('Error status:', error.response.status)
    console.log('Error data:', error.response.data)
    if (error.response) {
      if (error.response.status === 404) {
        errorMessage.value = 'Cliente no encontrado.'
      }
    } else if (error.request) {
      errorMessage.value = 'Error del Servidor, consulte al desarrollador.'
    }
  }
})

// methods
const delCustomer = async (id) => {
  try {
    await customerService.deleteCustomer(id)
    router.push({ name: 'customers' })
  } catch (error) {
    console.log('Error status:', error.response.status)
    console.log('Error data:', error.response.data)
    if (error.response) {
      if (error.response.status === 404) {
        errorMessage.value = 'Cliente no encontrado.'
      }
      if (error.response.status === 400) {
        errorMessage.value = 'Cliente asociado.'
      }
    } else if (error.request) {
      errorMessage.value = 'Error del Servidor, consulte al desarrollador.'
    }
  }
}
</script>

<template>
  <div class="row">
    <!-- side menu -->
    <div class="col-md-2">
      <CustomerConfirmDeleteMenu :customer="customer" />
    </div>

    <!-- main content -->
    <div class="col-md-4">
      <!-- backend general errors -->
      <span v-if="errorMessage">
        <p class="form-text text-danger">
          {{ errorMessage }}
        </p>
      </span>
      <p>Está seguro que desea eliminar el cliente: {{ customer.name }}?</p>
      <div>
        <button class="btn btn-sm btn-danger" @click="delCustomer(customer.id)">Eliminar</button>
        <RouterLink
          :to="{ name: 'customers_detail', params: { id: customer.id } }"
          class="btn btn-sm btn-secondary"
          >Cancelar</RouterLink
        >
      </div>
    </div>
  </div>
  <!-- end row -->
</template>
