<template>

    <div class="row">
        <!-- side menu -->
        <div class="col-md-2">
            <ul :class="listGroup.listGroup">
                <li :class="listGroup.listGroupItem">
                    <strong>Prestadores</strong>
                </li>
                <li :class="listGroup.listGroupItem">
                    <router-link :to="{name: 'providers_create'}">Nuevo</router-link >
                </li>
            </ul>
        </div>
        
        <!-- main content -->
        <div class="col-md-10">
            <div class="row">
                <div class="col-md-4">

                    <div v-if="providers.length > 0">

                        <div id="tableContainer" style="height: 460px;">

                            <table class="table">
                                <thead>
                                    <tr>
                                        <th scope="col">Nombre</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr v-for="provider in providers" :key="provider.id">
                                        <td>
                                            <router-link :to="{name: 'providers_detail', params: {id: provider.id}}">{{ provider.first_name }}</router-link>
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
                        <p class="lead text-center">Inserte un Proveedor.</p>
                    </div>
                    

                </div>
            </div>
        </div>

    </div>

</template>

<script setup>

// vue
import { ref, onMounted } from "vue";
import { RouterLink } from "vue-router";

// app
import { listProvider } from "../../services/provider.service";
import listGroup from "../../assets/js/bootstrap_classes/listGroup";

const providers = ref([]);

const currentPage = ref(1);
const showNextButton = ref(false);
const showPrevButton = ref(false);

const getProviders = async () => {
    const resp = (await listProvider(currentPage.value)).data;
    
    showNextButton.value = false;
    if (resp.next) {
        showNextButton.value = true;
    }
    
    showPrevButton.value = false;
    if (resp.previous) {
        showPrevButton.value = true;
    }

    providers.value = resp.results;
};

const loadNextItems = () => {
    currentPage.value += 1;
    getProviders()
}

const loadPrevItems = () => {
    currentPage.value -= 1;
    getProviders()
}


onMounted(async () => {
    getProviders()
});


</script>