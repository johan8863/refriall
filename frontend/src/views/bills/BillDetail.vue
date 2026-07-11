<script setup>
// vue
import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'

// app
import { billService } from '../../services/billService'

// third
import html2pdf from 'html2pdf.js'
import BillDetailMenu from '../../components/bills/menus/BillDetailMenu.vue'

// main object
const bill = ref({
  id: null,
  customer: null,
  customer_dependency: null,
  folio: '',
  provider: null,
  provider_signature_date: '',
  customer_signature_date: '',
  get_orders: [],
  get_orders_folio: [],
  get_total_amount: '',
  get_total_amount_revision: '',
  get_total_amount_prod: '',
  get_total_amount_concept: '',
  get_total_amount_repair: '',
  get_total_amount_maintenace: '',
  get_total_amount_install: '',
  get_total_amount_unmounting: '',
  check_number: '',
  charge_aprove: '',
  charge_check: '',
  customer_charge: '',
  customer_name: '',
  customer_personal_id: '',
  checked_by: '',
  aproved_by: ''
})

// errors holder object
const billBackendErrors = ref(null)

// loading status
const isLoading = ref(false)

// errors
const errorMessage = ref(null)

// pagination objects
const billToPaginate = ref(null)
const paginatedBills = ref([])

// routing utulities
const route = useRoute()

onMounted(async () => {
  try {
    // start loading state
    isLoading.value = true

    // get order data
    const resp = await billService.detailBill(route.params.id)
    bill.value = resp.data

    // pagination logic
    prepareBillToPaginate(billToPaginate, bill)
    paginatedBills.value = paginate(billToPaginate, 12)
  } catch (error) {
    console.error('General error', error)
    if (error.response) {
      if (error.response.status === 404) {
        errorMessage.value = 'Factura no encontrada'
      }
      if (error.response.status === 500) {
        errorMessage.value = 'Error interno del servidor, consulte al desarrollador.'
      }
    } else if (error.request) {
      errorMessage.value =
        'Servidor no responde, intente más tarde, si el problema persiste, consulte al desarrollador.'
    } else {
      errorMessage.value = 'Error inesperado, consulte al desarrollador.'
    }
  } finally {
    // stop loading state
    isLoading.value = false
  }
})

const mergeItemsTimes = (itemsTimes) => {
  try {
    return Object.values(
      // the final resilt of reduce will be an object of objects
      // therefore let's split it into an array
      itemsTimes.reduce(
        (acc, { item: { code, get_item_type, get_measurement, name, price }, times }) => {
          // Prettier autocompletes this semicolon to prevent execution risks
          // if doesn't exists an object with the key 'code', create it,
          // otherwise just crease times attr
          ;(acc[code] ??= {
            item: { code, get_item_type, get_measurement, name, price },
            times: 0
          }).times += times
          return acc
        },
        // initial empty object as recommended at
        //https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/reduce#sum_of_values_in_an_object_array
        {}
      )
    )
  } catch (error) {
    console.error('General error:', error)
    if (error instanceof TypeError) {
      console.error("Array must contain values if initial value isn't provided")
    }
  }
}

const prepareBillToPaginate = (billToPaginate, bill) => {
  // fill the billToPaginate items attrs with all the items from
  // all the orders of the current bill

  // first sepparate the orders from the bill to take advamtage of the destructuring
  const { get_orders, ...rest } = bill.value

  // second assign the billToPaginate object all bill attrs but the get_orders one
  billToPaginate.value = rest
  // create an aitems attr to the object and fill it
  billToPaginate.value.items = []
  get_orders.forEach((element) =>
    element.itemtime_set.forEach((item) => billToPaginate.value.items.push(item))
  )

  billToPaginate.value.items = mergeItemsTimes(billToPaginate.value.items)
}

const paginate = (bill, itemsPerPage, start = 0, pages = []) => {
  if (start >= bill.value.items.length) {
    return pages
  }

  const end = start + itemsPerPage
  const { items, ...rest } = bill.value

  pages.push({ items: items.slice(start, end), ...rest })
  return paginate(bill, itemsPerPage, end, pages)
}

function pdf() {
  const element = document.getElementById('bill-to-pdf')
  const opt = {
    filename: `factura_${bill.value.folio}_${bill.value.customer.name}`
  }

  html2pdf().from(element).set(opt).save()
}
</script>

