<script setup>
defineProps({
  customers: Array,
  required: true
})
</script>
<template>
  <div class="table-responsive">
    <table class="table table-striped table-hover mb-1">
      <thead class="table-dark">
        <tr>
          <th scope="col">Nombre del Cliente</th>
          <th scope="col">Tipo</th>
          <th scope="col">Provincia</th>
          <th scope="col">Municipio</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="customer in customers" :key="customer.id">
          <td>
            <RouterLink :to="{ name: 'customers_detail', params: { id: customer.id } }">
              {{ customer.name }}
            </RouterLink>
          </td>
          <td>{{ customer.customer_type === 'es' ? 'ESTATAL' : 'PARTICULAR' }}</td>
          <td>{{ customer.province }}</td>
          <td>{{ customer.township }}</td>
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
