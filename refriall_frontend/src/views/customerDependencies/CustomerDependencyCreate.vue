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
                <!-- name control -->
                <div class="mb-2">
                    <label for="name" class="form-label">Nombre</label>
                    <input
                      type="text"
                      id="name"
                      class="form-control"
                      v-model.trim="dependency.name">
                </div>

                <!-- address control -->
                <div class="mb-2">
                    <label for="address">Dirección</label>
                    <textarea
                      name="address"
                      id="address"
                      class="form-control"
                      v-model.trim="dependency.address"
                      cols="5"
                      rows="5"></textarea>
                </div>

                <!-- province control -->
                <div class="mb-2">
                    <label for="province">Provincia</label>
                    <input
                      type="text"
                      id="province"
                      class="form-control"
                      v-model.trim="dependency.province">
                </div>

                <!-- township control -->
                <div class="mb-2">
                    <label for="township">Municipio</label>
                    <input
                      type="text"
                      id="township"
                      class="form-control"
                      v-model.trim="dependency.township">
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

import { ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import { postCustomerDependency } from "../../services/customerDependency.service";

const route = useRoute();
const router = useRouter();

const dependency = ref({
    customer: '',
    name: '',
    address: '',
    province: '',
    township: '',
});


const createDependency = async (dependency) => {
    try {
        dependency.customer = route.params.id;
        const { data } = await postCustomerDependency(dependency);
        router.push({
            name: 'customers_detail',
            params: {
                id: data.customer
            }
        });
    } catch (error) {
        console.log(error);
    }
}

</script>