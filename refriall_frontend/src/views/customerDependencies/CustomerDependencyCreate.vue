<template>
    <div class="row">
        <!-- side menu -->
        <div class="col-md-2">
            <ul class="list-group list-group-flush">
                <li class="list-group-item">
                    <strong>Dependencias</strong>
                </li>
                <li class="list-group-item">
                    <router-link :to="{name: 'customers'}">Clientes</router-link>
                </li>
            </ul>
        </div>

        <!-- main content -->
        <div class="col-md-4">
            <!-- form -->
            <form method="post" @submit.prevent>
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
                        class="btn btn-sm btn-primary"
                        @click="createDependency(dependency)">Guardar</button>
                </div>
            </form>
        </div>
    </div>
</template>

<script setup>

// vue
import { ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import { postCustomerDependency } from "../../services/customerDependency.service";

// third
import { useVuelidate } from "@vuelidate/core";
import { required, helpers } from "@vuelidate/validators";

const route = useRoute();
const router = useRouter();

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

const createDependency = async (dependency) => {
    try {
        if (await v$.value.$validate) {
            dependency.customer = route.params.id;
            const { data } = await postCustomerDependency(dependency);
            router.push({
                name: 'customers_detail',
                params: {
                    id: data.customer
                }
            });
        }
    } catch (error) {
        dependencyErrors.value = error.response.data;
    }
}

</script>