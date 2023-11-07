<template>
    <div class="row">
        <!-- side menu -->
        <div class="col-md-2">
            <ul class="list-group list-group-flush">
                <li class="list-group-item">
                    <strong>Equipos</strong>
                </li>
                <li class="list-group-item">
                    <router-link :to="{name: 'kits'}">Equipos</router-link>
                </li>
                <li class="list-group-item">
                    <router-link :to="{name: 'kits_update', params: {id: kit.id}}">Editar</router-link>
                </li>
                <li class="list-group-item">
                    <router-link :to="{name: 'kits_update', params: {id: kit.id}}">Eliminar</router-link>
                </li>
            </ul>
        </div>

        <!-- main content -->
        <div class="col-md-4">
            <h3>{{ kit.name }}</h3>
        </div>

    </div> <!-- end row -->

</template>

<script setup>

import { onMounted, ref } from "vue";
import { RouterLink, useRoute } from "vue-router";
import { detatilKit } from "../../services/kit.service";

const route = useRoute();
const kit = ref({
    name: ''
});

onMounted(async () => {
    const resp = await detatilKit(route.params.id);
    kit.value = resp.data;
});


</script>

<style lang="scss" scoped>

</style>