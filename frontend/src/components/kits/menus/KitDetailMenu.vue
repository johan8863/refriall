<script setup>
defineProps({
  kit: {
    type: Object,
    required: true
  },
  isLoading: {
    type: Boolean,
    required: true
  }
})

defineEmits(['onDelete'])
</script>

<template>
  <ul class="list-group list-group-flush">
    <li class="list-group-item">
      <strong>Equipos</strong>
    </li>
    <li class="list-group-item">
      <router-link :to="{ name: 'kits' }">Equipos</router-link>
    </li>
    <li class="list-group-item">
      <router-link :to="{ name: 'kits_create' }">Nuevo</router-link>
    </li>
    <li v-if="isLoading" class="list-group-item text-muted">
      <span class="spinner-border spinner-border-sm"></span>
      Cargando...
    </li>
    <li v-else class="list-group-item">
      <router-link :to="{ name: 'kits_update', params: { id: kit.id } }">Editar</router-link>
    </li>
    <li v-if="isLoading" class="list-group-item text-muted">
      <span class="spinner-border spinner-border-sm"></span>
      Cargando...
    </li>
    <li v-else class="list-group-item">
      <a href="#" @click.prevent="$emit('onDelete')" class="text-danger">Eliminar</a>
    </li>
  </ul>
</template>
