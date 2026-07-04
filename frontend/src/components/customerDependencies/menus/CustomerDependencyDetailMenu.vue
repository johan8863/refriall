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
      <strong>Dependencias</strong>
    </li>
    <li class="list-group-item">
      <router-link v-if="dependency.customer" :to="{ name: 'customers' }">Clientes</router-link>
    </li>
    <li class="list-group-item">
      <router-link
        v-if="dependency.id"
        :to="{ name: 'customers_detail', params: { id: dependency.customer } }"
        >Cliente</router-link
      >
    </li>
    <li class="list-group-item">
      <router-link :to="{ name: 'customer_dependecy_update', params: { id: dependency.id } }"
        >Editar</router-link
      >
    </li>
    <li class="list-group-item">
      <router-link
        v-if="dependency.id"
        :to="{ name: 'customer_dependecy_delete', params: { id: dependency.id } }"
        >Eliminar</router-link
      >
    </li>
  </ul>
</template>
