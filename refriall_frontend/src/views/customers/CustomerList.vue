<script setup>

// vue
import { ref, onMounted } from "vue";
import { RouterLink } from "vue-router";

// app
import { listCustomer } from "../../services/customer.service";
import listGroup from "../../assets/js/bootstrap_classes/listGroup";

const customers = ref([]);
const currentPage = ref(1);
const showNextButton = ref(false);
const showPrevButton = ref(false);
const customerBackendErrors = ref(null)

const getCustomers = async () => {
    try {
        const resp = (await listCustomer(currentPage.value)).data;
        
        showNextButton.value = false;
        if (resp.next) {
            showNextButton.value = true;
        }
        
        showPrevButton.value = false;
        if (resp.previous) {
            showPrevButton.value = true;
        }
    
        customers.value = resp.results;
    } catch (error) {
        console.error('General error', error)
        if (error.response) {
            customerBackendErrors.value = `${error.response.data} - ${error.response.status}`
        } else {
            customerBackendErrors.value = 'Error inesperado, consulte al desarrollador'
        }
    }
};

const loadNextItems = () => {
    currentPage.value += 1;
    getCustomers()
}

const loadPrevItems = () => {
    currentPage.value -= 1;
    getCustomers()
}


onMounted(async () => {
    getCustomers()
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
                    <router-link :to="{name: 'customers_create'}">Nuevo</router-link >
                </li>
            </ul>
        </div>
        
        <!-- main content -->
        <div class="col-md-10">
            <div class="row">
                <div class="col-md-4">
                    <!-- backend general errors -->
                    <span v-if="customerBackendErrors">
                        <p
                            class="form-text text-danger">
                            {{ customerBackendErrors }}</p>
                    </span>

                    <div v-if="customers.length > 0">

                        <div id="tableContainer" style="height: 460px;">

                            <table class="table">
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
                        <p class="lead text-center">Inserte un cliente.</p>
                    </div>
                </div>
            </div>
        </div>

    </div>

</template>
