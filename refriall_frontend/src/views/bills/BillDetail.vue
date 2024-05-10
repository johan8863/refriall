<template>
    <div class="row">
        <!-- side menu -->
        <div class="col-md-2">
            <ul class="list-group list-group-flush">
                <li class="list-group-item">
                    <strong>Facturas</strong>
                </li>
                <li class="list-group-item">
                    <router-link :to="{name: 'bills'}">Facturas</router-link>
                </li>
                <li class="list-group-item">
                    <router-link :to="{name: 'bills_create'}">Nueva</router-link >
                </li>
                <li class="list-group-item">
                    <router-link :to="{name: 'bills_update', params: {id: bill.id}}">Editar</router-link>
                </li>
                <li class="list-group-item">
                    <a href="#"  @click="pdf()">PDF</a>
                </li>
                <li class="list-group-item">
                    <router-link :to="{name: 'bills_delete', params: {id: bill.id}}">Eliminar</router-link>
                </li>
            </ul>
        </div>
        
        <!-- main content -->
        <div class="col-md-9">
            <!-- bill info -->
            <div  id="bill-to-pdf">
                <!-- paginated bills -->
                <div
                  v-for="(paginatedBill, index) of paginatedBills"
                  :key="index"
                  class="row px-3 py-1">

                    <div
                        class="col-md-9 d-flex align-items-center justify-content-center border-bottom border-3 mb-1">
                        <h3>Factura</h3>
                    </div>

                    <div class="col-md-3 border-bottom pb-1 border-3 mb-1">
                        <img
                          src="../../assets/logo.png"
                          class="img-fluid"
                          alt="refriall logo"
                          style="height: 100px;">
                    </div>
                    
                    <div v-if="paginatedBill.customer" class="col-md-5 border-bottom border-2 mb-1">
                        <span class="d-block fw-bold">Cliente</span>
                        <span class="d-block">{{ paginatedBill.customer.name }}</span>
                        <span class="d-block">{{ paginatedBill.customer.address }}</span>
                        <span class="d-block">{{ paginatedBill.customer.bank_account_header }}</span>
                        <span class="d-block">{{ paginatedBill.customer.bank_account }}</span>
                    </div>

                    <div class="col-md-5 border-bottom border-2 mb-1">
                        <span class="d-block fw-bold">Prestador</span>
                        <span class="d-block">Código TPCP: {{ paginatedBill.provider.tcp_code }}</span>
                        <span class="d-block">Titular de Cta: {{ paginatedBill.provider.bank_account_header }}</span>
                        <span class="d-block">No. de cuenta TPCP: {{ paginatedBill.provider.bank_account }}</span>
                        <span class="d-block">No. de Licencia: {{ paginatedBill.provider.license_number }}</span>
                    </div>

                    <div class="col-md-2 border-bottom border-2 mb-1">
                        <span class="d-block">
                            <span class="fw-bold">Folio: </span>{{ paginatedBill.folio }}
                        </span>
                    </div>

                    <div class="col-md-12" style="height: 610px;">
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
                                <tr v-for="item in paginatedBill.items" :key="item.id">
                                    <td>{{ item.item.code }}</td>
                                    <td>{{ item.item.name }}</td>
                                    <td class="text-center">{{ item.item.get_measurement }}</td>
                                    <td class="text-center">{{ item.times }}</td>
                                    <td class="text-end">{{ item.item.price.toFixed(2) }}</td>
                                    <td class="text-end">{{ (item.item.price * item.times).toFixed(2) }}</td>
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
                                        <strong>{{paginatedBill.get_total_amount.toFixed(2)}}</strong>
                                    </td>
                                </tr>
                            </tfoot>

                        </table>

                    </div>
                    
                    <div class="col-md-12">
                        <p>
                            Órdenes asociadas:
                            <span v-for="order of paginatedBill.get_orders_folio" :key="order.folio">
                                {{ order.folio }}, 
                            </span>
                        </p>
                    </div>
                    
                    <div class="col-md-4">
                        <span class="d-block fw-bold">Desglose de importes</span>
                        <span class="d-block">Rev/Diag.: {{ paginatedBill.get_total_amount_revision.toFixed(2) }}</span>
                        <span class="d-block">Partes: {{ paginatedBill.get_total_amount_prod.toFixed(2) }}</span>
                        <span class="d-block">Conceptos: {{ paginatedBill.get_total_amount_concept.toFixed(2) }}</span>
                        <span class="d-block">Reparación: {{ paginatedBill.get_total_amount_repair.toFixed(2) }}</span>
                        <span class="d-block">Mtto: {{ paginatedBill.get_total_amount_maintenace.toFixed(2) }}</span>
                        <span class="d-block">Instalación: {{ paginatedBill.get_total_amount_install.toFixed(2) }}</span>
                        <span class="d-block">Montaje/Desm: {{ paginatedBill.get_total_amount_unmounting.toFixed(2) }}</span>
                        
                    </div>
                    
                    <div class="col-md-4">
                        <span class="d-block fw-bold">Prestador</span>
                        <span class="d-block">Licencia: {{ paginatedBill.provider.license_number }}</span>
                        <span class="d-block">{{ paginatedBill.provider.first_name }} {{ paginatedBill.provider.last_name }}</span>
                        <span class="d-block">No. CI: {{ paginatedBill.provider.personal_id }}</span>
                        <span class="d-block">Firma: </span>
                        <span v-if="paginatedBill.provider_signature_date" class="d-block">{{ paginatedBill.provider_signature_date }}</span>
                        <span v-else class="d-block">Fecha: </span>
    
                    </div>
                    
                    <div class="col-md-4">
                        <span class="d-block fw-bold">Cliente</span>
                        <span class="d-block">Cargo: {{ paginatedBill.customer_charge }}</span>
                        <span class="d-block">Nombre: </span>
                        <span class="d-block">No. CI: {{ paginatedBill.customer_personal_id }}</span>
                        <span class="d-block">Firma: </span>
                        <span v-if="paginatedBill.customer_signature_date" class="d-block">{{ paginatedBill.customer_signature_date }}</span>
                        <span v-else class="d-block">Fecha: </span>
                    </div>
                    
                    <div v-if="index < paginatedBills.length - 1" class="html2pdf__page-break"></div>

                </div> <!-- end paginated bills -->

            </div> <!-- end bill info -->

        </div> <!-- end main content -->
        
    </div>
