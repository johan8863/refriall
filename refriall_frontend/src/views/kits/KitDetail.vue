<script setup>
// vue
import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'

// app
import { kitService } from '../../services/kitService'
import listGroup from '../../assets/js/bootstrap_classes/listGroup'
import { errorHandler } from '../../utils/errors/errorHandler'

// kit object
const kit = ref({
  name: ''
})

// kit object errors
const kitErrors = ref({
  name: ''
})

// router utilities to redirect the view and catch route params
const route = useRoute()

// loading state
const isLoading = ref(false)

// loading the kit object
onMounted(async () => {
  try {
    // start loading state
    isLoading.value = true
    // getting kit data from backend
    const resp = await kitService.detailKit(route.params.id)
    kit.value = resp.data
  } catch (error) {
    errorHandler(error, kitErrors, 'Equipo', 'm')
  } finally {
    // stop loading state
    isLoading.value = false
  }
})
</script>

<template>
  <div class="row">
    <!-- side menu -->
    <div class="col-md-2">
      <ul :class="listGroup.listGroup">
        <li :class="listGroup.listGroupItem">
          <strong>Equipos</strong>
        </li>
        <li :class="listGroup.listGroupItem">
          <router-link :to="{ name: 'kits' }">Equipos</router-link>
        </li>
        <li :class="listGroup.listGroupItem">
          <router-link :to="{ name: 'kits_create' }">Nuevo</router-link>
        </li>
        <li :class="listGroup.listGroupItem">
          <router-link :to="{ name: 'kits_update', params: { id: kit.id } }">Editar</router-link>
        </li>
        <li :class="listGroup.listGroupItem">
          <router-link :to="{ name: 'kits_confirm_delete', params: { id: kit.id } }"
            >Eliminar</router-link
          >
        </li>
      </ul>
    </div>

    <!-- main content -->

    <!-- loading kit data -->
    <div v-if="isLoading" class="col-md-6">
      <div class="d-flex justify-content-center align-items-center" style="min-height: 200px">
        <span role="status" class="text-primary">Cargando datos... </span>
        <span class="spinner-border spinner-border-sm text-primary" aria-hidden="true"></span>
      </div>
    </div>

    <!-- displaying kit data -->
    <div v-else class="col-md-4">
      <!-- backend general errors -->
      <span v-if="kitErrors.name">
        <p class="form-text text-danger">
          {{ kitErrors.name }}
        </p>
      </span>
      <h3>{{ kit.name }}</h3>
    </div>
  </div>
  <!-- end row -->
</template>
