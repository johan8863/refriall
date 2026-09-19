<script setup lang="ts">
import { RouterLink } from 'vue-router'
import type { OrderList } from '@/views/orders/types'

defineProps<{
  orders: OrderList[]
}>()
</script>

<template>
  <table class="table table-striped table-hover">
    <thead class="table-dark">
      <tr>
        <th>Folio</th>
        <th>Cliente</th>
        <th>Dependencia</th>
        <th class="text-end">Importe Total</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="order in orders" :key="order.id">
        <td>
          <RouterLink :to="{ name: 'orders_detail', params: { id: order.id } }">
            {{ order.folio }}
          </RouterLink>
        </td>
        <td>{{ order.customer?.name || '-' }}</td>
        <td>{{ order.customer_dependency?.name || '-' }}</td>
        <td class="text-end">{{ (order.get_total_amount || 0).toFixed(2) }}</td>
      </tr>
    </tbody>
  </table>
</template>

<style scoped>
.table {
  font-size: 0.9rem;
}
.table th {
  font-weight: 600;
}
</style>
