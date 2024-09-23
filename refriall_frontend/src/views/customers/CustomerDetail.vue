<script setup>

// vue
import { ref, onMounted } from "vue";
import { RouterLink, useRoute } from "vue-router";

// app
import { detailCustomer } from "../../services/customer.service";
import listGroup from "../../assets/js/bootstrap_classes/listGroup";


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
    try {
        const resp = await detailCustomer(route.params.id);
        customer.value = resp.data;
    } catch (error) {
        if (error.response) {
            billBackendErrors.value = `${error.response.data.detail} - ${error.response.status}`
        } else {
            billBackendErrors.value = 'Error inesperado, consulte al desarrollador'
        }
    }
});

</script>

<template>
    <div class="row">
        <!-- side menu -->
        <div class="col-md-2">
            <ul :class="listGroup.listGroup">
                <li :class="listGroup.listGroupItem">
                    <strong>Clientes</strong>
                </li>
                <li :class="listGroup.listGroupItem">
                    <router-link :to="{name: 'customers'}">Clientes</router-link>
                </li>
                <li :class="listGroup.listGroupItem">
                    <router-link :to="{name: 'customers_create'}">Nuevo</router-link >
                </li>
                <li :class="listGroup.listGroupItem">
                    <router-link :to="{name: 'customers_update', params: {id: customer.id}}">Editar</router-link>
                </li>
                <li :class="listGroup.listGroupItem">
                    <router-link :to="{name: 'customer_dependecy_create', params: {id: customer.id}}">Nueva dependencia</router-link>
                </li>
                <li :class="listGroup.listGroupItem">
                    <router-link :to="{name: 'customers_confirm_delete', params: {id: customer.id}}">Eliminar</router-link>
                </li>
            </ul>
        </div>

        <!-- main content -->
        <!-- notfound false -->
        <div class="col-md-4">
            <!-- backend general errors -->
            <span v-if="billBackendErrors">
                <p
                    class="form-text text-danger">
                    {{ billBackendErrors }}</p>
            </span>
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
