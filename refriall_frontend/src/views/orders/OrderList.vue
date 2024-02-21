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
                    <div v-if="orders.length > 0">

                        <div id="tableContainer" style="height: 460px;">
                            
                            <table class="table">
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
                                            <router-link :to="{name: 'orders_detail', params: {id: order.id}}">{{ order.get_total_amount.toFixed(2) }}</router-link>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>

                        </div>

                        <!-- buttons -->
                        <div>
                            <button
                              v-if="showPrevButton"
                              class="btn btn-sm btn-primary"
                              @click="loadPrevItems()">Anterior</button>

                            <button
                              v-if="showNextButton"
                              class="btn btn-sm btn-primary"
                              @click="loadNextItems()">Siguiente</button>
                        </div>

                    </div>

                    <div v-else>
                        <p class="lead text-center">Inserte una orden.</p>
                    </div>
                    
                </div>
            </div>
        </div>

    </div>

</template>

<script setup>

import { RouterLink } from "vue-router";
import { ref, onMounted } from "vue";
import { listOrderPagination } from "../../services/order.service";

const orders = ref([]);
const currentPage = ref(1);
const showNextButton = ref(false);
const showPrevButton = ref(false);

const getOrders = async () => {
    const resp = (await listOrderPagination(currentPage.value)).data;
    
    showNextButton.value = false;
    if (resp.next) {
        showNextButton.value = true;
    }
    
    showPrevButton.value = false;
    if (resp.previous) {
        showPrevButton.value = true;
    }

    orders.value = resp.results;
};

const loadNextItems = () => {
    currentPage.value += 1;
    getOrders()
}

const loadPrevItems = () => {
    currentPage.value -= 1;
    getOrders()
}

onMounted(async () => {
    getOrders()
});

</script>