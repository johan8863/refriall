<script setup lang="ts">
// vue
import { onMounted } from 'vue'

// app
import { itemService } from '@/services/itemService'
import ItemListMenu from '@/components/items/menus/ItemListMenu.vue'
import ItemListPagination from '@/components/items/ItemListPagination.vue'
import ItemListTable from '@/components/items/ItemListTable.vue'
import SearchFormListTable from '@/components/SearchFormListTable.vue'
import { usePaginationSearch } from '@/composables/usePaginationSearch'
import type { Item } from './types'

const {
  items: items,
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
} = usePaginationSearch<Item>({
  fetchFunction: (page) => itemService.listItem(page, ''),
  searchFunction: itemService.searchItems,
  itemName: 'Artículo',
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
      <ItemListMenu />
    </div>

    <!-- main content -->
    <div class="col-md-10">
      <div class="row">
        <div class="col-md-12 mt-2">
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
          <div v-if="isLoading" class="text-center my-4">
            <div class="spinner-border text-primary" role="status">
              <span class="visually-hidden">Cargando...</span>
            </div>
            <p class="mt-2">Buscando artículos...</p>
          </div>

          <div v-else-if="errorMessage" class="alert alert-danger mt-3">
            {{ errorMessage }}
          </div>

          <div v-else-if="items.length > 0" class="mt-3">
            <ItemListTable :items="items" />

            <ItemListPagination
              :show-prev-button="showPrevButton"
              :is-loading="isLoading"
              :current-page="currentPage"
              :show-next-button="showNextButton"
              @on-load-prev-items="loadPrevItems"
              @on-load-next-items="loadNextItems"
            />
          </div>

          <div v-else class="text-center my-5">
            <p class="lead text-muted">
              {{ hasSearched ? 'No se encontraron artículos' : 'No hay artículos registrados' }}
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
