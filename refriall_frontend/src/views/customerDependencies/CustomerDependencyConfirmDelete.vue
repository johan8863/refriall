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
                    <router-link :to="{name: 'customer_dependecy_update', params: {id: dependency.id}}">Editar</router-link>
                </li>
            </ul>
        </div>

        <!-- main content -->
        <div class="col-md-4">
            <p>Está seguro que desea eliminar la dependencia: {{ dependency.name }}?</p>
            <div>
                <button
                  class="btn btn-sm btn-danger"
                  @click="delDependency(dependency.id)">Eliminar</button>
                <RouterLink
                  :to="{name: 'customer_dependecy_detail', params: {id: dependency.id}}"
                  class="btn btn-sm btn-secondary">Cancelar</RouterLink>
            </div>
        </div>

    </div>

</template>

<script setup>

// vue
import { ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";

// app
import { deleteCustomerDependency, detailCustomerDependecy } from "../../services/customerDependency.service";
import listGroup from "../../assets/js/bootstrap_classes/listGroup";

const route = useRoute()
const router = useRouter()
const dependency = ref({
    customer: '',
    name: '',
    address: '',
    province: '',
    township: '',
});

onMounted(async () => {
    const resp = await detailCustomerDependecy(route.params.id);
    dependency.value = resp.data;
});

const delDependency = async (id) => {
    try {
        await deleteCustomerDependency(id);
        router.push({
            name: 'customers_detail',
            params: {
                id: dependency.value.customer
            }
        })
    } catch (error) {
        console.log(error);
    }
}

</script>