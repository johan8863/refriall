<script setup>
// vue
import { useRoute } from 'vue-router'
import { ref, onMounted, computed } from 'vue'

// app
import { orderService } from '../../services/orderService'
import { useResourceLoader } from '../../composables/useResourceLoader.js'

// third
import html2pdf from 'html2pdf.js'
import OrderDetailMenu from '../../components/orders/menus/OrderDetailMenu.vue'

// Constants
const ITEMS_PER_PAGE = 12

// Routing
const route = useRoute()

// State
const paginatedOrders = ref([])

// Resource loader with integrated error handling
const {
  data: order,
  isLoading,
  errorMessage,
  load: loadOrder
} = useResourceLoader(orderService.detailOrder, {
  initialData: {
    id: null,
    customer: null,
    customer_dependency: null,
    symptom: '',
    flaw: '',
    repair_description: '',
    folio: '',
    check_diagnosis: false,
    repair: false,
    install: false,
    maintenance: false,
    kit: null,
    kit_brand: '',
    kit_model: '',
    kit_serial: '',
    job_description: '',
    itemtime_set: [],
    itemtimeorder_set: [],
    provider: null,
    provider_signature_date: '',
    customer_signature_date: '',
    check_number: '',
    charge_aprove: '',
    charge_check: '',
    customer_charge: '',
    customer_name: '',
    customer_personal_id: '',
    checked_by: '',
    aproved_by: '',
    get_total_amount: 0,
    get_total_amount_revision: 0,
    get_total_amount_prod: 0,
    get_total_amount_concept: 0,
    get_total_amount_repair: 0,
    get_total_amount_maintenace: 0,
    get_total_amount_install: 0,
    get_total_amount_unmounting: 0
  },
  objectName: 'Orden',
  gender: 'f',
  onError: (err) => {
    console.error('Error loading order:', err)
  }
})

// Computed
const orderTitle = computed(() => {
  return route.meta.preOrder ? 'Prefactura' : 'Orden de Servicio'
})

const pdfFilename = computed(() => {
  const prefix = route.meta.preOrder ? 'prefactura' : 'orden_de_servicio'
  const identifier = order.value?.customer_dependency
    ? order.value.customer_dependency.name
    : order.value?.customer?.name || 'sin_cliente'
  return `${prefix}_${order.value?.folio || 'sin_folio'}_${identifier}`
})

// Methods
const paginateItems = (items, itemsPerPage) => {
  const pages = []
  for (let i = 0; i < items.length; i += itemsPerPage) {
    pages.push(items.slice(i, i + itemsPerPage))
  }
  return pages
}

const prepareOrderPages = () => {
  if (!order.value) return []

  // Get items from itemtimeorder_set
  const items = order.value.itemtimeorder_set || []

  // If no items, return single page with order data
  if (items.length === 0) {
    return [{ ...order.value, items: [] }]
  }

  // Paginate items
  const itemPages = paginateItems(items, ITEMS_PER_PAGE)

  // Create a page for each group of items
  return itemPages.map((pageItems) => ({
    ...order.value,
    items: pageItems
  }))
}

const generatePDF = () => {
  const element = document.getElementById('order-to-pdf')
  if (!element) {
    console.warn('PDF element not found')
    return
  }
  const opt = {
    filename: pdfFilename.value
  }
  html2pdf().from(element).set(opt).save()
}

const loadOrderData = async () => {
  try {
    await loadOrder(route.params.id)

    // Prepare pagination after data is loaded
    if (order.value) {
      paginatedOrders.value = prepareOrderPages()
    }
  } catch (error) {
    // Error already handled by useResourceLoader
    console.error('Error loading order:', error)
  }
}

// Lifecycle
onMounted(async () => {
  await loadOrderData()
})
</script>

