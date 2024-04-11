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

            <p v-if="item.item_type === 'prod'">Tipo: Producto</p>
            <p v-if="item.item_type === 'concept'">Tipo: Concepto</p>
            <p v-if="item.item_type === 'repair'">Tipo: Reparación</p>
            <p v-if="item.item_type === 'maintenace'">Tipo: Mtto</p>
            <p v-if="item.item_type === 'install'">Tipo: Instal/Mont</p>
            <p v-if="item.item_type === 'unmounting'">Tipo: Desmontaje</p>

            <p v-if="item.measurement === 'u'">U/M: Uno</p>
            <p v-if="item.measurement === 'm'">U/M: Metros</p>
            <p v-if="item.measurement === 'kg'">U/M: Kilogramos</p>
            <p v-if="item.measurement === 'lts'">U/M: Litros</p>

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
    item_type: '',
    measurement: '',
    price: '',
});

onMounted(async () => {
    const resp = await detailItem(route.params.id);
    item.value = resp.data;
});

</script>

<style lang="scss" scoped>

</style>