<template>
  <div class="row">
    <!-- side menu -->
    <div class="col-md-2">
      <bill-detail-menu :bill="bill" @on-p-d-f="pdf" />
    </div>

    <!-- main content -->

    <!-- loading bill data -->
    <div v-if="isLoading" class="col-md-9">
      <div class="d-flex justify-content-center align-items-center" style="min-height: 200px">
        <span role="status" class="text-primary">Cargando datos... </span>
        <span class="spinner-border spinner-border-sm text-primary" aria-hidden="true"></span>
      </div>
    </div>

    <!-- error message -->
    <div v-else-if="billBackendErrors" class="col-md-4">
      <span class="form-text text-danger">
        {{ billBackendErrors }}
      </span>
    </div>

    <!-- displaying bill data -->
    <div v-else class="col-md-9">
      <!-- bill info -->
      <div id="bill-to-pdf">
        <!-- paginated bills -->
        <div v-for="(paginatedBill, index) of paginatedBills" :key="index" class="row px-3 py-1">
          <div
            class="col-md-9 d-flex align-items-center justify-content-center border-bottom border-3 mb-1"
          >
            <h3>Factura</h3>
          </div>

          <div class="col-md-3 border-bottom pb-1 border-3 mb-1">
            <img
              src="../../assets/logo.png"
              class="img-fluid"
              alt="refriall logo"
              style="height: 100px"
            />
          </div>

          <div v-if="paginatedBill.customer" class="col-md-5 border-bottom border-2 mb-1">
            <span class="d-block fw-bold">Cliente</span>
            <span class="d-block">{{ paginatedBill.customer.name }}</span>
            <span class="d-block">{{ paginatedBill.customer.address }}</span>
            <span class="d-block">{{ paginatedBill.customer.bank_account_header }}</span>
            <span class="d-block">{{ paginatedBill.customer.bank_account }}</span>
          </div>

          <div class="col-md-5 border-bottom border-2 mb-1">
            <span class="d-block fw-bold">Prestador</span>
            <span class="d-block">Código TPCP: {{ paginatedBill.provider.tcp_code }}</span>
            <span class="d-block"
              >Titular de Cta: {{ paginatedBill.provider.bank_account_header }}</span
            >
            <span class="d-block"
              >No. de cuenta TPCP: {{ paginatedBill.provider.bank_account }}</span
            >
            <span class="d-block"
              >No. de Licencia: {{ paginatedBill.provider.license_number }}</span
            >
          </div>

          <div class="col-md-2 border-bottom border-2 mb-1">
            <span class="d-block">
              <span class="fw-bold">Folio: </span>{{ paginatedBill.folio }}
            </span>
          </div>

          <div class="col-md-12" style="height: 575px">
            <table class="table table-sm">
              <thead>
                <tr>
                  <th>Código</th>
                  <th>Artículo o Servicio</th>
                  <th class="text-center">U/M</th>
                  <th class="text-center">Cantidad</th>
                  <th class="text-end">Precio</th>
                  <th class="text-end">Importe</th>
                </tr>
              </thead>

              <tbody>
                <tr v-for="item in paginatedBill.items" :key="item.id">
                  <td>{{ item.item.code }}</td>
                  <td>{{ item.item.name }}</td>
                  <td class="text-center">{{ item.item.get_measurement }}</td>
                  <td class="text-center">{{ item.times.toFixed(2) }}</td>
                  <td class="text-end">{{ item.item.price.toFixed(2) }}</td>
                  <td class="text-end">{{ (item.item.price * item.times).toFixed(2) }}</td>
                </tr>
              </tbody>

              <tfoot>
                <tr>
                  <td>
                    <strong>Total</strong>
                  </td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td class="text-end">
                    <strong>{{ paginatedBill.get_total_amount.toFixed(2) }}</strong>
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>

          <div class="col-md-12">
            <p>
              Órdenes asociadas:
              <span v-for="order of paginatedBill.get_orders_folio" :key="order.folio">
                {{ order.folio }},
              </span>
            </p>
          </div>

          <div class="col-md-4">
            <span class="d-block fw-bold">Desglose de importes</span>
            <span class="d-block"
              >Rev/Diag.: {{ paginatedBill.get_total_amount_revision.toFixed(2) }}</span
            >
            <span class="d-block"
              >Partes: {{ paginatedBill.get_total_amount_prod.toFixed(2) }}</span
            >
            <span class="d-block"
              >Conceptos: {{ paginatedBill.get_total_amount_concept.toFixed(2) }}</span
            >
            <span class="d-block"
              >Reparación: {{ paginatedBill.get_total_amount_repair.toFixed(2) }}</span
            >
            <span class="d-block"
              >Mtto: {{ paginatedBill.get_total_amount_maintenace.toFixed(2) }}</span
            >
            <span class="d-block"
              >Instalación: {{ paginatedBill.get_total_amount_install.toFixed(2) }}</span
            >
            <span class="d-block"
              >Montaje/Desm: {{ paginatedBill.get_total_amount_unmounting.toFixed(2) }}</span
            >
          </div>

          <div class="col-md-4">
            <span class="d-block fw-bold">Prestador</span>
            <span class="d-block">Licencia: {{ paginatedBill.provider.license_number }}</span>
            <span class="d-block"
              >{{ paginatedBill.provider.first_name }} {{ paginatedBill.provider.last_name }}</span
            >
            <span class="d-block">No. CI: {{ paginatedBill.provider.personal_id }}</span>
            <span class="d-block">Firma: </span>
            <span v-if="paginatedBill.provider_signature_date" class="d-block">{{
              paginatedBill.provider_signature_date
            }}</span>
            <span v-else class="d-block">Fecha: </span>
          </div>

          <div class="col-md-4">
            <span class="d-block fw-bold">Cliente</span>
            <span class="d-block">Cargo: {{ paginatedBill.customer_charge }}</span>
            <span class="d-block">Nombre: </span>
            <span class="d-block">No. CI: {{ paginatedBill.customer_personal_id }}</span>
            <span class="d-block">Firma: </span>
            <span v-if="paginatedBill.customer_signature_date" class="d-block">{{
              paginatedBill.customer_signature_date
            }}</span>
            <span v-else class="d-block">Fecha: </span>
          </div>

          <div v-if="index < paginatedBills.length - 1" class="html2pdf__page-break"></div>
        </div>
        <!-- end paginated bills -->
      </div>
      <!-- end bill info -->
    </div>
    <!-- end main content -->
  </div>
</template>
