<script setup>
// vue
import { ref, onMounted } from "vue";
import { RouterLink } from "vue-router";

// app
import { listCustomer, searchCustomers } from "../../services/customer.service";
import listGroup from "../../assets/js/bootstrap_classes/listGroup";

const customers = ref([]);
const currentPage = ref(1);
const showNextButton = ref(false);
const showPrevButton = ref(false);
const customerBackendErrors = ref(null);
const isLoading = ref(false);

// search variables
const hasSearched = ref(false);
const searchTerm = ref('');

const getCustomers = async (page = 1) => {
    isLoading.value = true;
    try {
        const resp = await listCustomer(page);
        const data = resp.data;
        
        showNextButton.value = !!data.next;
        showPrevButton.value = !!data.previous;
        customers.value = data.results;
        customerBackendErrors.value = null;
    } catch (error) {
        handleError(error);
    } finally {
        isLoading.value = false;
    }
};

const handleSearch = async () => {
    if (!searchTerm.value.trim()) {
        await getCustomers(1);
        hasSearched.value = false;
        return;
    }

    isLoading.value = true;
    hasSearched.value = true;
    
    try {
        const resp = await searchCustomers(searchTerm.value);
        const data = resp.data;
        
        customers.value = data.results;
        showNextButton.value = !!data.next;
        showPrevButton.value = !!data.previous;
        customerBackendErrors.value = null;
        
    } catch (error) {
        handleError(error);
    } finally {
        isLoading.value = false;
    }
};

const clearSearch = async () => {
    searchTerm.value = '';
    hasSearched.value = false;
    await getCustomers(1);
};

const loadNextItems = async () => {
    currentPage.value += 1;
    if (hasSearched.value) {
        await searchCustomers(searchTerm.value, currentPage.value);
    } else {
        await getCustomers(currentPage.value);
    }
};

const loadPrevItems = async () => {
    currentPage.value -= 1;
    if (hasSearched.value) {
        await searchCustomers(searchTerm.value, currentPage.value);
    } else {
        await getCustomers(currentPage.value);
    }
};

const handleError = (error) => {
    console.error('Error', error);
    if (error.response) {
        customerBackendErrors.value = `${error.response.data.detail || error.response.data} - ${error.response.status}`;
    } else {
        customerBackendErrors.value = 'Error inesperado, consulte al desarrollador';
    }
};

onMounted(async () => {
    await getCustomers(1);
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
                    <RouterLink :to="{name: 'customers_create'}">Nuevo</RouterLink>
                </li>
            </ul>
        </div>
        
        <!-- main content -->
        <div class="col-md-10">
            <div class="row">
                <div class="col-md-12 mt-1">
                    <form class="row g-2 align-items-center" @submit.prevent="handleSearch">
                        <div class="col-auto">
                            <label for="searchCustomerText" class="col-form-label">Búsqueda:</label>
                        </div>
                        <div class="col-auto">
                            <input 
                                type="search" 
                                class="form-control" 
                                id="searchCustomerText" 
                                v-model="searchTerm"
                                placeholder="Nombre del cliente..."
                                :disabled="isLoading"
                                @keyup.enter="handleSearch"
                            >
                        </div>
                        <div class="col-auto">
                            <button 
                                type="submit" 
                                class="btn btn-primary"
                                :disabled="isLoading || !searchTerm.trim()"
                            >
                                <span v-if="isLoading" class="spinner-border spinner-border-sm me-1"></span>
                                Buscar
                            </button>
                            <button 
                                type="button" 
                                @click="clearSearch" 
                                class="btn btn-secondary ms-1"
                                :disabled="isLoading"
                                v-if="hasSearched"
                            >
                                Limpiar
                            </button>
                        </div>
                    </form>
                    
                    <!-- Indicador de búsqueda -->
                    <small class="text-muted" v-if="hasSearched && searchTerm">
                        🔍 Mostrando resultados para: "{{ searchTerm }}"
                    </small>
                </div>

                <div class="col-md-12">
                    <!-- Loading state -->
                    <div v-if="isLoading" class="text-center my-2">
                        <div class="spinner-border text-primary" role="status">
                            <span class="visually-hidden">Cargando...</span>
                        </div>
                        <p class="mt-1">Buscando clientes...</p>
                    </div>

                    <!-- backend errors -->
                    <div v-else-if="customerBackendErrors" class="alert alert-danger mt-2">
                        {{ customerBackendErrors }}
                    </div>

                    <!-- Results -->
                    <div v-else-if="customers.length > 0" class="mt-2">
                        <table class="table table-striped table-hover mb-1">
                            <thead class="table-dark">
                                <tr>
                                    <th scope="col">Nombre del Cliente</th>
                                    <th scope="col">Tipo</th>
                                    <th scope="col">Provincia</th>
                                    <th scope="col">Municipio</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="customer in customers" :key="customer.id">
                                    <td>
                                        <RouterLink :to="{name: 'customers_detail', params: {id: customer.id}}">
                                            {{ customer.name }}
                                        </RouterLink>
                                    </td>
                                    <td>{{ customer.customer_type === 'es' ? 'ESTATAL' : 'PARTICULAR' }}</td>
                                    <td>{{ customer.province }}</td>
                                    <td>{{ customer.township }}</td>
                                </tr>
                            </tbody>
                        </table>

                        <!-- Paginación -->
                        <div class="d-flex justify-content-between align-items-center mt-2">
                            <button
                                v-if="showPrevButton"
                                class="btn btn-outline-primary btn-sm"
                                @click="loadPrevItems"
                                :disabled="isLoading"
                            >
                                ← Anterior
                            </button>
                            <span class="text-muted">Página {{ currentPage }}</span>
                            <button
                                v-if="showNextButton"
                                class="btn btn-outline-primary btn-sm"
                                @click="loadNextItems"
                                :disabled="isLoading"
                            >
                                Siguiente →
                            </button>
                        </div>
                    </div>

                    <div v-else class="text-center my-3">
                        <p class="lead text-muted mb-1">
                            {{ hasSearched ? 'No se encontraron clientes' : 'No hay clientes registrados' }}
                        </p>
                        <button v-if="hasSearched" class="btn btn-outline-primary btn-sm" @click="clearSearch">
                            Volver a lista completa
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
.table {
    font-size: 0.9rem;
    margin-bottom: 0.5rem;
}
.table th {
    font-weight: 600;
    text-align: center;
    padding: 0.5rem;
}
.table td {
    text-align: center;
    padding: 0.5rem;
}
</style>