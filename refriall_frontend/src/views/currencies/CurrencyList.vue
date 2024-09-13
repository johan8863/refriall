<script setup>

// vue
import { ref, onMounted } from "vue";
import { RouterLink } from "vue-router";

// app
import listGroup from '../../assets/js/bootstrap_classes/listGroup';
import { listCurrencies } from "../../services/currency.service";

const currencies = ref([])

const getCurrencies = async () => {
    currencies.value = (await listCurrencies()).data
}

onMounted(async () => {
    getCurrencies()
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
                    <router-link :to="{name: 'currency_create'}">Nueva</router-link >
                </li>
            </ul>
        </div>
        <!-- main content -->
        <div class="col-md-10">
            <div class="row">
                <div class="col-md-4">

                    <div v-if="currencies.length > 0">

                        <div id="tableContainer">

                            <table class="table">
                                <thead>
                                    <tr>
                                        <th scope="col">Moneda</th>
                                        <th scope="col">Descripción</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr v-for="currency in currencies" :key="currency.id">
                                        <td>
                                            <router-link :to="{name: 'currency_detail', params: {id: currency.id}}">{{ currency.name }}</router-link>
                                        </td>
                                        <td>{{ currency.description }}</td>
                                    </tr>
                                </tbody>
                            </table>

                        </div>

                    </div>

                    <div v-else>
                        <p class="lead text-center">Inserte una Moneda.</p>
                    </div>

                    
                </div>
            </div>
        </div>

    </div>
</template>
