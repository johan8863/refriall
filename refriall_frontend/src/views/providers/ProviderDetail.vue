<template>
    <div class="row">
        <!-- side menu -->
        <div class="col-md-2">
            <ul :class="listGroup.listGroup">
                <li :class="listGroup.listGroupItem">
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

// vue
import { RouterLink, useRoute } from "vue-router";
import { ref, onMounted } from 'vue';

// app
import { detailProvider } from "../../services/provider.service";
import listGroup from "../../assets/js/bootstrap_classes/listGroup";

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