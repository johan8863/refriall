<template>
    <div class="row">
        <!-- side menu -->
        <div class="col-md-2">
            <ul class="list-group list-group-flush">
                <li class="list-group-item">
                    <strong>Artículos</strong>
                </li>
                <li class="list-group-item">
                    <RouterLink :to="{name: 'items'}">Artículos</RouterLink>
                </li>
                <li class="list-group-item">
                    <RouterLink :to="{name: 'items_create'}">Nuevo</RouterLink >
                </li>
                <li class="list-group-item">
                    <RouterLink :to="{name: 'items_update', params: {id: item.id}}">Editar</RouterLink>
                </li>
                <li class="list-group-item">
                    <RouterLink :to="{name: 'items_confirm_delete', params: {id: item.id}}">Eliminar</RouterLink>
                </li>
            </ul>
        </div>

        <!-- main content -->
        <div class="col-md-6">
            <h3>Artículo: <small>{{ item.name }}</small></h3>
            <hr>
            <p>Código: {{ item.code }}</p>
            <p>Código: {{ item.get_item_type }}</p>
            <p>Código: {{ item.get_measurement }}</p>
            <p>Precio: {{ item.price.toFixed(2) }}</p>
        </div>

    </div> <!-- end row -->
</template>

<script setup>

import { ref, onMounted } from "vue";
import { RouterLink, useRoute } from "vue-router";
import { detailItem } from "../../services/item.service";


const route = useRoute();
const item = ref({
    code: '',
    name: '',
    get_item_type: '',
    get_measurement: '',
    price: 0,
});

onMounted(async () => {
    const resp = await detailItem(route.params.id);
    item.value = resp.data;
});

</script>

<style lang="scss" scoped>

</style>