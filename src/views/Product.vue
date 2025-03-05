<template>
    <q-page class="q-pa-md">
      <h4>Productos</h4>
      <q-card>
        <q-card-section class="row items-center q-gutter-md">
          <q-input v-model="search" placeholder="Buscar producto" outlined dense clearable>
            <template v-slot:append>
              <q-btn flat icon="search" @click="getDatafromAPI" />
            </template>
          </q-input>
        
          <q-btn color="blue" label="Descargar Excel" icon="download" />
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
        <div class="text-h6 text-primary">Registrar Producto</div>
      </q-card-section>

     <q-form  class="q-gutter-md">
        <q-input
          v-model="form.code_reference"
          label="Código de Referencia"
          outlined
          dense
          lazy-rules
          :rules="[val => !!val || 'Este campo es requerido']"
        />
        <q-input 
          v-model="form.name"
          label="Nombre del Producto"
          outlined dense lazy-rules :rules="[val => !!val || 'Este campo es requerido']" />

        <q-input
        v-model="form.price"
        label="Precio"
        outlined
         dense
         prefix="$"
          lazy-rules
           :rules="[val => !!val || 'Este campo es requerido']" />

        <q-input
        v-model="form.tax_rate"
        label="Tasa de Impuesto (%)"
        outlined
        dense 
        type="number"
        suffix="%"
        lazy-rules :rules="[val => !!val || 'Este campo es requerido']" />

        <q-select
          v-model="form.unit_measure_id"
          :options="unitOptions"
          label="Unidad de Medida"
          emit-value
          map-options
          outlined dense lazy-rules :rules="[val => !!val || 'Este campo es requerido']" />

          
        
        <q-select
          v-model="form.standard_code_id"
          :options="standardCodeOptions"
          option-label="name"
          option-value="name"
          emit-value
          map-options
          label="Codigo Estándar"
          outlined dense lazy-rules :rules="[val => !!val || 'Este campo es requerido']" />


          <q-toggle v-model="form.is_excluded" label="Está Excluido" color="primary" />

        <q-select
          v-model="form.tribute_id"
          :options="tributeOptions"
          map-options
          emit-value
          label="Tributo"
          outlined dense lazy-rules :rules="[val => !!val || 'Este campo es requerido']" />

          <div class="text-subtitle1 text-weight-bold">Impuestos Retenidos</div>
        <q-list bordered class="q-mb-md">
          <q-item v-for="(tax, index) in form.withholding_taxes" :key="index">
            <q-item-section>
              <q-input
                v-model="tax.code"
                label="Código de Retención"
                dense
                outlined
              />
            </q-item-section>
            <q-item-section>
              <q-input
                v-model="tax.withholding_tax_rate"
                label="Tasa de Retención (%)"
                dense
                outlined
                type="number"
                suffix="%"
              />
            </q-item-section>
            <q-item-section side>
              <q-btn icon="delete" color="red" dense flat @click="removeTax(index)" />
            </q-item-section>
          </q-item>
        </q-list>

        <q-btn icon="add" color="primary" label="Añadir Retención" @click="addTax" flat />

<q-card-actions align="right">
  <q-btn label="Cancelar" color="grey" flat @click="resetForm" />
  <q-btn type="submit" label="Guardar" color="primary" unelevated @click="saveProduct" />
