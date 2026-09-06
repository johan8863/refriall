<script setup lang="ts">
// vue
import { onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'

// third
import { useVuelidate } from '@vuelidate/core'
import { required, helpers } from '@vuelidate/validators'

// app
import ProviderChangeSelfPasswordMenu from '@/components/providers/menus/ProviderChangeSelfPasswordMenu.vue'
import { providerService } from '@/services/providerService'
import type { ProviderChangePassword, PasswordChangeErrors } from './types'

// Main object
const providerChangePassword = ref<ProviderChangePassword>({
  confirm_new_password: '',
  new_password: ''
})

// Backend errors
const backendErrors = ref<PasswordChangeErrors>({
  confirm_new_password: [],
  new_password: [],
  network: ''
})

// Routing
const router = useRouter()
const route = useRoute()

// Validation rules
const rules = {
  confirm_new_password: {
    required: helpers.withMessage('La nueva clave es requerida.', required)
  },
  new_password: {
    required: helpers.withMessage('La confirmación es requerida.', required)
  }
}

// Vuelidate
const v$ = useVuelidate(rules, providerChangePassword)

// Change password function
const handleChangePassword = async (): Promise<void> => {
  try {
    if (await v$.value.$validate()) {
      await providerService.changePassword(Number(route.params.id), providerChangePassword.value)
      router.push({ name: 'providers_detail', params: { id: route.params.id } })
    } else {
      console.error(
        v$.value.$errors.map((err) => ({
          property: err.$property,
          message: err.$message
        }))
      )
    }
  } catch (error: any) {
    console.error({ error })
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
    <div class="col-sm-2 col-md-2">
      <ProviderChangeSelfPasswordMenu />
    </div>

    <div class="col-md-2 col-sm-3">
      <!-- Non-field errors -->
      <div v-if="backendErrors.non_field_errors">
        <p
          class="form-text text-danger"
          v-for="(error, index) in backendErrors.non_field_errors"
          :key="index"
        >
          {{ error }}
        </p>
      </div>

      <!-- Network error -->
      <div v-if="backendErrors.network">
        <p class="form-text text-danger">{{ backendErrors.network }}</p>
      </div>

      <form @submit.prevent="handleChangePassword">
        <!-- New password -->
        <div class="mb-3">
          <label for="confirm_new_password" class="form-label">Nueva clave</label>
          <input
            autofocus
            type="password"
            id="confirm_new_password"
            class="form-control form-control-sm"
            v-model="providerChangePassword.confirm_new_password"
            @blur="v$.confirm_new_password.$touch"
          />
          <p
            class="form-text text-danger"
            v-for="error in v$.confirm_new_password.$errors"
            :key="error.$uid"
          >
            {{ error.$message }}
          </p>
          <div v-if="backendErrors.confirm_new_password">
            <p
              class="form-text text-danger"
              v-for="(error, index) in backendErrors.confirm_new_password"
              :key="index"
            >
              {{ error }}
            </p>
          </div>
        </div>

        <!-- Confirm new password -->
        <div class="mb-3">
          <label for="new_password" class="form-label">Confirmar nueva clave</label>
          <input
            type="password"
            id="new_password"
            class="form-control form-control-sm"
            v-model="providerChangePassword.new_password"
            @blur="v$.new_password.$touch"
          />
          <p
            class="form-text text-danger"
            v-for="error in v$.new_password.$errors"
            :key="error.$uid"
          >
            {{ error.$message }}
          </p>
          <div v-if="backendErrors.new_password">
            <p
              class="form-text text-danger"
              v-for="(error, index) in backendErrors.new_password"
              :key="index"
            >
              {{ error }}
            </p>
          </div>
        </div>

        <!-- Buttons -->
        <div>
          <button type="submit" class="btn btn-sm btn-primary">Cambiar</button>
          <router-link
            class="btn btn-sm btn-secondary"
            :to="{ name: 'providers_detail', params: { id: route.params.id } }"
          >
            Cancelar
          </router-link>
        </div>
      </form>
    </div>
  </div>
</template>
