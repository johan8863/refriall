<template>
    <div class="row">
        <!-- side menu -->
        <div class="col-md-2">
            <ul :class="listGroup.listGroup">
                <li :class="listGroup.listGroupItem">
                    <strong>Dependencias</strong>
                </li>
                <li :class="listGroup.listGroupItem">
                    <router-link :to="{name: 'customers'}">Clientes</router-link>
                </li>
                <li :class="listGroup.listGroupItem">
                    <router-link :to="{name: 'customer_dependecy_update', params: {id: dependency.id}}">Editar</router-link>
                </li>
                <li :class="listGroup.listGroupItem">
                    <router-link :to="{name: 'customer_dependecy_delete', params: {id: dependency.id}}">Eliminar</router-link>
                </li>
            </ul>
        </div>

        <!-- main content -->
        <div class="col-md-4">
            <h3>{{ dependency.name }}</h3>
            <hr>
            <p>{{ dependency.name }}</p>
            <p>{{ dependency.address }}</p>
            <p>{{ dependency.province }}</p>
            <p>{{ dependency.township }}</p>
        </div>

        
    </div>
</template>

<script setup>

// vue
import { ref, onMounted } from "vue";
import { useRoute } from "vue-router";

// app
import { detailCustomerDependecy } from '../../services/customerDependency.service';
import listGroup from "../../assets/js/bootstrap_classes/listGroup";

const route = useRoute();
const dependency = ref({
    customer: '',
    name: '',
    address: '',
    province: '',
    township: '',
});

onMounted(async () => {
    const resp = await detailCustomerDependecy(route.params.id);
    dependency.value = resp.data;
});

</script>