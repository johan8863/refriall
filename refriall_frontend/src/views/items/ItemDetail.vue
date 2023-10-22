<template>
    <div class="row">
        <!-- side menu -->
        <div class="col-md-2">
            <ul class="list-group list-group-flush">
                <li class="list-group-item">
                    <strong>Artículos</strong>
                </li>
                <li class="list-group-item">
                    <RouterLink :to="{name: 'items_list'}">Artículos</RouterLink>
                </li>
            </ul>
        </div>

        <!-- main content -->
        <div class="col-md-4">
            <h3>Artículo: {{ $route.params.id }}</h3>
        </div>

    </div> <!-- end row -->
</template>

<script setup>

import { RouterLink } from "vue-router";

</script>

<style lang="scss" scoped>

</style>