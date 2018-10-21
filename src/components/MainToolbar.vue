<template>
    <v-toolbar app     
      color="secondary"
      dark
      fixed> 
      <v-toolbar-title v-text="title"></v-toolbar-title>
      <v-spacer></v-spacer>
      
      <v-btn flat icon color="white">
        <v-icon>remove</v-icon>
      </v-btn>
      <v-btn flat icon color="white">
        <v-icon>mdi-minimize</v-icon>
      </v-btn>    
      <v-btn flat icon color="white">
        <v-icon>close</v-icon>
      </v-btn>    
    </v-toolbar>

</template>
<script lang="ts">

import Component from 'vue-class-component';
import { ExtVue } from '@/plugins/extVue';

@Component<MainToolbar>({
  computed: {
  },
})
export default class MainToolbar extends ExtVue {

  private title: string = 'InJson';
}
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">

</style>