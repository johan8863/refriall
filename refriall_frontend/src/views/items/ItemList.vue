<template>
    <div class="row">
        <!-- side menu -->
        <div class="col-md-2">
            <ul class="list-group list-group-flush">
                <li class="list-group-item">
                    <strong>Artículos</strong>
                </li>
                <li class="list-group-item">
                    <RouterLink :to="{name: 'items_create'}">Nuevo</RouterLink >
                </li>
            </ul>
        </div>
        
        <!-- main content -->
        <div class="col-md-10">
            <div class="row">
                <div class="col-md-6">
                        <table v-if="items.length > 0" class="table">
                            <thead>
                                <tr>
                                    <th scope="col">Nombre</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="item in items" :key="item.id">
                                    <td>
                                        <RouterLink :to="{name: 'items_detail', params: {id: item.id}}">{{ item.name }}</RouterLink>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    

                        <p v-else class="lead text-center">Inserte un Articulo.</p>
                </div>
            </div>
        </div>

    </div> <!-- end row -->
</template>

<script setup>
import { onMounted, ref } from "vue";
import { RouterLink } from "vue-router";
import axios from "axios";

const url = 'http://127.0.0.1:8000/stock/items/';
const items = ref([]);

onMounted(async () => {
    const resp = await axios.get(url);
    items.value = resp.data;
});

</script>

<style lang="scss" scoped>

</style>