<template>
  <div class="row">
    <!-- side menu -->
    <div class="col-md-2">
      <OrderDetailMenu :is-loading="isLoading" :order="order" @on-p-d-f="generatePDF" />
    </div>

    <!-- main content -->

    <!-- loading order data -->
    <div v-if="isLoading" class="col-md-9">
      <div class="d-flex justify-content-center align-items-center" style="min-height: 200px">
        <span role="status" class="text-primary">Cargando datos... </span>
        <span class="spinner-border spinner-border-sm text-primary" aria-hidden="true"></span>
      </div>
    </div>

    <!-- error message -->
    <div v-else-if="errorMessage" class="col-md-9">
      <span class="form-text text-danger">
        {{ errorMessage }}
      </span>
    </div>

    <!-- displaying order data -->
    <div v-else class="col-md-9">
      <!-- order info -->
      <div id="order-to-pdf">
        <!-- paginated orders -->
        <div v-for="(paginatedOrder, index) of paginatedOrders" :key="index" class="row px-3 py-1">
          <div
            class="col-md-9 d-flex align-items-center justify-content-center border-bottom border-3 mb-1"
          >
            <h3>{{ orderTitle }}</h3>
          </div>

          <div class="col-md-3 border-bottom pb-1 border-3 mb-1">
            <img
              src="../../assets/logo.png"
              class="img-fluid"
              alt="refriall logo"
              style="height: 100px"
            />
          </div>

          <div v-if="paginatedOrder.customer" class="col-md-9 border-bottom border-2 mb-1">
            <span class="d-block fw-bold">{{ paginatedOrder.customer.name }}</span>
            <span class="d-block">{{ paginatedOrder.customer.address }}</span>
            <span class="d-block">{{ paginatedOrder.customer.province }}</span>
            <span class="d-block">{{ paginatedOrder.customer.township }}</span>
          </div>

          <div
            v-if="paginatedOrder.customer_dependency"
            class="col-md-9 border-bottom border-2 mb-1"
          >
            <span class="d-block fw-bold">{{ paginatedOrder.customer_dependency.name }}</span>
            <span class="d-block">{{ paginatedOrder.customer_dependency.address }}</span>
            <span class="d-block">{{ paginatedOrder.customer_dependency.province }}</span>
            <span class="d-block">{{ paginatedOrder.customer_dependency.township }}</span>
          </div>

          <div class="col-md-3 border-bottom border-2 mb-1">
            <span class="d-block"><strong>Folio:</strong> {{ paginatedOrder.folio }}</span>
            <span class="d-block"
              ><strong>Atención:</strong> {{ paginatedOrder.get_order_support || 'N/A' }}</span
            >
          </div>

          <div class="col-md-4 d-flex justify-content-center border-bottom border-2 mb-1">
            <span class="d-block"
              ><strong>Síntoma:</strong> {{ paginatedOrder.symptom || 'N/A' }}</span
            >
          </div>
          <div class="col-md-4 d-flex justify-content-center border-bottom border-2 mb-1">
            <span class="d-block"
              ><strong>Defecto:</strong> {{ paginatedOrder.flaw || 'N/A' }}</span
            >
          </div>
          <div class="col-md-4 d-flex justify-content-center border-bottom border-2 mb-1">
            <span class="d-block"
              ><strong>Reparación:</strong> {{ paginatedOrder.repair_description || 'N/A' }}</span
            >
          </div>

          <div class="col-md-3 justify-content center border-bottom border-2 mb-1">
            <span class="d-block">
              <strong>Rev. y Diagnóstico:</strong>
              <span v-if="paginatedOrder.check_diagnosis">✓</span>
            </span>
          </div>

          <div class="col-md-3 justify-content center border-bottom border-2 mb-1">
            <span class="d-block">
              <strong>Reparación:</strong> <span v-if="paginatedOrder.repair">✓</span>
            </span>
          </div>

          <div class="col-md-3 justify-content center border-bottom border-2 mb-1">
            <span class="d-block">
              <strong>Instalación:</strong> <span v-if="paginatedOrder.install">✓</span>
            </span>
          </div>

          <div class="col-md-3 justify-content center border-bottom border-2 mb-1">
            <span class="d-block">
              <strong>Mtto:</strong> <span v-if="paginatedOrder.maintenance">✓</span>
            </span>
          </div>

          <div class="col-md-4 border-bottom border-2">
            <span class="d-block"
              ><strong>Equipo:</strong> {{ paginatedOrder.kit?.name || 'N/A' }}</span
            >
            <span class="d-block"
              ><strong>Marca:</strong> {{ paginatedOrder.kit_brand || 'N/A' }}</span
            >
            <span class="d-block"
              ><strong>Modelo:</strong> {{ paginatedOrder.kit_model || 'N/A' }}</span
            >
            <span class="d-block"
              ><strong>Serie:</strong> {{ paginatedOrder.kit_serial || 'N/A' }}</span
            >
          </div>

          <div class="col-md-8 border-bottom border-2">
            <p class="d-block"><strong>Descripción del trabajo realizado:</strong></p>
            <p>{{ paginatedOrder.job_description || 'No especificada' }}</p>
          </div>

          <div class="col-md-12" style="height: 550px">
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
                <tr v-if="!paginatedOrder.items || paginatedOrder.items.length === 0">
                  <td colspan="6" class="text-center text-muted">
                    No hay artículos asociados a esta orden
                  </td>
                </tr>
                <tr v-for="itemtime in paginatedOrder.items" :key="itemtime.id">
                  <td>{{ itemtime.item?.code || 'N/A' }}</td>
                  <td>{{ itemtime.item?.name || 'N/A' }}</td>
                  <td class="text-center">{{ itemtime.item?.get_measurement || 'N/A' }}</td>
                  <td class="text-center">{{ itemtime.times || 0 }}</td>
                  <td class="text-end">{{ (itemtime.item?.price || 0).toFixed(2) }}</td>
                  <td class="text-end">
                    {{ ((itemtime.item?.price || 0) * (itemtime.times || 0)).toFixed(2) }}
                  </td>
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
                    <strong>{{ (paginatedOrder.get_total_amount || 0).toFixed(2) }}</strong>
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>

          <div class="col-md-5">
            <span class="d-block fw-bold">Desglose de importes</span>
            <div class="row">
              <div class="col-md-6">
                <span class="d-block"
                  >Rev/Diag.: {{ (paginatedOrder.get_total_amount_revision || 0).toFixed(2) }}</span
                >
                <span class="d-block"
                  >Partes: {{ (paginatedOrder.get_total_amount_prod || 0).toFixed(2) }}</span
                >
                <span class="d-block"
                  >Conceptos: {{ (paginatedOrder.get_total_amount_concept || 0).toFixed(2) }}</span
                >
                <span class="d-block"
                  >Reparación: {{ (paginatedOrder.get_total_amount_repair || 0).toFixed(2) }}</span
                >
              </div>
              <div class="col-md-6">
                <span class="d-block"
                  >Mtto: {{ (paginatedOrder.get_total_amount_maintenace || 0).toFixed(2) }}</span
                >
                <span class="d-block"
                  >Instalación:
                  {{ (paginatedOrder.get_total_amount_install || 0).toFixed(2) }}</span
                >
                <span class="d-block"
                  >Montaje/Desm:
                  {{ (paginatedOrder.get_total_amount_unmounting || 0).toFixed(2) }}</span
                >
              </div>
            </div>
          </div>

          <div class="col-md-4">
            <span class="d-block fw-bold">Prestador</span>
            <span class="d-block"
              >Licencia: {{ paginatedOrder.provider?.license_number || 'N/A' }}</span
            >
            <span class="d-block"
              >{{ paginatedOrder.provider?.first_name || '' }}
              {{ paginatedOrder.provider?.last_name || '' }}</span
            >
            <span class="d-block">No. CI: {{ paginatedOrder.provider?.personal_id || 'N/A' }}</span>
            <span class="d-block">Firma: </span>
            <span class="d-block"
              >Fecha: {{ paginatedOrder.provider_signature_date || 'No firmada' }}</span
            >
          </div>

          <div class="col-md-3">
            <span class="d-block fw-bold">Cliente</span>
            <span class="d-block">Cargo: {{ paginatedOrder.customer_charge || 'N/A' }}</span>
            <span class="d-block">Nombre: {{ paginatedOrder.customer_name || 'N/A' }}</span>
            <span class="d-block">No. CI: {{ paginatedOrder.customer_personal_id || 'N/A' }}</span>
            <span class="d-block">Firma: </span>
            <span class="d-block"
              >Fecha: {{ paginatedOrder.customer_signature_date || 'No firmada' }}</span
            >
          </div>

          <div v-if="index < paginatedOrders.length - 1" class="html2pdf__page-break"></div>
          <!-- end paginated orders -->
        </div>
        <!-- end order info -->
      </div>
    </div>
  </div>
  <!-- end row -->
</template>
