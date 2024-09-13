<template>
  <div class="row">
    <!-- side menu -->
    <div class="col-md-2">
      <ul :class="listGroup.listGroup">
        <li :class="listGroup.listGroupItem">
          <strong>Órdenes</strong>
        </li>
        <li :class="listGroup.listGroupItem">
          <router-link :to="{ name: 'orders' }">Órdenes</router-link>
        </li>
        <li :class="listGroup.listGroupItem">
          <a href="#" @click="loadData()">Recargar Datos</a>
        </li>
      </ul>
    </div>

    <!-- main content -->
    <div class="col-md-10">
      <!-- form -->
      <form @submit.prevent class="row">
        <!-- backend errors -->
        <span v-if="orderBackendErrors.non_field_errors">
          <p
            class="form-text text-danger"
            v-for="(error, i) in orderBackendErrors.non_field_errors"
            :key="i"
          >
            {{ error }}
          </p>
        </span>

        <!-- customer control -->
        <div class="col-md-3 mb-2">
          <div class="row g-1">
            <label for="customer" class="form-label">Cliente</label>
            <div class="col-md-11">
              <select
                autofocus
                id="customer"
                class="form-select form-select-sm"
                v-model.trim="order.customer">
                <option v-for="customer in customers" :key="customer.id" :value="customer.id">
                  {{ customer.name }}
                </option>
              </select>

              <!-- @blur="v$.customer.$touch" -->
              <!-- frontend errors -->
              <!-- <span v-if="v$.customer.$errors">
                        <p
                          class="form-text text-danger"
                          v-for="error in v$.customer.$errors"
                          :key="error.$uid">{{ error.$message }}</p>
                      </span> -->

              <!-- backend errors -->
              <span v-if="orderBackendErrors.customer">
                <p
                  class="form-text text-danger"
                  v-for="(error, i) in orderBackendErrors.customer"
                  :key="i"
                >
                  {{ error }}
                </p>
              </span>
            </div>

            <div class="col-md-1">
              <button class="btn btn-sm btn-danger" @click="clearCustomer()">X</button>
            </div>
          </div>
        </div>

        <!-- customer_dependency control -->
        <div class="col-md-3 mb-2">
          <div class="row g-1">
            <label for="customer_dependency" class="form-label">Dependencia</label>
            <div class="col-md-11">
              <select
                id="customer_dependency"
                class="form-select form-select-sm"
                v-model.trim="order.customer_dependency">
                <option
                  v-for="dependency in dependencies"
                  :key="dependency.id"
                  :value="dependency.id"
                >
                  {{ dependency.name }}
                </option>
              </select>

              <!-- @blur="v$.customer_dependency.$touch" -->
              <!-- frontend errors -->
              <!-- <span v-if="v$.customer_dependency.$errors">
                        <p
                          class="form-text text-danger"
                          v-for="error in v$.customer_dependency.$errors"
                          :key="error.$uid">{{ error.$message }}</p>
                      </span> -->

              <!-- backend errors -->
              <span v-if="orderBackendErrors.customer_dependency">
                <p
                  class="form-text text-danger"
                  v-for="(error, i) in orderBackendErrors.customer_dependency"
                  :key="i"
                >
                  {{ error }}
                </p>
              </span>
            </div>
            <div class="col-md-1">
              <button class="btn btn-sm btn-danger" @click="clearCustomerDependency()">X</button>
            </div>
          </div>
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
          <span v-if="v$.symptom.$errors">
            <p class="form-text text-danger" v-for="error in v$.symptom.$errors" :key="error.$uid">
              {{ error.$message }}
            </p>
          </span>

          <!-- backend errors -->
          <span v-if="orderBackendErrors.symptom">
            <p
              class="form-text text-danger"
              v-for="(error, i) in orderBackendErrors.symptom"
              :key="i"
            >
              {{ error }}
            </p>
          </span>
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
          <span v-if="v$.flaw.$errors">
            <p class="form-text text-danger" v-for="error in v$.flaw.$errors" :key="error.$uid">
              {{ error.$message }}
            </p>
          </span>

          <!-- backend errors -->
          <span v-if="orderBackendErrors.flaw">
            <p class="form-text text-danger" v-for="(error, i) in orderBackendErrors.flaw" :key="i">
              {{ error }}
            </p>
          </span>
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
          <span v-if="v$.repair_description.$errors">
            <p
              class="form-text text-danger"
              v-for="error in v$.repair_description.$errors"
              :key="error.$uid"
            >
              {{ error.$message }}
            </p>
          </span>

          <!-- backend errors -->
          <span v-if="orderBackendErrors.repair_description">
            <p
              class="form-text text-danger"
              v-for="(error, i) in orderBackendErrors.repair_description"
              :key="i"
            >
              {{ error }}
            </p>
          </span>
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
          <span v-if="v$.folio.$errors">
            <p class="form-text text-danger" v-for="error in v$.folio.$errors" :key="error.$uid">
              {{ error.$message }}
            </p>
          </span>

          <!-- backend errors -->
          <span v-if="orderBackendErrors.folio">
            <p
              class="form-text text-danger"
              v-for="(error, i) in orderBackendErrors.folio"
              :key="i"
            >
              {{ error }}
            </p>
          </span>
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
          <span v-if="v$.support.$errors">
            <p class="form-text text-danger" v-for="error in v$.support.$errors" :key="error.$uid">
              {{ error.$message }}
            </p>
          </span>

          <!-- backend errors -->
          <span v-if="orderBackendErrors.support">
            <p
              class="form-text text-danger"
              v-for="(error, i) in orderBackendErrors.support"
              :key="i"
            >
              {{ error }}
            </p>
          </span>
        </div>
        <!-- currency control -->
        <div class="col-md-3">
          <label for="currency" class="form-label">Moneda</label>
          <select
            name="currency"
            id="currency"
            class="form-select form-select-sm"
            v-model.number="order.currency">
            <option
              v-for="currency in currencies"
              :key="currency.id"
              :value="currency.id">{{ currency.name }}</option>            
          </select>
        </div>

        <!-- check_diagnosis control -->
        <div class="col-md-2 mb-2">
          <label for="check_diagnosis">Rev/Diagnóstico</label>
          <input
            type="checkbox"
            id="check_diagnosis"
            class="form-check"
            v-model.trim="order.check_diagnosis"
          />
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

        <!-- kit control -->
        <div class="col-md-3 mb-2">
          <label for="kit">Equipo</label>
          <select id="kit" class="form-select" v-model.trim="order.kit" @blur="v$.kit.$touch">
            <option v-for="kit in kits" :key="kit.id" :value="kit.id">{{ kit.name }}</option>
          </select>

          <!-- frontend errors -->
          <span v-if="v$.kit.$errors">
            <p class="form-text text-danger" v-for="error in v$.kit.$errors" :key="error.$uid">
              {{ error.$message }}
            </p>
          </span>

          <!-- backend errors -->
          <span v-if="orderBackendErrors.kit">
            <p class="form-text text-danger" v-for="(error, i) in orderBackendErrors.kit" :key="i">
              {{ error }}
            </p>
          </span>
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
          <span v-if="v$.kit_brand.$errors">
            <p
              class="form-text text-danger"
              v-for="error in v$.kit_brand.$errors"
              :key="error.$uid"
            >
              {{ error.$message }}
            </p>
          </span>

          <!-- backend errors -->
          <span v-if="orderBackendErrors.kit_brand">
            <p
              class="form-text text-danger"
              v-for="(error, i) in orderBackendErrors.kit_brand"
              :key="i"
            >
              {{ error }}
            </p>
          </span>
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
          <span v-if="v$.kit_model.$errors">
            <p
              class="form-text text-danger"
              v-for="error in v$.kit_model.$errors"
              :key="error.$uid"
            >
              {{ error.$message }}
            </p>
          </span>

          <!-- backend errors -->
          <span v-if="orderBackendErrors.kit_model">
            <p
              class="form-text text-danger"
              v-for="(error, i) in orderBackendErrors.kit_model"
              :key="i"
            >
              {{ error }}
            </p>
          </span>
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
          <span v-if="v$.kit_serial.$errors">
            <p
              class="form-text text-danger"
              v-for="error in v$.kit_serial.$errors"
              :key="error.$uid"
            >
              {{ error.$message }}
            </p>
          </span>

          <!-- backend errors -->
          <span v-if="orderBackendErrors.kit_serial">
            <p
              class="form-text text-danger"
              v-for="(error, i) in orderBackendErrors.kit_serial"
              :key="i"
            >
              {{ error }}
            </p>
          </span>
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
          ></textarea>

          <!-- backend errors -->
          <span v-if="orderBackendErrors.job_description">
            <p
              class="form-text text-danger"
              v-for="(error, i) in orderBackendErrors.job_description"
              :key="i"
            >
              {{ error }}
            </p>
          </span>
        </div>

        <!-- items_times control -->
        <div class="row">
          <div class="col-md-12 mb-2">
            <button class="btn btn-sm btn-primary" @click="createItemTime(1)">Agregar artículo</button>
          </div>

          <div class="col-md-6">Artículo o Servicio</div>

          <div class="col-md-1">U/M</div>
          <div class="col-md-1">Precio</div>
        </div>

        <div class="col-md-12 mb-2" style="overflow-y: auto; height: 400px">
          <template v-for="(i, index) in order.itemtime_set" :key="index">
            <item-time
              v-if="order.itemtime_set.length > 0"
              :items="items"
              :item="i"
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

        <div class="col-md-3 mb-2">
          <label for="customer_name">Nombre</label>
          <input
            type="text"
            class="form-control"
            id="customer_name"
            v-model.trim="order.customer_name"
          />
        </div>

        <div class="col-md-3 mb-2"></div>

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
          <span v-if="v$.provider_signature_date.$errors">
            <p
              class="form-text text-danger"
              v-for="error in v$.provider_signature_date.$errors"
              :key="error.$uid"
            >
              {{ error.$message }}
            </p>
          </span>

          <!-- backend errors -->
          <span v-if="orderBackendErrors.provider_signature_date">
            <p
              class="form-text text-danger"
              v-for="(error, i) in orderBackendErrors.provider_signature_date"
              :key="i"
            >
              {{ error }}
            </p>
          </span>
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
          <span v-if="v$.customer_signature_date.$errors">
            <p
              class="form-text text-danger"
              v-for="error in v$.customer_signature_date.$errors"
              :key="error.$uid"
            >
              {{ error.$message }}
            </p>
          </span>

          <!-- backend errors -->
          <span v-if="orderBackendErrors.customer_signature_date">
            <p
              class="form-text text-danger"
              v-for="(error, i) in orderBackendErrors.customer_signature_date"
              :key="i"
            >
              {{ error }}
            </p>
          </span>
        </div>

        <div class="col-md-3">
          <label for="total" class="form-label">Importe Total</label>
          <p id="total">{{ total.toFixed(2) }}</p>
        </div>

        <!-- buttons -->
        <div class="mb-4">
          <button
            @click="order.id ? updateOrder(order) : createOrder(order)"
            type="button"
            class="btn btn-sm btn-primary"
          >
            Guardar
          </button>
          <router-link :to="{ name: 'orders' }" class="btn btn-sm btn-secondary"
            >Cancelar</router-link
          >
        </div>
      </form>
    </div>
  </div>
  <!-- end row -->
