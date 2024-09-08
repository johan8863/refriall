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
            <!-- notFound false -->
            <div v-if="!notFound">
                <h3>{{ kit.name }}</h3>
            <!-- end notFound false -->
            </div>
            <!-- notFound -->
            <div v-else>
                <p>{{ notFound }}</p>
            </div>
        </div>

    </div> <!-- end row -->


</template>

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

// router utilities to redirect the view and catch route params
const route = useRoute();

const notFound = ref(null);


// loading the kit object
onMounted(async () => {
    try {
        const resp = await detatilKit(route.params.id);
        kit.value = resp.data;
    } catch (error) {
        notFound.value = 'El equipo al que trata de acceder no existe, haga click en el enlace a equipos en el menú de la izquierda para ver las equipos existentes.';
    }
});

</script>

<style lang="scss" scoped>

</style>