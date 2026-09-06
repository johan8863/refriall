<script setup lang="ts">
// vue
import { onMounted } from 'vue'

// app
import { providerService } from '@/services/providerService'
import ProviderListMenu from '@/components/providers/menus/ProviderListMenu.vue'
import ProviderListTable from '@/components/providers/ProviderListTable.vue'
import ListPagination from '@/components/common/ListPagination.vue'
import { usePaginationSearch } from '@/composables/usePaginationSearch'
import type { Provider } from './types'

const {
  items: providers,
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
} = usePaginationSearch<Provider>({
  fetchFunction: providerService.listProvider,
  searchFunction: providerService.searchProviders,
  itemName: 'Prestadores',
  gender: 'm',
  pageSize: 10
})

// Lifecycle
onMounted(async () => {
  await loadItems(1, '')
})
</script>

<template>
  <div class="row">
    <div class="col-md-2">
      <ProviderListMenu />
    </div>

    <div class="col-md-10">
      <div class="row">
        <div v-if="isLoading" class="text-center my-4">
          <div class="spinner-border text-primary" role="status"></div>
          <div><span>Cargando...</span></div>
        </div>

        <div v-else-if="errorMessage" class="alert alert-danger mt-3">
          {{ errorMessage }}
        </div>

        <div v-else class="col-md-4">
          <div v-if="providers.length > 0">
            <ProviderListTable :providers="providers" />

            <ListPagination
              :show-prev-button="showPrevButton"
              :show-next-button="showNextButton"
              :is-loading="isLoading"
              :current-page="currentPage"
              @on-load-prev-items="loadPrevItems"
              @on-load-next-items="loadNextItems"
            />
          </div>

          <div v-else>
            <p class="lead text-center">
              {{ hasSearched ? 'No se encontraron prestadores' : 'No hay prestadores registrados' }}
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
