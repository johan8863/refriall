<template>

    <div class="row">
        <!-- side menu -->
        <div class="col-md-2">
            <ul class="list-group list-group-flush">
                <li class="list-group-item">
                    <strong>Prestadores</strong>
                </li>
                <li class="list-group-item">
                    <router-link :to="{name: 'providers_create'}">Nuevo</router-link >
                </li>
            </ul>
        </div>
        
        <!-- main content -->
        <div class="col-md-10">
            <div class="row">
                <div class="col-md-4">
                        <table v-if="providers.length > 0" class="table">
                            <thead>
                                <tr>
                                    <th scope="col">Nombre</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="provider in providers" :key="provider.id">
                                    <td>
                                        <router-link :to="{name: 'providers_detail', params: {id: provider.id}}">{{ provider.first_name }}</router-link>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    

                        <p v-else class="lead text-center">Inserte un Proveedor.</p>
                </div>
            </div>
        </div>

    </div>

</template>

<script setup>

import axios from "axios";
import { ref, onMounted } from "vue";
import { RouterLink } from "vue-router";

const url = 'http://127.0.0.1:8000/hr/providers/';
const providers = ref([]);

onMounted(async () => {
    const resp = await axios.get(url);
    providers.value = resp.data;
});

</script>