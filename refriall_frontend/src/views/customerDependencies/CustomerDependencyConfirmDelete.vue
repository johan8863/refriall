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

const errorMessage = ref(null);


onMounted(async () => {
    try {
        const resp = await detailCustomerDependecy(route.params.id);
        dependency.value = resp.data;
    } catch (error) {
        if (error.response) {
            console.log('Error status:', error.response.status)
            console.log('Error data:', error.response.data)
            if (error.response.status === 404) {
                errorMessage.value = 'Dependencia no encontrada.'
            }            
        } else if (error.request) {
            errorMessage.value = 'Error del Servidor, póngase en contacto con el desarrollador.'
        }
    }
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
        if (error.response) {
            console.log('Error status:', error.response.status)
            console.log('Error data:', error.response.data)
            if (error.response.status === 404) {
                errorMessage.value = 'Dependencia no encontrada.'
            }            
            if (error.response.status === 400) {
                errorMessage.value = 'Dependencia asociada.'
            }
        } else if (error.request) {
            errorMessage.value = 'Error del Servidor, póngase en contacto con el desarrollador.'
        }
    }
}

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
                <li :class="listGroup.listGroupItem">
                    <router-link :to="{name: 'customer_dependecy_update', params: {id: dependency.id}}">Editar</router-link>
                </li>
            </ul>
        </div>

        <!-- main content -->
        <div class="col-md-4">
            <!-- backend general errors -->
            <span v-if="errorMessage">
                <p
                    class="form-text text-danger">
                    {{ errorMessage }}</p>
            </span>
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
