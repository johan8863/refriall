<template>
    <div class="row">
        <div class="col-md-8">
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
        <div class="col-md-2">
            <input
                class="form-control"
                v-model.number="item.times"
                type="number"
                min="1"
                step="1" />
        </div>
        <div class="col-md-2">
            <button
              class="btn btn-sm btn-primary"
              @click="$emit('onDeleteItem')">-</button>
        </div>
    </div>
</template>

<script setup>

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