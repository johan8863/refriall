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
                    <router-link :to="{name: 'customers_create'}">Nuevo</router-link >
                </li>
                <li class="list-group-item">
                    <router-link :to="{name: 'customers_update', params: {id: customer.id}}">Editar</router-link>
                </li>
                <li class="list-group-item">
                    <router-link :to="{name: 'customer_dependecy_create', params: {id: customer.id}}">Nueva dependencia</router-link>
                </li>
                <li class="list-group-item">
                    <router-link :to="{name: 'customers_confirm_delete', params: {id: customer.id}}">Eliminar</router-link>
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

        <div class="col-md-4">
            <h3>Dependencias</h3>
            <hr>
            <div v-for="dependency of customer.get_dependencies" :key="dependency.id">
                <router-link :to="{name: 'customer_dependecy_detail', params: {id: dependency.id}}">{{ dependency.name }}</router-link>
            </div>
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
    get_dependencies: [],
});

onMounted(async () => {
    const resp = await detailCustomer(route.params.id);
    customer.value = resp.data;
});

</script>

<style lang="scss" scoped>

</style>