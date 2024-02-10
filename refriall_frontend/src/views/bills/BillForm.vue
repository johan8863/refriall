<template>
    <div class="row">

        <!-- side menu -->
        <div class="col-md-2">
            <ul class="list-group list-group-flush">
                <li class="list-group-item">
                    <strong>Facturas</strong>
                </li>
                <li class="list-group-item">
                    <router-link :to="{name: 'bills'}">Facturas</router-link>
                </li>
            </ul>
        </div>

        <!-- main content -->
        <div class="col-md-9">
            <!-- form -->
            <form @submit.prevent class="row">

                <span v-if="billBackendErrors.non_field_errors">
                    <p
                      class="form-text text-danger"
                      v-for="(error, index) in billBackendErrors.non_field_errors"
                      :key="index">
                      {{ error }}</p>
                </span>

                <!-- customer control -->
                <div class="col-md-3 mb-2">
                    <label for="customer">Cliente</label>
                    <select
                      name="customer"
                      id="customer"
                      class="form-select"
                      autofocus
                      @change="ordersFromClient"
                      v-model.trim="bill.customer">
                        <option
                          v-for="customer in customers"
                          :key="customer.id"
                          :value="customer.id">{{ customer.name }}</option>
                    </select>
                </div>

                <!-- folio control -->
                <div class="col-md-3 mb-2">
                    <label for="folio">Folio</label>
                    <input
                      type="text"
                      class="form-control"
                      id="folio"
                      v-model.trim="bill.folio">
                </div>

                <!-- provider_signature_date control -->
                <div class="col-md-3 mb-2">
                    <label for="provider_signature_date">Firma del Proveedor</label>
                    <input
                      type="date"
                      name="provider_signature_date"
                      id="provider_signature_date"
                      class="form-control"
                      v-model.trim="bill.provider_signature_date">
                </div>

                <!-- customer_signature_date control -->
                <div class="col-md-3 mb-2">
                    <label for="customer_signature_date">Firma del Cliente</label>
                    <input
                      type="date"
                      name="customer_signature_date"
                      id="customer_signature_date"
                      class="form-control"
                      v-model.trim="bill.customer_signature_date">
                </div>

                <!-- orders control -->
                <div class="col-md-12">

                    <table class="table">

                        <thead>
                            <tr>
                                <th>
                                    <input
                                      type="checkbox"
                                      name=""
                                      id=""
                                      class="form-check"
                                      @input="pushAllOrders">
                                </th>
                                <th>Folio</th>
                                <th>Cliente</th>
                                <th>Dependencia</th>
                                <th>Importe Total</th>
                            </tr>
                        </thead>

                        <tbody>
                            <tr v-for="order in orders" :key="order.id">
                                <td>
                                    <input
                                      type="checkbox"
                                      name=""
                                      :id="order.id"
                                      class="form-check"
                                      v-model="bill.orders"
                                      :value="order.id">
                                </td>
                                <td>{{ order.folio }}</td>
                                <td v-if="order.customer">{{ order.customer.name }}</td>
                                <td v-else>-</td>
                                <td v-if="order.customer_dependency">{{ order.customer_dependency.name }}</td>
                                <td v-else>-</td>
                                <td>{{ order.get_total_amount }}</td>
                            </tr>
                        </tbody>

                    </table>

                </div>

                <!-- check_number control -->
                <div class="col-md-3 mb-2">
                    <label for="check_number">Nro. de Cheque</label>
                    <input
                      type="text"
                      class="form-control"
                      id="check_number"
                      v-model.trim="bill.check_number">
                </div>

                <!-- charge_aprove control -->
                <div class="col-md-3 mb-2">
                    <label for="charge_aprove">Cargo Aprueba</label>
                    <input
                      type="text"
                      class="form-control"
                      id="charge_aprove"
                      v-model.trim="bill.charge_aprove">
                </div>

                <!-- charge_check control -->
                <div class="col-md-3 mb-2">
                    <label for="charge_check">Cargo Revisa</label>
                    <input
                      type="text"
                      class="form-control"
                      id="charge_check"
                      v-model.trim="bill.charge_check">
                </div>

                <!-- customer_charge control -->
                <div class="col-md-3 mb-2">
                    <label for="customer_charge">Cargo del Cliente</label>
                    <input
                      type="text"
                      class="form-control"
                      id="customer_charge"
                      v-model.trim="bill.customer_charge">
                </div>

                <!-- customer_name control -->
                <div class="col-md-3 mb-2">
                    <label for="customer_name">Nombre del Cliente</label>
                    <input
                        type="text"
                        class="form-control"
                        id="customer_name"
                        v-model.trim="bill.customer_name">
                </div>

                <!-- customer_personal_id control -->
                <div class="col-md-3 mb-2">
                    <label for="customer_personal_id">CI del Cliente</label>
                    <input
                      type="text"
                      class="form-control"
                      id="customer_personal_id"
                      v-model.trim="bill.customer_personal_id">
                </div>

                <!-- checked_by control -->
                <div class="col-md-3 mb-2">
                    <label for="checked_by">Revisado por</label>
                    <input
                        type="text"
                        class="form-control"
                        id="checked_by"
                        v-model.trim="bill.checked_by">
                </div>

                <!-- aproved_by control -->
                <div class="col-md-3 mb-2">
                    <label for="aproved_by">Cargo del Cliente</label>
                    <input
                      type="text"
                      class="form-control"
                      id="aproved_by"
                      v-model.trim="bill.aproved_by">
                </div>

                <!-- buttons -->
                <div class="mb-5">
                    <button class="btn btn-sm btn-primary" @click="createBill(bill)">Guardar</button>
                    <RouterLink :to="{name: 'bills'}" class="btn btn-sm btn-secondary">Cancelar</RouterLink>
                </div>

            </form>
        </div>

    </div>
