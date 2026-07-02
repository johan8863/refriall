<template>
  <ul class="list-group list-group-flush">
    <li class="list-group-item">
      <strong>Prestadores</strong>
    </li>
    <li class="list-group-item">
      <router-link :to="{ name: 'providers_create' }">Nuevo</router-link>
    </li>
  </ul>
</template>
