<template>

    <div class="row">
        <!-- side menu -->
        <div class="col-md-2">
            <ul :class="listGroup.listGroup">
                <li :class="listGroup.listGroupItem">
                    <strong>Facturas</strong>
                </li>
                <li :class="listGroup.listGroupItem">
                    <RouterLink :to="{name: 'bills'}">Facturas</RouterLink>
                </li>
            </ul>
        </div>

        <!-- main content -->
        <div class="col-md-6">
            <p>Está seguro que desea eliminar la siguiente factura?</p>
            <table class="table">
                <thead>
                    <tr>
                        <th>Folio</th>
                        <th>Cliente</th>
                        <th>Importe total</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>{{ bill.folio }}</td>
                        <td>{{ bill.customer.name }}</td>
                        <td>{{ bill.get_total_amount }}</td>
                    </tr>
                </tbody>
            </table>
            <button
                class="btn btn-sm btn-danger"
                @click="delBill(bill.id)">Eliminar</button>
            <RouterLink :to="{name: 'bills_detail', params: {id: bill.id}}" class="btn btn-sm btn-secondary">Cancelar</RouterLink>
        </div>

    </div>

</template>

<script setup>

// vue
import { ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";

// app
import { detailBill, deleteBill } from "../../services/bill.service";
import listGroup from "../../assets/js/bootstrap_classes/listGroup";

const route = useRoute();
const router = useRouter();

const bill = ref({
    customer: '',
    folio: '',
    provider: 1,
    provider_signature_date: '',
    customer_signature_date: '',
    orders: [],
    get_orders: [],
    check_number: '',
    charge_aprove: '',
    charge_check: '',
    customer_charge: '',
    customer_name: '',
    customer_personal_id: '',
    checked_by: '',
    aproved_by: '' ,
});

onMounted(async () => {
    const resp = await detailBill(route.params.id);
    bill.value = resp.data;
});

// delete the bill object
const delBill = async (id) => {
    try {
        await deleteBill(id);
        router.push({name: 'bills'});
    } catch (error) {
        // in case of backend errors, log to the console... for now
        console.log(error.response.data);   
    }
};


</script>