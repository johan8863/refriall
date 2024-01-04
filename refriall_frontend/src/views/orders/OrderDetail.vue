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
                    <a href="#" @click="pdf()">PDF</a>
                </li>
                <li class="list-group-item">
                    <router-link :to="{name: 'orders_confirm_delete', params: {id: order.id}}">Eliminar</router-link>
                </li>
            </ul>
        </div>

        <!-- main content -->
        <div class="col-md-8">
            <!-- order info -->
            <div class="row" id="order-to-pdf">

                <div
                  class="col-md-9 d-flex align-items-center justify-content-center border-bottom border-3 mb-1">
                    <h3>Orden de Servicio</h3>
                </div>

                <div class="col-md-3 border-bottom pb-1 border-3 mb-1">
                    <img
                      src="../../assets/logo.png"
                      class="img-fluid"
                      alt="refriall logo"
                      style="height: 100px;">
                </div>

                <div class="col-md-9 border-bottom border-2 mb-1">
                    <span class="d-block">{{ order.customer.name }}</span>
                    <span class="d-block">{{ order.customer.address }}</span>
                    <span class="d-block">{{ order.customer.province }}</span>
                    <span class="d-block">{{ order.customer.township }}</span>
                </div>

                <div class="col-md-3 border-bottom border-2 mb-1">
                    <span class="d-block">Folio: {{ order.folio }}</span>
                    <span class="d-block">Atención: {{ order.get_order_support }}</span>
                </div>

                <div
                  class="col-md-4 d-flex justify-content-center border-bottom border-2 mb-1">
                    <span class="d-block">Síntoma: {{ order.symptom }}</span>
                </div>
                <div
                  class="col-md-4 d-flex justify-content-center border-bottom border-2 mb-1">
                    <span class="d-block">Defecto: {{ order.flaw }}</span>
                </div>
                <div
                  class="col-md-4 d-flex justify-content-center border-bottom border-2 mb-1">
                    <span class="d-block">Reparación: {{ order.repair_description }}</span>
                </div>
                
                <div class="col-md-3 justify-content center border-bottom border-2 mb-1">
                    <span class="d-block">
                        Rev. y Diagnóstico: <span v-if="order.check_diagnosis">X</span>
                    </span>
                </div>

                <div class="col-md-3 justify-content center border-bottom border-2 mb-1">
                    <span class="d-block">
                        Reparación: <span v-if="order.repair">X</span>
                    </span>
                </div>

                <div class="col-md-3 justify-content center border-bottom border-2 mb-1">
                    <span class="d-block">
                        Instalación: <span v-if="order.install">X</span>
                    </span>
                </div>

                <div class="col-md-3 justify-content center border-bottom border-2 mb-1">
                    <span class="d-block">
                        Mtto: <span v-if="order.maintenance">X</span>
                    </span>
                </div>
                
                <div class="col md-2 border-bottom border-2">
                    <span class="d-block">Equipo: {{ order.kit.name }}</span>
                    <span class="d-block">Marca: {{ order.kit_brand }}</span>
                    <span class="d-block">Modelo: {{ order.kit_model }}</span>
                    <span class="d-block">Serie: {{ order.kit_serial }}</span>
                </div>

                <div class="col-md-10 border-bottom border-2">
                    <span class="d-block">Descripción del trabajo realizado: {{ order.job_description }}</span>
                </div>
                
                <div class="col-md-12">

                    <table class="table">

                        <thead>
                            <tr>
                                <th>Código</th>
                                <th>Artículo o Servicio</th>
                                <th>U/M</th>
                                <th>Cantidad</th>
                                <th>Precio</th>
                                <th>Importe</th>
                            </tr>
                        </thead>

                        <tbody>
                            <tr v-for="itemtime in order.itemtime_set" :key="itemtime.id">
                                <td>{{ itemtime.item.code }}</td>
                                <td>{{ itemtime.item.name }}</td>
                                <td>{{ itemtime.item.get_measurement }}</td>
                                <td>{{ itemtime.times }}</td>
                                <td>{{ itemtime.item.price }}</td>
                                <td>{{ itemtime.item.price * itemtime.times }}</td>
                            </tr>
                        </tbody>
                    </table>

                </div>

                <div class="col-md-4">

                    <div class="d-flex justify-content-center">
                        <span class="d-block">Desglose de importes</span>
                    </div>

                    <span class="d-block">Productos: {{ order.get_total_amount_product }}</span>
                    <span class="d-block">Conceptos: {{ order.get_total_amount_concept }}</span>
                    <span class="d-block">Reparación: {{ order.get_total_amount_repair }}</span>
                    <span class="d-block">Mtto: {{ order.get_total_amount_maintenace }}</span>
                    <span class="d-block">Instalación: {{ order.get_total_amount_install }}</span>
                    <span class="d-block">Montaje/Desm: {{ order.get_total_amount_unmounting }}</span>
                    <span class="d-block">Total: {{ order.get_total_amount }}</span>
                    
                </div>
                
                <div class="col-md-4">

                    <div class="d-flex justify-content-center">
                        <span class="d-block">Prestador</span>
                    </div>

                    <span class="d-block">Licencia: {{ order.provider.license_number }}</span>
                    <span class="d-block">{{ order.provider.first_name }} {{ order.provider.last_name }}</span>
                    <span class="d-block">No. CI: {{ order.provider.personal_id }}</span>
                    <span class="d-block">{{ order.provider_signature_date }}</span>

                </div>
                
                <div class="col-md-4">

                    <div class="d-flex justify-content-center">
                        <span class="d-block">Cliente</span>
                    </div>

                    <span class="d-block">Cargo: {{ order.customer_charge }}</span>
                    <span class="d-block">Nombre: </span>
                    <span class="d-block">No. CI: {{ order.provider.personal_id }}</span>
                    <span class="d-block">{{ order.customer_signature_date }}</span>
                </div>
                
                
                <!-- <p>Prestador: {{ order.provider.first_name }}</p>
                <p>Fecha firma prestador: {{ order.provider_signature_date }}</p>
                <p>Fecha firma cliente: {{ order.customer_signature_date }}</p>
                <p>Nro de cheque: {{ order.check_number }}</p>
                <p>Cargo aprueba: {{ order.charge_aprove }}</p>
                <p>Cargo revisa: {{ order.charge_check }}</p>
                <p>Cargo: {{ order.customer_charge }}</p>
                <p>Nombre cliente: {{ order.customer_name }}</p>
                <p>CI cliente: {{ order.customer_personal_id }}</p>
                <p>Aprobado: {{ order.checked_by }}</p>
                <p>Revisado: {{ order.aproved_by }}</p> -->
            </div>
        </div>

    </div> <!-- end row -->

</template>

<script setup>

import { RouterLink, useRoute } from "vue-router";
import { ref, onMounted } from 'vue';
import { detailOrder } from "../../services/order.service";

import html2pdf from "html2pdf.js";

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

function pdf() {
    var element = document.getElementById('order-to-pdf');
    html2pdf(element);
}

</script>

<style lang="scss" scoped>

</style>