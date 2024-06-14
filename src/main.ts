import { createApp } from 'vue';
import { createPinia } from 'pinia';
import SvgIcon from './components/ui/icons/SvgIcon.vue';
import {router} from './router'
import App from './App.vue';
import 'virtual:svg-icons-register';

const pinia = createPinia();
const app = createApp(App);


app.component('SvgIcon', SvgIcon)
app.use(pinia);
app.use(router);
app.mount('#app');


