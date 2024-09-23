<script setup>
// vue
import { onMounted, ref } from "vue";
import { RouterLink, useRoute } from "vue-router";

// app
import { detatilKit } from "../../services/kit.service";
import listGroup from "../../assets/js/bootstrap_classes/listGroup";


// kit object
const kit = ref({
    name: ''
});

// kit object errors
const kitErrors = ref({
    name: ''
});

// router utilities to redirect the view and catch route params
const route = useRoute();


// loading the kit object
onMounted(async () => {
    try {
        const resp = await detatilKit(route.params.id);
        kit.value = resp.data;
    } catch (error) {
        console.error('General error', error)
        if (error.response) {
            kitErrors.value = `${error.response.data.detail} - ${error.response.status}`
        } else {
            kitErrors.value = 'Error inesperado, consulte al desarrollador'
        }
    }
});

</script>

<style lang="scss" scoped>

</style>

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
                <li :class="listGroup.listGroupItem">
                    <router-link :to="{name: 'kits_create'}">Nuevo</router-link >
                </li>
                <li :class="listGroup.listGroupItem">
                    <router-link :to="{name: 'kits_update', params: {id: kit.id}}">Editar</router-link>
                </li>
                <li :class="listGroup.listGroupItem">
                    <router-link :to="{name: 'kits_confirm_delete', params: {id: kit.id}}">Eliminar</router-link>
                </li>
            </ul>
        </div>

        <!-- main content -->
        <div class="col-md-4">
            <!-- backend general errors -->
            <span v-if="kitErrors">
                <p
                    class="form-text text-danger">
                    {{ kitErrors }}</p>
            </span>
            <h3>{{ kit.name }}</h3>
        </div>

    </div> <!-- end row -->


</template>
