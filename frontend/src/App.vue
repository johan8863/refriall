<script setup>
// vue
import { useRoute } from 'vue-router'
import { computed, onMounted } from 'vue'

// app
import NavBar from './components/NavBar.vue'
import { useAuthStore } from './stores/authStore'

const authStore = useAuthStore()

const route = useRoute()

// computed to show/hide navbar based on meta properties
const showNavBar = computed(() => !route.meta.hideNavBar)

onMounted(() => authStore.initAuth())
</script>

<template>
  <div class="container-fluid mb-4">
    <NavBar v-if="showNavBar" />
    <RouterView />
  </div>
</template>
