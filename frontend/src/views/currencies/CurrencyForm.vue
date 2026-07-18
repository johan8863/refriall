<script setup>
// vue
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'

// third
import { useVuelidate } from '@vuelidate/core'
import { required, helpers } from '@vuelidate/validators'

// app
import { currencyService } from '../../services/currencyService'
import CurrencyFormMenu from '../../components/currencies/menus/CurrencyFormMenu.vue'
import { useRouting } from '../../composables/routingFunctions.js'
import { useErrorHandler } from '../../composables/useErrorHandler.js'

// router utilities and handlers
const router = useRouter()
const route = useRoute()
const { goBack } = useRouting()
const handleGoBack = () => {
  try {
    goBack('currencies', 'currency_detail', currency.value.id)
  } catch (error) {
    console.error(error)
  }
}

// currency object for post and put requests
const currency = ref({
  id: null,
  name: '',
  description: ''
})

// errors oobjects holders
const { errorMessage, backendErrors, handleError, getFieldErrors } = useErrorHandler({
  objectName: 'Moneda'
})

// loading state
const isLoading = ref(false)

// rules to manage front validations
const rules = {
  name: {
    required: helpers.withMessage('El nombre es requerido.', required)
  }
}

// vuelidate object
const v$ = useVuelidate(rules, currency)

// helper function to always set to upper case the name of the currency
const currenyNameUpper = () =>
  (currency.value.name = currency.value.name ? currency.value.name.toUpperCase() : '')

// submit handler
const handleSubmit = async () => {
  // vuelidate validation
  if (!(await v$.value.$validate)) {
    // always log vuelidate errors
    // just in case an unexpected behavior
    console.error('Vuelidate errors:', v$.value.$errors)
    return // end the operation
  }

  try {
    // update or create related to currency.value.id
    currenyNameUpper()
    const isUpdate = !!currency.value.id
    const method = isUpdate
      ? currencyService.putCurrency(currency.value)
      : currencyService.postCurrency(currency.value)

    // on success return to currency detail view
    const { data } = await method
    router.push({ name: 'currency_detail', params: { id: data.id } })
  } catch (error) {
    console.error('General error:', error)
    handleError(error)
  }
}

const getCurrencyIfID = async () => {
  // create use case
  const id = route.params.id
  if (!id) return

  // update use case
  // start loading state
  isLoading.value = true
  try {
    const { data } = await currencyService.detailCurrency(id)
    currency.value = data
  } catch (error) {
    console.error('General error:', error)
    handleError(error)
  } finally {
    // stop loading status
    isLoading.value = false
  }
}

// onMounted life cycle
onMounted(async () => await getCurrencyIfID())
</script>

<template>
  <div class="row">
    <!-- side menu -->
    <div class="col-md-2">
      <currency-form-menu />
    </div>

    <!-- main content -->

    <!-- loading order data -->
    <div v-if="isLoading" class="col-md-4">
      <div class="d-flex justify-content-center align-items-center" style="min-height: 200px">
        <span role="status" class="text-primary">Cargando datos... </span>
        <span class="spinner-border spinner-border-sm text-primary" aria-hidden="true"></span>
      </div>
    </div>

    <!-- displaying form -->
    <div v-else class="col-md-4">
      <!-- backend general errors -->
      <div v-if="errorMessage" class="alert alert-danger">
        {{ errorMessage }}
      </div>
      <!-- backend errors from non_field_errors dictionary -->
      <div v-if="backendErrors.non_field_errors">
        <p
          v-for="(error, index) in backendErrors.non_field_errors"
          :key="index"
          class="form-text text-danger"
        >
          {{ error }}
        </p>
      </div>
      <!-- form -->
      <form @submit.prevent="handleSubmit" class="row">
        <!-- name control -->
        <div class="col-md-6 mb-2">
          <label for="name" class="form-label">Nombre</label>
          <input
            autofocus
            type="text"
            class="form-control"
            id="name"
            v-model.trim="currency.name"
            @blur="v$.name.$touch"
          />
          <!-- frontend errors -->
          <p class="form-text text-danger" v-for="error in v$.name.$errors" :key="error.$uid">
            {{ error.$message }}
          </p>
          <!-- backend errors -->
          <p
            v-for="(error, i) in getFieldErrors('name')"
            :key="`backend-${i}`"
            class="form-text text-danger"
          >
            {{ error }}
          </p>
        </div>
        <!-- filling container -->
        <div class="col-md-6"></div>
        <!-- description control -->
        <div class="col-md-12 mb-2">
          <label for="description" class="form-label">Descripción</label>
          <input
            type="text"
            class="form-control"
            id="description"
            v-model.trim="currency.description"
          />
          <p
            v-for="(error, i) in getFieldErrors('description')"
            :key="`backend-${i}`"
            class="form-text text-danger"
          >
            {{ error }}
          </p>
        </div>
        <!-- buttons -->
        <div>
          <!-- 
            the order in the ternary operator is due to the fact that 
            this form is more often used to create than to update 
          -->
          <button type="submit" class="btn btn-primary btn-sm">
            {{ !currency.id ? 'Guardar' : 'Actualizar' }}
          </button>
          <button type="button" class="btn btn-sm btn-secondary" @click="handleGoBack">
            Cancelar
          </button>
        </div>
      </form>
    </div>
  </div>
</template>
