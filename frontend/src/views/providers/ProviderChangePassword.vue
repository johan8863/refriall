<script setup>
// vue
import { onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';

// third
import { useVuelidate } from '@vuelidate/core'
import { required, helpers } from '@vuelidate/validators'

// app
import ProviderChangeSelfPasswordMenu from '../../components/providers/menus/ProviderChangeSelfPasswordMenu.vue';
import { providerService } from '../../services/providerService.js';
import { useRouting } from '../../composables/routingFunctions.js';

// main object
const providerChangePassword = ref({
  new_password: '',
  confirm_new_password: ''
})

// object backend errors
const backendErrors = ref({
  new_password: [],
  confirm_new_password: [],
  network: ''
})

// routing utilities
const router = useRouter()
const route = useRoute()

// rules to manage front validations
const rules = {
  new_password: {
    required: helpers.withMessage('La nueva clave es requerida.', required)
  },
  confirm_new_password: {
    required: helpers.withMessage('La confirmación es requerida.', required)
  },
}

// vuelidate object
const v$ = useVuelidate(rules, providerChangePassword)

// change password function
const handleChangePassword = async () => {
  try {
    if (await v$.value.$validate()) {
      await providerService.changePassword(route.params.id, providerChangePassword.value)
      router.push({name: 'providers_detail', params: {id: route.params.id}})
    } else {
      // always log vuelidate erros to de console
      // just in case of unexpected behavior
      console.error(v$.value.$errors.map(err => ({
        property: err.$property, message: err.$message
      })))
    }
  } catch (error) {
    console.error({error})
    if (error.response) {
      backendErrors.value = error.response.data
    }
    if (error.code === 'ERR_NETWORK') {
      backendErrors.value.network = 'Servidor caído, consulte al desarrollador.'
    }
  }
}

onMounted(() => console.log(route.params.id))

</script>

<template>
  <div class="row">
    <!-- side menu -->
    <div class="col-sm-2 col-md-2">
      <provider-change-self-password-menu />
    </div>

    <!-- main content -->
    <div class="col-md-2 col-sm-3">
      <!-- backend errors from non_field_errors dictionary -->
      <span v-if="backendErrors.non_field_errors">
        <p
          class="form-text text-danger"
          v-for="(error, index) in kitErrors.non_field_errors"
          :key="index"
        >
          {{ error }}
        </p>
      </span>
      <!-- network error -->
      <span v-if="backendErrors.network">
        <p class="form-text text-danger">{{ backendErrors.network }}</p>
      </span>
      <form @submit.prevent="handleChangePassword">
        <!-- new_password control -->
        <div class="mb-3">
          <label for="new_password" class="form-label">Nueva clave</label>
          <input
            autofocus
            type="password"
            id="new_password"
            class="form-control form-control-sm"
            v-model="providerChangePassword.new_password"
            @blur="v$.new_password.$touch">
          <!-- frontend validations -->
          <p class="form-text text-danger" v-for="error in v$.new_password.$errors" :key="error.$uid">
            {{ error.$message }}
          </p>
          <!-- backend validations -->
            <span v-if="backendErrors.new_password">
              <p class="form-text text-danger" v-for="(error, index) in backendErrors.new_password" :key="index">
                {{ error }}
              </p>
            </span>
        </div>
        <!-- confirm_new_password control -->
        <div class="mb-3">
          <label for="confirm_new_password" class="form-label">Confirmar nueva clave</label>
          <input
            type="password"
            id="confirm_new_password"
            class="form-control form-control-sm"
            v-model="providerChangePassword.confirm_new_password"
            @blur="v$.confirm_new_password.$touch">
          <!-- frontend validations -->
          <p class="form-text text-danger" v-for="error in v$.confirm_new_password.$errors" :key="error.$uid">
            {{ error.$message }}
          </p>
          <!-- backend validations -->
          <span v-if="backendErrors.confirm_new_password">
            <p class="form-text text-danger" v-for="(error, index) in backendErrors.confirm_new_password" :key="index">
              {{ error }}
            </p>
          </span>
        </div>
        <!-- buttons -->
        <div>
          <button class="btn btn-sm btn-primary">Cambiar</button>
          <router-link class="btn btn-sm btn-secondary" :to="{name: 'providers_detail', params: {id: route.params.id}}">Cancelar</router-link>
        </div>
      </form>
    </div>
  </div>
</template>
