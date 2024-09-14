<script setup>
// vue
import { ref, onMounted } from "vue";
import { RouterLink, useRouter, useRoute } from "vue-router";

// local
import { postKit, putKit, detatilKit } from "../../services/kit.service";
import listGroup from "../../assets/js/bootstrap_classes/listGroup";

// third
import { useVuelidate } from "@vuelidate/core";
import { required, helpers } from "@vuelidate/validators";


// kit object for post and put requests
const kit = ref({
    name: ''
});

// kit object to catch error messages from
// django rest api
const kitErrors = ref({
    name: [],
    detail: [],
});

// router utilities to redirect after forms submisions
// and to get the id of the object in case of editing intended
const router = useRouter();
const route = useRoute();

// rules to manage front validations
const rules = {
    name: {
        required: helpers.withMessage('El nombre es requierido.', required)
    }
};

// vuelidate object
const v$ = useVuelidate(rules, kit);

// create kit object function
const createKit = async (kit) => {
    try {
        if (await v$.value.$validate()) {
            // if front validations run,
            // post the object and redirect to its detail view
            const { data } = await postKit(kit);
            router.push({name: 'kits_detail', params: {id: data.id}});
        }
    } catch (error) {
        // in case of backend errors, assign the errors dictionary
        // to the kit errors object
        kitErrors.value = error.response.data;
    }
};

const updateKit = async (kit) => {
    try {
        // if front validations run,
        // put the object and redirect to its detail view
        if (await v$.value.$validate()) {
            const { data } = await putKit(kit);
            router.push({name: 'kits_detail', params: {id: data.id}});
        }
    } catch (error) {
        // in case of backend errors, assign the errors dictionary
        // to the kit errors object
        kitErrors.value = error.response.data;
    }
};

onMounted(async () => {
    try {
        const id = route.params.id;
        if (id) {
            const { data } = await detatilKit(id);
            kit.value = data;
        }
    } catch (error) {
        // in case of backend errors, assign the errors dictionary
        // to the kit errors object
        kitErrors.value = error.response.data;
        console.log(error.response.data);
    }
});

</script>

<template>

    <div class="row">
        <!-- side menu -->
        <div class="col-md-2">
            <ul :class="listGroup.listGroup">
                <li :class="listGroup.listGroupItem">
                    <strong>Equipos</strong>
                </li>
                <li :class="listGroup.listGroupItem">
                    <router-link :to="{name: 'kits'}">Equipos</router-link>
                </li>
            </ul>
        </div>

        <!-- main content -->
        <div class="col-md-4">
            <!-- form -->
            <form @submit.prevent>
                <span v-if="kitErrors.non_field_errors">
                    <p
                        class="form-text text-danger"
                        v-for="(error, i) in kitErrors.non_field_errors"
                        :key="i">{{ error.$message }}</p>
                </span>
                <!-- name control -->
                <div class="mb-2">
                    <label for="name" class="form-label">Nombre</label>
                    <input
                      autofocus
                      type="text"
                      id="name"
                      class="form-control"
                      v-model.trim="kit.name"
                      @blur="v$.name.$touch">
                    <span v-if="v$.name.$error">
                        <p
                          class="form-text text-danger"
                          v-for="error in v$.name.$errors"
                          :key="error.$uid">{{ error.$message }}</p>
                    </span>
                    <span v-if="kitErrors.name">
                        <p
                          class="form-text text-danger"
                          v-for="(error, index) in kitErrors.name"
                          :key="index">{{ error }}</p>
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
                      @click="!kit.id ? createKit(kit) : updateKit(kit)"
                      class="btn btn-sm btn-primary">
                        {{ !kit.id ? 'Guardar' : 'Actualizar' }}
                    </button>
                      <router-link :to="{name: 'kits'}" class="btn btn-sm btn-secondary">Cancelar</router-link>
                </div>
            </form>
        </div>

    </div> <!-- end row -->

</template>
