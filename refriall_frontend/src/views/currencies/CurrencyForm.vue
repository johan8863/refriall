<script setup>

// vue
import { ref, onMounted } from "vue";
import { RouterLink, useRouter, useRoute } from "vue-router";

// third
import { useVuelidate } from "@vuelidate/core";
import { required, helpers } from "@vuelidate/validators";

// app
import listGroup from '../../assets/js/bootstrap_classes/listGroup';
import { detailCurrency, postCurrency, putCurrency } from "../../services/currency.service";

// router utilities and handlers
const router = useRouter();
const route = useRoute();


const goToCurrencies = () => router.push({name: 'currencies'})
const goToCurrencyDetail = () => router.push({name: 'currency_detail', params: {id: currency.value.id}})
const goBack = () => !currency.value.id ? goToCurrencies() : goToCurrencyDetail()


// currency object for post and put requests
const currency = ref({
    name: '',
    description: '',
});


// currency object to store backend errors
const currencyBackendErrors = ref({
    name: [],
    description: [],
});


// rules to manage front validations
const rules = {
    name: {
        required: helpers.withMessage('El nombre es requerido.', required)
    }
};


// vuelidate object
const v$ = useVuelidate(rules, currency);


// helper function to always set to upper case the name of the currency
const currenyNameUpper = (currency) => currency.name = currency.name.toUpperCase();


// create kit object function
const createCurrency = async (currency) => {
    try {
        if (await v$.value.$validate()) {
            // if front validations run,
            // set the currency name to upper case and
            // post the object and redirect to its detail view
            currenyNameUpper(currency);
            const { data } = await postCurrency(currency);
            router.push({name: 'currency_detail', params: {id: data.id}});
        }
    } catch (error) {
        console.error('General error: ', error)
        if (error.response) {
            currencyBackendErrors.value = error.response.data;
        } else {
            currencyBackendErrors.value = { message: `Error inesperado: ${error}` }
        }
    }
};


// update kit object function
const updateCurrency = async (currency) => {
    try {
        if (await v$.value.$validate()) {
            // if front validations run,
            // set the currency name to upper case and
            // put the object and redirect to its detail view
            currenyNameUpper(currency);
            const { data } = await putCurrency(currency);
            router.push({name: 'currency_detail', params: {id: data.id}});
        }
    } catch (error) {
        console.error('General error: ', error)
        if (error.response) {
            currencyBackendErrors.value = error.response.data;
        } else {
            currencyBackendErrors.value = { message: `Error inesperado: ${error}` }
        }
    }
};


// onMounted life cycle
onMounted(async () => {
    try {
        const id = route.params.id;
        // if id, it means the view was accessed to update the currency attrs,
        // therefore, the matching id object is loaded
        if (id) {
            currency.value = (await detailCurrency(id)).data;
        }
    } catch (error) {
        currencyBackendErrors.value = error.response.data;
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
                    <router-link :to="{name: 'currencies'}">Monedas</router-link >
                </li>
            </ul>
        </div>

        <!-- main content -->
        <div class="col-md-4">
            <!-- backend errors from non_field_errors dictionary -->
            <span v-if="currencyBackendErrors.non_field_errors">
                <p
                    class="form-text text-danger"
                    v-for="(error, index) in currencyBackendErrors.non_field_errors"
                    :key="index">
                    {{ error }}</p>
            </span>
            <!-- backend general errors -->
            <span v-if="currencyBackendErrors.message">
                <p
                    class="form-text text-danger">
                    {{ currencyBackendErrors.message }}</p>
            </span>
            <!-- form -->
            <form
              @submit.prevent="!currency.id ? createCurrency(currency) : updateCurrency(currency)"
              class="row">
                <!-- name control -->
                <div class="col-md-6 mb-2">
                    <label for="name" class="form-label">Nombre</label>
                    <input
                    autofocus
                    type="text"
                    class="form-control"
                    id="name"
                    v-model.trim="currency.name"
                    @blur="v$.name.$touch">
                    <!-- frontend errors -->
                    <p
                        class="form-text text-danger"
                        v-for="error in v$.name.$errors"
                        :key="error.$uid">{{ error.$message }}</p>
                    <!-- backend errors -->
                    <span v-if="currencyBackendErrors.name">
                        <p
                          class="form-text text-danger"
                          v-for="(error, i) in currencyBackendErrors.name"
                          :key="i">{{ error }}</p>
                    </span>
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
                    <span v-if="currencyBackendErrors.description">
                        <p
                          class="form-text text-danger"
                          v-for="(error, i) in currencyBackendErrors.description"
                          :key="i">{{ error }}</p>
                    </span>
                </div>
                <!-- buttons -->
                 <div>
                    <!-- 
                        the order in the ternary operator is due to the fact that 
                        this form is more often used to create than to update 
                    -->
                    <button
                      type="submit"
                      class="btn btn-primary btn-sm">
                        {{!currency.id ? 'Guardar' : 'Actualizar'}}
                    </button>
                    <button
                      type="button"
                      class="btn btn-sm btn-secondary"
                      @click="goBack">Cancelar</button>
                 </div>
            </form>
        </div>
    </div>
    

</template>
