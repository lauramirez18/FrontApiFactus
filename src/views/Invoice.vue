<template>
    <div class="q-pa-md">

        <q-table
            flat
            bordered
            title="Facturas"
            :rows="rows"
            :columns="columns"
            row-key="id"
            v-model:pagination="pagination"
            :rows-per-page-options="[10, 20, 50]"
          ></q-table>

    </div>
</template>
<script setup>
import { ref, onMounted } from 'vue'
import { getData } from '../services/apiClient'

const rows = ref([])
const pagination = ref({ page: 1, rowsPerPage: 10 })
const columns = [
    {name: 'createdAt', label: 'Fecha de Elaboración', align: 'left', field: row => row.createdAt, sortable: true},
    { name: 'reference_code', label: 'Código', align: 'left', field: row => row.reference_code, sortable: true },
    { name: 'name', label: 'Producto', align: 'left', field: row => row.name, sortable: true },
    { name: 'unit_measure_id', label: 'Unidad', align: 'left', field: row => row.unit_measure_id, sortable: true },
    { name: 'price', label: 'Precio', align: 'right', field: row => row.price, sortable: true },
    { name: 'tax_rate', label: 'Impuestos', align: 'right', field: row => row.tax_rate, sortable: true },
    { name: 'estado', label: 'Estado', align: 'center', field: row => row.estado, sortable: true },
    { name: 'actions', label: 'Acciones', align: 'center' }
]

async function getDatafromAPI() {
    try {
        const response = await getData('http://localhost:3991/api/invoice')
        rows.value = response
        console.log(response)
    } catch (error) {
        console.error('Error al obtener los datos:', error)
    }
}

onMounted(async () => {
    getDatafromAPI()
})
</script>