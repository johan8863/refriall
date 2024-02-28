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
                    <router-link :to="{name: 'orders_create'}">Nueva</router-link >
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
        <div class="col-md-9">
            <!-- order info -->
            <div  id="order-to-pdf">
                <!-- paginated orders -->
                <div
                  v-for="(paginatedOrder, index) of paginatedOrders"
                  :key="index"
                  class="row px-3 py-1">
    
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
    
                    <div v-if="paginatedOrder.customer" class="col-md-9 border-bottom border-2 mb-1">
                        <span class="d-block">{{ paginatedOrder.customer.name }}</span>
                        <span class="d-block">{{ paginatedOrder.customer.address }}</span>
                        <span class="d-block">{{ paginatedOrder.customer.province }}</span>
                        <span class="d-block">{{ paginatedOrder.customer.township }}</span>
                    </div>

                    <div v-if="paginatedOrder.customer_dependency" class="col-md-9 border-bottom border-2 mb-1">
                        <span class="d-block">{{ paginatedOrder.customer_dependency.name }}</span>
                        <span class="d-block">{{ paginatedOrder.customer_dependency.address }}</span>
                        <span class="d-block">{{ paginatedOrder.customer_dependency.province }}</span>
                        <span class="d-block">{{ paginatedOrder.customer_dependency.township }}</span>
                    </div>

                    <div class="col-md-3 border-bottom border-2 mb-1">
                        <span class="d-block">Folio: {{ order.folio }}</span>
                        <span class="d-block">Atención: {{ order.get_order_support }}</span>
                    </div>
    
                    <div
                      class="col-md-4 d-flex justify-content-center border-bottom border-2 mb-1">
                        <span class="d-block">Síntoma: {{ paginatedOrder.symptom }}</span>
                    </div>
                    <div
                      class="col-md-4 d-flex justify-content-center border-bottom border-2 mb-1">
                        <span class="d-block">Defecto: {{ paginatedOrder.flaw }}</span>
                    </div>
                    <div
                      class="col-md-4 d-flex justify-content-center border-bottom border-2 mb-1">
                        <span class="d-block">Reparación: {{ paginatedOrder.repair_description }}</span>
                    </div>
                    
                    <div class="col-md-3 justify-content center border-bottom border-2 mb-1">
                        <span class="d-block">
                            Rev. y Diagnóstico: <span v-if="paginatedOrder.check_diagnosis">X</span>
                        </span>
                    </div>
    
                    <div class="col-md-3 justify-content center border-bottom border-2 mb-1">
                        <span class="d-block">
                            Reparación: <span v-if="paginatedOrder.repair">X</span>
                        </span>
                    </div>
    
                    <div class="col-md-3 justify-content center border-bottom border-2 mb-1">
                        <span class="d-block">
                            Instalación: <span v-if="paginatedOrder.install">X</span>
                        </span>
                    </div>
    
                    <div class="col-md-3 justify-content center border-bottom border-2 mb-1">
                        <span class="d-block">
                            Mtto: <span v-if="paginatedOrder.maintenance">X</span>
                        </span>
                    </div>
                    
                    <div class="col md-2 border-bottom border-2">
                        <span class="d-block">Equipo: {{ paginatedOrder.kit.name }}</span>
                        <span class="d-block">Marca: {{ paginatedOrder.kit_brand }}</span>
                        <span class="d-block">Modelo: {{ paginatedOrder.kit_model }}</span>
                        <span class="d-block">Serie: {{ paginatedOrder.kit_serial }}</span>
                    </div>
    
                    <div class="col-md-10 border-bottom border-2">
                        <span class="d-block">Descripción del trabajo realizado: {{ paginatedOrder.job_description }}</span>
                    </div>
                    
                    <div class="col-md-12" style="height: 495px;">
    
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
                                <tr v-for="itemtime in paginatedOrder.itemtime_set" :key="itemtime.id">
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
                        <span class="d-block fw-bold">Desglose de importes</span>
                        <span class="d-block">Rev/Diag.: {{ paginatedOrder.get_total_amount_revision }}</span>
                        <span class="d-block">Partes: {{ paginatedOrder.get_total_amount_part }}</span>
                        <span class="d-block">Conceptos: {{ paginatedOrder.get_total_amount_concept }}</span>
                        <span class="d-block">Reparación: {{ paginatedOrder.get_total_amount_repair }}</span>
                        <span class="d-block">Mtto: {{ paginatedOrder.get_total_amount_maintenace }}</span>
                        <span class="d-block">Instalación: {{ paginatedOrder.get_total_amount_install }}</span>
                        <span class="d-block">Montaje/Desm: {{ paginatedOrder.get_total_amount_unmounting }}</span>
                        <span class="d-block">Total: {{ paginatedOrder.get_total_amount }}</span>
                        
                    </div>
                    
                    <div class="col-md-4">
                        <span class="d-block fw-bold">Prestador</span>
                        <span class="d-block">Licencia: {{ paginatedOrder.provider.license_number }}</span>
                        <span class="d-block">{{ paginatedOrder.provider.first_name }} {{ paginatedOrder.provider.last_name }}</span>
                        <span class="d-block">No. CI: {{ paginatedOrder.provider.personal_id }}</span>
                        <span class="d-block">Firma: </span>
                        <span v-if="paginatedOrder.provider_signature_date" class="d-block">{{ paginatedOrder.provider_signature_date }}</span>
                        <span v-else class="d-block">Fecha: </span>
    
                    </div>
                    
                    <div class="col-md-4">
                        <span class="d-block fw-bold">Cliente</span>
                        <span class="d-block">Cargo: {{ paginatedOrder.customer_charge }}</span>
                        <span class="d-block">Nombre: </span>
                        <span class="d-block">No. CI: {{ paginatedOrder.provider.personal_id }}</span>
                        <span class="d-block">Firma: </span>
                        <span v-if="paginatedOrder.customer_signature_date" class="d-block">{{ paginatedOrder.customer_signature_date }}</span>
                        <span v-else class="d-block">Fecha: </span>
                    </div>
                    
                    <div v-if="index < paginatedOrders.length - 1" class="html2pdf__page-break"></div>
                </div>
                <!-- end paginated orders -->
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
    customer_dependency: '',
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
    aproved_by: '',
    get_total_amount: 0,
    get_total_amount_revision: 0,
    get_total_amount_part: 0,
    get_total_amount_concept: 0,
    get_total_amount_repair: 0,
    get_total_amount_maintenace: 0,
    get_total_amount_install: 0,
    get_total_amount_unmounting: 0
});

