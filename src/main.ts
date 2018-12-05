import '@babel/polyfill';
import Vue from 'vue';
import './plugins/vuetify';
import App from './App.vue';
import router from '@/plugins/router';
import store from '@/plugins/store/store';
import 'roboto-fontface/css/roboto/roboto-fontface.css';
import 'material-design-icons-iconfont/dist/material-design-icons.css';
import i18n from './plugins/i18n';
import 'reflect-metadata';

Vue.config.productionTip = false;

new Vue({
    router,
    store,
    i18n,
    render: (h: any) => h(App)
}).$mount('#app');
