<script setup>

// vue
import { RouterLink, useRoute } from "vue-router";
import { ref, onMounted } from 'vue';

// app
import { detailOrder } from "../../services/order.service";
import listGroup from "../../assets/js/bootstrap_classes/listGroup";

// third
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
    itemtimeorder_set: [],
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
    get_total_amount_prod: 0,
    get_total_amount_concept: 0,
    get_total_amount_repair: 0,
    get_total_amount_maintenace: 0,
    get_total_amount_install: 0,
    get_total_amount_unmounting: 0
});

const notFound = ref(null);

const paginatedOrders = ref([]);

onMounted(async () => {
    try {
        const resp = await detailOrder(route.params.id);
        order.value = resp.data;
    
        paginatedOrders.value = paginate(order, 14);
    } catch (error) {
        notFound.value = 'La orden a la que trata de acceder no existe, haga click en el enlace a órdenes en el menú de la izquierda para ver las órdenes existentes.'        
    }
});

const paginate = (order, itemsPerPage, start=0, pages=[]) => {
    if (start >= order.value.itemtimeorder_set.length) {
        return pages;
    }
    const end = start + itemsPerPage;
    const {itemtimeorder_set, ...rest} = order.value;
    pages.push({
        ...rest,
        itemtimeorder_set: itemtimeorder_set.slice(start, end),
    });
    return paginate(order, itemsPerPage, end, pages);
}

function pdf() {
    const element = document.getElementById('order-to-pdf');
    const output_name = (route.meta.preOrder) ? 
                            (order.value.customer_dependency) ? 
                                `prefactura_${order.value.folio}_${order.value.customer_dependency.name}` : 
                                `prefactura_${order.value.folio}_${order.value.customer.name}`
                            : (order.value.customer_dependency) ? 
                                `orden_de_servicio_${order.value.folio}_${order.value.customer_dependency.name}` : 
                                `orden_de_servicio_${order.value.folio}_${order.value.customer.name}`
    const opt = {
        filename: output_name
    }

    html2pdf().from(element).set(opt).save()
    // html2pdf(element);
}

</script>

