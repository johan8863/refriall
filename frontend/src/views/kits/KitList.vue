<script setup>
// vue
import { onMounted } from 'vue'

// app
import { kitService } from '../../services/kitService'
import KitsListTable from '../../components/kits/KitsListTable.vue'
import KitListPagination from '../../components/kits/KitListPagination.vue'
import SearchFormListTable from '../../components/SearchFormListTable.vue'
import KitListMenu from '../../components/kits/menus/KitListMenu.vue'
import { usePaginationSearch } from '../../composables/usePaginationSearch.js'

const {
  items: kits,
  currentPage,
  isLoading,
  hasSearched,
  searchTerm,
  errorMessage: kitsErrors,
  showPrevButton,
  showNextButton,
  loadItems,
  handleSearch,
  loadNextItems,
  loadPrevItems,
  clearSearch
} = usePaginationSearch({
  fetchFunction: kitService.listKit,
  searchFunction: kitService.searchKits,
  itemName: 'Kit',
  gender: 'm',
  pageSize: 10
})

// lifecycle
onMounted(async () => {
  await loadItems(1, '')
})
</script>

<template>
  <div class="row">
    <!-- side menu -->
    <div class="col-md-2">
      <KitListMenu />
    </div>

    <!-- main content -->
    <div class="col-md-10">
      <!-- main row content -->
      <div class="row">
        <div class="col-md-12 mt-2">
          <!-- search form row -->
          <SearchFormListTable
            v-model="searchTerm"
            :is-loading="isLoading"
            :has-searched="hasSearched"
            input-placeholder="Nombre del equipo..."
            @on-handle-search="handleSearch"
            @on-clear-search="clearSearch"
          />
        </div>

        <!-- Loading state -->
        <div class="col-md-12">
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

          <!-- results -->
          <div v-else-if="kits.length > 0" class="mt-3">
            <!-- kits list table -->
            <KitsListTable :kits="kits" />

            <!-- pagination -->
            <KitListPagination
              :show-prev-button="showPrevButton"
              :is-loading="isLoading"
              :current-page="currentPage"
              :show-next-button="showNextButton"
              @on-load-prev-items="loadPrevItems"
              @on-load-next-items="loadNextItems"
            />
          </div>

          <!-- in case no kits -->
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
