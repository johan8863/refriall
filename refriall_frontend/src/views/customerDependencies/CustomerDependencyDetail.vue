<script setup>

// vue
import { ref, onMounted } from "vue";
import { useRoute } from "vue-router";

// app
import { customerDependecyService } from '../../services/customerDependencyService';
import listGroup from "../../assets/js/bootstrap_classes/listGroup";
import { errorHandler } from "../../utils/errors/errorHandler";

const route = useRoute();
const dependency = ref({
    customer: 0,
    name: '',
    address: '',
    province: '',
    township: '',
});

const customerDependencyBackendErrors = ref(null);

// loading state
const isLoading = ref(false)

onMounted(async () => {
    try {
        // start loading state
        isLoading.value = true
        // get dependecy data
        const response = await customerDependecyService.detailCustomerDependecy(route.params.id);
        dependency.value = response.data;
    } catch (error) {
        console.error('General error', error)
        errorHandler(error, customerDependencyBackendErrors, 'Dependencia')
    } finally {
        // stop loading state
        isLoading.value = false
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

        <!-- loading dependency data -->
        <div v-if="isLoading" class="col-md-4">
            <div class="d-flex justify-content-center align-items-center" style="min-height: 200px">
                <span role="status" class="text-primary">Cargando datos... </span>
                <span class="spinner-border spinner-border-sm text-primary" aria-hidden="true"></span>
            </div>
        </div>
        <!-- displaying dependency data -->
        <div v-else class="col-md-4">
            <!-- backend general errors -->
            <span v-if="customerDependencyBackendErrors">
                <p
                    class="form-text text-danger">
                    {{ customerDependencyBackendErrors }}</p>
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
