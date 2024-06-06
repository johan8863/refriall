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
                :value="i.id"
                @click="showItemSelectedProperties({measurement: i.measurement, price: i.price})">{{ i.name }}</option>
            </select>
        </div>

        <!-- measurement display -->
        <div class="col-md-1">
            <div v-if="itemToShowSelected">
                <div v-if="itemToShowSelected.measurement === 'u'">Uno</div>
                <div v-if="itemToShowSelected.measurement === 'm'">Mts</div>
                <div v-if="itemToShowSelected.measurement === 'kg'">Kg</div>
                <div v-if="itemToShowSelected.measurement === 'lts'">Lts</div>
            </div>
        </div>

        <!-- price display -->
        <div class="col-md-1">
            <div v-if="itemToShowSelected">
                {{ itemToShowSelected.price.toFixed(2) }}
            </div>
        </div>

        <!-- times control -->
        <div class="col-md-1">
            <input
                class="form-control"
                v-model.number="item.times"
                type="number"
                min="1"
                step="1" />
        </div>

        <!-- delete button -->
        <div class="col-md-1">
            <button
              class="btn btn-sm btn-primary"
              @click="$emit('onDeleteItem')">-</button>
        </div>

        <!-- placeholder space -->
        <div class="col-md-2"></div>
    </div>
</template>

<script setup>
import { ref } from 'vue';


const itemToShowSelected = ref(null)

const showItemSelectedProperties = ({measurement, price}) => {
    itemToShowSelected.value = {measurement, price}
}

defineProps({
    items: {
        type: Array,
        required: true
    },
    item: {
        type: Object,
        required: true
    }
})

defineEmits(['onDeleteItem'])

</script>

<style lang="scss" scoped>

</style>