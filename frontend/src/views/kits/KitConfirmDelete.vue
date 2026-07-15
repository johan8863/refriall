<script setup>
// vue
import { onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'

// app
import { errorHandler } from '../../utils/errors/errorHandler.js'
import { kitService } from '../../services/kitService'
import KitConfirmDeleteMenu from '../../components/kits/menus/KitConfirmDeleteMenu.vue'

// kit object
const kit = ref({
  name: ''
})

// loading status
const isLoading = ref(false)

// errors holder object
const kitErrors = ref({
  name: ''
})

const errorMessage = ref(null)

// router utilities to redirect the view and catch route params
const route = useRoute()
const router = useRouter()

// delete the kit object
const delKit = async (id) => {
  try {
    await kitService.deleteKit(id)
    router.push({ name: 'kits' })
  } catch (error) {
    console.error('General error:', { error })
    errorHandler(error, errorMessage, 'Equipo', 'm')
  }
}

const getKit = async () => {
  try {
    // start loading status
    isLoading.value = true
    // getting object from backend
    const resp = await kitService.detailKit(route.params.id)
    kit.value = resp.data
  } catch (error) {
    console.error('General error', error)
    if (error.response) {
      console.log('Error data: ', error.response.data)
      console.log('Error status: ', error.response.status)
      if (error.response.status === 404) {
        kitErrors.value = { message404: 'El equipo que intenta eliminar no existe.' }
      }
    }
  } finally {
    // stpop loading status
    isLoading.value = false
  }
}

// loading the kit object
onMounted(async () => await getKit())
</script>

<template>
  <div class="row">
    <!-- side menu -->
    <div class="col-md-2">
      <KitConfirmDeleteMenu />
    </div>

    <!-- main content -->
    <!-- loading kit data -->
    <div v-if="isLoading" class="col-md-4">
      <div class="d-flex justify-content-center align-items-center" style="min-height: 200px">
        <span role="status" class="text-primary">Cargando datos... </span>
        <span class="spinner-border spinner-border-sm text-primary" aria-hidden="true"></span>
      </div>
    </div>
    <div v-else class="col-md-4">
      <!-- backend general errors -->
      <span v-if="errorMessage">
        <p class="form-text text-danger">
          {{ errorMessage }}
        </p>
      </span>
      <div>
        <p>Está seguro que desea eliminar el equipo: {{ kit.name }}</p>
        <button class="btn btn-sm btn-danger" @click="delKit(kit.id)">Eliminar</button>
        <RouterLink
          :to="{ name: 'kits_detail', params: { id: kit.id } }"
          class="btn btn-sm btn-secondary"
          >Cancelar</RouterLink
        >
      </div>
    </div>
  </div>
  <!-- end row -->
</template>
