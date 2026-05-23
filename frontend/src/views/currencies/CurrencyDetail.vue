<script setup>
// vue
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'

// app
import { currencyService } from '../../services/currencyService'
import listGroup from '../../assets/js/bootstrap_classes/listGroup'
import { errorHandler } from '../../utils/errors/errorHandler'

const currency = ref({
  name: '',
  description: ''
})

// loading state
const isLoading = ref(false)

const currencyBackenderror = ref(null)

const route = useRoute()

onMounted(async () => {
  try {
    // start loading state
    isLoading.value = true
    // get currency data
    const response = await currencyService.detailCurrency(route.params.id)
    currency.value = response.data
  } catch (error) {
    console.error('General error', error)
    if (error.response) {
      errorHandler(error, currencyBackenderror, 'Moneda')
    }
  } finally {
    isLoading.value = false
  }
})
</script>

<template>
  <div class="row">
    <!-- side menu -->
    <div class="col-md-2">
      <ul :class="listGroup.listGroup">
        <li :class="listGroup.listGroupItem">
          <strong>Monedas</strong>
        </li>
        <li :class="listGroup.listGroupItem">
          <router-link :to="{ name: 'currencies' }">Monedas</router-link>
        </li>
        <li :class="listGroup.listGroupItem">
          <router-link :to="{ name: 'currency_update', params: { id: currency.id } }"
            >Actualizar</router-link
          >
        </li>
        <li :class="listGroup.listGroupItem">
          <router-link :to="{ name: 'currency_delete', params: { id: currency.id } }"
            >Eliminar</router-link
          >
        </li>
      </ul>
    </div>

    <!-- main content -->

    <!-- loading order data -->
    <div v-if="isLoading" class="col-md-4">
      <div class="d-flex justify-content-center align-items-center" style="min-height: 200px">
        <span role="status" class="text-primary">Cargando datos... </span>
        <span class="spinner-border spinner-border-sm text-primary" aria-hidden="true"></span>
      </div>
    </div>

    <!-- displaying currency data -->
    <div v-else class="col-md-4">
      <!-- backend general errors -->
      <span v-if="currencyBackenderror">
        <p class="form-text text-danger">
          {{ currencyBackenderror }}
        </p>
      </span>
      <h3>{{ currency.name }}</h3>
      <p>{{ currency.description }}</p>
    </div>
  </div>
</template>
