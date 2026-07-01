<script setup>
defineProps({
  order: {
    type: Object,
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
    <li class="list-group-item">
      <router-link :to="{ name: 'orders' }">Órdenes</router-link>
    </li>
    <li class="list-group-item">
      <router-link :to="{ name: 'orders_create' }">Nueva</router-link>
    </li>
    <li class="list-group-item">
      <router-link :to="{ name: 'orders_update', params: { id: order.id } }">Editar</router-link>
    </li>
    <li class="list-group-item">
      <a href="#" @click="$emit('onPDF')">PDF</a>
    </li>
    <li class="list-group-item">
      <router-link :to="{ name: 'orders_confirm_delete', params: { id: order.id } }"
        >Eliminar</router-link
      >
    </li>
  </ul>
</template>
