import { createApp } from 'vue'
import App from './app/App.vue'
import './assets/styles/global/main.css'
import './assets/styles/global/main.scss'

import router from './app/router/router';

createApp(App).use(router).mount('#app')
