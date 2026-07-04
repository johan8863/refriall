<script setup>
// vue
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'

// app
import { customerDependecyService } from '../../services/customerDependencyService'
import CustomerDependencyConfirmDeleteMenu from '../../components/customerDependencies/menus/CustomerDependencyConfirmDeleteMenu.vue'
import { errorHandler } from '../../utils/errors/errorHandler.js'

// routing utilities
const route = useRoute()
const router = useRouter()

// main object
const dependency = ref({
  id: '',
  customer: '',
  name: '',
  address: '',
  province: '',
  township: ''
})

// loadin state
const isLoading = ref(false)

// error message
const errorMessage = ref(null)

onMounted(async () => {
  try {
    const resp = await customerDependecyService.detailCustomerDependecy(route.params.id)
    dependency.value = resp.data
  } catch (error) {
    errorHandler(error, errorMessage)
  }
})

const delDependency = async () => {
  try {
    await customerDependecyService.deleteCustomerDependency(dependency.value.id)
    router.push({
      name: 'customers_detail',
      params: {
        id: dependency.value.customer
      }
    })
  } catch (error) {
    errorHandler(error, errorMessage)
  }
}
</script>

<template>
  <div class="row">
    <!-- side menu -->
    <div class="col-md-2">
      <CustomerDependencyConfirmDeleteMenu :dependency="dependency" />
    </div>

    <!-- main content -->
    <div class="col-md-4" v-if="isLoading">
      <div class="d-flex justify-content-center align-items-center" style="min-height: 200px">
        <span role="status" class="text-primary">Cargando datos... </span>
        <span class="spinner-border spinner-border-sm text-primary" aria-hidden="true"></span>
      </div>
    </div>
    <div v-else-if="errorMessage" class="col-md-4">
      <span>
        <p class="form-text text-danger">
          {{ errorMessage }}
        </p>
      </span>
    </div>
    <div v-else class="col-md-4">
      <!-- backend general errors -->
      <p>Está seguro que desea eliminar la dependencia: {{ dependency.name }}?</p>
      <div>
        <button class="btn btn-sm btn-danger" @click="delDependency">Eliminar</button>
        <RouterLink
          v-if="dependency.id"
          :to="{ name: 'customer_dependecy_detail', params: { id: dependency.id } }"
          class="btn btn-sm btn-secondary"
          >Cancelar</RouterLink
        >
      </div>
    </div>
  </div>
</template>
