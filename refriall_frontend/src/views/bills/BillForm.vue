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
                <!-- backend errors from non_field_errors dictionary -->
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
                      @change="ordersFromCustomer"
                      v-model="bill.customer"
                      :disabled="bill.id">
                        <option
                          v-for="customer in customers"
                          :key="customer.id"
                          :value="customer.id">{{ customer.name }}</option>
                    </select>
                    <!-- backend errors -->
                    <span v-if="billBackendErrors.customer">
                        <p
                          v-for="(error, index) in billBackendErrors.customer"
                          :key="index"
                          class="form-text text-danger">
                            {{ error }}</p>
                    </span>
                </div>

                <!-- folio control -->
                <div class="col-md-3 mb-2">
                    <label for="folio">Folio</label>
                    <input
                      type="text"
                      class="form-control"
                      id="folio"
                      v-model.trim="bill.folio">
                      <!-- backend errors -->
                      <span v-if="billBackendErrors.folio">
                        <p
                          v-for="(error, index) in billBackendErrors.folio"
                          :key="index"
                          class="form-text text-danger">
                            {{ error }}
                        </p>
                      </span>
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
                      <!-- backend errors -->
                      <span v-if="billBackendErrors.provider_signature_date">
                        <p
                          v-for="(error, index) in billBackendErrors.provider_signature_date"
                          :key="index"
                          class="form-text text-danger">
                            {{ error }}
                        </p>
                      </span>
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
                      <!-- backend errors -->
                      <span v-if="billBackendErrors.customer_signature_date">
                        <p
                          v-for="(error, index) in billBackendErrors.customer_signature_date"
                          :key="index"
                          class="form-text text-danger">
                            {{ error }}
                        </p>
                      </span>
                </div>

                <!-- orders control -->
                <div v-if="bill.id" class="col-md-12">
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
                            <tr v-for="order in bill.get_orders" :key="order.id">
                                <td>
                                    <input
                                      type="checkbox"
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
                    <!-- backend errors -->
                    <span v-if="billBackendErrors.orders">
                        <p
                            v-for="(error, index) in billBackendErrors.orders"
                            :key="index"
                            class="form-text text-danger">
                            {{ error }}
                        </p>
                    </span>
                </div>
                <!-- orders control -->
                <div v-else class="col-md-12">

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
                                      :value="order.id"
                                      >
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
                    <!-- backend errors -->
                    <span v-if="billBackendErrors.orders">
                        <p
                            v-for="(error, index) in billBackendErrors.orders"
                            :key="index"
                            class="form-text text-danger">
                            {{ error }}
                        </p>
                    </span>
                </div>

                <!-- check_number control -->
                <div class="col-md-3 mb-2">
                    <label for="check_number">Nro. de Cheque</label>
                    <input
                      type="text"
                      class="form-control"
                      id="check_number"
                      v-model.trim="bill.check_number">
                      <!-- backend errors -->
                      <span v-if="billBackendErrors.check_number">
                        <p
                          v-for="(error, index) in billBackendErrors.check_number"
                          :key="index"
                          class="form-text text-danger">
                            {{ error }}
                        </p>
                      </span>
                </div>

                <!-- charge_aprove control -->
                <div class="col-md-3 mb-2">
                    <label for="charge_aprove">Cargo Aprueba</label>
                    <input
                      type="text"
                      class="form-control"
                      id="charge_aprove"
                      v-model.trim="bill.charge_aprove">
                      <!-- backend errors -->
                      <span v-if="billBackendErrors.charge_aprove">
                        <p
                          v-for="(error, index) in billBackendErrors.charge_aprove"
                          :key="index"
                          class="form-text text-danger">
                            {{ error }}
                        </p>
                      </span>
                </div>

                <!-- charge_check control -->
                <div class="col-md-3 mb-2">
                    <label for="charge_check">Cargo Revisa</label>
                    <input
                      type="text"
                      class="form-control"
                      id="charge_check"
                      v-model.trim="bill.charge_check">
                      <!-- backend errors -->
                      <span v-if="billBackendErrors.charge_check">
                        <p
                          v-for="(error, index) in billBackendErrors.charge_check"
                          :key="index"
                          class="form-text text-danger">
                            {{ error }}
                        </p>
                      </span>
                </div>

                <!-- customer_charge control -->
                <div class="col-md-3 mb-2">
                    <label for="customer_charge">Cargo del Cliente</label>
                    <input
                      type="text"
                      class="form-control"
                      id="customer_charge"
                      v-model.trim="bill.customer_charge">
                      <!-- backend errors -->
                      <span v-if="billBackendErrors.customer_charge">
                        <p
                          v-for="(error, index) in billBackendErrors.customer_charge"
                          :key="index"
                          class="form-text text-danger">
                            {{ error }}
                        </p>
                      </span>
                </div>

                <!-- customer_name control -->
                <div class="col-md-3 mb-2">
                    <label for="customer_name">Nombre del Cliente</label>
                    <input
                        type="text"
                        class="form-control"
                        id="customer_name"
                        v-model.trim="bill.customer_name">
                        <!-- backend errors -->
                        <span v-if="billBackendErrors.customer_name">
                            <p
                            v-for="(error, index) in billBackendErrors.customer_name"
                            :key="index"
                            class="form-text text-danger">
                                {{ error }}
                            </p>
                        </span>
                </div>

                <!-- customer_personal_id control -->
                <div class="col-md-3 mb-2">
                    <label for="customer_personal_id">CI del Cliente</label>
                    <input
                      type="text"
                      class="form-control"
                      id="customer_personal_id"
                      v-model.trim="bill.customer_personal_id">
                      <!-- backend errors -->
                      <span v-if="billBackendErrors.customer_personal_id">
                        <p
                        v-for="(error, index) in billBackendErrors.customer_personal_id"
                        :key="index"
                        class="form-text text-danger">
                            {{ error }}
                        </p>
                    </span>
                </div>

                <!-- checked_by control -->
                <div class="col-md-3 mb-2">
                    <label for="checked_by">Revisado por</label>
                    <input
                        type="text"
                        class="form-control"
                        id="checked_by"
                        v-model.trim="bill.checked_by">
                        <!-- backend errors -->
                        <span v-if="billBackendErrors.checked_by">
                            <p
                            v-for="(error, index) in billBackendErrors.checked_by"
                            :key="index"
                            class="form-text text-danger">
                                {{ error }}
                            </p>
                        </span>
                </div>

                <!-- aproved_by control -->
                <div class="col-md-3 mb-2">
                    <label for="aproved_by">Cargo del Cliente</label>
                    <input
                      type="text"
                      class="form-control"
                      id="aproved_by"
                      v-model.trim="bill.aproved_by">
                      <!-- backend errors -->
                      <span v-if="billBackendErrors.aproved_by">
                        <p
                          v-for="(error, index) in billBackendErrors.aproved_by"
                          :key="index"
                          class="form-text text-danger">
                            {{ error }}
                        </p>
                      </span>
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
import { RouterLink, useRoute, useRouter } from "vue-router";

