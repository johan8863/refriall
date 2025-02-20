<script setup>
// vue
import { onMounted, ref } from "vue";
import { RouterLink, useRoute, useRouter } from "vue-router";

// app
import { deleteCurrency, detailCurrency } from "../../services/currency.service";
import listGroup from "../../assets/js/bootstrap_classes/listGroup";

// router utilities to redirect the view and catch route params
const route = useRoute();
const router = useRouter();

// currency object meant to be deleted
const currency = ref({
    name: '',
    description: '',
});

const errorMessage = ref(null)

// delete the currency object
const delCurrency = async (id) => {
    try {
        await deleteCurrency(id);
        router.push({name: 'currencies'});
    } catch (error) {
        console.error('General error: ', error)
        if (error.response) {
            console.log('Error status:', error.response.status)
            console.log('Error data:', error.response.data)
            if (error.response.status === 404) {
                errorMessage.value = 'Moneda no encontrada'
            }
            if (error.response.status === 400) {
                errorMessage.value = 'Moneda asociada'
            }
        } else {
            errorMessage.value = `Error inesperado, ${error}`
        }
        // in case of backend errors, log to the console... for now
        console.log(error);
    }
};

onMounted(async () => {
    try {
        currency.value = (await detailCurrency(route.params.id)).data;
    } catch (error) {
        if (error.response) {
            console.log('Error status:', error.response.status)
            console.log('Error data:', error.response.data)
            if (error.response.status === 404) {
                errorMessage.value = 'Moneda no encontrada.'
            }
        } else if (error.request) {
            errorMessage.value = 'Error de Servidor, póngase en contacto con el desarrollador.'
            console.log(error.request);
            
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
                    <strong>Monedas</strong>
                </li>
                <li :class="listGroup.listGroupItem">
                    <router-link :to="{name: 'currencies'}">Monedas</router-link>
                </li>
                <li :class="listGroup.listGroupItem">
                    <router-link :to="{name: 'currency_update', params: {id: currency.id}}">Actualizar</router-link>
                </li>
            </ul>
        </div>
        <!-- main content -->
        <div class="col-md-4">
                <!-- backend general errors -->
                <span v-if="errorMessage">
                    <p
                      class="form-text text-danger">
                      {{ errorMessage }}</p>
                </span>
            <div>
                <p>Está seguro que desea eliminar la moneda: {{ currency.name }}</p>
                <button
                  class="btn btn-sm btn-danger"
                  @click="delCurrency(currency.id)">Eliminar</button>
                <RouterLink
                  :to="{name: 'currency_detail', params: {id: currency.id}}"
                  class="btn btn-sm btn-secondary">Cancelar</RouterLink>
            </div>
        </div>

    </div>
</template>
