<template>
    <div class="row">
        <!-- side menu -->
        <div class="col-md-2">
            <ul :class="listGroup.listGroup">
                <li :class="listGroup.listGroupItem">
                    <strong>Monedas</strong>
                </li>
                <li :class="listGroup.listGroupItem">
                    <router-link :to="{name: 'currencies'}">Monedas</router-link >
                </li>
            </ul>
        </div>

        <!-- main content -->
        <div class="col-md-4">
            <!-- form -->
            <form
              class="row"
              method="post"
              @submit.prevent>
                <!-- name control -->
                <div class="col-md-6 mb-2">
                    <label for="name" class="form-label">Nombre</label>
                    <input
                    type="text"
                    class="form-control"
                    id="name"
                    v-model.trim="currency.name">
                </div>
                <!-- filling container -->
                <div class="col-md-6"></div>
                <!-- description control -->
                <div class="col-md-12 mb-2">
                    <label for="description" class="form-label">Descripción</label>
                    <input
                    type="text"
                    class="form-control"
                    id="description"
                    v-model.trim="currency.description">
                </div>
                <!-- buttons -->
                 <div>
                    <button
                      type="button"
                      class="btn btn-primary btn-sm"
                      @click="createCurrency(currency)">Guardar</button>
                 </div>
            </form>
        </div>
    </div>
    

</template>

<script setup>

// vue
import { ref } from "vue";
import { RouterLink, useRouter } from "vue-router";

// app
import listGroup from '../../assets/js/bootstrap_classes/listGroup';
import { postCurrency } from "../../services/currency.service";

// routing habdlers
const router = useRouter()

const currency = ref({
    name: '',
    description: '',
})

const createCurrency = async (currency) => {
    currency.name = currency.name.toUpperCase()
    const { data } = await postCurrency(currency)
    router.push({name: 'currency_detail', params: {id: data.id}})

}

</script>
