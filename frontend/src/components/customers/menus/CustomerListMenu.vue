<template>
  <ul class="list-group list-group-flush">
    <li class="list-group-item">
      <strong>Clientes</strong>
    </li>
    <li class="list-group-item">
      <RouterLink :to="{ name: 'customers_create' }">Nuevo</RouterLink>
    </li>
  </ul>
</template>
