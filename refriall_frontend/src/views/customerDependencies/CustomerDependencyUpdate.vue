<script setup>

// vue
import { ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";

// app
import { detailCustomerDependecy, putCustomerDependcy } from "../../services/customerDependency.service";
import listGroup from "../../assets/js/bootstrap_classes/listGroup";

// third
import { useVuelidate } from "@vuelidate/core";
import { required, helpers } from "@vuelidate/validators";


// router utilities and handlers
const router = useRouter();
const route = useRoute();

const goToCustomerDependecyDetail = () => router.push({name: 'customer_dependecy_detail', params: {id: dependency.value.id}});


// dependecy object
const dependency = ref({
    customer: '',
    name: '',
    address: '',
    province: '',
    township: '',
});


const dependencyErrors = ref({
    customer: [],
    name: [],
    address: [],
    province: [],
    township: [],
});


const rules = {
    name: {
        required: helpers.withMessage('El nombre es requerido.', required)
    },
    address: {
        required: helpers.withMessage('La dirección es requerida.', required)
    },
    province: {
        required: helpers.withMessage('La provincia es requerida.', required)
    },
    township: {
        required: helpers.withMessage('El municipio es requerido.', required)
    }
}


// vuelidate object
const v$ = useVuelidate(rules, dependency);


const updateDependency = async (dependency) => {
    try {
        if (await v$.value.$validate) {
            const { data } = await putCustomerDependcy(dependency);
            router.push({
                name: 'customers_detail',
                params: {
                    id: data.customer
                }
            });
        }
    } catch (error) {
        console.error('General error', error)
        if (error.response) {
            dependencyErrors.value = error.response.data
        } else {
            dependencyErrors.value = { message: 'Error inesperado, consulte al desarrollador' }
        }
    }
}


// onMounted cycle
onMounted(async () => {
    const resp = await detailCustomerDependecy(route.params.id);
    dependency.value = resp.data;
});

</script>

<template>
    <div class="row">
        <!-- side menu -->
        <div class="col-md-2">
            <ul :class="listGroup.listGroup">
                <li :class="listGroup.listGroupItem">
                    <strong>Dependencias</strong>
                </li>
                <li :class="listGroup.listGroupItem">
                    <router-link :to="{name: 'customers'}">Clientes</router-link>
                </li>
            </ul>
        </div>

        <!-- main content -->
        <div class="col-md-4">
            <!-- backend errors from non_field_errors dictionary -->
            <span v-if="dependencyErrors.non_field_errors">
                <p
                    class="form-text text-danger"
                    v-for="(error, index) in dependencyErrors.non_field_errors"
                    :key="index">
                    {{ error }}</p>
            </span>
            <!-- backend general errors -->
            <span v-if="dependencyErrors.message">
                <p
                    class="form-text text-danger">
                    {{ dependencyErrors.message }}</p>
            </span>
            <!-- form -->
            <form @submit.prevent="updateDependency(dependency)">
                <span v-if="dependencyErrors.non_field_errors">
                    <p
                        class="form-text text-danger"
                        v-for="(error, i) in dependencyErrors.non_field_errors"
                        :key="i">{{ error.$message }}</p>
                </span>
                <!-- name control -->
                <div class="mb-2">
                    <label for="name" class="form-label">Nombre</label>
                    <input
                      type="text"
                      id="name"
                      class="form-control"
                      v-model.trim="dependency.name"
                      @blur="v$.name.$touch">
                    <span v-if="v$.name.$error">
                        <p
                          class="form-text text-danger"
                          v-for="error in v$.name.$errors"
                          :key="error.$uid">{{ error.$message }}</p>
                    </span>
                    <span v-if="dependencyErrors.name">
                        <p
                          class="form-text text-danger"
                          v-for="(error, i) in dependencyErrors.name"
                          :key="i">{{ error }}</p>
                    </span>
                </div>

                <!-- address control -->
                <div class="mb-2">
                    <label for="address">Dirección</label>
                    <textarea
                      name="address"
                      id="address"
                      class="form-control"
                      v-model.trim="dependency.address"
                      @blur="v$.address.$touch"
                      cols="5"
                      rows="5"></textarea>
                    <span v-if="v$.address.$error">
                        <p
                          class="form-text text-danger"
                          v-for="error in v$.address.$errors"
                          :key="error.$uid">{{ error.$message }}</p>
                    </span>
                    <span v-if="dependencyErrors.address">
                        <p
                          class="form-text text-danger"
                          v-for="(error, i) in dependencyErrors.address"
                          :key="i">{{ error }}</p>
                    </span>
                </div>

                <!-- province control -->
                <div class="mb-2">
                    <label for="province">Provincia</label>
                    <input
                      type="text"
                      id="province"
                      class="form-control"
                      v-model.trim="dependency.province"
                      @blur="v$.province.$touch">
                    <span v-if="v$.province.$error">
                        <p
                          class="form-text text-danger"
                          v-for="error in v$.province.$errors"
                          :key="error.$uid">{{ error.$message }}</p>
                    </span>
                    <span v-if="dependencyErrors.customer_type">
                        <p
                          class="form-text text-danger"
                          v-for="(error, i) in dependencyErrors.province"
                          :key="i">{{ error }}</p>
                    </span>
                </div>

                <!-- township control -->
                <div class="mb-2">
                    <label for="township">Municipio</label>
                    <input
                      type="text"
                      id="township"
                      class="form-control"
                      v-model.trim="dependency.township">
                    <span v-if="v$.township.$error">
                        <p
                          class="form-text text-danger"
                          v-for="error in v$.township.$errors"
                          :key="error.$uid">{{ error.$message }}</p>
                    </span>
                    <span v-if="dependencyErrors.customer_type">
                        <p
                          class="form-text text-danger"
                          v-for="(error, i) in dependencyErrors.township"
                          :key="i">{{ error }}</p>
                    </span>
                </div>

                <!-- buttons -->
                <div class="mb-2">
                    <button
                        type="submit"
                        class="btn btn-sm btn-primary">Guardar</button>
                <button
                    type="button"
                    class="btn btn-sm btn-secondary"
                    @click="goToCustomerDependecyDetail">Cancelar</button>
                </div>
            </form>
        </div>
    </div>
</template>
