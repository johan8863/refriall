<template>
    <div class="row">
        <!-- side menu -->
        <div class="col-md-2">
            <ul class="list-group list-group-flush">
                <li class="list-group-item">
                    <strong>Prestadores</strong>
                </li>
                <li class="list-group-item">
                    <router-link :to="{name: 'providers'}">Prestadores</router-link>
                </li>
            </ul>
        </div>

        <!-- main content -->
        <div class="col-md-4">
            <h3>{{ provider.first_name }}</h3>
        </div>

    </div> <!-- end row -->

</template>

<script setup>

import { RouterLink, useRoute } from "vue-router";
import { ref, onMounted } from 'vue';
import axios from "axios";

const url = 'http://127.0.0.1:8000/hr/providers/';
const route = useRoute();
const provider = ref({});

onMounted(async () => {
    const resp = await axios.get(`${url}${route.params.id}`);
    provider.value = resp.data;
});

</script>

<style lang="scss" scoped>

</style>