<script setup>
// vue
import { onMounted, ref, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'

// third
import { useVuelidate } from '@vuelidate/core'
import { required, helpers, numeric } from '@vuelidate/validators'

// app
import { providerService } from '../../services/providerService'
import ProviderFormMenu from '../../components/providers/menus/ProviderFormMenu.vue'
import { useForm } from '../../composables/useForm.js'

// router utilities and handlers
const route = useRoute()

// main object
const initialData = {
  id: null,
  username: '',
  first_name: '',
  last_name: '',
  tcp_code: '',
  bank_account_header: '',
  bank_account: '',
  address: '',
  activity: '',
  license_number: '',
  password: '',
  confirm_password: '',
  personal_id: ''
}

// validation rules

// custom
const requiredlength = (lenData) => (value) => value.length === lenData

// object rules
const rules = computed(() => ({
  username: {
    required: helpers.withMessage('El Usuario es requerido.', required)
  },
  first_name: {
    required: helpers.withMessage('El Nombre es requerido.', required)
  },
  last_name: {
    required: helpers.withMessage('Los Apellidos son requeridos.', required)
  },
  tcp_code: {
    required: helpers.withMessage('El Código TCP es requerido.', required)
  },
  bank_account_header: {
    required: helpers.withMessage('El Titular de Cuenta es requerido.', required)
  },
  bank_account: {
    required: helpers.withMessage('La Cuenta Bancaria es requerida.', required),
    numeric: helpers.withMessage('La Cuenta debe contener sólo números.', numeric),
    requiredlength: helpers.withMessage(
      'La Cuenta debe contener 16 caracteres.',
      requiredlength(16)
    )
  },
  address: {
    required: helpers.withMessage('La Dirección es requerida.', required)
  },
  activity: {
    required: helpers.withMessage('La Actividad es requerida.', required)
  },
  license_number: {
    required: helpers.withMessage('La Licencia es requerida.', required)
  },
  // both password and confirm_password rules will only be executed
  // on creation form
  password: {
    required: helpers.withMessage('La Clave es requerida.', (value) => {
      if (provider.value.id) return true
      return required.$validator(value)
    })
  },
  confirm_password: {
    required: helpers.withMessage('La confirmación es requerida.', (value) => {
      if (provider.value.id) return true
      return required.$validator(value)
    })
  },
  personal_id: {
    required: helpers.withMessage('El CI es requerido.', required),
    numeric: helpers.withMessage('El CI debe contener sólo números.', numeric),
    requiredlength: helpers.withMessage('El CI debe contener 11 caracteres.', requiredlength(11))
  }
}))

const {
  formData: provider,
  isLoading,
  isSaving,
  errorMessage,
  backendErrors,
  v$,
  loadData,
  handleSubmit,
  handleGoBack,
  getFieldErrors
} = useForm({
  initialData,
  rules,
  service: providerService,
  objectName: 'Prestador',
  gender: 'm',
  createMethod: 'postProvider',
  updateMethod: 'putProvider',
  detailMethod: 'detailProvider',
  listView: 'providers',
  detailView: 'providers_detail'
})

// lifecycle
onMounted(async () => await loadData(route.params.id))
</script>

<template>
  <div class="row mb-2">
    <!-- side menu -->
    <div class="col-md-2">
      <provider-form-menu />
    </div>

    <!-- main content -->
    <div class="col-md-9">
      <!-- loading provider data -->
      <div v-if="isLoading" class="col-md-4">
        <div class="d-flex justify-content-center align-items-center" style="min-height: 200px">
          <span role="status" class="text-primary">Cargando datos... </span>
          <span class="spinner-border spinner-border-sm text-primary" aria-hidden="true"></span>
        </div>
      </div>
      <!-- form -->
      <form v-else class="row" @submit.prevent="handleSubmit">
        <!-- backend errors -->
        <span v-if="backendErrors.non_field_errors">
          <p
            class="form-text text-danger"
            v-for="(error, i) in backendErrors.non_field_errors"
            :key="i"
          >
            {{ error }}
          </p>
        </span>
        <span v-if="errorMessage">
          <p class="form-text text-danger">
            {{ errorMessage }}
          </p>
        </span>

        <!-- username control -->
        <div class="col-md-3 mb-2">
          <div class="mb-2">
            <label for="username" class="form-label">Usuario</label>
            <input
              type="text"
              id="username"
              class="form-control"
              v-model.trim="provider.username"
              @blur="v$.username.$touch"
            />

            <!-- frontend validations -->
            <p class="form-text text-danger" v-for="error in v$.username.$errors" :key="error.$uid">
              {{ error.$message }}
            </p>

            <!-- backend validations -->
            <p
              v-for="(error, i) in getFieldErrors('username')"
              :key="`backend-${i}`"
              class="form-text text-danger"
            >
              {{ error }}
            </p>
          </div>
        </div>

        <!-- first_name control -->
        <div class="col-md-3 mb-2">
          <div class="mb-2">
            <label for="first_name" class="form-label">Nombre</label>
            <input
              type="text"
              id="first_name"
              class="form-control"
              v-model.trim="provider.first_name"
              @blur="v$.first_name.$touch"
            />

            <!-- frontend validations -->
            <p
              class="form-text text-danger"
              v-for="error in v$.first_name.$errors"
              :key="error.$uid"
            >
              {{ error.$message }}
            </p>

            <!-- backend validations -->
            <p
              v-for="(error, i) in getFieldErrors('first_name')"
              :key="`backend-${i}`"
              class="form-text text-danger"
            >
              {{ error }}
            </p>
          </div>
        </div>

        <!-- last_name control -->
        <div class="col-md-3 mb-2">
          <div class="mb-2">
            <label for="last_name" class="form-label">Apellidos</label>
            <input
              type="text"
              id="last_name"
              class="form-control"
              v-model.trim="provider.last_name"
              @blur="v$.last_name.$touch"
            />

            <!-- frontend validations -->
            <p
              class="form-text text-danger"
              v-for="error in v$.last_name.$errors"
              :key="error.$uid"
            >
              {{ error.$message }}
            </p>

            <!-- backend validations -->
            <p
              v-for="(error, i) in getFieldErrors('last_name')"
              :key="`backend-${i}`"
              class="form-text text-danger"
            >
              {{ error }}
            </p>
          </div>
        </div>

        <!-- tcp_code control -->
        <div class="col-md-3 mb-2">
          <div class="mb-2">
            <label for="tcp_code" class="form-label">Código TCP</label>
            <input
              type="text"
              id="tcp_code"
              class="form-control"
              v-model.trim="provider.tcp_code"
              @blur="v$.tcp_code.$touch"
            />

            <!-- frontend validations -->
            <p class="form-text text-danger" v-for="error in v$.tcp_code.$errors" :key="error.$uid">
              {{ error.$message }}
            </p>

            <!-- backend validations -->
            <p
              v-for="(error, i) in getFieldErrors('tcp_code')"
              :key="`backend-${i}`"
              class="form-text text-danger"
            >
              {{ error }}
            </p>
          </div>
        </div>

        <!-- bank_account_header control -->
        <div class="col-md-3 mb-2">
          <div class="mb-2">
            <label for="bank_account_header" class="form-label">Titular de la Cuenta</label>
            <input
              type="text"
              id="bank_account_header"
              class="form-control"
              v-model.trim="provider.bank_account_header"
              @blur="v$.bank_account_header.$touch"
            />

            <!-- frontend validations -->
            <p
              class="form-text text-danger"
              v-for="error in v$.bank_account_header.$errors"
              :key="error.$uid"
            >
              {{ error.$message }}
            </p>

            <!-- backend validations -->
            <p
              v-for="(error, i) in getFieldErrors('bank_accunt_header')"
              :key="`backend-${i}`"
              class="form-text text-danger"
            >
              {{ error }}
            </p>
          </div>
        </div>

        <!-- bank_account control -->
        <div class="col-md-3 mb-2">
          <div class="mb-2">
            <label for="bank_account" class="form-label">Nro de Cuenta</label>
            <input
              type="text"
              id="bank_account"
              class="form-control"
              v-model.trim="provider.bank_account"
              @blur="v$.bank_account.$touch"
            />

            <!-- frontend validations -->
            <p
              class="form-text text-danger"
              v-for="error in v$.bank_account.$errors"
              :key="error.$uid"
            >
              {{ error.$message }}
            </p>

            <!-- backend validations -->
            <p
              v-for="(error, i) in getFieldErrors('bank_account')"
              :key="`backend-${i}`"
              class="form-text text-danger"
            >
              {{ error }}
            </p>
          </div>
        </div>

        <!-- address control -->
        <div class="col-md-3 mb-2">
          <div class="mb-2">
            <label for="address" class="form-label">Dirección</label>
            <input
              type="text"
              id="address"
              class="form-control"
              v-model.trim="provider.address"
              @blur="v$.address.$touch"
            />

            <!-- frontend validations -->
            <p class="form-text text-danger" v-for="error in v$.address.$errors" :key="error.$uid">
              {{ error.$message }}
            </p>

            <!-- backend validations -->
            <p
              v-for="(error, i) in getFieldErrors('address')"
              :key="`backend-${i}`"
              class="form-text text-danger"
            >
              {{ error }}
            </p>
          </div>
        </div>

        <!-- activity control -->
        <div class="col-md-3 mb-2">
          <div class="mb-2">
            <label for="activity" class="form-label">Actividad</label>
            <input
              type="text"
              id="activity"
              class="form-control"
              v-model.trim="provider.activity"
              @blur="v$.activity.$touch"
            />

            <!-- frontend validations -->
            <p class="form-text text-danger" v-for="error in v$.activity.$errors" :key="error.$uid">
              {{ error.$message }}
            </p>

            <!-- backend validations -->
            <p
              v-for="(error, i) in getFieldErrors('activity')"
              :key="`backend-${i}`"
              class="form-text text-danger"
            >
              {{ error }}
            </p>
          </div>
        </div>

        <!-- license_number control -->
        <div class="col-md-3 mb-2">
          <div class="mb-2">
            <label for="license_number" class="form-label">Nro. de Licencia</label>
            <input
              type="text"
              id="license_number"
              class="form-control"
              v-model.trim="provider.license_number"
              @blur="v$.license_number.$touch"
            />

            <!-- frontend validations -->
            <p
              class="form-text text-danger"
              v-for="error in v$.license_number.$errors"
              :key="error.$uid"
            >
              {{ error.$message }}
            </p>

            <!-- backend validations -->
            <p
              v-for="(error, i) in getFieldErrors('license_number')"
              :key="`backend-${i}`"
              class="form-text text-danger"
            >
              {{ error }}
            </p>
          </div>
        </div>

        <!-- password control -->
        <div v-if="!provider.id" class="col-md-3 mb-2">
          <div class="mb-2">
            <label for="password" class="form-label">Clave</label>
            <input
              type="password"
              id="password"
              class="form-control"
              v-model.trim="provider.password"
              @blur="v$.password.$touch"
            />

            <!-- frontend validations -->
            <p class="form-text text-danger" v-for="error in v$.password.$errors" :key="error.$uid">
              {{ error.$message }}
            </p>

            <!-- backend validations -->
            <p
              v-for="(error, i) in getFieldErrors('password')"
              :key="`backend-${i}`"
              class="form-text text-danger"
            >
              {{ error }}
            </p>
          </div>
        </div>

        <!-- confirm password control -->
        <div v-if="!provider.id" class="col-md-3 mb-2">
          <div class="mb-2">
            <label for="password" class="form-label">Clave</label>
            <input
              type="password"
              id="password"
              class="form-control"
              v-model.trim="provider.confirm_password"
              @blur="v$.password.$touch"
            />

            <!-- frontend validations -->
            <p
              class="form-text text-danger"
              v-for="error in v$.confirm_password.$errors"
              :key="error.$uid"
            >
              {{ error.$message }}
            </p>

            <!-- backend validations -->
            <p
              v-for="(error, i) in getFieldErrors('confirm_password')"
              :key="`backend-${i}`"
              class="form-text text-danger"
            >
              {{ error }}
            </p>
          </div>
        </div>

        <!-- personal_id control -->
        <div class="col-md-3 mb-2">
          <div class="mb-2">
            <label for="personal_id" class="form-label">CI</label>
            <input
              type="text"
              id="personal_id"
              class="form-control"
              v-model.trim="provider.personal_id"
              @blur="v$.personal_id.$touch"
            />

            <!-- frontend validations -->
            <p
              class="form-text text-danger"
              v-for="error in v$.personal_id.$errors"
              :key="error.$uid"
            >
              {{ error.$message }}
            </p>

            <!-- backend validations -->
            <p
              v-for="(error, i) in getFieldErrors('personal_id')"
              :key="`backend-${i}`"
              class="form-text text-danger"
            >
              {{ error }}
            </p>
          </div>
        </div>

        <!-- buttons -->
        <div>
          <button type="submit" class="btn btn-sm btn-primary" :disabled="isSaving">
            <span v-if="isSaving" class="spinner-border spinner-border-sm me-1"></span>
            {{ !provider.id ? 'Guardar' : 'Actualizar' }}
          </button>
          <button class="btn btn-sm btn-secondary" @click="handleGoBack">Cancelar</button>
        </div>
      </form>
    </div>
  </div>
  <!-- end row -->
</template>
