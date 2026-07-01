<script setup>
defineProps({
  bills: {
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
          <th scope="col">Folio</th>
          <th scope="col">Cliente</th>
          <th scope="col">Importe Total</th>
          <th scope="col">Fecha Firma</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="bill in bills" :key="bill.id">
          <td>
            <RouterLink :to="{ name: 'bills_detail', params: { id: bill.id } }">
              {{ bill.folio }}
            </RouterLink>
          </td>
          <td>{{ bill.customer.name }}</td>
          <td>{{ bill.get_total_amount.toFixed(2) }}</td>
          <td>{{ new Date(bill.provider_signature_date).toLocaleDateString() }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
