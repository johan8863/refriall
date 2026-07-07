<template>
  <ul class="list-group list-group-flush">
    <li class="list-group-item">
      <strong>Prestadores</strong>
    </li>
    <li class="list-group-item">
      <router-link :to="{ name: 'providers_create' }">Nuevo</router-link>
    </li>
    <li class="list-group-item">
      <router-link :to="{ name: 'providers_change_self_password' }">Cambiar mi clave</router-link>
    </li>
  </ul>
</template>
