<template>
  <v-toolbar
    app
    color="secondary"
    dark
    fixed
    style="-webkit-app-region: drag"
    :clipped-left="appData.clipped"
  >
    <v-toolbar-side-icon @click.stop="appData.drawer = !appData.drawer" style="-webkit-app-region: no-drag">
      <v-icon>mdi-menu</v-icon>
    </v-toolbar-side-icon>

    <v-toolbar-title v-text="appData.title"></v-toolbar-title>
    <v-snackbar v-model="message.display" :multi-line="true" :timeout="message.timeout" :top="true">
      {{message.text}}
      <v-btn color="pink" flat @click="message.display = false">Close</v-btn>
    </v-snackbar>
    <v-spacer/>
    <v-btn flat icon color="white" style="-webkit-app-region: no-drag" @click="minimize()">
      <v-icon>mdi-window-minimize</v-icon>
    </v-btn>
    <v-btn flat icon color="white" style="-webkit-app-region: no-drag" @click="toogleMaximize()">
      <v-icon v-if="!maximized">mdi-window-maximize</v-icon>
      <v-icon v-if="maximized">mdi-window-restore</v-icon>
    </v-btn>
    <v-btn flat icon color="white" style="-webkit-app-region: no-drag" @click="closeApp()">
      <v-icon>mdi-window-close</v-icon>
    </v-btn>
  </v-toolbar>
</template>


<script lang="ts">
import Component from 'vue-class-component';
import Vue from 'vue';
import { remote, BrowserWindow } from 'electron';
import { mapGetters } from 'vuex';

@Component<MainToolbar>({
    components: {
    },
    computed: {
        ...mapGetters(['message', 'appData'])
    }
})
export default class MainToolbar extends Vue {
    private title: string = 'InJson';
    private bWindow: BrowserWindow = remote.getCurrentWindow();
    private maximized: boolean = this.bWindow.isMaximized();

    private closeApp() {
        this.bWindow.close();
    }
    private minimize() {
        this.bWindow.minimize();
    }
    private toogleMaximize() {
        if (!this.bWindow.isMaximized()) {
            this.bWindow.maximize();
            this.maximized = true;

            this.$store.commit('newMessage', 'Application Maximized');
        } else {
            this.bWindow.unmaximize();
            this.maximized = false;
        }
    }
}
</script>

<style scoped lang="scss">
</style>