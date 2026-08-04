<script setup>
import { computed } from 'vue'

const props = defineProps({
  type: {
    type: String,
    required: true,
    validator: (value) => ['customer', 'dependency'].includes(value)
  },
  customers: Array,
  dependencies: Array,
  disabled: {
    type: Boolean,
    default: false
  },
  errors: {
    type: Array,
    default: () => []
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

const modelValue = defineModel({
  type: [String, Number],
  default: ''
})

const emit = defineEmits(['clear'])

const isCustomer = computed(() => props.type === 'customer')
const label = computed(() => (isCustomer.value ? 'Cliente' : 'Dependencia'))
const options = computed(() => (isCustomer.value ? props.customers : props.dependencies))

const clear = () => {
  emit('update:modelValue', '')
  emit('clear')
}
</script>

<template>
  <fieldset :disabled="disabled">
    <div class="row g-1">
      <label :for="type" class="form-label">{{ label }}</label>
      <div class="col-md-11">
        <select
          :id="type"
          class="form-select form-select-sm"
          :value="modelValue"
          @input="emit('update:modelValue', $event.target.value)"
          @blur="$emit('blur')"
        >
          <option v-for="option in options" :key="option.id" :value="option.id">
            {{ option.name }}
          </option>
        </select>

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
      <!-- Clear button -->
      <div class="col-md-1">
        <button type="button" class="btn btn-sm btn-danger" @click="clear" :disabled="!modelValue">
          ✕
        </button>
      </div>
    </div>
  </fieldset>
</template>
