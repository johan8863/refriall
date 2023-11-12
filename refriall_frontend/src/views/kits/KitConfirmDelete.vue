<template>
    <div class="row">
        <!-- side menu -->
        <div class="col-md-2">
            <ul class="list-group list-group-flush">
                <li class="list-group-item">
                    <strong>Equipos</strong>
                </li>
                <li class="list-group-item">
                    <router-link :to="{ name: 'kits' }">Equipos</router-link>
                </li>
            </ul>
        </div>

        <!-- main content -->
        <div class="col-md-4">
            <div>
                <p>Está seguro que desea eliminar el equipo: {{ kit.name }}</p>
                <button
                  class="btn btn-sm btn-danger"
                  @click="delKit(kit.id)">Eliminar</button>
                <RouterLink
                  :to="{name: 'kits'}"
                  class="btn btn-sm btn-secondary">Cancelar</RouterLink>
            </div>
        </div>

    </div> <!-- end row -->
</template>

<script setup>
// vue
import { onMounted, ref } from "vue";
import { RouterLink, useRoute, useRouter } from "vue-router";

// local
import { deleteKit, detatilKit } from "../../services/kit.service";

// kit object
const kit = ref({
    name: ''
});


// router utilities to redirect the view and catch route params
const route = useRoute();
const router = useRouter();

// loading the kit object
onMounted(async () => {
    const resp = await detatilKit(route.params.id);
    kit.value = resp.data;
});

// delete the kit object
const delKit = async (id) => {
    try {
        await deleteKit(id);
        router.push({name: 'kits'});
    } catch (error) {
        // in case of backend errors, log to the console... for now
        console.log(error.response.data);
    }
};

</script>

<style lang="scss" scoped></style>