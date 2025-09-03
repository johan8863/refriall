<script setup>
// vue
import { ref, onMounted, computed } from "vue";
import { RouterLink, useRoute } from "vue-router";

// app
import { detailCustomer } from "../../services/customer.service";
import { searchCustomerDependencies } from "../../services/customerDependency.service";
import listGroup from "../../assets/js/bootstrap_classes/listGroup";

const route = useRoute();
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
    get_dependencies: [],
});
const billBackendErrors = ref(null);
const isLoading = ref(false);

// search variables for dependencies
const hasSearchedDependencies = ref(false);
const searchDependencyTerm = ref('');

const filteredDependencies = computed(() => {
    if (!searchDependencyTerm.value.trim() || !hasSearchedDependencies.value) {
        return customer.value.get_dependencies;
    }
    
    const term = searchDependencyTerm.value.toLowerCase();
    return customer.value.get_dependencies.filter(dependency => 
        dependency.name.toLowerCase().includes(term)
    );
});

const handleDependencySearch = () => {
    if (searchDependencyTerm.value.trim()) {
        hasSearchedDependencies.value = true;
    }
};

const clearDependencySearch = () => {
    searchDependencyTerm.value = '';
    hasSearchedDependencies.value = false;
};

onMounted(async () => {
    isLoading.value = true;
    try {
        const resp = await detailCustomer(route.params.id);
        customer.value = resp.data;
    } catch (error) {
        if (error.response) {
            billBackendErrors.value = `${error.response.data.detail} - ${error.response.status}`;
        } else {
            billBackendErrors.value = 'Error inesperado, consulte al desarrollador';
        }
    } finally {
        isLoading.value = false;
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
                    <RouterLink :to="{name: 'customers'}">Clientes</RouterLink>
                </li>
                <li :class="listGroup.listGroupItem">
                    <RouterLink :to="{name: 'customers_create'}">Nuevo</RouterLink>
                </li>
                <li :class="listGroup.listGroupItem">
                    <RouterLink :to="{name: 'customers_update', params: {id: customer.id}}">Editar</RouterLink>
                </li>
                <li :class="listGroup.listGroupItem">
                    <RouterLink :to="{name: 'customer_dependecy_create', params: {id: customer.id}}">Nueva dependencia</RouterLink>
                </li>
                <li :class="listGroup.listGroupItem">
                    <RouterLink :to="{name: 'customers_confirm_delete', params: {id: customer.id}}">Eliminar</RouterLink>
                </li>
            </ul>
        </div>

        <!-- main content -->
        <div class="col-md-4">
            <!-- backend general errors -->
            <span v-if="billBackendErrors">
                <p class="form-text text-danger">{{ billBackendErrors }}</p>
            </span>
            
            <div v-if="isLoading" class="text-center">
                <div class="spinner-border text-primary" role="status">
                    <span class="visually-hidden">Cargando...</span>
                </div>
            </div>

            <div v-else>
                <h3>{{ customer.name }}</h3>
                <hr>
                <p><strong>Dirección:</strong> {{ customer.address }}</p>
                <p><strong>Provincia:</strong> {{ customer.province }}</p>
                <p><strong>Municipio:</strong> {{ customer.township }}</p>
                <p><strong>Tipo:</strong> {{ customer.customer_type === 'es' ? 'ESTATAL' : 'PARTICULAR' }}</p>
                <p><strong>Código:</strong> {{ customer.code }}</p>
                <p><strong>NIT:</strong> {{ customer.client_nit || 'No especificado' }}</p>
                <p><strong>Titular de la cuenta:</strong> {{ customer.bank_account_header }}</p>
                <p><strong>Cuenta bancaria:</strong> {{ customer.bank_account }}</p>
            </div>
        </div>

        <div class="col-md-6">
            <h3>Dependencias</h3>
            <hr>
            
            <!-- Search for dependencies -->
            <div class="row g-2 align-items-center mb-2">
                <div class="col-auto">
                    <label class="col-form-label">Buscar dependencia:</label>
                </div>
                <div class="col-auto">
                    <input 
                        type="search" 
                        class="form-control form-control-sm" 
                        v-model="searchDependencyTerm"
                        placeholder="Nombre de dependencia..."
                        @keyup.enter="handleDependencySearch"
                    >
                </div>
                <div class="col-auto">
                    <button 
                        type="button" 
                        class="btn btn-primary btn-sm"
                        @click="handleDependencySearch"
                    >
                        Buscar
                    </button>
                    <button 
                        type="button" 
                        @click="clearDependencySearch" 
                        class="btn btn-secondary btn-sm ms-1"
                        v-if="hasSearchedDependencies"
                    >
                        Limpiar
                    </button>
                </div>
            </div>

            <!-- Dependencies list -->
            <div v-if="filteredDependencies.length > 0">
                <div class="list-group">
                    <RouterLink 
                        v-for="dependency in filteredDependencies" 
                        :key="dependency.id"
                        :to="{name: 'customer_dependecy_detail', params: {id: dependency.id}}"
                        class="list-group-item list-group-item-action"
                    >
                        <strong>{{ dependency.name }}</strong>
                        <br>
                        <small class="text-muted">
                            {{ dependency.address }}, {{ dependency.township }}, {{ dependency.province }}
                        </small>
                    </RouterLink>
                </div>
            </div>

            <div v-else class="text-center mt-3">
                <p class="text-muted">
                    {{ hasSearchedDependencies ? 'No se encontraron dependencias' : 'No hay dependencias registradas' }}
                </p>
            </div>
        </div>
    </div>
</template>

<style scoped>
.list-group-item {
    border-left: none;
    border-right: none;
}
.list-group-item:first-child {
    border-top: none;
}
.list-group-item:last-child {
    border-bottom: none;
}
</style>