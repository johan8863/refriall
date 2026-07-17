<script setup>
// vue
import { ref, onMounted } from 'vue'

// app
import { currencyService } from '../../services/currencyService'
import CurrencyListMenu from '../../components/currencies/menus/CurrencyListMenu.vue'
import { useErrorHandler } from '../../composables/useErrorHandler.js'

// main object
const currencies = ref([])

// loading status
const isLoading = ref(false)

// errors objects
const { errorMessage, handleError } = useErrorHandler({
  objectName: 'Monedas'
})

const getCurrencies = async () => {
  isLoading.value = true
  try {
    currencies.value = (await currencyService.listCurrencies()).data
  } catch (error) {
    console.error('General error: ', error)
    handleError(error)
  } finally {
    isLoading.value = false
  }
}

onMounted(async () => {
  await getCurrencies()
})
</script>

<template>
  <div class="row">
    <!-- side menu -->
    <div class="col-md-2">
      <currency-list-menu />
    </div>
    <!-- main content -->
    <div class="col-md-10">
      <div class="row">
        <div class="col-md-4">
          <!-- loading state -->
          <div v-if="isLoading" class="text-center my-2">
            <div class="spinner-border text-primary" role="status">
              <span class="visually-hidden">Cargando...</span>
            </div>
            <p class="mt-1">Cargando Monedas...</p>
          </div>

          <!-- backend errors -->
          <div v-else-if="errorMessage" class="alert alert-danger mt-2">
            {{ errorMessage }}
          </div>
          <!-- results -->
          <div v-else-if="currencies.length > 0">
            <div id="tableContainer">
              <table class="table">
                <thead>
                  <tr>
                    <th scope="col">Moneda</th>
                    <th scope="col">Descripción</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="currency in currencies" :key="currency.id">
                    <td>
                      <router-link :to="{ name: 'currency_detail', params: { id: currency.id } }">{{
                        currency.name
                      }}</router-link>
                    </td>
                    <td>{{ currency.description }}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <!-- in case no currencies -->
          <div v-else>
            <p class="lead text-center">Inserte una Moneda.</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
