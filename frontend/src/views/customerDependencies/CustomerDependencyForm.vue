<script setup lang="ts">
// vue
import { onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { helpers, required } from '@vuelidate/validators'

// app
import CustomerDependencyCreateMenu from '@/components/customerDependencies/menus/CustomerDependencyCreateMenu.vue'
import { customerDependencyService } from '@/services/customerDependencyService'
import { useForm } from '@/composables/useForm'
import type { CustomerDependency } from './types'

const route = useRoute()
const router = useRouter()

// Check if we're in create or update mode
const isCreate = route.name === 'customer_dependecy_create'

// Get customer ID from route params if creating
const customerId = isCreate ? Number(route.params.id) : 0

// Validation rules
const rules = {
  name: {
    required: helpers.withMessage('El nombre es requerido.', required)
  },
  address: {
    required: helpers.withMessage('La dirección es requerida.', required)
  },
  province: {
    required: helpers.withMessage('La provincia es requerida.', required)
  },
  township: {
    required: helpers.withMessage('El municipio es requerido.', required)
  }
}

// Use form composable with CustomerDependency type
const {
  formData: dependency,
  isLoading,
  isSaving,
  errorMessage,
  backendErrors,
  v$,
  loadData,
  handleSubmit,
  handleGoBack,
  getFieldErrors
} = useForm<CustomerDependency>({
  initialData: {
    id: 0,
    customer: customerId,
    name: '',
    address: '',
    province: '',
    township: ''
  },
  rules,
  service: customerDependencyService,
  objectName: 'Dependencia',
  gender: 'f',
  createMethod: 'postCustomerDependency',
  updateMethod: 'putCustomerDependency',
  detailMethod: 'detailCustomerDependency',
  listView: 'customers',
  detailView: 'customer_dependecy_detail'
})

// Lifecycle
onMounted(async () => {
  // For create mode, we already have the customer ID
  if (isCreate) {
    dependency.value.customer = customerId
    return
  }

  // For update mode, load the dependency data
  await loadData(route.params.id as string)
})
</script>

<template>
  <div class="row">
    <!-- side menu -->
    <div class="col-md-2">
      <CustomerDependencyCreateMenu />
    </div>

    <!-- main content -->
    <div v-if="isLoading" class="col-md-4">
      <div class="d-flex justify-content-center align-items-center" style="min-height: 200px">
        <span role="status" class="text-primary">Cargando datos... </span>
        <span class="spinner-border spinner-border-sm text-primary" aria-hidden="true"></span>
      </div>
    </div>

    <div v-else class="col-md-4">
      <!-- Non-field errors -->
      <div v-if="backendErrors.non_field_errors">
        <p
          class="form-text text-danger"
          v-for="(error, index) in backendErrors.non_field_errors"
          :key="index"
        >
          {{ error }}
        </p>
      </div>

      <!-- General errors -->
      <div v-if="errorMessage" class="alert alert-danger">
        {{ errorMessage }}
      </div>

      <form @submit.prevent="handleSubmit">
        <!-- Name field -->
        <div class="mb-2">
          <label for="name" class="form-label">Nombre</label>
          <input
            type="text"
            id="name"
            class="form-control"
            v-model.trim="dependency.name"
            @blur="v$.name.$touch"
            autofocus
          />

          <p class="form-text text-danger" v-for="error in v$.name.$errors" :key="error.$uid">
            {{ error.$message }}
          </p>

          <p
            v-for="(error, i) in getFieldErrors('name')"
            :key="`backend-${i}`"
            class="form-text text-danger"
          >
            {{ error }}
          </p>
        </div>

        <!-- Address field -->
        <div class="mb-2">
          <label for="address" class="form-label">Dirección</label>
          <textarea
            id="address"
            class="form-control"
            v-model.trim="dependency.address"
            @blur="v$.address.$touch"
            cols="5"
            rows="5"
          ></textarea>

          <p class="form-text text-danger" v-for="error in v$.address.$errors" :key="error.$uid">
            {{ error.$message }}
          </p>

          <p
            v-for="(error, i) in getFieldErrors('address')"
            :key="`backend-${i}`"
            class="form-text text-danger"
          >
            {{ error }}
          </p>
        </div>

        <!-- Province field -->
        <div class="mb-2">
          <label for="province" class="form-label">Provincia</label>
          <input
            type="text"
            id="province"
            class="form-control"
            v-model.trim="dependency.province"
            @blur="v$.province.$touch"
          />

          <p class="form-text text-danger" v-for="error in v$.province.$errors" :key="error.$uid">
            {{ error.$message }}
          </p>

          <p
            v-for="(error, i) in getFieldErrors('province')"
            :key="`backend-${i}`"
            class="form-text text-danger"
          >
            {{ error }}
          </p>
        </div>

        <!-- Township field -->
        <div class="mb-2">
          <label for="township" class="form-label">Municipio</label>
          <input
            type="text"
            id="township"
            class="form-control"
            v-model.trim="dependency.township"
            @blur="v$.township.$touch"
          />

          <p class="form-text text-danger" v-for="error in v$.township.$errors" :key="error.$uid">
            {{ error.$message }}
          </p>

          <p
            v-for="(error, i) in getFieldErrors('township')"
            :key="`backend-${i}`"
            class="form-text text-danger"
          >
            {{ error }}
          </p>
        </div>

        <!-- Buttons -->
        <div class="mb-2">
          <button type="submit" class="btn btn-sm btn-primary" :disabled="isSaving">
            <span v-if="isSaving" class="spinner-border spinner-border-sm me-1"></span>
            {{ dependency.id ? 'Actualizar' : 'Guardar' }}
          </button>
          <button type="button" class="btn btn-sm btn-secondary" @click="handleGoBack">
            Cancelar
          </button>
        </div>
      </form>
    </div>
  </div>
</template>
