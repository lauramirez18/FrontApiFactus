<template>
    <div class="q-page-container">
        <div class="title">
         <p class="text-h4 text-weight-bold text-center q-mb-md">Bienvenido a Factus</p>
        <p class="text-subtitle1 text-center q-mb-xl">Factus es una aplicación de gestión de facturación para empresas
        </p>
        <hr>   
        </div>

        <div class="dashboard-container">
            <div>
                <div class="block">
                    <div class="card" @click="goToRoute('/invoice')">
                        <div class="icon-card">
                            <q-img class="my-card-img" src="https://cdn-icons-png.flaticon.com/512/11506/11506005.png"
                                alt="icon"></q-img>
                        </div>
                        <p class="card-content">Crea una factura electrónica</p>
                    </div>
                    <div class="card" @click="goToRoute('/support')">
                        <div class="icon-card">
                            <q-img class="my-card-img" src="https://cdn-icons-png.flaticon.com/512/10365/10365352.png"
                                alt="icon"></q-img>
                        </div>
                        <p class="card-content">Crea un Documento Soporte</p>
                    </div>
                    <div class="card" @click="goToRoute('/product')">
                        <div class="icon-card">
                            <q-img class="my-card-img" src="https://cdn-icons-png.flaticon.com/512/5404/5404556.png"
                                alt="icon"></q-img>
                        </div>
                        <p class="card-content">Crea un Producto o Servicio</p>
                    </div>
                    <div class="card" @click="goToRoute('/customer')">
                        <div class="icon-card">
                            <q-img class="my-card-img" src="https://cdn-icons-png.flaticon.com/512/686/686379.png"
                                alt="icon"></q-img>
                        </div>
                        <p class="card-content">Crea un cliente</p>
                    </div>
                </div>
            </div>

        </div>
    </div>
</template>

<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()

const goToRoute = (path) => {
    router.push(path)
}
</script>

<style scoped>
.dashboard-container {
    display: flex;


}

.q-page-container {
    display: flex;
   flex-direction: column;
}

.block {
    display: flex;
    flex-wrap: wrap;

}

.card {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    background: white;
    border-radius: 10px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    padding: 20px;
    width: 200px;
    transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.card:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
}

.icon-card {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 64px;
    height: 64px;
    border-radius: 50%;
    background: #f0f0f0;
}

.my-card-img {
    width: 48px;
    height: 48px;
}

.card-content {
    color: #37465a;
    font-size: 14px;
    font-weight: 700;
    margin-top: 10px;
    text-align: center;
    background-color: aliceblue;
}
</style>