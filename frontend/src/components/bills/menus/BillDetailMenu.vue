<script setup>
defineProps({
  bill: {
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
      <strong>Facturas</strong>
    </li>
    <!-- bills -->
    <li class="list-group-item">
      <router-link :to="{ name: 'bills' }">Facturas</router-link>
    </li>
    <!-- create bill -->
    <li class="list-group-item">
      <router-link :to="{ name: 'bills_create' }">Nueva</router-link>
    </li>
    <!-- bill detail -->
    <li v-if="isLoading" class="list-group-item text-muted">
      <span class="spinner-border spinner-border-sm"></span>
      Cargando...
    </li>
    <li v-else-if="bill.id" class="list-group-item">
      <router-link v-if="bill.id" :to="{ name: 'bills_update', params: { id: bill.id } }"
        >Editar</router-link
      >
    </li>
    <li v-else class="list-group-item text-muted">No disponible</li>
    <!-- generate bill pdf -->
    <li v-if="isLoading" class="list-group-item text-muted">
      <span class="spinner-border spinner-border-sm"></span>
      Cargando...
    </li>
    <li v-else-if="bill.id" class="list-group-item">
      <a href="#" @click="$emit('onPDF')">PDF</a>
    </li>
    <li v-else class="list-group-item text-muted">No disponible</li>
    <!-- delete bill -->
    <li v-if="isLoading" class="list-group-item text-muted">
      <span class="spinner-border spinner-border-sm"></span>
      Cargando...
    </li>
    <li v-else-if="bill.id" class="list-group-item">
      <router-link v-if="bill.id" :to="{ name: 'bills_delete', params: { id: bill.id } }"
        >Eliminar</router-link
      >
    </li>
    <li v-else class="list-group-item text-muted">No disponible</li>
  </ul>
</template>
