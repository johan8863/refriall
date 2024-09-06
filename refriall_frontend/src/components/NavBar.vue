<template>
    <nav class="navbar navbar-expand-lg bg-lightblue">
        <div class="container-fluid">
            <a class="navbar-brand" href="#">RefriAll</a>
            <button class="navbar-toggler" type="button" data-bs-toggle="collapse"
                data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false"
                aria-label="Toggle navigation">
                <span class="navbar-toggler-icon"></span>
            </button>
            <div :class="navBar.navBarCollapse" id="navbarSupportedContent">
                <ul :class="navBar.navBarNav">
                    <li :class="navBar.navItemDropDown">
                        <a :class="navBar.navLinkDropDownToggle" href="#" role="button" data-bs-toggle="dropdown"
                            aria-expanded="false">
                            Facturación
                        </a>
                        <ul :class="navBar.navDropDownMenu">
                            <li>
                                <RouterLink :class="navBar.navDropDownItem" :to="{name: 'orders'}">Órdenes</RouterLink>
                            </li>
                            <li>
                                <RouterLink :class="navBar.navDropDownItem" :to="{name: 'bills'}">Facturas</RouterLink>
                            </li>
                            <li>
                                <RouterLink :class="navBar.navDropDownItem" :to="{name: 'currencies'}">Monedas</RouterLink>
                            </li>
                        </ul>
                    </li>
                    <li :class="navBar.navItemDropDown">
                        <a :class="navBar.navLinkDropDownToggle" href="#" role="button" data-bs-toggle="dropdown"
                            aria-expanded="false">
                            Almacén
                        </a>
                        <ul :class="navBar.navDropDownMenu">
                            <li>
                                <RouterLink :class="navBar.navDropDownItem" :to="{name: 'items'}">Artículos</RouterLink>
                            </li>
                            <li>
                                <RouterLink :class="navBar.navDropDownItem" :to="{name: 'kits'}">Equipos</RouterLink>
                            </li>
                        </ul>
                    </li>
                    <li :class="navBar.navItemDropDown">
                        <a :class="navBar.navLinkDropDownToggle" href="#" role="button" data-bs-toggle="dropdown"
                            aria-expanded="false">
                            RRHH
                        </a>
                        <ul :class="navBar.navDropDownMenu">
                            <li>
                                <RouterLink :class="navBar.navDropDownItem" :to="{name: 'providers'}">Prestadores</RouterLink>
                            </li>
                            <li>
                                <RouterLink :class="navBar.navDropDownItem" :to="{name: 'customers'}">Clientes</RouterLink>
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

// vue
import { RouterLink } from "vue-router";
import { navBar } from "../assets/js/bootstrap_classes/navBar";

</script>