// core
import { detailBillUpdate, postBill } from "../../services/bill.service";
import { listCustomer } from "../../services/customer.service";
import { getOrdersNotMatched, getOrdersFromCustomerNotMatched, getOrdersFromCustomer } from "../../services/order.service";


const bill = ref({
    customer: '',
    customer_dependency: '',
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

// routes consts
const router = useRouter();
const route = useRoute();



onMounted(async () => {
    // get customers
    const respCustomers = await listCustomer();
    customers.value = respCustomers.data;
    // para eliminar un attributo de un objeto
    // const {...rest, get_orders} = bill.value
    
    const id = route.params.id;
    if (id) {
        const { data } = await detailBillUpdate(id);
        bill.value = data;
        bill.value.orders = bill.value.get_orders.map(item => item.id)
        bill.value.get_orders = (await getOrdersFromCustomer(bill.value.customer)).data;
    } else {
      // get orders to create a bill
      const respOrders = await getOrdersNotMatched();
      orders.value = respOrders.data;
    }
});

const createBill = async (bill) => {
    try {
        const { data } = await postBill(bill);
        router.push({name: 'bills_detail', params: {id: data.id}})
    } catch (error) {
        billBackendErrors.value = error.response.data
    }
}

const ordersFromCustomer = async (event) => {
    try {
        orders.value = (await getOrdersFromCustomerNotMatched(event.target.value)).data;
    } catch (error) {
        console.log(error.response.data);
    }
}

const pushAllOrders = (event) => {
    if (event.target.checked) {
        if (bill.value.id) {
            const ordersPush = bill.value.get_orders.map(item => item.id)
            bill.value.orders = ordersPush
        } else {
            const ordersPush = orders.value.map(item => item.id)
            bill.value.orders = ordersPush
        }
    } else {
        bill.value.orders = []
    }
};

</script>