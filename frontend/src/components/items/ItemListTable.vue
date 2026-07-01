<script setup>
defineProps({
  items: {
    type: Array,
    required: true
  }
})
</script>
<template>
  <table class="table table-striped table-hover">
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
      <tr v-for="item in items" :key="item.id">
        <td>
          <RouterLink :to="{ name: 'items_detail', params: { id: item.id } }">
            {{ item.code }}
          </RouterLink>
        </td>
        <td>{{ item.name }}</td>
        <td>{{ item.get_item_type }}</td>
        <td>{{ item.get_measurement }}</td>
        <td>$ {{ item.price.toFixed(2) }}</td>
      </tr>
    </tbody>
  </table>
</template>
