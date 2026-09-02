<script setup lang="ts">
import { RouterLink } from 'vue-router'
import type { Currency } from '../../../views/currencies/types'

interface Props {
  currency: Currency
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
      <strong>Monedas</strong>
    </li>
    <li class="list-group-item">
      <RouterLink :to="{ name: 'currencies' }">Monedas</RouterLink>
    </li>
    <li v-if="isLoading" class="list-group-item text-muted">
      <span class="spinner-border spinner-border-sm"></span>
      Cargando...
    </li>
    <li v-else class="list-group-item">
      <RouterLink :to="{ name: 'currency_update', params: { id: currency.id } }">
        Editar
      </RouterLink>
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
