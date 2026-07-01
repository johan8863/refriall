<script setup>
defineEmits(['onLoadData'])
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
      <a href="#" @click="$emit('onLoadData')">Recargar Datos</a>
    </li>
  </ul>
</template>