</q-card-actions>
</q-form>
</q-card>
      </q-card>
    </q-dialog>
        </q-card-section>
        
        <q-table
          flat bordered
          :rows="rows"
          :columns="columns"
          row-key="id"
          v-model:pagination="pagination"
          :rows-per-page-options="[10, 20, 50]"
        >
          <template v-slot:body-cell-estado="props">
            <q-td :props="props">
              <q-badge color="green" v-if="props.row.estado === 'Activo'">Activo</q-badge>
              <q-badge color="red" v-else>Inactivo</q-badge>
            </q-td>
          </template>
          <template v-slot:body-cell-actions="props">
            <q-td :props="props">
              <q-btn color="primary" dense flat label="Editar" @click="editItem(props.row)" />
            </q-td>
          </template>
        </q-table>
      </q-card>
    </q-page>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue';
  import { getData, } from '../services/apiClient';
  import { backgetData, backpostData, backputData } from '../services/backClient';
  import { Notify } from 'quasar';

  const search = ref('');
  const rows = ref([]);
  const pagination = ref({ page: 1, rowsPerPage: 10 });
  const dialog = ref(false);
  const maximizedToggle = ref(true);
  const unitOptions = ref([]);
  const tributeOptions = ref([]);
  const retentionOptions = ref([]);

  const openDialog = () => {
  form.value = {  
    code_reference: '',
    name: '',
    price: null,
    tax_rate: null,
    unit_measure_id: '',
    standard_code_id: '',
    is_excluded: false,
    tribute_id: '',
    withholding_taxes: []
  };
  dialog.value = true;
};
  
  const columns = [
    { name: 'code_reference', label: 'Código', align: 'left', field: row => row.code_reference, sortable: true },
    { name: 'name', label: 'Producto', align: 'left', field: row => row.name, sortable: true },
    { name: 'unit_measure_id', label: 'Unidad', align: 'left', field: row => row.unit_measure_id, sortable: true },
    { name: 'price', label: 'Precio', align: 'right', field: row => row.price, sortable: true },
    { name: 'tax_rate', label: 'Impuestos', align: 'right', field: row => row.tax_rate, sortable: true },
    { name: 'actions', label: 'Acciones', align: 'center' }
  ];

  const form = ref({
  code_reference: '',
  name: '',
  price: 0,
  tax_rate: 0,
  unit_measure_id: null,  
  standard_code_id: null,
  is_excluded: false,
  tribute_id: null,
  withholding_taxes: []
});



const addTax = () => {
  form.value.withholding_taxes.push({ code: '', withholding_tax_rate: null });
};

const removeTax = (index) => {
  form.value.withholding_taxes.splice(index, 1);
};


const resetForm = () => {
  form.value = {
    code_reference: '',
    name: '',
    price: null,
    tax_rate: null,
    unit_measure_id: '',
    standard_code_id: '',
    is_excluded: false,
    tribute_id: '',
    withholding_taxes: []
  };
};
  async function getDatafromAPI(){
    try {
      const response = await backgetData ('product');
      rows.value = response;
      console.log(response);
    } catch (error) {
      console.error('Error al obtener los datos:', error);
    }
  }

 

  const saveProduct = async () => {
  form.value.price = Number(form.value.price);
  form.value.tax_rate = Number(form.value.tax_rate);
  form.value.unit_measure_id = String(form.value.unit_measure_id);
  form.value.standard_code_id = String(form.value.standard_code_id);
  form.value.tribute_id = String(form.value.tribute_id);
  
    try {
      console.log(form.value);
      const response = await backpostData('product', form.value); 
      console.log(response);

      Notify.create({
        message: 'Producto registrado exitosamente',
          color: 'green',
          icon: 'check_circle',
          position: 'top',
          timeout: 3000,
      })
      
    } catch (error) {
      console.error('Error al guardar producto:', error);
    }
  }



//*****endpoints


  const fetchUnitOptions = async () => {
  try {
    const response = await getData("/v1/measurement-units");

    if (response.data && Array.isArray(response.data)) {
      unitOptions.value = response.data.map(unit => ({
        label: unit.name, // Lo que se muestra en el select
        value: unit.name,   // El valor real de la opción
      
      }));
    } else {
      console.error(" Estructura inesperada en la respuesta:", response.data);
    }
  } catch (error) {
    console.error(" Error al obtener los datos:", error);
  }
};

const standardCodeOptions = ref([
  { id: 1, name: 'Estándar de adopción del contribuyente' },
  { id: 2, name: 'UNSPSC' },
  { id: 3, name: 'Partida Arancelaria' },
  { id: 4, name: 'GTIN' }
  ]);


const fetchTributeOptions = async () => {
  try {
    const response = await getData('/v1/tributes/products?name=&code=');
    
    if (response.data && Array.isArray(response.data)) {
      tributeOptions.value = response.data.map(item => ({
        label: `${item.code} - ${item.name}`, 
        value: item.name
      }));
    } else {
      console.error('❌ Estructura inesperada en la respuesta:', response.data);
    }
  } catch (error) {
    console.error('❌ Error al obtener los tributos:', error);
  }
};
  


  onMounted(async() => {
    getDatafromAPI();
   fetchUnitOptions();
   fetchTributeOptions();
  });


  

  
  
  

  </script>
  