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

const errorMessage = ref(null)

onMounted(async () => {
    try {
        const resp = await detailItem(route.params.id);
        item.value = resp.data;
    } catch (error) {
        console.log('Error status:', error.response.status)
        console.log('Error data:', error.response.data)
        if (error.response) {
            if (error.response.status === 404) {
                errorMessage.value = 'Artículo no encontrado.'
            }
        } else if (error.request) {
            errorMessage.value = 'Error de Servidor, consulte al desarrollador.'
        }
    }
});

// delete the item object
const delItem = async (id) => {
    try {
        await deleteItem(id);
        router.push({name: 'items'});
    } catch (error) {
        console.log('Error status:', error.response.status)
        console.log('Error data:', error.response.data)
        if (error.response) {
            if (error.response.status === 404) {
                errorMessage.value = 'Artículo no encontrado.'
            }
            if (error.response.status === 400) {
                errorMessage.value = 'Artículo asociado.'
            }
        } else if (error.request) {
            errorMessage.value = 'Error de Servidor, consulte al desarrollador.'
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
            <!-- backend general errors -->
            <span v-if="errorMessage">
                <p
                    class="form-text text-danger">
                    {{ errorMessage }}</p>
            </span>
            <p>Está seguro que desea eliminar el artículo: {{ item.name }}?</p>
            <button
              class="btn btn-sm btn-danger"
              @click="delItem(item.id)">Eliminar</button>
            <RouterLink :to="{name: 'items_detail', params: {id: item.id}}" class="btn btn-sm btn-secondary">Cancelar</RouterLink>
        </div>

    </div> <!-- end row -->
</template>
