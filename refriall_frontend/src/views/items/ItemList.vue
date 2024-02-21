<template>
    <div class="row">
        <!-- side menu -->
        <div class="col-md-2">
            <ul class="list-group list-group-flush">
                <li class="list-group-item">
                    <strong>Artículos</strong>
                </li>
                <li class="list-group-item">
                    <RouterLink :to="{name: 'items_create'}">Nuevo</RouterLink >
                </li>
            </ul>
        </div>
        
        <!-- main content -->
        <div class="col-md-10">
            <div class="row">
                <div class="col-md-6">

                    <div v-if="items.length > 0">

                        <div id="tableContainer" style="height: 460px;">

                            <table class="table">
                                <thead>
                                    <tr>
                                        <th scope="col">Nombre</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr v-for="item in items" :key="item.id">
                                        <td>
                                            <RouterLink :to="{name: 'items_detail', params: {id: item.id}}">{{ item.name }}</RouterLink>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>

                        </div>


                        
                        <!-- buttons -->
                        <div>
                            <button
                              v-if="showNextButton"
                              class="btn btn-sm btn-primary"
                              @click="loadNextItems()">Siguiente</button>
                            
                            <button
                              v-if="showPrevButton"
                              class="btn btn-sm btn-primary"
                              @click="loadPrevItems()">Anterior</button>
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

<script setup>
import { onMounted, ref } from "vue";
import { RouterLink } from "vue-router";
import { listItem } from "../../services/item.service";

const items = ref([]);
const currentPage = ref(1);
const showNextButton = ref(false);
const showPrevButton = ref(false);

const getItems = async () => {
    const resp = (await listItem(currentPage.value)).data;
    console.log(resp);
    
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

<style lang="scss" scoped>

</style>