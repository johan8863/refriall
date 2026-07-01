<script setup>
defineProps({
  item: {
    type: Object,
    required: true
  }
})
</script>
<template>
  <ul class="list-group list-group-flush">
    <li class="list-group-item">
      <strong>Artículos</strong>
    </li>
    <li class="list-group-item">
      <RouterLink :to="{ name: 'items' }">Artículos</RouterLink>
    </li>
    <li class="list-group-item">
      <RouterLink :to="{ name: 'items_create' }">Nuevo</RouterLink>
    </li>
    <li class="list-group-item">
      <RouterLink :to="{ name: 'items_update', params: { id: item.id } }">Editar</RouterLink>
    </li>
    <li class="list-group-item">
      <RouterLink :to="{ name: 'items_confirm_delete', params: { id: item.id } }"
        >Eliminar</RouterLink
      >
    </li>
  </ul>
</template>
