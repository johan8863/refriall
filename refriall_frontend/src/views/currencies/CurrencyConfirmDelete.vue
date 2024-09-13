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

// currency objects meant to be deleted
const currency = ref({
    name: '',
    description: '',
});

// delete the currency object
const delCurrency = async (id) => {
    try {
        await deleteCurrency(id);
        router.push({name: 'currencies'});
    } catch (error) {
        // in case of backend errors, log to the console... for now
        console.log(error);
    }
};

onMounted(async () => {
    currency.value = (await detailCurrency(route.params.id)).data;
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
