<script setup lang="ts">
import { RouterLink } from 'vue-router'
import type { CustomerDependency } from '@/views/customerDependencies/types'

interface Props {
  dependency: CustomerDependency
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
      <strong>Dependencias</strong>
    </li>
    <li class="list-group-item">
      <router-link v-if="dependency.customer" :to="{ name: 'customers' }">Clientes</router-link>
    </li>
    <li v-if="isLoading" class="list-group-item text-muted">
      <span class="spinner-border spinner-border-sm"></span>
      Cargando...
    </li>
    <li v-else-if="dependency.customer" class="list-group-item">
      <router-link
        :to="{
          name: 'customers_detail',
          params: {
            id:
              typeof dependency.customer === 'object' ? dependency.customer.id : dependency.customer
          }
        }"
      >
        Cliente
      </router-link>
    </li>
    <li v-else class="list-group-item text-muted">No disponible</li>
    <li v-if="isLoading" class="list-group-item text-muted">
      <span class="spinner-border spinner-border-sm"></span>
      Cargando...
    </li>
    <li v-else-if="dependency.id" class="list-group-item">
      <router-link :to="{ name: 'customer_dependecy_update', params: { id: dependency.id } }"
        >Editar</router-link
      >
    </li>
    <li v-else class="list-group-item text-muted">No disponible</li>
    <li v-if="isLoading" class="list-group-item text-muted">
      <span class="spinner-border spinner-border-sm"></span>
      Cargando...
    </li>
    <li v-else-if="dependency.id" class="list-group-item">
      <a href="#" @click.prevent="$emit('onDelete')" class="text-danger">Eliminar</a>
    </li>
    <li v-else class="list-group-item text-muted">No disponible</li>
  </ul>
</template>
