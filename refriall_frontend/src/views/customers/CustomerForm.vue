<script setup>
// vue
import { RouterLink, useRouter, useRoute } from "vue-router";
import { ref, onMounted } from 'vue';

// app
import { postCustomer, putCustomer, detailCustomer } from "../../services/customer.service";
import listGroup from "../../assets/js/bootstrap_classes/listGroup";

// third
import { useVuelidate } from "@vuelidate/core";
import { required, helpers } from "@vuelidate/validators";


// customer object to be created or updated
const customer = ref({
    customer_type: 'es',
    name: '',
    address: '',
    province: '',
    township: '',
    code: '',
    client_nit: '',
    bank_account_header: '',
    bank_account: '',
});


// customer object to be created or updated
const customerErrors = ref({
    customer_type: [],
    name: [],
    address: [],
    province: [],
    township: [],
    code: [],
    client_nit: [],
    bank_account_header: [],
    bank_account: [],
});


// router utilities and handlers
const router = useRouter();
const route = useRoute();


const goToCustomers = () => router.push({name: 'customers'})
const goToCustomerDetail = () => router.push({name: 'customers_detail', params: {id: customer.value.id}})
const goBack = () => !customer.value.id ? goToCustomers() : goToCustomerDetail()


// vuelidate rules
const rules = {
    customer_type: {
        required: helpers.withMessage('Seleccione el tipo de cliente.', required)
    },
    name: {
        required: helpers.withMessage('El nombre es requerido.', required)
    },
    address: {
        required: helpers.withMessage('La dirección es requerida.', required)
    },
    province: {
        required: helpers.withMessage('La provincia es requerida.', required)
    },
    township: {
        required: helpers.withMessage('El municipio es requerido.', required)
    },
    code: {
        required: helpers.withMessage('El código es requerido.', required)
    },
    bank_account_header: {
        required: helpers.withMessage('El titular de la cuenta es requerido.', required)
    },
    bank_account: {
        required: helpers.withMessage('La cuenta bancaria es requerida.', required)
    },
}


// vuelidate object
const v$ = useVuelidate(rules, customer);

// create customer function
const createCustomer = async (customer) => {
    try {
        if (await v$.value.$validate()) {
            // if front validations run, insert a customer 
            // and redirect to its detail view
            const { data } = await postCustomer(customer);
            router.push({name: 'customers_detail', params: {id: data.id}});
        }
    } catch (error) {
        // in case of backend exceptions, fill the corresponding ones in the 
        // customerErrors object
        console.error('General error', error)
        if (error.response) {
            customerErrors.value = error.response.data
        } else {
            customerErrors.value = { message: 'Error inesperado, consulte al desarrollador' }
        }
    }
};


// update customer function
const updateCustomer = async (customer) => {
    try {
        if (await v$.value.$validate()) {
            // if front validations run, update a customer 
            // and redirect to its detail view
            const { data } = await putCustomer(customer);
            router.push({name: 'customers_detail', params: {id: data.id}});
        }
    } catch (error) {
        // in case of backend exceptions, fill the corresponding ones in the 
        // customerErrors object
        console.error('General error', error)
        if (error.response) {
            customerErrors.value = error.response.data
        } else {
            customerErrors.value = { message: 'Error inesperado, consulte al desarrollador' }
        }
    }
};


