<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import type { Item } from '@/views/items/types'
import type { ItemTime } from '@/views/orders/types'

interface Props {
  items: Item[]
  item: ItemTime
}

const props = defineProps<Props>()

const emit = defineEmits<{
  (e: 'onDeleteItem'): void
}>()

const selectedItem = ref<Item | undefined>()

onMounted(() => {
  selectedItem.value = props.items.find((item) => props.item.item === item.id)
})

watch(
  () => props.item,
  () => {
    selectedItem.value = props.items.find((item) => props.item.item === item.id)
  },
  { deep: true }
)
</script>

<template>
  <div class="row mb-1">
    <div class="col-md-6">
      <select class="form-select" v-model="item.item">
        <option v-for="i in items" :key="i.id" :value="i.id">{{ i.name }}</option>
      </select>
    </div>

    <div class="col-md-1">
      <div v-if="selectedItem">
        {{ selectedItem.get_measurement || 'N/A' }}
      </div>
    </div>

    <div class="col-md-1">
      <div v-if="selectedItem">
        {{ selectedItem.price.toFixed(2) }}
      </div>
    </div>

    <div class="col-md-1">
      <input class="form-control" v-model.number="item.times" type="number" min="0.01" step="any" />
    </div>

    <div class="col-md-1">
      <button type="button" class="btn btn-sm btn-primary" @click="$emit('onDeleteItem')">-</button>
    </div>

    <div class="col-md-2"></div>
  </div>
</template>
