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
                <li class="list-group-item">
                    <router-link :to="{name: 'customers_update', params: {id: customer.id}}">Editar</router-link>
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
import { detailCustomer } from "../../services/customer.service";


const route = useRoute();
const customer = ref({
    customer_type: '',
    name: '',
    address: '',
    province: '',
    township: '',
    code: '',
    client_nit: '',
    bank_account_header: '',
    bank_account: '',
});

onMounted(async () => {
    const resp = await detailCustomer(route.params.id);
    customer.value = resp.data;
});

</script>

<style lang="scss" scoped>

</style>