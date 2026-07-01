<template>
  <ul class="list-group list-group-flush">
    <li class="list-group-item">
      <strong>Órdenes</strong>
    </li>
    <li class="list-group-item">
      <RouterLink :to="{ name: 'orders_create' }">Nueva</RouterLink>
    </li>
  </ul>
</template>
