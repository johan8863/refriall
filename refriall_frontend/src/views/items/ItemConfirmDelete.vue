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
            </ul>
        </div>

        <!-- main content -->
        <div class="col-md-6">
            <p>Está seguro que desea eliminar el artículo: {{ item.name }}?</p>
            <button
              class="btn btn-sm btn-danger"
              @click="delItem(item.id)">Eliminar</button>
            <RouterLink :to="{name: 'items'}" class="btn btn-sm btn-secondary">Cancelar</RouterLink>
        </div>

    </div> <!-- end row -->
</template>

<script setup>

import { ref, onMounted } from "vue";
import { RouterLink, useRoute, useRouter } from "vue-router";
import { deleteItem, detailItem } from "../../services/item.service";


const route = useRoute();
const router = useRouter()
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

// delete the item object
const delItem = async (id) => {
    try {
        await deleteItem(id);
        router.push({name: 'items'});
    } catch (error) {
        // in case of backend errors, log to the console... for now
        console.log(error.response.data);     
    }
};

</script>

<style lang="scss" scoped>

</style>