<template>

<div class="row">
        <!-- side menu -->
        <div class="col-md-2">
            <ul class="list-group list-group-flush">
                <li class="list-group-item">
                    <strong>Facturas</strong>
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
                        <table v-if="bills.length > 0" class="table">
                            <thead>
                                <tr>
                                    <th scope="col">Cliente</th>
                                    <th scope="col">Importe</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="bill in bills" :key="bill.id">
                                    <td v-if="bill.customer">
                                        <a>{{ bill.customer.name }}</a>
                                    </td>
                                    <td v-if="bill.customer_dependency">
                                        <a>{{ bill.customer_dependency.name }}</a>
                                    </td>
                                    <td>
                                        <a>{{ bill.get_total_amount }}</a>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    
                        <p v-else class="lead text-center">Inserte una Factura.</p>
                </div>
            </div>
        </div>

</div>

</template>

<script setup>
import { onMounted, ref } from 'vue';
import { listBills } from '../../services/bill.service';

const bills = ref([]);

onMounted(async () => {
    const resp = await listBills();
    bills.value = resp.data;
});

</script>