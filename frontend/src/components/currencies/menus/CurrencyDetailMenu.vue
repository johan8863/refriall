<script setup>
defineProps({
  currency: {
    type: Object,
    required: true
  },
  isLoading: {
    type: Boolean,
    required: true
  }
})
defineEmits(['onGoToCurrencies', 'onGoToUpdateCurrency', 'onGoToDelete'])
</script>
<template>
  <ul class="list-group list-group-flush">
    <li class="list-group-item">
      <strong>Monedas</strong>
    </li>
    <!-- currencies -->
    <li class="list-group-item">
      <a href="#" @click.prevent="$emit('onGoToCurrencies')">Monedas</a>
    </li>
    <!-- update currency -->
    <li v-if="isLoading" class="list-group-item text-muted">
      <span class="spinner-border spinner-border-sm"></span>
      Cargando...
    </li>
    <li v-else class="list-group-item">
      <a href="#" @click.prevent="$emit('onGoToUpdateCurrency')">Actualizar</a>
    </li>
    <!-- delete currency -->
    <li v-if="isLoading" class="list-group-item text-muted">
      <span class="spinner-border spinner-border-sm"></span>
      Cargando...
    </li>
    <li class="list-group-item">
      <a href="#" @click.prevent="$emit('onGoToDelete')">Eliminar</a>
    </li>
  </ul>
</template>
