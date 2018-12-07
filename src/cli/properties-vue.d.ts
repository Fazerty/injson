import Vue from 'vue';
import { Store } from 'vuex';

declare module 'vue/types/vue' {
  // 3. Déclarez l'augmentation pour Vue
  interface Vue {
    $store: Store<any>,
    $electron: any;
  }
}