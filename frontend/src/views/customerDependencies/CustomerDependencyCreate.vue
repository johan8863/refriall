<script setup>
// vue
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'

// app
import { customerDependecyService } from '../../services/customerDependencyService'

// third
import { useVuelidate } from '@vuelidate/core'
import { required, helpers } from '@vuelidate/validators'
import CustomerDependencyCreateMenu from '../../components/customerDependencies/menus/CustomerDependencyCreateMenu.vue'
import { useRouting } from '../../composables/routingFunctions.js'

// router utilities and handlers
const router = useRouter()
const route = useRoute()

const { goToListPost } = useRouting()

const handleGoToListPost = () => {
  try {
    goToListPost('customers')
  } catch (error) {
    console.error(error)
  }
}

// dependency objects
const dependency = ref({
  customer: '',
  name: '',
  address: '',
  province: '',
  township: ''
})

// errors holder object
const dependencyErrors = ref({
  customer: [],
  name: [],
  address: [],
  province: [],
  township: []
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
const createDependency = async () => {
  try {
    if (await v$.value.$validate()) {
      dependency.value.customer = route.params.id
      const { data } = await customerDependecyService.postCustomerDependency(dependency.value)
      router.push({
        name: 'customers_detail',
        params: {
          id: data.customer
        }
      })
    } else {
      // always log vuelidate erros to de console
      // just in case of unexpected behavior
      console.error(v$.value.$errors.map(err => ({
        property: err.$property, message: err.$message
      })))
    }
  } catch (error) {
    console.error('General error', error)
    if (error.response) {
      dependencyErrors.value = error.response.data
    } else {
      dependencyErrors.value = { message: 'Error inesperado, consulte al desarrollador' }
    }
  }
}
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
      <span v-if="dependencyErrors.non_field_errors">
        <p
          class="form-text text-danger"
          v-for="(error, index) in dependencyErrors.non_field_errors"
          :key="index"
        >
          {{ error }}
        </p>
      </span>
      <!-- backend general errors -->
      <span v-if="dependencyErrors.message">
        <p class="form-text text-danger">
          {{ dependencyErrors.message }}
        </p>
      </span>
      <!-- form -->
      <form @submit.prevent="createDependency">
        <span v-if="dependencyErrors.non_field_errors">
          <p
            class="form-text text-danger"
            v-for="(error, i) in dependencyErrors.non_field_errors"
            :key="i"
          >
            {{ error.$message }}
          </p>
        </span>
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
          <span v-if="v$.name.$error">
            <p class="form-text text-danger" v-for="error in v$.name.$errors" :key="error.$uid">
              {{ error.$message }}
            </p>
          </span>
          <span v-if="dependencyErrors.name">
            <p class="form-text text-danger" v-for="(error, i) in dependencyErrors.name" :key="i">
              {{ error }}
            </p>
          </span>
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
          <span v-if="v$.address.$error">
            <p class="form-text text-danger" v-for="error in v$.address.$errors" :key="error.$uid">
              {{ error.$message }}
            </p>
          </span>
          <span v-if="dependencyErrors.address">
            <p
              class="form-text text-danger"
              v-for="(error, i) in dependencyErrors.address"
              :key="i"
            >
              {{ error }}
            </p>
          </span>
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
          <span v-if="v$.province.$error">
            <p class="form-text text-danger" v-for="error in v$.province.$errors" :key="error.$uid">
              {{ error.$message }}
            </p>
          </span>
          <span v-if="dependencyErrors.customer_type">
            <p
              class="form-text text-danger"
              v-for="(error, i) in dependencyErrors.province"
              :key="i"
            >
              {{ error }}
            </p>
          </span>
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
          <span v-if="v$.township.$error">
            <p class="form-text text-danger" v-for="error in v$.township.$errors" :key="error.$uid">
              {{ error.$message }}
            </p>
          </span>
          <span v-if="dependencyErrors.customer_type">
            <p
              class="form-text text-danger"
              v-for="(error, i) in dependencyErrors.township"
              :key="i"
            >
              {{ error }}
            </p>
          </span>
        </div>

        <!-- buttons -->
        <div class="mb-2">
          <button type="submit" class="btn btn-sm btn-primary">Guardar</button>
          <button type="button" class="btn btn-sm btn-secondary" @click="handleGoToListPost">
            Cancelar
          </button>
        </div>
      </form>
    </div>
  </div>
</template>
