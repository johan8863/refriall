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

// loading the kit object
onMounted(async () => {
  try {
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
  }
})
</script>

<template>
  <div class="row">
    <!-- side menu -->
    <div class="col-md-2">
      <KitConfirmDeleteMenu />
    </div>

    <!-- main content -->
    <div class="col-md-4">
      <!-- backend errors from non_field_errors dictionary -->
      <span v-if="kitErrors.non_field_errors">
        <p
          class="form-text text-danger"
          v-for="(error, index) in kitErrors.non_field_errors"
          :key="index"
        >
          {{ error }}
        </p>
      </span>
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
