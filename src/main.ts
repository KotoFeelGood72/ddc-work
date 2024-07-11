import { createApp } from 'vue';
import { createPinia } from 'pinia';
import {router} from './router'
import App from './App.vue';
import 'virtual:svg-icons-register';
import SvgIcon from './components/ui/icons/SvgIcon.vue';
import heading from './components/ui/text/heading.vue';
import text from './components/ui/text/text.vue';
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'


const vuetify = createVuetify({
    components,
    directives,
    ssr: true,
})
const pinia = createPinia();
const app = createApp(App);

pinia.use(piniaPluginPersistedstate)

app.component('SvgIcon', SvgIcon)
app.component('heading', heading)
app.component('v-text', text)
app.use(pinia);
app.use(vuetify);
app.use(router);
app.mount('#app');


