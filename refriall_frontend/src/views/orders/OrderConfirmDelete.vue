<script setup>

// vue
import { ref, onMounted } from "vue";
import { RouterLink, useRoute, useRouter } from "vue-router";

// app
import { detailOrder, deleteOrder } from '../../services/order.service'
import listGroup from "../../assets/js/bootstrap_classes/listGroup";

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



onMounted(async () => {
    const resp = await detailOrder(route.params.id);
    order.value = resp.data;
});

const delOrder = async (id) => {
    try {
      await deleteOrder(id)
      router.push({ name: 'orders' })
    } catch (error) {
      if (error.response) {
        // The request was made, and the server responded with a status code
        console.log('Error status:', error.response.status)
        console.log('Error data:', error.response.data)
        const errorMessage = `${error.response.data} - ${error.response.status}`
        // Handle different status codes
        if (error.response.status === 404) {
          errorMessage = 'Orden no encontrada.'
        } else if (error.response.status === 400) {
          console.log('Bad request: ' + error.response.data.error)
        }
      } else if (error.request) {
        // The request was made but no response was received
        console.log('No response received:', error.request)
      } else {
        // Something happened in setting up the request that triggered an Error
        console.log('Error:', error.message)
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
            <span
              v-if="errorMessage"
              class="form-text text-danger">{{ errorMessage }}</span>
            <button
              class="btn btn-sm btn-danger"
              @click="delOrder(order.id, router, errorMessage)">Eliminar</button>
            <RouterLink :to="{name: 'orders'}" class="btn btn-sm btn-secondary">Cancelar</RouterLink>
        </div>

    </div> <!-- end row -->
</template>
