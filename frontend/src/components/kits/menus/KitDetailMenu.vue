<script setup>
defineProps({
  kit: {
    type: Object,
    required: true
  }
})
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
    <li class="list-group-item">
      <router-link :to="{ name: 'kits_update', params: { id: kit.id } }">Editar</router-link>
    </li>
    <li class="list-group-item">
      <router-link :to="{ name: 'kits_confirm_delete', params: { id: kit.id } }"
        >Eliminar</router-link
      >
    </li>
  </ul>
</template>
