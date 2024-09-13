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

const notFound = ref(null);

const route = useRoute();

onMounted(async () => {
    try {
        const response = await detailCurrency(route.params.id);
        currency.value = response.data
    } catch (error) {
        notFound.value = "La moneda a la que trata de acceder no existe, haga click en el enlace a monedas en el menú de la izquierda para ver las monedas existentes.";
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
            <!-- notFound false -->
            <div v-if="!notFound"> 
                <h3>{{ currency.name }}</h3>
                <p>{{ currency.description }}</p>
            <!-- end notFound false -->
            </div>
            <!-- notFound -->
            <div v-else>
                <p>{{ notFound }}</p>
            <!-- end notFound -->
            </div>
        </div>

    </div>
</template>
