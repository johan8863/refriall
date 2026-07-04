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
      <router-link
        v-if="dependency.customer"
        :to="{ name: 'customers_detail', params: { id: dependency.customer } }"
        >Cliente</router-link
      >
    </li>
  </ul>
</template>
