<script setup>

// vue
import { ref, onMounted } from "vue";
import { RouterLink, useRoute } from "vue-router";

// app
import { detailItem } from "../../services/item.service";
import listGroup from "../../assets/js/bootstrap_classes/listGroup";


const route = useRoute();
const item = ref({
    code: '',
    name: '',
    get_item_type: '',
    get_measurement: '',
    price: 0,
});

const itemBackendErrors = ref(null)

const notFound = ref(null);

onMounted(async () => {
    try {
        const resp = await detailItem(route.params.id);
        item.value = resp.data;
    } catch (error) {
        console.error('General error', error)
        if (error.response) {
            itemBackendErrors.value = `${error.response.data.detail} - ${error.response.status}`
        } else {
            itemBackendErrors.value = 'Error inesperado, consulte al desarrollador'
        }
    }
});

</script>

<template>
    <div class="row">
        <!-- side menu -->
        <div class="col-md-2">
            <ul :class="listGroup.listGroup">
                <li :class="listGroup.listGroupItem">
                    <strong>Artículos</strong>
                </li>
                <li :class="listGroup.listGroupItem">
                    <RouterLink :to="{name: 'items'}">Artículos</RouterLink>
                </li>
                <li :class="listGroup.listGroupItem">
                    <RouterLink :to="{name: 'items_create'}">Nuevo</RouterLink >
                </li>
                <li :class="listGroup.listGroupItem">
                    <RouterLink :to="{name: 'items_update', params: {id: item.id}}">Editar</RouterLink>
                </li>
                <li :class="listGroup.listGroupItem">
                    <RouterLink :to="{name: 'items_confirm_delete', params: {id: item.id}}">Eliminar</RouterLink>
                </li>
            </ul>
        </div>

        <!-- main content -->
        <div class="col-md-6">
            <!-- backend general errors -->
            <span v-if="itemBackendErrors">
                <p
                    class="form-text text-danger">
                    {{ itemBackendErrors }}</p>
            </span>

            <h3>Artículo: <small>{{ item.name }}</small></h3>
            <hr>
            <p>Código: {{ item.code }}</p>
            <p>Código: {{ item.get_item_type }}</p>
            <p>Código: {{ item.get_measurement }}</p>
            <p>Precio: {{ item.price.toFixed(2) }}</p>
        </div>

    </div> <!-- end row -->
</template>
