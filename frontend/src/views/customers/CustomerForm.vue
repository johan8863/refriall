<script setup lang="ts">
// vue
import { onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { helpers, required } from '@vuelidate/validators'

// app
import CustomerFormMenu from '../../components/customers/menus/CustomerFormMenu.vue'
import { customerService } from '../../services/customerService'
import { useForm } from '../../composables/useForm'
import { CUSTOMER_TYPE_OPTIONS, type Customer } from './types'

const route = useRoute()

// Validation rules
const rules = {
  customer_type: {
    required: helpers.withMessage('Seleccione el tipo de cliente.', required)
  },
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
  },
  code: {
    required: helpers.withMessage('El código es requerido.', required)
  },
  bank_account_header: {
    required: helpers.withMessage('El titular de la cuenta es requerido.', required)
  },
  bank_account: {
    required: helpers.withMessage('La cuenta bancaria es requerida.', required)
  }
}

// Use form composable with Customer type
const {
  formData: customer,
  isLoading,
  isSaving,
  errorMessage,
  backendErrors,
  v$,
  loadData,
  handleSubmit,
  handleGoBack,
  getFieldErrors
} = useForm<Customer>({
  initialData: {
    id: 0,
    customer_type: 'es',
    name: '',
    address: '',
    province: '',
    township: '',
    code: '',
    client_nit: null,
    bank_account_header: '',
    bank_account: ''
  },
  rules,
  service: customerService,
  objectName: 'Cliente',
  gender: 'm',
  createMethod: 'postCustomer',
  updateMethod: 'putCustomer',
  detailMethod: 'detailCustomer',
  listView: 'customers',
  detailView: 'customers_detail'
})

// Lifecycle
onMounted(async () => {
  await loadData(route.params.id as string)
})
</script>

<template>
  <div class="row">
    <!-- side menu -->
    <div class="col-md-2">
      <CustomerFormMenu />
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

      <form @submit.prevent="handleSubmit">
        <!-- Customer type field -->
        <div class="mb-2">
          <label for="customer_type" class="form-label">Tipo</label>
          <select
            autofocus
            id="customer_type"
            class="form-select"
            v-model.trim="customer.customer_type"
            @blur="v$.customer_type.$touch"
          >
            <option
              v-for="option in CUSTOMER_TYPE_OPTIONS"
              :key="option.value"
              :value="option.value"
            >
              {{ option.label }}
            </option>
          </select>

          <p
            class="form-text text-danger"
            v-for="error in v$.customer_type.$errors"
            :key="error.$uid"
          >
            {{ error.$message }}
          </p>

          <p
            v-for="(error, i) in getFieldErrors('customer_type')"
            :key="`backend-${i}`"
            class="form-text text-danger"
          >
            {{ error }}
          </p>
        </div>

        <!-- Name field -->
        <div class="mb-2">
          <label for="name" class="form-label">Nombre</label>
          <input
            type="text"
            id="name"
            class="form-control"
            v-model.trim="customer.name"
            @blur="v$.name.$touch"
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
            class="form-control"
            id="address"
            cols="30"
            rows="5"
            v-model.trim="customer.address"
            @blur="v$.address.$touch"
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
            v-model.trim="customer.province"
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
            v-model.trim="customer.township"
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

        <!-- Code field -->
        <div class="mb-2">
          <label for="code" class="form-label">Código</label>
          <input
            type="text"
            id="code"
            class="form-control"
            v-model.trim="customer.code"
            @blur="v$.code.$touch"
          />

          <p class="form-text text-danger" v-for="error in v$.code.$errors" :key="error.$uid">
            {{ error.$message }}
          </p>

          <p
            v-for="(error, i) in getFieldErrors('code')"
            :key="`backend-${i}`"
            class="form-text text-danger"
          >
            {{ error }}
          </p>
        </div>

        <!-- Client NIT field -->
        <div class="mb-2">
          <label for="client_nit" class="form-label">Código NIT</label>
          <input
            type="text"
            id="client_nit"
            class="form-control"
            v-model.trim="customer.client_nit"
          />

          <p
            v-for="(error, i) in getFieldErrors('client_nit')"
            :key="`backend-${i}`"
            class="form-text text-danger"
          >
            {{ error }}
          </p>
        </div>

        <!-- Bank account header field -->
        <div class="mb-2">
          <label for="bank_account_header" class="form-label">Titular de la Cuenta</label>
          <input
            type="text"
            id="bank_account_header"
            class="form-control"
            v-model.trim="customer.bank_account_header"
            @blur="v$.bank_account_header.$touch"
          />

          <p
            class="form-text text-danger"
            v-for="error in v$.bank_account_header.$errors"
            :key="error.$uid"
          >
            {{ error.$message }}
          </p>

          <p
            v-for="(error, i) in getFieldErrors('bank_account_header')"
            :key="`backend-${i}`"
            class="form-text text-danger"
          >
            {{ error }}
          </p>
        </div>

        <!-- Bank account field -->
        <div class="mb-2">
          <label for="bank_account" class="form-label">Nro. de Cuenta</label>
          <input
            type="text"
            id="bank_account"
            class="form-control"
            v-model.trim="customer.bank_account"
            @blur="v$.bank_account.$touch"
          />

          <p
            class="form-text text-danger"
            v-for="error in v$.bank_account.$errors"
            :key="error.$uid"
          >
            {{ error.$message }}
          </p>

          <p
            v-for="(error, i) in getFieldErrors('bank_account')"
            :key="`backend-${i}`"
            class="form-text text-danger"
          >
            {{ error }}
          </p>
        </div>

        <!-- Buttons -->
        <div>
          <button type="submit" class="btn btn-sm btn-primary" :disabled="isSaving">
            <span v-if="isSaving" class="spinner-border spinner-border-sm me-1"></span>
            {{ !customer.id ? 'Guardar' : 'Actualizar' }}
          </button>
          <button type="button" class="btn btn-sm btn-secondary" @click="handleGoBack">
            Cancelar
          </button>
        </div>
      </form>
    </div>
  </div>
</template>
