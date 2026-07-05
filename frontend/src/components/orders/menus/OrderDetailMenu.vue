<script setup>
defineProps({
  order: {
    type: Object,
    required: true
  },
  isLoading: {
    type: Boolean,
    required: true
  }
})
defineEmits(['onPDF'])
</script>
<template>
  <ul class="list-group list-group-flush">
    <li class="list-group-item">
      <strong>Órdenes</strong>
    </li>
    <!-- orders -->
    <li class="list-group-item">
      <router-link :to="{ name: 'orders' }">Órdenes</router-link>
    </li>
    <!-- new order -->
    <li class="list-group-item">
      <router-link :to="{ name: 'orders_create' }">Nueva</router-link>
    </li>
    <!-- update order -->
    <li v-if="isLoading" class="list-group-item text-muted">
      <span class="spinner-border spinner-border-sm"></span>
      Cargando...
    </li>

    <li v-else class="list-group-item">
      <router-link :to="{ name: 'orders_update', params: { id: order.id } }">Editar</router-link>
    </li>
    <!-- generate pdf -->
    <li class="list-group-item">
      <a href="#" @click="$emit('onPDF')">PDF</a>
    </li>
    <!-- delete order -->
    <li v-if="isLoading" class="list-group-item text-muted">
      <span class="spinner-border spinner-border-sm"></span>
      Cargando...
    </li>

    <li v-else class="list-group-item">
      <router-link :to="{ name: 'orders_confirm_delete', params: { id: order.id } }"
        >Eliminar</router-link
      >
    </li>
  </ul>
</template>
