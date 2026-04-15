import { createApp } from 'vue'
import App from './app/App.vue'
import './assets/styles/global/main.css'
import './assets/styles/global/main.scss'
import { createPinia } from 'pinia'

import router from './app/router/router';
import { setupRouterGuards } from './app/router/router.guard';

const pinia = createPinia();

setupRouterGuards(router);

createApp(App).use(router).use(pinia).mount('#app')
