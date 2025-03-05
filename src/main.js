import { createApp } from 'vue'
import { createPinia } from 'pinia'
import './style.css'
import App from './App.vue'
import { Quasar } from 'quasar'
import 'quasar/src/css/index.sass'
import  piniaPluginPersistedState  from 'pinia-plugin-persistedstate'
import { router } from './router/routes'
import { Notify } from 'quasar'
import '@quasar/extras/material-icons/material-icons.css'

const pinia = createPinia() 
pinia.use(piniaPluginPersistedState)
const app = createApp(App)
app.use(Quasar, {
    plugins: {
      Notify
    },
    config: {
      notify: {
        timeout: 5000,
        position: 'top',
        classes: 'bg-blue-grey-9 text-white',
        textColor: 'white',
        actions: [{ icon: 'close', color: 'white' }]
      }
    }
  })
app.use(pinia)
app.use(router)
app.mount('#app')
