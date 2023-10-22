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
                                <tr>
                                    <td><a href="#">Refrigerador</a></td>
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

import { RouterLink } from "vue-router";
import { ref } from "vue";

const kits = ref([])

// kits.value.push('Split')

</script>