<template>
    <nav class="navbar navbar-expand-lg bg-lightblue">
        <div class="container-fluid">
            <a class="navbar-brand" href="#">RefriAll</a>
            <button class="navbar-toggler" type="button" data-bs-toggle="collapse"
                data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false"
                aria-label="Toggle navigation">
                <span class="navbar-toggler-icon"></span>
            </button>
            <div class="collapse navbar-collapse" id="navbarSupportedContent">
                <ul class="navbar-nav me-auto mb-2 mb-lg-0">
                    <li class="nav-item dropdown">
                        <a class="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown"
                            aria-expanded="false">
                            Facturación
                        </a>
                        <ul class="dropdown-menu">
                            <li>
                                <RouterLink class="dropdown-item" :to="{name: 'orders'}">Órdenes</RouterLink>
                            </li>
                            <li>
                                <RouterLink class="dropdown-item" :to="{name: 'bills'}">Facturas</RouterLink>
                            </li>
                        </ul>
                    </li>
                    <li class="nav-item dropdown">
                        <a class="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown"
                            aria-expanded="false">
                            Almacén
                        </a>
                        <ul class="dropdown-menu">
                            <li>
                                <RouterLink class="dropdown-item" :to="{name: 'items'}">Artículos</RouterLink>
                            </li>
                            <li>
                                <RouterLink class="dropdown-item" :to="{name: 'kits'}">Equipos</RouterLink>
                            </li>
                        </ul>
                    </li>
                    <li class="nav-item dropdown">
                        <a class="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown"
                            aria-expanded="false">
                            RRHH
                        </a>
                        <ul class="dropdown-menu">
                            <li>
                                <RouterLink class="dropdown-item" :to="{name: 'providers'}">Prestadores</RouterLink>
                            </li>
                            <li>
                                <RouterLink class="dropdown-item" :to="{name: 'customers'}">Clientes</RouterLink>
                            </li>
                        </ul>
                    </li>
                </ul>
            </div>
            <div class="ms-auto">
                <a href="#" class="btn btn-sm btn-outline-danger">Salir</a>
            </div>
        </div>
    </nav>
</template>

<script setup>

import { RouterLink } from "vue-router";

</script>