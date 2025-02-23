<script setup>
// vue
import { onMounted, ref } from 'vue';
import { RouterLink, useRoute, useRouter } from "vue-router";

// third
import { useVuelidate } from "@vuelidate/core";
import { helpers, required } from '@vuelidate/validators';

// app
import { detailBillUpdate, postBill, putBill } from "../../services/bill.service";
import { listCustomerOrdersNoBill } from "../../services/customer.service";
import { getOrdersFromCustomerNotMatched } from "../../services/order.service";
import listGroup from '../../assets/js/bootstrap_classes/listGroup';
import { listCurrencies } from '../../services/currency.service';


const bill = ref({
    customer: '',
    currency: '',
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
    currency: '',
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
const currencies = ref([]);


// routes utilities and handlers
const router = useRouter();
const route = useRoute();

const goToBills = () => router.push({name: 'bills'})
const goToBillDetail = () => router.push({name: 'bills_detail', params: {id: bill.value.id}})
const goBack = () => !bill.value.id ? goToBills() : goToBillDetail()

// custom rules
const atLeastOneOrder = () => bill.value.orders.length > 0

// vuelidate rules
const rules = {
    customer: {
        required: helpers.withMessage('El cliente es requerido.', required)
    },
    currency: {
        required: helpers.withMessage('La moneda es requerida.', required)
    },
    folio: {
        required: helpers.withMessage('El folio es requerido.', required)
    },
    orders: {
        atLeastOneOrder: helpers.withMessage('Tiene que seleccionar al menos una orden.', atLeastOneOrder)
    },
    provider_signature_date: {
        required: helpers.withMessage('La firma del prestador es requerida.', required)
    },
    customer_signature_date: {
        required: helpers.withMessage('La firma del cliente es requerida.', required)
    },
}

// vuelidate object
const v$ = useVuelidate(rules, bill);


const createBill = async (bill) => {
    try {
        if (await v$.value.$validate()) {
            const { data } = await postBill(bill);
            router.push({name: 'bills_detail', params: {id: data.id}})
        }
    } catch (error) {
        console.error('General error', error)
        if (error.response) {
            billBackendErrors.value = error.response.data
        } else {
            billBackendErrors.value = { message: 'Error inesperado, consulte al desarrollador' }
        }
    }
}


const updateBill = async (bill) => {
    try {
        if (await v$.value.$validate()) {
            const { data } = await putBill(bill);
            router.push({name: 'bills_detail', params: {id: data.id}})
        }
    } catch (error) {
        console.error('General error', error)
        if (error.response) {
            billBackendErrors.value = error.response.data
        } else {
            billBackendErrors.value = { message: 'Error inesperado, consulte al desarrollador' }
        }
    }
}

const chargeCustomersNoBill = async () => {
    bill.value.customer = ""
    orders.value = []
    const respCustomers = await listCustomerOrdersNoBill(bill.value.currency);
    customers.value = respCustomers.data;

}

const ordersFromCustomer = async () => {
    try {
        if (bill.value.currency && bill.value.customer) {
            orders.value = (await getOrdersFromCustomerNotMatched(bill.value.customer, bill.value.currency)).data;
        } else {
            orders.value = []
        }
    } catch (error) {
        console.error('General erro', error)
        if (error.response) {
            billBackendErrors.value = error.response.data
        } else {
            billBackendErrors.value = { message: 'Error inesperado, consulte al desarrollador' }
        }
        console.log(billBackendErrors.value)
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


onMounted(async () => {
    // get currencies
    const respCurrencies = await listCurrencies();
    currencies.value = respCurrencies.data;
    
    const id = route.params.id;
    if (id) {
        const { data } = await detailBillUpdate(id);
        bill.value = data;
        bill.value.orders = bill.value.get_orders.map(item => item.id)
        // get the orders that havent been related to a bill yet and display them to be selected
        const ordersNotMatched = (await getOrdersFromCustomerNotMatched(bill.value.customer, bill.value.currency)).data;
        bill.value.get_orders.push(...ordersNotMatched);
    } 
});

</script>

<template>
    <div class="row">

        <!-- side menu -->
        <div class="col-md-2">
            <ul :class="listGroup">
                <li :class="listGroup.listGroupItem">
                    <strong>Facturas</strong>
                </li>
                <li :class="listGroup.listGroupItem">
                    <router-link :to="{name: 'bills'}">Facturas</router-link>
                </li>
            </ul>
        </div>

        <!-- main content -->
        <div class="col-md-9">
            <template v-if="bill.currency && customers.length === 0">
                <span class="text-danger">No hay órdenes libres para asociar.</span>
            </template>

            <!-- form -->
            <form @submit.prevent="!bill.id ? createBill(bill) : updateBill(bill)" class="row">
                <!-- backend errors from non_field_errors dictionary -->
                <span v-if="billBackendErrors.non_field_errors">
                    <p
                      class="form-text text-danger"
                      v-for="(error, index) in billBackendErrors.non_field_errors"
                      :key="index">
                      {{ error }}</p>
                </span>
                <!-- backend general errors -->
                <span v-if="billBackendErrors.message">
                    <p
                      class="form-text text-danger">
                      {{ billBackendErrors.message }}</p>
                </span>

                <!-- currency control -->
                <div class="col-md-3 mb-2">
                    <label for="currency">Moneda</label>
                    <select
                      name="currency"
                      id="currency"
                      class="form-select"
                      autofocus
                      @change="chargeCustomersNoBill"
                      v-model="bill.currency"
                      @blur="v$.currency.$touch">
                      <option
                        v-for="currency in currencies"
                        :key="currency.id"
                        :value="currency.id">{{ currency.name }}</option>
                    </select>
                    <!-- frontend validations -->
                    <p
                      class="form-text text-danger"
                      v-for="error in v$.currency.$errors"
                      :key="error.$uid">
                        {{ error.$message }}
                    </p>
                    <!-- backend validations -->
                    <span v-if="billBackendErrors.currency">
                        <p
                          class="form-text text-danger"
                          v-for="error in billBackendErrors.currency">
                            {{ error }}
                        </p>
                    </span>
                </div>

                <!-- customer control -->
                <div class="col-md-3 mb-2">
                    <label for="customer">Cliente</label>
                    <select
                      name="customer"
                      id="customer"
                      class="form-select"
                      :disabled="!bill.currency || (bill.currency && customers.length === 0)"
                      @change="ordersFromCustomer"
                      v-model="bill.customer">
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
                      v-model.trim="bill.folio"
                      @blur="v$.folio.$touch">

                    <!-- frontend validations -->
                    <p
                        class="form-text text-danger"
                        v-for="error in v$.folio.$errors"
                        :key="error.$uid">{{ error.$message }}</p>

                      <!-- backend validations -->
                      <span v-if="billBackendErrors.folio">
                        <p
                          v-for="(error, index) in billBackendErrors.folio"
                          :key="index"
                          class="form-text text-danger">
                            {{ error }}
                        </p>
                      </span>
                </div>
                <div class="col-md-3 mb-2"></div>

                <!-- provider_signature_date control -->
                <div class="col-md-3 mb-2">
                    <label for="provider_signature_date">Firma del Prestador</label>
                    <input
                      type="date"
                      name="provider_signature_date"
                      id="provider_signature_date"
                      class="form-control"
                      :disabled="bill.id"
                      v-model.trim="bill.provider_signature_date"
                      @blur="v$.provider_signature_date.$touch">

                    <!-- frontend validations -->
                    <p
                      class="form-text text-danger"
                      v-for="error in v$.provider_signature_date.$errors"
                      :key="error.$uid">{{ error.$message }}</p>

                    <!-- backend validations -->
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
                      v-model.trim="bill.customer_signature_date"
                      @blur="v$.customer_signature_date.$touch">

                    <!-- frontend validations -->
                    <p
                      class="form-text text-danger"
                      v-for="error in v$.customer_signature_date.$errors"
                      :key="error.$uid">{{ error.$message }}</p>

                    <!-- backend validations -->
                    <span v-if="billBackendErrors.customer_signature_date">
                    <p
                        v-for="(error, index) in billBackendErrors.customer_signature_date"
                        :key="index"
                        class="form-text text-danger">
                        {{ error }}
                    </p>
                    </span>
                </div>

                <!-- orders control update -->
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
                                      @change="pushAllOrders">
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
                                <td>
                                    <router-link
                                      :to="{ name: 'orders_detail', params: { id: order.id } }"
                                      target="_blank">{{ order.folio }}</router-link>
                                </td>
                                <td v-if="order.customer">{{ order.customer.name }}</td>
                                <td v-else>-</td>
                                <td v-if="order.customer_dependency">{{ order.customer_dependency.name }}</td>
                                <td v-else>-</td>
                                <td>{{ order.get_total_amount }}</td>
                            </tr>
                        </tbody>

                    </table>
                    <!-- backend validations -->
                    <span v-if="billBackendErrors.orders">
                        <p
                            v-for="(error, index) in billBackendErrors.orders"
                            :key="index"
                            class="form-text text-danger">
                            {{ error }}
                        </p>
                    </span>
                </div>

                <!-- orders control create -->
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
                                <td><router-link
                                      :to="{ name: 'orders_detail', params: { id: order.id } }"
                                      target="_blank">{{ order.folio }}</router-link></td>
                                <td v-if="order.customer">{{ order.customer.name }}</td>
                                <td v-else>-</td>
                                <td v-if="order.customer_dependency">{{ order.customer_dependency.name }}</td>
                                <td v-else>-</td>
                                <td>{{ order.get_total_amount }}</td>
                            </tr>
                        </tbody>

                    </table>
                    <!-- backend validations -->
                    <span v-if="billBackendErrors.orders">
                        <p
                            v-for="(error, index) in billBackendErrors.orders"
                            :key="index"
                            class="form-text text-danger">
                            {{ error }}
                        </p>
                    </span>
                </div>
                <!-- frontend validations -->
                <span v-if="bill.customer">
                    <p class="form-text text-danger" v-for="error in v$.orders.$errors" :key="error.$uid">
                        {{ error.$message }}
                    </p>
                </span>
                <!-- check_number control -->
                <div class="col-md-3 mb-2">
                    <label for="check_number">Nro. de Cheque</label>
                    <input
                      type="text"
                      class="form-control"
                      id="check_number"
                      v-model.trim="bill.check_number">
                      <!-- backend validations -->
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
                      <!-- backend validations -->
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
                      <!-- backend validations -->
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
                      <!-- backend validations -->
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
                        <!-- backend validations -->
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
                      <!-- backend validations -->
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
                        <!-- backend validations -->
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
                      <!-- backend validations -->
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
                    <!-- 
                        the order in the ternary operator is due to the fact that 
                        this form is more often used to create than to update 
                    -->
                    <button
                      type="submit"
                      class="btn btn-sm btn-primary">
                        {{ !bill.id? 'Guardar' : 'Actualizar' }}
                    </button>
                    <button
                      type="button"
                      class="btn btn-sm btn-secondary"
                      @click="goBack">Cancelar</button>
                    
                </div>
            <!-- end form -->
            </form>
        <!-- end main content -->
        </div>

    </div>
</template>
