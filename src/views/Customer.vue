<template>
    <q-page padding>
      <q-table
        flat
        bordered
        title="Clientes"
        :rows="clientes"
        :columns="columns"
        row-key="id"
      >
        <template v-slot:top>
          <q-toolbar>
            <q-toolbar-title>Lista de Clientes</q-toolbar-title>
            <q-space />
            <q-btn icon="download" label="Descargar" color="primary" />
            <q-btn color="green" label="Crear / Importar" icon="add" @click="openDialog" />
          <q-dialog
      v-model="dialog"
      persistent
      :maximized="maximizedToggle"
      transition-show="slide-up"
      transition-hide="slide-down"
    >
      <q-card>
        <q-bar>
          <q-space />

         
          <q-btn dense flat icon="close" v-close-popup>
            <q-tooltip class="bg-white text-primary">Close</q-tooltip>
          </q-btn>
        </q-bar>

        <q-card class="q-pa-md shadow-2">
      <q-card-section>
        <div class="text-h6 text-primary">Registrar Cliente</div>
      </q-card-section>

     <q-form >
      <q-select 
      v-model="form.legal_organization_id"
      :options="organizationTypes"
      label="Tipo de organización"
      option-value="id"
      option-label="name"
      emit-value
      map-options
      outlined
      dense
      @update:model-value="handleOrganizationChange"
      required
      />
        <!-- Campos solo para Persona Jurídica -->
    <q-input 
      v-if="form.legal_organization_id === 1" 
      v-model="form.company" 
      label="Razón Social" 
      required
      outlined
    />
    <q-input 
      v-if="form.legal_organization_id === 1" 
      v-model="form.trade_name" 
      label="Nombre Comercial" 
      outlined
    />

       <!-- Campo solo para Persona Natural -->
       <q-input 
      v-if="form.legal_organization_id === 2" 
      v-model="form.names" 
      label="Nombre Completo" 
      outlined
    />
      <!-- Campos generales (aplican para ambos) -->
      <q-select
  v-model="form.identification_document_id"
  :options="documentTypeOptions"
  label="Tipo de documento"
  outlined
  dense
  emit-value
  map-options
/>
      <q-input v-model="form.identification" label="Identificación" outlined />
      
      <q-select
  v-model="form.tribute_id"
  :options="tributeOptions"
  label="Tributo"
  outlined
  dense
  emit-value
  map-options
/>
    <q-input v-model="form.address" label="Dirección" outlined />
    <q-input v-model="form.email" label="Correo Electrónico" outlined type="email" />
    <q-input v-model="form.phone" label="Teléfono" outlined type="tel" />
        <!-- Municipio -->
    <q-select
  v-model="form.municipality_id"
  :options="municipalityOptions"
  label="Municipio"
  outlined
  dense
  emit-value
  map-options
/>

<q-btn label="Guardar Cliente" @click="saveCustomer" type="submit" color="primary" class="q-mt-md" />
</q-form>

</q-card>
      </q-card>
    </q-dialog>
      
          </q-toolbar>
        </template>
      </q-table>
    </q-page>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue';
  import { getData, } from '../services/apiClient';
  import { backgetData, backpostData, backputData } from '../services/backClient';
  
  const clientes = ref([]);
  const dialog = ref(false);
  const maximizedToggle = ref(true);
  const municipalityOptions = ref([]);

  const columns = [
    { name: 'identification', required: true, label: 'Identificación', align: 'left', field: row => row.identification, sortable: true },
    { name: 'names', required: true, label: 'Nombre', align: 'left', field: row => row.company || row.names, sortable: true },
    { name: 'municipality_id', label: 'Ciudad', align: 'left', field: row => row.municipality_id, sortable: true },
    { name: 'email', label: 'Correo Electrónico', align: 'left', field: row => row.email, sortable: true },
    { name: 'phone', label: 'Teléfono', align: 'left', field: row => row.phone, sortable: true },
    { name: 'address', label: 'Dirección', align: 'left', field: row => row.address, sortable: true },
  ];
  
  async function getDatafromAPI() {
    try {
      const response = await backgetData ('customer'); 
      clientes.value = response;
      console.log(response);
    } catch (error) {
      console.error('Error cargando clientes:', error);
    }
  }

  const form = ref({
    legal_organization_id: null,
    identification: '',
    dv: '',
    company: '',
    trade_name: '',
    names: '',
    address: '',
    email: '',
    phone: '',
    tribute_id: '',
    identification_document_id: null,
    municipality_id: null
  });


  const openDialog = () => {
    form.value = {  
      identification: '',
    dv: '',
    company: '',
    trade_name: '',
    names: '',
    address: '',
    email: '',
    phone: '',
    legal_organization_id: '',
    tribute_id: '',
    identification_document_id: '',
    municipality_id: null
    };
    dialog.value = true;
  };

