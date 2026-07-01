<script setup>
defineProps({
  kits: {
    type: Array,
    required: true
  }
})
</script>
<template>
  <table class="table table-striped table-hover">
    <thead class="table-dark">
      <tr>
        <th scope="col">Nombre del Equipo</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="kit in kits" :key="kit.id">
        <td>
          <RouterLink :to="{ name: 'kits_detail', params: { id: kit.id } }">
            {{ kit.name }}
          </RouterLink>
        </td>
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
  text-align: center;
}
.table td {
  text-align: center;
}
</style>
