<script setup>

// vue
import { onMounted, ref } from "vue";
import { RouterLink } from "vue-router";

// app
import { listKit } from "../../services/kit.service";
import listGroup from "../../assets/js/bootstrap_classes/listGroup";

const kits = ref([]);
const kitsErrors = ref(null);
const currentPage = ref(1);
const showNextButton = ref(false);
const showPrevButton = ref(false);


const getKits = async () => {
    try {
        const resp = (await listKit(currentPage.value)).data;
        
        showNextButton.value = false;
        if (resp.next) {
            showNextButton.value = true;
        }
        
        showPrevButton.value = false;
        if (resp.previous) {
            showPrevButton.value = true;
        }
    
        kits.value = resp.results;
    } catch (error) {
        console.error('General error', error)
        if (error.response) {
            kitsErrors.value = `${error.response.data} - ${error.response.status}`
        } else {
            kitsErrors.value = 'Error inesperado, consulte al desarrollador'
        }
    }
};

const loadNextItems = () => {
    currentPage.value += 1;
    getKits()
}

const loadPrevItems = () => {
    currentPage.value -= 1;
    getKits()
}

onMounted(async () => {
    getKits();
});

</script>

<template>

    <div class="row">
        <!-- side menu -->
        <div class="col-md-2">
            <ul :class="listGroup.listGroup">
                <li :class="listGroup.listGroupItem">
                    <strong>Equipos</strong>
                </li>
                <li :class="listGroup.listGroupItem">
                    <router-link :to="{name: 'kits_create'}">Nuevo</router-link >
                </li>
            </ul>
        </div>
        
        <!-- main content -->
        <div class="col-md-10">
            <div class="row">
                <div class="col-md-4">
                    <!-- backend general errors -->
                    <span v-if="kitsErrors">
                        <p
                            class="form-text text-danger">
                            {{ kitsErrors }}</p>
                    </span>
                    <div v-if="kits.length > 0">
                        <div id="tableContainer" style="height: 460px;">

                            <table class="table">
                                <thead>
                                    <tr>
                                        <th scope="col">Nombre</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr v-for="kit in kits" :key="kit.id">
                                        <td>
                                            <RouterLink :to="{name: 'kits_detail', params: {id: kit.id}}">{{kit.name}}</RouterLink>
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
                        <p class="lead text-center">Inserte un equipo.</p>
                    </div>
                    

                </div>
            </div>
        </div>

    </div>

</template>
