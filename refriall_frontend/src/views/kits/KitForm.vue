<script setup>
import { ref, onMounted } from "vue";
import { RouterLink, useRouter, useRoute } from "vue-router";
import { postKit, putKit, detatilKit } from "../../services/kit.service";

const kit = ref({
    name: ''
});
const router = useRouter();
const route = useRoute();

const createKit = async (kit) => {
    const { data } = await postKit(kit);
    router.push({name: 'kits_detail', params: {id: data.id}});
};

const updateKit = async (kit) => {
    const { data } = await putKit(kit);
    router.push({name: 'kits_detail', params: {id: data.id}});
};

onMounted(async () => {
    const id = route.params.id;
    if (id) {
        const { data } = await detatilKit(id);
        kit.value = data;
    }
});

</script>

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
            </ul>
        </div>

        <!-- main content -->
        <div class="col-md-4">
            <form method="post" @submit.prevent>
                <!-- name control -->
                <div class="mb-2">
                    <label for="name" class="form-label">Nombre</label>
                    <input
                      type="text"
                      id="name"
                      class="form-control"
                      v-model.trim="kit.name">
                </div>
                <!-- buttons -->
                <div>
                    <button
                      type="button"
                      @click="kit.id ? updateKit(kit) : createKit(kit)"
                      class="btn btn-sm btn-primary">{{kit.id ? 'Actualizar' : 'Guardar'}}</button>
                      <router-link :to="{name: 'kits'}" class="btn btn-sm btn-secondary">Cancelar</router-link>
                </div>
            </form>
        </div>

    </div> <!-- end row -->

</template>

<style lang="scss" scoped>

</style>