<script setup>
// vue
import { RouterLink, useRouter, useRoute } from "vue-router";
import { ref, onMounted } from "vue";

// app
import { postItem, putItem, getItem } from "../../services/item.service";
import listGroup from "../../assets/js/bootstrap_classes/listGroup";

// third
import { useVuelidate } from "@vuelidate/core";
import { required, minValue, helpers } from "@vuelidate/validators";


// item object to be created or updated
const item = ref({
    code: '',
    name: '',
    item_type: '',
    measurement: '',
    price: 0,
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

// router utilities and handlers
const router = useRouter();
const route = useRoute();

const goToItems = () => router.push({name: 'items'})
const goToItemDetail = () => router.push({name: 'items_detail', params: {id: item.value.id}})
const goBack = () => !item.value.id ? goToItems() : goToItemDetail()


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


// create item function
const createItem = async (item) => {
    try {
        if (await v$.value.$validate()) {
            const { data } = await postItem(item);
            router.push({name: 'items_detail', params: {id: data.id}});
        }
    } catch (error) {
        console.error('General erro', error)
        if (error.response) {
            itemErrors.value = error.response.data
        } else {
            itemErrors.value = { message: 'Error inesperado, consulte al desarrollador' }
        }
        console.log(itemErrors.value)
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
        console.error('General erro', error)
        if (error.response) {
            itemErrors.value = error.response.data
        } else {
            itemErrors.value = { message: 'Error inesperado, consulte al desarrollador' }
        }
        console.log(itemErrors.value)
    }
        
};


// onMounted cycle to get an item object if editing intended
onMounted(async () => {
    const id = route.params.id;
    if (id) {
        const { data } = await getItem(id);
        item.value = data;
    }
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
                    <RouterLink :to="{name: 'items'}">Artículos</RouterLink>
                </li>
            </ul>
        </div>

        <!-- main content -->
        <div class="col-md-4">
            <!-- backend errors from non_field_errors dictionary -->
            <span v-if="itemErrors.non_field_errors">
                <p
                    class="form-text text-danger"
                    v-for="(error, index) in itemErrors.non_field_errors"
                    :key="index">
                    {{ error }}</p>
            </span>
            <!-- backend general errors -->
            <span v-if="itemErrors.message">
                <p
                    class="form-text text-danger">
                    {{ itemErrors.message }}</p>
            </span>
            <!-- form -->
            <form @submit.prevent="!item.id ? createItem(item) : updateItem(item)">
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
                        <option value="revision">Rev/Diag.</option>
                        <option value="prod">Producto</option>
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
                        <template v-if="item.item_type === 'prod'">
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
                      step="0.01"
                      class="form-control"
                      min="0.01"
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
                    <!-- 
                        the order in the ternary operator is due to the fact that 
                        this form is more often used to create than to update 
                    -->
                    <button
                      type="submit"
                      class="btn btn-sm btn-primary">
                        {{ !item.id ? 'Guardar' : 'Actualizar' }}</button>
                    
                    <button
                      type="button"
                      class="btn btn-sm btn-secondary"
                      @click="goBack">Cancelar</button>
                </div>
            </form>
        </div>

    </div> <!-- end row -->
</template>
