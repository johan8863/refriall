<script setup>
import axios from "axios";
import { ref } from "vue";
import { RouterLink, useRouter } from "vue-router";

const url = 'http://127.0.0.1:8000/stock/kits/';
const kit = ref({});
const router = useRouter();


const postKit = async (kit) => {
    try {
        const resp = await axios.post(url, kit);
        kit.value = {
            name: ''
        };
        router.push({name: 'kits_detail', params: {id: resp.data.id}});
    } catch (error) {
        console.log(error);
    }
};

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
                      @click="postKit(kit)"
                      class="btn btn-sm btn-primary">Guardar</button>
                    <a href="#" class="btn btn-sm btn-secondary">Cancelar</a>
                </div>
            </form>
        </div>

    </div> <!-- end row -->

</template>

<style lang="scss" scoped>

</style>