<script setup>
// vue
import { useRoute } from 'vue-router'
import { onMounted, ref } from 'vue'

// third
import { required, minValue, helpers } from '@vuelidate/validators'
import { useVuelidate } from '@vuelidate/core'

// app
import ItemFormMenu from '../../components/items/menus/ItemFormMenu.vue'
import { itemService } from '../../services/itemService'
import { useForm } from '../../composables/useForm.js'

// main item object to used in composable
const initialData = {
  id: null,
  code: '',
  name: '',
  item_type: '',
  measurement: '',
  price: 0
}

// router utilities and handlers
const route = useRoute()

// vuelidate rules
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
    required: helpers.withMessage('La unidad de medida es requierida.', required)
  },
  price: {
    required: helpers.withMessage('El precio es requerido.', required),
    minValue: helpers.withMessage('El valor mínimo es 0.01', minValue(0.01))
  }
}

// useForm composable
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
} = useForm({
  initialData,
  rules,
  service: itemService,
  objectName: 'Equipo',
  gender: 'm',
  createMethod: 'postItem',
  updateMethod: 'putItem',
  detailMethod: 'detailItem',
  listView: 'items',
  detailView: 'items_detail'
})

// onMounted cycle to get an item object if editing intended
onMounted(async () => await loadData(route.params.id))
</script>

<template>
  <div class="row">
    <!-- side menu -->
    <div class="col-md-2">
      <ItemFormMenu />
    </div>

    <!-- main content -->

    <!-- loading item data -->
    <div v-if="isLoading" class="col-md-6">
      <div class="d-flex justify-content-center align-items-center" style="min-height: 200px">
        <span role="status" class="text-primary">Cargando datos... </span>
        <span class="spinner-border spinner-border-sm text-primary" aria-hidden="true"></span>
      </div>
    </div>

    <!-- displaying form -->
    <div v-else class="col-md-4">
      <!-- backend errors when getting item data -->
      <span v-if="errorMessage">
        <p class="form-text text-danger">{{ errorMessage }}</p>
      </span>
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
      <!-- form -->
      <form @submit.prevent="handleSubmit">
        <!-- code control -->
        <div class="mb-2">
          <label for="code" class="form-label">Código</label>
          <input
            type="text"
            id="code"
            class="form-control"
            v-model.trim="item.code"
            @blur="v$.code.$touch"
          />
          <!-- frontend errors -->
          <p class="form-text text-danger" v-for="error in v$.code.$errors" :key="error.$uid">
            {{ error.$message }}
          </p>
          <!-- backend errors -->
          <p
            v-for="(error, i) in getFieldErrors('code')"
            :key="`backend-${i}`"
            class="form-text text-danger"
          >
            {{ error }}
          </p>
        </div>
        <!-- name control -->
        <div class="mb-2">
          <label for="name" class="form-label">Nombre</label>
          <input
            type="text"
            id="name"
            class="form-control"
            v-model.trim="item.name"
            @blur="v$.name.$touch"
          />
          <!-- frontend validations -->
          <p class="form-text text-danger" v-for="error in v$.name.$errors" :key="error.$uid">
            {{ error.$message }}
          </p>
          <!-- backend validations -->
          <p
            v-for="(error, i) in getFieldErrors('name')"
            :key="`backend-${i}`"
            class="form-text text-danger"
          >
            {{ error }}
          </p>
        </div>
        <!-- item_type control -->
        <div class="mb-2">
          <label for="item_type" class="form-label">Tipo</label>
          <select
            id="item_type"
            class="form-select"
            v-model.trim="item.item_type"
            @blur="v$.item_type.$touch"
          >
            <option value="revision">Rev/Diag.</option>
            <option value="prod">Producto</option>
            <option value="concept">Concepto</option>
            <option value="repair">Reparación</option>
            <option value="maintenace">Mtto</option>
            <option value="install">Instal/Mont</option>
            <option value="unmounting">Desmontaje</option>
          </select>
          <!-- frontend validations -->
          <p class="form-text text-danger" v-for="error in v$.item_type.$errors" :key="error.$uid">
            {{ error.$message }}
          </p>
          <!-- backend validations -->
          <p
            v-for="(error, i) in getFieldErrors('item_type')"
            :key="`backend-${i}`"
            class="form-text text-danger"
          >
            {{ error }}
          </p>
        </div>
        <!-- measurement control -->
        <div class="mb-2">
          <label for="measurement" class="form-label">U/M</label>
          <select
            id="measurement"
            class="form-select"
            v-model.trim="item.measurement"
            @blur="v$.measurement.$touch"
          >
            <option value="u">Uno</option>
            <!-- only products can have any kind of measurement -->
            <template v-if="item.item_type === 'prod'">
              <option value="m">Metros</option>
              <option value="kg">Kilogramos</option>
              <option value="lts">Litros</option>
              <option value="gl">Galones</option>
              <option value="tr">Tiras</option>
              <option value="pqt">Paquetes</option>
            </template>
          </select>
          <!-- frontend validations -->
          <p
            class="form-text text-danger"
            v-for="error in v$.measurement.$errors"
            :key="error.$uid"
          >
            {{ error.$message }}
          </p>
          <!-- backend validations -->
          <p
            v-for="(error, i) in getFieldErrors('measurement')"
            :key="`backend-${i}`"
            class="form-text text-danger"
          >
            {{ error }}
          </p>
        </div>
        <!-- price control -->
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
          <!-- frontend validations -->
          <p class="form-text text-danger" v-for="error in v$.price.$errors" :key="error.$uid">
            {{ error.$message }}
          </p>
          <!-- backend validations -->
          <p
            v-for="(error, i) in getFieldErrors('price')"
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
  <!-- end row -->
</template>