</template>

<script setup>
// vue
import { onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';

// app
import { detailBill } from '../../services/bill.service';

// third
import html2pdf from "html2pdf.js";


const bill = ref({
    customer: '',
    customer_dependency: '',
    folio: '',
    provider: '',
    provider_signature_date: '',
    customer_signature_date: '',
    get_orders: [],
    get_orders_folio: [],
    get_total_amount: '',
    get_total_amount_revision: '',
    get_total_amount_prod: '',
    get_total_amount_concept: '',
    get_total_amount_repair: '',
    get_total_amount_maintenace: '',
    get_total_amount_install: '',
    get_total_amount_unmounting: '',
    check_number: '',
    charge_aprove: '',
    charge_check: '',
    customer_charge: '',
    customer_name: '',
    customer_personal_id: '',
    checked_by: '',
    aproved_by: '',
});

const billToPaginate = ref({
    customer: '',
    customer_dependency: '',
    folio: '',
    provider: '',
    provider_signature_date: '',
    customer_signature_date: '',
    items: [],
    get_orders_folio: [],
    get_total_amount: '',
    get_total_amount_revision: '',
    get_total_amount_prod: '',
    get_total_amount_concept: '',
    get_total_amount_repair: '',
    get_total_amount_maintenace: '',
    get_total_amount_install: '',
    get_total_amount_unmounting: '',
    check_number: '',
    charge_aprove: '',
    charge_check: '',
    customer_charge: '',
    customer_name: '',
    customer_personal_id: '',
    checked_by: '',
    aproved_by: '',
});

const route = useRoute();

const paginatedBills = ref([]);

onMounted(async () => {
    const resp = await detailBill(route.params.id);
    bill.value = resp.data;

    prepareBillToPaginate(billToPaginate, bill);

    paginatedBills.value = paginate(billToPaginate, 15);
});

const prepareBillToPaginate = (billToPaginate, bill) => {
    // fill the billToPaginate items attrs with all the items from
    // all the orders of the current bill
    for (const order of bill.value.get_orders) {
        billToPaginate.value.items = billToPaginate.value.items.concat(order.itemtimeorder_set)
    }
    
    billToPaginate.value.customer = bill.value.customer
    billToPaginate.value.customer_dependency = bill.value.customer_dependency
    billToPaginate.value.folio = bill.value.folio
    billToPaginate.value.provider = bill.value.provider
    billToPaginate.value.provider_signature_date = bill.value.provider_signature_date
    billToPaginate.value.customer_signature_date = bill.value.customer_signature_date
    billToPaginate.value.get_orders_folio = bill.value.get_orders_folio
    billToPaginate.value.get_total_amount = bill.value.get_total_amount
    billToPaginate.value.get_total_amount_revision = bill.value.get_total_amount_revision
    billToPaginate.value.get_total_amount_prod = bill.value.get_total_amount_prod
    billToPaginate.value.get_total_amount_concept = bill.value.get_total_amount_concept
    billToPaginate.value.get_total_amount_repair = bill.value.get_total_amount_repair
    billToPaginate.value.get_total_amount_maintenace = bill.value.get_total_amount_maintenace
    billToPaginate.value.get_total_amount_install = bill.value.get_total_amount_install
    billToPaginate.value.get_total_amount_unmounting = bill.value.get_total_amount_unmounting
    billToPaginate.value.check_number = bill.value.check_number
    billToPaginate.value.charge_aprove = bill.value.charge_aprove
    billToPaginate.value.charge_check = bill.value.charge_check
    billToPaginate.value.customer_charge = bill.value.customer_charge
    billToPaginate.value.customer_name = bill.value.customer_name
    billToPaginate.value.customer_personal_id = bill.value.customer_personal_id
    billToPaginate.value.checked_by = bill.value.checked_by
    billToPaginate.value.aproved_by = bill.value.aproved_by
}

const paginate = (bill, itemsPerPage, start=0, pages=[]) => {
    if (start >= bill.value.items.length) {
        return pages;
    }
    const end = start + itemsPerPage;
    pages.push({
        customer: bill.value.customer,
        customer_dependency: bill.value.customer_dependency,
        folio: bill.value.folio,
        provider: bill.value.provider,
        provider_signature_date: bill.value.provider_signature_date,
        customer_signature_date: bill.value.customer_signature_date,
        items: bill.value.items.slice(start, end),
        get_orders_folio: bill.value.get_orders_folio,
        get_total_amount: bill.value.get_total_amount,
        get_total_amount_revision: bill.value.get_total_amount_revision,
        get_total_amount_prod: bill.value.get_total_amount_prod,
        get_total_amount_concept: bill.value.get_total_amount_concept,
        get_total_amount_repair: bill.value.get_total_amount_repair,
        get_total_amount_maintenace: bill.value.get_total_amount_maintenace,
        get_total_amount_install: bill.value.get_total_amount_install,
        get_total_amount_unmounting: bill.value.get_total_amount_unmounting,
        check_number: bill.value.check_number,
        charge_aprove: bill.value.charge_aprove,
        charge_check: bill.value.charge_check,
        customer_charge: bill.value.customer_charge,
        customer_name: bill.value.customer_name,
        customer_personal_id: bill.value.customer_personal_id,
        checked_by: bill.value.checked_by,
        aproved_by: bill.value.aproved_by,
    });
    return paginate(bill, itemsPerPage, end, pages);
}

function pdf() {
    const element = document.getElementById('bill-to-pdf');
    const opt = {
        filename: `factura_${bill.value.folio}_${bill.value.customer.name}`
    }

    html2pdf().from(element).set(opt).save()
}

</script>