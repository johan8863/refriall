<script setup>
defineProps({
  dependency: {
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
      <router-link :to="{ name: 'customer_dependecy_update', params: { id: dependency.id } }"
        >Editar</router-link
      >
    </li>
  </ul>
</template>
