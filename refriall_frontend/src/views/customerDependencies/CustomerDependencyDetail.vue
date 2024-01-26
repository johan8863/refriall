<template>
    <div class="row">
        <!-- side menu -->
        <div class="col-md-2">
            <ul class="list-group list-group-flush">
                <li class="list-group-item">
                    <strong>Dependencias</strong>
                </li>
                <li class="list-group-item">
                    <router-link :to="{name: 'customers'}">Clientes</router-link>
                </li>
                <li class="list-group-item">
                    <router-link :to="{name: 'customer_dependecy_update', params: {id: dependency.id}}">Editar</router-link>
                </li>
                <li class="list-group-item">
                    <router-link :to="{name: 'customer_dependecy_delete', params: {id: dependency.id}}">Eliminar</router-link>
                </li>
            </ul>
        </div>

        <!-- main content -->
        <div class="col-md-4">
            <h3>{{ dependency.name }}</h3>
            <hr>
            <p>{{ dependency.name }}</p>
            <p>{{ dependency.address }}</p>
            <p>{{ dependency.province }}</p>
            <p>{{ dependency.township }}</p>
        </div>

        
    </div>
</template>

<script setup>

import { ref, onMounted } from "vue";
import { detailCustomerDependecy } from '../../services/customerDependency.service';
import { useRoute } from "vue-router";

const route = useRoute();
const dependency = ref({
    customer: '',
    name: '',
    address: '',
    province: '',
    township: '',
});

onMounted(async () => {
    const resp = await detailCustomerDependecy(route.params.id);
    dependency.value = resp.data;
});

</script>