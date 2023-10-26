<template>
    <div class="row">
        <!-- side menu -->
        <div class="col-md-2">
            <ul class="list-group list-group-flush">
                <li class="list-group-item">
                    <strong>Clientes</strong>
                </li>
                <li class="list-group-item">
                    <router-link :to="{name: 'customers'}">Clientes</router-link>
                </li>
            </ul>
        </div>

        <!-- main content -->
        <div class="col-md-4">
            <h3>{{ customer.name }}</h3>
            <hr>
            <p>{{ customer.address }}</p>
            <p>Titular de la cuenta: {{ customer.bank_account_header }}</p>
            <p>Buenta bancaria: {{ customer.bank_account }}</p>
        </div>

    </div> <!-- end row -->

</template>

<script setup>

import { ref, onMounted } from "vue";
import { RouterLink, useRoute } from "vue-router";
import axios from "axios";

const url = 'http://127.0.0.1:8000/hr/customers/';
const route = useRoute();
const customer = ref({});

onMounted(async () => {
    const resp = await axios.get(`${url}${route.params.id}`)
    customer.value = resp.data;
});

</script>

<style lang="scss" scoped>

</style>