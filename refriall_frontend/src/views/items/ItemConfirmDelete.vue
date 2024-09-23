<script setup>

import { ref, onMounted } from "vue";
import { RouterLink, useRoute, useRouter } from "vue-router";
import { deleteItem, detailItem } from "../../services/item.service";
import listGroup from "../../assets/js/bootstrap_classes/listGroup";


const route = useRoute();
const router = useRouter();
const item = ref({
    code: '',
    name: '',
    item_type: '',
    measurement: '',
    price: '',
});

const itemBackendErrors = ref({
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
        console.error('General error', error)
        if (error.response) {
            itemBackendErrors.value = error.response.data
        } else {
            itemBackendErrors.value = { message: 'Error inesperado, consulte al desarrollador' }
        }
    }
};

</script>

<style lang="scss" scoped>

</style>

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
            </ul>
        </div>

        <!-- main content -->
        <div class="col-md-6">
            <!-- backend errors from non_field_errors dictionary -->
            <span v-if="itemBackendErrors.non_field_errors">
                <p
                    class="form-text text-danger"
                    v-for="(error, index) in itemBackendErrors.non_field_errors"
                    :key="index">
                    {{ error }}</p>
            </span>
            <!-- backend general errors -->
            <span v-if="itemBackendErrors.message">
                <p
                    class="form-text text-danger">
                    {{ itemBackendErrors.message }}</p>
            </span>
            <p>Está seguro que desea eliminar el artículo: {{ item.name }}?</p>
            <button
              class="btn btn-sm btn-danger"
              @click="delItem(item.id)">Eliminar</button>
            <RouterLink :to="{name: 'items_detail', params: {id: item.id}}" class="btn btn-sm btn-secondary">Cancelar</RouterLink>
        </div>

    </div> <!-- end row -->
</template>
