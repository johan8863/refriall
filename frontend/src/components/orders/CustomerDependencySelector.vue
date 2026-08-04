<script setup>
import { computed } from 'vue'

const props = defineProps({
  type: {
    type: String,
    required: true,
    validator: (value) => ['customer', 'dependency'].includes(value)
  },
  customers: {
    type: Array,
    default: () => []
  },
  dependencies: {
    type: Array,
    default: () => []
  },
  disabled: {
    type: Boolean,
    default: false
  },
  vuelidateErrors: {
    type: Array,
    default: () => []
  },
  getFieldErrors: {
    type: Function,
    required: true
  }
})

const model = defineModel({
  type: [String, Number],
  default: ''
})

const emit = defineEmits(['clear', 'blur'])

const isCustomer = computed(() => props.type === 'customer')
const label = computed(() => (isCustomer.value ? 'Cliente' : 'Dependencia'))
const options = computed(() => (isCustomer.value ? props.customers : props.dependencies))
</script>

<template>
  <fieldset :disabled="disabled">
    <div class="row g-1">
      <label :for="type" class="form-label">{{ label }}</label>
      <div class="input-group input-group-sm">
        <select :id="type" class="form-select" v-model="model" @blur="emit('blur')">
          <option v-for="option in options" :key="option.id" :value="option.id">
            {{ option.name }}
          </option>
        </select>
        <button
          type="button"
          class="btn btn-sm btn-danger"
          @click="emit('clear')"
          :disabled="!model"
        >
          ✕
        </button>
      </div>

      <!-- Vuelidate errors -->
      <p
        v-for="error in vuelidateErrors"
        :key="`vuelidate-${error.$uid}`"
        class="form-text text-danger"
      >
        {{ error.$message }}
      </p>

      <!-- Backend errors -->
      <p
        v-for="(error, i) in getFieldErrors(type)"
        :key="`backend-${i}`"
        class="form-text text-danger"
      >
        {{ error }}
      </p>
    </div>
  </fieldset>
</template>
