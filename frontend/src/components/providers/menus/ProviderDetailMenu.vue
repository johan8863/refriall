<script setup>
defineProps({
  provider: {
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
      <strong>Prestadores</strong>
    </li>
    <li class="list-group-item">
      <router-link :to="{ name: 'providers' }">Prestadores</router-link>
    </li>
    <li v-if="isLoading" class="list-group-item text-muted">
      <span class="spinner-border spinner-border-sm"></span>
      Cargando...
    </li>
    <li v-else-if="provider.id" class="list-group-item">
      <router-link :to="{ name: 'providers_update', params: { id: provider.id } }"
        >Editar</router-link
      >
    </li>
    <li v-else class="list-group-item text-muted">No disponible</li>
    <li v-if="isLoading" class="list-group-item text-muted">
      <span class="spinner-border spinner-border-sm"></span>
      Cargando...
    </li>
    <li v-else-if="provider.id" class="list-group-item">
      <router-link :to="{ name: 'providers_change_password', params: { id: provider.id } }"
        >Cambiar clave</router-link
      >
    </li>
    <li v-else class="list-group-item text-muted">No disponible</li>
    <li v-if="isLoading" class="list-group-item text-muted">
      <span class="spinner-border spinner-border-sm"></span>
      Cargando...
    </li>
    <li v-else-if="provider.id" class="list-group-item">
      <a href="#" @click.prevent="$emit('onDelete')" class="text-danger">Eliminar</a>
    </li>
    <li v-else class="list-group-item text-muted">No disponible</li>
  </ul>
</template>
