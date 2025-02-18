<script setup>
// vue
import { onMounted, ref } from "vue";
import { RouterLink, useRoute, useRouter } from "vue-router";

// app
import { deleteKit, detatilKit } from "../../services/kit.service";
import listGroup from "../../assets/js/bootstrap_classes/listGroup";

// kit object
const kit = ref({
    name: ''
});

const kitErrors = ref({
    name: ''
});


// router utilities to redirect the view and catch route params
const route = useRoute();
const router = useRouter();

// loading the kit object
onMounted(async () => {
    try {
        const resp = await detatilKit(route.params.id);
        kit.value = resp.data;
    } catch (error) {
        if (error.response) {
            console.log("Error data: ", error.response.data);
            console.log("Error status: ", error.response.status);
            if (error.response.status === 404) {
                kitErrors.value = { message404: 'El equipo que intenta eliminar no existe.' }
            }
        }
    }
});

// delete the kit object
const delKit = async (id) => {
    try {
        await deleteKit(id);
        router.push({name: 'kits'});
    } catch (error) {
        console.error('General error', error)
        if (error.response) {
            console.log("Error data: ", error.response.data);
            console.log("Error status: ", error.response.status);
            if (error.response.status === 400) {
                kitErrors.value = { message: 'El equipo no se puede eliminar porque tiene órdenes asociadas.' }    
            } else if (error.response.status === 404) {
                kitErrors.value = { message404: 'El equipo que intenta eliminar no existe.' }
            }
        } else {
            kitErrors.value = { message: 'Error inesperado, consulte al desarrollador' }
        }
    }
};

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
                    <router-link :to="{ name: 'kits' }">Equipos</router-link>
                </li>
            </ul>
        </div>

        <!-- main content -->
        <div class="col-md-4">
            <!-- backend errors from non_field_errors dictionary -->
            <span v-if="kitErrors.non_field_errors">
                <p
                    class="form-text text-danger"
                    v-for="(error, index) in kitErrors.non_field_errors"
                    :key="index">
                    {{ error }}</p>
            </span>
            <!-- backend general errors -->
            <span v-if="kitErrors.message">
                <p
                    class="form-text text-danger">
                    {{ kitErrors.message }}</p>
            </span>
            <span v-if="kitErrors.message404">
                <p
                    class="form-text text-danger">
                    {{ kitErrors.message404 }}</p>
            </span>
            <div>
                <p>Está seguro que desea eliminar el equipo: {{ kit.name }}</p>
                <button
                  class="btn btn-sm btn-danger"
                  @click="delKit(kit.id)">Eliminar</button>
                <RouterLink
                  :to="{name: 'kits_detail', params: {id: kit.id}}"
                  class="btn btn-sm btn-secondary">Cancelar</RouterLink>
            </div>
        </div>

    </div> <!-- end row -->
</template>
