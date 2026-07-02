<script setup>
defineProps({
  customer: {
    type: Object,
    required: true
  }
})
</script>
<template>
  <ul class="list-group list-group-flush">
    <li class="list-group-item">
      <strong>Clientes</strong>
    </li>
    <li class="list-group-item">
      <router-link :to="{ name: 'customers' }">Clientes</router-link>
    </li>
    <li class="list-group-item">
      <router-link :to="{ name: 'customers_update', params: { id: customer.id } }"
        >Editar</router-link
      >
    </li>
  </ul>
</template>
