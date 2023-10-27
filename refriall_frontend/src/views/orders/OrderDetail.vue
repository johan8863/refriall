<template>
    <div class="row">
        <!-- side menu -->
        <div class="col-md-2">
            <ul class="list-group list-group-flush">
                <li class="list-group-item">
                    <strong>Órdenes</strong>
                </li>
                <li class="list-group-item">
                    <router-link :to="{name: 'orders'}">Órdenes</router-link>
                </li>
            </ul>
        </div>

        <!-- main content -->
        <div class="col-md-4">
            <h3>Orden: {{ order.id }}</h3>
        </div>

    </div> <!-- end row -->

</template>

<script setup>

import { RouterLink, useRoute } from "vue-router";
import { ref, onMounted } from 'vue';
import axios from "axios";

const url = 'http://127.0.0.1:8000/finance/orders/';
const route = useRoute();
const order = ref({});

onMounted(async () => {
    const resp = await axios.get(`${url}${route.params.id}`);
    order.value = resp.data;
});

</script>

<style lang="scss" scoped>

</style>