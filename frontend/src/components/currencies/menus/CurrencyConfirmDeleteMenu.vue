<script setup>
defineProps({
  currency: {
    type: Object,
    required: true
  }
})
defineEmits(['onGoToCurrencies'])
</script>
<template>
  <ul class="list-group list-group-flush">
    <li class="list-group-item">
      <strong>Monedas</strong>
    </li>
    <li class="list-group-item">
      <a href="#" @click.prevent="$emit('onGoToCurrencies')">Monedas</a>
    </li>
  </ul>
</template>
