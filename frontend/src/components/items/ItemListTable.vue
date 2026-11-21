<script setup lang="ts">
import type { Item } from '@/views/items/types'
defineProps({
  items: {
    type: Array<Item>,
    required: true
  }
})
</script>
<template>
  <table class="table table-striped table-hover" data-cy="item-list-table">
    <thead class="table-dark">
      <tr>
        <th scope="col">Código</th>
        <th scope="col">Nombre</th>
        <th scope="col">Tipo</th>
        <th scope="col">U/M</th>
        <th scope="col">Precio</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="item in items" :key="item.id" :data-cy="`item-row-${item.id}`">
        <td>
          <RouterLink
            :to="{ name: 'items_detail', params: { id: item.id } }"
            :data-cy="`item-code-${item.id}`"
          >
            {{ item.code }}
          </RouterLink>
        </td>
        <td :data-cy="`item-name-${item.id}`">{{ item.name }}</td>
        <td :data-cy="`item-type-${item.id}`">{{ item.get_item_type }}</td>
        <td :data-cy="`item-measurement-${item.id}`">{{ item.get_measurement }}</td>
        <td :data-cy="`item-price-${item.id}`">$ {{ item.price.toFixed(2) }}</td>
      </tr>
    </tbody>
  </table>
</template>
