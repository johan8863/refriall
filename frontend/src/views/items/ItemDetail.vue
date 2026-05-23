<script setup>
// vue
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'

// app
import { itemService } from '../../services/itemService'
import listGroup from '../../assets/js/bootstrap_classes/listGroup'
import { errorHandler } from '../../utils/errors/errorHandler'

const route = useRoute()
const item = ref({
  code: '',
  name: '',
  get_item_type: '',
  get_measurement: '',
  price: 0
})

// loading state
const isLoading = ref(false)

const itemBackendErrors = ref(null)

onMounted(async () => {
  try {
    // start loading state
    isLoading.value = true
    // getting item data
    const resp = await itemService.detailItem(route.params.id)
    item.value = resp.data
  } catch (error) {
    console.error('General error', error)
    errorHandler(error, itemBackendErrors, 'Artículo', 'm')
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
          <strong>Artículos</strong>
        </li>
        <li :class="listGroup.listGroupItem">
          <RouterLink :to="{ name: 'items' }">Artículos</RouterLink>
        </li>
        <li :class="listGroup.listGroupItem">
          <RouterLink :to="{ name: 'items_create' }">Nuevo</RouterLink>
        </li>
        <li :class="listGroup.listGroupItem">
          <RouterLink :to="{ name: 'items_update', params: { id: item.id } }">Editar</RouterLink>
        </li>
        <li :class="listGroup.listGroupItem">
          <RouterLink :to="{ name: 'items_confirm_delete', params: { id: item.id } }"
            >Eliminar</RouterLink
          >
        </li>
      </ul>
    </div>

    <!-- main content -->

    <!-- loading item data -->
    <div v-if="isLoading" class="col-md-6">
      <div class="d-flex justify-content-center align-items-center" style="min-height: 200px">
        <span role="status" class="text-primary">Cargando datos... </span>
        <span class="spinner-border spinner-border-sm text-primary" aria-hidden="true"></span>
      </div>
    </div>
    <!-- displaying item data -->
    <div v-else class="col-md-6">
      <!-- backend general errors -->
      <span v-if="itemBackendErrors">
        <p class="form-text text-danger">
          {{ itemBackendErrors }}
        </p>
      </span>

      <h3>
        Artículo: <small>{{ item.name }}</small>
      </h3>
      <hr />
      <p>Código: {{ item.code }}</p>
      <p>Tipo: {{ item.get_item_type }}</p>
      <p>U/M: {{ item.get_measurement }}</p>
      <p>Precio: {{ item.price.toFixed(2) }}</p>
    </div>
  </div>
  <!-- end row -->
</template>
