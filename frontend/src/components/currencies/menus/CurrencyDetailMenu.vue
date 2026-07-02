<script setup>
defineProps({
  currency: {
    type: Object,
    required: true
  }
})
</script>
<template>
  <ul class="list-group list-group-flush">
    <li class="list-group-item">
      <strong>Monedas</strong>
    </li>
    <li class="list-group-item">
      <router-link :to="{ name: 'currencies' }">Monedas</router-link>
    </li>
    <li class="list-group-item">
      <router-link :to="{ name: 'currency_update', params: { id: currency.id } }"
        >Actualizar</router-link
      >
    </li>
    <li class="list-group-item">
      <router-link :to="{ name: 'currency_delete', params: { id: currency.id } }"
        >Eliminar</router-link
      >
    </li>
  </ul>
</template>
