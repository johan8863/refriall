<template>

    <div class="row">
        <!-- side menu -->
        <div class="col-md-2">
            <ul class="list-group list-group-flush">
                <li class="list-group-item">
                    <strong>Equipos</strong>
                </li>
                <li class="list-group-item">
                    <router-link :to="{name: 'kits_create'}">Nuevo</router-link >
                </li>
            </ul>
        </div>
        
        <!-- main content -->
        <div class="col-md-10">
            <div class="row">
                <div class="col-md-4">
                        <table v-if="kits.length > 0" class="table">
                            <thead>
                                <tr>
                                    <th scope="col">Nombre</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="kit in kits" :key="kit.id">
                                    <td>
                                        <RouterLink :to="{name: 'kits_detail', params: {id: kit.id}}">{{kit.name}}</RouterLink>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    

                        <p v-else class="lead text-center">Inserte un equipo.</p>
                </div>
            </div>
        </div>

    </div>

</template>

<script setup>

import { onMounted, ref } from "vue";
import { RouterLink } from "vue-router";
import { listKit } from "../../services/kit.service";

const kits = ref([]);

onMounted(async () => {
    const resp = await listKit();
    kits.value = resp.data;
});

</script>