<script setup>

// vue
import { onMounted, ref } from 'vue';
import { RouterLink, useRouter, useRoute } from 'vue-router'

// third
import { useVuelidate } from "@vuelidate/core";
import { required, helpers } from "@vuelidate/validators";

// app
import listGroup from '../../assets/js/bootstrap_classes/listGroup';
import { detailProvider, postProvider, putProvider } from '../../services/provider.service';

// router utilities and handlers
const router = useRouter();
const route = useRoute();

// main object
const provider = ref({
    id: '',
    username: '',
    first_name: '',
    last_name: '',
    tcp_code: '',
    bank_account_header: '',
    bank_account: '',
    address: '',
    activity: '',
    license_number: '',
    password: '',
    personal_id: '',
});

// validation rules
const rules = {
  username: {
    required: helpers.withMessage('El Usuario es requerido.', required)
  },
  first_name: {
    required: helpers.withMessage('El Nombre es requerido.', required)
  },
  last_name: {
    required: helpers.withMessage('Los Apellidos son requeridos.', required)
  },
  tcp_code: {
    required: helpers.withMessage('El Código TCP es requerido.', required)
  },
  bank_account_header: {
    required: helpers.withMessage('El Titular de Cuenta es requerido.', required)
  },
  bank_account: {
    required: helpers.withMessage('La Cuenta Bancaria es requerida.', required)
  },
  address: {
    required: helpers.withMessage('La Dirección es requerida.', required)
  },
  activity: {
    required: helpers.withMessage('La Actividad es requerida.', required)
  },
  license_number: {
    required: helpers.withMessage('La Licencia es requerida.', required)
  },
  password: {
    required: helpers.withMessage('La Clave es requerida.', required)
  },
  personal_id: {
    required: helpers.withMessage('El CI es requerido.', required)
  },
};


// vuelidate object
const v$ = useVuelidate(rules, provider);

// provider object to be filled with backend errors
const providerBackendErrors = ref({
  first_name: [],
  username: [],
  first_name: [],
  last_name: [],
  tcp_code: [],
  bank_account_header: [],
  bank_account: [],
  address: [],
  activity: [],
  license_number: [],
  password: [],
  personal_id: [],
});

const createProvider = async (provider) => {

  try {
    if (await v$.value.$validate()) {
      const { data } = await postProvider(provider)
      router.push({ name: 'providers_detail', params: { id: data.id } })
    }
  } catch (error) {
    console.error('General error', error)
    if (error.response) {
      providerBackendErrors.value = error.response.data
      console.log('providerBackendErrors', providerBackendErrors.value);
    } else {
      providerBackendErrors.value = { message: 'Error inesperado, consulte al desarrollador' }
    }
    console.log(providerBackendErrors.value)
  }
}

const updateProvider = async (provider) => {
    
  try {
    if (await v$.value.$validate()) {
      const { data } = await putProvider(provider)
      router.push({ name: 'providers_detail', params: { id: data.id } })
    }
  } catch (error) {
    console.error('General error', error)
    if (error.response) {
      providerBackendErrors.value = error.response.data
    } else {
      providerBackendErrors.value = { message: 'Error inesperado, consulte al desarrollador' }
    }
    console.log(providerBackendErrors.value)
  }
}

const onSubmit = () => provider.value.id ? updateProvider(provider.value) : createProvider(provider.value)

const goBack = () => provider.value.id ? 
                        router.push({name: 'providers_detail', params: {id: provider.value.id}}) :
                        router.push({name: 'providers'})

onMounted(async () => {
    try {
        const id = route.params.id
        if (id) {
            const resp = await detailProvider(id)
            provider.value = resp.data
        }
    } catch (error) {
        console.log("General error: ", error)
        if (error.response) {
            providerBackendErrors.value = error.response
        } else {
            providerBackendErrors.value = { message: "Error inesperado, consulte al desarrollador." }
        }
    }
})


</script>

