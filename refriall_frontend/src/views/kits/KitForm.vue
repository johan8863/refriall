<script setup>

import { RouterLink } from "vue-router";

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
            <form method="post">
                <!-- name control -->
                <div class="mb-2">
                    <label for="name" class="form-label">Nombre</label>
                    <input type="text" id="name" class="form-control">
                </div>
                <!-- buttons -->
                <div>
                    <input type="submit" class="btn btn-sm btn-primary" value="Guardar">
                    <a href="#" class="btn btn-sm btn-secondary">Cancelar</a>
                </div>
            </form>
        </div>

    </div> <!-- end row -->

</template>

<style lang="scss" scoped>

</style>