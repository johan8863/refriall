<script setup>

// vue
import { onMounted, ref } from "vue";
import { RouterLink, useRoute, useRouter } from "vue-router";

// app
import { deleteProvider, detailProvider } from "../../services/provider.service";
import listGroup from "../../assets/js/bootstrap_classes/listGroup";

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
    license_number: '',
});

// provider errors
const providerErrors = ref({
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


// router utilities to redirect the view and catch route params
const route = useRoute();
const router = useRouter();

const delProvider = async (id) => {
    try {
        await deleteProvider(id);
        router.push({name: "providers"})
    } catch (error) {
        console.error('General error', error)
        if (error.response) {
            console.log("Error data: ", error.response.data);
            console.log("Error status: ", error.response.status);
            if (error.response.status === 400) {
                providerErrors.value = { message: 'El prestador no se puede eliminar porque tiene órdenes asociadas.' }    
            } else if (error.response.status === 404) {
                providerErrors.value = { message404: 'El prestador que intenta eliminar no existe.' }
            }
        } else {
            providerErrors.value = { message: 'Error inesperado, consulte al desarrollador' }
        }
    }
}

onMounted(async () => {
    try {
        const resp = await detailProvider(route.params.id)
        provider.value = resp.data
    } catch (error) {
        if (error.response) {
            console.log("Error data: ", error.response.data);
            console.log("Error status: ", error.response.status);
            if (error.response.status === 404) {
                providerErrors.value = { message404: 'El prestador que intenta eliminar no existe.' }
            }
        }
    }
})

</script>

<template>

    <div class="row">

        <!-- side menu -->
        <div class="col-md-2">
            <ul :class="listGroup.listGroup">
                <li :class="listGroup.listGroupItem">
                    <strong>Prestadores</strong>
                </li>
                <li :class="listGroup.listGroupItem">
                    <router-link :to="{ name: 'providers' }">Equipos</router-link>
                </li>
            </ul>
        </div>

        <!-- main content -->
        <div class="col-md-4">
            <!-- backend errors from non_field_errors dictionary -->
            <span v-if="providerErrors.non_field_errors">
                <p
                    class="form-text text-danger"
                    v-for="(error, index) in providerErrors.non_field_errors"
                    :key="index">
                    {{ error }}</p>
            </span>
            <!-- backend general errors -->
            <span v-if="providerErrors.message">
                <p
                    class="form-text text-danger">
                    {{ providerErrors.message }}</p>
            </span>
            <span v-if="providerErrors.message404">
                <p
                    class="form-text text-danger">
                    {{ providerErrors.message404 }}</p>
            </span>
            <div>
                <p>Está seguro que desea eliminar el prestador: {{ provider.first_name }}</p>
                <button
                  class="btn btn-sm btn-danger"
                  @click="delProvider(provider.id)">Eliminar</button>
                <RouterLink v-if="provider.id"
                  :to="{name: 'providers_detail', params: {id: provider.id}}"
                  class="btn btn-sm btn-secondary">Cancelar</RouterLink>
            </div>
        </div>

    </div>

</template>