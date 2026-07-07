<script setup>
// vue
import { onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'

// app
import { currencyService } from '../../services/currencyService'
import CurrencyConfirmDeleteMenu from '../../components/currencies/menus/CurrencyConfirmDeleteMenu.vue'
import { errorHandler } from '../../utils/errors/errorHandler.js'

// router utilities to redirect the view and catch route params
const route = useRoute()
const router = useRouter()

// currency object meant to be deleted
const currency = ref({
  id: null,
  name: '',
  description: ''
})

// errors
const errorMessage = ref(null)

// delete the currency object
const delCurrency = async () => {
  try {
    await currencyService.deleteCurrency(currency.value.id)
    router.push({ name: 'currencies' })
  } catch (error) {
    errorHandler(error, errorMessage, 'Moneda')
  }
}

onMounted(async () => {
  try {
    currency.value = (await currencyService.detailCurrency(route.params.id)).data
  } catch (error) {
    errorHandler(error, errorMessage, 'Moneda')
  }
})
</script>

<template>
  <div class="row">
    <!-- side menu -->
    <div class="col-md-2">
      <CurrencyConfirmDeleteMenu :currency="currency" />
    </div>
    <!-- main content -->
    <div class="col-md-4">
      <!-- backend general errors -->
      <span v-if="errorMessage">
        <p class="form-text text-danger">
          {{ errorMessage }}
        </p>
      </span>
      <div>
        <p>Está seguro que desea eliminar la moneda: {{ currency.name }}</p>
        <button class="btn btn-sm btn-danger" @click="delCurrency">Eliminar</button>
        <button class="btn btn-sm btn-secondary" @click="handleGoBack">Cancelar</button>
      </div>
    </div>
  </div>
</template>
