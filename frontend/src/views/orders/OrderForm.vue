<script setup>
// vue
import { useRoute, useRouter } from 'vue-router'
import { onMounted, ref } from 'vue'

// third
import { required, helpers } from '@vuelidate/validators'
import { useVuelidate } from '@vuelidate/core'

// app
import { currencyService } from '../../services/currencyService'
import CustomerDependencySelector from '../../components/orders/CustomerDependencySelector.vue'
import { customerDependecyService } from '../../services/customerDependencyService'
import { customerService } from '../../services/customerService'
import { itemService } from '../../services/itemService'
import ItemTime from '../../components/orders/ItemTime.vue'
import { kitService } from '../../services/kitService'
import OrderFormMenu from '../../components/orders/menus/OrderFormMenu.vue'
import { orderService } from '../../services/orderService'
import { providerService } from '../../services/providerService'
import { useFormErrorHandler } from '../../composables/useErrorFormHandler.js'
import { useOrderTotalComputed } from '../../composables/OrderComposable'
import { useRouting } from '../../composables/routingFunctions.js'

// main object
const order = ref({
  id: null,
  customer: '',
  currency: '',
  customer_dependency: '',
  symptom: '',
  flaw: '',
  repair_description: '',
  folio: '',
  check_diagnosis: false,
  repair: false,
  install: false,
  maintenance: false,
  support: '',
  kit: '',
  kit_brand: '',
  kit_model: '',
  kit_serial: '',
  job_description: '',
  itemtime_set: [],
  provider: '',
  provider_signature_date: '',
  customer_signature_date: '',
  check_number: '',
  charge_aprove: '',
  charge_check: '',
  customer_charge: '',
  customer_name: '',
  customer_personal_id: '',
  checked_by: '',
  aproved_by: ''
})

// secondary backend objects
const customers = ref([])
const dependencies = ref([])
const kits = ref([])
const items = ref([])
const currencies = ref([])
const providers = ref([])

// router utilities and handlers
const router = useRouter()
const route = useRoute()

const { goBack } = useRouting()

const handleGoBack = () => {
  try {
    goBack('orders', 'orders_detail', order.value.id)
  } catch (error) {}
}

// loading status
const isLoadingBackendData = ref(false)
const isLoadingOrderData = ref(false)

// customs rules
const customerOrDependency = () => {
  if (!order.value.customer && !order.value.customer_dependency) {
    return true
  }
  if (order.value.customer && order.value.customer_dependency) {
    return false
  }
  return true
}

const atleastOneCustomerOrDependency = () =>
  !!order.value.customer || !!order.value.customer_dependency

const minimalItems = () => order.value.itemtime_set.length > 0

const atLeastOneModality = () =>
  order.value.check_diagnosis ||
  order.value.repair ||
  order.value.install ||
  order.value.maintenance

// validation rules
const rules = {
  provider: {
    required: helpers.withMessage('El prestador es requerido.', required)
  },
  customer: {
    customerOrDependency: helpers.withMessage(
      'Debe seleccionar un cliente o una dependencia, no ambos.',
      customerOrDependency
    ),
    required: helpers.withMessage(
      'Debe Seleccionar un cliente o una dependencia.',
      atleastOneCustomerOrDependency
    )
  },
  customer_dependency: {
    customerOrDependency: helpers.withMessage(
      'Debe seleccionar un cliente o una dependencia, no ambos.',
      customerOrDependency
    )
  },
  symptom: {
    required: helpers.withMessage('El síntoma es requerido.', required)
  },
  flaw: {
    required: helpers.withMessage('La falla es requerida.', required)
  },
  repair_description: {
    required: helpers.withMessage('La descripción es requerida.', required)
  },
  folio: {
    required: helpers.withMessage('El folio es requerido.', required)
  },
  support: {
    required: helpers.withMessage('La atención es requerida.', required)
  },
  currency: {
    required: helpers.withMessage('La moneda es requerida.', required)
  },
  check_diagnosis: {
    atLeastOneModality: helpers.withMessage(
      'Debe seleccionar al menos una modalidad.',
      atLeastOneModality
    )
  },
  kit: {
    required: helpers.withMessage('El equipo es requerido.', required)
  },
  kit_brand: {
    required: helpers.withMessage('La marca es requerida.', required)
  },
  kit_model: {
    required: helpers.withMessage('El modelo es requerido.', required)
  },
  kit_serial: {
    required: helpers.withMessage('La serie es requerida.', required)
  },
  provider_signature_date: {
    required: helpers.withMessage('La firma del prestador es requerida.', required)
  },
  customer_signature_date: {
    required: helpers.withMessage('La firma del cliente es requerida.', required)
  },
  itemtime_set: {
    minimalItems: helpers.withMessage('Debe seleccionar al menos un artículo.', minimalItems)
  }
}

