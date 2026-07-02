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
      <RouterLink :to="{ name: 'customers' }">Clientes</RouterLink>
    </li>
    <li class="list-group-item">
      <RouterLink :to="{ name: 'customers_create' }">Nuevo</RouterLink>
    </li>
    <li class="list-group-item">
      <RouterLink :to="{ name: 'customers_update', params: { id: customer.id } }"
        >Editar</RouterLink
      >
    </li>
    <li class="list-group-item">
      <RouterLink :to="{ name: 'customer_dependecy_create', params: { id: customer.id } }"
        >Nueva dependencia</RouterLink
      >
    </li>
    <li class="list-group-item">
      <RouterLink :to="{ name: 'customers_confirm_delete', params: { id: customer.id } }"
        >Eliminar</RouterLink
      >
    </li>
  </ul>
</template>
