<script setup>
import { useRoute } from 'vue-router'
import NavBar from './components/NavBar.vue';
import { computed, onMounted } from 'vue';
import { useAuthStore } from './stores/authStore';

const authStore = useAuthStore()

const route = useRoute();

// computed to show/hide navbar based on meta properties
const showNavBar = computed(() => !route.meta.hideNavBar)

onMounted(() => authStore.initAuth())
</script>

<template>
  <NavBar v-if="showNavBar" />
  <RouterView />
</template>
