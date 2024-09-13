<script setup>

// vue
import { onMounted, ref } from "vue";
import { RouterLink } from "vue-router";

// app
import { listItem } from "../../services/item.service";
import listGroup from "../../assets/js/bootstrap_classes/listGroup";

const items = ref([]);
const currentPage = ref(1);
const showNextButton = ref(false);
const showPrevButton = ref(false);

const getItems = async () => {
    const resp = (await listItem(currentPage.value)).data;
    
    showNextButton.value = false;
    if (resp.next) {
        showNextButton.value = true;
    }
    
    showPrevButton.value = false;
    if (resp.previous) {
        showPrevButton.value = true;
    }

    items.value = resp.results;
};

const loadNextItems = () => {
    currentPage.value += 1;
    getItems()
}

const loadPrevItems = () => {
    currentPage.value -= 1;
    getItems()
}


onMounted(async () => {
    getItems()
});

</script>

<template>
    <div class="row">
        <!-- side menu -->
        <div class="col-md-2">
            <ul :class="listGroup.listGroup">
                <li :class="listGroup.listGroupItem">
                    <strong>Artículos</strong>
                </li>
                <li :class="listGroup.listGroupItem">
                    <RouterLink :to="{name: 'items_create'}">Nuevo</RouterLink >
                </li>
            </ul>
        </div>
        
        <!-- main content -->
        <div class="col-md-10">
            <div class="row">
                <div class="col-md-8">

                    <div v-if="items.length > 0">

                        <div>

                            <table class="table">
                                <thead>
                                    <tr>
                                        <th scope="col">Código</th>
                                        <th scope="col">Nombre</th>
                                        <th scope="col">Tipo</th>
                                        <th scope="col">U/M</th>
                                        <th scope="col">Precio</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr v-for="item in items" :key="item.id">
                                        <td>
                                            <RouterLink :to="{name: 'items_detail', params: {id: item.id}}">{{ item.code }}</RouterLink>
                                        </td>
                                        <td>
                                            {{ item.name }}
                                        </td>
                                        <td>
                                            {{ item.get_item_type }}
                                        </td>
                                        <td>
                                            {{ item.get_measurement }}
                                        </td>
                                        <td>
                                            {{ item.price.toFixed(2) }}
                                        </td>
                                    </tr>
                                </tbody>
                            </table>

                        </div>
                        
                        <!-- buttons -->
                        <div>
                            <button
                              v-if="showPrevButton"
                              class="btn btn-sm btn-primary"
                              @click="loadPrevItems()">Anterior</button>
                              
                            <button
                              v-if="showNextButton"
                              class="btn btn-sm btn-primary"
                              @click="loadNextItems()">Siguiente</button>
                        </div>

                    </div>

                    <div v-else>
                        <p class="lead text-center">Inserte un Articulo.</p>
                    </div>

                </div>
            </div>
        </div>

    </div> <!-- end row -->
</template>