</template>

<script setup>
// vue
import { RouterLink, useRouter, useRoute } from 'vue-router'
import { ref, onMounted, computed } from 'vue'

// third
import { useVuelidate } from '@vuelidate/core'
import { required, helpers } from '@vuelidate/validators'

// app
import { listCustomer } from '../../services/customer.service'
import { listKit } from '../../services/kit.service'
import { listItem } from '../../services/item.service'
import ItemTime from '../../components/ItemTime.vue'
import { detailOrderUpdate, postOrder, putOrder } from '../../services/order.service'
import { listCustomerDependecy } from '../../services/customerDependency.service'
import listGroup from '../../assets/js/bootstrap_classes/listGroup'
import { listCurrencies } from '../../services/currency.service'

// main object
const order = ref({
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
  provider: 1,
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
const currencies = ref([]);

// routing objects
const router = useRouter()
const route = useRoute()

// validation rules
const rules = {
  // customer: {
  //   required: helpers.withMessage('El cliente es requerido.', required)
  // },
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
  }
}

// vuelidate object
const v$ = useVuelidate(rules, order)

// order object to be filled with backend errors
const orderBackendErrors = ref({
  customer: [],
  currency: [],
  customer_dependency: [],
  symptom: [],
  flaw: [],
  repair_description: [],
  folio: [],
  check_diagnosis: [],
  repair: [],
  install: [],
  maintenance: [],
  support: [],
  kit: [],
  kit_brand: [],
  kit_model: [],
  kit_serial: [],
  job_description: [],
  itemtime_set: [],
  provider: [],
  provider_signature_date: [],
  customer_signature_date: [],
  check_number: [],
  charge_aprove: [],
  charge_check: [],
  customer_charge: [],
  customer_name: [],
  customer_personal_id: [],
  checked_by: [],
  aproved_by: [],
  non_field_errors: []
})

// preparation of the itemtime_set order property
const createItemTime = (elements=12) => {
  // create 12 elements by default to iterate in the create initial form
  // the binding to the "Add item" button can be called with a lesser value
  for (let index = 0; index < elements; index++) {
    order.value.itemtime_set.push({
      item: 0,
      times: 1
    })
  }
}


// computed property to calculate value of the order
// as its being added items
const total = computed(() => {
  return order.value.itemtime_set
    .filter((itemtime) => itemtime.item !== 0)
    .reduce((count, itemtime) => {
      const itemfiltered = items.value.filter((itf) => itf.id === itemtime.item)
      const itemRaw = itemfiltered[0]
      return count + itemRaw.price * itemtime.times
    }, 0)
})

// delete an item from the form by removing it
// from the order object
const deleteItem = (index) => {
  order.value.itemtime_set.splice(index, 1)
}

// on mounted cycle
onMounted(async () => {
  loadData()
  
  const id = route.params.id
  if (id) {
    const { data } = await detailOrderUpdate(id)
    order.value = data
    order.value.itemtime_set = order.value.itemtime_set.map((itemTime) => {
      return {
        item: itemTime.item,
        times: itemTime.times
      }
    })
  } else {
    // create initial empty objects for itemtime
    createItemTime()
  }
})

const createOrder = async (order) => {
  try {
    if (await v$.value.$validate()) {
      order.itemtime_set = order.itemtime_set.filter((x) => x.item > 0)
      const { data } = await postOrder(order)
      router.push({ name: 'orders_detail', params: { id: data.id } })
    }
  } catch (error) {
    orderBackendErrors.value = error.response.data
    console.log(orderBackendErrors.value)
  }
}

const updateOrder = async (order) => {
  try {
    if (await v$.value.$validate()) {
      order.itemtime_set = order.itemtime_set.filter((x) => x.item > 0)
      const { data } = await putOrder(order)
      router.push({ name: 'orders_detail', params: { id: data.id } })
    }
  } catch (error) {
    orderBackendErrors.value = error.response.data
    console.log(orderBackendErrors.value.itemtime_set)
  }
}

const clearCustomer = () => {
  order.value.customer = ''
}

const clearCustomerDependency = () => {
  order.value.customer_dependency = ''
}

const loadData = async () => {
  // get customers
  const respCustomers = await listCustomer()
  customers.value = respCustomers.data
  // get kits
  const respKits = await listKit()
  kits.value = respKits.data
  // get items
  const respItems = await listItem()
  items.value = respItems.data
  // get dependencies
  const respDependencies = await listCustomerDependecy()
  dependencies.value = respDependencies.data
  // get currencies
  const respCurrencies = await listCurrencies()
  currencies.value = respCurrencies.data;
}
</script>
