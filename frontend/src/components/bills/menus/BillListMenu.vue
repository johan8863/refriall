<template>
  <ul class="list-group list-group-flush">
    <li class="list-group-item">
      <strong>Facturas</strong>
    </li>
    <li class="list-group-item">
      <RouterLink :to="{ name: 'bills_create' }">Nueva</RouterLink>
    </li>
  </ul>
</template>
