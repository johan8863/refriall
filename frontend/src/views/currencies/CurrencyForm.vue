<script setup>
// vue
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'

// third
import { required, helpers, maxLength, minLength } from '@vuelidate/validators'
import { useVuelidate } from '@vuelidate/core'

// app
import CurrencyFormMenu from '../../components/currencies/menus/CurrencyFormMenu.vue'
import { currencyService } from '../../services/currencyService'
import { useForm } from '../../composables/useForm.js'

// router utilities and handlers
const route = useRoute()

// currency initial data to use in composable
const initialData = {
  id: null,
  name: '',
  description: ''
}

// rules to manage front validations
const rules = {
  name: {
    required: helpers.withMessage('El nombre es requerido.', required)
  },
  description: {
    minLength: helpers.withMessage('La descripción debe tener al menos 5 caracteres', minLength(5)),
    maxLength: helpers.withMessage('La descripción debe tener máximo 22 caracteres', maxLength(22))
  }
}

// helper function to always set to upper case the name of the currency
const currenyNameUpper = () =>
  (currency.value.name = currency.value.name ? currency.value.name.toUpperCase() : '')

const {
  formData: currency,
  isLoading,
  isSaving,
  errorMessage,
  backendErrors,
  v$,
  loadData,
  handleSubmit: useFormSubmit,
  handleGoBack,
  getFieldErrors
} = useForm({
  initialData,
  rules,
  service: currencyService,
  objectName: 'Moneda',
  createMethod: 'postCurrency',
  updateMethod: 'putCurrency',
  detailMethod: 'detailCurrency',
  listView: 'currencies',
  detailView: 'currency_detail'
})

const handleSubmit = async () => {
  currency.value.name = currency.value.name.toUpperCase()
  await useFormSubmit()
}

// onMounted life cycle
onMounted(async () => await loadData(route.params.id))
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
          <!-- frontend errors -->
          <p
            class="form-text text-danger"
            v-for="error in v$.description.$errors"
            :key="error.$uid"
          >
            {{ error.$message }}
          </p>
          <!-- backend errors -->
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
