<!-- components/common/FormField.vue -->
<script setup>
import { computed } from 'vue'

const props = defineProps({
  label: String,
  modelValue: [String, Number],
  type: { type: String, default: 'text' },
  options: Array,
  validation: Object,
  backendErrors: Array,
  errorKey: String,
  disabled: Boolean,
  required: Boolean,
  placeholder: String,
  rows: { type: Number, default: 3 }
})

const emit = defineEmits(['update:modelValue', 'blur'])

const hasError = computed(() => {
  return props.validation?.$error || (props.backendErrors && props.backendErrors.length > 0)
})

const errorMessages = computed(() => {
  const frontend = props.validation?.$errors?.map((e) => e.$message) || []
  return [...frontend, ...(props.backendErrors || [])]
})

const inputClasses = computed(() => {
  return {
    'form-control': true,
    'form-control-sm': true,
    'is-invalid': hasError.value
  }
})
</script>

<template>
  <div class="mb-2">
    <label :for="errorKey" class="form-label">
      {{ label }}
      <span v-if="required" class="text-danger">*</span>
    </label>

    <!-- Select input -->
    <select
      v-if="type === 'select'"
      :id="errorKey"
      class="form-select form-select-sm"
      :class="{ 'is-invalid': hasError }"
      :value="modelValue"
      @input="$emit('update:modelValue', $event.target.value)"
      @blur="$emit('blur')"
      :disabled="disabled"
    >
      <option value="">-- Seleccione --</option>
      <option v-for="option in options" :key="option.value" :value="option.value">
        {{ option.label }}
      </option>
    </select>

    <!-- Textarea input -->
    <textarea
      v-else-if="type === 'textarea'"
      :id="errorKey"
      :class="inputClasses"
      :value="modelValue"
      @input="$emit('update:modelValue', $event.target.value)"
      @blur="$emit('blur')"
      :disabled="disabled"
      :placeholder="placeholder"
      :rows="rows"
    ></textarea>

    <!-- Checkbox input -->
    <input
      v-else-if="type === 'checkbox'"
      :id="errorKey"
      type="checkbox"
      class="form-check"
      :checked="modelValue"
      @change="$emit('update:modelValue', $event.target.checked)"
      @blur="$emit('blur')"
      :disabled="disabled"
    />

    <!-- Default text input -->
    <input
      v-else
      :id="errorKey"
      :type="type"
      :class="inputClasses"
      :value="modelValue"
      @input="$emit('update:modelValue', $event.target.value)"
      @blur="$emit('blur')"
      :disabled="disabled"
      :placeholder="placeholder"
    />

    <!-- Error messages -->
    <div v-if="hasError || errorMessages.length > 0">
      <p v-for="(error, index) in errorMessages" :key="index" class="form-text text-danger">
        {{ error }}
      </p>
    </div>
  </div>
</template>