</template>

<script setup>
// vue
import { onMounted, ref } from 'vue';
import { RouterLink, useRouter } from "vue-router";

// core
import { postBill } from "../../services/bill.service";
import { listCustomer } from "../../services/customer.service";
import { listOrder, getOrdersFromClient } from "../../services/order.service";


const bill = ref({
    customer: '',
    customer_dependency: '',
    folio: '',
    provider: 1,
    provider_signature_date: '',
    customer_signature_date: '',
    orders: [],
    check_number: '',
    charge_aprove: '',
    charge_check: '',
    customer_charge: '',
    customer_name: '',
    customer_personal_id: '',
    checked_by: '',
    aproved_by: '' ,
});

const billBackendErrors = ref({
    non_field_errors: [],
    customer: '',
    customer_dependency: '',
    folio: '',
    provider: '',
    provider_signature_date: '',
    customer_signature_date: '',
    orders: [],
    check_number: '',
    charge_aprove: '',
    charge_check: '',
    customer_charge: '',
    customer_name: '',
    customer_personal_id: '',
    checked_by: '',
    aproved_by: '' ,
});

const customers = ref([]);
const orders = ref([]);

const router = useRouter();



onMounted(async () => {
    // get customers
    const respCustomers = await listCustomer();
    customers.value = respCustomers.data;

    // get orders
    const respOrders = await listOrder();
    orders.value = respOrders.data;
});

const createBill = async (bill) => {
    try {
        const { data } = await postBill(bill);
        router.push({name: 'bills_detail', params: {id: data.id}})
    } catch (error) {
        billBackendErrors.value = error.response.data
    }
}

const ordersFromClient = async (event) => {
    try {
        console.log(event.target.value);
        // return await getOrdersFromClient(event);
        orders.value = (await getOrdersFromClient(event.target.value)).data;
    } catch (error) {
        console.log(error.response.data);
    }
}

const pushAllOrders = (event) => {
    if (event.target.checked) {
        const ordersPush = orders.value.map(item => item.id)
        bill.value.orders = ordersPush
    } else {
        bill.value.orders = []
    }
};

</script>