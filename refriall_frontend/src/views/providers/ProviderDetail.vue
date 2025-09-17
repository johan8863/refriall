<template>
    <div class="row">
        <!-- side menu -->
        <div class="col-md-2">
            <ul :class="listGroup.listGroup">
                <li :class="listGroup.listGroupItem">
                    <strong>Prestadores</strong>
                </li>
                <li class="list-group-item">
                    <router-link :to="{name: 'providers'}">Prestadores</router-link>
                </li>
                <li class="list-group-item">
                    <router-link v-if="provider.id" :to="{name: 'providers_update', params: {id: provider.id}}">Editar</router-link>
                </li>
            </ul>
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

    </div> <!-- end row -->

</template>

<script setup>

// vue
import { RouterLink, useRoute } from "vue-router";
import { ref, onMounted } from 'vue';

// app
import { detailProvider } from "../../services/provider.service";
import listGroup from "../../assets/js/bootstrap_classes/listGroup";

const route = useRoute();
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
    license_number: '',
});

const providerErrors = ref(null)

onMounted(async () => {
    try {
        const resp = await detailProvider(route.params.id);
        provider.value = await resp.data;
    } catch (error) {
        console.error('General error', error)
        if (error.response) {
            providerErrors.value = `${error.response.data.detail} - ${error.response.status}`
            console.log('response', providerErrors.value);
            
        } else {
            providerErrors.value = 'Error inesperado, consulte al desarrollador'
            console.log('else', providerErrors.value);
        }
    }
});

</script>

<style lang="scss" scoped>

</style>