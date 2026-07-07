<script setup>
// vue
import { ref, onMounted } from 'vue'

// app
import { itemService } from '../../services/itemService'
import ItemListTable from '../../components/items/ItemListTable.vue'
import ItemListPagination from '../../components/items/ItemListPagination.vue'
import SearchFormListTable from '../../components/SearchFormListTable.vue'
import ItemListMenu from '../../components/items/menus/ItemListMenu.vue'
import { errorHandler } from '../../utils/errors/errorHandler.js'

// reactive objects
const items = ref([])
const currentPage = ref(1)
const showNextButton = ref(false)
const showPrevButton = ref(false)
const itemBackendErrors = ref(null)
const isLoading = ref(false)

// search variables
const hasSearched = ref(false)
const searchTerm = ref('')

// methods
const getItems = async (page = 1) => {
  isLoading.value = true
  try {
    const resp = await itemService.listItem(page)
    const data = resp.data

    showNextButton.value = !!data.next
    showPrevButton.value = !!data.previous
    items.value = data.results
    itemBackendErrors.value = null
  } catch (error) {
    console.error(error)
    errorHandler(error, itemBackendErrors)
  } finally {
    isLoading.value = false
  }
}

const restartSearchFlags = () => {
  currentPage.value = 1
  showNextButton.value = false
  showPrevButton.value = false
}

const handleSearch = async () => {
  if (!searchTerm.value.trim()) {
    await getItems(1)
    hasSearched.value = false
    return
  }

  restartSearchFlags()

  isLoading.value = true
  hasSearched.value = true

  try {
    const resp = await itemService.searchItems(searchTerm.value)
    const data = resp.data

    items.value = data.results
    showNextButton.value = !!data.next
    showPrevButton.value = !!data.previous
    itemBackendErrors.value = null
  } catch (error) {
    console.error(error)
    errorHandler(error, itemBackendErrors)
  } finally {
    isLoading.value = false
  }
}

const clearSearch = async () => {
  searchTerm.value = ''
  hasSearched.value = false

  restartSearchFlags()
  await getItems(1)
}

const loadNextItems = async () => {
  currentPage.value += 1
  if (hasSearched.value && searchTerm.value.trim()) {
    isLoading.value = true
    try {
      const resp = await itemService.searchItems(searchTerm.value, currentPage.value)
      const data = resp.data
      items.value = data.results
      showNextButton.value = !!data.next
      showPrevButton.value = !!data.previous
    } catch (error) {
      console.error(error)
      errorHandler(error, itemBackendErrors)
    } finally {
      isLoading.value = false
    }
  } else {
    await getItems(currentPage.value)
  }
}

const loadPrevItems = async () => {
  currentPage.value -= 1
  if (hasSearched.value && searchTerm.value.trim()) {
    isLoading.value = true
    try {
      const resp = await itemService.searchItems(searchTerm.value, currentPage.value)
      const data = resp.data
      items.value = data.results
      showNextButton.value = !!data.next
      showPrevButton.value = !!data.previous
    } catch (error) {
      console.error(error)
      errorHandler(error, itemBackendErrors)
    } finally {
      isLoading.value = false
    }
  } else {
    await getItems(currentPage.value)
  }
}

// lifecycle
onMounted(async () => {
  await getItems(1)
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
