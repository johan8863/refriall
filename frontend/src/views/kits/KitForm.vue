<script setup>
// vue
import { onMounted } from 'vue'
import { useRoute } from 'vue-router'

// third
import { required, helpers } from '@vuelidate/validators'

// app
import KitFormMenu from '../../components/kits/menus/KitFormMenu.vue'
import { kitService } from '../../services/kitService'
import { useForm } from '../../composables/useForm.js'
import { useRouting } from '../../composables/routingFunctions.js'

// routing utilities and handlers
const route = useRoute()

const { goBack } = useRouting()

const handleGoBack = () => goBack('kits', 'kits_detail', kit.value.id)

// rules to manage front validations
const rules = {
  name: {
    required: helpers.withMessage('El nombre es requierido.', required)
  }
}

// useForm functions and composables
const {
  formData: kit,
  isLoading,
  isSaving,
  errorMessage,
  backendErrors,
  v$,
  loadData,
  handleSubmit,
  getFieldErrors
} = useForm({
  initialData: {
    id: null,
    name: ''
  },
  rules,
  service: kitService,
  objectName: 'Equipo',
  gender: 'm',
  createMethod: 'postKit',
  updateMethod: 'putKit',
  detailMethod: 'detailKit',
  onSuccess: (data) => router.push({ name: 'kits_detail', params: { id: data.id } })
})

// lifecycle
onMounted(async () => {
  await loadData(route.params.id)
})
</script>

<template>
  <div class="row">
    <!-- side menu -->
    <div class="col-md-2">
      <kit-form-menu />
    </div>

    <!-- main content -->

    <!-- loading kit data -->
    <div v-if="isLoading" class="col-md-6">
      <div class="d-flex justify-content-center align-items-center" style="min-height: 200px">
        <span role="status" class="text-primary">Cargando datos... </span>
        <span class="spinner-border spinner-border-sm text-primary" aria-hidden="true"></span>
      </div>
    </div>
    <!-- displaying kit data -->
    <div v-else class="col-md-4">
      <!-- backend errors from non_field_errors dictionary -->
      <span v-if="backendErrors.non_field_errors">
        <p
          class="form-text text-danger"
          v-for="(error, index) in backendErrors.non_field_errors"
          :key="index"
        >
          {{ error }}
        </p>
      </span>
      <!-- backend general errors -->
      <span v-if="errorMessage">
        <p class="form-text text-danger">
          {{ errorMessage }}
        </p>
      </span>
      <!-- form -->
      <form @submit.prevent="handleSubmit">
        <!-- name control -->
        <div class="mb-2">
          <label for="name" class="form-label">Nombre</label>
          <input
            autofocus
            type="text"
            id="name"
            class="form-control"
            v-model.trim="kit.name"
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
        <!-- buttons -->
        <div>
          <!-- 
            the order in the ternary operator is due to the fact that 
            this form is more often used to create than to update 
          -->
          <button type="submit" class="btn btn-sm btn-primary">
            <span v-if="isSaving" class="spinner-border spinner-border-sm me-1"></span>
            {{ !kit.id ? 'Guardar' : 'Actualizar' }}
          </button>
          <button type="button" class="btn btn-sm btn-secondary" @click="handleGoBack">
            Cancelar
          </button>
        </div>
      </form>
    </div>
  </div>
  <!-- end row -->
</template>
