<script setup>
// vue
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'

// app
import { customerDependecyService } from '../../services/customerDependencyService'

// third
import { useVuelidate } from '@vuelidate/core'
import { required, helpers } from '@vuelidate/validators'
import CustomerDependencyUpdateMenu from '../../components/customerDependencies/menus/CustomerDependencyUpdateMenu.vue'
import { useRouting } from '../../composables/routingFunctions.js'
import { useFormErrorHandler } from '../../composables/useErrorFormHandler.js'

// router utilities and handlers
const router = useRouter()
const route = useRoute()

const { goToDetail } = useRouting()

const handleGoToDetail = () => {
  try {
    goToDetail('customer_dependecy_detail', dependency.value.id)
  } catch (error) {
    console.error(error)
  }
}

// dependecy object
const dependency = ref({
  id: null,
  customer: null,
  name: '',
  address: '',
  province: '',
  township: ''
})

// customer object to be created or updated
const { errorMessage, backendErrors, handleError, getFieldErrors } = useFormErrorHandler({
  objectName: 'Dependencia'
})

// loading state
const isLoading = ref(false)

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
const updateDependency = async () => {
  try {
    if (await v$.value.$validate()) {
      const { data } = await customerDependecyService.putCustomerDependcy(dependency.value)
      router.push({
        name: 'customers_detail',
        params: {
          id: data.customer
        }
      })
    } else {
      // always log vuelidate erros to de console
      // just in case of unexpected behavior
      console.error(
        v$.value.$errors.map((err) => ({
          property: err.$property,
          message: err.$message
        }))
      )
    }
  } catch (error) {
    console.error('General errors:', { error })
    handleError(error)
  }
}

// onMounted cycle
onMounted(async () => {
  try {
    // start loading state
    isLoading.value = true
    // get dependency data
    const resp = await customerDependecyService.detailCustomerDependecy(route.params.id)
    dependency.value = resp.data
  } catch (error) {
    errorHandler(error, errorMessage, 'Dependencia')
    if (error.response) {
      if (error.response.data) {
        dependency.value = error.response.data
      }
    }
  } finally {
    // stop loading state
    isLoading.value = false
  }
})
</script>

<template>
  <div class="row">
    <!-- side menu -->
    <div class="col-md-2">
      <customer-dependency-update-menu />
    </div>

    <!-- main content -->

    <!-- loading dependency data -->
    <div v-if="isLoading" class="col-md-4">
      <div class="d-flex justify-content-center align-items-center" style="min-height: 200px">
        <span role="status" class="text-primary">Cargando datos... </span>
        <span class="spinner-border spinner-border-sm text-primary" aria-hidden="true"></span>
      </div>
    </div>
    <!-- errors -->
    <div v-else-if="backendErrors.non_field_errors" class="col-md-4">
      <span>
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
    </div>
    <!-- displaying dependency data -->
    <div v-else class="col-md-4">
      <!-- form -->
      <form @submit.prevent="updateDependency">
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
            @blur="v$.township.$touch"
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
          <button type="submit" class="btn btn-sm btn-primary">Guardar</button>
          <button type="button" class="btn btn-sm btn-secondary" @click="handleGoToDetail">
            Cancelar
          </button>
        </div>
      </form>
    </div>
  </div>
</template>
