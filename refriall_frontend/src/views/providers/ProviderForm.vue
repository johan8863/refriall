

<template>

    <div class="row">
        <!-- side menu -->
        <div class="col-md-2">
            <ul class="list-group list-group-flush">
                <li class="list-group-item">
                    <strong>Prestadores</strong>
                </li>
                <li class="list-group-item">
                    <router-link :to="{name: 'providers'}">Prestadores</router-link>
                </li>
            </ul>
        </div>

        <!-- main content -->
        <div class="col-md-4">
            <form method="post">
                <!-- name control -->
                <div class="mb-2">
                    <label for="name" class="form-label">Nombre</label>
                    <input type="text" id="name" class="form-control">
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

import { RouterLink } from "vue-router";
import { ref } from 'vue';

const provider = ref({
    id: '',
    username: '',
    first_name: '',
    last_name: '',
    license_number: '',
    personal_id: '',
});

</script>