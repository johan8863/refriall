<template>
  <ul class="list-group list-group-flush">
    <li class="list-group-item">
      <strong>Artículos</strong>
    </li>
    <li class="list-group-item">
      <RouterLink :to="{ name: 'items_create' }">Nuevo</RouterLink>
    </li>
  </ul>
</template>
