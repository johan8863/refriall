<script setup>
defineProps({
  item: {
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
      <strong>Artículos</strong>
    </li>
    <li class="list-group-item">
      <RouterLink :to="{ name: 'items' }">Artículos</RouterLink>
    </li>
    <!-- new item -->
    <li class="list-group-item">
      <RouterLink :to="{ name: 'items_create' }">Nuevo</RouterLink>
    </li>
    <!-- update item -->
    <li v-if="isLoading" class="list-group-item text-muted">
      <span class="spinner-border spinner-border-sm"></span>
      Cargando...
    </li>
    <li v-else class="list-group-item">
      <RouterLink :to="{ name: 'items_update', params: { id: item.id } }">Editar</RouterLink>
    </li>
    <!-- delete item -->
    <li v-if="isLoading" class="list-group-item text-muted">
      <span class="spinner-border spinner-border-sm"></span>
      Cargando...
    </li>
    <li v-else class="list-group-item">
      <a href="#" @click.prevent="$emit('onDelete')" class="text-danger">Eliminar</a>
    </li>
  </ul>
</template>
