<template>
    <div class="row">
        <!-- side menu -->
        <div class="col-md-2">
            <ul class="list-group list-group-flush">
                <li class="list-group-item">
                    <strong>Equipos</strong>
                </li>
                <li class="list-group-item">
                    <router-link :to="{name: 'kits'}">Equipos</router-link>
                </li>
                <li class="list-group-item">
                    <router-link :to="{name: 'kits_update', params: {id: kit.id}}">Editar</router-link>
                </li>
                <li class="list-group-item">
                    <a
                      href="#"
                      data-bs-toggle="modal"
                      data-bs-target="#deleteKitModal">Eliminar</a>
                </li>
            </ul>
        </div>

        <!-- main content -->
        <div class="col-md-4">
            <h3>{{ kit.name }}</h3>
        </div>

    </div> <!-- end row -->

    <!-- Modal -->
    <div class="modal fade" id="deleteKitModal" tabindex="-1" aria-labelledby="deleteKitModalLabel" aria-hidden="true">
        <div class="modal-dialog">
            <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title" id="deleteKitModalLabel">Atención</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
                <p>¿Está seguro de eliminar el equipo: {{kit.name}}?</p>
            </div>
            <div class="modal-footer">
                <form method="post" @submit.prevent>
                    <button
                      class="btn btn-outline-danger btn-sm"
                      @click="delKit(kit.id)">Eliminar</button>
                    <button type="button" class="btn btn-outline-secondary btn-sm" data-bs-dismiss="modal">Cancelar</button>
                </form>
            </div>
            </div>
        </div>
    </div>

</template>

<script setup>
// vue
import { onMounted, ref } from "vue";
import { RouterLink, useRoute, useRouter } from "vue-router";

// third
import "bootstrap";

// local
import { deleteKit, detatilKit } from "../../services/kit.service";
import bootstrap from "bootstrap";

// kit object
const kit = ref({
    name: ''
});

// router utilities to redirect the view and catch route params
const route = useRoute();
const router = useRouter();

// bootstrap modal
const kitModal  = new bootstrap.Modal(document.getElementById('deleteKitModal'));


// loading the kit object
onMounted(async () => {
    const resp = await detatilKit(route.params.id);
    kit.value = resp.data;
});

// delete the kit object
const delKit = async (id) => {
    try {
        await deleteKit(id);
        // kitModal.dispose()
        router.push({name: 'kits'});
    } catch (error) {
        // in case of backend errors, log to the console... for now
        console.log(error.response.data);
    }
};

</script>

<style lang="scss" scoped>

</style>