<template>
    <div class="row">
        <!-- side menu -->
        <div class="col-md-2">
            <ul :class="listGroup.listGroup">
                <li :class="listGroup.listGroupItem">
                    <strong>Órdenes</strong>
                </li>
                <li :class="listGroup.listGroupItem">
                    <router-link :to="{name: 'orders'}">Órdenes</router-link>
                </li>
                <li :class="listGroup.listGroupItem">
                    <router-link :to="{name: 'orders_create'}">Nueva</router-link >
                </li>
                <li :class="listGroup.listGroupItem">
                    <router-link :to="{name: 'orders_update', params: {id: order.id}}">Editar</router-link>
                </li>
                <li :class="listGroup.listGroupItem">
                    <a href="#" @click="pdf">PDF</a>
                </li>
                <li :class="listGroup.listGroupItem">
                    <router-link :to="{name: 'orders_confirm_delete', params: {id: order.id}}">Eliminar</router-link>
                </li>
            </ul>
        </div>

        <!-- main content -->
        <div class="col-md-9">
            <!-- notfound false -->
             <div v-if="!notFound">
             
            <!-- order info -->
            <div  id="order-to-pdf">
                <!-- paginated orders -->
                <div
                  v-for="(paginatedOrder, index) of paginatedOrders"
                  :key="index"
                  class="row px-3 py-1">
    
                    <div
                      class="col-md-9 d-flex align-items-center justify-content-center border-bottom border-3 mb-1">
                        <h3>{{route.meta.preOrder ? 'Prefactura' : 'Orden de Servicio'}}</h3>
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
                    
                    <div class="col-md-4 border-bottom border-2">
                        <span class="d-block">Equipo: {{ paginatedOrder.kit.name }}</span>
                        <span class="d-block">Marca: {{ paginatedOrder.kit_brand }}</span>
                        <span class="d-block">Modelo: {{ paginatedOrder.kit_model }}</span>
                        <span class="d-block">Serie: {{ paginatedOrder.kit_serial }}</span>
                    </div>
    
                    <div class="col-md-8 border-bottom border-2">
                        <p class="d-block">Descripción del trabajo realizado: </p>
                        <p>{{ paginatedOrder.job_description }}</p>
                    </div>
                    
                    <div class="col-md-12" style="height: 550px;">
    
                        <table class="table table-sm">
    
                            <thead>
                                <tr>
                                    <th>Código</th>
                                    <th>Artículo o Servicio</th>
                                    <th class="text-center">U/M</th>
                                    <th class="text-center">Cantidad</th>
                                    <th class="text-end">Precio</th>
                                    <th class="text-end">Importe</th>
                                </tr>
                            </thead>
    
                            <tbody>
                                <tr v-for="itemtime in paginatedOrder.itemtimeorder_set" :key="itemtime.id">
                                    <td>{{ itemtime.item.code }}</td>
                                    <td>{{ itemtime.item.name }}</td>
                                    <td class="text-center">{{ itemtime.item.get_measurement }}</td>
                                    <td class="text-center">{{ itemtime.times }}</td>
                                    <td class="text-end">{{ itemtime.item.price.toFixed(2) }}</td>
                                    <td class="text-end">{{ (itemtime.item.price * itemtime.times).toFixed(2) }}</td>
                                </tr>
                            </tbody>

                            <tfoot>
                                <tr>
                                    <td>
                                        <strong>Total</strong>
                                    </td>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                    <td class="text-end">
                                        <strong>{{paginatedOrder.get_total_amount.toFixed(2)}}</strong>
                                    </td>
                                </tr>
                            </tfoot>
                        </table>
    
                    </div>
    
                    <div class="col-md-5">
                        <span class="d-block fw-bold">Desglose de importes</span>
                        <div class="row">
                            <div class="col-md-6">
                                <span class="d-block">Rev/Diag.: {{ paginatedOrder.get_total_amount_revision.toFixed(2) }}</span>
                                <span class="d-block">Partes: {{ paginatedOrder.get_total_amount_prod.toFixed(2) }}</span>
                                <span class="d-block">Conceptos: {{ paginatedOrder.get_total_amount_concept.toFixed(2) }}</span>
                                <span class="d-block">Reparación: {{ paginatedOrder.get_total_amount_repair.toFixed(2) }}</span>
                            </div>
                            <div class="col-md-6">
                                <span class="d-block">Mtto: {{ paginatedOrder.get_total_amount_maintenace.toFixed(2) }}</span>
                                <span class="d-block">Instalación: {{ paginatedOrder.get_total_amount_install.toFixed(2) }}</span>
                                <span class="d-block">Montaje/Desm: {{ paginatedOrder.get_total_amount_unmounting.toFixed(2) }}</span>
                            </div>
                        </div>
                        
                    </div>
                    
                    <div class="col-md-4">
                        <span class="d-block fw-bold">Prestador</span>
                        <span class="d-block">Licencia: {{ paginatedOrder.provider.license_number }}</span>
                        <span class="d-block">{{ paginatedOrder.provider.first_name }} {{ paginatedOrder.provider.last_name }}</span>
                        <span class="d-block">No. CI: {{ paginatedOrder.provider.personal_id }}</span>
                        <span class="d-block">Firma: </span>
                        <span class="d-block">Fecha: {{ paginatedOrder.provider_signature_date }}</span>
                    </div>
                    
                    <div class="col-md-3">
                        <span class="d-block fw-bold">Cliente</span>
                        <span class="d-block">Cargo: {{ paginatedOrder.customer_charge }}</span>
                        <span class="d-block">Nombre: </span>
                        <span class="d-block">No. CI: </span>
                        <span class="d-block">Firma: </span>
                        <span class="d-block">Fecha: {{ paginatedOrder.customer_signature_date }}</span>
                    </div>
                    
                    <div v-if="index < paginatedOrders.length - 1" class="html2pdf__page-break"></div>
                <!-- end paginated orders -->
                </div>
            <!-- end order info -->
            </div>

            <!-- end notfound false -->
            </div>
            
            <!-- notfound -->
            <div v-else>
                <p>{{ notFound }}</p>
            </div>

        </div>

    </div> <!-- end row -->

</template>
