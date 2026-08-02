<script setup>
// vue
import { onMounted, ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'

// app
import { billService } from '../../services/billService'
import BillDetailMenu from '../../components/bills/menus/BillDetailMenu.vue'
import { useResourceLoader } from '../../composables/useResourceLoader.js'

// third
import html2pdf from 'html2pdf.js'
import { useErrorHandler } from '../../composables/useErrorHandler.js'

// Constants
const ITEMS_PER_PAGE = 12

// Routing
const route = useRoute()
const router = useRouter()

// State
const paginatedBills = ref([])
const billToPaginate = ref(null)
const showDeleteModal = ref(false)
const isDeleting = ref(false)

// Resource loader with integrated error handling
const {
  data: bill,
  isLoading,
  errorMessage,
  load: loadBill
} = useResourceLoader(billService.detailBill, {
  initialData: {
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
  },
  objectName: 'Factura',
  gender: 'f',
  onError: (err) => {
    console.error('Error loading bill:', err)
  }
})

// Independent error composable handler to deal with
// deletion errors
const {
  errorMessage: deletingError,
  handleError,
  clearErrors
} = useErrorHandler({
  objectName: 'Factura'
})

// Computed
const hasItems = computed(() => {
  return bill.value?.get_orders?.some((order) => order.itemtime_set?.length > 0)
})

// Methods
const mergeItemsTimes = (itemsTimes) => {
  try {
    return Object.values(
      itemsTimes.reduce(
        (acc, { item: { code, get_item_type, get_measurement, name, price }, times }) => {
          ;(acc[code] ??= {
            item: { code, get_item_type, get_measurement, name, price },
            times: 0
          }).times += times
          return acc
        },
        {}
      )
    )
  } catch (error) {
    console.error('Error merging items:', error)
    if (error instanceof TypeError) {
      console.error("Array must contain values if initial value isn't provided")
    }
    return []
  }
}

const prepareBillToPaginate = () => {
  const { get_orders, ...rest } = bill.value

  const allItems = get_orders.flatMap((order) => order.itemtime_set || [])
  const mergedItems = mergeItemsTimes(allItems)

  billToPaginate.value = {
    items: mergedItems,
    ...rest
  }
}

const paginate = (billData, itemsPerPage, start = 0, pages = []) => {
  if (start >= billData.items.length) {
    return pages
  }

  const end = start + itemsPerPage
  const { items, ...rest } = billData

  pages.push({ items: items.slice(start, end), ...rest })
  return paginate(billData, itemsPerPage, end, pages)
}

const generatePDF = () => {
  const element = document.getElementById('bill-to-pdf')
  const opt = {
    filename: `factura_${bill.value.folio}_${bill.value.customer?.name || 'sin_cliente'}`
  }
  html2pdf().from(element).set(opt).save()
}

const loadBillData = async () => {
  try {
    await loadBill(route.params.id)

    if (bill.value && hasItems.value) {
      prepareBillToPaginate()
      paginatedBills.value = paginate(billToPaginate.value, ITEMS_PER_PAGE)
    } else {
      const { get_orders, ...rest } = bill.value
      paginatedBills.value = [{ items: [], ...rest }]
    }
  } catch (error) {
    console.error('Error loading bill:', error)
  }
}

// Delete methods
const openDeleteModal = () => {
  clearErrors()
  showDeleteModal.value = true
}

const closeDeleteModal = () => {
  showDeleteModal.value = false
}

const confirmDelete = async () => {
  isDeleting.value = true
  try {
    await billService.deleteBill(bill.value.id)
    closeDeleteModal()
    // Redirect to bills list
    router.push({ name: 'bills' })
  } catch (error) {
    console.error('Error deleting bill:', error)
    // Independent error handling
    handleError(error)
    isDeleting.value = false
  }
}

// Lifecycle
onMounted(async () => {
  await loadBillData()
})
</script>

<template>
  <div class="row">
    <!-- side menu -->
    <div class="col-md-2">
      <BillDetailMenu
        :is-loading="isLoading"
        :bill="bill"
        @on-p-d-f="generatePDF"
        @on-delete="openDeleteModal"
      />
    </div>

    <!-- loading bill data -->
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
            <span class="d-block"
              >Código TPCP: {{ paginatedBill.provider?.tcp_code || 'N/A' }}</span
            >
            <span class="d-block"
              >Titular de Cta: {{ paginatedBill.provider?.bank_account_header || 'N/A' }}</span
            >
            <span class="d-block"
              >No. de cuenta TPCP: {{ paginatedBill.provider?.bank_account || 'N/A' }}</span
            >
            <span class="d-block"
              >No. de Licencia: {{ paginatedBill.provider?.license_number || 'N/A' }}</span
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
                <tr v-if="paginatedBill.items && paginatedBill.items.length === 0">
                  <td colspan="6" class="text-center text-muted">
                    No hay artículos asociados a esta factura
                  </td>
                </tr>
                <tr v-for="item in paginatedBill.items" :key="item.item?.code || item.id">
                  <td>{{ item.item?.code || 'N/A' }}</td>
                  <td>{{ item.item?.name || 'N/A' }}</td>
                  <td class="text-center">{{ item.item?.get_measurement || 'N/A' }}</td>
                  <td class="text-center">{{ (item.times || 0).toFixed(2) }}</td>
                  <td class="text-end">{{ (item.item?.price || 0).toFixed(2) }}</td>
                  <td class="text-end">
                    {{ ((item.item?.price || 0) * (item.times || 0)).toFixed(2) }}
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
                    <strong>{{ (paginatedBill.get_total_amount || 0).toFixed(2) }}</strong>
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>

          <div class="col-md-12">
            <p>
              Órdenes asociadas:
              <span v-for="(order, idx) of paginatedBill.get_orders_folio" :key="idx">
                {{ order.folio }}{{ idx < paginatedBill.get_orders_folio.length - 1 ? ', ' : '' }}
              </span>
            </p>
          </div>

          <div class="col-md-4">
            <span class="d-block fw-bold">Desglose de importes</span>
            <span class="d-block"
              >Rev/Diag.: {{ (paginatedBill.get_total_amount_revision || 0).toFixed(2) }}</span
            >
            <span class="d-block"
              >Partes: {{ (paginatedBill.get_total_amount_prod || 0).toFixed(2) }}</span
            >
            <span class="d-block"
              >Conceptos: {{ (paginatedBill.get_total_amount_concept || 0).toFixed(2) }}</span
            >
            <span class="d-block"
              >Reparación: {{ (paginatedBill.get_total_amount_repair || 0).toFixed(2) }}</span
            >
            <span class="d-block"
              >Mtto: {{ (paginatedBill.get_total_amount_maintenace || 0).toFixed(2) }}</span
            >
            <span class="d-block"
              >Instalación: {{ (paginatedBill.get_total_amount_install || 0).toFixed(2) }}</span
            >
            <span class="d-block"
              >Montaje/Desm: {{ (paginatedBill.get_total_amount_unmounting || 0).toFixed(2) }}</span
            >
          </div>

          <div class="col-md-4">
            <span class="d-block fw-bold">Prestador</span>
            <span class="d-block"
              >Licencia: {{ paginatedBill.provider?.license_number || 'N/A' }}</span
            >
            <span class="d-block"
              >{{ paginatedBill.provider?.first_name || '' }}
              {{ paginatedBill.provider?.last_name || '' }}</span
            >
            <span class="d-block">No. CI: {{ paginatedBill.provider?.personal_id || 'N/A' }}</span>
            <span class="d-block">Firma: </span>
            <span v-if="paginatedBill.provider_signature_date" class="d-block">{{
              paginatedBill.provider_signature_date
            }}</span>
            <span v-else class="d-block">Fecha: </span>
          </div>

          <div class="col-md-4">
            <span class="d-block fw-bold">Cliente</span>
            <span class="d-block">Cargo: {{ paginatedBill.customer_charge || 'N/A' }}</span>
            <span class="d-block">Nombre: {{ paginatedBill.customer_name || 'N/A' }}</span>
            <span class="d-block">No. CI: {{ paginatedBill.customer_personal_id || 'N/A' }}</span>
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

  <!-- Delete Confirmation Modal -->
  <div
    class="modal fade"
    id="deleteModal"
    tabindex="-1"
    aria-labelledby="deleteModalLabel"
    aria-hidden="true"
    :class="{ show: showDeleteModal }"
    :style="{ display: showDeleteModal ? 'block' : 'none' }"
  >
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content">
        <div class="modal-header bg-danger text-white">
          <h5 class="modal-title" id="deleteModalLabel">
            <i class="bi bi-exclamation-triangle"></i> Confirmar Eliminación
          </h5>
          <button
            type="button"
            class="btn-close btn-close-white"
            @click="closeDeleteModal"
            aria-label="Close"
          ></button>
        </div>
        <div class="modal-body">
          <!-- show error if there's any -->
          <div v-if="deletingError" class="alert alert-danger">
            <i class="bi bi-exclamation-circle"></i> {{ deletingError }}
          </div>

          <template v-else>
            <p class="fs-6">¿Está seguro que desea eliminar la siguiente factura?</p>
            <div class="alert alert-warning">
              <p class="mb-1"><strong>Folio:</strong> {{ bill.folio || 'No especificado' }}</p>
              <p class="mb-0"><strong>ID:</strong> {{ bill.id }}</p>
            </div>
            <p class="text-danger mb-0">
              <small>Esta acción no se puede deshacer.</small>
            </p>
          </template>
        </div>
        <div class="modal-footer">
          <button
            type="button"
            class="btn btn-secondary"
            @click="closeDeleteModal"
            :disabled="isDeleting"
          >
            <i class="bi bi-x-circle"></i> Cancelar
          </button>
          <button
            type="button"
            class="btn btn-danger"
            @click="confirmDelete"
            :disabled="isDeleting"
          >
            <span
              v-if="isDeleting"
              class="spinner-border spinner-border-sm me-1"
              role="status"
            ></span>
            <i v-else class="bi bi-trash"></i>
            {{ isDeleting ? 'Eliminando...' : 'Eliminar' }}
          </button>
        </div>
      </div>
    </div>
  </div>

  <!-- Modal backdrop -->
  <div v-if="showDeleteModal" class="modal-backdrop fade show"></div>
</template>
