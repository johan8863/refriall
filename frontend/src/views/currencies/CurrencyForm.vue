<script setup lang="ts">
// vue
import { onMounted } from 'vue'
import { useRoute } from 'vue-router'

// third
import { required, helpers, maxLength, minLength } from '@vuelidate/validators'

// app
import CurrencyFormMenu from '../../components/currencies/menus/CurrencyFormMenu.vue'
import { currencyService } from '../../services/currencyService'
import { useForm } from '../../composables/useForm'
import type { Currency } from './types'

// Routing
const route = useRoute()

// Currency initial data
const initialData: Currency = {
  id: 0,
  name: '',
  description: null
}

// Validation rules
const rules = {
  name: {
    required: helpers.withMessage('El nombre es requerido.', required),
    maxLength: helpers.withMessage('El nombre no puede exceder 4 caracteres.', maxLength(4))
  },
  description: {
    minLength: helpers.withMessage('La descripción debe tener al menos 5 caracteres', minLength(5)),
    maxLength: helpers.withMessage('La descripción debe tener máximo 22 caracteres', maxLength(22))
  }
}

// Use form composable with Currency type
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
} = useForm<Currency>({
  initialData,
  rules,
  service: currencyService,
  objectName: 'Moneda',
  gender: 'f',
  createMethod: 'postCurrency',
  updateMethod: 'putCurrency',
  detailMethod: 'detailCurrency',
  listView: 'currencies',
  detailView: 'currency_detail'
})

// Transform name to uppercase before submit
const handleSubmit = async () => {
  if (currency.value.name) {
    currency.value.name = currency.value.name.toUpperCase()
  }
  await useFormSubmit()
}

// Lifecycle
onMounted(async () => await loadData(route.params.id as string))
</script>

<template>
  <div class="row">
    <!-- side menu -->
    <div class="col-md-2">
      <CurrencyFormMenu />
    </div>

    <!-- main content -->
    <div v-if="isLoading" class="col-md-4">
      <div class="d-flex justify-content-center align-items-center" style="min-height: 200px">
        <span role="status" class="text-primary">Cargando datos... </span>
        <span class="spinner-border spinner-border-sm text-primary" aria-hidden="true"></span>
      </div>
    </div>

    <div v-else class="col-md-4">
      <!-- General errors -->
      <div v-if="errorMessage" class="alert alert-danger">
        {{ errorMessage }}
      </div>

      <!-- Non-field errors -->
      <div v-if="backendErrors.non_field_errors">
        <p
          v-for="(error, index) in backendErrors.non_field_errors"
          :key="index"
          class="form-text text-danger"
        >
          {{ error }}
        </p>
      </div>

      <form @submit.prevent="handleSubmit" class="row">
        <!-- Name field -->
        <div class="col-md-6 mb-2">
          <label for="name" class="form-label">Nombre</label>
          <input
            autofocus
            type="text"
            class="form-control"
            id="name"
            v-model.trim="currency.name"
            @blur="v$.name.$touch"
            maxlength="4"
          />

          <!-- Frontend errors -->
          <p class="form-text text-danger" v-for="error in v$.name.$errors" :key="error.$uid">
            {{ error.$message }}
          </p>

          <!-- Backend errors -->
          <p
            v-for="(error, i) in getFieldErrors('name')"
            :key="`backend-${i}`"
            class="form-text text-danger"
          >
            {{ error }}
          </p>
        </div>

        <!-- Spacer -->
        <div class="col-md-6"></div>

        <!-- Description field -->
        <div class="col-md-12 mb-2">
          <label for="description" class="form-label">Descripción</label>
          <input
            type="text"
            class="form-control"
            id="description"
            v-model.trim="currency.description"
            maxlength="22"
          />

          <!-- Frontend errors -->
          <p
            class="form-text text-danger"
            v-for="error in v$.description.$errors"
            :key="error.$uid"
          >
            {{ error.$message }}
          </p>

          <!-- Backend errors -->
          <p
            v-for="(error, i) in getFieldErrors('description')"
            :key="`backend-${i}`"
            class="form-text text-danger"
          >
            {{ error }}
          </p>
        </div>

        <!-- Buttons -->
        <div>
          <button type="submit" class="btn btn-primary btn-sm" :disabled="isSaving">
            <span v-if="isSaving" class="spinner-border spinner-border-sm me-1"></span>
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
