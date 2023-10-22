<template>
    <div class="row">
        <!-- side menu -->
        <div class="col-md-2">
            <ul class="list-group list-group-flush">
                <li class="list-group-item">
                    <strong>Equipos</strong>
                </li>
                <li class="list-group-item">
                    <router-link :to="{name: 'kits_list'}">Equipos</router-link>
                </li>
            </ul>
        </div>

        <!-- main content -->
        <div class="col-md-4">
            <h3>Kit: {{ $route.params.id }}</h3>
        </div>
    </div>
</template>

<script setup>

import { RouterLink } from "vue-router";

</script>

<style lang="scss" scoped>

</style>