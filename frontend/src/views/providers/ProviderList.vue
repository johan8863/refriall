<script setup>
// vue
import { ref, onMounted } from 'vue'

// app
import { providerService } from '@/services/providerService'
import ProviderListMenu from '@/components/providers/menus/ProviderListMenu.vue'
import { usePaginationSearch } from '@/composables/usePaginationSearch.js'
import ProviderListTable from '@/components/providers/ProviderListTable.vue'
import ListPagination from '@/components/common/ListPagination.vue'

// pagination composable
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
} = usePaginationSearch({
  fetchFunction: providerService.listProvider,
  searchFunction: providerService.searchProviders,
  itemName: 'Prestadores',
  gender: 'm'
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
      <provider-list-menu />
    </div>

    <!-- main content -->
    <div class="col-md-10">
      <div class="row">
        <div v-if="isLoading" class="text-center my-4">
          <!-- loading state -->
          <div class="spinner-border text-primary" role="status"></div>
          <div>
            <span>Cargando...</span>
          </div>
        </div>

        <!-- error message -->
        <div v-else-if="errorMessage" class="alert alert-danger mt-3">
          {{ errorMessage }}
        </div>

        <!-- results -->
        <div v-else class="col-md-4">
          <div v-if="providers.length > 0">
            <!-- table list -->
            <provider-list-table :providers="providers" />

            <!-- pagination list -->
            <list-pagination
              :show-prev-button="showPrevButton"
              :show-next-button="showNextButton"
              :is-loading="isLoading"
              :current-page="currentPage"
              @on-load-prev-items="loadPrevItems"
              @on-load-next-items="loadNextItems"
            />
          </div>
          <!-- in case no providers -->
          <div v-else>
            <p class="lead text-center">Inserte un Proveedor.</p>
          </div>
          <!-- end results -->
        </div>
      </div>
      <!-- end main content -->
    </div>
    <!-- end outer row -->
  </div>
</template>
