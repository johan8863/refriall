<script setup>

// vue
import { ref, onMounted } from "vue";
import { RouterLink, useRoute } from "vue-router";

// app
import { detailCurrency } from "../../services/currency.service";
import listGroup from "../../assets/js/bootstrap_classes/listGroup";

const currency = ref({
    name: '',
    description: '',
});

const currencyBackenderror = ref(null);

const route = useRoute();

onMounted(async () => {
    try {
        const response = await detailCurrency(route.params.id);
        currency.value = response.data
    } catch (error) {
        console.error('General error', error)
        if (error.response) {
            currencyBackenderror.value = `${error.response.data.detail} - ${error.response.status}`
        } else {
            currencyBackenderror.value = 'Error inesperado, consulte al desarrollador'
        }
    }
});

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
                <li :class="listGroup.listGroupItem">
                    <router-link :to="{name: 'currency_delete', params: {id: currency.id}}">Eliminar</router-link>
                </li>
            </ul>
        </div>
        <!-- main content -->
        <div class="col-md-4">
            <!-- backend general errors -->
            <span v-if="currencyBackenderror">
                <p
                    class="form-text text-danger">
                    {{ currencyBackenderror }}</p>
            </span>
            <h3>{{ currency.name }}</h3>
            <p>{{ currency.description }}</p>
        </div>

    </div>
</template>
