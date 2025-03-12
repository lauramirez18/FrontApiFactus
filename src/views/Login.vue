<template>
  <q-page class="row items-center justify-center full-height">
    <div class="container-login" data-v-ccca2500="true">
      <div class="banner-component" data-v-ccca2500="true">
        <div data-v-25e250e8="true">
          <div class="banner" data-v-25e250e8="true">
            <img src="/logo.png" alt="Logo"  />
          </div>
        </div>

      </div>

      <div class="content-panel" data-v-ccca2500="true">
        <div data-v-fad7408b="true">
        </div>
        <form @submit.prevent="login">
          <div data-v-fad7408b="true" class="login">
            <div data-v-fad7408b="true" class="card">
              <h4 data-v-fad7408b="true">Iniciar Sesión</h4>
              <span data-v-fad7408b="true" style="font-size: 14px;">¿Aún no tienes una cuenta?
                <a data-v-fad7408b="true" href="#">Registrate</a>
              </span>
              <div class="py-3 mt -4" data-v-fad7408b="true">
                <q-input v-model="email" outlined label="Correo Electrónico"  class="q-mb-md" dense
                :rules="[ val => !!val || 'Este campo es obligatorio', val => /.+@.+\..+/.test(val) || 'Ingrese un correo válido']">
                  <template v-slot:prepend>
                    <q-icon name="mail" />
                  </template>

                </q-input>
              </div>
              <div class="py-3 mt -4" data-v-fad7408b="true" >
                <q-input
                 v-model="password" 
                 outlined
                  label="Contraseña"
                  :type="isPwd ? 'password' : 'text'"
                 type="password"
                class="q-mb-md"
                 dense
                 :rules="[ val => !!val || 'Este campo es obligatorio']">
                  <template v-slot:prepend>
                    <q-icon name="lock" />
                  </template>
                  <template v-slot:append>
    <q-icon :name="isPwd ? 'visibility_off' : 'visibility'" @click="isPwd = !isPwd" class="cursor-pointer" />
  </template>
                </q-input>

                <p v-if="errorMessage" class="text-negative q-mt-md">{{ errorMessage }}</p>

                <div class="flex flex-justify-end" data-v-fad7408b="true">
                  <a data-v-fad7408b="true" href="#" style="font-size: 13px;">¿Olvidaste tu contraseña?</a>
                </div>
              </div>
              <q-btn id="btn-login" 
              data-v-fad7408b="true"
               class="col-12 m-0 py-3 btn-login" 
                type="submit"
                 color="primary-green"
                  :loading="loading"
                  :disable="!email || !password">Ingresar</q-btn>
              <p class="finish-term" data-v-fad7408b="true">Al hacer clic en ingresar, estas aceptando nuestros
                <a data-v-fad7408b="true" href="#">Términos y condiciones de servicios</a>
                y estas aceptando nuestra
                <a data-v-fad7408b="true" href="#">Política de privacidad de datos</a>.
              </p>
            </div>
          </div>
        </form>
      </div>
    </div>




  </q-page>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { postData } from '../services/apiClient'
import { useAuth } from '../store/useAuth'


const store = useAuth()
const router = useRouter()
const email = ref('')
const password = ref('')
const loading = ref(false)
const isPwd = ref(true)
const errorMessage = ref('')

const login = async () => {
  loading.value = true
  errorMessage.value = ''
  const data = {
    username: email.value,
    password: password.value,
    grant_type: 'password',
    client_id: '9e2e167b-d588-44ee-b5e0-f1244880aed6',
    client_secret: 'wlLUQU1FzTQvUp7KUndhj3I8L1ydlNxVjFtMuNRQ'
  }
  try {
    const response = await postData('/oauth/token', data)
    console.log('Respuesta recibida:', response)
    if (response.access_token && response.refresh_token) {
  store.set_Token_RefreshToken(response.access_token, response.refresh_token)
  router.replace('/home');
  store.setUserName(email.value);
} else {
  errorMessage.value = 'Credenciales incorrectas'
}
 } catch (error) {
   errorMessage.value = 'Credenciales incorrectas'
  }
  loading.value = false
}
</script>

<style scoped>
*{
  margin: 0%;
  box-sizing: border-box;
  font-family: 'NunitSans', sans-serif;
  
 
}
.container-login {
  align-items: center;
  display: flex;
  flex-direction: row;
  height: 100vh;
  justify-content: center;
  width: 100%;
}

.container-login .banner-component[data-v-ccca2500] {
  height: auto;
  width: 51%;
}

.banner[data-v-25e250e8] {
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
 
}

form {
  display: block;

}

.login {
  width: 100%;
  max-width: 389px;
  margin: auto;
  padding: 20px;
  border-radius: 5px;
  background-color: #fff;
  ;
}

.login .card {
  display: flex;
  flex-direction: column;
  padding: 30px;
  border-radius: 4px;
  background-color: #fff;
  border: 1px solid #eee;
}



.login .card h4 {
  color: #37465a;
  font-size: 24px;
  font-weight: 800;
  line-height: 25px;
  margin-bottom: 10px;
  font-family: NunitSans, sans-serif;
}

.login a {
  color: #007bff;
  cursor: pointer;
  text-decoration: none;
  font-weight: 700;
}

.flex-justify-end[data-v-fad7408b] {
  justify-content: flex-end;
}

.flex-justify-end[data-v-fad7408b] {
  justify-content: flex;
}


#btn-login[data-v-fad7408b] {
  align-items: center;
  background-color: #007bff;
  border: none;
  display: flex;
  color: #fff;
  border-radius: 6px;
  padding: 10px 20px ;
  font-size: 14px;
  font-weight: 700;
  height: 32px;
  justify-content: center;
  line-height: 26px;
  max-width: 100%;
  overflow: hidden;
  text-transform: uppercase;
  transition: all 0.3s ease;
  cursor: pointer;
}

.finish-term {
  border-top: 1px solid #eee;
  padding-top: 30px;
  font-size: 12px;
  color: #6c757d;
  letter-spacing: 0;
  line-height: 16px;
}


@media (min-width:0) {
  .mt-4[data-v-fad7408b] {
    margin-top: 16px !important;
  }
}

@media (min-width: 0) {
  .py-3[data-v-fad7408b] {
    padding-bottom: 12px !important;
    padding-top: 12px !important;
  }
}



@media screen and (max-width: 768px) {
  .container-login .banner-component[data-v-ccca2500] {
    display: none;
  }
}

@media screen and (max-width: 768px) {
  .container-login[data-v-ccca2500] {
    background: rgb(0,220,230);
    background: radial-gradient(circle, rgba(0,220,230,1) 0%, rgba(0,123,240,1) 50%);

  }
}
</style>