<template>
  <ul class="list-group list-group-flush">
    <li class="list-group-item">
      <strong>Monedas</strong>
    </li>
    <li class="list-group-item">
      <router-link :to="{ name: 'currency_create' }">Nueva</router-link>
    </li>
  </ul>
</template>
