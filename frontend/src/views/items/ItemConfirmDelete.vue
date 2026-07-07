<script setup>
// vue
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'

// app
import { itemService } from '../../services/itemService'
import ItemConfirmDeleteMenu from '../../components/items/menus/ItemConfirmDeleteMenu.vue'
import { errorHandler } from '../../utils/errors/errorHandler.js'

// main object
const item = ref({
  id: null,
  code: '',
  name: '',
  item_type: '',
  measurement: '',
  price: ''
})

// errors holder object
const errorMessage = ref(null)

// routing utilities
const route = useRoute()
const router = useRouter()

// lifecycle
onMounted(async () => {
  try {
    const resp = await itemService.detailItem(route.params.id)
    item.value = resp.data
  } catch (error) {
    console.error(error)
    errorHandler(error, errorMessage)
  }
})

// methods

// delete the item object
const delItem = async () => {
  try {
    await itemService.deleteItem(item.value.id)
    router.push({ name: 'items' })
  } catch (error) {
    console.error(error)
    errorHandler(error, errorMessage)
  }
}
</script>

<template>
  <div class="row">
    <!-- side menu -->
    <div class="col-md-2">
      <ItemConfirmDeleteMenu />
    </div>

    <!-- main content -->
    <div class="col-md-6">
      <!-- backend general errors -->
      <span v-if="errorMessage">
        <p class="form-text text-danger">
          {{ errorMessage }}
        </p>
      </span>
      <p>Está seguro que desea eliminar el artículo: {{ item.name }}?</p>
      <button class="btn btn-sm btn-danger" @click="delItem">Eliminar</button>
      <RouterLink
        :to="{ name: 'items_detail', params: { id: item.id } }"
        class="btn btn-sm btn-secondary"
        >Cancelar</RouterLink
      >
    </div>
  </div>
  <!-- end row -->
</template>