// vuelidate object
const v$ = useVuelidate(rules, order)

// useFormErrorHandler refs
const { errorMessage, backendErrors, handleError, getFieldErrors } = useFormErrorHandler({
  objectName: 'Orden'
})

// methods
// preparation of the itemtime_set order property
const defaulItemTimes = () => ({ item: 0, times: 1 })
const DEFAULT_ITEMS_COUNT = 12

const createItemTime = (elements = DEFAULT_ITEMS_COUNT) => {
  const newItems = Array.from({ length: elements }, defaulItemTimes)
  order.value.itemtime_set.push(...newItems)
}

// computed composable property to calculate value of the order
// as its being added items
const { orderTotalComputed } = useOrderTotalComputed(order, items)

// delete an item from the form by removing it
// from the order object
const deleteItem = (index) => {
  order.value.itemtime_set.splice(index, 1)
}

const handleSubmit = async () => {
  if (await v$.value.$validate()) {
    // keep only items with value
    order.value.itemtime_set = order.value.itemtime_set.filter((x) => x.item !== 0)
    try {
      // update or create depending on order id
      const isUpdate = !!order.value.id
      const method = isUpdate
        ? orderService.putOrder(order.value)
        : orderService.postOrder(order.value)

      // on success redirect to kit detail view
      const { data } = await method
      router.push({ name: 'orders_detail', params: { id: data.id } })
    } catch (error) {
      console.error('General errors:', { error })
      handleError(error)
    }
  } else {
    // always log vuelidate errors
    // just in case an unexpected behavior
    console.error('Validation errors:', v$.value.$errors)
    return
  }
}

const loadData = async () => {
  try {
    isLoadingBackendData.value = true
    errorMessage.value = null

    const results = await Promise.allSettled([
      customerService.listAllCustomers(),
      kitService.getAllKits(),
      itemService.listItemsForSelect(),
      customerDependecyService.listCustomerDependecy(),
      currencyService.listCurrencies(),
      providerService.listAllProviders()
    ])

    // handle each result
    const [
      customersResult,
      kitsResult,
      itemsResult,
      dependenciesResult,
      currenciesResult,
      providersResult
    ] = results

    // assign data only if successful
    // customers
    customers.value = customersResult.status === 'fulfilled' ? customersResult.value.data : []
    // kits
    kits.value = kitsResult.status === 'fulfilled' ? kitsResult.value.data : []
    // items
    items.value = itemsResult.status === 'fulfilled' ? itemsResult.value.data : []
    // dependencies
    dependencies.value =
      dependenciesResult.status === 'fulfilled' ? dependenciesResult.value.data : []
    // currencies
    currencies.value = currenciesResult.status === 'fulfilled' ? currenciesResult.value.data : []
    // providers
    providers.value = providersResult.status === 'fulfilled' ? providersResult.value.data : []

    // Log de errores
    results.forEach((result, index) => {
      if (result.status === 'rejected') {
        const names = ['Customers', 'Kits', 'Items', 'Dependencies', 'Currencies', 'Providers']
        console.warn(`Error loading ${names[index]}:`, result.reason)
      }
    })
  } catch (error) {
    console.error('Unexpected error:', error)
    errorHandler(error, errorMessage, 'Form data')
  } finally {
    isLoadingBackendData.value = false
  }
}

