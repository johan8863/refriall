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
      <RouterLink :to="{ name: 'customers' }">Clientes</RouterLink>
    </li>
    <!-- new customer -->
    <li class="list-group-item">
      <RouterLink :to="{ name: 'customers_create' }">Nuevo</RouterLink>
    </li>
    <!-- update customer -->
    <li v-if="isLoading" class="list-group-item text-muted">
      <span class="spinner-border spinner-border-sm"></span>
      Cargando...
    </li>

    <li v-else class="list-group-item">
      <RouterLink :to="{ name: 'customers_update', params: { id: customer.id } }"
        >Editar</RouterLink
      >
    </li>
    <!-- create customer dependency -->
    <li v-if="isLoading" class="list-group-item text-muted">
      <span class="spinner-border spinner-border-sm"></span>
      Cargando...
    </li>

    <li v-else class="list-group-item">
      <RouterLink :to="{ name: 'customer_dependecy_create', params: { id: customer.id } }"
        >Nueva dependencia</RouterLink
      >
    </li>
    <!-- delete customer -->
    <li v-if="isLoading" class="list-group-item text-muted">
      <span class="spinner-border spinner-border-sm"></span>
      Cargando...
    </li>

    <li v-else class="list-group-item">
      <RouterLink :to="{ name: 'customers_confirm_delete', params: { id: customer.id } }"
        >Eliminar</RouterLink
      >
    </li>
  </ul>
</template>
