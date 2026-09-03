<script setup lang="ts">
// vue
import { onMounted, ref } from 'vue'

// app
import { currencyService } from '@/services/currencyService'
import CurrencyListMenu from '@/components/currencies/menus/CurrencyListMenu.vue'
import { useErrorHandler } from '@/composables/useErrorHandler'
import type { Currency } from './types'

/**
 * Currency list view - simple list without pagination
 */
const currencies = ref<Currency[]>([])
const isLoading = ref(false)

const { errorMessage, handleError } = useErrorHandler({
  objectName: 'Monedas'
})

/**
 * Fetch all currencies from the API
 */
const getCurrencies = async (): Promise<void> => {
  isLoading.value = true
  try {
    const response = await currencyService.listCurrencies()
    currencies.value = response.data
  } catch (error) {
    console.error('General error: ', error)
    handleError(error)
  } finally {
    isLoading.value = false
  }
}

// Lifecycle
onMounted(async () => {
  await getCurrencies()
})
</script>

<template>
  <div class="row">
    <!-- side menu -->
    <div class="col-md-2">
      <CurrencyListMenu />
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
                      <router-link :to="{ name: 'currency_detail', params: { id: currency.id } }">
                        {{ currency.name }}
                      </router-link>
                    </td>
                    <td>{{ currency.description || 'Sin descripción' }}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <!-- no currencies -->
          <div v-else>
            <p class="lead text-center">No hay monedas registradas.</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