const paginatedOrders = ref([]);

onMounted(async () => {
    const resp = await detailOrder(route.params.id);
    order.value = resp.data;

    paginatedOrders.value = paginate(order, 11);
});

const paginate = (order, itemsPerPage, start=0, pages=[]) => {
    if (start >= order.value.itemtime_set.length) {
        return pages;
    }
    const end = start + itemsPerPage;
    pages.push({
        customer: order.value.customer,
        customer_dependency: order.value.customer_dependency,
        symptom: order.value.symptom,
        flaw: order.value.flaw,
        repair_description: order.value.repair_description,
        folio: order.value.folio,
        check_diagnosis: order.value.check_diagnosis,
        repair: order.value.repair,
        install: order.value.install,
        maintenance: order.value.maintenance,
        kit: order.value.kit,
        kit_brand: order.value.kit_brand,
        kit_model: order.value.kit_model,
        kit_serial: order.value.kit_serial,
        job_description: order.value.job_description,
        itemtime_set: order.value.itemtime_set.slice(start, end),
        provider: order.value.provider,
        provider_signature_date: order.value.provider_signature_date,
        customer_signature_date: order.value.customer_signature_date,
        check_number: order.value.check_number,
        charge_aprove: order.value.charge_aprove,
        charge_check: order.value.charge_check,
        customer_charge: order.value.customer_charge,
        customer_name: order.value.customer_name,
        customer_personal_id: order.value.customer_personal_id,
        checked_by: order.value.checked_by,
        aproved_by: order.value.aproved_by,
        get_total_amount: order.value.get_total_amount,
        get_total_amount_revision: order.value.get_total_amount_revision,
        get_total_amount_part: order.value.get_total_amount_part,
        get_total_amount_concept: order.value.get_total_amount_concept,
        get_total_amount_repair: order.value.get_total_amount_repair,
        get_total_amount_maintenace: order.value.get_total_amount_maintenace,
        get_total_amount_install: order.value.get_total_amount_install,
        get_total_amount_unmounting: order.value.get_total_amount_unmounting
    });
    return paginate(order, itemsPerPage, end, pages);
}

function pdf() {
    const element = document.getElementById('order-to-pdf');
    const opt = {
        filename: 'orden_de_servicio'
    }

    html2pdf().from(element).set(opt).save()
    // html2pdf(element);
}

</script>

<style lang="scss" scoped>

</style>