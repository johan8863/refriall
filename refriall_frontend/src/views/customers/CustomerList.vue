<template>

    <div class="row">
        <!-- side menu -->
        <div class="col-md-2">
            <ul class="list-group list-group-flush">
                <li class="list-group-item">
                    <strong>Clientes</strong>
                </li>
                <li class="list-group-item">
                    <router-link :to="{name: 'customers_create'}">Nuevo</router-link >
                </li>
            </ul>
        </div>
        
        <!-- main content -->
        <div class="col-md-10">
            <div class="row">
                <div class="col-md-4">
                        <table v-if="customers.length > 0" class="table">
                            <thead>
                                <tr>
                                    <th scope="col">Nombre</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="customer in customers" :key="customer.id">
                                    <td>
                                        <RouterLink :to="{name: 'customers_detail', params: {id: customer.id}}">{{ customer.name }}</RouterLink>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    

                        <p v-else class="lead text-center">Inserte un cliente.</p>
                </div>
            </div>
        </div>

    </div>

</template>

<script setup>

import { ref, onMounted } from "vue";
import { RouterLink } from "vue-router";
import { listCustomer } from "../../services/customer.service";

const customers = ref([]);

onMounted(async () => {
    const resp = await listCustomer();
    customers.value = resp.data;
});

</script>