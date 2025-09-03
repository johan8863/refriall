<script setup>
// vue
import { ref, onMounted } from "vue";
import { RouterLink } from "vue-router";

// app
import { listKit, searchKits } from "../../services/kit.service";
import listGroup from "../../assets/js/bootstrap_classes/listGroup";

const kits = ref([]);
const currentPage = ref(1);
const showNextButton = ref(false);
const showPrevButton = ref(false);
const kitsErrors = ref(null);
const isLoading = ref(false);

// search variables
const hasSearched = ref(false);
const searchTerm = ref('');

const getKits = async (page = 1) => {
    isLoading.value = true;
    try {
        const resp = await listKit(page);
        const data = resp.data;
        
        showNextButton.value = !!data.next;
        showPrevButton.value = !!data.previous;
        kits.value = data.results;
        kitsErrors.value = null;
    } catch (error) {
        handleError(error);
    } finally {
        isLoading.value = false;
    }
};

const handleSearch = async () => {
    if (!searchTerm.value.trim()) {
        await getKits(1);
        hasSearched.value = false;
        return;
    }

    isLoading.value = true;
    hasSearched.value = true;
    
    try {
        const resp = await searchKits(searchTerm.value);
        const data = resp.data;
        
        kits.value = data.results;
        showNextButton.value = !!data.next;
        showPrevButton.value = !!data.previous;
        kitsErrors.value = null;
        
    } catch (error) {
        handleError(error);
    } finally {
        isLoading.value = false;
    }
};

const clearSearch = async () => {
    searchTerm.value = '';
    hasSearched.value = false;
    await getKits(1);
};

const loadNextItems = async () => {
    currentPage.value += 1;
    if (hasSearched.value) {
        await searchKits(searchTerm.value, currentPage.value);
    } else {
        await getKits(currentPage.value);
    }
};

const loadPrevItems = async () => {
    currentPage.value -= 1;
    if (hasSearched.value) {
        await searchKits(searchTerm.value, currentPage.value);
    } else {
        await getKits(currentPage.value);
    }
};

const handleError = (error) => {
    console.error('Error', error);
    if (error.response) {
        kitsErrors.value = `${error.response.data.detail || error.response.data} - ${error.response.status}`;
    } else {
        kitsErrors.value = 'Error inesperado, consulte al desarrollador';
    }
};

onMounted(async () => {
    await getKits(1);
});
</script>

<template>
    <div class="row">
        <!-- side menu -->
        <div class="col-md-2">
            <ul :class="listGroup.listGroup">
                <li :class="listGroup.listGroupItem">
                    <strong>Equipos</strong>
                </li>
                <li :class="listGroup.listGroupItem">
                    <RouterLink :to="{name: 'kits_create'}">Nuevo</RouterLink>
                </li>
            </ul>
        </div>
        
        <!-- main content -->
        <div class="col-md-10">
            <div class="row">
                <div class="col-md-12 mt-2">
                    <form class="row g-3 align-items-center" @submit.prevent="handleSearch">
                        <div class="col-auto">
                            <label for="searchKitText" class="col-form-label">Búsqueda:</label>
                        </div>
                        <div class="col-auto">
                            <input 
                                type="search" 
                                class="form-control" 
                                id="searchKitText" 
                                v-model="searchTerm"
                                placeholder="Nombre del equipo..."
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
                                class="btn btn-secondary ms-2"
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
                    <div v-if="isLoading" class="text-center my-4">
                        <div class="spinner-border text-primary" role="status">
                            <span class="visually-hidden">Cargando...</span>
                        </div>
                        <p class="mt-2">Buscando equipos...</p>
                    </div>

                    <!-- backend errors -->
                    <div v-else-if="kitsErrors" class="alert alert-danger mt-3">
                        {{ kitsErrors }}
                    </div>

                    <!-- Results -->
                    <div v-else-if="kits.length > 0" class="mt-3">
                        <table class="table table-striped table-hover">
                            <thead class="table-dark">
                                <tr>
                                    <th scope="col">Nombre del Equipo</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="kit in kits" :key="kit.id">
                                    <td>
                                        <RouterLink :to="{name: 'kits_detail', params: {id: kit.id}}">
                                            {{ kit.name }}
                                        </RouterLink>
                                    </td>
                                </tr>
                            </tbody>
                        </table>

                        <!-- Paginación -->
                        <div class="d-flex justify-content-between align-items-center mt-3">
                            <button
                                v-if="showPrevButton"
                                class="btn btn-outline-primary"
                                @click="loadPrevItems"
                                :disabled="isLoading"
                            >
                                ← Anterior
                            </button>
                            <span class="text-muted">Página {{ currentPage }}</span>
                            <button
                                v-if="showNextButton"
                                class="btn btn-outline-primary"
                                @click="loadNextItems"
                                :disabled="isLoading"
                            >
                                Siguiente →
                            </button>
                        </div>
                    </div>

                    <div v-else class="text-center my-5">
                        <p class="lead text-muted">
                            {{ hasSearched ? 'No se encontraron equipos' : 'No hay equipos registrados' }}
                        </p>
                        <button v-if="hasSearched" class="btn btn-outline-primary" @click="clearSearch">
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
}
.table th {
    font-weight: 600;
    text-align: center;
}
.table td {
    text-align: center;
}
</style>