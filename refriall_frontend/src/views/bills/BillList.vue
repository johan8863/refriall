<template>

<div class="row">
        <!-- side menu -->
        <div class="col-md-2">
            <ul class="list-group list-group-flush">
                <li class="list-group-item">
                    <strong>Facturas</strong>
                </li>
                <li class="list-group-item">
                    <router-link :to="{name: 'bills_create'}">Nueva</router-link >
                </li>
            </ul>
        </div>

        <!-- main content -->
        <div class="col-md-10">
            <div class="row">
                <div class="col-md-4">

                    <div v-if="bills.length > 0">

                        <div id="tableContainer" style="height: 460px;">

                            <table class="table">
                                <thead>
                                    <tr>
                                        <th scope="col">Cliente</th>
                                        <th scope="col">Importe</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    
                                    <tr v-for="bill in bills" :key="bill.id">
                                        <td v-if="bill.customer">
                                            <router-link :to="{name: 'bills_detail', params: {id: bill.id}}">{{ bill.customer.name }}</router-link>
                                        </td>
                                        <td v-if="bill.customer_dependency">
                                            <router-link :to="{name: 'bills_detail', params: {id: bill.id}}">{{ bill.customer_dependency.name }}</router-link>
                                        </td>
                                        <td>
                                            <router-link :to="{name: 'bills_detail', params: {id: bill.id}}">{{ bill.get_total_amount.toFixed(2) }}</router-link>
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
                        <p class="lead text-center">Inserte una Factura.</p>
                    </div>

                    
                </div>
            </div>
        </div>

</div>

</template>

<script setup>
import { onMounted, ref } from 'vue';
import { listBillsPagination } from '../../services/bill.service';

const bills = ref([]);
const currentPage = ref(1);
const showNextButton = ref(false);
const showPrevButton = ref(false);

const getBills = async () => {
    const resp = (await listBillsPagination(currentPage.value)).data;
    
    showNextButton.value = false;
    if (resp.next) {
        showNextButton.value = true;
    }
    
    showPrevButton.value = false;
    if (resp.previous) {
        showPrevButton.value = true;
    }

    bills.value = resp.results;
};

const loadNextItems = () => {
    currentPage.value += 1;
    getBills()
}

const loadPrevItems = () => {
    currentPage.value -= 1;
    getBills()
}


onMounted(async () => {
    getBills()
});


</script>