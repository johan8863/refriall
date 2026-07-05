<script setup>
// vue
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'

// app
import { currencyService } from '../../services/currencyService'
import { errorHandler } from '../../utils/errors/errorHandler'
import CurrencyDetailMenu from '../../components/currencies/menus/CurrencyDetailMenu.vue'
import { useRouting } from '../../composables/routingFunctions.js'

// main object
const currency = ref({
  id: null,
  name: '',
  description: ''
})

// errors holder object
const currencyBackenderror = ref(null)

// loading state
const isLoading = ref(false)

// routing
const route = useRoute()
const { goToListPost, goToDetail } = useRouting()
const handleGoToList = () => goToListPost('currencies')
const handleGoToDetail = () => goToDetail('currency_update', currency.value.id)
const handleGoToDelete = () => goToDetail('currency_delete', currency.value.id)

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
      <currency-detail-menu
        :is-loading="isLoading"
        :currency="currency"
        @on-go-to-currencies="handleGoToList"
        @on-go-to-update-currency="handleGoToDetail"
        @on-go-to-delete="handleGoToDelete"
      />
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
