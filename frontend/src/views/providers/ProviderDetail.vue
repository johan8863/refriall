<script setup>
// vue
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'

// app
import { providerService } from '../../services/providerService'
import listGroup from '../../assets/js/bootstrap_classes/listGroup'
import ProviderDetailMenu from '../../components/providers/menus/ProviderDetailMenu.vue'

// main object
const provider = ref({
  id: '',
  username: '',
  first_name: '',
  last_name: '',
  license_number: '',
  tcp_code: '',
  personal_id: '',
  bank_account_header: '',
  bank_account: '',
  license_number: ''
})

// errors holder object
const providerErrors = ref(null)

// routing utilities
const route = useRoute()

// lifecycle
onMounted(async () => {
  try {
    const resp = await providerService.detailProvider(route.params.id)
    console.log(route.params.id)

    provider.value = resp.data
  } catch (error) {
    console.error('General error', error)
    if (error.response) {
      providerErrors.value = `${error.response.data.detail} - ${error.response.status}`
      console.log('response', providerErrors.value)
    } else {
      providerErrors.value = 'Error inesperado, consulte al desarrollador'
      console.log('else', providerErrors.value)
    }
  }
})
</script>

<template>
  <div class="row">
    <!-- side menu -->
    <div class="col-md-2">
      <provider-detail-menu :provider="provider" />
    </div>

    <!-- main content -->
    <div class="col-md-4">
      <h3>{{ provider.first_name }}</h3>
      <p>CI: {{ provider.personal_id }}</p>
      <p>Lic.: {{ provider.license_number }}</p>
      <p>TCP: {{ provider.tcp_code }}</p>
      <p>Titular de Cuenta: {{ provider.bank_account_header }}</p>
      <p>Nro de Cuenta: {{ provider.bank_account }}</p>
    </div>
  </div>
  <!-- end row -->
</template>
