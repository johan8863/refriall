<script setup lang="ts">
import { RouterLink } from 'vue-router'
import type { BillDetail } from '@/views/bills/types'

interface Props {
  bill: BillDetail
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
      <strong>Facturas</strong>
    </li>
    <li class="list-group-item">
      <RouterLink :to="{ name: 'bills' }">Facturas</RouterLink>
    </li>
    <li class="list-group-item">
      <RouterLink :to="{ name: 'bills_create' }">Nueva</RouterLink>
    </li>
    <li v-if="isLoading" class="list-group-item text-muted">
      <span class="spinner-border spinner-border-sm"></span>
      Cargando...
    </li>
    <li v-else-if="bill.id" class="list-group-item">
      <RouterLink :to="{ name: 'bills_update', params: { id: bill.id } }">Editar</RouterLink>
    </li>
    <li v-else class="list-group-item text-muted">No disponible</li>
    <li v-if="isLoading" class="list-group-item text-muted">
      <span class="spinner-border spinner-border-sm"></span>
      Cargando...
    </li>
    <li v-else-if="bill.id" class="list-group-item">
      <a href="#" @click.prevent="$emit('onPDF')">PDF</a>
    </li>
    <li v-else class="list-group-item text-muted">No disponible</li>
    <li v-if="isLoading" class="list-group-item text-muted">
      <span class="spinner-border spinner-border-sm"></span>
      Cargando...
    </li>
    <li v-else-if="bill.id" class="list-group-item">
      <a href="#" @click.prevent="$emit('onDelete')" class="text-danger">Eliminar</a>
    </li>
    <li v-else class="list-group-item text-muted">No disponible</li>
  </ul>
</template>
