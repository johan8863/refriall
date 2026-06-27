<script setup>

// vue
import { computed, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'

// app
import { useAuthStore } from '../../stores/authStore'

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
      authError.value = 'Error inesperado, consulte al desarrollador.'
    }
  }
}
</script>
<template>
    <!-- login form row -->
    <form
      class="row pt-2 justify-content-sm-end align-items-center g-1"
      @submit.prevent="handleLogin">
      <!-- username control -->
      <div class="col-sm-3 col-md-2 mx-auto mx-sm-0">
        <input
          type="text"
          v-model="user.username"
          id="username"
          class="form-control form-control-sm"
          placeholder="Usuario" />
      </div>
      <!-- password control -->
      <div class="col-sm-3 col-md-2 mx-auto mx-sm-0">
        <input
          type="password"
          v-model="user.password"
          id="password"
          class="form-control form-control-sm"
          placeholder="Clave" />
      </div>
      <!-- submit button -->
      <div class="col-sm-2 col-md-1 d-grid mx-auto mx-sm-0">
        <button v-if="!authStore.isLoadingAuth"
          type="submit"
          class="btn btn-sm btn-primary">Entrar</button>
        <button v-else
          type="submit"
          class="btn btn-sm btn-success"
          disabled>
          <span class="spinner-border spinner-border-sm" aria-hidden="true"></span>
          <span role="status"> Espere...</span>
        </button>
      </div>
    </form>
    <div class="row">
      <!-- messages -->
      <div class="col text-center text-sm-end" v-if="authError">
        <span class="form-text text-danger">{{ authError }}</span>
      </div>
    </div>

    <div class="row">
      <div class="col-sm-6 col-md-6 d-none d-sm-flex justify-content-sm-center justify-content-md-center">
        <h4 class="text-primary text-center fw-bolder">REFRIALL</h4>
        <img src="../../assets/gear_only.png" class="img-fluid" alt="REFRIALL Logo" />
      </div>
    </div>
</template>
