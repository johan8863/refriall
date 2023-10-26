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
import axios from 'axios';

const route = useRoute();
const url = 'http://127.0.0.1:8000/stock/kits/';
const id = route.params.id;
const kit = ref({
    name: ''
});

onMounted(async () => {
    const resp = await axios.get(`${url}${id}`);
    kit.value = resp.data;
});


</script>

<style lang="scss" scoped>

</style>