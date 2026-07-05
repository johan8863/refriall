<script setup>
import { RouterLink } from 'vue-router'

defineProps({
  currency: {
    type: Object,
    required: true
  },
  isLoading: {
    type: Boolean,
    required: true
  }
})
</script>
<template>
  <ul class="list-group list-group-flush">
    <li class="list-group-item">
      <strong>Monedas</strong>
    </li>
    <!-- currencies -->
    <li class="list-group-item">
      <RouterLink :to="{ name: 'currencies' }">Monedas</RouterLink>
    </li>
    <!-- update currency -->
    <li v-if="isLoading" class="list-group-item text-muted">
      <span class="spinner-border spinner-border-sm"></span>
      Cargando...
    </li>
    <li v-else class="list-group-item">
      <RouterLink :to="{ name: 'currency_update', params: { id: currency.id } }"
        >Actualizar</RouterLink
      >
    </li>
    <!-- delete currency -->
    <li v-if="isLoading" class="list-group-item text-muted">
      <span class="spinner-border spinner-border-sm"></span>
      Cargando...
    </li>
    <li class="list-group-item">
      <RouterLink :to="{ name: 'currency_delete', params: { id: currency.id } }"
        >Eliminar</RouterLink
      >
    </li>
  </ul>
</template>
