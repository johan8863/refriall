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
      <RouterLink :to="{ name: 'currencies' }">Monedas</RouterLink>
    </li>
  </ul>
</template>
