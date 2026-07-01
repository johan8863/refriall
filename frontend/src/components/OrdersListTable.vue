<script setup>
defineProps({
  orders: {
    type: Array,
    required: true
  }
})
</script>
<template>
  <div class="table-responsive">
    <table class="table table-striped table-hover mb-1">
      <thead class="table-dark">
        <tr>
          <th scope="col">Orden</th>
          <th scope="col">Cliente/Dependencia</th>
          <th scope="col">Importe</th>
          <th scope="col">Prefactura</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="order in orders" :key="order.id">
          <td>
            <RouterLink :to="{ name: 'orders_detail', params: { id: order.id } }">
              {{ order.folio }}
            </RouterLink>
          </td>
          <td>
            {{ order.customer ? order.customer.name : order.customer_dependency.name }}
          </td>
          <td>
            {{ order.get_total_amount.toFixed(2) }}
          </td>
          <td>
            <RouterLink
              :to="{ name: 'orders_detail_pre_order', params: { id: order.id } }"
              class="btn btn-sm btn-outline-primary py-0 px-2"
              title="Ver prefactura detallada"
            >
              📄 Ver
            </RouterLink>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
<style scoped>
.table {
  font-size: 0.9rem;
  margin-bottom: 0.5rem;
}
.table th {
  font-weight: 600;
  text-align: center;
  padding: 0.5rem;
}
.table td {
  text-align: center;
  padding: 0.5rem;
}
</style>
