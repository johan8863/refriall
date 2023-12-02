<template>
    <div class="row">
        <!-- side menu -->
        <div class="col-md-2">
            <ul class="list-group list-group-flush">
                <li class="list-group-item">
                    <strong>Prestadores</strong>
                </li>
                <li class="list-group-item">
                    <router-link :to="{name: 'providers'}">Prestadores</router-link>
                </li>
            </ul>
        </div>

        <!-- main content -->
        <div class="col-md-4">
            <h3>{{ provider.first_name }}</h3>
        </div>

    </div> <!-- end row -->

</template>

<script setup>

import { RouterLink, useRoute } from "vue-router";
import { ref, onMounted } from 'vue';
import { detailProvider } from "../../services/provider.service";

const route = useRoute();
const provider = ref({
    id: '',
    username: '',
    first_name: '',
    last_name: '',
    license_number: '',
    personal_id: '',
});

onMounted(async () => {
    const resp = await detailProvider(route.params.id);
    provider.value = resp.data;
});

</script>

<style lang="scss" scoped>

</style>