<script setup>
defineProps({
  dependency: {
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
      <strong>Clientes</strong>
    </li>
    <!-- customers -->
    <li class="list-group-item">
      <router-link :to="{ name: 'customers' }">Clientes</router-link>
    </li>
    <!-- dependency customer -->
    <li v-if="isLoading" class="list-group-item text-muted">
      <span class="spinner-border spinner-border-sm"></span>
      Cargando...
    </li>
    <li v-else-if="dependency.customer" class="list-group-item">
      <router-link :to="{ name: 'customers_detail', params: { id: dependency.customer } }"
        >Cliente</router-link
      >
    </li>
    <li v-else class="list-group-item text-muted">No disponible</li>
  </ul>
</template>
