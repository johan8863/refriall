<script setup>
defineProps({
  customer: {
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
    <!-- update customer -->
    <li v-if="isLoading" class="list-group-item text-muted">
      <span class="spinner-border spinner-border-sm"> Cargando... </span>
    </li>
    <li v-else class="list-group-item">
      <router-link :to="{ name: 'customers_update', params: { id: customer.id } }"
        >Editar</router-link
      >
    </li>
  </ul>
</template>
