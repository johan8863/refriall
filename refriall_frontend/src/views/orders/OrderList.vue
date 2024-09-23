<script setup>

// vue
import { RouterLink } from "vue-router";
import { ref, onMounted } from "vue";

// app
import { listOrder } from "../../services/order.service";
import listGroup from "../../assets/js/bootstrap_classes/listGroup";

const orders = ref([]);
const currentPage = ref(1);
const showNextButton = ref(false);
const showPrevButton = ref(false);
const orderBackendErrors = ref(null)

const getOrders = async () => {
    try {
        const resp = (await listOrder(currentPage.value)).data;
        
        showNextButton.value = false;
        if (resp.next) {
            showNextButton.value = true;
        }
        
        showPrevButton.value = false;
        if (resp.previous) {
            showPrevButton.value = true;
        }
    
        orders.value = resp.results;
        
    } catch (error) {
        console.error('General error', error)
        if (error.response) {
            orderBackendErrors.value = `${error.response.data} - ${error.response.status}`
        } else {
            orderBackendErrors.value = 'Error inesperado, consulte al desarrollador'
        }
    }
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

<template>

    <div class="row">
        <!-- side menu -->
        <div class="col-md-2">
            <ul :class="listGroup.listGroup">
                <li :class="listGroup.listGroupItem">
                    <strong>Órdenes</strong>
                </li>
                <li :class="listGroup.listGroupItem">
                    <router-link :to="{name: 'orders_create'}">Nueva</router-link >
                </li>
            </ul>
        </div>
        
        <!-- main content -->
        <div class="col-md-10">
            <div class="row">
                <div class="col-md-6">
                    <div v-if="orderBackendErrors">
                        <span class="form-text text-danger">{{ orderBackendErrors }}</span>
                    </div>
                    <div v-if="orders.length > 0">

                        <div id="tableContainer">
                            
                            <table class="table">
                                <thead>
                                    <tr>
                                        <th scope="col">Orden</th>
                                        <th scope="col">Cliente</th>
                                        <th scope="col">Importe</th>
                                        <th scope="col">Prefactura</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr v-for="order in orders" :key="order.id">
                                        <td>
                                            <router-link :to="{name: 'orders_detail', params: {id: order.id}}">{{ order.folio }}</router-link>
                                        </td>
                                        <td v-if="order.customer">
                                            {{ order.customer.name }}
                                        </td>
                                        <td v-if="order.customer_dependency">
                                            {{ order.customer_dependency.name }}
                                        </td>
                                        <td>
                                            {{ order.get_total_amount.toFixed(2) }}
                                        </td>
                                        <td>
                                            <router-link :to="{name: 'orders_detail_pre_order', params: {id: order.id}}">Detalle</router-link>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>

                        </div>

                        <!-- buttons -->
                        <div class="mb-4">
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
