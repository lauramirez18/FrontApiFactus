<template>
    <q-page class="row items-center justify-center full-height">
      <div class="row q-pa-md full-width" style="max-width: 1200px; height: 600px;">
        <div class="col-6 flex flex-center hide-on-mobile" id="imagenLogo">
          <img src="/src/assets/logo.png" alt="Logo" style="max-width: 80%; height: auto;" />
        </div>
        <div class="col-12 col-sm-6 flex flex-center">
          <div class="q-pa-md q-gutter-md" style="width: 400px; max-width: 80vw">
            <q-card flat bordered>
              <q-card-section class=" text-white" style="background-color: rgb(10, 92, 113)">
                <div class="text-h6">Inicio de sesión</div>
                <div class="text-subtitle2">¿Aún no tienes una cuenta? <a href="#" class="text-white">Créala aquí</a></div>
              </q-card-section>
  
              <q-card-section>
                <q-form @submit.prevent="onSubmit" class="q-gutter-md">
                  <q-input v-model="username" label="Usuario" filled lazy-rules :rules="[val => !!val || 'Campo obligatorio']" />
                  <q-input v-model="password" label="Contraseña" filled type="password" lazy-rules="[val => !!val || 'Campo obligatorio']" />
  
                  <div class="row items-center q-gutter-sm">
                    <q-btn type="submit" style="background-color: rgb(10, 92, 113); color: white;" label="Ingresar" class="full-width" />
                    <q-btn flat label="¿Olvidaste tu contraseña?" to="/recover" style="color: rgb(10, 92, 113);" />
                  </div>
                </q-form>
              </q-card-section>
  
              <q-card-section class="text-caption text-grey">
                Al hacer clic en ingresar, estás aceptando nuestros <a href="#"  style="color: rgb(10, 92, 113);">Términos y condiciones de servicio</a> y nuestra <a href="#" style="color: rgb(10, 92, 113);">Política de privacidad de datos</a>.
              </q-card-section>
            </q-card>
          </div>
        </div>
      </div>
    </q-page>
  </template>
  
  <script setup>
  import { ref } from 'vue';
  const username = ref('');
  const password = ref('');
  const onSubmit = () => {
    if (username.value && password.value) {
      alert('Inicio de sesión exitoso!');
    } else {
      alert('Por favor, complete todos los campos.');
    }
  };
  </script>
  
  <style scoped>
  a {
    text-decoration: none;
  }
  #imagenLogo {
    background-color: rgb(10, 92, 113);
  }

  @media (max-width: 600px) {
  .hide-on-mobile {
    display: none;
  }
}
  </style>
  