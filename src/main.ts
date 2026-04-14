import { createApp } from 'vue'
import App from './app/App.vue'
import './assets/styles/global/main.css'
import './assets/styles/global/main.scss'
import { createPinia } from 'pinia'

import router from './app/router/router';

const pinia = createPinia();

createApp(App).use(router).use(pinia).mount('#app')
