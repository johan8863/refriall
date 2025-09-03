<script setup>
// vue
import { ref, onMounted } from "vue";
import { RouterLink } from "vue-router";

// app
import { listOrder, searchOrders } from "../../services/order.service";
import listGroup from "../../assets/js/bootstrap_classes/listGroup";

const orders = ref([]);
const currentPage = ref(1);
const showNextButton = ref(false);
const showPrevButton = ref(false);
const orderBackendErrors = ref(null);
const isLoading = ref(false);

// search variables
const hasSearched = ref(false);
const searchTerm = ref('');

const getOrders = async (page = 1) => {
    isLoading.value = true;
    try {
        const resp = await listOrder(page);
        const data = resp.data;
        
        showNextButton.value = !!data.next;
        showPrevButton.value = !!data.previous;
        orders.value = data.results;
        orderBackendErrors.value = null;
    } catch (error) {
        handleError(error);
    } finally {
        isLoading.value = false;
    }
};

const handleSearch = async () => {
    if (!searchTerm.value.trim()) {
        await getOrders(1);
        hasSearched.value = false;
        return;
    }

    isLoading.value = true;
    hasSearched.value = true;
    
    try {
        const resp = await searchOrders(searchTerm.value);
        const data = resp.data;
        
        orders.value = data.results;
        showNextButton.value = !!data.next;
        showPrevButton.value = !!data.previous;
        orderBackendErrors.value = null;
        
    } catch (error) {
        handleError(error);
    } finally {
        isLoading.value = false;
    }
};

const clearSearch = async () => {
    searchTerm.value = '';
    hasSearched.value = false;
    await getOrders(1);
};

const loadNextItems = async () => {
    currentPage.value += 1;
    if (hasSearched.value) {
        await searchOrders(searchTerm.value, currentPage.value);
    } else {
        await getOrders(currentPage.value);
    }
};

const loadPrevItems = async () => {
    currentPage.value -= 1;
    if (hasSearched.value) {
        await searchOrders(searchTerm.value, currentPage.value);
    } else {
        await getOrders(currentPage.value);
    }
};

const handleError = (error) => {
    console.error('Error', error);
    if (error.response) {
        orderBackendErrors.value = `${error.response.data.detail || error.response.data} - ${error.response.status}`;
    } else if (error.request) {
        orderBackendErrors.value = 'El servidor back-end no responde, consulte al desarrollador.';
    } else {
        orderBackendErrors.value = 'Error inesperado, consulte al desarrollador';
    }
};

onMounted(async () => {
    await getOrders(1);
});
</script>

<template>
    <div class="row">
        <!-- side menu -->
        <div class="col-md-2">
            <ul :class="listGroup.listGroup">
                <li :class="listGroup.listGroupItem">
                    <strong>Órdenes</strong>
                </li>
                <li :class="listGroup.listGroupItem">
                    <RouterLink :to="{name: 'orders_create'}">Nueva</RouterLink>
                </li>
            </ul>
        </div>
        
        <!-- main content -->
        <div class="col-md-10">
            <div class="row">
                <div class="col-md-12 mt-1">
                    <form class="row g-2 align-items-center" @submit.prevent="handleSearch">
                        <div class="col-auto">
                            <label for="searchOrderText" class="col-form-label">Búsqueda:</label>
                        </div>
                        <div class="col-auto">
                            <input 
                                type="search" 
                                class="form-control" 
                                id="searchOrderText" 
                                v-model="searchTerm"
                                placeholder="Folio, cliente o dependencia..."
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
                    <div class="row justify-content-center">
                        <div class="col-md-11">
                            <!-- Loading state -->
                            <div v-if="isLoading" class="text-center my-2">
                                <div class="spinner-border text-primary" role="status">
                                    <span class="visually-hidden">Cargando...</span>
                                </div>
                                <p class="mt-1">Buscando órdenes...</p>
                            </div>

                            <!-- backend errors -->
                            <div v-else-if="orderBackendErrors" class="alert alert-danger mt-2">
                                {{ orderBackendErrors }}
                            </div>

                            <!-- Results -->
                            <div v-else-if="orders.length > 0" class="mt-2">
                                <div class="table-responsive">
                                    <table class="table table-striped table-hover mb-1">
                                        <thead class="table-dark">
                                            <tr>
                                                <th scope="col">Orden</th>
                                                <th scope="col">Cliente/Dependencia</th>
                                                <th scope="col">Importe</th>
                                                <th scope="col">Prefactura</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr v-for="order in orders" :key="order.id">
                                                <td>
                                                    <RouterLink :to="{name: 'orders_detail', params: {id: order.id}}">
                                                        {{ order.folio }}
                                                    </RouterLink>
                                                </td>
                                                <td>
                                                    {{ order.customer ? order.customer.name : order.customer_dependency.name }}
                                                </td>
                                                <td>
                                                    {{ order.get_total_amount.toFixed(2) }}
                                                </td>
                                                <td>
                                                    <RouterLink 
                                                        :to="{name: 'orders_detail_pre_order', params: {id: order.id}}"
                                                        class="btn btn-sm btn-outline-primary py-0 px-2"
                                                        title="Ver prefactura detallada"
                                                    >
                                                        📄 Ver
                                                    </RouterLink>
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>

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
                                    {{ hasSearched ? 'No se encontraron órdenes' : 'No hay órdenes registradas' }}
                                </p>
                                <button v-if="hasSearched" class="btn btn-outline-primary btn-sm" @click="clearSearch">
                                    Volver a lista completa
                                </button>
                            </div>
                        </div>
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