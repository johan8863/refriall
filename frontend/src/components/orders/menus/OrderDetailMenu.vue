<script setup lang="ts">
import { RouterLink } from 'vue-router'
import type { Order } from '@/views/orders/types'

interface Props {
  order: Order
  isLoading: boolean
}

defineProps<Props>()

const emit = defineEmits<{
  (e: 'onPDF'): void
  (e: 'onDelete'): void
}>()
</script>

<template>
  <ul class="list-group list-group-flush">
    <li class="list-group-item">
      <strong>Órdenes</strong>
    </li>
    <li class="list-group-item">
      <RouterLink :to="{ name: 'orders' }">Órdenes</RouterLink>
    </li>
    <li class="list-group-item">
      <RouterLink :to="{ name: 'orders_create' }">Nueva</RouterLink>
    </li>
    <li v-if="isLoading" class="list-group-item text-muted">
      <span class="spinner-border spinner-border-sm"></span>
      Cargando...
    </li>
    <li v-else class="list-group-item">
      <RouterLink :to="{ name: 'orders_update', params: { id: order.id } }">Editar</RouterLink>
    </li>
    <li class="list-group-item">
      <a href="#" @click.prevent="$emit('onPDF')">PDF</a>
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
