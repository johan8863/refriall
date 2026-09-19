<script setup lang="ts">
import { RouterLink } from 'vue-router'

defineEmits<{
  (e: 'onLoadData'): void
}>()
</script>

<template>
  <ul class="list-group list-group-flush">
    <li class="list-group-item">
      <strong>Órdenes</strong>
    </li>
    <li class="list-group-item">
      <RouterLink :to="{ name: 'orders' }">Órdenes</RouterLink>
    </li>
    <li class="list-group-item">
      <a href="#" @click="$emit('onLoadData')">Recargar Datos</a>
    </li>
  </ul>
</template>
