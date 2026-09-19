<script setup lang="ts">
import type { Customer, CustomerDependency } from '@/views/customers/types'

interface Props {
  type: 'customer' | 'dependency'
  customers?: Customer[]
  dependencies?: CustomerDependency[]
  modelValue: number | string | null // ✅ Aceptar null
  disabled: boolean
  vuelidateErrors: any[]
  getFieldErrors: (field: string) => string[]
}

const props = defineProps<Props>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: number | string | null): void
  (e: 'blur'): void
  (e: 'clear'): void
}>()

const label = props.type === 'customer' ? 'Cliente' : 'Dependencia'
const options = props.type === 'customer' ? props.customers : props.dependencies
const errorKey = props.type === 'customer' ? 'customer' : 'customer_dependency'
</script>

<template>
  <div class="row g-1">
    <label :for="errorKey" class="form-label">{{ label }}</label>
    <div class="col-md-11">
      <select
        :id="errorKey"
        class="form-select form-select-sm"
        :value="modelValue ?? ''"
        :disabled="disabled"
        @change="$emit('update:modelValue', ($event.target as HTMLSelectElement).value)"
        @blur="$emit('blur')"
      >
        <option value="">-- Seleccione --</option>
        <option v-for="option in options" :key="option.id" :value="option.id">
          {{ option.name }}
        </option>
      </select>

      <!-- Frontend errors -->
      <p class="form-text text-danger" v-for="error in vuelidateErrors" :key="error.$uid">
        {{ error.$message }}
      </p>

      <!-- Backend errors -->
      <p
        v-for="(error, i) in getFieldErrors(errorKey)"
        :key="`backend-${i}`"
        class="form-text text-danger"
      >
        {{ error }}
      </p>
    </div>
    <div class="col-md-1">
      <button type="button" class="btn btn-sm btn-danger" @click="$emit('clear')">X</button>
    </div>
  </div>
</template>
