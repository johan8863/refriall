<script setup>
import { ref } from 'vue';
import { useAuthStore } from '../../stores/authStore';
import { useRoute, useRouter } from 'vue-router';

const authStore = useAuthStore()

const router = useRouter()
const route = useRoute()

const user = ref({
    username: '',
    password: ''
})

const authError = ref(null)

const handleLogin = async () => {
    
    try {
        authError.value = null;
        await authStore.login(user.value)
        const redirectRoute = route.query.redirect || { name: 'home' }
        router.push(redirectRoute)
    } catch (error) {
        if (error.response) {
            if (error.response.status === 400) {
                authError.value = 'Usuario o Clave incorrectos.'
            }
            else if (error.response.status === 500) {
                authError.value = 'Error en el servidor, consulte al desarrollador.'
            }
        } 
        else if (error.request) {
            authError.value = 'Servidor caído, consulte al desarrollador.'
        } 
        else {
            authError.value = 'Error inesperado, consulte al desarrollador'
            console.error({...error});
        }
    }
}

</script>
<template>
    <form @submit.prevent="handleLogin">
        <!-- username control -->
        <div>
            <label for="username">Usuario</label>
            <input type="text" v-model="user.username">
        </div>
        <!-- password control -->
        <div>
            <label for="password">Clave</label>
            <input type="password" v-model="user.password">
        </div>
        <!-- submit button -->
        <div>
            <button>{{ authStore.isLoadingAuth ? "Autenticando..." : "Entrar" }}</button>
        </div>
    </form>
    <!-- messages -->
    <div>
        <div v-if="authError">
            <span>{{ authError }}</span>
        </div>
    </div>
</template>