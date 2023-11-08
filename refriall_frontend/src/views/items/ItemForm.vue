<template>
    <div class="row">
        <!-- side menu -->
        <div class="col-md-2">
            <ul class="list-group list-group-flush">
                <li class="list-group-item">
                    <strong>Artículos</strong>
                </li>
                <li class="list-group-item">
                    <RouterLink :to="{name: 'items'}">Artículos</RouterLink>
                </li>
            </ul>
        </div>

        <!-- main content -->
        <div class="col-md-4">
            <!-- form -->
            <form method="post" @submit.prevent>
                <!-- code control -->
                <div class="mb-2">
                    <label for="code" class="form-label">Código</label>
                    <input
                      type="text"
                      id="code"
                      class="form-control"
                      v-model.trim="item.code">
                </div>
                <!-- name control -->
                <div class="mb-2">
                    <label for="name" class="form-label">Nombre</label>
                    <input
                      type="text"
                      id="name"
                      class="form-control"
                      v-model.trim="item.name">
                </div>
                <!-- item_type control -->
                <div class="mb-2">
                    <label for="item_type" class="form-label">Tipo</label>
                    <select
                      id="item_type"
                      class="form-select"
                      v-model.trim="item.item_type">
                        <option value="product">Producto</option>
                        <option value="concept">Concepto</option>
                        <option value="repair">Reparación</option>
                        <option value="maintenace">Mtto</option>
                        <option value="install">Instal/Mont</option>
                        <option value="unmounting">Desmontaje</option>
                    </select>
                </div>
                <!-- measurement control -->
                <div class="mb-2">
                    <label for="measurement" class="form-label">U/M</label>
                    <select
                      id="measurement"
                      class="form-select"
                      v-model.trim="item.measurement">
                        <option value="u">Uno</option>
                        <option value="m">Metros</option>
                        <option value="kg">Kilogramos</option>
                        <option value="lts">Litros</option>
                    </select>
                </div>
                <!-- price control -->
                <div class="mb-2">
                    <label for="price" class="form-label">Precio</label>
                    <input
                      type="number"
                      id="price"
                      class="form-control"
                      v-model.trim="item.price">
                </div>
                <!-- buttons -->
                <div>
                    <button
                      class="btn btn-sm btn-primary"
                      @click="item.id ? updateItem(item) : createItem(item)">{{ item.id ? 'Actualizar' : 'Guardar' }}</button>
                    <a href="#" class="btn btn-sm btn-secondary">Cancelar</a>
                </div>
            </form>
        </div>

    </div> <!-- end row -->
</template>

<script setup>

import { RouterLink, useRouter, useRoute } from "vue-router";
import { ref, onMounted } from "vue";
import { postItem, putItem, detailItem } from "../../services/item.service";

const item = ref({
    code: '',
    name: '',
    item_type: '',
    measurement: '',
    price: '',
});
const router = useRouter();
const route = useRoute();

onMounted(async () => {
    const id = route.params.id;
    if (id) {
        const { data } = await detailItem(id);
        item.value = data;
    }
});



const createItem = async (item) => {
    const { data } = await postItem(item);
    router.push({name: 'items_detail', params: {id: data.id}});
};

const updateItem = async (item) => {
    const { data } = await putItem(item);
    router.push({name: 'items_detail', params: {id: data.id}});
};

</script>

<style lang="scss" scoped>

</style>