<template>
    <div class="row">
        <!-- side menu -->
        <div class="col-md-2">
            <ul class="list-group list-group-flush">
                <li class="list-group-item">
                    <strong>Órdenes</strong>
                </li>
                <li class="list-group-item">
                    <router-link :to="{name: 'orders'}">Órdenes</router-link>
                </li>
                <li class="list-group-item">
                    <router-link :to="{name: 'orders_update', params: {id: order.id}}">Editar</router-link>
                </li>
                <li class="list-group-item">
                    <router-link :to="{name: 'orders_confirm_delete', params: {id: order.id}}">Eliminar</router-link>
                </li>
            </ul>
        </div>

        <!-- main content -->
        <div class="col-md-4">
            <h3>Orden: {{ order.customer.name }}</h3>
            <p>Síntoma: {{ order.symptom }}</p>
            <p>Defecto: {{ order.flaw }}</p>
            <p>Reparación: {{ order.repair_description }}</p>
            <p>Revisión y Diagnóstico: {{ order.check_diagnosis }}</p>
            <p>Reparación: {{ order.repair }}</p>
            <p>Instalación: {{ order.install }}</p>
            <p>Mtto: {{ order.maintenance }}</p>
            <p>Atención: {{ order.support }}</p>
            <p>Equipo: {{ order.kit.name }}</p>
            <p>Marca: {{ order.kit_brand }}</p>
            <p>Modelo: {{ order.kit_model }}</p>
            <p>Serie: {{ order.kit_serial }}</p>
            <p>Descripción del trabajo realizado: {{ order.job_description }}</p>
            <p>Artículos: {{ order.itemtime_set }}</p>
            <p>Prestador: {{ order.provider.first_name }}</p>
            <p>Fecha firma prestador: {{ order.provider_signature_date }}</p>
            <p>Fecha firma cliente: {{ order.customer_signature_date }}</p>
            <p>Nro de cheque: {{ order.check_number }}</p>
            <p>Cargo aprueba: {{ order.charge_aprove }}</p>
            <p>Cargo revisa: {{ order.charge_check }}</p>
            <p>Cargo: {{ order.customer_charge }}</p>
            <p>Nombre cliente: {{ order.customer_name }}</p>
            <p>CI cliente: {{ order.customer_personal_id }}</p>
            <p>Aprobado: {{ order.checked_by }}</p>
            <p>Revisado: {{ order.aproved_by }}</p>
        </div>

    </div> <!-- end row -->

</template>

<script setup>

import { RouterLink, useRoute } from "vue-router";
import { ref, onMounted } from 'vue';
import { detailOrder } from "../../services/order.service";

const route = useRoute();
const order = ref({
    customer: '',
    symptom: '',
    flaw: '',
    repair_description: '',
    folio: '',
    check_diagnosis: false,
    repair: false,
    install: false,
    maintenance: false,
    kit: '',
    kit_brand: '',
    kit_model: '',
    kit_serial: '',
    job_description: '',
    itemtime_set: [],
    provider: 1,
    provider_signature_date: '',
    customer_signature_date: '',
    check_number: '',
    charge_aprove: '',
    charge_check: '',
    customer_charge: '',
    customer_name: '',
    customer_personal_id: '',
    checked_by: '',
    aproved_by: ''
});

onMounted(async () => {
    const resp = await detailOrder(route.params.id);
    order.value = resp.data;
});

</script>

<style lang="scss" scoped>

</style>