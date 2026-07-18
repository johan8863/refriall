<script setup>
/*
 * Bills creation form
 */

// vue
import { onMounted, ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'

// third
import { useVuelidate } from '@vuelidate/core'
import { helpers, required } from '@vuelidate/validators'

// app
import { billService } from '../../services/billService'
import { customerService } from '../../services/customerService'
import { orderService } from '../../services/orderService'
import { providerService } from '../../services/providerService'
import { currencyService } from '../../services/currencyService'
import { useCheckAllCheckboxes } from '../../composables/CheckAllCheckboxesComposable'
import BillFormMenu from '../../components/bills/menus/BillFormMenu.vue'
import { useRouting } from '../../composables/routingFunctions.js'
import { useErrorHandler } from '../../composables/useErrorHandler.js'

// main reactive object
const bill = ref({
  id: null,
  customer: null,
  currency: null,
  folio: '',
  provider: null,
  provider_signature_date: '',
  customer_signature_date: '',
  orders: [],
  get_orders: [],
  check_number: '',
  charge_aprove: '',
  charge_check: '',
  customer_charge: '',
  customer_name: '',
  customer_personal_id: '',
  checked_by: '',
  aproved_by: ''
})

// reactive objects to be rendered in form
const customers = ref([])
const providers = ref([])
const orders = ref([])
const currencies = ref([])
const freeOrders = ref([])
const billProvider = ref(null)
const billCustomer = ref(null)

// routes utilities and handlers
const router = useRouter()
const route = useRoute()

const { goBack } = useRouting()

const handleGoBack = () => {
  try {
    goBack('bills', 'bills_detail', bill.value.id)
  } catch (error) {
    console.error(error)
  }
}

// loading status
const isLoading = ref(false)

// composable errors objects
const { errorMessage, backendErrors, handleError, getFieldErrors } = useErrorHandler({
  objectName: 'Factura'
})

// custom rules
const atLeastOneOrder = () => bill.value.orders.length > 0

// vuelidate rules
const rules = {
  customer: {
    required: helpers.withMessage('El cliente es requerido.', required)
  },
  currency: {
    required: helpers.withMessage('La moneda es requerida.', required)
  },
  folio: {
    required: helpers.withMessage('El folio es requerido.', required)
  },
  orders: {
    atLeastOneOrder: helpers.withMessage(
      'Tiene que seleccionar al menos una orden.',
      atLeastOneOrder
    )
  },
  provider_signature_date: {
    required: helpers.withMessage('La firma del prestador es requerida.', required)
  },
  customer_signature_date: {
    required: helpers.withMessage('La firma del cliente es requerida.', required)
  }
}

// vuelidate object
const v$ = useVuelidate(rules, bill)

/* methods */

/*
 * Handles form submission to create or update a bill
 */
const handleSubmit = async () => {
  // vuelidate validations
  if (await v$.value.$validate()) {
    try {
      // update or create related to bill.value.id
      const isUpdate = !!bill.value.id
      const method = isUpdate ? billService.putBill(bill.value) : billService.postBill(bill.value)

      // on success return to customer detail view
      const { data } = await method
      router.push({ name: 'bills_detail', params: { id: data.id } })
    } catch (error) {
      console.error('General error:', error)
      handleError(error)
    }
  } else {
    // always log vuelidate errors
    // just in case an unexpected behavior
    console.error('Vuelidate errors:', v$.value.$errors)
    return
  }
}

/*
 * Handles insertion of non existing providers
 */
const insertNonExistingProvider = () => {
  const existProvider = providers.value.some((provider) => provider.id === billProvider.value.id)
  if (!existProvider) {
    providers.value.push(billProvider.value)
  }
}

/*
 * Handles insertion of non existing customers
 */
const insertNonExistingCustomer = () => {
  const existCustomer = customers.value.some((customer) => customer.id === billCustomer.value.id)
  if (!existCustomer) {
    customers.value.push(billCustomer.value)
  }
}

/*
 * Function to load providers with free orders to match given a currency
 */
const chargeProviderNoBill = async () => {
  try {
    // start loading state
    isLoading.value = true
    // reseting error state
    errorMessage.value = null
    // reseting bill both provider and orders
    // every time a new currency is selected
    bill.value.provider = ''
    providers.value = []
    orders.value = []
    // getting backend data
    const respProviders = await providerService.listProviderCurrencyOrderNoBill(bill.value.currency)
    providers.value = respProviders.data
  } catch (error) {
    error('General error:', error)
    handleError(error)
  } finally {
    isLoading.value = false
  }
}

/*
 * Get the customers with free orders given a currency and a provider
 */
const customersFromProvider = async () => {
  try {
    // start loading state
    isLoading.value = true
    // reset orders objects
    orders.value = []
    bill.value.orders = []
    // if available both currency and provider, retrieve/update the list of customers
    if (bill.value.currency && bill.value.provider) {
      customers.value = (
        await customerService.listCustomerOrdersNoBill(bill.value.currency, bill.value.provider)
      ).data
      // if customer changes, retrieve/update the list of orders
      if (bill.value.customer) {
        orders.value = (
          await orderService.getOrdersFromCustomerNotMatched(
            bill.value.currency,
            bill.value.provider,
            bill.value.customer
          )
        ).data
      }
    }
  } catch (error) {
    error('General error:', error)
    handleError(error)
  } finally {
    // finish loading state
    isLoading.value = false
  }
}

/*
 * Get the available orders given a currency, a provider and a customer
 */
const ordersFromCustomer = async () => {
  try {
    // start loading state
    isLoading.value = true
    // reset orders
    orders.value = []
    bill.value.orders = []
    // if both currency and provider, retrieve/update the orders list
    if (bill.value.currency && bill.value.provider) {
      orders.value = (
        await orderService.getOrdersFromCustomerNotMatched(
          bill.value.currency,
          bill.value.provider,
          bill.value.customer
        )
      ).data
    } else {
      // clear orders list otherwise
      orders.value = []
    }
  } catch (error) {
    error('General error:', error)
    handleError(error)
  } finally {
    isLoading.value = false
  }
}

/*
 * Loads required data to pre populate bill edition form
 */
const loadData = async () => {
  try {
    isLoading.value = true

    const [
      { data: respProviders },
      { data: respBillProvider },
      { data: respCustomers },
      { data: respBillCustomer },
      { data: respOrdersByIds },
      { data: respFreeorders }
    ] = await Promise.all([
      providerService.listProviderCurrencyOrderNoBill(bill.value.currency),
      providerService.detailProvider(bill.value.provider),
      customerService.listCustomerOrdersNoBill(bill.value.currency, bill.value.provider),
      customerService.detailCustomer(bill.value.customer),
      orderService.getOrdersByIds(bill.value.orders),
      orderService.getOrdersFromCustomerNotMatched(
        bill.value.currency,
        bill.value.provider,
        bill.value.customer
      )
    ])

    providers.value = respProviders
    billProvider.value = respBillProvider
    insertNonExistingProvider()

    customers.value = respCustomers
    billCustomer.value = respBillCustomer
    insertNonExistingCustomer()

    freeOrders.value = respFreeorders
    orders.value = respOrdersByIds
    orders.value.push(...freeOrders.value)
  } catch (error) {
    error('General error:', error)
    handleError(error)
  } finally {
    isLoading.value = false
  }
}

/*
 * bridge computed property:
 * bill.value.orders is not reactive on itself
 * this writable composable acts as the bidirectional bridge
 * that useCheckAllCheckboxes needs
 */
const selectedOrders = computed({
  get: () => bill.value.orders,
  set: (value) => (bill.value.orders = value)
})

// writable computed to select/deselect all orders
const { checkAllCheckboxes } = useCheckAllCheckboxes(orders, selectedOrders)

onMounted(async () => {
  try {
    isLoading.value = true
    // always load currencies whether the action is to create or update
    const respCurrencies = await currencyService.listCurrencies()
    currencies.value = respCurrencies.data

    const id = route.params.id
    if (id) {
      const { data } = await billService.getForUpdate(id)
      bill.value = data
      await loadData()
    }
  } catch (error) {
    console.error(error)
    errorMessage.value = 'Error cargando datos.'
  } finally {
    isLoading.value = false
  }
})
</script>

<template>
  <div class="row">
    <!-- side menu -->
    <div class="col-md-2">
      <bill-form-menu />
    </div>

    <!-- main content -->

    <!-- Loading data -->
    <div v-if="isLoading" class="col-md-9">
      <div class="d-flex justify-content-center align-items-center" style="min-height: 200px">
        <span role="status" class="text-primary">Cargando datos... </span>
        <span class="spinner-border spinner-border-sm text-primary" aria-hidden="true"></span>
      </div>
    </div>

    <!-- error message -->
    <div v-else-if="errorMessage" class="col-md-4">
      <span class="form-text text-danger">
        {{ errorMessage }}
      </span>
    </div>

    <!-- displaying form -->
    <div v-else class="col-md-9">
      <div v-if="bill.currency && providers.length === 0">
        <span class="text-danger">No hay órdenes libres para asociar.</span>
      </div>

      <!-- form -->
      <form @submit.prevent="handleSubmit" class="row">
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
        <!-- currency control -->
        <div class="col-md-3 mb-2">
          <label for="currency">Moneda</label>
          <select
            name="currency"
            id="currency"
            class="form-select"
            autofocus
            @change="chargeProviderNoBill"
            v-model="bill.currency"
            @blur="v$.currency.$touch"
          >
            <option v-for="currency in currencies" :key="currency.id" :value="currency.id">
              {{ currency.name }}
            </option>
          </select>
          <!-- frontend validations -->
          <p class="form-text text-danger" v-for="error in v$.currency.$errors" :key="error.$uid">
            {{ error.$message }}
          </p>
          <!-- backend validations -->
          <p
            v-for="(error, i) in getFieldErrors('currency')"
            :key="`backend-${i}`"
            class="form-text text-danger"
          >
            {{ error }}
          </p>
        </div>

        <!-- provider control -->
        <div class="col-md-3 mb-2">
          <label for="provider">Prestador</label>
          <select
            name="provider"
            id="provider"
            class="form-select"
            :disabled="!bill.currency || (bill.currency && providers.length === 0)"
            @change="customersFromProvider"
            v-model="bill.provider"
          >
            <option v-for="provider in providers" :key="provider.id" :value="provider.id">
              {{ provider.first_name }}
            </option>
          </select>
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
          <label for="customer">Cliente</label>
          <select
            name="customer"
            id="customer"
            class="form-select"
            :disabled="
              (!bill.currency && !bill.provider) || (bill.currency && customers.length === 0)
            "
            @change="ordersFromCustomer"
            v-model="bill.customer"
          >
            <option v-for="customer in customers" :key="customer.id" :value="customer.id">
              {{ customer.name }}
            </option>
          </select>
          <!-- frontend validations -->
          <p class="form-text text-danger" v-for="error in v$.customer.$errors" :key="error.$uid">
            {{ error.$message }}
          </p>
          <!-- backend errors -->
          <p
            v-for="(error, i) in getFieldErrors('customer')"
            :key="`backend-${i}`"
            class="form-text text-danger"
          >
            {{ error }}
          </p>
        </div>

        <!-- folio control -->
        <div class="col-md-3 mb-2">
          <label for="folio">Folio</label>
          <input
            type="text"
            class="form-control"
            id="folio"
            v-model.trim="bill.folio"
            @blur="v$.folio.$touch"
          />

          <!-- frontend validations -->
          <p class="form-text text-danger" v-for="error in v$.folio.$errors" :key="error.$uid">
            {{ error.$message }}
          </p>

          <!-- backend validations -->
          <p
            v-for="(error, i) in getFieldErrors('folio')"
            :key="`backend-${i}`"
            class="form-text text-danger"
          >
            {{ error }}
          </p>
        </div>
        <div class="col-md-3 mb-2"></div>

        <!-- provider_signature_date control -->
        <div class="col-md-3 mb-2">
          <label for="provider_signature_date">Firma del Prestador</label>
          <input
            type="date"
            name="provider_signature_date"
            id="provider_signature_date"
            class="form-control"
            :disabled="bill.id !== null"
            v-model.trim="bill.provider_signature_date"
            @blur="v$.provider_signature_date.$touch"
          />

          <!-- frontend validations -->
          <p
            class="form-text text-danger"
            v-for="error in v$.provider_signature_date.$errors"
            :key="error.$uid"
          >
            {{ error.$message }}
          </p>
          <!-- backend validations -->
          <p
            v-for="(error, i) in getFieldErrors('provider_signature_date')"
            :key="`backend-${i}`"
            class="form-text text-danger"
          >
            {{ error }}
          </p>
        </div>

        <!-- customer_signature_date control -->
        <div class="col-md-3 mb-2">
          <label for="customer_signature_date">Firma del Cliente</label>
          <input
            type="date"
            name="customer_signature_date"
            id="customer_signature_date"
            class="form-control"
            v-model.trim="bill.customer_signature_date"
            @blur="v$.customer_signature_date.$touch"
          />

          <!-- frontend validations -->
          <p
            class="form-text text-danger"
            v-for="error in v$.customer_signature_date.$errors"
            :key="error.$uid"
          >
            {{ error.$message }}
          </p>

          <!-- backend validations -->
          <p
            v-for="(error, i) in getFieldErrors('customer_signature_date')"
            :key="`backend-${i}`"
            class="form-text text-danger"
          >
            {{ error }}
          </p>
        </div>

        <!-- orders control -->
        <div class="col-md-12">
          <table class="table">
            <thead>
              <tr>
                <th>
                  <input
                    type="checkbox"
                    name=""
                    id=""
                    class="form-check"
                    v-model="checkAllCheckboxes"
                  />
                </th>
                <th>Folio</th>
                <th>Cliente</th>
                <th>Dependencia</th>
                <th>Importe Total</th>
              </tr>
            </thead>

            <tbody>
              <tr v-for="order in orders" :key="order.id">
                <td>
                  <input
                    type="checkbox"
                    name=""
                    :id="order.id"
                    class="form-check"
                    v-model="bill.orders"
                    :value="order.id"
                  />
                </td>
                <td>
                  <router-link
                    :to="{ name: 'orders_detail', params: { id: order.id } }"
                    target="_blank"
                    >{{ order.folio }}</router-link
                  >
                </td>
                <td v-if="order.customer">{{ order.customer.name }}</td>
                <td v-else>-</td>
                <td v-if="order.customer_dependency">{{ order.customer_dependency.name }}</td>
                <td v-else>-</td>
                <td>{{ order.get_total_amount }}</td>
              </tr>
            </tbody>
          </table>
          <!-- frontend validations -->
          <p class="form-text text-danger" v-for="error in v$.orders.$errors" :key="error.$uid">
            {{ error.$message }}
          </p>
          <!-- backend validations -->
          <p
            v-for="(error, i) in getFieldErrors('orders')"
            :key="`backend-${i}`"
            class="form-text text-danger"
          >
            {{ error }}
          </p>
        </div>
        <!-- check_number control -->
        <div class="col-md-3 mb-2">
          <label for="check_number">Nro. de Cheque</label>
          <input
            type="text"
            class="form-control"
            id="check_number"
            v-model.trim="bill.check_number"
          />
          <!-- backend validations -->
          <p
            v-for="(error, i) in getFieldErrors('check_number')"
            :key="`backend-${i}`"
            class="form-text text-danger"
          >
            {{ error }}
          </p>
        </div>

        <!-- charge_aprove control -->
        <div class="col-md-3 mb-2">
          <label for="charge_aprove">Cargo Aprueba</label>
          <input
            type="text"
            class="form-control"
            id="charge_aprove"
            v-model.trim="bill.charge_aprove"
          />
          <!-- backend validations -->
          <p
            v-for="(error, i) in getFieldErrors('charge_aprove')"
            :key="`backend-${i}`"
            class="form-text text-danger"
          >
            {{ error }}
          </p>
        </div>

        <!-- charge_check control -->
        <div class="col-md-3 mb-2">
          <label for="charge_check">Cargo Revisa</label>
          <input
            type="text"
            class="form-control"
            id="charge_check"
            v-model.trim="bill.charge_check"
          />
          <!-- backend validations -->
          <p
            v-for="(error, i) in getFieldErrors('charge_check')"
            :key="`backend-${i}`"
            class="form-text text-danger"
          >
            {{ error }}
          </p>
        </div>

        <!-- customer_charge control -->
        <div class="col-md-3 mb-2">
          <label for="customer_charge">Cargo del Cliente</label>
          <input
            type="text"
            class="form-control"
            id="customer_charge"
            v-model.trim="bill.customer_charge"
          />
          <!-- backend validations -->
          <p
            v-for="(error, i) in getFieldErrors('customer_charge')"
            :key="`backend-${i}`"
            class="form-text text-danger"
          >
            {{ error }}
          </p>
        </div>

        <!-- customer_name control -->
        <div class="col-md-3 mb-2">
          <label for="customer_name">Nombre del Cliente</label>
          <input
            type="text"
            class="form-control"
            id="customer_name"
            v-model.trim="bill.customer_name"
          />
          <!-- backend validations -->
          <p
            v-for="(error, i) in getFieldErrors('customer_name')"
            :key="`backend-${i}`"
            class="form-text text-danger"
          >
            {{ error }}
          </p>
        </div>

        <!-- customer_personal_id control -->
        <div class="col-md-3 mb-2">
          <label for="customer_personal_id">CI del Cliente</label>
          <input
            type="text"
            class="form-control"
            id="customer_personal_id"
            v-model.trim="bill.customer_personal_id"
          />
          <!-- backend validations -->
          <p
            v-for="(error, i) in getFieldErrors('customer_personal_id')"
            :key="`backend-${i}`"
            class="form-text text-danger"
          >
            {{ error }}
          </p>
        </div>

        <!-- checked_by control -->
        <div class="col-md-3 mb-2">
          <label for="checked_by">Revisado por</label>
          <input type="text" class="form-control" id="checked_by" v-model.trim="bill.checked_by" />
          <!-- backend validations -->
          <p
            v-for="(error, i) in getFieldErrors('checked_by')"
            :key="`backend-${i}`"
            class="form-text text-danger"
          >
            {{ error }}
          </p>
        </div>

        <!-- aproved_by control -->
        <div class="col-md-3 mb-2">
          <label for="aproved_by">Cargo del Cliente</label>
          <input type="text" class="form-control" id="aproved_by" v-model.trim="bill.aproved_by" />
          <!-- backend validations -->
          <p
            v-for="(error, i) in getFieldErrors('aproved_by')"
            :key="`backend-${i}`"
            class="form-text text-danger"
          >
            {{ error }}
          </p>
        </div>

        <!-- buttons -->
        <div class="mb-5">
          <!-- 
            the order in the ternary operator is due to the fact that 
            this form is more often used to create than to update 
          -->
          <button type="submit" class="btn btn-sm btn-primary">
            {{ !bill.id ? 'Guardar' : 'Actualizar' }}
          </button>
          <button type="button" class="btn btn-sm btn-secondary" @click="handleGoBack">
            Cancelar
          </button>
        </div>
        <!-- end form -->
      </form>
      <!-- end main content -->
    </div>
  </div>
</template>
