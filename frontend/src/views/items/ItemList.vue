<script setup>
// vue
import { onMounted } from 'vue'

// app
import { itemService } from '../../services/itemService'
import ItemListTable from '../../components/items/ItemListTable.vue'
import ItemListPagination from '../../components/items/ItemListPagination.vue'
import SearchFormListTable from '../../components/SearchFormListTable.vue'
import ItemListMenu from '../../components/items/menus/ItemListMenu.vue'
import { usePaginationSearch } from '../../composables/usePaginationSearch.js'

const {
  items,
  currentPage,
  isLoading,
  hasSearched,
  searchTerm,
  errorMessage: itemBackendErrors,
  showPrevButton,
  showNextButton,
  loadItems,
  handleSearch,
  loadNextItems,
  loadPrevItems,
  clearSearch
} = usePaginationSearch({
  fetchFunction: itemService.listItem,
  searchFunction: itemService.searchItems,
  itemName: 'Artículo',
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
      <ItemListMenu />
    </div>

    <!-- main content -->
    <div class="col-md-10">
      <!-- main content row -->
      <div class="row">
        <div class="col-md-12 mt-2">
          <!-- row search form -->
          <SearchFormListTable
            v-model="searchTerm"
            :is-loading="isLoading"
            :has-searched="hasSearched"
            input-placeholder="Nombre del artículo..."
            @on-handle-search="handleSearch"
            @on-clear-search="clearSearch"
          />
        </div>

        <div class="col-md-12">
          <!-- loading state -->
          <div v-if="isLoading" class="text-center my-4">
            <div class="spinner-border text-primary" role="status">
              <span class="visually-hidden">Cargando...</span>
            </div>
            <p class="mt-2">Buscando artículos...</p>
          </div>

          <!-- backend errors -->
          <div v-else-if="itemBackendErrors" class="alert alert-danger mt-3">
            {{ itemBackendErrors }}
          </div>

          <!-- results -->
          <div v-else-if="items.length > 0" class="mt-3">
            <!-- items list table -->
            <ItemListTable :items="items" />

            <!-- pagination -->
            <ItemListPagination
              :show-prev-button="showPrevButton"
              :is-loading="isLoading"
              :current-page="currentPage"
              :show-next-button="showNextButton"
              @on-load-prev-items="loadPrevItems"
              @on-load-next-items="loadNextItems"
            />
          </div>

          <!-- in case no items -->
          <div v-else class="text-center my-5">
            <p class="lead text-muted">
              {{ hasSearched ? 'No se encontraron resultados' : 'No hay artículos registrados' }}
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
}
</style>
