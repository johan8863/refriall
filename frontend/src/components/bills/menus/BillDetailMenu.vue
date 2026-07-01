<script setup>
defineProps({
  bill: {
    type: Object,
    required: true
  }
})
defineEmits(['onPDF'])
</script>
<template>
  <ul class="list-group list-group-flush">
    <li class="list-group-item">
      <strong>Facturas</strong>
    </li>
    <li class="list-group-item">
      <router-link :to="{ name: 'bills' }">Facturas</router-link>
    </li>
    <li class="list-group-item">
      <router-link :to="{ name: 'bills_create' }">Nueva</router-link>
    </li>
    <li class="list-group-item">
      <router-link :to="{ name: 'bills_update', params: { id: bill.id } }">Editar</router-link>
    </li>
    <li class="list-group-item">
      <a href="#" @click="$emit('onPDF')">PDF</a>
    </li>
    <li class="list-group-item">
      <router-link :to="{ name: 'bills_delete', params: { id: bill.id } }">Eliminar</router-link>
    </li>
  </ul>
</template>
