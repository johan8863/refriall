<script setup>
// vue
import { ref, onMounted, watch } from "vue";

const props = defineProps({
    items: {
        type: Array,
        required: true
    },
    item: {
        type: Object,
        required: true
    }
})

const selectedItem = ref(null)

defineEmits(['onDeleteItem'])


onMounted(async () => {
    selectedItem.value = props.items.filter(item => props.item.item === item.id)[0]
})

// Watching the reaction of "item" selectedItem property
// will be assigned the matching item in the items list.
watch(props.item, () => selectedItem.value = props.items.filter(item => props.item.item === item.id)[0])

</script>

<template>
    <div class="row mb-1">
        <!-- items select control -->
        <div class="col-md-6">
            <select
                id=""
                class="form-select"
                v-model="item.item">
                <option
                    v-for="i in items"
                    :key="i.id"
                    :value="i.id">{{ i.name }}</option>
            </select>
        </div>

        <!-- measurement display -->
        <div class="col-md-1">
            <div v-if="selectedItem">
                <div v-if="selectedItem.measurement === 'u'">Uno</div>
                <div v-if="selectedItem.measurement === 'm'">Mts</div>
                <div v-if="selectedItem.measurement === 'kg'">Kg</div>
                <div v-if="selectedItem.measurement === 'lts'">Lts</div>
            </div>
        </div>

        <!-- price display -->
        <div class="col-md-1">
            <div v-if="selectedItem">
                {{ selectedItem.price.toFixed(2) }}
            </div>
        </div>

        <!-- times control -->
        <div class="col-md-1">
            <input
                class="form-control"
                v-model.number="item.times"
                type="number"
                min="0.01"
                step="any" />
        </div>

        <!-- delete button -->
        <div class="col-md-1">
            <button
              type="button"
              class="btn btn-sm btn-primary"
              @click="$emit('onDeleteItem')">-</button>
        </div>

        <!-- placeholder space -->
        <div class="col-md-2"></div>
    </div>
</template>

