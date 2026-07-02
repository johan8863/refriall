<script setup>
// vue
import { ref, onMounted } from 'vue'

// app
import { providerService } from '../../services/providerService'
import ProviderListMenu from '../../components/providers/menus/ProviderListMenu.vue'
import { errorHandler } from '../../utils/errors/errorHandler.js'

// reactive objects
const providers = ref([])

const currentPage = ref(1)
const showNextButton = ref(false)
const showPrevButton = ref(false)

// loading state
const isLoading = ref(false)

// errors
const errorMessage = ref('')

// methods
const getProviders = async () => {
  try {
    isLoading.value = true

    const resp = (await providerService.listProvider(currentPage.value)).data

    showNextButton.value = false
    if (resp.next) {
      showNextButton.value = true
    }

    showPrevButton.value = false
    if (resp.previous) {
      showPrevButton.value = true
    }

    providers.value = resp.results
  } catch (error) {
    errorHandler(error, errorMessage, 'Prestador', 'm')
  } finally {
    isLoading.value = false
  }
}

const loadNextItems = () => {
  currentPage.value += 1
  getProviders()
}

const loadPrevItems = () => {
  currentPage.value -= 1
  getProviders()
}

// lifecycle
onMounted(async () => {
  getProviders()
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
          <div class="spinner-border text-primary" role="status">
            <span class="visually-hidden">Cargando...</span>
          </div>
          <p class="mt-2">Buscando equipos...</p>
        </div>

        <!-- error message -->
        <div v-else-if="errorMessage" class="alert alert-danger mt-3">
          {{ errorMessage }}
        </div>

        <!-- results -->
        <div v-else class="col-md-4">
          <div v-if="providers.length > 0">
            <div id="tableContainer" style="height: 460px">
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
            </div>

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
