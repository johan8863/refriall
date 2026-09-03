<script setup lang="ts">
import { RouterLink } from 'vue-router'
import type { Customer } from '../../../views/customers/types'

interface Props {
  customer: Customer
  isLoading: boolean
}

defineProps<Props>()

const emit = defineEmits<{
  (e: 'onDelete'): void
}>()
</script>

<template>
  <ul class="list-group list-group-flush">
    <li class="list-group-item">
      <strong>Clientes</strong>
    </li>
    <li class="list-group-item">
      <RouterLink :to="{ name: 'customers' }">Clientes</RouterLink>
    </li>
    <li class="list-group-item">
      <RouterLink :to="{ name: 'customers_create' }">Nuevo</RouterLink>
    </li>
    <li v-if="isLoading" class="list-group-item text-muted">
      <span class="spinner-border spinner-border-sm"></span>
      Cargando...
    </li>
    <li v-else class="list-group-item">
      <RouterLink :to="{ name: 'customers_update', params: { id: customer.id } }"
        >Editar</RouterLink
      >
    </li>
    <li v-if="isLoading" class="list-group-item text-muted">
      <span class="spinner-border spinner-border-sm"></span>
      Cargando...
    </li>
    <li v-else class="list-group-item">
      <RouterLink :to="{ name: 'customer_dependecy_create', params: { id: customer.id } }"
        >Nueva dependencia</RouterLink
      >
    </li>
    <li v-if="isLoading" class="list-group-item text-muted">
      <span class="spinner-border spinner-border-sm"></span>
      Cargando...
    </li>
    <li v-else class="list-group-item">
      <a href="#" @click.prevent="$emit('onDelete')" class="text-danger">Eliminar</a>
    </li>
  </ul>
</template>
