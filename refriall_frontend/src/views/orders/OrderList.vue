<template>

    <div class="row">
        <!-- side menu -->
        <div class="col-md-2">
            <ul class="list-group list-group-flush">
                <li class="list-group-item">
                    <strong>Órdenes</strong>
                </li>
                <li class="list-group-item">
                    <router-link :to="{name: 'orders_create'}">Nueva</router-link >
                </li>
            </ul>
        </div>
        
        <!-- main content -->
        <div class="col-md-10">
            <div class="row">
                <div class="col-md-4">
                        <table v-if="orders.length > 0" class="table">
                            <thead>
                                <tr>
                                    <th scope="col">Cliente</th>
                                    <th scope="col">Importe</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="order in orders" :key="order.id">
                                    <td v-if="order.customer">
                                        <router-link :to="{name: 'orders_detail', params: {id: order.id}}">{{ order.customer.name }}</router-link>
                                    </td>
                                    <td v-if="order.customer_dependency">
                                        <router-link :to="{name: 'orders_detail', params: {id: order.id}}">{{ order.customer_dependency.name }}</router-link>
                                    </td>
                                    <td>
                                        <router-link :to="{name: 'orders_detail', params: {id: order.id}}">{{ order.get_total_amount }}</router-link>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    
                        <p v-else class="lead text-center">Inserte una orden.</p>
                </div>
            </div>
        </div>

    </div>

</template>

<script setup>

import { RouterLink } from "vue-router";
import { ref, onMounted } from "vue";
import { listOrder } from "../../services/order.service";

const orders = ref([]);

onMounted(async () => {
    const resp = await listOrder();
    orders.value = resp.data;
});

</script>