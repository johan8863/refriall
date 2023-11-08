<template>

    <div class="row">
        <!-- side menu -->
        <div class="col-md-2">
            <ul class="list-group list-group-flush">
                <li class="list-group-item">
                    <strong>Clientes</strong>
                </li>
                <li class="list-group-item">
                    <router-link :to="{name: 'customers'}">Clientes</router-link>
                </li>
            </ul>
        </div>

        <!-- main content -->
        <div class="col-md-4">
            <!-- form -->
            <form method="post" @submit.prevent>
                <!-- customer_type control -->
                <div class="mb-2">
                    <label for="" class="form-label">Tipo</label>
                    <select
                      id="customer_type"
                      class="form-select"
                      v-model.trim="customer.customer_type">
                        <option value="es">ESTATAL</option>
                        <option value="pr">PARTICULAR</option>
                    </select>
                </div>
                <!-- name control -->
                <div class="mb-2">
                    <label for="name" class="form-label">Nombre</label>
                    <input
                      type="text"
                      id="name"
                      class="form-control"
                      v-model.trim="customer.name">
                </div>
                <!-- address control -->
                <div class="mb-2">
                    <label for="address" class="form-label">Dirección</label>
                    <textarea
                      class="form-control"
                      id="address"
                      cols="30"
                      rows="10"
                      v-model.trim="customer.address"></textarea>
                </div>
                <!-- province control -->
                <div class="mb-2">
                    <label for="province" class="form-label">Provincia</label>
                    <input
                      type="text"
                      id="province"
                      class="form-control"
                      v-model.trim="customer.province">
                </div>
                <!-- township control -->
                <div class="mb-2">
                    <label for="township" class="form-label">Municipio</label>
                    <input
                      type="text"
                      id="township"
                      class="form-control"
                      v-model.trim="customer.township">
                </div>
                <!-- code control -->
                <div class="mb-2">
                    <label for="code" class="form-label">Código</label>
                    <input
                      type="text"
                      id="code"
                      class="form-control"
                      v-model.trim="customer.code">
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
                      v-model.trim="customer.bank_account_header">
                </div>
                <!-- bank_account control -->
                <div class="mb-2">
                    <label for="bank_account" class="form-label">Nro. de Cuenta</label>
                    <input
                      type="text"
                      id="bank_account"
                      class="form-control"
                      v-model.trim="customer.bank_account">
                </div>
                <!-- buttons -->
                <div>
                    <button
                      class="btn btn-sm btn-primary"
                      @click="createCustomer(customer)">Guardar</button>
                    <a href="#" class="btn btn-sm btn-secondary">Cancelar</a>
                </div>
            </form>
        </div>

    </div> <!-- end row -->

</template>

<script setup>

import { RouterLink, useRouter, useRoute } from "vue-router";
import { ref, onMounted } from 'vue';
import { postCustomer, putCustomer, detailCustomer } from "../../services/customer.service";

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
const router = useRouter();
const route = useRoute();

const createCustomer = async (customer) => {
    const { data } = await postCustomer(customer);
    router.push({name: 'customers_detail', params: {id: data.id}});
};


onMounted(async () => {
    const id = route.params.id;
    if (id) {
        const { data } = await detailCustomer(id);
        customer.value = data;
    }
});

</script>

