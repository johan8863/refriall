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
                <span v-if="itemErrors.non_field_errors">
                    <p
                        class="form-text text-danger"
                        v-for="(error, i) in itemErrors.non_field_errors"
                        :key="i">{{ error.$message }}</p>
                </span>
                <!-- code control -->
                <div class="mb-2">
                    <label for="code" class="form-label">Código</label>
                    <input
                      type="text"
                      id="code"
                      class="form-control"
                      v-model.trim="item.code"
                      @blur="v$.code.$touch">
                      <span v-if="v$.code.$error">
                        <p
                          class="form-text text-danger"
                          v-for="error in v$.code.$errors"
                          :key="error.$uid">{{ error.$message }}</p>
                      </span>
                      <span v-if="itemErrors.code">
                        <p
                          class="form-text text-danger"
                          v-for="(error, i) in itemErrors.code"
                          :key="i">{{ error }}</p>
                      </span>
                </div>
                <!-- name control -->
                <div class="mb-2">
                    <label for="name" class="form-label">Nombre</label>
                    <input
                      type="text"
                      id="name"
                      class="form-control"
                      v-model.trim="item.name"
                      @blur="v$.name.$touch">
                      <span v-if="v$.name.$error">
                        <p
                          class="form-text text-danger"
                          v-for="error in v$.name.$errors"
                          :key="error.$uid">{{ error.$message }}</p>
                    </span>
                    <span v-if="itemErrors.name">
                        <p
                          class="form-text text-danger"
                          v-for="(error, i) in itemErrors.name"
                          :key="i">{{ error }}</p>
                      </span>
                </div>
                <!-- item_type control -->
                <div class="mb-2">
                    <label for="item_type" class="form-label">Tipo</label>
                    <select
                      id="item_type"
                      class="form-select"
                      v-model.trim="item.item_type"
                      @blur="v$.item_type.$touch">
                        <option value="product">Producto</option>
                        <option value="concept">Concepto</option>
                        <option value="repair">Reparación</option>
                        <option value="maintenace">Mtto</option>
                        <option value="install">Instal/Mont</option>
                        <option value="unmounting">Desmontaje</option>
                    </select>
                    <span v-if="v$.item_type.$error">
                        <p
                          class="form-text text-danger"
                          v-for="error in v$.item_type.$errors"
                          :key="error.$uid">{{ error.$message }}</p>
                    </span>
                    <span v-if="itemErrors.item_type">
                        <p
                          class="form-text text-danger"
                          v-for="(error, i) in itemErrors.item_type"
                          :key="i">{{ error }}</p>
                      </span>
                </div>
                <!-- measurement control -->
                <div class="mb-2">
                    <label for="measurement" class="form-label">U/M</label>
                    <select
                      id="measurement"
                      class="form-select"
                      v-model.trim="item.measurement"
                      @blur="v$.measurement.$touch">
                        <option value="u">Uno</option>
                        <!-- only products can have any kind of measurement -->
                        <template v-if="item.item_type === 'product'">
                            <option value="m">Metros</option>
                            <option value="kg">Kilogramos</option>
                            <option value="lts">Litros</option>
                        </template>
                    </select>
                    <span v-if="v$.measurement.$error">
                        <p
                          class="form-text text-danger"
                          v-for="error in v$.measurement.$errors"
                          :key="error.$uid">{{ error.$message }}</p>
                    </span>
                    <span v-if="itemErrors.measurement">
                        <p
                          class="form-text text-danger"
                          v-for="(error, i) in itemErrors.measurement"
                          :key="i">{{ error }}</p>
                      </span>
                </div>
                <!-- price control -->
                <div class="mb-2">
                    <label for="price" class="form-label">Precio</label>
                    <input
                      type="number"
                      id="price"
                      class="form-control"
                      min="1"
                      v-model.trim="item.price"
                      @blur="v$.price.$touch">
                      <span v-if="v$.price.$error">
                        <p
                          class="form-text text-danger"
                          v-for="error in v$.price.$errors"
                          :key="error.$uid">{{ error.$message }}</p>
                    </span>
                    <span v-if="itemErrors.price">
                        <p
                          class="form-text text-danger"
                          v-for="(error, i) in itemErrors.price"
                          :key="i">{{ error }}</p>
                      </span>
                </div>
                <!-- buttons -->
                <div>
                    <button
                      class="btn btn-sm btn-primary"
                      @click="item.id ? updateItem(item) : createItem(item)">{{ item.id ? 'Actualizar' : 'Guardar' }}</button>
                      <router-link :to="{name: 'items'}" class="btn btn-sm btn-secondary">Cancelar</router-link>
                </div>
            </form>
        </div>

    </div> <!-- end row -->
</template>

<script setup>
// vue
import { RouterLink, useRouter, useRoute } from "vue-router";
import { ref, onMounted } from "vue";

// third
import { useVuelidate } from "@vuelidate/core";
import { required, minValue, helpers } from "@vuelidate/validators";

// local
import { postItem, putItem, detailItem } from "../../services/item.service";

// item object to be created or updated
const item = ref({
    code: '',
    name: '',
    item_type: '',
    measurement: '',
    price: '',
});

// item errors messages object to catch
// errors from the django rest api
const itemErrors = ref({
    code: [],
    name: [],
    item_type: [],
    measurement: [],
    price: [],
});

// router tools to redirect and get routes params
const router = useRouter();
const route = useRoute();

// vuelidate rules
const rules = {
    code: {
        required: helpers.withMessage('El código es requerido.', required)
    },
    name: {
        required: helpers.withMessage('El nombre es requerido.', required)
    },
    item_type: {
        required: helpers.withMessage('El tipo es requerido.', required)
    },
    measurement: {
        required: helpers.withMessage('La unidad de medida es requierida.', required)
    },
    price: {
        required: helpers.withMessage('El precio es requerido.', required),
        minValue: helpers.withMessage('El valor mínimo es 0.01', minValue(0.01))
    },
};

// vuelidate object
const v$ = useVuelidate(rules, item);

// onMounted cycle to get an item object if editing intended
onMounted(async () => {
    const id = route.params.id;
    if (id) {
        const { data } = await detailItem(id);
        item.value = data;
    }
});

// create item function
const createItem = async (item) => {
    try {
        if (await v$.value.$validate()) {
            const { data } = await postItem(item);
            router.push({name: 'items_detail', params: {id: data.id}});
        }
    } catch (error) {
        itemErrors.value = error.response.data;
    }
};

// update item function
const updateItem = async (item) => {
    try {
        if (await v$.value.$validate()) {
            const { data } = await putItem(item);
            router.push({name: 'items_detail', params: {id: data.id}});
        }
    } catch (error) {
        itemErrors.value = error.response.data;
        console.log(error.response.data);
    }
        
};

</script>

<style lang="scss" scoped>

</style>