// on mounted cycle
onMounted(async () => {
  await loadData()

  const id = route.params.id
  if (id) {
    try {
      // start loading order data
      isLoadingOrderData.value = true
      const { data } = await orderService.detailOrderUpdate(id)
      order.value = data
      order.value.itemtime_set = order.value.itemtime_set.map((itemTime) => {
        return {
          item: itemTime.item,
          times: itemTime.times
        }
      })
    } catch (error) {
      errorHandler(error, orderBackendErrors, 'Orden')
    } finally {
      // finish loading order data
      isLoadingOrderData.value = false
    }
  } else {
    // create initial empty objects for itemtime
    createItemTime()
  }
})
</script>

<template>
  <div class="row">
    <!-- side menu -->
    <div class="col-md-2">
      <order-form-menu @on-load-data="loadData" />
    </div>

    <!-- main content -->
    <div class="col-md-10">
      <!-- loading section -->
      <!-- Loading backend data -->
      <div class="col-md-10" v-if="isLoadingBackendData">
        <div class="d-flex justify-content-center align-items-center" style="min-height: 200px">
          <span role="status" class="text-primary">Cargando datos... </span>
          <span class="spinner-border spinner-border-sm text-primary" aria-hidden="true"></span>
        </div>
      </div>

      <!-- Loading order data -->
      <div class="col-md-10" v-else-if="isLoadingOrderData">
        <div class="d-flex justify-content-center align-items-center" style="min-height: 200px">
          <span role="status" class="text-primary">Cargando orden... </span>
          <span class="spinner-border spinner-border-sm text-primary" aria-hidden="true"></span>
        </div>
      </div>
      <!-- errors section -->
      <!-- backend general errors -->
      <div v-if="errorMessage" class="alert alert-danger">
        {{ errorMessage }}
      </div>
      <!-- backend errors from non_field_errors dictionary -->
      <div v-if="backendErrors.non_field_errors">
        <p
          v-for="(error, index) in backendErrors.non_field_errors"
          :key="index"
          class="form-text text-danger"
        >
          {{ error }}
        </p>
      </div>
      <!-- form -->
      <form @submit.prevent="handleSubmit" class="row">
        <!-- provider control -->
        <div class="col-md-3 mb-2">
          <label for="provider" class="form-label">Prestador</label>
          <select
            autofocus
            id="provider"
            class="form-select form-select-sm"
            v-model.trim="order.provider"
            @blur="v$.provider.$touch"
          >
            <option v-for="provider in providers" :key="provider.id" :value="provider.id">
              {{ provider.first_name }}
            </option>
          </select>

          <!-- frontend errors -->
          <p class="form-text text-danger" v-for="error in v$.provider.$errors" :key="error.$uid">
            {{ error.$message }}
          </p>

          <!-- backend errors -->
          <p
            v-for="(error, i) in getFieldErrors('provider')"
            :key="`backend-${i}`"
            class="form-text text-danger"
          >
            {{ error }}
          </p>
        </div>

        <!-- customer control -->
        <div class="col-md-3 mb-2">
          <CustomerDependencySelector
            type="customer"
            :customers="customers"
            v-model="order.customer"
            :disabled="!!order.customer_dependency"
            :vuelidate-errors="v$.customer.$errors"
            :get-field-errors="getFieldErrors"
            @blur="v$.customer.$touch"
            @clear="order.customer = ''"
          />
        </div>

        <!-- customer_dependency control -->
        <div class="col-md-3 mb-2">
          <CustomerDependencySelector
            type="dependency"
            :dependencies="dependencies"
            v-model="order.customer_dependency"
            :disabled="!!order.customer"
            :vuelidate-errors="v$.customer_dependency.$errors"
            :get-field-errors="getFieldErrors"
            @blur="v$.customer.$touch"
            @clear="order.customer_dependency = ''"
          />
        </div>

        <!-- symptom control -->
        <div class="col-md-3 mb-2">
          <label for="symptom" class="form-label">Síntoma</label>
          <input
            type="text"
            class="form-control"
            id="symptom"
            v-model.trim="order.symptom"
            @blur="v$.symptom.$touch"
          />

          <!-- frontend errors -->
          <p class="form-text text-danger" v-for="error in v$.symptom.$errors" :key="error.$uid">
            {{ error.$message }}
          </p>

          <!-- backend errors -->
          <p
            v-for="(error, i) in getFieldErrors('symptom')"
            :key="`backend-${i}`"
            class="form-text text-danger"
          >
            {{ error }}
          </p>
        </div>

        <!-- flaw control -->
        <div class="col-md-3 mb-2">
          <label for="flaw" class="form-label">Defecto</label>
          <input
            type="text"
            class="form-control"
            id="flaw"
            v-model.trim="order.flaw"
            @blur="v$.flaw.$touch"
          />

          <!-- frontend errors -->
          <p class="form-text text-danger" v-for="error in v$.flaw.$errors" :key="error.$uid">
            {{ error.$message }}
          </p>

          <!-- backend errors -->
          <p
            v-for="(error, i) in getFieldErrors('flaw')"
            :key="`backend-${i}`"
            class="form-text text-danger"
          >
            {{ error }}
          </p>
        </div>

        <!-- repair_description control -->
        <div class="col-md-3 mb-2">
          <label for="repair_description" class="form-label">Reparación</label>
          <input
            type="text"
            class="form-control"
            id="repair_description"
            v-model.trim="order.repair_description"
            @blur="v$.repair_description.$touch"
          />

          <!-- frontend errors -->
          <p
            class="form-text text-danger"
            v-for="error in v$.repair_description.$errors"
            :key="error.$uid"
          >
            {{ error.$message }}
          </p>

          <!-- backend errors -->
          <p
            v-for="(error, i) in getFieldErrors('repair_description')"
            :key="`backend-${i}`"
            class="form-text text-danger"
          >
            {{ error }}
          </p>
        </div>

        <!-- folio control -->
        <div class="col-md-3 mb-2">
          <label for="folio" class="form-label">Folio</label>
          <input
            type="text"
            class="form-control"
            id="folio"
            v-model.trim="order.folio"
            @blur="v$.folio.$touch"
          />

          <!-- frontend errors -->
          <p class="form-text text-danger" v-for="error in v$.folio.$errors" :key="error.$uid">
            {{ error.$message }}
          </p>

          <!-- backend errors -->
          <p
            v-for="(error, i) in getFieldErrors('folio')"
            :key="`backend-${i}`"
            class="form-text text-danger"
          >
            {{ error }}
          </p>
        </div>
        <!-- support control -->
        <div class="col-md-3 mb-2">
          <label for="support">Atención</label>
          <select
            id="support"
            class="form-select"
            v-model.trim="order.support"
            @blur="v$.support.$touch"
          >
            <option value="t">Taller</option>
            <option value="i">In Situ</option>
          </select>

          <!-- frontend errors -->
          <p class="form-text text-danger" v-for="error in v$.support.$errors" :key="error.$uid">
            {{ error.$message }}
          </p>

          <!-- backend errors -->
          <p
            v-for="(error, i) in getFieldErrors('support')"
            :key="`backend-${i}`"
            class="form-text text-danger"
          >
            {{ error }}
          </p>
        </div>

        <!-- currency control -->
        <div class="col-md-3">
          <label for="currency" class="form-label">Moneda</label>
          <select
            name="currency"
            id="currency"
            class="form-select form-select-sm"
            v-model.number="order.currency"
            @blur="v$.currency.$touch"
          >
            <option v-for="currency in currencies" :key="currency.id" :value="currency.id">
              {{ currency.name }}
            </option>
          </select>
          <!-- frontend errors -->
          <p class="form-text text-danger" v-for="error in v$.currency.$errors" :key="error.$uuid">
            {{ error.$message }}
          </p>
          <!-- backend errors -->
          <p
            v-for="(error, i) in getFieldErrors('currency')"
            :key="`backend-${i}`"
            class="form-text text-danger"
          >
            {{ error }}
          </p>
        </div>

        <div class="row mt-2">
          <!-- check_diagnosis control -->
          <div class="col-md-2 mb-2">
            <label for="check_diagnosis">Rev/Diagnóstico</label>
            <input
              type="checkbox"
              id="check_diagnosis"
              class="form-check"
              v-model.trim="order.check_diagnosis"
            />
            <!-- frontend errors -->
            <p
              class="form-text text-danger"
              v-for="error in v$.check_diagnosis.$errors"
              :key="error.$uid"
            >
              {{ error.$message }}
            </p>
          </div>

          <!-- repair control -->
          <div class="col-md-2 mb-2">
            <label for="repair">Reparación</label>
            <input type="checkbox" id="repair" class="form-check" v-model.trim="order.repair" />
          </div>

          <!-- install control -->
          <div class="col-md-2 mb-2">
            <label for="install">Instalación</label>
            <input type="checkbox" id="install" class="form-check" v-model.trim="order.install" />
          </div>

          <!-- maintenance control -->
          <div class="col-md-2 mb-2">
            <label for="maintenance">Mtto</label>
            <input
              type="checkbox"
              id="maintenance"
              class="form-check"
              v-model.trim="order.maintenance"
            />
          </div>
          <div class="col-md-4"></div>
        </div>

        <!-- kit control -->
        <div class="col-md-3 mb-2">
          <label for="kit">Equipo</label>
          <select id="kit" class="form-select" v-model.trim="order.kit" @blur="v$.kit.$touch">
            <option v-for="kit in kits" :key="kit.id" :value="kit.id">{{ kit.name }}</option>
          </select>

          <!-- frontend errors -->
          <p class="form-text text-danger" v-for="error in v$.kit.$errors" :key="error.$uid">
            {{ error.$message }}
          </p>

          <!-- backend errors -->
          <p
            v-for="(error, i) in getFieldErrors('kit')"
            :key="`backend-${i}`"
            class="form-text text-danger"
          >
            {{ error }}
          </p>
        </div>

        <!-- kit_brand control -->
        <div class="col-md-3 mb-2">
          <label for="kit_brand" class="form-label">Marca</label>
          <input
            type="text"
            class="form-control"
            id="kit_brand"
            v-model.trim="order.kit_brand"
            @blur="v$.kit_brand.$touch"
          />

          <!-- frontend errors -->
          <p class="form-text text-danger" v-for="error in v$.kit_brand.$errors" :key="error.$uid">
            {{ error.$message }}
          </p>

          <!-- backend errors -->
          <p
            v-for="(error, i) in getFieldErrors('kit_brand')"
            :key="`backend-${i}`"
            class="form-text text-danger"
          >
            {{ error }}
          </p>
        </div>

        <!-- kit_model control -->
        <div class="col-md-3 mb-2">
          <label for="kit_model" class="form-label">Modelo</label>
          <input
            type="text"
            class="form-control"
            id="kit_model"
            v-model.trim="order.kit_model"
            @blur="v$.kit_model.$touch"
          />

          <!-- frontend errors -->
          <p class="form-text text-danger" v-for="error in v$.kit_model.$errors" :key="error.$uid">
            {{ error.$message }}
          </p>

          <!-- backend errors -->
          <p
            v-for="(error, i) in getFieldErrors('kit_model')"
            :key="`backend-${i}`"
            class="form-text text-danger"
          >
            {{ error }}
          </p>
        </div>

        <!-- kit_serial control -->
        <div class="col-md-3 mb-2">
          <label for="kit_serial" class="form-label">Serie</label>
          <input
            type="text"
            class="form-control"
            id="kit_serial"
            v-model.trim="order.kit_serial"
            @blur="v$.kit_serial.$touch"
          />

          <!-- frontend errors -->
          <p class="form-text text-danger" v-for="error in v$.kit_serial.$errors" :key="error.$uid">
            {{ error.$message }}
          </p>

          <!-- backend errors -->
          <p
            v-for="(error, i) in getFieldErrors('kit_serial')"
            :key="`backend-${i}`"
            class="form-text text-danger"
          >
            {{ error }}
          </p>
        </div>

        <!-- job_description control -->
        <div class="col-md-8 offset-md-2 mb-2">
          <label class="form-label" for="job_description">Descripción del trabajo realizado</label>
          <textarea
            v-model.trim="order.job_description"
            id="job_description"
            class="form-control"
            cols="30"
            rows="10"
          >
          </textarea>

          <!-- backend errors -->
          <p
            v-for="(error, i) in getFieldErrors('job_description')"
            :key="`backend-${i}`"
            class="form-text text-danger"
          >
            {{ error }}
          </p>
        </div>

        <!-- items_times control -->
        <div class="row">
          <div class="col-md-12 mb-2">
            <button type="button" class="btn btn-sm btn-primary" @click="createItemTime(1)">
              Agregar artículo
            </button>
          </div>

          <div class="col-md-6">Artículo o Servicio</div>

          <div class="col-md-1">U/M</div>
          <div class="col-md-1">Precio</div>
        </div>
        <!-- frontend errors -->
        <p class="form-text text-danger" v-for="error in v$.itemtime_set.$errors" :key="error.$uid">
          {{ error.$message }}
        </p>
        <div class="col-md-12 mb-2" style="overflow-y: auto; height: 400px">
          <template v-for="(item, index) in order.itemtime_set" :key="index">
            <item-time
              v-if="order.itemtime_set.length > 0"
              :items="items"
              :item="item"
              @on-delete-item="deleteItem(index)"
            />
          </template>
        </div>

        <!-- customer in charge controls -->
        <h4>Datos del cliente a cargo de recibir el servicio:</h4>
        <div class="col-md-3 mb-2">
          <label for="customer_charge">Cargo</label>
          <input
            type="text"
            class="form-control"
            id="customer_charge"
            v-model.trim="order.customer_charge"
          />
        </div>

        <div class="col-md-3 mb-2">
          <label for="customer_name">Nombre</label>
          <input
            type="text"
            class="form-control"
            id="customer_name"
            v-model.trim="order.customer_name"
          />
        </div>

        <div class="col-md-6 mb-2"></div>

        <!-- dates controls -->
        <div class="col-md-3">
          <label for="provider_signature_date" class="form-label">Firma del Prestador</label>
          <input
            type="date"
            v-model="order.provider_signature_date"
            id="provider_signature_date"
            class="form-control"
            :disabled="order.id"
            @blur="v$.provider_signature_date.$touch"
          />

          <!-- frontend errors -->
          <p
            class="form-text text-danger"
            v-for="error in v$.provider_signature_date.$errors"
            :key="error.$uid"
          >
            {{ error.$message }}
          </p>

          <!-- backend errors -->
          <p
            v-for="(error, i) in getFieldErrors('provider_signature_date')"
            :key="`backend-${i}`"
            class="form-text text-danger"
          >
            {{ error }}
          </p>
        </div>

        <div class="col-md-3">
          <label for="customer_signature_date" class="form-label">Firma del Cliente</label>
          <input
            type="date"
            v-model="order.customer_signature_date"
            id="customer_signature_date"
            class="form-control"
          />

          <!-- frontend errors -->
          <p
            class="form-text text-danger"
            v-for="error in v$.customer_signature_date.$errors"
            :key="error.$uid"
          >
            {{ error.$message }}
          </p>

          <!-- backend errors -->
          <p
            v-for="(error, i) in getFieldErrors('customer_signature_date')"
            :key="`backend-${i}`"
            class="form-text text-danger"
          >
            {{ error }}
          </p>
        </div>

        <div class="col-md-3">
          <label for="total" class="form-label">Importe Total</label>
          <p id="total">{{ orderTotalComputed.toFixed(2) }}</p>
        </div>

        <!-- buttons -->
        <div class="mb-4">
          <button type="submit" class="btn btn-sm btn-primary">
            {{ !order.id ? 'Guardar' : 'Actualizar' }}
          </button>
          <button type="button" class="btn btn-sm btn-secondary" @click="handleGoBack">
            Cancelar
          </button>
        </div>
      </form>
    </div>
  </div>
  <!-- end row -->
</template>
