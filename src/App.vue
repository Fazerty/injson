<template>
  <v-app>
    <MainToolbar></MainToolbar>
    <v-navigation-drawer app :mini-variant="appData.miniVariant" :clipped="appData.clipped" v-model="appData.drawer">    
          <ProjectList></ProjectList>
    </v-navigation-drawer>
    <v-content>
      <router-view/>
    </v-content>

    <v-footer :fixed="appData.fixed" app>
      <span>&copy; 2018</span>
    </v-footer>

  </v-app>
  
</template>

<script lang="ts">
import { Component } from 'vue-property-decorator';
import MainToolbar from '@/components/MainToolbar.vue';
import ProjectList from '@/components/ProjectList.vue';
import Vue from 'vue';

@Component<App>({
    name: 'App',
    components: {
        MainToolbar,
        ProjectList
    },
    data(): any {
        return {
            appData: this.$store.state.app
        };
    }
})
export default class App extends Vue {}
</script>
