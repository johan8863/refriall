<template>
    <div class="row">
        <!-- side menu -->
        <div class="col-md-2">
            <ul class="list-group list-group-flush">
                <li class="list-group-item">
                    <strong>Artículos</strong>
                </li>
                <li class="list-group-item">
                    <RouterLink :to="{name: 'items'}">Artículos</RouterLink>
                </li>
            </ul>
        </div>

        <!-- main content -->
        <div class="col-md-4">
            <form method="post">
                <!-- code control -->
                <div class="mb-2">
                    <label for="name" class="form-label">Código</label>
                    <input type="text" id="name" class="form-control">
                </div>
                <!-- name control -->
                <div class="mb-2">
                    <label for="name" class="form-label">Nombre</label>
                    <input type="text" id="name" class="form-control">
                </div>
                <!-- item_type control -->
                <div class="mb-2">
                    <label for="name" class="form-label">Tipo</label>
                    <input type="text" id="name" class="form-control">
                </div>
                <!-- measurement control -->
                <div class="mb-2">
                    <label for="name" class="form-label">U/M</label>
                    <input type="text" id="name" class="form-control">
                </div>
                <!-- price control -->
                <div class="mb-2">
                    <label for="name" class="form-label">Precio</label>
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

<script setup>

import { RouterLink } from "vue-router";

</script>

<style lang="scss" scoped>

</style>