const organizationTypes = [
  { id: 1, name: 'Persona Jurídica' },
  { id: 2, name: 'Persona Natural' },
]

const tributeOptions = ref([
  { label: 'IVA', value: 18 },
  { label: 'No aplica', value: 21 }
]);

const documentTypeOptions = ref([
{ label: 'Registro civil', value: 1 },
  { label: 'Tarjeta de identidad', value: 2 },
  { label: 'Cédula de ciudadanía', value: 3 },
  { label: 'Tarjeta de extranjería', value: 4 },
  { label: 'Cédula de extranjería', value: 5 },
  { label: 'NIT', value: 6 },
  { label: 'Pasaporte', value: 7 },
  { label: 'Documento de identificación extranjero', value: 8 },
  { label: 'PEP', value: 9 },
  { label: 'NIT otro país', value: 10 },
  { label: 'NUIP', value: 11 }
]);

const handleOrganizationChange = ()=>{
  if (form.legal_organization_id === 1) {
     // Si es Persona Jurídica, vaciar el campo 'names'
     form.value.names = '';
  } else {
    // Si es Persona Natural, vaciar campos de empresa y nombre comercial
    form.value.company = '';
    form.value.trade_name = '';
  } }

  const saveCustomer = async () => {
    form.value.identification = String(form.value.identification);
    form.value.municipality_id = Number(form.value.municipality_id);
    form.value.legal_organization_id = Number(form.value.legal_organization_id);
    form.value.tribute_id = Number(form.value.tribute_id);
    form.value.address = String(form.value.address);
    form.value.email = String(form.value.email);
    form.value.phone = String(form.value.phone);
    form.value.names = String(form.value.names);
    form.value.company = String(form.value.company);
    form.value.trade_name = String(form.value.trade_name);
    form.value.identification_document_id = Number(form.value.identification_document_id);

    
    
    try {
      console.log('📤 Datos antes de enviar:', JSON.stringify(form.value));

    if (!form.value.municipality_id) {
      console.error('❌ Error: municipality_id está vacío o undefined.');
      return; // Evita que se envíe la petición con datos incompletos
    }
      console.log(form.value);
      const response = await backpostData('customer', form.value);
      console.log(response);
      await getDatafromAPI();
      
    } catch (error) {
      console.error('Error al guardar cliente:', error);
    }
  }


  //endpoints

  

  const fetchMunicipalityOptions = async () => {
    try {
    
      const response = await getData('/v1/municipalities?name=&code=');
      if (response.data && Array.isArray(response.data)) {
        municipalityOptions.value = response.data.map(item => ({
          label: item.name,
          value: item.id
        }));
      } else {
        console.error('❌ Estructura inesperada en la respuesta:', response.data);
      }
    } catch (error) {
      console.error('❌ Error al obtener los datos:', error);
    }
  };

 

 
  
 onMounted(async() => {
  getDatafromAPI();
  fetchMunicipalityOptions();
 });
  </script>
    