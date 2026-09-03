<script setup lang="ts">
// vue
import { onMounted } from 'vue'

// app
import { customerService } from '../../services/customerService'
import CustomerListMenu from '../../components/customers/menus/CustomerListMenu.vue'
import CustomerListPagination from '../../components/customers/CustomerListPagination.vue'
import CustomerListTable from '../../components/customers/CustomerListTable.vue'
import SearchFormListTable from '../../components/SearchFormListTable.vue'
import { usePaginationSearch } from '../../composables/usePaginationSearch'
import type { Customer } from './types'

const {
  items: customers,
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
} = usePaginationSearch<Customer>({
  fetchFunction: (page) => customerService.listCustomer(page, ''),
  searchFunction: customerService.searchCustomers,
  itemName: 'Clientes',
  gender: 'm',
  pageSize: 10
})

// Load initial data
onMounted(async () => {
  await loadItems(1, '')
})
</script>

<template>
  <div class="row">
    <!-- side menu -->
    <div class="col-md-2">
      <CustomerListMenu />
    </div>

    <!-- main content -->
    <div class="col-md-10">
      <div class="row">
        <div class="col-md-12 mt-1">
          <SearchFormListTable
            v-model="searchTerm"
            :is-loading="isLoading"
            :has-searched="hasSearched"
            input-placeholder="Nombre del cliente..."
            @on-handle-search="handleSearch"
            @on-clear-search="clearSearch"
          />
        </div>

        <div class="col-md-12">
          <!-- loading state -->
          <div v-if="isLoading" class="text-center my-2">
            <div class="spinner-border text-primary" role="status">
              <span class="visually-hidden">Cargando...</span>
            </div>
            <p class="mt-1">Buscando clientes...</p>
          </div>

          <!-- backend errors -->
          <div v-else-if="errorMessage" class="alert alert-danger mt-2">
            {{ errorMessage }}
          </div>

          <!-- results -->
          <div v-else-if="customers.length > 0" class="mt-2">
            <CustomerListTable :customers="customers" />

            <CustomerListPagination
              :show-prev-button="showPrevButton"
              :is-loading="isLoading"
              :current-page="currentPage"
              :show-next-button="showNextButton"
              @on-load-prev-items="loadPrevItems"
              @on-load-next-items="loadNextItems"
            />
          </div>

          <!-- in case no customers -->
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