// onMounted cycle to get the customer object 
// if editing intended
onMounted(async () => {
    const id = route.params.id;
    if (id) {
        const { data } = await detailCustomer(id);
        customer.value = data;
    }
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
                    <router-link :to="{name: 'customers'}">Clientes</router-link>
                </li>
            </ul>
        </div>

        <!-- main content -->
        <div class="col-md-4">
            <!-- form -->
            <!-- backend errors from non_field_errors dictionary -->
            <span v-if="customerErrors.non_field_errors">
                    <p
                      class="form-text text-danger"
                      v-for="(error, index) in customerErrors.non_field_errors"
                      :key="index">
                      {{ error }}</p>
                </span>
                <!-- backend general errors -->
                <span v-if="customerErrors.message">
                    <p
                      class="form-text text-danger">
                      {{ customerErrors.message }}</p>
                </span>
            <form @submit.prevent="!customer.id ? createCustomer(customer) : updateCustomer(customer)">
                <!-- customer_type control -->
                <div class="mb-2">
                    <label for="customer_type" class="form-label">Tipo</label>
                    <select
                      autofocus
                      id="customer_type"
                      class="form-select"
                      v-model.trim="customer.customer_type"
                      @blur="v$.customer_type.$touch">
                        <option value="es">ESTATAL</option>
                        <option value="pr">PARTICULAR</option>
                    </select>
                    <span v-if="v$.customer_type.$error">
                        <p
                          class="form-text text-danger"
                          v-for="error in v$.customer_type.$errors"
                          :key="error.$uid">{{ error.$message }}</p>
                    </span>
                    <span v-if="customerErrors.customer_type">
                        <p
                          class="form-text text-danger"
                          v-for="(error, i) in customerErrors.customer_type"
                          :key="i">{{ error }}</p>
                    </span>
                </div>
                <!-- name control -->
                <div class="mb-2">
                    <label for="name" class="form-label">Nombre</label>
                    <input
                      type="text"
                      id="name"
                      class="form-control"
                      v-model.trim="customer.name"
                      @blur="v$.name.$touch">
                    <span v-if="v$.name.$error">
                        <p
                          class="form-text text-danger"
                          v-for="error in v$.name.$errors"
                          :key="error.$uid">{{ error.$message }}</p>
                    </span>
                    <span v-if="customerErrors.name">
                        <p
                          class="form-text text-danger"
                          v-for="(error, i) in customerErrors.name"
                          :key="i">{{ error }}</p>
                    </span>
                </div>
                <!-- address control -->
                <div class="mb-2">
                    <label for="address" class="form-label">Dirección</label>
                    <textarea
                      class="form-control"
                      id="address"
                      cols="30"
                      rows="10"
                      v-model.trim="customer.address"
                      @blur="v$.address.$touch">
                    </textarea>
                    <span v-if="v$.address.$error">
                        <p
                          class="form-text text-danger"
                          v-for="error in v$.address.$errors"
                          :key="error.$uid">{{ error.$message }}</p>
                    </span>
                    <span v-if="customerErrors.address">
                        <p
                          class="form-text text-danger"
                          v-for="(error, i) in customerErrors.address"
                          :key="i">{{ error }}</p>
                    </span>
                </div>
                <!-- province control -->
                <div class="mb-2">
                    <label for="province" class="form-label">Provincia</label>
                    <input
                      type="text"
                      id="province"
                      class="form-control"
                      v-model.trim="customer.province"
                      @blur="v$.province.$touch">
                    <span v-if="v$.province.$error">
                        <p
                          class="form-text text-danger"
                          v-for="error in v$.province.$errors"
                          :key="error.$uid">{{ error.$message }}</p>
                    </span>
                    <span v-if="customerErrors.province">
                        <p
                          class="form-text text-danger"
                          v-for="(error, i) in customerErrors.province"
                          :key="i">{{ error }}</p>
                    </span>
                </div>
                <!-- township control -->
                <div class="mb-2">
                    <label for="township" class="form-label">Municipio</label>
                    <input
                      type="text"
                      id="township"
                      class="form-control"
                      v-model.trim="customer.township"
                      @blur="v$.township.$touch">
                    <span v-if="v$.township.$error">
                        <p
                          class="form-text text-danger"
                          v-for="error in v$.township.$errors"
                          :key="error.$uid">{{ error.$message }}</p>
                    </span>
                    <span v-if="customerErrors.township">
                        <p
                          class="form-text text-danger"
                          v-for="(error, i) in customerErrors.township"
                          :key="i">{{ error }}</p>
                    </span>
                </div>
                <!-- code control -->
                <div class="mb-2">
                    <label for="code" class="form-label">Código</label>
                    <input
                      type="text"
                      id="code"
                      class="form-control"
                      v-model.trim="customer.code"
                      @blur="v$.code.$touch">
                    <span v-if="v$.code.$error">
                        <p
                          class="form-text text-danger"
                          v-for="error in v$.code.$errors"
                          :key="error.$uid">{{ error.$message }}</p>
                    </span>
                    <span v-if="customerErrors.code">
                        <p
                          class="form-text text-danger"
                          v-for="(error, i) in customerErrors.code"
                          :key="i">{{ error }}</p>
                    </span>
                </div>
                <!-- client_nit control -->
                <div class="mb-2">
                    <label for="client_nit" class="form-label">Código NIT</label>
                    <input
                      type="text"
                      id="client_nit"
                      class="form-control"
                      v-model.trim="customer.client_nit">
                </div>
                <!-- bank_account_header control -->
                <div class="mb-2">
                    <label for="bank_account_header" class="form-label">Titular de la Cuenta</label>
                    <input
                      type="text"
                      id="bank_account_header"
                      class="form-control"
                      v-model.trim="customer.bank_account_header"
                      @blur="v$.bank_account_header.$touch">
                    <span v-if="v$.bank_account_header.$error">
                        <p
                          class="form-text text-danger"
                          v-for="error in v$.bank_account_header.$errors"
                          :key="error.$uid">{{ error.$message }}</p>
                    </span>
                    <span v-if="customerErrors.bank_account_header">
                        <p
                          class="form-text text-danger"
                          v-for="(error, i) in customerErrors.bank_account_header"
                          :key="i">{{ error }}</p>
                    </span>
                </div>
                <!-- bank_account control -->
                <div class="mb-2">
                    <label for="bank_account" class="form-label">Nro. de Cuenta</label>
                    <input
                      type="text"
                      id="bank_account"
                      class="form-control"
                      v-model.trim="customer.bank_account"
                      @blur="v$.bank_account.$touch">
                    <span v-if="v$.bank_account.$error">
                        <p
                          class="form-text text-danger"
                          v-for="error in v$.bank_account.$errors"
                          :key="error.$uid">{{ error.$message }}</p>
                    </span>
                    <span v-if="customerErrors.bank_account">
                        <p
                          class="form-text text-danger"
                          v-for="(error, i) in customerErrors.bank_account"
                          :key="i">{{ error }}</p>
                    </span>
                </div>
                <!-- buttons -->
                <div>
                    <!-- 
                        the order in the ternary operator is due to the fact that 
                        this form is more often used to create than to update 
                    -->
                    <button
                      type="submit"
                      class="btn btn-sm btn-primary">
                        {{ !customer.id ? 'Guardar' : 'Actualizar' }}
                    </button>
                    <button
                      type="button"
                      class="btn btn-sm btn-secondary"
                      @click="goBack">Cancelar</button>
                </div>
            </form>
        </div>

    </div> <!-- end row -->

</template>
