<template>
  <v-app>
    <MainToolbar></MainToolbar>
    <v-navigation-drawer app :mini-variant="appData.miniVariant" :clipped="appData.clipped" v-model="appData.drawer">    
          <ProjectList></ProjectList>
    </v-navigation-drawer>
    <v-content>
      <HelloWorld/>
    </v-content>

    <v-footer :fixed="appData.fixed" app>
      <span>&copy; 2018</span>
    </v-footer>

  </v-app>
  
</template>

<script lang="ts">
import HelloWorld from './components/HelloWorld.vue';
import MainToolbar from '@/components/MainToolbar.vue';
import ProjectList from '@/components/ProjectList.vue';
import { ExtVue } from '@/plugins/extVue';

export default {
  name: 'App',
  components: {
    HelloWorld,
    MainToolbar,
    ProjectList,
  },
  data(this: ExtVue): any {
    return {
      appData: this.$store.state.app,
    };
  },
  
};
</script>
