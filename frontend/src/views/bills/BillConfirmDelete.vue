<script setup>
// vue
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'

// app
import { billService } from '../../services/billService'
import BillConfirmDeleteMenu from '../../components/bills/menus/BillConfirmDeleteMenu.vue'
import { useRouting } from '../../composables/routingFunctions.js'

// main object
const bill = ref({
  id: null,
  folio: ''
})

// errors holder object
const errorMessage = ref('')

// routing utilities
const route = useRoute()
const router = useRouter()

const { goToDetail } = useRouting()

const handleGoToDetail = () => {
  try {
    goToDetail('bills_detail', bill.value.id)
  } catch (error) {
    console.error(error)
  }
}

// loading state
const isLoading = ref(false)

onMounted(async () => {
  try {
    // start lading state
    isLoading.value = true
    // getting data from backend
    const resp = await billService.getForDelete(route.params.id)
    bill.value = resp.data
  } catch (error) {
    console.error('General error', error)
    if (error.response) {
      if (error.response.status === 404) {
        errorMessage.value = 'Factura no encontrada'
      }
      if (error.response.status === 500) {
        errorMessage.value = 'Error interno del servidor, consulte al desarrollador.'
      }
    } else if (error.request) {
      errorMessage.value =
        'Servidor no responde, intente más tarde, si el problema persiste, consulte al desarrollador.'
    } else {
      errorMessage.value = 'Error inesperado, consulte al desarrollador.'
    }
  } finally {
    // stop lading state
    isLoading.value = false
  }
})

// delete the bill object
const delBill = async () => {
  try {
    // start lading state
    isLoading.value = true
    // performing deletion
    await billService.deleteBill(bill.value.id)
    router.push({ name: 'bills' })
  } catch (error) {
    console.error('General error', error)
    if (error.response) {
      if (error.response.status === 404) {
        errorMessage.value = 'Factura no encontrada'
      }
      if (error.response.status === 500) {
        errorMessage.value = 'Error interno del servidor, consulte al desarrollador.'
      }
    } else if (error.request) {
      errorMessage.value =
        'Servidor no responde, intente más tarde, si el problema persiste, consulte al desarrollador.'
    } else {
      errorMessage.value = 'Error inesperado, consulte al desarrollador.'
    }
  } finally {
    // finish lading state
    isLoading.value = false
  }
}
</script>

<template>
  <div class="row">
    <!-- side menu -->
    <div class="col-md-2">
      <BillConfirmDeleteMenu />
    </div>

    <!-- loading state -->
    <div v-if="isLoading" class="col-md-6">
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
    <div v-else class="col-md-6">
      <p>Está seguro que desea eliminar la siguiente factura?</p>
      <p><strong>Folio: </strong> {{ bill.folio }}</p>
      <button class="btn btn-sm btn-danger" @click="delBill">Eliminar</button>
      <button class="btn btn-sm btn-secondary" @click="handleGoToDetail">Cancelar</button>
    </div>
  </div>
</template>
