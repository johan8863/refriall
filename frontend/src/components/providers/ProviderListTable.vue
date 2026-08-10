<script setup>
defineProps({
  providers: Array,
  required: true
})
</script>
<template>
  <div class="table-responsive">
    <table class="table table-striped table-hover mb-1">
      <thead class="table-dark">
        <tr>
          <th scope="col">Nombre</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="provider in providers" :key="provider.id">
          <td>
            <RouterLink :to="{ name: 'providers_detail', params: { id: provider.id } }">
              {{ provider.first_name }}
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
