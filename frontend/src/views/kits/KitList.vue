<script setup>
// vue
import { ref, onMounted } from 'vue'

// app
import { kitService } from '../../services/kitService'
import KitsListTable from '../../components/kits/KitsListTable.vue'
import KitListPagination from '../../components/kits/KitListPagination.vue'
import SearchFormListTable from '../../components/SearchFormListTable.vue'
import KitListMenu from '../../components/kits/menus/KitListMenu.vue'
import { errorHandler } from '../../utils/errors/errorHandler.js'

// reactive objects
const kits = ref([])
const currentPage = ref(1)
const showNextButton = ref(false)
const showPrevButton = ref(false)
const kitsErrors = ref(null)
const isLoading = ref(false)

// search variables
const hasSearched = ref(false)
const searchTerm = ref('')

// methods
const getKits = async (page = 1) => {
  isLoading.value = true
  try {
    const resp = await kitService.listKit(page)
    const data = resp.data

    showNextButton.value = !!data.next
    showPrevButton.value = !!data.previous
    kits.value = data.results
    kitsErrors.value = null
  } catch (error) {
    console.error(error)
    errorHandler(error, kitsErrors)
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
    await getKits(1)
    hasSearched.value = false
    return
  }

  restartSearchFlags()

  isLoading.value = true
  hasSearched.value = true

  try {
    const resp = await kitService.searchKits(searchTerm.value)
    const data = resp.data

    kits.value = data.results
    showNextButton.value = !!data.next
    showPrevButton.value = !!data.previous
    kitsErrors.value = null
  } catch (error) {
    console.error(error)
    errorHandler(error, kitsErrors)
  } finally {
    isLoading.value = false
  }
}

const clearSearch = async () => {
  searchTerm.value = ''
  hasSearched.value = false

  restartSearchFlags()
  await getKits(1)
}

const loadNextItems = async () => {
  currentPage.value += 1
  if (hasSearched.value && searchTerm.value.trim()) {
    isLoading.value = true
    try {
      const resp = await kitService.searchKits(searchTerm.value, currentPage.value)
      const data = resp.data
      kits.value = data.results
      showNextButton.value = !!data.next
      showPrevButton.value = !!data.previous
    } catch (error) {
      console.error(error)
      errorHandler(error, kitsErrors)
    } finally {
      isLoading.value = false
    }
  } else {
    await getKits(currentPage.value)
  }
}

const loadPrevItems = async () => {
  currentPage.value -= 1
  if (hasSearched.value && searchTerm.value.trim()) {
    isLoading.value = true
    try {
      const resp = await searchKits(searchTerm.value, currentPage.value)
      const data = resp.data
      kits.value = data.results
      showNextButton.value = !!data.next
      showPrevButton.value = !!data.previous
    } catch (error) {
      console.error(error)
      errorHandler(error, kitsErrors)
    } finally {
      isLoading.value = false
    }
  } else {
    await getKits(currentPage.value)
  }
}

// lifecycle
onMounted(async () => {
  await getKits(1)
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
