<template>
    <div class="q-pa-md">
      <!-- Botón para abrir el modal -->
       <h4>Facturas</h4>
       <hr>
       <div class="tittle">
      <q-input v-model="search" placeholder="Buscar producto" outlined dense clearable>
        <template v-slot:append>
          <q-btn flat icon="search" @click="getDatafromAPI" />
        </template>
      </q-input>

      <div class="add">
        <q-btn label="Crear" icon="add" @click="showModal = true" class="crear"
          style="background-color: #007bff; color: white; border-radius: 6px; padding: 10px 20px; font-weight: 600;" />
      </div>
    </div>
  
      <!-- Tabla de Facturas -->
      <q-table
        flat
        bordered
        :rows="rows"
        :columns="columns"
        row-key="id"
        v-model:pagination="pagination"
        :rows-per-page-options="[10, 20, 50]"
      >
      <template v-slot:header="props">
          <tr>
            <th v-for="col in props.cols" :key="col.name" :class="'tabla-header'">
              <span>{{ col.label }}</span>
            </th>
          </tr>
        </template>
        <template v-slot:body-cell-actions="props">
          <q-td :props="props">
            <q-btn size="sm" color="primary" icon="visibility" @click="viewInvoice(props.row)" />
          </q-td>
        </template>
      </q-table>
  
      <!-- Modal de Registro de Factura -->
      <q-dialog v-model="showModal" maximized>
        <q-card>
          <q-card-section class="row items-center justify-between bg-primary text-white">
            <div class="text-h6">Registrar Factura</div>
            <q-btn icon="close" flat dense @click="showModal = false" />
          </q-card-section>
  
          <q-card-section>
            <q-form @submit.prevent="submitInvoice">
              <div class="row q-col-gutter-md">
                <q-input v-model="invoice.numbering_range_id" label="Número de Rango" type="number" class="col-6" outlined />
                <q-input v-model="invoice.reference_code" label="Código de Referencia" class="col-6" outlined />
              </div>
  
              <q-input v-model="invoice.observation" label="Observaciones" type="textarea" class="q-mt-md" outlined />
  
              <div class="row q-col-gutter-md q-mt-md">
                <q-input v-model="invoice.payment_form.method" label="Forma de Pago" class="col-6" outlined />
                <q-input v-model="invoice.payment_form.installments" label="Cuotas" type="number" class="col-6" outlined />
              </div>
  
              <div class="row q-col-gutter-md q-mt-md">
                <q-input v-model="invoice.payment_due_date" label="Fecha de Vencimiento" type="date" class="col-6" outlined />
                <q-input v-model="invoice.payment_method_code" label="Código de Método de Pago" class="col-6" outlined />
              </div>
  
              <div class="row q-col-gutter-md q-mt-md">
                <q-input v-model="invoice.billing_period.start_date" label="Inicio Facturación" type="date" class="col-6" outlined />
                <q-input v-model="invoice.billing_period.start_time" label="Hora Inicio" type="time" class="col-6" outlined />
              </div>
  
              <div class="row q-col-gutter-md q-mt-md">
                <q-input v-model="invoice.billing_period.end_date" label="Fin Facturación" type="date" class="col-6" outlined />
                <q-input v-model="invoice.billing_period.end_time" label="Hora Fin" type="time" class="col-6" outlined />
              </div>
  
              <q-select 
                v-model="invoice.customer" 
                :options="customers" 
                label="names"
                option-value="_id" 
                option-label="names"
                emit-value 
                map-options 
                class="q-mt-md" 
                outlined
                @update:model-value="setCustomerDetails"
              />
              <div class="row q-col-gutter-md">
              <q-input v-model="invoice.customer_email" label="Email" class="col-6" outlined disable />
              <q-input v-model="invoice.customer_phone" label="Teléfono" class="col-6" outlined disable />
            </div>
  
              <q-select 
                v-model="selectedProductId" 
                :options="products" 
                label="Productos" 
                option-value="_id" 
                option-label="name" 
                multiple 
                emit-value 
                map-options 
                class="q-mt-md" 
                outlined
                @update:model-value="setProductDetails"
              />
              <div class="row q-col-gutter-md">
              <q-input v-model="invoice.product_price" label="Precio" class="col-4" outlined disable />
              <q-input v-model="invoice.product_tax" label="Impuesto" class="col-4" outlined disable />
              <q-input v-model="invoice.product_quantity" label="Cantidad" type="number" class="col-4" outlined />
            </div>
  
              <q-btn type="submit" label="Registrar Factura" color="primary" class="q-mt-md full-width" @click="submitInvoice" />
            </q-form>
          </q-card-section>
        </q-card>
      </q-dialog>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted } from "vue";
  import { getData } from "../services/apiClient";
  import { backgetData, backpostData } from "../services/backClient";
  
  const showModal = ref(false);
  const selectedProductId = ref(null);

  const invoice = ref({
  numbering_range_id: null,
  reference_code: "",
  observation: "",
  payment_form: { method: "", installments: 1 },
  payment_due_date: "",
  payment_method_code: "",
  billing_period: { start_date: "", start_time: "", end_date: "", end_time: "" },
  customer: null,
  customer_email: "",
  customer_phone: "",
  products: [],
  product_price: "",
  product_tax: "",
  product_quantity: 1
});
  
  const rows = ref([]);
  const pagination = ref({ page: 1, rowsPerPage: 10 });
  
  const columns = [
    { name: "createdAt", label: "Fecha de Elaboración", align: "center", field: row => row.createdAt, sortable: true },
    { name: "reference_code", label: "Código", align: "center", field: row => row.reference_code, sortable: true },
    { name: "identification", label: "Identificación", align: "center", field: row => row.identification, sortable: true },
    { name: "actions", label: "Acciones", align: "center" }
  ];
  
  const customers = ref([]);
  const products = ref([ ]);
  
  async function getDatafromAPI() {
    try {
      const invoiceResponse = await backgetData("invoice");
      rows.value = invoiceResponse;

      const customerResponse = await backgetData("customer");
      customers.value = customerResponse;

      const productResponse = await backgetData("product");
      products.value = productResponse;
    } catch (error) {
      console.error("Error al obtener los datos:", error);
    }
  }

  const submitInvoice = async () => {
    try {
      const response = await backpostData("invoice", invoice.value);
      console.log(response);
      showModal.value = false;
      await getDatafromAPI();
    } catch (error) {
      console.error("Error al guardar factura:", error);
    }
  };

  
  function viewInvoice(invoiceData) {
    console.log("Ver factura:", invoiceData);
  }
  
  onMounted(() => {
    getDatafromAPI();
  });
  </script>

  <style scoped>
   *{
  margin: 0%;
  box-sizing: border-box;
  font-family: 'NunitSans', sans-serif;
  font-size: 11px;


}
.tittle {
  text-align: center;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  margin: 20px;

}

h4 {

  color: #37465a;
  font-size: 24px;
  font-weight: 800;
  line-height: 25px;
  margin-bottom: 10px;
  font-family: NunitSans, sans-serif;
  text-align: center;
}

.tabla-header {
  font-weight: bold;
  text-transform: uppercase;
  background-color: #007bff;
  color: white;
  padding: 12px;
  text-align: center;
}
</style>
  