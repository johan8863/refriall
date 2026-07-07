<script setup>
defineProps({
  provider: {
    type: Object,
    required: true
  }
})
</script>
<template>
  <ul class="list-group list-group-flush">
    <li class="list-group-item">
      <strong>Prestadores</strong>
    </li>
    <li class="list-group-item">
      <router-link :to="{ name: 'providers' }">Prestadores</router-link>
    </li>
    <li class="list-group-item">
      <router-link
        v-if="provider.id"
        :to="{ name: 'providers_update', params: { id: provider.id } }"
        >Editar</router-link
      >
    </li>
    <li class="list-group-item">
      <router-link
        v-if="provider.id"
        :to="{ name: 'providers_change_password', params: { id: provider.id } }"
        >Cambiar clave</router-link
      >
    </li>
    <li class="list-group-item">
      <router-link
        v-if="provider.id"
        :to="{ name: 'providers_confirm_delete', params: { id: provider.id } }"
        >Eliminar</router-link
      >
    </li>
  </ul>
</template>
