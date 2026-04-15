<script setup>

// vue
import { ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";

// app
import { orderService } from '../../services/orderService'
import listGroup from "../../assets/js/bootstrap_classes/listGroup";
import { errorHandler, objectNames } from "../../utils/errors/errorHandler";

const route = useRoute();
const router = useRouter()
const order = ref({
    customer: '',
    symptom: '',
    flaw: '',
    repair_description: '',
    folio: '',
    check_diagnosis: false,
    repair: false,
    install: false,
    maintenance: false,
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
});

const billDeleteErrorObject = ref({
  id: null,
  folio: null
})

const errorMessage = ref(null)
const errorBillMessage = ref(null)

onMounted(async () => {
  try {
    const resp = await orderService.detailOrder(route.params.id);
    order.value = resp.data;
  } catch (error) {
    errorHandler(error, errorMessage, objectNames.order)
  }
});


const delOrder = async (id) => {
  try {
    await orderService.deleteOrder(id)
    router.push({ name: 'orders' })
  } catch (error) {
    if (error.response) {
      if (error.response.status === 404) {
        errorMessage.value = 'Orden no encontrada'
      }
      if (error.response.status === 400) {
        errorBillMessage.value = 'Orden asociada'
        billDeleteErrorObject.value = error.response.data
      }
    } else {
      errorMessage = 'Error inesperado, consulte al desarrollador'
    }
  }
}

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
                    <RouterLink :to="{name: 'orders'}">Órdenes</RouterLink>
                </li>
            </ul>
        </div>

        <!-- main content -->
        <div class="col-md-6">
            <p>Está seguro que desea eliminar la orden?</p>

            <div v-if="errorMessage">
              <span class="form-text text-danger">{{ errorMessage }}</span>
            </div>
            <div v-if="errorBillMessage && billDeleteErrorObject.id">
              <span class="form-text text-danger">{{ errorBillMessage }} en la factura con folio: <RouterLink :to="{name: 'bills_detail', params: {id: billDeleteErrorObject.id}}">{{ billDeleteErrorObject.folio }}</RouterLink></span>
            </div>
            

            <button
              class="btn btn-sm btn-danger"
              @click="delOrder(order.id, router, errorMessage)">Eliminar</button>
            <RouterLink :to="{name: 'orders'}" class="btn btn-sm btn-secondary">Cancelar</RouterLink>
        </div>

    </div> <!-- end row -->
</template>
