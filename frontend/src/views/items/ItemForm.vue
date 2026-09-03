<script setup lang="ts">
// vue
import { onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { helpers, required, minValue } from '@vuelidate/validators'

// app
import { itemService } from '@/services/itemService'
import ItemFormMenu from '@/components/items/menus/ItemFormMenu.vue'
import { useForm } from '@/composables/useForm'
import { ITEM_TYPE_OPTIONS, MEASUREMENT_OPTIONS, type Item, type Measurement } from './types'

const route = useRoute()

// Validation rules
const rules = {
  code: {
    required: helpers.withMessage('El código es requerido.', required)
  },
  name: {
    required: helpers.withMessage('El nombre es requerido.', required)
  },
  item_type: {
    required: helpers.withMessage('El tipo es requerido.', required)
  },
  measurement: {
    required: helpers.withMessage('La unidad de medida es requerida.', required)
  },
  price: {
    required: helpers.withMessage('El precio es requerido.', required),
    minValue: helpers.withMessage('El valor mínimo es 0.01', minValue(0.01))
  }
}

// Use form composable with Item type
const {
  formData: item,
  isLoading,
  isSaving,
  errorMessage,
  backendErrors,
  v$,
  loadData,
  handleSubmit,
  handleGoBack,
  getFieldErrors
} = useForm<Item>({
  initialData: {
    id: 0,
    code: '',
    name: '',
    item_type: 'prod',
    measurement: null,
    price: 0,
    get_item_type: '',
    get_measurement: null
  },
  rules,
  service: itemService,
  objectName: 'Artículo',
  gender: 'm',
  createMethod: 'postItem',
  updateMethod: 'putItem',
  detailMethod: 'detailItem',
  listView: 'items',
  detailView: 'items_detail'
})

// Computed for measurement options (filtered by item type)
const measurementOptions = computed(() => {
  // Only products can have different measurements
  if (item.value.item_type === 'prod') {
    return MEASUREMENT_OPTIONS
  }
  // Other item types only have 'u' (Uno)
  return MEASUREMENT_OPTIONS.filter((opt) => opt.value === 'u')
})

// Lifecycle
onMounted(async () => await loadData(route.params.id as string))
</script>

<template>
  <div class="row">
    <!-- side menu -->
    <div class="col-md-2">
      <ItemFormMenu />
    </div>

    <!-- main content -->
    <div v-if="isLoading" class="col-md-6">
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
        <!-- Code field -->
        <div class="mb-2">
          <label for="code" class="form-label">Código</label>
          <input
            autofocus
            type="text"
            id="code"
            class="form-control"
            v-model.trim="item.code"
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

        <!-- Name field -->
        <div class="mb-2">
          <label for="name" class="form-label">Nombre</label>
          <input
            type="text"
            id="name"
            class="form-control"
            v-model.trim="item.name"
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

        <!-- Item type field -->
        <div class="mb-2">
          <label for="item_type" class="form-label">Tipo</label>
          <select
            id="item_type"
            class="form-select"
            v-model.trim="item.item_type"
            @blur="v$.item_type.$touch"
          >
            <option v-for="option in ITEM_TYPE_OPTIONS" :key="option.value" :value="option.value">
              {{ option.label }}
            </option>
          </select>

          <p class="form-text text-danger" v-for="error in v$.item_type.$errors" :key="error.$uid">
            {{ error.$message }}
          </p>

          <p
            v-for="(error, i) in getFieldErrors('item_type')"
            :key="`backend-${i}`"
            class="form-text text-danger"
          >
            {{ error }}
          </p>
        </div>

        <!-- Measurement field -->
        <div class="mb-2">
          <label for="measurement" class="form-label">U/M</label>
          <select
            id="measurement"
            class="form-select"
            v-model.trim="item.measurement"
            @blur="v$.measurement.$touch"
          >
            <option v-for="option in measurementOptions" :key="option.value" :value="option.value">
              {{ option.label }}
            </option>
          </select>

          <p
            class="form-text text-danger"
            v-for="error in v$.measurement.$errors"
            :key="error.$uid"
          >
            {{ error.$message }}
          </p>

          <p
            v-for="(error, i) in getFieldErrors('measurement')"
            :key="`backend-${i}`"
            class="form-text text-danger"
          >
            {{ error }}
          </p>
        </div>

        <!-- Price field -->
        <div class="mb-2">
          <label for="price" class="form-label">Precio</label>
          <input
            type="number"
            id="price"
            step="0.01"
            class="form-control"
            v-model.trim="item.price"
            @blur="v$.price.$touch"
          />

          <p class="form-text text-danger" v-for="error in v$.price.$errors" :key="error.$uid">
            {{ error.$message }}
          </p>

          <p
            v-for="(error, i) in getFieldErrors('price')"
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
            {{ !item.id ? 'Guardar' : 'Actualizar' }}
          </button>
          <button type="button" class="btn btn-sm btn-secondary" @click="handleGoBack">
            Cancelar
          </button>
        </div>
      </form>
    </div>
  </div>
</template>