<template>

    <div class="row mb-2">
        <!-- side menu -->
        <div class="col-md-2">
            <ul :class="listGroup.listGroup">
                <li :class="listGroup.listGroupItem">
                    <strong>Prestadores</strong>
                </li>
                <li :class="listGroup.listGroupItem">
                    <router-link :to="{name: 'providers'}">Prestadores</router-link>
                </li>
            </ul>
        </div>

        <!-- main content -->
        <div class="col-md-9">


            <!-- form -->
            <form class="row" @submit.prevent="onSubmit">

                <!-- backend errors -->
                <span v-if="providerBackendErrors.non_field_errors">
                <p
                    class="form-text text-danger"
                    v-for="(error, i) in providerBackendErrors.non_field_errors"
                    :key="i"
                >
                    {{ error }}
                </p>
                </span>
                <span v-if="providerBackendErrors.message">
                <p
                    class="form-text text-danger">
                    {{ providerBackendErrors.message }}
                </p>
                </span>

                <!-- username control -->
                <div class="col-md-3 mb-2">

                    <div class="mb-2">
                        <label
                            for="username"
                            class="form-label">Usuario</label>
                        <input
                            type="text"
                            id="username"
                            class="form-control"
                            v-model.trim="provider.username"
                            @blur="v$.username.$touch">
    
                        <!-- frontend validations -->
                        <p
                            class="form-text text-danger"
                            v-for="error in v$.username.$errors"
                            :key="error.$uid">
                            {{ error.$message }}
                        </p>
    
                        <!-- backend validations -->
                        <span v-if="providerBackendErrors.username">
                            <p
                            class="form-text text-danger"
                            v-for="(error, i) in providerBackendErrors.username"
                            :key="i">
                                {{ error }}
                            </p>
                        </span>
                    </div>

                </div>

                <!-- first_name control -->
                <div class="col-md-3 mb-2">

                    <div class="mb-2">
                        <label
                        for="first_name"
                        class="form-label">Nombre</label>
                        <input
                        type="text"
                        id="first_name"
                        class="form-control"
                        v-model.trim="provider.first_name"
                        @blur="v$.first_name.$touch">
    
                        <!-- frontend validations -->
                        <p
                            class="form-text text-danger"
                            v-for="error in v$.first_name.$errors"
                            :key="error.$uid">
                            {{ error.$message }}
                        </p>
    
                        <!-- backend validations -->
                        <span v-if="providerBackendErrors.first_name">
                            <p
                            class="form-text text-danger"
                            v-for="(error, i) in providerBackendErrors.first_name"
                            :key="i">
                                {{ error }}
                            </p>
                        </span>
                    </div>
                    
                </div>
                

                <!-- last_name control -->
                <div class="col-md-3 mb-2">

                    <div class="mb-2">
                        <label
                        for="last_name"
                        class="form-label">Apellidos</label>
                        <input
                        type="text"
                        id="last_name"
                        class="form-control"
                        v-model.trim="provider.last_name"
                        @blur="v$.last_name.$touch">
    
                        <!-- frontend validations -->
                        <p
                            class="form-text text-danger"
                            v-for="error in v$.last_name.$errors"
                            :key="error.$uid">
                            {{ error.$message }}
                        </p>
    
                        <!-- backend validations -->
                        <span v-if="providerBackendErrors.last_name">
                            <p
                            class="form-text text-danger"
                            v-for="(error, i) in providerBackendErrors.last_name"
                            :key="i">
                                {{ error }}
                            </p>
                        </span>
    
                    </div>
                    
                </div>
                
                
                <!-- tcp_code control -->
                <div class="col-md-3 mb-2">

                    <div class="mb-2">
                        <label
                        for="tcp_code"
                        class="form-label">Código TCP</label>
                        <input
                        type="text"
                        id="tcp_code"
                        class="form-control"
                        v-model.trim="provider.tcp_code"
                        @blur="v$.tcp_code.$touch">
    
                        <!-- frontend validations -->
                        <p
                            class="form-text text-danger"
                            v-for="error in v$.tcp_code.$errors"
                            :key="error.$uid">
                            {{ error.$message }}
                        </p>
    
                        <!-- backend validations -->
                        <span v-if="providerBackendErrors.tcp_code">
                            <p
                            class="form-text text-danger"
                            v-for="(error, i) in providerBackendErrors.tcp_code"
                            :key="i">
                                {{ error }}
                            </p>
                        </span>
    
                    </div>
                    
                </div>
                

                <!-- bank_account_header control -->
                <div class="col-md-3 mb-2">
                    
                    <div class="mb-2">
                        <label
                        for="bank_account_header"
                        class="form-label">Titular de la Cuenta</label>
                        <input
                        type="text"
                        id="bank_account_header"
                        class="form-control"
                        v-model.trim="provider.bank_account_header"
                        @blur="v$.bank_account_header.$touch">
    
                        <!-- frontend validations -->
                        <p
                            class="form-text text-danger"
                            v-for="error in v$.bank_account_header.$errors"
                            :key="error.$uid">
                            {{ error.$message }}
                        </p>
    
                        <!-- backend validations -->
                        <span v-if="providerBackendErrors.bank_account_header">
                            <p
                            class="form-text text-danger"
                            v-for="(error, i) in providerBackendErrors.bank_account_header"
                            :key="i">
                                {{ error }}
                            </p>
                        </span>
    
                    </div>
                    
                </div>
                

                <!-- bank_account control -->
                <div class="col-md-3 mb-2">

                    <div class="mb-2">
                        <label
                        for="bank_account"
                        class="form-label">Nro de Cuenta</label>
                        <input
                        type="text"
                        id="bank_account"
                        class="form-control"
                        v-model.trim="provider.bank_account"
                        @blur="v$.bank_account.$touch">
    
                        <!-- frontend validations -->
                        <p
                            class="form-text text-danger"
                            v-for="error in v$.bank_account.$errors"
                            :key="error.$uid">
                            {{ error.$message }}
                        </p>
    
                        <!-- backend validations -->
                        <span v-if="providerBackendErrors.bank_account">
                            <p
                            class="form-text text-danger"
                            v-for="(error, i) in providerBackendErrors.bank_account"
                            :key="i">
                                {{ error }}
                            </p>
                        </span>
    
                    </div>
                    
                </div>
                

                <!-- address control -->
                <div class="col-md-3 mb-2">

                    <div class="mb-2">
                        <label
                        for="address"
                        class="form-label">Dirección</label>
                        <input
                        type="text"
                        id="address"
                        class="form-control"
                        v-model.trim="provider.address"
                        @blur="v$.address.$touch">
    
                        <!-- frontend validations -->
                        <p
                            class="form-text text-danger"
                            v-for="error in v$.address.$errors"
                            :key="error.$uid">
                            {{ error.$message }}
                        </p>
    
                        <!-- backend validations -->
                        <span v-if="providerBackendErrors.address">
                            <p
                            class="form-text text-danger"
                            v-for="(error, i) in providerBackendErrors.address"
                            :key="i">
                                {{ error }}
                            </p>
                        </span>
    
                    </div>
                    
                </div>
                

                <!-- activity control -->
                <div class="col-md-3 mb-2">

                    <div class="mb-2">
                        <label
                        for="activity"
                        class="form-label">Actividad</label>
                        <input
                        type="text"
                        id="activity"
                        class="form-control"
                        v-model.trim="provider.activity"
                        @blur="v$.activity.$touch">
    
                        <!-- frontend validations -->
                        <p
                            class="form-text text-danger"
                            v-for="error in v$.activity.$errors"
                            :key="error.$uid">
                            {{ error.$message }}
                        </p>
    
                        <!-- backend validations -->
                        <span v-if="providerBackendErrors.activity">
                            <p
                            class="form-text text-danger"
                            v-for="(error, i) in providerBackendErrors.activity"
                            :key="i">
                                {{ error }}
                            </p>
                        </span>
    
                    </div>
                    
                </div>
                

                <!-- license_number control -->
                <div class="col-md-3 mb-2">

                    <div class="mb-2">
                        <label
                        for="license_number"
                        class="form-label">Nro. de Licencia</label>
                        <input
                        type="text"
                        id="license_number"
                        class="form-control"
                        v-model.trim="provider.license_number"
                        @blur="v$.license_number.$touch">
    
                        <!-- frontend validations -->
                        <p
                            class="form-text text-danger"
                            v-for="error in v$.license_number.$errors"
                            :key="error.$uid">
                            {{ error.$message }}
                        </p>
    
                        <!-- backend validations -->
                        <span v-if="providerBackendErrors.license_number">
                            <p
                            class="form-text text-danger"
                            v-for="(error, i) in providerBackendErrors.license_number"
                            :key="i">
                                {{ error }}
                            </p>
                        </span>
    
                    </div>
                    
                </div>

                <!-- password control -->
                <div v-if="!provider.id" class="col-md-3 mb-2">

                    <div class="mb-2">
                        <label
                        for="password"
                        class="form-label">Clave</label>
                        <input
                        type="password"
                        id="password"
                        class="form-control"
                        v-model.trim="provider.password"
                        @blur="v$.password.$touch">
    
                        <!-- frontend validations -->
                        <p
                            class="form-text text-danger"
                            v-for="error in v$.password.$errors"
                            :key="error.$uid">
                            {{ error.$message }}
                        </p>
    
                        <!-- backend validations -->
                        <span v-if="providerBackendErrors.password">
                            <p
                            class="form-text text-danger"
                            v-for="(error, i) in providerBackendErrors.password"
                            :key="i">
                                {{ error }}
                            </p>
                        </span>
    
                    </div>
                    
                </div>
                

                <!-- personal_id control -->
                <div class="col-md-3 mb-2">

                    <div class="mb-2">
                        <label
                        for="personal_id"
                        class="form-label">CI</label>
                        <input
                        type="text"
                        id="personal_id"
                        class="form-control"
                        v-model.trim="provider.personal_id"
                        @blur="v$.personal_id.$touch">
    
                        <!-- frontend validations -->
                        <p
                            class="form-text text-danger"
                            v-for="error in v$.personal_id.$errors"
                            :key="error.$uid">
                            {{ error.$message }}
                        </p>
    
                        <!-- backend validations -->
                        <span v-if="providerBackendErrors.personal_id">
                            <p
                            class="form-text text-danger"
                            v-for="(error, i) in providerBackendErrors.personal_id"
                            :key="i">
                                {{ error }}
                            </p>
                        </span>
                    </div>
                    
                </div>

                <!-- buttons -->
                <div>
                    <input type="submit" class="btn btn-sm btn-primary" value="Guardar">
                    <button
                      class="btn btn-sm btn-secondary"
                      @click="goBack()">Cancelar</button>
                </div>
            </form>

        </div>

    </div> <!-- end row -->

</template>

