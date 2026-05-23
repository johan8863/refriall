<script setup>
import { computed, ref } from 'vue'
import { useAuthStore } from '../../stores/authStore'
import { useRoute, useRouter } from 'vue-router'

const authStore = useAuthStore()

const router = useRouter()
const route = useRoute()

const user = ref({
  username: '',
  password: ''
})

const submitButtonClasses = computed(() => {
  return !authStore.isLoadingAuth ? 'btn btn-sm btn-primary' : 'btn btn-sm btn-success'
})

const authError = ref(null)

const handleLogin = async () => {
  try {
    authError.value = null
    await authStore.authenticate(user.value)
    const redirectRoute = route.query.redirect || { name: 'home' }
    router.push(redirectRoute)
  } catch (error) {
    if (error.response) {
      if (error.response.status === 400 || error.response.status === 401) {
        authError.value = 'Usuario o Clave incorrectos.'
      } else if (error.response.status === 500) {
        authError.value = 'Error en el servidor, consulte al desarrollador.'
      } else {
        authError.value = error.message
      }
    } else if (error.request) {
      authError.value = 'Servidor caído, consulte al desarrollador.'
    } else {
      authError.value = 'Error inesperado, consulte al desarrollador'
    }
  }
}
</script>
<template>
  <div class="container pt-4">
    <!-- main row -->
    <div class="row">
      <div class="col-12 col-sm-6 col-md-6 border-end border-2 border-primary">
        <!-- inner row for form -->
        <div class="row">
          <div class="col-10 col-sm-12 col-md-6 mx-auto">
            <h4 class="text-primary text-center fw-bolder">REFRIALL</h4>
            <!-- login form -->
            <form @submit.prevent="handleLogin">
              <!-- username control -->
              <div class="form-floating mb-3">
                <input type="text" v-model="user.username" id="username" class="form-control" />
                <label for="username">Usuario</label>
              </div>
              <!-- password control -->
              <div class="form-floating mb-3">
                <input type="password" v-model="user.password" id="password" class="form-control" />
                <label for="password">Clave</label>
              </div>
              <!-- submit button -->
              <div class="d-grid">
                <button type="submit" :class="submitButtonClasses">
                  <div v-if="!authStore.isLoadingAuth">Entrar</div>
                  <div v-else>
                    <span role="status">Autenticando... </span>
                    <span class="spinner-border spinner-border-sm" aria-hidden="true"></span>
                  </div>
                </button>
              </div>
            </form>
            <!-- messages -->
            <div>
              <div class="text-center" v-if="authError">
                <span class="form-text text-danger">{{ authError }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="col-sm-6 col-md-6 d-none d-sm-flex justify-content-sm-center justify-content-md-center">
        <img src="../../assets/gear_only.png" class="img-fluid" alt="REFRIALL Logo" />
      </div>
    </div>
  </div>
</template>
