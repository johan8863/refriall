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
                <div class="col-md-4">
                        <table v-if="items.length > 0" class="table">
                            <thead>
                                <tr>
                                    <th scope="col">Nombre</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td><a href="#">Montaje de Split</a></td>
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
import { ref } from "vue";
import { RouterLink } from "vue-router";

const items = ref([])

</script>

<style lang="scss" scoped>

</style>