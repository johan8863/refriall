<script setup>
/*
 * Bills form
 */

// vue
import { computed, onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'

// third
import { helpers, required } from '@vuelidate/validators'
import { useVuelidate } from '@vuelidate/core'

// app
import BillFormMenu from '@/components/bills/menus/BillFormMenu.vue'
import { billService } from '@/services/billService'
import { currencyService } from '@/services/currencyService'
import { customerService } from '@/services/customerService'
import { orderService } from '@/services/orderService'
import { providerService } from '@/services/providerService'
import { useCheckAllCheckboxes } from '@/composables/CheckAllCheckboxesComposable'
import { useForm } from '@/composables/useForm.js'

// main bill object to be used in composable
const initialData = {
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
}

// reactive objects to be rendered in form
const customers = ref([])
const providers = ref([])
const orders = ref([])
const currencies = ref([])
const freeOrders = ref([])
const billProvider = ref(null)
const billCustomer = ref(null)

// routes utilities and handlers
const route = useRoute()

// loading status
// currencies allways will be loaded because they are
// the starting point in the bill form
const isLoadingCurrencies = ref(false)
// create form loading status
const isLoadingProvider = ref(false)
const isLoadingCustomer = ref(false)
const isLoadingOrders = ref(false)

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

const {
  formData: bill,
  isLoading: isLoadingData,
  isSaving,
  errorMessage,
  backendErrors,
  v$,
  loadData,
  handleSubmit,
  handleGoBack,
  clearErrors,
  getFieldErrors
} = useForm({
  initialData,
  rules,
  service: billService,
  objectName: 'Factura',
  createMethod: 'postBill',
  updateMethod: 'putBill',
  detailMethod: 'getForUpdate',
  listView: 'bills',
  detailView: 'bills_detail'
})

/* methods */

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
  // start loading state
  isLoadingProvider.value = true

  // clear errors
  clearErrors()

  // reset provider, customer and orders bill
  // every time a new currency is selected
  bill.value.provider = ''
  bill.value.customer = ''
  providers.value = []
  customers.value = []
  orders.value = []

  try {
    // getting backend data
    const respProviders = await providerService.listProviderCurrencyOrderNoBill(bill.value.currency)
    providers.value = respProviders.data
  } catch (error) {
    console.error('General errors:', { error })
    handleError(error)
  } finally {
    isLoadingProvider.value = false
  }
}

/*
 * Get the customers with free orders given a currency and a provider
 */
const customersFromProvider = async () => {
  // start loading state
  isLoadingCustomer.value = true

  // reset orders objects
  orders.value = []
  bill.value.orders = []

  // clear errors
  clearErrors()

  try {
    // if available both currency and provider, retrieve/update the list of customers
    if (bill.value.currency && bill.value.provider) {
      const { data: respCustomers } = await customerService.listCustomerOrdersNoBill(
        bill.value.currency,
        bill.value.provider
      )
      customers.value = respCustomers
      // if customer changes, retrieve/update the list of orders
      if (bill.value.customer) {
        const { data: respOrders } = await orderService.getOrdersFromCustomerNotMatched(
          bill.value.currency,
          bill.value.provider,
          bill.value.customer
        )
        orders.value = respOrders
      }
    }
  } catch (error) {
    console.error('General errors:', { error })
    handleError(error)
  } finally {
    // finish loading state
    isLoadingCustomer.value = false
  }
}

/*
 * Get the available orders given a currency, a provider and a customer
 */
const ordersFromCustomer = async () => {
  // start loading state
  isLoadingOrders.value = true

  // reset orders
  orders.value = []
  bill.value.orders = []

  // clear errors
  clearErrors()

  try {
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
    console.error('General errors:', { error })
    handleError(error)
  } finally {
    isLoadingOrders.value = false
  }
}

/*
 * Loads required data to pre populate bill edition form
 */
const loadBillFormData = async () => {
  try {
    // load the rest of the data needed to populate the form
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

    // we need free orders in case that arise a new order
    // that matches the currency, customer and provider on the bill
    freeOrders.value = respFreeorders
    orders.value = respOrdersByIds
    orders.value.push(...freeOrders.value)
  } catch (error) {
    console.error('General errors:', { error })
    handleError(error)
  } finally {
    // finish loading state
    isLoadingData.value = false
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
  // start loading state
  isLoadingCurrencies.value = true
  try {
    // always load currencies whether the action is to create or update
    const respCurrencies = await currencyService.listCurrencies()
    currencies.value = respCurrencies.data

    const id = route.params.id
    if (id) {
      await loadData(id)
      await loadBillFormData()
    }
  } catch (error) {
    console.error('General errors:', { error })
    handleError(error)
  } finally {
    // finish loading state
    isLoadingCurrencies.value = false
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
    <!-- first load currencies regardless of the use case(create or update) -->
    <div v-if="isLoadingCurrencies" class="col-md-9">
      <div class="d-flex justify-content-center align-items-center" style="min-height: 200px">
        <span role="status" class="text-primary">Cargando Monedas... </span>
        <span class="spinner-border spinner-border-sm text-primary" aria-hidden="true"></span>
      </div>
    </div>
    <!-- in case of update only -->
    <div v-else-if="isLoadingData" class="col-md-9">
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
      <div v-if="bill.currency && !isLoadingProvider && providers.length === 0">
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
          <!-- frontend errors -->
          <p class="form-text text-danger" v-for="error in v$.currency.$errors" :key="error.$uid">
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

        <!-- provider control -->
        <div class="col-md-3 mb-2">
          <label for="provider">
            Prestador
            <span
              v-if="isLoadingProvider"
              class="spinner-border spinner-border-sm text-body"
              aria-hidden="true"
            ></span>
          </label>
          <select
            name="provider"
            id="provider"
            class="form-select"
            :disabled="
              !bill.currency || (bill.currency && providers.length === 0) || isLoadingProvider
            "
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
          <label for="customer">
            Cliente
            <span
              v-if="isLoadingCustomer"
              class="spinner-border spinner-border-sm text-body"
              aria-hidden="true"
            ></span>
          </label>
          <select
            name="customer"
            id="customer"
            class="form-select"
            :disabled="
              (!bill.currency && !bill.provider) ||
              (bill.currency && customers.length === 0) ||
              isLoadingCustomer
            "
            @change="ordersFromCustomer"
            v-model="bill.customer"
          >
            <option v-for="customer in customers" :key="customer.id" :value="customer.id">
              {{ customer.name }}
            </option>
          </select>
          <!-- frontend errors -->
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

        <!-- orders control -->
        <div class="col-md-12">
          <fieldset :disabled="isLoadingOrders || orders.length === 0">
            <table class="table">
              <thead>
                <tr>
                  <th>
                    <span
                      v-if="isLoadingOrders"
                      class="spinner-border spinner-border-sm text-body"
                      aria-hidden="true"
                    ></span>
                    <input
                      v-else
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
          </fieldset>
          <!-- frontend errors -->
          <p class="form-text text-danger" v-for="error in v$.orders.$errors" :key="error.$uid">
            {{ error.$message }}
          </p>
          <!-- backend errors -->
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
          <!-- backend errors -->
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
          <!-- backend errors -->
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
          <!-- backend errors -->
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
          <!-- backend errors -->
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
          <!-- backend errors -->
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
          <!-- backend errors -->
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
          <!-- backend errors -->
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
          <!-- backend errors -->
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
          <button type="submit" class="btn btn-sm btn-primary" :disabled="isSaving">
            <span v-if="isSaving" class="spinner-border spinner-border-sm me-1"></span>
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
