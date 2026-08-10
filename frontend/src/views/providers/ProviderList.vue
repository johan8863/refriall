<script setup>
// vue
import { ref, onMounted } from 'vue'

// app
import { providerService } from '../../services/providerService'
import ProviderListMenu from '../../components/providers/menus/ProviderListMenu.vue'
import { usePaginationSearch } from '../../composables/usePaginationSearch.js'

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
            <table class="table">
              <thead>
                <tr>
                  <th scope="col">Nombre</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="provider in providers" :key="provider.id">
                  <td>
                    <router-link
                      v-if="provider.id"
                      :to="{ name: 'providers_detail', params: { id: provider.id } }"
                      >{{ provider.first_name }}</router-link
                    >
                  </td>
                </tr>
              </tbody>
            </table>

            <!-- buttons -->
            <div>
              <button v-if="showNextButton" class="btn btn-sm btn-primary" @click="loadNextItems()">
                Siguiente
              </button>

              <button v-if="showPrevButton" class="btn btn-sm btn-primary" @click="loadPrevItems()">
                Anterior
              </button>
            </div>
          </div>
          <!-- in case no providers -->
          <div v-else>
            <p class="lead text-center">Inserte un Proveedor.</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
