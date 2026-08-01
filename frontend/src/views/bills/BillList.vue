<script setup>
// vue
import { onMounted } from 'vue'

// app
import { billService } from '../../services/billService'
import BillListTable from '../../components/bills/BillListTable.vue'
import BillListPaginatin from '../../components/bills/BillListPaginatin.vue'
import SearchFormListTable from '../../components/SearchFormListTable.vue'
import BillListMenu from '../../components/bills/menus/BillListMenu.vue'
import { usePaginationSearch } from '../../composables/usePaginationSearch.js'

const {
  items: bills,
  currentPage,
  isLoading,
  hasSearched,
  searchTerm,
  errorMessage,
  showPrevButton,
  showNextButton,
  loadItems,
  handleSearch,
  loadNextItems,
  loadPrevItems,
  clearSearch
} = usePaginationSearch({
  fetchFunction: billService.listBillsPagination,
  searchFunction: billService.searchBills,
  itemName: 'Factura',
  gender: 'f',
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
      <BillListMenu />
    </div>

    <!-- main content -->
    <div class="col-md-10">
      <!-- main row content -->
      <div class="row">
        <div class="col-md-12 mt-1">
          <!-- search form row -->
          <SearchFormListTable
            v-model="searchTerm"
            :is-loading="isLoading"
            :has-searched="hasSearched"
            input-placeholder="Folio o cliente..."
            @on-handle-search="handleSearch"
            @on-clear-search="clearSearch"
          />
        </div>

        <div class="col-md-12">
          <div class="row justify-content-center">
            <div class="col-md-11">
              <!-- loading state -->
              <div v-if="isLoading" class="text-center my-2">
                <div class="spinner-border text-primary" role="status">
                  <span class="visually-hidden">Cargando...</span>
                </div>
                <p class="mt-1">Buscando facturas...</p>
              </div>

              <!-- backend errors -->
              <div v-else-if="errorMessage" class="alert alert-danger mt-2">
                {{ errorMessage }}
              </div>

              <!-- results -->
              <div v-else-if="bills.length > 0" class="mt-2">
                <!-- bill list table -->
                <BillListTable :bills="bills" />

                <!-- pagination -->
                <BillListPaginatin
                  :show-prev-button="showPrevButton"
                  :show-next-button="showNextButton"
                  :current-page="currentPage"
                  :is-loading="isLoading"
                  @on-load-prev-items="loadPrevItems"
                  @on-load-next-items="loadNextItems"
                />
              </div>

              <!-- in case no bills -->
              <div v-else class="text-center my-3">
                <p class="lead text-muted mb-1">
                  {{ hasSearched ? 'No se encontraron facturas' : 'No hay facturas registradas' }}
                </p>
                <button
                  v-if="hasSearched"
                  class="btn btn-outline-primary btn-sm"
                  @click="clearSearch"
                >
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
