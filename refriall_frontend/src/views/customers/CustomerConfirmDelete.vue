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
                <li :class="listGroup.listGroupItem">
                    <router-link :to="{name: 'customers_update', params: {id: customer.id}}">Editar</router-link>
                </li>
                <li :class="listGroup.listGroupItem">
                    <router-link :to="{name: 'customers_confirm_delete', params: {id: customer.id}}">Eliminar</router-link>
                </li>
            </ul>
        </div>

        <!-- main content -->
        <div class="col-md-4">
            <p>Está seguro que desea eliminar el cliente: {{ customer.name }}?</p>
            <div>
                <button
                  class="btn btn-sm btn-danger"
                  @click="delCustomer(customer.id)">Eliminar</button>
                <RouterLink
                  :to="{name: 'customers'}"
                  class="btn btn-sm btn-secondary">Cancelar</RouterLink>
            </div>
        </div>

    </div> <!-- end row -->

</template>

<script setup>

// vue
import { ref, onMounted } from "vue";
import { RouterLink, useRoute, useRouter } from "vue-router";

// app
import { deleteCustomer, detailCustomer } from "../../services/customer.service";
import listGroup from "../../assets/js/bootstrap_classes/listGroup";

// customer object to be filled
const customer = ref({
    customer_type: '',
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

onMounted(async () => {
    const resp = await detailCustomer(route.params.id);
    customer.value = resp.data;
});

const delCustomer = async (id) => {
    try {
        await deleteCustomer(id);
        router.push({name: 'customers'});
    } catch (error) {
        console.log(error.response.data);
    }
};

</script>

<style lang="scss" scoped>

</style>