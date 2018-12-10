import '@babel/polyfill';
import Vue from 'vue';
import '@/cli/plugins/vuetify';
import App from '@/cli/components/App.vue';
import router from '@/cli/plugins/router';
import 'roboto-fontface/css/roboto/roboto-fontface.css';
import 'material-design-icons-iconfont/dist/material-design-icons.css';
import i18n from '@/cli/plugins/i18n';
import store from '@/cli/plugins/store/store';
import '@/cli/services/cliRenderers';
import VueElectron from 'vue-electron';
import LiquorTree from 'liquor-tree';

Vue.config.productionTip = false;

Vue.use(VueElectron);

// global registration
Vue.use(LiquorTree);

new Vue({
    router,
    store,
    i18n,
    render: (h: any) => h(App)
}).$mount('#app');
