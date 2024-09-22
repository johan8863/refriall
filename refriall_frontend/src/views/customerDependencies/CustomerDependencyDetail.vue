<script setup>

// vue
import { ref, onMounted } from "vue";
import { useRoute } from "vue-router";

// app
import { detailCustomerDependecy } from '../../services/customerDependency.service';
import listGroup from "../../assets/js/bootstrap_classes/listGroup";

const route = useRoute();
const dependency = ref({
    customer: 0,
    name: '',
    address: '',
    province: '',
    township: '',
});

const billBackendErrors = ref(null);

onMounted(async () => {
    try {
        const response = await detailCustomerDependecy(route.params.id);
        dependency.value = response.data;

        
    } catch (error) {
        console.error('General error', error)
        if (error.response) {
            billBackendErrors.value = `${error.response.data.detail} - ${error.response.status}`
        } else {
            billBackendErrors.value = 'Error inesperado, consulte al desarrollador'
        }
    }
});

</script>

<template>
    <div class="row">
        <!-- side menu -->
        <div class="col-md-2">
            <ul :class="listGroup.listGroup">
                <li :class="listGroup.listGroupItem">
                    <strong>Dependencias</strong>
                </li>
                <li :class="listGroup.listGroupItem">
                    <router-link :to="{name: 'customers'}">Clientes</router-link>
                </li>
                <li :class="listGroup.listGroupItem">
                    <router-link :to="{name: 'customers_detail', params: {id: dependency.customer}}">Cliente</router-link>
                </li>
                <li :class="listGroup.listGroupItem">
                    <router-link :to="{name: 'customer_dependecy_update', params: {id: dependency.id}}">Editar</router-link>
                </li>
                <li :class="listGroup.listGroupItem">
                    <router-link :to="{name: 'customer_dependecy_delete', params: {id: dependency.id}}">Eliminar</router-link>
                </li>
            </ul>
        </div>

        <!-- main content -->
        <div class="col-md-4">
            <!-- backend general errors -->
            <span v-if="billBackendErrors">
                <p
                    class="form-text text-danger">
                    {{ billBackendErrors }}</p>
            </span>

            <h3>{{ dependency.name }}</h3>
            <hr>
            <p>{{ dependency.name }}</p>
            <p>{{ dependency.address }}</p>
            <p>{{ dependency.province }}</p>
            <p>{{ dependency.township }}</p>
            <!-- end notFound false -->
        </div>

        
    </div>
</template>
