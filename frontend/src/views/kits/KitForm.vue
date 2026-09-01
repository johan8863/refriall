<script setup lang="ts">
// vue
import { onMounted } from 'vue'
import { useRoute } from 'vue-router'

// third
import { required, helpers } from '@vuelidate/validators'

// app
import KitFormMenu from '../../components/kits/menus/KitFormMenu.vue'
import { kitService } from '../../services/kitService'
import { useForm } from '../../composables/useForm'
import type { Kit } from './types'

// Routing
const route = useRoute()

// Validation rules
const rules = {
  name: {
    required: helpers.withMessage('El nombre es requerido.', required)
  }
}

// ✅ useForm with Kit type
const {
  formData: kit,
  isLoading,
  isSaving,
  errorMessage,
  backendErrors,
  v$,
  loadData,
  handleSubmit,
  handleGoBack,
  getFieldErrors
} = useForm<Kit>({
  initialData: {
    id: 0,
    name: ''
  },
  rules,
  service: kitService,
  objectName: 'Equipo',
  gender: 'm',
  createMethod: 'postKit',
  updateMethod: 'putKit',
  detailMethod: 'detailKit',
  listView: 'kits',
  detailView: 'kits_detail'
})

// Lifecycle
onMounted(async () => await loadData(route.params.id as string))
</script>

<template>
  <div class="row">
    <!-- side menu -->
    <div class="col-md-2">
      <KitFormMenu />
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
      <div v-if="backendErrors.non_field_errors">
        <p
          class="form-text text-danger"
          v-for="(error, index) in backendErrors.non_field_errors"
          :key="index"
        >
          {{ error }}
        </p>
      </div>

      <!-- backend general errors -->
      <div v-if="errorMessage" class="alert alert-danger">
        {{ errorMessage }}
      </div>

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
          <button type="submit" class="btn btn-sm btn-primary" :disabled="isSaving">
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
