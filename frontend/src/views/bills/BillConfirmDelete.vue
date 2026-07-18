<script setup>
// vue
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'

// app
import { billService } from '../../services/billService'
import BillConfirmDeleteMenu from '../../components/bills/menus/BillConfirmDeleteMenu.vue'
import { errorHandler } from '../../utils/errors/errorHandler.js'
import { useRouting } from '../../composables/routingFunctions.js'
import { useErrorHandler } from '../../composables/useErrorHandler.js'

// main object
const bill = ref({
  id: null,
  folio: ''
})

// errors holder object
const { errorMessage, handleError } = useErrorHandler({
  objectName: 'Factura'
})

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
    console.error('General error:', error)
    handleError(error)
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
    console.error('General error:', error)
    handleError(error)
  } finally {
    // finish lading state
    isLoading.value = false
  }
}

// get bill object
const getBill = async () => {
  try {
    // start lading state
    isLoading.value = true
    // getting data from backend
    const resp = await billService.getForDelete(route.params.id)
    bill.value = resp.data
  } catch (error) {
    console.error('General error', error)
    errorHandler(error, errorMessage, 'Factura')
  } finally {
    // stop lading state
    isLoading.value = false
  }
}

onMounted(async () => await getBill())
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

    <!-- main content -->
    <div v-else class="col-md-6">
      <!-- error message -->
      <div v-if="errorMessage" class="col-md-4">
        <span class="form-text text-danger">
          {{ errorMessage }}
        </span>
      </div>
      <!-- content -->
      <div>
        <p>Está seguro que desea eliminar la siguiente factura?</p>
        <p v-if="bill.folio"><strong>Folio: </strong> {{ bill.folio }}</p>
        <button class="btn btn-sm btn-danger" @click="delBill">Eliminar</button>
        <button class="btn btn-sm btn-secondary" @click="handleGoToDetail">Cancelar</button>
      </div>
    </div>
  </div>
</template>
