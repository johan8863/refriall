<script setup>
// vue
import { onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'

// third
import { required, helpers } from '@vuelidate/validators'
import { useVuelidate } from '@vuelidate/core'

// app
import KitFormMenu from '../../components/kits/menus/KitFormMenu.vue'
import { kitService } from '../../services/kitService'
import { useErrorHandler } from '../../composables/useErrorHandler.js'

// kit object for post and put requests
const kit = ref({
  name: ''
})

// useFormErrorHandler refs
const { errorMessage, backendErrors, handleError, getFieldErrors } = useErrorHandler({
  objectName: 'Equipo',
  gender: 'm'
})

// router utilities and handlers
const router = useRouter()
const route = useRoute()

const goToKits = () => router.push({ name: 'kits' })
const goToKitDetail = () => router.push({ name: 'kits_detail', params: { id: kit.value.id } })
const goBack = () => (!kit.value.id ? goToKits() : goToKitDetail())

// loading state
const isLoading = ref(false)

// rules to manage front validations
const rules = {
  name: {
    required: helpers.withMessage('El nombre es requierido.', required)
  }
}

// vuelidate object
const v$ = useVuelidate(rules, kit)

// methods

// create kit object function
const createKit = async (kit) => {
  try {
    if (await v$.value.$validate()) {
      // if front validations run,
      // post the object and redirect to its detail view
      const { data } = await kitService.postKit(kit)
      router.push({ name: 'kits_detail', params: { id: data.id } })
    } else {
      // always log vuelidate erros to de console
      // just in case of unexpected behavior
      console.error(
        v$.value.$errors.map((err) => ({
          property: err.$property,
          message: err.$message
        }))
      )
    }
  } catch (error) {
    console.error('General errors:', { error })
    handleError(error)
  }
}

// update kit object function
const updateKit = async (kit) => {
  try {
    // if front validations run,
    // put the object and redirect to its detail view
    if (await v$.value.$validate()) {
      const { data } = await kitService.putKit(kit)
      router.push({ name: 'kits_detail', params: { id: data.id } })
    } else {
      // always log vuelidate erros to de console
      // just in case of unexpected behavior
      console.error(
        v$.value.$errors.map((err) => ({
          property: err.$property,
          message: err.$message
        }))
      )
    }
  } catch (error) {
    console.error('General errors:', { error })
    handleError(error)
  }
}

// lifecycle
onMounted(async () => {
  try {
    // start loading state
    isLoading.value = true
    // getting kit from backend
    const id = route.params.id
    if (id) {
      const { data } = await kitService.detailKit(id)
      kit.value = data
    }
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
      <kit-form-menu />
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
      <!-- backend errors from non_field_errors dictionary -->
      <span v-if="backendErrors.non_field_errors">
        <p
          class="form-text text-danger"
          v-for="(error, index) in backendErrors.non_field_errors"
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
      <!-- form -->
      <form @submit.prevent="!kit.id ? createKit(kit) : updateKit(kit)">
        <!-- name control -->
        <div class="mb-2">
          <label for="name" class="form-label">Nombre</label>
          <input
            autofocus
            type="text"
            id="name"
            class="form-control"
            v-model.trim="kit.name"
            @blur="v$.name.$touch"
          />
          <!-- frontend errors -->
          <p class="form-text text-danger" v-for="error in v$.name.$errors" :key="error.$uid">
            {{ error.$message }}
          </p>
          <!-- backend errors -->
          <p
            v-for="(error, i) in getFieldErrors('name')"
            :key="`backend-${i}`"
            class="form-text text-danger"
          >
            {{ error }}
          </p>
        </div>
        <!-- buttons -->
        <div>
          <!-- 
            the order in the ternary operator is due to the fact that 
            this form is more often used to create than to update 
          -->
          <button type="submit" class="btn btn-sm btn-primary">
            {{ !kit.id ? 'Guardar' : 'Actualizar' }}
          </button>
          <button type="button" class="btn btn-sm btn-secondary" @click="goBack">Cancelar</button>
        </div>
      </form>
    </div>
  </div>
  <!-- end row -->
</template>
