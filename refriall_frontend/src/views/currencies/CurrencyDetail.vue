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
            <h3>{{ currency.name }}</h3>
            <p>{{ currency.description }}</p>
        </div>

    </div>
</template>

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
})

const route = useRoute()

const getCurrency = async (id) => {
    currency.value = (await detailCurrency(id)).data
}

onMounted(async () => {
    getCurrency(route.params.id)
})



</script>
