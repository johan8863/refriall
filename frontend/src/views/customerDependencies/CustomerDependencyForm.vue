<script setup>
// vue
import { onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'

// third
import { required, helpers } from '@vuelidate/validators'
import { useVuelidate } from '@vuelidate/core'

// app
import CustomerDependencyCreateMenu from '@/components/customerDependencies/menus/CustomerDependencyCreateMenu.vue'
import { customerDependecyService } from '@/services/customerDependencyService.js'
import { useErrorHandler } from '@/composables/useErrorHandler.js'
import { useRouting } from '@/composables/routingFunctions.js'

// router utilities and handlers
const router = useRouter()
const route = useRoute()

const { goToDetail } = useRouting()

const handleGoToDetail = () => {
  try {
    goToDetail('customers_detail', dependency.value.customer)
  } catch (error) {
    console.error(error)
  }
}

// dependency objects
const dependency = ref({
  id: null,
  customer: '',
  name: '',
  address: '',
  province: '',
  township: ''
})

// useFormErrorHandler refs
const { errorMessage, backendErrors, handleError, getFieldErrors } = useErrorHandler({
  objectName: 'Dependencia'
})

// validation rules
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

// vuelidate object
const v$ = useVuelidate(rules, dependency)

// methods
const handleSubmit = async () => {
  // vuelidate validations
  if (await v$.value.$validate()) {
    try {
      const isUpdate = !!dependency.value.id
      const method = isUpdate
        ? customerDependecyService.putCustomerDependcy(dependency.value)
        : customerDependecyService.postCustomerDependency(dependency.value)
      await method
      handleGoToDetail()
    } catch (error) {}
  } else {
    console.error('Validation errors:', v$.value.$errors)
  }
}

onMounted(async () => {
  if (route.name === 'customer_dependecy_create') {
    dependency.value.customer = route.params.id
    return
  }

  try {
    const id = route.params.id
    const { data } = await customerDependecyService.detailCustomerDependecy(id)
    dependency.value = data
  } catch (error) {
    console.error('General errors:', { error })
    handleError(error)
  }
})
</script>

<template>
  <div class="row">
    <!-- side menu -->
    <div class="col-md-2">
      <customer-dependency-create-menu />
    </div>

    <!-- main content -->
    <div class="col-md-4">
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
            type="text"
            id="name"
            class="form-control"
            v-model.trim="dependency.name"
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

        <!-- address control -->
        <div class="mb-2">
          <label for="address">Dirección</label>
          <textarea
            name="address"
            id="address"
            class="form-control"
            v-model.trim="dependency.address"
            @blur="v$.address.$touch"
            cols="5"
            rows="5"
          ></textarea>
          <!-- frontend errors -->
          <p class="form-text text-danger" v-for="error in v$.address.$errors" :key="error.$uid">
            {{ error.$message }}
          </p>
          <!-- backend errors -->
          <p
            v-for="(error, i) in getFieldErrors('address')"
            :key="`backend-${i}`"
            class="form-text text-danger"
          >
            {{ error }}
          </p>
        </div>

        <!-- province control -->
        <div class="mb-2">
          <label for="province">Provincia</label>
          <input
            type="text"
            id="province"
            class="form-control"
            v-model.trim="dependency.province"
            @blur="v$.province.$touch"
          />
          <!-- frontend errors -->
          <p class="form-text text-danger" v-for="error in v$.province.$errors" :key="error.$uid">
            {{ error.$message }}
          </p>
          <!-- backend errors -->
          <p
            v-for="(error, i) in getFieldErrors('province')"
            :key="`backend-${i}`"
            class="form-text text-danger"
          >
            {{ error }}
          </p>
        </div>

        <!-- township control -->
        <div class="mb-2">
          <label for="township">Municipio</label>
          <input
            type="text"
            id="township"
            class="form-control"
            v-model.trim="dependency.township"
          />
          <!-- frontend errors -->
          <p class="form-text text-danger" v-for="error in v$.township.$errors" :key="error.$uid">
            {{ error.$message }}
          </p>
          <!-- backend errors -->
          <p
            v-for="(error, i) in getFieldErrors('township')"
            :key="`backend-${i}`"
            class="form-text text-danger"
          >
            {{ error }}
          </p>
        </div>

        <!-- buttons -->
        <div class="mb-2">
          <button type="submit" class="btn btn-sm btn-primary">
            {{ dependency.id ? 'Actualizar' : 'Guardar' }}
          </button>
          <button type="button" class="btn btn-sm btn-secondary" @click="handleGoToDetail">
            Cancelar
          </button>
        </div>
      </form>
    </div>
  </div>
</template>
