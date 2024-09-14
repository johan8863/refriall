

<template>

    <div class="row">
        <!-- side menu -->
        <div class="col-md-2">
            <ul :class="listGroup.listGroup">
                <li :class="listGroup.listGroupItem">
                    <strong>Prestadores</strong>
                </li>
                <li :class="listGroup.listGroupItem">
                    <router-link :to="{name: 'providers'}">Prestadores</router-link>
                </li>
            </ul>
        </div>

        <!-- main content -->
        <div class="col-md-4">
            <form @submit.prevent>
                <!-- name control -->
                <div class="mb-2">
                    <label
                      for="name"
                      class="form-label">Nombre</label>
                    <input
                      type="text"
                      id="name"
                      class="form-control"
                      v-model="provider.name">
                </div>
                <!-- buttons -->
                <div>
                    <input type="submit" class="btn btn-sm btn-primary" value="Guardar">
                    <router-link :to="{name: 'providers'}" class="btn btn-sm btn-secondary">Cancelar</router-link>
                </div>
            </form>
        </div>

    </div> <!-- end row -->

</template>

<script setup>

// vue
import { ref } from 'vue';
import { RouterLink } from "vue-router";

// app
import listGroup from '../../assets/js/bootstrap_classes/listGroup';

const provider = ref({
    id: '',
    username: '',
    first_name: '',
    last_name: '',
    license_number: '',
    personal_id: '',
});

</script>